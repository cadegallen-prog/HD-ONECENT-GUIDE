#!/usr/bin/env node
/**
 * Home Depot Store Enrichment Scraper - URL-based
 *
 * Enriches home_depot_stores_2025-11-27.json with scraped store data
 * Input: URLs with empty fields for name, storeNumber, address, phone, hours
 * Output: Fully populated store data
 *
 * Features:
 * - Parallel processing (5 workers) for 1-hour runtime on 1800 stores
 * - Multiple selector strategies (JSON-LD, CSS selectors, regex fallbacks)
 * - Retry logic with exponential backoff
 * - Real-time progress tracking with ETA
 * - Automatic partial result saving
 */

const fs = require("fs")
const path = require("path")
const { chromium } = require("playwright")

const CONFIG = {
  // Use a fresh profile directory to avoid corrupted sessions
  userDataDir: path.join(process.env.LOCALAPPDATA || "", "HD-Scraper-Profile-2"),
  delayBetween: 3500,  // base delay between requests
  delayVariation: 1500,  // wider jitter to avoid a fixed cadence  // ±0.5 second variation
  headless: false,
  maxRetries: 2,
  retryDelay: 3000,
  parallelContexts: 1,  // safest: single worker
  coolOffMsOnErrorPage: 60000, // pause when bot/error page is seen
}

// Get input/output paths from command line
const INPUT_PATH = process.argv[2] || path.join(process.env.USERPROFILE, "Downloads", "home_depot_stores_2025-11-27.json")
const OUTPUT_PATH = INPUT_PATH.replace(".json", ".enriched.json")

/**
 * Random delay helper to avoid pattern detection
 */
function randomDelay(base, variation) {
  const delay = base + (Math.random() * variation * 2 - variation)
  return Math.max(delay, 500) // Minimum 0.5 second
}

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = CONFIG.maxRetries) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        const delay = CONFIG.retryDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

/**
 * Enhanced store page scraper with multiple selector strategies
 */
async function scrapeStorePage(page, store) {
  const url = store.url

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 })
  await page.waitForTimeout(1000)

  // Check for error page and cool off if we hit the bot wall
  const content = await page.content()
  if (content.includes("Oops!! Something went wrong") || content.toLowerCase().includes("error page")) {
    const coolOff = CONFIG.coolOffMsOnErrorPage || 0
    if (coolOff > 0) {
      await page.waitForTimeout(coolOff)
    }
    throw new Error("Error page returned")
  }

  return page.evaluate(() => {
    // Get page text and title for fallback extraction
    const text = document.body?.innerText || ""
    const title = document.querySelector("title")?.textContent || ""

    // Try to find JSON-LD structured data
    let jsonLdData = null
    const jsonLd = document.querySelector('script[type="application/ld+json"]')
    if (jsonLd) {
      try {
        jsonLdData = JSON.parse(jsonLd.textContent)
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    // 1. STORE NAME - Use actual Home Depot selector
    let name = ""
    const nameEl = document.querySelector('.sui-h1-display > span:nth-child(1)')
    if (nameEl?.textContent) {
      name = nameEl.textContent.trim()
    }
    // Fallback: title extraction
    if (!name) {
      const titleMatch = title.match(/^(?:The\s+)?(.*?)(?:\s+-\s+)?(?:Home\s+Depot)/i)
      if (titleMatch && titleMatch[1]) {
        name = titleMatch[1].trim()
      }
    }
    // Last resort: Extract from URL path
    if (!name) {
      const urlParts = location.pathname.split('/')
      if (urlParts.length > 2) {
        const namePart = urlParts[2]
        if (namePart && !/^\d+$/.test(namePart)) {
          name = namePart.replace(/-/g, ' ')
        }
      }
    }

    // 2. STORE NUMBER - Use actual Home Depot selector
    let number = ""
    const numberEl = document.querySelector('.sui-h1-display > span:nth-child(2)')
    if (numberEl?.textContent) {
      const numMatch = numberEl.textContent.match(/(\d{1,5})/)
      if (numMatch) {
        number = numMatch[1]
      }
    }
    // Fallback: page text search
    if (!number) {
      const numberMatch = text.match(/Store\s*#\s*(\d{1,5})/i) ||
                          title.match(/Store\s*#\s*(\d{1,5})/i)
      if (numberMatch) {
        number = numberMatch[1]
      }
    }
    // Last fallback: Extract from URL (last segment is usually store number)
    if (!number) {
      const urlMatch = location.pathname.match(/\/(\d{3,5})$/)
      if (urlMatch) {
        number = urlMatch[1]
      }
    }

    // 3. ADDRESS - Use actual Home Depot selector
    let address = ""
    const addressEl = document.querySelector('div.sui-ml-2:nth-child(1)')
    if (addressEl?.textContent) {
      address = addressEl.textContent.trim()
    }

    // Fallback: JSON-LD structured data
    if (!address && jsonLdData && jsonLdData.address) {
      const addr = jsonLdData.address
      address = addr.streetAddress || ""
    }

    // 4. PHONE NUMBER - Use actual Home Depot selector
    let phone = ""
    const phoneEl = document.querySelector('div.sui-gap-8:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(2) > a:nth-child(1)')
    if (phoneEl) {
      phone = phoneEl.textContent?.trim() || phoneEl.getAttribute('href')?.replace('tel:', '') || ""
    }

    // Fallback: JSON-LD
    if (!phone && jsonLdData && jsonLdData.telephone) {
      phone = jsonLdData.telephone
    }

    // 5. STORE HOURS - Use actual Home Depot selector
    let hours = {
      weekday: "",      // Monday-Friday
      saturday: "",     // Saturday
      sunday: ""        // Sunday
    }

    const hoursEl = document.querySelector('div.sui-grid-cols-2:nth-child(2) > div:nth-child(1)')
    if (hoursEl) {
      const hoursText = hoursEl.textContent

      // Parse weekday hours (Mon-Fri)
      const weekdayMatch = hoursText.match(/(?:Mon(?:day)?.*?Fri(?:day)?|Monday\s*-\s*Friday):?\s*(\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M)/i)
      if (weekdayMatch) {
        hours.weekday = `Mon-Fri: ${weekdayMatch[1].trim()}`
      }

      // Parse Saturday hours
      const satMatch = hoursText.match(/Sat(?:urday)?:?\s*(\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M)/i)
      if (satMatch) {
        hours.saturday = `Sat: ${satMatch[1].trim()}`
      }

      // Parse Sunday hours
      const sunMatch = hoursText.match(/Sun(?:day)?:?\s*(\d{1,2}:\d{2}\s*[AP]M\s*-\s*\d{1,2}:\d{2}\s*[AP]M)/i)
      if (sunMatch) {
        hours.sunday = `Sun: ${sunMatch[1].trim()}`
      }
    }

    return {
      name: name || "",
      storeNumber: number || "",
      address: address || "",
      phone: phone || "",
      hours: hours,
    }
  })
}

/**
 * Worker function to scrape stores in one browser context
 */
async function scrapeWorker(browser, stores, workerId, progressCallback) {
  const page = await browser.newPage()
  const results = []

  for (let i = 0; i < stores.length; i++) {
    const store = stores[i]
    const label = store.url?.split('/').pop() || `worker-${workerId}-${i}`

    try {
      const enriched = await retryWithBackoff(async () => {
        return await scrapeStorePage(page, store)
      })

      if (enriched && (enriched.storeNumber || enriched.name || enriched.address || enriched.phone)) {
        results.push({ ...store, ...enriched })
        progressCallback('success', workerId, i, stores.length)
      } else {
        results.push(store)
        progressCallback('skip', workerId, i, stores.length)
      }
    } catch (err) {
      results.push(store)
      progressCallback('fail', workerId, i, stores.length, err.message)
    }

    // Random delay between requests
    if (i < stores.length - 1) {
      const delay = randomDelay(CONFIG.delayBetween, CONFIG.delayVariation)
      await page.waitForTimeout(delay)
    }
  }

  await page.close()
  return results
}

/**
 * Main function
 */
async function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Missing input file: ${INPUT_PATH}`)
    console.error(`Usage: node enrich-from-urls.js <path-to-json> [limit]`)
    process.exit(1)
  }

  // Load base input and merge in any previously enriched output so we don't rescrape completed rows
  const baseInput = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"))
  let stores = baseInput
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"))
      const prevByUrl = new Map()
      for (const s of prev) {
        if (s && s.url) {
          prevByUrl.set(s.url, s)
        }
      }
      stores = baseInput.map((s) => prevByUrl.get(s.url) || s)
    } catch (err) {
      console.warn(`Warning: could not read previous output ${OUTPUT_PATH}: ${err.message}`)
    }
  }
  const limit = process.argv[3] ? Number(process.argv[3]) : undefined
  const baseJobs = typeof limit === "number" && !isNaN(limit) ? stores.slice(0, limit) : stores
  const jobs = baseJobs.filter((s) => !s.storeNumber || String(s.storeNumber).trim().length === 0)
  const alreadyEnriched = baseJobs.length - jobs.length

  console.log(`\n📦 Home Depot Store Enrichment Scraper`)
  console.log(`Input: ${INPUT_PATH}`)
  console.log(`Stores to process (missing storeNumber): ${jobs.length}`)
  if (alreadyEnriched > 0) {
    console.log(`Already enriched (skipped): ${alreadyEnriched}`)
  }
  console.log(`Parallel workers: ${CONFIG.parallelContexts}`)
  console.log(`Delay per request: ${CONFIG.delayBetween}ms ±${CONFIG.delayVariation}ms\n`)

  // Launch browser
  const browser = await chromium.launchPersistentContext(CONFIG.userDataDir, {
    channel: "msedge",
    headless: CONFIG.headless,
    viewport: { width: 1280, height: 900 },
  })

  // Warm up - visit homepage to establish session
  console.log("🔥 Warming up browser session...")
  const page = await browser.newPage()
  await page.goto("https://www.homedepot.com/", { waitUntil: "domcontentloaded", timeout: 45000 })
  await page.waitForTimeout(3000)
  await page.close()
  console.log("✅ Session established\n")

  // Split stores into chunks for parallel processing
  const chunkSize = Math.ceil(jobs.length / CONFIG.parallelContexts)
  const chunks = []
  for (let i = 0; i < CONFIG.parallelContexts; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, jobs.length)
    if (start < jobs.length) {
      chunks.push(jobs.slice(start, end))
    }
  }

  console.log(`🚀 Starting ${chunks.length} parallel workers`)
  console.log(`   Each worker handles ~${chunkSize} stores`)
  console.log(`   Estimated time: ${Math.ceil((chunkSize * 1.5) / 60)} minutes\n`)

  // Progress tracking
  let completed = 0
  let updated = 0
  let failed = 0
  const startTime = Date.now()

  function progressCallback(status, workerId, index, total, error) {
    completed++
    if (status === 'success') updated++
    if (status === 'fail') failed++

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const rate = completed / Math.max(elapsed, 1)
    const remaining = jobs.length - completed
    const eta = remaining / rate

    const progressBar = Math.floor((completed / jobs.length) * 20)
    const bar = '█'.repeat(progressBar) + '░'.repeat(20 - progressBar)

    console.log(
      `[W${workerId}] ${index + 1}/${total} │ ` +
      `${bar} ${Math.floor((completed / jobs.length) * 100)}% │ ` +
      `${completed}/${jobs.length} │ ` +
      `✓${updated} ✗${failed} │ ` +
      `ETA: ${Math.floor(eta / 60)}m ${Math.floor(eta % 60)}s`
    )
  }

  // Run all workers in parallel
  const allResults = await Promise.all(
    chunks.map((chunk, i) => scrapeWorker(browser, chunk, i + 1, progressCallback))
  )

  // Flatten results
  const scraped = allResults.flat()
  const byUrl = new Map()
  for (const s of scraped) {
    if (s && s.url) {
      byUrl.set(s.url, s)
    }
  }
  const results = stores.map((s) => byUrl.get(s.url) || s)

  await browser.close()

  // Summary
  const totalTime = Math.floor((Date.now() - startTime) / 1000)
  console.log(`\n${'='.repeat(60)}`)
  console.log(`✅ COMPLETED in ${Math.floor(totalTime / 60)}m ${totalTime % 60}s`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Total stores: ${jobs.length}`)
  console.log(`✓ Successfully enriched: ${updated} (${Math.floor((updated / jobs.length) * 100)}%)`)
  console.log(`⊘ Skipped (no data): ${jobs.length - updated - failed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`Average: ${(totalTime / jobs.length).toFixed(2)}s per store`)
  console.log(`${'='.repeat(60)}\n`)

  // Save results
  console.log(`💾 Saving results to: ${OUTPUT_PATH}`)
  const tmpPath = `${OUTPUT_PATH}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(results, null, 2), "utf8")
  fs.renameSync(tmpPath, OUTPUT_PATH)
  console.log(`✅ Saved ${results.length} stores\n`)

  // Sample output
  const enrichedSample = results.filter(s => s.storeNumber).slice(0, 3)
  if (enrichedSample.length > 0) {
    console.log(`📋 Sample enriched stores:`)
    enrichedSample.forEach(s => {
      console.log(`   ${s.name || 'Unknown'} (#${s.storeNumber || 'N/A'}) - ${s.address || 'No address'}`)
    })
  }
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err)
  process.exit(1)
})

