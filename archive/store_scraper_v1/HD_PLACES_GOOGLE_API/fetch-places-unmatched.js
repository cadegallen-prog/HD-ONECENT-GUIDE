#!/usr/bin/env node
/**
 * Fetch Google Places data only for unmatched Home Depot URLs (~445 rows).
 * - Reads unmatched rows from data/store-urls-unmatched.csv
 * - Uses GOOGLE_PLACES_API_KEY from .env.local
 * - Caches results in data/home-depot-stores.unmatched-cache.json to allow resume
 * - Outputs combined results to data/home-depot-stores.unmatched-places.json
 *
 * Query strategy:
 *   1) "Home Depot <storeNumber> <city> <state> <zip>"
 *   2) fallback: "Home Depot <city> <state> <zip>"
 *
 * Throttled to avoid rate spikes. On abort, cached results persist.
 */

const fs = require("fs")
const path = require("path")
const readline = require("readline")

const UNMATCHED_CSV = path.join(process.cwd(), "data", "store-urls-unmatched.csv")
const CACHE_PATH = path.join(process.cwd(), "data", "home-depot-stores.unmatched-cache.json")
const OUTPUT_PATH = path.join(process.cwd(), "data", "home-depot-stores.unmatched-places.json")

// Minimal env loader
function loadEnvLocal() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/)
      if (m) {
        const key = m[1]
        const value = m[2]
        if (!process.env[key]) process.env[key] = value
      }
    }
  } catch (_) {
    // ignore
  }
}

loadEnvLocal()

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY in .env.local")
  process.exit(1)
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").split(/\r?\n/)
  const rows = []
  let headers = null
  for (const line of raw) {
    if (!line.trim()) continue
    if (!headers) {
      headers = line.split(",")
      continue
    }
    const parts = line.split(",")
    const obj = {}
    headers.forEach((h, i) => (obj[h] = parts[i] || ""))
    rows.push(obj)
  }
  return rows
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

async function fetchPlace(entry) {
  const baseQuery = `Home Depot ${entry.storeNumber} ${entry.city} ${entry.state} ${entry.zip}`
  const fallbackQuery = `Home Depot ${entry.city} ${entry.state} ${entry.zip}`

  // Base query
  try {
    const places = await fetchPlacesSearch(baseQuery)
    const best = pickBestPlace(places)
    if (best) return { place: best, queryUsed: baseQuery, status: "ok" }
  } catch (err) {
    // continue
  }

  // Fallback
  try {
    const places = await fetchPlacesSearch(fallbackQuery)
    const best = pickBestPlace(places)
    if (best) return { place: best, queryUsed: fallbackQuery, status: "ok" }
  } catch (err) {
    return { place: null, queryUsed: fallbackQuery, status: "error", error: err.message }
  }

  return { place: null, queryUsed: fallbackQuery, status: "no_result" }
}

function toRecord(entry, result) {
  const place = result.place
  const addressFields = place ? extractAddressFields(place) : { city: "", state: "", zip: "" }
  const hours =
    (place?.regularOpeningHours && place.regularOpeningHours.weekdayDescriptions) ||
    (place?.currentOpeningHours && place.currentOpeningHours.weekdayDescriptions) ||
    null

  return {
    id: place?.id || null,
    number: entry.storeNumber,
    name: place?.displayName?.text || "The Home Depot",
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
    queryUsed: result.queryUsed,
    status: result.status,
    error: result.error || null,
  }
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"))
  } catch (_) {
    return {}
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2))
}

async function main() {
  if (!fs.existsSync(UNMATCHED_CSV)) {
    console.error(`Missing ${UNMATCHED_CSV}. Run unmatched export first.`)
    process.exit(1)
  }
  const rows = parseCsv(UNMATCHED_CSV)
  console.log(`Unmatched rows: ${rows.length}`)

  let cache = loadCache()
  console.log(`Loaded cache entries: ${Object.keys(cache).length}`)

  let ok = 0
  let noResult = 0
  let errs = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const key = row.storeNumber || `${row.state}-${row.zip}-${row.city}`
    if (cache[key]) {
      const status = cache[key].status
      if (status === "ok") ok++
      else if (status === "no_result") noResult++
      else errs++
      if ((i + 1) % 100 === 0 || i === rows.length - 1) {
        console.log(`[skip cache] [${i + 1}/${rows.length}] ok=${ok} no_result=${noResult} err=${errs}`)
      }
      continue
    }

    try {
      const result = await fetchPlace(row)
      const record = toRecord(row, result)
      cache[key] = record
      if (result.status === "ok") ok++
      else if (result.status === "no_result") noResult++
      else errs++
    } catch (err) {
      cache[key] = {
        id: null,
        number: row.storeNumber,
        name: "The Home Depot",
        address: "",
        city: "",
        state: "",
        zip: row.zip || "",
        phone: "",
        lat: null,
        lng: null,
        hours: null,
        types: [],
        primaryType: "",
        sourceUrl: row.url,
        queryUsed: null,
        status: "error",
        error: err.message,
      }
      errs++
    }

    // Persist after each to avoid loss on abort
    saveCache(cache)

    if ((i + 1) % 50 === 0 || i === rows.length - 1) {
      console.log(`[${i + 1}/${rows.length}] ok=${ok} no_result=${noResult} err=${errs}`)
    }

    await sleep(200)
  }

  const outArr = Object.values(cache)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outArr, null, 2))
  console.log(
    `Done. Saved ${outArr.length} records to ${OUTPUT_PATH}. ok=${ok} no_result=${noResult} err=${errs}`,
  )
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
