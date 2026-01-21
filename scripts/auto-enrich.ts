import { chromium } from "playwright"
import fs from "fs"
import path from "path"
import { normalizeSku, validateSku } from "../lib/sku"

// Configuration
const INPUT_FILE = path.join(process.cwd(), "data", "skus-to-enrich.txt")
const OUTPUT_FILE = path.join(process.cwd(), ".local", "enrichment-upload.csv")
const STATUS_FILE = path.join(process.cwd(), ".local", "enrichment-status.json")
const SEARCH_URL_BASE = "https://www.homedepot.com/s"
const MIN_DELAY_MS = 15000 // 15 seconds
const MAX_DELAY_MS = 45000 // 45 seconds
const MAX_ERROR_RETRIES = 1

// Ensure directories exist
if (!fs.existsSync(path.dirname(INPUT_FILE))) {
  fs.mkdirSync(path.dirname(INPUT_FILE), { recursive: true })
}
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
}

// Helper to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomDelay = () =>
  Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1) + MIN_DELAY_MS)

type StatusEntry = {
  status: "enriched" | "not_found" | "error" | "invalid" | "mismatch"
  attemptCount: number
  lastAttemptedAt: string
  lastReason?: string
}

type StatusCache = Record<string, StatusEntry>

function loadStatusCache(): StatusCache {
  if (!fs.existsSync(STATUS_FILE)) return {}
  try {
    const raw = fs.readFileSync(STATUS_FILE, "utf-8")
    const parsed = JSON.parse(raw) as StatusCache
    return parsed || {}
  } catch (error) {
    console.log(`⚠️ Could not read status cache: ${error}`)
    return {}
  }
}

function saveStatusCache(cache: StatusCache) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(cache, null, 2))
}

function shouldSkipSku(entry?: StatusEntry): boolean {
  if (!entry) return false
  return (
    entry.status === "enriched" ||
    entry.status === "invalid" ||
    entry.status === "not_found" ||
    entry.status === "mismatch" ||
    entry.status === "error"
  )
}

function setStatus(cache: StatusCache, sku: string, status: StatusEntry["status"], reason: string) {
  const existing = cache[sku]
  const attemptCount = (existing?.attemptCount ?? 0) + 1
  const entry: StatusEntry = {
    status,
    attemptCount,
    lastAttemptedAt: new Date().toISOString(),
    lastReason: reason,
  }

  cache[sku] = entry
  saveStatusCache(cache)
}

async function main() {
  console.log("🚀 Starting Autonomous Enrichment Agent...")

  // 1. Read SKUs
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Input file not found: ${INPUT_FILE}`)
    console.log("Please create this file and add SKUs (one per line).")
    process.exit(1)
  }

  const statusCache = loadStatusCache()
  const fileContent = fs.readFileSync(INPUT_FILE, "utf-8")
  const skus: string[] = []
  const seen = new Set<string>()
  const forceMode = process.argv.includes("--force")

  for (const raw of fileContent.split("\n").map((line) => line.trim())) {
    if (!raw) continue
    const { normalized, error } = validateSku(raw)
    if (error) {
      console.log(`⚠️ Skipping invalid SKU "${raw}": ${error}`)
      if (normalized) {
        setStatus(statusCache, normalized, "invalid", error)
      }
      continue
    }
    if (!seen.has(normalized)) {
      skus.push(normalized)
      seen.add(normalized)
    }
  }

  if (skus.length === 0) {
    console.log("⚠️ No valid SKUs found in input file.")
    process.exit(0)
  }

  console.log(`📋 Found ${skus.length} SKUs to process.`)

  // 2. Launch Browser
  const browser = await chromium.launch({
    headless: false, // Headed mode for "respectful" scraping and debugging
    args: ["--start-maximized"], // Look like a real user
  })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })
  const page = await context.newPage()

  // 3. Process SKUs
  let enrichedCount = 0
  let notFoundCount = 0
  let errorCount = 0
  let skippedCount = 0
  let mismatchCount = 0

  for (let index = 0; index < skus.length; index++) {
    const sku = skus[index]
    console.log(`\n🔍 Processing SKU: ${sku} (${index + 1}/${skus.length})`)

    const cacheEntry = statusCache[sku]
    if (!forceMode && shouldSkipSku(cacheEntry)) {
      console.log(`   Skipping due to status: ${cacheEntry?.status}`)
      skippedCount++
      continue
    }

    for (let attempt = 0; attempt <= MAX_ERROR_RETRIES; attempt++) {
      try {
        // Navigate
        const url = `${SEARCH_URL_BASE}/${sku}?NCNI-5`
        console.log(`   Searching: ${url}`)

        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })

        // Wait for some content to load
        try {
          await page.waitForSelector("h1", { timeout: 10000 })
        } catch (e) {
          console.log("   ⚠️ Timeout waiting for h1, page might be 404 or captcha.")
        }

        const productUrl = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll("a[href]"))
          const candidates = anchors
            .map((a) => a.getAttribute("href") || "")
            .map((href) => {
              try {
                return new URL(href, window.location.origin).toString()
              } catch {
                return ""
              }
            })
            .filter((href) => /\/p\/[^/]+\/\d{6,12}/.test(href))

          return candidates[0] || ""
        })

        if (!productUrl) {
          console.log("   ❌ No product link found from search results.")
          setStatus(statusCache, sku, "not_found", "No product link in search results.")
          notFoundCount++
          break
        }

        console.log(`   Product page: ${productUrl}`)
        await page.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 60000 })

        // Human-like behavior: Scroll down a bit
        await page.evaluate(() => window.scrollBy(0, 500))
        await sleep(1000)

        // Extract Data (using logic ported from bookmarklet)
        const data = await page.evaluate(() => {
          // --- Product Extraction Start ---
          function text(sel: string) {
            var el = document.querySelector(sel)
            return el && el.textContent ? el.textContent.replace(/\s+/g, " ").trim() : ""
          }
          function attr(sel: string, a: string) {
            var el = document.querySelector(sel)
            return el ? el.getAttribute(a) || "" : ""
          }
          function pickFirstNonEmpty(arr: string[]) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i]) return arr[i]
            }
            return ""
          }
          function matchDigits(s: string, min: number, max: number) {
            var m = (s || "").match(new RegExp("\\b\\d{" + min + "," + max + "}\\b"))
            return m ? m[0] : ""
          }

          function getInternetNumberFromUrl() {
            var m = (location.pathname || "").match(/\/p\/[^/]+\/(\d{6,12})/)
            return m ? m[1] : ""
          }

          function getJsonLdProduct() {
            var scripts = Array.from(
              document.querySelectorAll('script[type="application/ld+json"]')
            )
            for (var i = 0; i < scripts.length; i++) {
              try {
                var json = JSON.parse(scripts[i].textContent || "")
                var items = Array.isArray(json) ? json : [json]
                for (var j = 0; j < items.length; j++) {
                  var item = items[j]
                  var type = item && item["@type"]
                  if (
                    type &&
                    (type === "Product" || (Array.isArray(type) && type.includes("Product")))
                  ) {
                    return item
                  }
                }
              } catch (e) {
                // ignore parse errors
              }
            }
            return null
          }

          function getSku() {
            var candidates = []
            candidates.push(matchDigits(text('[data-testid="product-sku"]'), 6, 10))
            candidates.push(matchDigits(text(".product-identifier__sku"), 6, 10))
            candidates.push(matchDigits(text('span[itemprop="sku"]'), 6, 10))
            var body = document.body && document.body.innerText ? document.body.innerText : ""
            var m = body.match(/Store\s*SKU\s*#?\s*(\d{6,10})/i)
            if (m && m[1]) candidates.push(m[1])
            m = body.match(/\bSKU\b[^\d]{0,20}(\d{6,10})/i)
            if (m && m[1]) candidates.push(m[1])
            return pickFirstNonEmpty(candidates)
          }

          function getName() {
            return pickFirstNonEmpty([
              text('h1[data-testid="product-title"]'),
              text("h1.product-details__title"),
              text("h1"),
              attr('meta[property="og:title"]', "content"),
            ])
          }

          function getImageUrl() {
            var url = attr('meta[property="og:image"]', "content")
            if (!url) {
              var img = document.querySelector(
                'img[src*="thdstatic.com"],img[data-src*="thdstatic.com"],img[srcset*="thdstatic.com"]'
              )
              if (img) {
                url = img.getAttribute("src") || img.getAttribute("data-src") || ""
              }
            }
            if (url) {
              try {
                var parsed = new URL(
                  url,
                  window.location && window.location.href ? window.location.href : undefined
                )
                var hostname = parsed.hostname.toLowerCase()
                var isAllowedHost =
                  hostname === "thdstatic.com" || hostname.endsWith(".thdstatic.com")
                if (isAllowedHost) {
                  url = url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
                }
              } catch (e) {
                // If URL parsing fails, leave the URL unchanged.
              }
            }
            return url
          }

          function findSpecValue(label: string) {
            var rows = document.querySelectorAll("tr,dt")
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i]
              if (row.tagName && row.tagName.toLowerCase() === "tr") {
                var cells = row.querySelectorAll("th,td")
                if (cells.length >= 2) {
                  var k = (cells[0].textContent || "").replace(/\s+/g, " ").trim()
                  if (k && k.toLowerCase() === label.toLowerCase()) {
                    return (cells[1].textContent || "").replace(/\s+/g, " ").trim()
                  }
                }
              }
              if (row.tagName && row.tagName.toLowerCase() === "dt") {
                var key = (row.textContent || "").replace(/\s+/g, " ").trim()
                if (key && key.toLowerCase() === label.toLowerCase()) {
                  var dd = row.nextElementSibling
                  if (dd && dd.tagName && dd.tagName.toLowerCase() === "dd") {
                    return (dd.textContent || "").replace(/\s+/g, " ").trim()
                  }
                }
              }
            }
            return ""
          }

          function getBrand() {
            return pickFirstNonEmpty([
              text('[data-testid="product-brand"]'),
              attr('meta[itemprop="brand"]', "content"),
              findSpecValue("Brand"),
              findSpecValue("Manufacturer"),
            ])
          }
          function getModel() {
            return pickFirstNonEmpty([
              findSpecValue("Model"),
              findSpecValue("Model #"),
              findSpecValue("Model Number"),
            ])
          }

          var jsonLdProduct = getJsonLdProduct()
          var jsonLdBrand =
            jsonLdProduct && jsonLdProduct.brand
              ? typeof jsonLdProduct.brand === "string"
                ? jsonLdProduct.brand
                : jsonLdProduct.brand.name || ""
              : ""
          var jsonLdImage = ""
          if (jsonLdProduct && jsonLdProduct.image) {
            if (Array.isArray(jsonLdProduct.image)) {
              jsonLdImage = jsonLdProduct.image[0] || ""
            } else if (typeof jsonLdProduct.image === "object" && jsonLdProduct.image.url) {
              jsonLdImage = jsonLdProduct.image.url
            } else {
              jsonLdImage = jsonLdProduct.image
            }
          }

          // --- Product Extraction End ---

          var imageUrl = jsonLdImage || getImageUrl()
          if (imageUrl) {
            try {
              var parsed = new URL(imageUrl)
              var hostname = parsed.hostname
              if (hostname === "thdstatic.com" || hostname.endsWith(".thdstatic.com")) {
                imageUrl = imageUrl.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
              }
            } catch (e) {
              // If the URL is invalid or cannot be parsed, leave imageUrl unchanged
            }
          }

          return {
            sku: (jsonLdProduct && jsonLdProduct.sku) || getSku(),
            internetSku: getInternetNumberFromUrl(),
            name: (jsonLdProduct && jsonLdProduct.name) || getName(),
            brand: jsonLdBrand || getBrand(),
            model: (jsonLdProduct && (jsonLdProduct.mpn || jsonLdProduct.model)) || getModel(),
            imageUrl: imageUrl,
          }
        })

        const extractedSku = data.sku ? normalizeSku(data.sku) : ""
        if (extractedSku && extractedSku !== sku) {
          console.log(`   ❌ SKU mismatch. Expected ${sku}, got ${extractedSku}`)
          setStatus(statusCache, sku, "mismatch", `SKU mismatch: ${extractedSku}`)
          mismatchCount++
          break
        }

        if (data.name && data.internetSku) {
          console.log(`   ✅ Found: ${data.name.substring(0, 40)}...`)
          console.log(`      Image: ${data.imageUrl ? "Yes" : "No"}`)
          console.log(`      Internet SKU: ${data.internetSku}`)

          // Append to CSV
          const csvRow = {
            "Home Depot SKU (6 or 10 digits)": sku,
            "IMAGE URL": data.imageUrl,
            "INTERNET SKU": data.internetSku,
            Name: data.name,
            Brand: data.brand,
            Model: data.model,
            "Date Added": new Date().toISOString(),
          }

          // Check if file exists to determine if we need headers
          const fileExists = fs.existsSync(OUTPUT_FILE)
          let csvContent = ""

          // Simple CSV escaping
          const escapeCsv = (val: string) => {
            if (val === null || val === undefined) return ""
            const str = String(val)
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`
            }
            return str
          }

          const rowValues = [
            csvRow["Home Depot SKU (6 or 10 digits)"],
            csvRow["IMAGE URL"],
            csvRow["INTERNET SKU"],
            csvRow["Name"],
            csvRow["Brand"],
            csvRow["Model"],
            csvRow["Date Added"],
          ].map(escapeCsv)

          const headerValues = Object.keys(csvRow).map(escapeCsv)

          if (!fileExists) {
            csvContent = headerValues.join(",") + "\n" + rowValues.join(",") + "\n"
          } else {
            csvContent = rowValues.join(",") + "\n"
          }

          fs.appendFileSync(OUTPUT_FILE, csvContent)
          console.log(`   💾 Saved to ${path.basename(OUTPUT_FILE)}`)
          setStatus(statusCache, sku, "enriched", "Enriched successfully.")
          enrichedCount++
        } else {
          console.log("   ❌ Could not extract product data from page.")
          setStatus(statusCache, sku, "not_found", "Missing name or internet SKU.")
          notFoundCount++
        }
        break
      } catch (error) {
        console.error(`   ❌ Error processing SKU ${sku}:`, error)
        if (attempt < MAX_ERROR_RETRIES) {
          console.log("   ⚠️ Retrying once due to error...")
          continue
        }
        setStatus(statusCache, sku, "error", `Error: ${error}`)
        errorCount++
        break
      }
    }

    if (index < skus.length - 1) {
      const delay = randomDelay()
      console.log(`   ⏳ Waiting ${Math.round(delay / 1000)}s before next item...`)
      await sleep(delay)
    }
  }

  console.log("\n🎉 Batch complete!")
  console.log(`   Enriched: ${enrichedCount}`)
  console.log(`   Not found: ${notFoundCount}`)
  console.log(`   Mismatch: ${mismatchCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  await browser.close()
}

main().catch(console.error)
