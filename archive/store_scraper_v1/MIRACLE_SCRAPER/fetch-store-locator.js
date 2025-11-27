#!/usr/bin/env node
/**
 * Home Depot Store Locator Scraper (URL-driven)
 *
 * Pulls store numbers directly from store URLs (store_urls_clean.json) and uses the
 * StoreFinder detail API to fetch the canonical store name/number/address. Falls back
 * to scraping the store page when needed. This avoids gaps in the Google Places data.
 *
 * Flow:
 * - Launches Playwright in a persistent Edge profile (solve Akamai once).
 * - Warms up on homedepot.com so cookies/session exist.
 * - Iterates the 2,007 store URLs (or a --limit subset), calling the StoreFinder
 *   detail API (by storeNumber) from inside the browser context.
 * - Falls back to scraping the /l/{...}/{storeNumber} page if API gives nothing.
 * - Writes MIRACLE_SCRAPER/store-locator-results.json with the raw pulls.
 *
 * Usage examples:
 *   node MIRACLE_SCRAPER/fetch-store-locator.js          # scrape all 2,007 stores
 *   node MIRACLE_SCRAPER/fetch-store-locator.js --limit 10
 */

const fs = require("fs")
const path = require("path")
const { chromium } = require("playwright")
const readline = require("readline")

const CONFIG = {
  userDataDir: path.join(process.env.LOCALAPPDATA || "", "HD-Scraper-Profile"),
  delayBetween: 1200,
  searchRadiusMiles: 50,
  headless: false,
}

const URLS_PATH = path.join("C:", "Users", "cadeg", "Downloads", "store_urls_clean.json")
const OUTPUT_PATH = path.join(__dirname, "store-locator-results.json")

const hasValidStoreNumber = (num) => !!num && /^\d{1,5}$/.test(String(num).trim())
const formatStoreNumber = (num) => (hasValidStoreNumber(num) ? String(num).trim().padStart(4, "0") : "")
const safeString = (value, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback

const buildStoreUrlFromParts = ({ slug, state, city, zip, storeNumber }) => {
  const base = `https://www.homedepot.com/l/${slug}/${state}/${city}/${zip}`
  return hasValidStoreNumber(storeNumber) ? `${base}/${storeNumber}` : base
}

async function fetchStoreDetail(page, storeNumberRaw) {
  if (!hasValidStoreNumber(storeNumberRaw)) return null

  return page.evaluate(
    async ({ numRaw, numPadded }) => {
      const tryFetch = async (num) => {
        const res = await fetch(
          `https://www.homedepot.com/StoreFinder/api/v1/store/detail?storeNumber=${encodeURIComponent(num)}`,
          {
            credentials: "include",
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              "x-requested-with": "XMLHttpRequest",
            },
          },
        )

        if (!res.ok) {
          throw new Error(`StoreFinder detail status ${res.status}`)
        }

        const data = await res.json()
        const store = Array.isArray(data) ? data[0] : data?.store || data
        if (!store) return null

        return {
          storeNumber: store.storeNumber || store.storeId || store.id || num,
          storeName: store.storeName || store.nickname || store.name || "",
          address: store.address || store.addressLine1 || store.storeAddress || "",
          city: store.city || store.storeCity || "",
          state: store.state || store.storeState || "",
          zip: store.zip || store.postalCode || store.storeZip || "",
          phone: store.storePhoneNumber || store.phone || "",
          lat: store.latitude || store.lat || null,
          lng: store.longitude || store.lon || null,
        }
      }

      try {
        const first = await tryFetch(numRaw)
        if (first) return first
      } catch (e) {
        // fall back to padded
      }

      if (numPadded && numPadded !== numRaw) {
        try {
          return await tryFetch(numPadded)
        } catch (e) {
          // no-op
        }
      }

      throw new Error("StoreFinder detail: no data")
    },
    { numRaw: storeNumberRaw, numPadded: formatStoreNumber(storeNumberRaw) },
  )
}

async function scrapeStorePage(page, store) {
  const url = store.url || buildStoreUrlFromParts(store)

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 })
  await page.waitForTimeout(2500)

  const isErrorPage = (html) =>
    html.includes("Oops!! Something went wrong") || html.toLowerCase().includes("error page")

  const content = await page.content()
  if (isErrorPage(content)) {
    return null
  }

  return page.evaluate(() => {
    const parseStateJson = () => {
      try {
        const node = document.querySelector("script#__THD_APP_STATE__")
        if (!node?.textContent) return null
        const data = JSON.parse(node.textContent)
        const store = data?.storeDetails?.storeDetails?.[0] || data?.storeDetails?.storeDetails
        if (!store) return null
        return {
          storeNumber: store.storeId || store.storeNumber || "",
          storeName: store.storeName || store.nickname || "",
          address: store.address || store.addressLine1 || "",
          city: store.city || "",
          state: store.state || "",
          zip: store.zip || store.postalCode || "",
          phone: store.phone || store.phoneNumber || "",
        }
      } catch (_) {
        return null
      }
    }

    const stateData = parseStateJson()

    const text = document.body?.innerText || ""
    const title = document.querySelector("title")?.textContent || ""

    const numberMatch = text.match(/Store\s*#\s*(\d{1,5})/i) || title.match(/Store\s*#\s*(\d{1,5})/i)
    const number = numberMatch ? numberMatch[1] : ""

    let name = ""
    const titleMatch = title.match(/^(.*?)(?:\s+-\s+)?(?:The\s+Home\s+Depot|Home\s+Depot)/i)
    if (titleMatch && titleMatch[1]) {
      name = titleMatch[1].trim()
    }

    if (!name) {
      const heading = document.querySelector("h1, h2")
      if (heading?.textContent) {
        name = heading.textContent.replace(/Store\s*#\s*\d{1,5}/i, "").trim()
      }
    }

    const phone = text.match(/\\(\\d{3}\\)\\s*\\d{3}-\\d{4}/)

    return {
      storeNumber: (stateData && stateData.storeNumber) || number || "",
      storeName: (stateData && stateData.storeName) || name || "",
      address: (stateData && stateData.address) || "",
      city: (stateData && stateData.city) || "",
      state: (stateData && stateData.state) || "",
      zip: (stateData && stateData.zip) || "",
      phone: (stateData && stateData.phone) || (phone ? phone[0] : ""),
      url: location.href,
    }
  })
}

function parseUrlEntry(url) {
  const u = new URL(url)
  const parts = u.pathname.split("/").filter(Boolean)
  // Expected: ["l", "<slug>", "<state>", "<city>", "<zip>", "<storeNumber>"]
  if (parts.length < 6 || parts[0].toLowerCase() !== "l") return null
  const slug = safeString(parts[1], "Store")
  const state = safeString(parts[2], "").toUpperCase()
  const city = safeString(parts[3], "")
  const zip = safeString(parts[4], "")
  const storeNumber = safeString(parts[5], "")
  return {
    slug,
    state,
    city,
    zip,
    storeNumberRaw: storeNumber,
    storeNumber: formatStoreNumber(storeNumber),
    url,
  }
}

function loadStores(limitArg) {
  if (!fs.existsSync(URLS_PATH)) {
    console.error(`Missing URL file: ${URLS_PATH}. Place store_urls_clean.json there.`)
    process.exit(1)
  }

  /** @type {Array<string>} */
  const urls = JSON.parse(fs.readFileSync(URLS_PATH, "utf8"))
  const stores = urls
    .map(parseUrlEntry)
    .filter(Boolean)
    .filter((s) => hasValidStoreNumber(s.storeNumberRaw))

  if (typeof limitArg === "number" && !Number.isNaN(limitArg) && limitArg > 0) {
    return stores.slice(0, limitArg)
  }
  return stores
}

async function main() {
  const args = process.argv.slice(2)
  const limitIdx = args.indexOf("--limit")
  const noPause = args.includes("--no-pause")
  const limitValue =
    limitIdx !== -1 && typeof args[limitIdx + 1] !== "undefined"
      ? Number(args[limitIdx + 1])
      : undefined

  const jobs = loadStores(limitValue)
  console.log(`Scraping ${jobs.length} stores via StoreFinder detail API...`)

  const browser = await chromium.launchPersistentContext(CONFIG.userDataDir, {
    channel: "msedge",
    headless: CONFIG.headless,
    viewport: { width: 1280, height: 900 },
  })

  const page = await browser.newPage()
  await page.goto("https://www.homedepot.com/", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  })
  await page.waitForTimeout(3000)

  if (!noPause) {
    console.log(
      "Solve any captcha/edge challenge in the opened Edge window, then press Enter here to begin scraping...",
    )
    await new Promise((resolve) => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
      rl.question("Press Enter once the site is fully accessible: ", () => {
        rl.close()
        resolve()
      })
    })
  }

  const results = []

  for (let i = 0; i < jobs.length; i++) {
    const store = jobs[i]
    const label = store.storeNumber || store.storeNumberRaw || `idx-${i}`
    let record = {
      sourceId: label,
      inputCity: store.city || "",
      inputState: store.state || "",
      inputZip: store.zip || "",
      method: "",
      storeName: "",
      storeNumber: "",
      url: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      notes: "",
    }

    try {
      const detail = await fetchStoreDetail(page, store.storeNumberRaw || store.storeNumber)
      if (detail && (detail.storeNumber || detail.storeName)) {
        record = {
          ...record,
          method: "storefinder-detail",
          storeName: detail.storeName || "",
          storeNumber: formatStoreNumber(detail.storeNumber),
          url: buildStoreUrlFromParts({ ...store, storeNumber: detail.storeNumber }),
          address: detail.address || "",
          city: detail.city || "",
          state: detail.state || "",
          zip: detail.zip || "",
          phone: detail.phone || "",
        }
        console.log(
          `[${i + 1}/${jobs.length}] ${label}: StoreFinder detail -> ${record.storeName || "name missing"} ${
            record.storeNumber ? `#${record.storeNumber}` : ""
          }`,
        )
        results.push(record)
        if (i < jobs.length - 1) {
          await page.waitForTimeout(CONFIG.delayBetween)
        }
        continue
      }
    } catch (err) {
      record.notes = `StoreFinder error: ${err.message}`
      console.warn(`[${i + 1}/${jobs.length}] ${label}: StoreFinder failed (${err.message})`)
    }

    try {
      const fallback = await scrapeStorePage(page, store)
      if (fallback && (fallback.storeNumber || fallback.storeName)) {
        record = {
          ...record,
          method: "store-page",
          storeName: fallback.storeName || "",
          storeNumber: formatStoreNumber(fallback.storeNumber),
          url: fallback.url || buildStoreUrl(store),
          address: fallback.address || record.address,
          city: fallback.city || record.city,
          state: fallback.state || record.state,
          zip: fallback.zip || record.zip,
          phone: fallback.phone || record.phone,
          notes: record.notes,
        }
        console.log(
          `[${i + 1}/${jobs.length}] ${label}: store page -> ${record.storeName || "name missing"} ${
            record.storeNumber ? `#${record.storeNumber}` : ""
          }`,
        )
      } else {
        record.notes = record.notes || "No data via StoreFinder or store page"
        console.log(`[${i + 1}/${jobs.length}] ${label}: no data`)
      }
    } catch (err) {
      record.notes = `Store page error: ${err.message}`
      console.warn(`[${i + 1}/${jobs.length}] ${label}: store page failed (${err.message})`)
    }

    results.push(record)
    if (i < jobs.length - 1) {
      await page.waitForTimeout(CONFIG.delayBetween)
    }
  }

  await browser.close()

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2))
  console.log(`Done. Saved ${results.length} rows to ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
