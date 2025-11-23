#!/usr/bin/env node
/**
 * Enrich Home Depot store data with real store names and store numbers
 * using a generic Scraper API (e.g. ScraperAPI, ScrapingBee, etc).
 *
 * What this script does:
 * - Loads SCRAPER_API_KEY (and optional SCRAPER_API_URL) from .env.local.
 * - Reads data/home-depot-stores.json (created by fetch-home-depot-places.js).
 * - For each store, builds a target URL (by default the Home Depot store page URL).
 * - Calls the Scraper API for that URL.
 * - Tries to extract a store "nickname" and "Store #xxxx" from the HTML.
 * - Writes an updated data/home-depot-stores.enriched.json with name/number filled in
 *   when they can be parsed.
 *
 * Important:
 * - This is intentionally conservative and designed to be easy to tweak.
 * - The HTML structure on homedepot.com can change. If parsing breaks,
 *   update extractFromHtml() to match the current markup.
 * - The script never overwrites home-depot-stores.json; it always writes a new file.
 */

const fs = require("fs")
const path = require("path")

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// Minimal env loader for .env.local (shared pattern with fetch-home-depot-places.js)
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
  } catch {
    // ignore missing
  }
}

loadEnvLocal()

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY
const SCRAPER_API_URL = process.env.SCRAPER_API_URL || "https://api.scraperapi.com"

if (!SCRAPER_API_KEY) {
  console.error("Missing SCRAPER_API_KEY. Add it to .env.local before running.")
  process.exit(1)
}

// Mirror the StoreLocation shape used by the app as plain JS
function hasValidStoreNumber(num) {
  if (!num) return false
  return /^\d{1,5}$/.test(String(num).trim())
}

function formatStoreNumber(num) {
  if (!hasValidStoreNumber(num)) return ""
  return String(num).trim().padStart(4, "0")
}

// Generate the Home Depot store URL similar to app/store-finder/page.tsx:getStoreUrl
function buildStoreUrl(store) {
  const safe = (v, fallback) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback)
  const storeName = safe(store.name, store.city || "Store").replace(/\s+/g, "-")
  const state = safe(store.state, "GA")
  const city = safe(store.city, "Atlanta")
  const zip = safe(store.zip, "")
  const storeNum = hasValidStoreNumber(store.number) ? String(parseInt(store.number, 10)) : ""

  const base = `https://www.homedepot.com/l/${storeName}/${state}/${city}/${zip}`
  return storeNum ? `${base}/${storeNum}` : base
}

// Build Scraper API URL around a target URL.
// Default matches ScraperAPI's interface: ?api_key=...&url=...
function buildScraperRequestUrl(targetUrl) {
  const u = new URL(SCRAPER_API_URL)
  u.searchParams.set("api_key", SCRAPER_API_KEY)
  u.searchParams.set("url", targetUrl)
  // Users can control rendering, country, etc by setting SCRAPER_API_URL,
  // e.g. "https://api.scraperapi.com?render=true&country=us"
  return u.toString()
}

// Very lightweight HTML helpers (string-based, no heavy DOM deps)
function extractBetween(html, startMarker, endMarker) {
  const startIdx = html.indexOf(startMarker)
  if (startIdx === -1) return ""
  const from = startIdx + startMarker.length
  const endIdx = html.indexOf(endMarker, from)
  if (endIdx === -1) return ""
  return html.slice(from, endIdx)
}

function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Attempt to extract a store nickname and numeric store # from HTML.
 *
 * This uses a few heuristics:
 * - Try to find patterns like "Store #0123" or "Store # 123".
 * - Try to pull a human-friendly name from <title> or JSON-LD if available.
 *
 * If nothing is found, returns null (the caller keeps the original values).
 */
function extractFromHtml(html) {
  if (!html) return null

  let storeNumber = ""
  let storeName = ""

  // 1) Look for "Store #0123" style patterns
  const storeNumberRegex = /Store\s*#\s*(\d{1,5})/i
  const numMatch = html.match(storeNumberRegex)
  if (numMatch && numMatch[1]) {
    storeNumber = formatStoreNumber(numMatch[1])
  }

  // 2) Try to get a nice name from <title> if it looks like a store page
  const rawTitle = extractBetween(html, "<title", "</title>")
  if (rawTitle) {
    // Drop any leading attributes in the <title ...> tag
    const titleContent = rawTitle.replace(/^.*?>/, "")
    const cleaned = cleanText(titleContent)
    // Heuristic: titles often look like "Cumberland Home Depot Store #0121"
    // Prefer the part before "Home Depot" or "The Home Depot"
    const nameMatch = cleaned.match(/^(.*?)(?:\s+-\s+)?(?:The\s+Home\s+Depot|Home\s+Depot)/i)
    if (nameMatch && nameMatch[1]) {
      storeName = nameMatch[1].trim()
    } else if (cleaned.length > 0 && cleaned.length < 80) {
      storeName = cleaned
    }
  }

  if (!storeNumber && !storeName) {
    return null
  }

  const result = {}
  if (storeNumber) result.number = storeNumber
  if (storeName) result.name = storeName
  return result
}

async function fetchWithScraper(targetUrl, attemptLabel) {
  const url = buildScraperRequestUrl(targetUrl)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${attemptLabel} failed with ${res.status}: ${text.slice(0, 300)}`)
  }
  return res.text()
}

async function main() {
  const dataPath = path.join(process.cwd(), "data", "home-depot-stores.json")
  if (!fs.existsSync(dataPath)) {
    console.error(`Missing data file: ${dataPath}. Run scripts/fetch-home-depot-places.js first.`)
    process.exit(1)
  }

  /** @type {Array<any>} */
  const stores = JSON.parse(fs.readFileSync(dataPath, "utf8"))
  const limit = Number(process.env.SCRAPER_LIMIT)
  const targetStores =
    Number.isFinite(limit) && limit > 0 ? stores.slice(0, limit) : stores

  let updatedCount = 0
  let skippedCount = 0
  let failedCount = 0

  const out = []

  for (let i = 0; i < targetStores.length; i++) {
    const store = targetStores[i]
    const id = store.id || `idx-${i}`

    // If we already have a valid numeric store number and a non-generic name,
    // keep as-is and skip scraping to save credits.
    const hasRealNumber = hasValidStoreNumber(store.number)
    const hasSpecificName =
      typeof store.name === "string" &&
      store.name.trim().length > 0 &&
      !/^the\s+home\s+depot$/i.test(store.name.trim())

    if (hasRealNumber && hasSpecificName) {
      skippedCount++
      out.push(store)
      continue
    }

    const targetUrl = buildStoreUrl(store)
    const label = `store:${id}`

    try {
      const html = await fetchWithScraper(targetUrl, label)
      const extracted = extractFromHtml(html)

      if (extracted) {
        const next = { ...store }
        if (extracted.name) next.name = extracted.name
        if (extracted.number) next.number = extracted.number
        out.push(next)
        updatedCount++
        console.log(
          `[enrich] id=${id} updated${extracted.name ? ` name="${extracted.name}"` : ""}${
            extracted.number ? ` number=${extracted.number}` : ""
          }`
        )
      } else {
        out.push(store)
        skippedCount++
        console.log(`[enrich] id=${id} no parsable data, left unchanged`)
      }
    } catch (err) {
      failedCount++
      out.push(store)
      console.warn(`[enrich] id=${id} failed: ${err.message}`)
    }

    // Gentle throttle to avoid blowing through credits; adjust as needed.
    await sleep(500)
  }

  if (targetStores.length < stores.length) {
    for (let i = targetStores.length; i < stores.length; i++) {
      out.push(stores[i])
    }
  }

  const outPath = path.join(process.cwd(), "data", "home-depot-stores.enriched.json")
  const tmpPath = `${outPath}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(out, null, 2), "utf8")
  fs.renameSync(tmpPath, outPath)

  console.log(
    `Done. Total: ${targetStores.length}, updated: ${updatedCount}, skipped: ${skippedCount}, failed: ${failedCount}.`
  )
  console.log(`Wrote enriched data to ${outPath}`)
}

main().catch((err) => {
  console.error("Fatal error while enriching store data:", err)
  process.exit(1)
})
