/**
 * Stealth Home Depot Scraper
 *
 * Uses playwright-extra with stealth plugin to avoid detection.
 * Includes: fingerprint randomization, jitter delays, human-like behavior.
 *
 * Usage:
 *   npx tsx scripts/stealth-enrich.ts
 *   npx tsx scripts/stealth-enrich.ts --input data/skus.txt --limit 10 --headless
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import { chromium } from "playwright-extra"
import type { Page } from "playwright"
// @ts-expect-error - stealth plugin types are for puppeteer but works with playwright-extra
import StealthPlugin from "puppeteer-extra-plugin-stealth"

// Add stealth plugin
chromium.use(StealthPlugin())

// Load env
config({ path: resolve(process.cwd(), ".env.local") })

// Config
const INPUT_FILE = "data/skus-to-enrich.txt"
const OUTPUT_FILE = ".local/stealth-enrichment.csv"

// Proxy config (Webshare format: http://user:pass@proxy.webshare.io:port)
// Get from: https://www.webshare.io/ (~$5.49/mo for residential)
const PROXY_URL = process.env.WEBSHARE_PROXY || process.env.PROXY_URL

// Jitter: random delays to appear human
const JITTER = {
  pageLoad: { min: 3000, max: 8000 }, // Wait after page load
  scroll: { min: 500, max: 2000 }, // Between scroll actions
  between: { min: 20000, max: 45000 }, // Between SKUs (aggressive)
  type: { min: 50, max: 150 }, // Typing speed per char
}

// Random user agents (rotate to avoid fingerprinting)
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
]

// Random viewports
const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
]

// Random timezones
const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
]

// Helpers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomChoice = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)]
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (range: { min: number; max: number }) => sleep(randomInt(range.min, range.max))

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2)
  let input = INPUT_FILE
  let limit = 50
  let headless = false
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) input = args[++i]
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10)
    if (args[i] === "--headless") headless = true
    if (args[i] === "--dry-run") dryRun = true
  }

  return { input, limit, headless, dryRun }
}

// Normalize SKU
function normalizeSku(sku: string): string | null {
  const str = String(sku).trim().replace(/\D/g, "")
  if (str.length === 6) return str
  if (str.length === 10 && (str.startsWith("100") || str.startsWith("101"))) return str
  return null
}

// Optimize image URL
function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null

  let hostname: string | null = null
  try {
    const parsed = new URL(url)
    hostname = parsed.hostname
  } catch {
    // If URL parsing fails, fall back to returning the original URL
    return url
  }

  const isThdstaticHost =
    hostname === "thdstatic.com" || hostname.endsWith(".thdstatic.com")

  if (isThdstaticHost) {
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
  }
  return url
}

// Human-like mouse movement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function humanMouseMove(page: any) {
  const viewport = page.viewportSize()
  if (!viewport) return

  // Random movements
  const moves = randomInt(2, 5)
  for (let i = 0; i < moves; i++) {
    const x = randomInt(100, viewport.width - 100)
    const y = randomInt(100, viewport.height - 100)
    await page.mouse.move(x, y, { steps: randomInt(5, 15) })
    await sleep(randomInt(100, 300))
  }
}

// Human-like scrolling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function humanScroll(page: any) {
  const scrolls = randomInt(2, 4)
  for (let i = 0; i < scrolls; i++) {
    const amount = randomInt(200, 600)
    await page.evaluate((y) => window.scrollBy({ top: y, behavior: "smooth" }), amount)
    await jitter(JITTER.scroll)
  }
}

// Extract data from page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function extractData(page: any, inputSku: string) {
  return page.evaluate((sku) => {
    const text = (sel: string) => {
      const el = document.querySelector(sel)
      return el?.textContent?.replace(/\s+/g, " ").trim() || ""
    }
    const attr = (sel: string, a: string) => document.querySelector(sel)?.getAttribute(a) || ""

    // SKU
    let foundSku = ""
    const skuSelectors = [
      '[data-testid="product-sku"]',
      ".product-identifier__sku",
      'span[itemprop="sku"]',
    ]
    for (const sel of skuSelectors) {
      const match = text(sel).match(/\d{6,10}/)
      if (match) {
        foundSku = match[0]
        break
      }
    }
    if (!foundSku) {
      const bodyMatch = document.body.innerText.match(/Store\s*SKU\s*#?\s*(\d{6,10})/i)
      if (bodyMatch) foundSku = bodyMatch[1]
    }

    // Title
    const title =
      text('h1[data-testid="product-title"]') ||
      text("h1.product-details__title") ||
      text("h1") ||
      attr('meta[property="og:title"]', "content")

    // Brand
    const brand = text('[data-testid="product-brand"]') || attr('meta[itemprop="brand"]', "content")

    // Image
    let imageUrl = attr('meta[property="og:image"]', "content")
    if (!imageUrl) {
      const img = document.querySelector('img[src*="thdstatic.com"]') as HTMLImageElement
      if (img) imageUrl = img.src
    }

    // Internet number from URL
    const urlMatch = location.pathname.match(/\/p\/[^/]+\/(\d{9,12})/)
    const internetSku = urlMatch ? urlMatch[1] : ""

    // Model
    let model = ""
    const rows = document.querySelectorAll("tr")
    for (const row of rows) {
      const cells = row.querySelectorAll("th, td")
      if (cells.length >= 2 && cells[0].textContent?.toLowerCase().includes("model")) {
        model = cells[1].textContent?.trim() || ""
        break
      }
    }

    return {
      sku: foundSku || sku,
      title,
      brand,
      model,
      imageUrl,
      internetSku,
      url: location.href,
    }
  }, inputSku)
}

// Check for captcha/block
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function isBlocked(page: any): Promise<boolean> {
  const content = await page.content()
  const blocked =
    content.includes("Access Denied") ||
    content.includes("captcha") ||
    content.includes("CAPTCHA") ||
    content.includes("robot") ||
    content.includes("blocked") ||
    content.includes("Please verify")

  return blocked
}

async function main() {
  const { input, limit, headless, dryRun } = parseArgs()

  console.log("🥷 Stealth Home Depot Scraper")
  console.log(`   Input: ${input}`)
  console.log(`   Limit: ${limit}`)
  console.log(`   Headless: ${headless}`)
  console.log(`   Dry run: ${dryRun}`)
  console.log()

  // Validate Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  let supabase: ReturnType<typeof createClient> | null = null

  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log("   ✅ Supabase connected")
  } else {
    console.log("   ⚠️ No Supabase - will save to CSV only")
  }

  // Read SKUs
  const inputPath = resolve(process.cwd(), input)
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`)
    process.exit(1)
  }

  const skus = fs
    .readFileSync(inputPath, "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s && /^\d+$/.test(s))
    .map((s) => normalizeSku(s))
    .filter((s): s is string => s !== null)
    .slice(0, limit)

  if (skus.length === 0) {
    console.log("❌ No valid SKUs")
    process.exit(0)
  }

  console.log(`\n📋 ${skus.length} SKUs to process\n`)

  if (dryRun) {
    console.log("🔍 Dry run:")
    skus.forEach((s) => console.log(`   ${s}`))
    process.exit(0)
  }

  // Ensure output dir
  const outputPath = resolve(process.cwd(), OUTPUT_FILE)
  fs.mkdirSync(resolve(process.cwd(), ".local"), { recursive: true })

  // Random fingerprint for this session
  const userAgent = randomChoice(USER_AGENTS)
  const viewport = randomChoice(VIEWPORTS)
  const timezone = randomChoice(TIMEZONES)

  console.log(`🎭 Fingerprint:`)
  console.log(`   UA: ${userAgent.substring(0, 50)}...`)
  console.log(`   Viewport: ${viewport.width}x${viewport.height}`)
  console.log(`   Timezone: ${timezone}`)
  console.log(
    `   Proxy: ${PROXY_URL ? "✅ Configured" : "❌ None (add WEBSHARE_PROXY to .env.local)"}`
  )
  console.log()

  // Parse proxy if provided
  let proxyConfig: { server: string; username?: string; password?: string } | undefined
  if (PROXY_URL) {
    try {
      const proxyUrl = new URL(PROXY_URL)
      proxyConfig = {
        server: `${proxyUrl.protocol}//${proxyUrl.host}`,
        username: proxyUrl.username || undefined,
        password: proxyUrl.password || undefined,
      }
      console.log(`🌐 Using proxy: ${proxyUrl.host}`)
    } catch (e) {
      console.error(`⚠️ Invalid proxy URL, running without proxy`)
    }
  }

  // Launch browser with stealth
  const browser = await chromium.launch({
    headless,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--window-position=0,0",
      `--window-size=${viewport.width},${viewport.height}`,
    ],
  })

  const context = await browser.newContext({
    userAgent,
    viewport,
    timezoneId: timezone,
    locale: "en-US",
    geolocation: { latitude: 40.7128, longitude: -74.006 }, // NYC
    permissions: ["geolocation"],
    colorScheme: "light",
    deviceScaleFactor: randomChoice([1, 1.25, 1.5, 2]),
    proxy: proxyConfig,
  })

  // Add extra headers
  await context.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1",
  })

  const page = await context.newPage()

  // Block unnecessary resources
  await page.route("**/*", (route) => {
    const type = route.request().resourceType()
    if (["image", "stylesheet", "font", "media"].includes(type)) {
      route.abort()
    } else {
      route.continue()
    }
  })

  // Process
  let success = 0
  let failed = 0
  let blocked = 0

  // Warm up with homepage first
  console.log("🔥 Warming up with homepage...")
  try {
    await page.goto("https://www.homedepot.com/", { waitUntil: "domcontentloaded", timeout: 30000 })
    await humanMouseMove(page)
    await humanScroll(page)
    await jitter({ min: 5000, max: 10000 })
  } catch (e) {
    console.log("   ⚠️ Homepage warm-up failed, continuing anyway")
  }

  for (let i = 0; i < skus.length; i++) {
    const sku = skus[i]
    console.log(`\n[${i + 1}/${skus.length}] SKU: ${sku}`)

    try {
      // Navigate to search
      const url = `https://www.homedepot.com/s/${sku}`
      console.log(`   → ${url}`)

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
      await jitter(JITTER.pageLoad)

      // Check for block
      if (await isBlocked(page)) {
        console.log("   🚫 BLOCKED - stopping")
        blocked++
        break // Stop entirely if blocked
      }

      // Human behavior
      await humanMouseMove(page)
      await humanScroll(page)

      // Extract
      const data = await extractData(page, sku)

      if (data.title || data.imageUrl) {
        console.log(`   ✅ ${data.title?.substring(0, 50) || "(no title)"}`)
        console.log(`   📷 Image: ${data.imageUrl ? "Yes" : "No"}`)

        // Save to CSV
        const csvLine = [
          data.sku,
          data.title,
          data.brand,
          data.model,
          optimizeImageUrl(data.imageUrl) || "",
          data.internetSku,
          data.url,
          new Date().toISOString(),
        ]
          .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
          .join(",")

        const needsHeader = !fs.existsSync(outputPath)
        if (needsHeader) {
          fs.writeFileSync(
            outputPath,
            "sku,title,brand,model,image_url,internet_sku,url,scraped_at\n"
          )
        }
        fs.appendFileSync(outputPath, csvLine + "\n")

        // Save to Supabase
        if (supabase) {
          const { error } = await supabase.from("penny_item_enrichment").upsert(
            {
              sku: data.sku,
              item_name: data.title || null,
              brand: data.brand || null,
              model_number: data.model || null,
              image_url: optimizeImageUrl(data.imageUrl),
              home_depot_url: data.url,
              internet_sku: data.internetSku ? parseInt(data.internetSku, 10) : null,
              retail_price: null,
              source: "stealth",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "sku" }
          )
          if (error) {
            console.log(`   ⚠️ DB error: ${error.message}`)
          } else {
            console.log(`   💾 Saved to DB`)
          }
        }

        success++
      } else {
        console.log("   ❌ No data extracted")
        failed++
      }
    } catch (e) {
      console.error(`   ❌ Error: ${e}`)
      failed++
    }

    // Jitter between requests
    if (i < skus.length - 1) {
      const delay = randomInt(JITTER.between.min, JITTER.between.max)
      console.log(`   ⏳ Waiting ${Math.round(delay / 1000)}s...`)
      await sleep(delay)
    }
  }

  await browser.close()

  console.log("\n🎉 Done!")
  console.log(`   Success: ${success}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Blocked: ${blocked}`)
  console.log(`   CSV: ${outputPath}`)
}

main().catch(console.error)
