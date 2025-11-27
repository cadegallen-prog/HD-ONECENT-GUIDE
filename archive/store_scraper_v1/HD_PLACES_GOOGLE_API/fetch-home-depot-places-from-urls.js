#!/usr/bin/env node
/**
 * Fetch Home Depot stores via Google Places using the 2,007 store URLs as seeds.
 * - Reads GOOGLE_PLACES_API_KEY from .env.local
 * - For each URL: extracts store number, city, state, zip; queries Places searchText
 *   with a targeted query; falls back to a broader query if needed.
 * - Writes results to data/home-depot-stores.from-urls.json
 *
 * Note: This script uses the new Places API (v1) searchText endpoint.
 */

const fs = require("fs")
const path = require("path")

const OUTPUT_PATH = path.join(process.cwd(), "data", "home-depot-stores.from-urls.json")
const URLS_PATH = path.join("C:", "Users", "cadeg", "Downloads", "store_urls_clean.json")

// -------- Env loader (minimal) --------
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
  } catch (_) {
    // ignore missing
  }
}
loadEnvLocal()

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY in .env.local")
  process.exit(1)
}

// -------- Helpers --------
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

function parseUrlEntry(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)
    // Expected: ["l", "<slug>", "<state>", "<city>", "<zip>", "<storeNumber>"]
    if (parts.length < 6 || parts[0].toLowerCase() !== "l") return null
    const slug = parts[1]
    const state = parts[2]
    const city = parts[3]
    const zip = parts[4]
    const storeNumber = parts[5]
    return { url, slug, state, city, zip, storeNumber }
  } catch (err) {
    return null
  }
}

function normalizeText(str) {
  return typeof str === "string" ? str.trim() : ""
}

function extractAddressFields(place) {
  const components = Array.isArray(place.addressComponents) ? place.addressComponents : []
  let city = ""
  let state = ""
  let zip = ""
  for (const comp of components) {
    const types = comp.types || []
    if (types.includes("locality") || types.includes("postal_town")) {
      city = city || comp.longText || comp.shortText || ""
    }
    if (types.includes("administrative_area_level_1")) {
      state = state || comp.shortText || comp.longText || ""
    }
    if (types.includes("postal_code")) {
      zip = zip || comp.longText || comp.shortText || ""
    }
  }
  return { city, state, zip }
}

function pickBestPlace(places) {
  if (!Array.isArray(places) || places.length === 0) return null
  // Prefer ones with displayName containing "home depot"
  const match = places.find(
    (p) => p.displayName?.text && p.displayName.text.toLowerCase().includes("home depot"),
  )
  return match || places[0]
}

async function fetchPlacesSearch(textQuery) {
  const body = {
    textQuery,
    languageCode: "en",
    maxResultCount: 5,
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,places.addressComponents,places.location,places.nationalPhoneNumber,places.primaryType,places.types,places.businessStatus,places.currentOpeningHours.weekdayDescriptions,places.regularOpeningHours.weekdayDescriptions",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`searchText status ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return Array.isArray(data.places) ? data.places : []
}

async function fetchPlaceForStore(entry) {
  const baseQuery = `Home Depot ${entry.storeNumber} ${entry.city} ${entry.state} ${entry.zip}`
  const fallbackQuery = `Home Depot ${entry.city} ${entry.state} ${entry.zip}`

  // Try base query
  try {
    const places = await fetchPlacesSearch(baseQuery)
    const best = pickBestPlace(places)
    if (best) {
      return { place: best, queryUsed: baseQuery, status: "ok" }
    }
  } catch (err) {
    // continue to fallback
  }

  // Fallback query
  try {
    const places = await fetchPlacesSearch(fallbackQuery)
    const best = pickBestPlace(places)
    if (best) {
      return { place: best, queryUsed: fallbackQuery, status: "ok" }
    }
  } catch (err) {
    return { place: null, queryUsed: fallbackQuery, status: "error", error: err.message }
  }

  return { place: null, queryUsed: fallbackQuery, status: "no_result" }
}

function toOutputRecord(entry, placeResult) {
  const place = placeResult.place
  const addressFields = place ? extractAddressFields(place) : { city: "", state: "", zip: "" }
  const hours =
    (place?.regularOpeningHours && place.regularOpeningHours.weekdayDescriptions) ||
    (place?.currentOpeningHours && place.currentOpeningHours.weekdayDescriptions) ||
    null

  return {
    id: place?.id || null,
    number: entry.storeNumber,
    name: place?.displayName?.text || `The Home Depot`,
    address: place?.formattedAddress || place?.shortFormattedAddress || "",
    city: addressFields.city || "",
    state: addressFields.state || "",
    zip: addressFields.zip || entry.zip || "",
    phone: place?.nationalPhoneNumber || "",
    lat: place?.location?.latitude || null,
    lng: place?.location?.longitude || null,
    hours: hours ? { weekday: hours.join(" | ") } : null,
    types: place?.types || [],
    primaryType: place?.primaryType || "",
    sourceUrl: entry.url,
    queryUsed: placeResult.queryUsed,
    status: placeResult.status,
    error: placeResult.error || null,
  }
}

async function main() {
  console.log("Loading URL seeds from", URLS_PATH)
  const urls = JSON.parse(fs.readFileSync(URLS_PATH, "utf8"))
  const entries = urls.map(parseUrlEntry).filter(Boolean)
  console.log(`Parsed ${entries.length} URL entries`)

  const results = []
  let okCount = 0
  let noResultCount = 0
  let errCount = 0

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    try {
      const placeResult = await fetchPlaceForStore(entry)
      const record = toOutputRecord(entry, placeResult)
      results.push(record)
      if (placeResult.status === "ok") okCount++
      else if (placeResult.status === "no_result") noResultCount++
      else errCount++
      if ((i + 1) % 100 === 0 || i === entries.length - 1) {
        console.log(
          `[${i + 1}/${entries.length}] ok=${okCount} no_result=${noResultCount} err=${errCount}`,
        )
      }
    } catch (err) {
      results.push({
        id: null,
        number: entry.storeNumber,
        name: "The Home Depot",
        address: "",
        city: "",
        state: "",
        zip: entry.zip || "",
        phone: "",
        lat: null,
        lng: null,
        hours: null,
        types: [],
        primaryType: "",
        sourceUrl: entry.url,
        queryUsed: null,
        status: "error",
        error: err.message,
      })
      errCount++
    }

    // Gentle throttle to avoid hammering the API
    await sleep(200)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
  console.log(
    `Done. Saved ${results.length} rows to ${OUTPUT_PATH}. ok=${okCount}, no_result=${noResultCount}, err=${errCount}`,
  )
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
