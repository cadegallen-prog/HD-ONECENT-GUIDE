import { chromium } from "playwright"
import fs from "fs"
import path from "path"

// Configuration
const INPUT_FILE = path.join(process.cwd(), "data", "skus-to-enrich.txt")
const OUTPUT_FILE = path.join(process.cwd(), ".local", "enrichment-upload.csv")
const MIN_DELAY_MS = 15000 // 15 seconds
const MAX_DELAY_MS = 45000 // 45 seconds

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

async function main() {
  console.log("🚀 Starting Autonomous Enrichment Agent...")

  // 1. Read SKUs
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Input file not found: ${INPUT_FILE}`)
    console.log("Please create this file and add SKUs (one per line).")
    process.exit(1)
  }

  const fileContent = fs.readFileSync(INPUT_FILE, "utf-8")
  const skus = fileContent
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s && /^\d+$/.test(s)) // Simple validation

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
  let processedCount = 0

  for (const sku of skus) {
    console.log(`\n🔍 Processing SKU: ${sku} (${processedCount + 1}/${skus.length})`)

    try {
      // Check if already enriched (optional optimization, skipping for now to allow updates)

      // Navigate
      const url = `https://www.homedepot.com/s/${sku}`
      console.log(`   Navigating to: ${url}`)

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })

      // Wait for some content to load
      try {
        await page.waitForSelector("h1", { timeout: 10000 })
      } catch (e) {
        console.log("   ⚠️ Timeout waiting for h1, page might be 404 or captcha.")
      }

      // Human-like behavior: Scroll down a bit
      await page.evaluate(() => window.scrollBy(0, 500))
      await sleep(1000)

      // Extract Data (using logic ported from bookmarklet)
      const data = await page.evaluate(() => {
        // --- Bookmarklet Logic Start ---
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
          if (url && url.indexOf("thdstatic.com") !== -1) {
            url = url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
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

        // --- Bookmarklet Logic End ---

        return {
          sku: getSku(),
          internetSku: getInternetNumberFromUrl(),
          name: getName(),
          brand: getBrand(),
          model: getModel(),
          imageUrl: getImageUrl(),
        }
      })

      if (data.sku) {
        console.log(`   ✅ Found: ${data.name.substring(0, 40)}...`)
        console.log(`      Image: ${data.imageUrl ? "Yes" : "No"}`)
        console.log(`      Internet SKU: ${data.internetSku}`)

        // Append to CSV
        const csvRow = {
          "Home Depot SKU (6 or 10 digits)": data.sku,
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
      } else {
        console.log("   ❌ Could not extract SKU/Data from page.")
      }
    } catch (error) {
      console.error(`   ❌ Error processing SKU ${sku}:`, error)
    }

    processedCount++
    if (processedCount < skus.length) {
      const delay = randomDelay()
      console.log(`   ⏳ Waiting ${Math.round(delay / 1000)}s before next item...`)
      await sleep(delay)
    }
  }

  console.log("\n🎉 Batch complete!")
  await browser.close()
}

main().catch(console.error)
