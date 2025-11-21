#!/usr/bin/env node
/**
 * Fetch Home Depot store locations across the US using Places API (New) searchText.
 * - Loads GOOGLE_PLACES_API_KEY from .env.local (no dotenv dependency).
 * - Uses aggressive but bounded seed points (state centroids + major metros) with a large radius to cut API calls.
 * - Handles pagination via nextPageToken, rate limits to ~8 req/sec, retries on 429/5xx.
 * - Deduplicates by place id/address, maps to the StoreFinder shape, and writes data/home-depot-stores.json atomically.
 */

const fs = require("fs")
const path = require("path")

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// Minimal env loader for .env.local (keeps dependency-free)
function loadEnvLocal() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/)
      if (m) {
        const key = m[1]
        const value = m[2]
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }
  } catch (err) {
    // ignore missing
  }
}

loadEnvLocal()

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY. Add it to .env.local before running.")
  process.exit(1)
}

const FIELD_MASK =
  [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.shortFormattedAddress",
    "places.addressComponents",
    "places.location",
    "places.nationalPhoneNumber",
    "places.types",
    "places.primaryType",
    "places.businessStatus",
    "places.currentOpeningHours.weekdayDescriptions",
    "places.regularOpeningHours.weekdayDescriptions",
    "nextPageToken"
  ].join(",")
const ENDPOINT = "https://places.googleapis.com/v1/places:searchText"

// Seed points: state centroids + major metros to reduce overlap and total calls
const stateSeeds = [
  { name: "AK", lat: 64.2008, lng: -149.4937 },
  { name: "AL", lat: 32.8067, lng: -86.7911 },
  { name: "AZ", lat: 34.0489, lng: -111.0937 },
  { name: "AR", lat: 34.8959, lng: -92.4380 },
  { name: "CA", lat: 36.7783, lng: -119.4179 },
  { name: "CO", lat: 39.5501, lng: -105.7821 },
  { name: "CT", lat: 41.6032, lng: -73.0877 },
  { name: "DE", lat: 38.9108, lng: -75.5277 },
  { name: "FL", lat: 27.6648, lng: -81.5158 },
  { name: "GA", lat: 32.1656, lng: -82.9001 },
  { name: "ID", lat: 44.0682, lng: -114.7420 },
  { name: "IL", lat: 40.6331, lng: -89.3985 },
  { name: "IN", lat: 39.7684, lng: -86.1581 },
  { name: "IA", lat: 41.8780, lng: -93.0977 },
  { name: "KS", lat: 39.0119, lng: -98.4842 },
  { name: "KY", lat: 37.8393, lng: -84.2700 },
  { name: "LA", lat: 30.9843, lng: -91.9623 },
  { name: "ME", lat: 45.2538, lng: -69.4455 },
  { name: "MD", lat: 39.0458, lng: -76.6413 },
  { name: "MA", lat: 42.4072, lng: -71.3824 },
  { name: "MI", lat: 44.3148, lng: -85.6024 },
  { name: "MN", lat: 46.7296, lng: -94.6859 },
  { name: "MS", lat: 32.3547, lng: -89.3985 },
  { name: "MO", lat: 37.9643, lng: -91.8318 },
  { name: "MT", lat: 46.8797, lng: -110.3626 },
  { name: "NE", lat: 41.4925, lng: -99.9018 },
  { name: "NV", lat: 38.8026, lng: -116.4194 },
  { name: "NH", lat: 43.1939, lng: -71.5724 },
  { name: "NJ", lat: 40.0583, lng: -74.4057 },
  { name: "NM", lat: 34.5199, lng: -105.8701 },
  { name: "NY", lat: 43.0004, lng: -75.4999 },
  { name: "NC", lat: 35.7596, lng: -79.0193 },
  { name: "ND", lat: 47.5515, lng: -101.0020 },
  { name: "OH", lat: 40.4173, lng: -82.9071 },
  { name: "OK", lat: 35.4676, lng: -97.5164 },
  { name: "OR", lat: 43.8041, lng: -120.5542 },
  { name: "PA", lat: 41.2033, lng: -77.1945 },
  { name: "RI", lat: 41.5801, lng: -71.4774 },
  { name: "SC", lat: 33.8361, lng: -81.1637 },
  { name: "SD", lat: 43.9695, lng: -99.9018 },
  { name: "TN", lat: 35.5175, lng: -86.5804 },
  { name: "TX", lat: 31.9686, lng: -99.9018 },
  { name: "UT", lat: 39.3210, lng: -111.0937 },
  { name: "VT", lat: 44.5588, lng: -72.5778 },
  { name: "VA", lat: 37.4316, lng: -78.6569 },
  { name: "WA", lat: 47.7511, lng: -120.7401 },
  { name: "WI", lat: 43.7844, lng: -88.7879 },
  { name: "WV", lat: 38.5976, lng: -80.4549 },
  { name: "WY", lat: 43.0759, lng: -107.2903 }
]

const metroSeeds = [
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Bay Area", lat: 37.7749, lng: -122.4194 },
  { name: "San Diego", lat: 32.7157, lng: -117.1611 },
  { name: "Seattle", lat: 47.6062, lng: -122.3321 },
  { name: "Phoenix", lat: 33.4484, lng: -112.074 },
  { name: "Denver", lat: 39.7392, lng: -104.9903 },
  { name: "Dallas", lat: 32.7767, lng: -96.797 },
  { name: "Houston", lat: 29.7604, lng: -95.3698 },
  { name: "Austin", lat: 30.2672, lng: -97.7431 },
  { name: "San Antonio", lat: 29.4241, lng: -98.4936 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Atlanta", lat: 33.749, lng: -84.388 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
  { name: "Orlando", lat: 28.5383, lng: -81.3792 },
  { name: "Tampa", lat: 27.9506, lng: -82.4572 },
  { name: "Charlotte", lat: 35.2271, lng: -80.8431 },
  { name: "Raleigh", lat: 35.7796, lng: -78.6382 },
  { name: "DC", lat: 38.9072, lng: -77.0369 },
  { name: "NYC", lat: 40.7128, lng: -74.006 },
  { name: "Boston", lat: 42.3601, lng: -71.0589 },
  { name: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { name: "Detroit", lat: 42.3314, lng: -83.0458 },
  { name: "Minneapolis", lat: 44.9778, lng: -93.265 },
  { name: "Portland", lat: 45.5152, lng: -122.6784 },
  { name: "Las Vegas", lat: 36.1699, lng: -115.1398 },
  { name: "Salt Lake City", lat: 40.7608, lng: -111.891 },
  { name: "St Louis", lat: 38.627, lng: -90.1994 },
  { name: "Kansas City", lat: 39.0997, lng: -94.5786 },
  { name: "Nashville", lat: 36.1627, lng: -86.7816 }
]

const seeds = [...stateSeeds, ...metroSeeds]
// Supplemental coarse grid to pick up gaps; will only run if we have remaining request budget
const supplementalSeeds = [
  { name: "Grid-26,-122", lat: 26, lng: -122 },
  { name: "Grid-26,-110", lat: 26, lng: -110 },
  { name: "Grid-26,-98", lat: 26, lng: -98 },
  { name: "Grid-26,-86", lat: 26, lng: -86 },
  { name: "Grid-26,-74", lat: 26, lng: -74 },
  { name: "Grid-31,-122", lat: 31, lng: -122 },
  { name: "Grid-31,-110", lat: 31, lng: -110 },
  { name: "Grid-31,-98", lat: 31, lng: -98 },
  { name: "Grid-31,-86", lat: 31, lng: -86 },
  { name: "Grid-31,-74", lat: 31, lng: -74 },
  { name: "Grid-36,-122", lat: 36, lng: -122 },
  { name: "Grid-36,-110", lat: 36, lng: -110 },
  { name: "Grid-36,-98", lat: 36, lng: -98 },
  { name: "Grid-36,-86", lat: 36, lng: -86 },
  { name: "Grid-36,-74", lat: 36, lng: -74 },
  { name: "Grid-41,-122", lat: 41, lng: -122 },
  { name: "Grid-41,-110", lat: 41, lng: -110 },
  { name: "Grid-41,-98", lat: 41, lng: -98 },
  { name: "Grid-41,-86", lat: 41, lng: -86 },
  { name: "Grid-41,-74", lat: 41, lng: -74 },
  { name: "Grid-46,-122", lat: 46, lng: -122 },
  { name: "Grid-46,-110", lat: 46, lng: -110 },
  { name: "Grid-46,-98", lat: 46, lng: -98 },
  { name: "Grid-46,-86", lat: 46, lng: -86 },
  { name: "Grid-46,-74", lat: 46, lng: -74 }
]

// Add HI and PR specific seeds
supplementalSeeds.push(
  { name: "HI-Oahu", lat: 21.3099, lng: -157.8581 },
  { name: "HI-Maui", lat: 20.7984, lng: -156.3319 },
  { name: "HI-BigIsland", lat: 19.7074, lng: -155.0885 },
  { name: "AK-Anchorage", lat: 61.2181, lng: -149.9003 },
  { name: "PR-SanJuan", lat: 18.4655, lng: -66.1057 },
  { name: "PR-Ponce", lat: 18.0120, lng: -66.6141 }
)
// Raise this for full fetch once validation passes
const MAX_REQUESTS = 350
const RADIUS_METERS = 50000 // max allowed by API

const dedup = new Map()
const addressKeys = new Set()
const previousDataPath = path.join(process.cwd(), "data", "home-depot-stores.json")
const previousData = fs.existsSync(previousDataPath)
  ? JSON.parse(fs.readFileSync(previousDataPath, "utf8"))
  : []
const previousById = new Map(previousData.map((p) => [p.id, p]))
let requestCount = 0

async function fetchPlaces({ lat, lng, pageToken }) {
  const body = {
    textQuery: "Home Depot",
    languageCode: "en",
    regionCode: "US",
    pageSize: 20,
    locationBias: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: RADIUS_METERS
      }
    },
    pageToken: pageToken || undefined
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places API error ${res.status}: ${text.slice(0, 500)}`)
  }

  return res.json()
}

function normalizePlace(place) {
  let street = ""
  let city = ""
  let state = ""
  let zip = ""
  let country = ""

  if (place.addressComponents) {
    const comps = place.addressComponents
    const byType = (type) => comps.find((c) => (c.types || []).includes(type))
    const streetNumber = byType("street_number")?.longText || ""
    const route = byType("route")?.longText || ""
    street = [streetNumber, route].filter(Boolean).join(" ").trim()
    city =
      (byType("locality")?.longText ||
        byType("postal_town")?.longText ||
        byType("sublocality")?.longText ||
        byType("administrative_area_level_2")?.longText ||
        "").trim()
    state = (byType("administrative_area_level_1")?.shortText || "").trim()
    zip = (byType("postal_code")?.longText || "").trim()
    country = (byType("country")?.shortText || "").trim()
  }

  // Only keep US
  if (!country && place.formattedAddress) {
    const tokens = place.formattedAddress.split(",").map((p) => p.trim()).filter(Boolean)
    country = tokens[tokens.length - 1] || ""
  }
  if (country && !["US", "USA", "United States"].includes(country)) return null
  if (!country) return null

  if (!street) {
    const formatted = place.shortFormattedAddress || place.formattedAddress || ""
    const tokens = formatted.split(",").map((p) => p.trim()).filter(Boolean)
    // Attempt to find street as first token containing a digit
    const withNumber = tokens.find((t) => /\d/.test(t))
    street = withNumber || tokens[0] || formatted
  }

  if (!state || !city) {
    // Try parsing formattedAddress fallback
    const formatted = place.formattedAddress || ""
    const tokens = formatted.split(",").map((p) => p.trim()).filter(Boolean)
    for (let i = tokens.length - 1; i >= 0; i--) {
      const t = tokens[i]
      const m = t.match(/([A-Z]{2})\s+(\d{5})(?:-\d{4})?/)
      if (m) {
        state = state || m[1]
        zip = zip || m[2]
        city = city || tokens[i - 1] || ""
        if (!street) street = tokens.slice(0, i - 1).join(", ") || street
        break
      }
    }
  }
  if (!state) return null

  return {
    id: place.id || place.name || `${street}-${city}`,
    number: place.id || "N/A",
    name: place.displayName?.text || "Home Depot",
    address: street,
    city,
    state,
    zip,
    phone: place.nationalPhoneNumber || "",
    lat: place.location?.latitude,
    lng: place.location?.longitude,
    hours: normalizeHours(place.currentOpeningHours, place.regularOpeningHours),
    services: normalizeServices(place.types, place.primaryType)
  }
}

function normalizeHours(currentOpeningHours, regularOpeningHours) {
  const hoursSource = currentOpeningHours?.weekdayDescriptions || regularOpeningHours?.weekdayDescriptions
  if (!hoursSource) {
    return { weekday: "", weekend: "" }
  }
  const desc = hoursSource
  const stripDay = (d) => d.split(":").slice(1).join(":").trim()
  const monday = desc[0] ? stripDay(desc[0]) : ""
  const saturday = desc[5] ? stripDay(desc[5]) : ""
  const sunday = desc[6] ? stripDay(desc[6]) : ""
  const weekend = [saturday, sunday].filter(Boolean).join(" / ")
  return {
    weekday: monday ? `Mon-Fri: ${monday}` : "",
    weekend
  }
}

function normalizeServices(types = [], primaryType = "") {
  const t = new Set(types || [])
  if (primaryType) t.add(primaryType)
  const services = []
  if (t.has("home_improvement_store")) services.push("Home Improvement Store")
  if (t.has("hardware_store")) services.push("Hardware")
  if (t.has("garden_center")) services.push("Garden")
  if (t.has("store")) services.push("Retail")
  // If Places returns these flags via types (not guaranteed)
  if (t.has("curbside_pickup")) services.push("Curbside Pickup")
  if (t.has("delivery")) services.push("Delivery")
  if (t.has("in_store_shopping")) services.push("In-Store Shopping")
  if (t.has("in_store_pickup")) services.push("In-Store Pickup")
  return services
}

async function withRetry(fn, { maxAttempts = 5, label = "request" } = {}) {
  let attempt = 0
  while (attempt < maxAttempts) {
    attempt++
    try {
      return await fn()
    } catch (err) {
      if (attempt >= maxAttempts) throw err
      const backoff = Math.min(2000 * attempt, 5000) + Math.random() * 300
      console.warn(`[retry] ${label} attempt ${attempt} failed: ${err.message}. Retrying in ${backoff}ms`)
      await sleep(backoff)
    }
  }
}

async function runSeeds(seedList, label) {
  for (const seed of seedList) {
    if (requestCount >= MAX_REQUESTS) break
    let pageToken = null
    let page = 0
    let addedThisSeed = 0

    do {
      await sleep(120) // throttle
      const data = await withRetry(() => fetchPlaces({ lat: seed.lat, lng: seed.lng, pageToken }), {
        label: `${label}:${seed.name} page:${page}`
      })
      requestCount++

      const places = data.places || []
      let added = 0
      for (const p of places) {
        const id = p.id
        if (!id || dedup.has(id)) continue
        const normalized = normalizePlace(p)
        if (!normalized) continue
        if (!normalized.lat || !normalized.lng) continue

        // Merge with previous data for hours/services and change tracking
        const prev = previousById.get(id)
        const nowIso = new Date().toISOString()
        if (prev) {
          if (!normalized.hours.weekday && !normalized.hours.weekend && prev.hours) {
            normalized.hours = prev.hours
          }
          if (!normalized.services || normalized.services.length === 0) {
            normalized.services = prev.services || []
          }
          if (prev.hoursLastChangedAt) {
            normalized.hoursLastChangedAt = prev.hoursLastChangedAt
          }
        }
        const hoursChanged =
          prev &&
          prev.hours &&
          (prev.hours.weekday !== normalized.hours.weekday ||
            prev.hours.weekend !== normalized.hours.weekend)

        if (hoursChanged) {
          normalized.hoursLastChangedAt = nowIso
        } else if (!normalized.hoursLastChangedAt) {
          normalized.hoursLastChangedAt = prev?.hoursLastChangedAt || nowIso
        }
        normalized.hoursFetchedAt = nowIso
        if (!normalized.services) normalized.services = []

        const addressKey = `${normalized.address}|${normalized.city}|${normalized.state}|${normalized.zip}`
        if (addressKeys.has(addressKey)) continue

        dedup.set(id, normalized)
        addressKeys.add(addressKey)
        added++
      }

      addedThisSeed += added
      if (requestCount % 25 === 0 || added > 0) {
        console.log(
          `[progress] ${label}:${seed.name} page:${page} fetched:${places.length} added:${added} total:${dedup.size} requests:${requestCount}`
        )
      }

      pageToken = data.nextPageToken || null
      page++
      if (pageToken) await sleep(1200)
      if (page > 2 && added === 0) break // stop early if no new adds after a couple pages
    } while (pageToken && requestCount < MAX_REQUESTS)

    if (addedThisSeed === 0) {
      continue
    }
  }
}

async function main() {
  console.log(`Scanning seeds (max requests ${MAX_REQUESTS})`)
  await runSeeds(seeds, "seed")
  if (requestCount < MAX_REQUESTS) {
    await runSeeds(supplementalSeeds, "grid")
  }

  const stores = Array.from(dedup.values()).sort((a, b) => {
    if (a.state !== b.state) return a.state.localeCompare(b.state)
    if (a.city !== b.city) return a.city.localeCompare(b.city)
    return a.name.localeCompare(b.name)
  })

  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true })
  const outPath = path.join(process.cwd(), "data", "home-depot-stores.json")
  const tmpPath = `${outPath}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(stores, null, 2), "utf8")
  fs.renameSync(tmpPath, outPath)

  console.log(`Done. Saved ${stores.length} unique stores to ${outPath}. Requests sent: ${requestCount}`)
}

main().catch((err) => {
  console.error("Failed to complete:", err)
  process.exit(1)
})
