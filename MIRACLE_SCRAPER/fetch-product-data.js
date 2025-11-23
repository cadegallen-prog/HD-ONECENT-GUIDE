#!/usr/bin/env node
/**
 * Home Depot Scraper - Sequential (avoids detection)
 */

const fs = require("fs")
const path = require("path")
const { chromium } = require("playwright")

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

const CONFIG = {
  userDataDir: path.join(process.env.LOCALAPPDATA || '', 'HD-Scraper-Profile'),
  delayBetween: 2000
}

const ROOT_DIR = path.resolve(__dirname, "..")
const DEFAULT_PURCHASE_HISTORY = path.join(
  ROOT_DIR,
  "Purchase_History_November-22-2025_11-44-PM.csv"
)

function parseSkus(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#"))
}

function splitCsvLine(line, maxColumns) {
  const cols = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (ch === '"') {
      // handle escaped quotes ("")
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      cols.push(current)
      current = ""

      if (maxColumns && cols.length === maxColumns - 1) {
        current = line.slice(i + 1)
        break
      }
    } else {
      current += ch
    }
  }

  cols.push(current)
  return cols
}

function parsePurchaseHistoryCsv(csvPath) {
  const content = fs.readFileSync(csvPath, "utf8")
  const lines = content.split(/\r?\n/)
  const itemsMap = new Map()

  // Locate the header row and determine column indexes
  let headerIndex = -1
  let internetSkuIndex = -1
  let storeSkuIndex = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const lower = line.toLowerCase()
    if (lower.startsWith("date,store number,transaction id,register number,job name")) {
      const headerCols = line.split(",").map((c) => c.trim().toLowerCase())
      internetSkuIndex = headerCols.indexOf("internet sku")
      storeSkuIndex = headerCols.indexOf("sku number")
      headerIndex = i
      break
    }
  }

  if (headerIndex === -1) return []
  if (internetSkuIndex === -1 && storeSkuIndex === -1) return []

  const normalize = (value) => {
    if (!value) return null
    let v = String(value).trim()
    if (!v) return null
    if (v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1).trim()
    }
    if (!/^\d{3,15}$/.test(v)) return null
    return v
  }

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const rawLine = lines[i]
    if (!rawLine) continue

    const cols = splitCsvLine(rawLine)
    if (!cols || !cols.length) continue

    const internetSku =
      internetSkuIndex !== -1 ? normalize(cols[internetSkuIndex]) : null
    const storeSku = storeSkuIndex !== -1 ? normalize(cols[storeSkuIndex]) : null

    if (!internetSku && !storeSku) continue

    const key = internetSku || storeSku
    if (!key) continue

    if (!itemsMap.has(key)) {
      itemsMap.set(key, {
        internetSku: internetSku || null,
        storeSku: storeSku || null,
      })
    } else {
      const existing = itemsMap.get(key)
      if (!existing.internetSku && internetSku) existing.internetSku = internetSku
      if (!existing.storeSku && storeSku) existing.storeSku = storeSku
    }
  }

  return Array.from(itemsMap.values())
}

async function scrape(page) {
  return page.evaluate(() => {
    const title = document.querySelector('h1, .sui-h4-bold')?.textContent?.trim()

    // Price - look for the sticky nav price or main price display
    let price = null
    const priceContainers = document.querySelectorAll('[class*="price"], [class*="Price"]')
    for (const el of priceContainers) {
      const text = el.textContent
      const match = text.match(/^\$(\d+\.?\d*)/)
      if (match) {
        price = parseFloat(match[1])
        break
      }
    }

    // Also try specific HD price format
    if (!price) {
      const allText = document.body.innerText
      const priceMatch = allText.match(/\$(\d+\.\d{2})(?:Buy|Save|Was|$|\s)/i)
      if (priceMatch) price = parseFloat(priceMatch[1])
    }

    const img = document.querySelector('img[src*="thdstatic"]:not([src*="logo"])')?.src
    const sku = location.pathname.match(/\/(\d+)$/)?.[1]

    return { sku, title, price, image: img, url: location.href }
  })
}

async function main() {
  const args = process.argv.slice(2)

  /** @type {{ internetSku: string | null, storeSku: string | null }[]} */
  let jobs = []

  if (args[0]) {
    const candidatePath = path.isAbsolute(args[0])
      ? args[0]
      : path.join(ROOT_DIR, args[0])

    if (fs.existsSync(candidatePath)) {
      if (candidatePath.toLowerCase().endsWith(".csv")) {
        console.log(`Loading SKUs from CSV: ${candidatePath}`)
        jobs = parsePurchaseHistoryCsv(candidatePath)
      } else {
        console.log(`Loading SKUs from text file: ${candidatePath}`)
        const skus = parseSkus(candidatePath)
        jobs = skus.map((sku) => ({
          internetSku: sku,
          storeSku: null,
        }))
      }
    }
  }

  if (!jobs.length && fs.existsSync(DEFAULT_PURCHASE_HISTORY)) {
    console.log(`Loading SKUs from purchase history CSV: ${DEFAULT_PURCHASE_HISTORY}`)
    jobs = parsePurchaseHistoryCsv(DEFAULT_PURCHASE_HISTORY)
  }

  if (!jobs.length) {
    const skuFile = path.join(__dirname, "skus.txt")
    if (fs.existsSync(skuFile)) {
      console.log(`Loading SKUs from skus.txt`)
      const skus = parseSkus(skuFile)
      jobs = skus.map((sku) => ({
        internetSku: sku,
        storeSku: null,
      }))
    }
  }

  console.log(`Processing ${jobs.length} SKUs sequentially...\n`)

  const results = []

  const isErrorPage = (html) =>
    html.includes("Oops!! Something went wrong") ||
    html.toLowerCase().includes("error page")

  for (let i = 0; i < jobs.length; i++) {
    const browser = await chromium.launchPersistentContext(CONFIG.userDataDir, {
      channel: 'msedge',
      headless: false,
      viewport: { width: 1200, height: 800 }
    })

    const page = await browser.newPage()

    await page.goto('https://www.homedepot.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(2000)

    try {
      const job = jobs[i]
      const label = job.internetSku || job.storeSku || "unknown"
      process.stdout.write(`[${i + 1}/${jobs.length}] ${label}... `)

      const base = {
        sourceInternetSku: job.internetSku || null,
        sourceStoreSku: job.storeSku || null,
      }

      let handled = false

      // Primary: direct PDP via Internet SKU
      if (job.internetSku) {
        const url = `https://www.homedepot.com/p/_/${job.internetSku}`
        try {
          await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          })
          await page.waitForTimeout(3000)

          const content = await page.content()

          if (content.includes("not currently available")) {
            console.log("discontinued (internet SKU)")
            results.push({
              ...base,
              method: "internet-sku",
              url,
              error: "discontinued",
            })
            handled = true
          } else if (isErrorPage(content)) {
            console.log("error page (internet SKU)")
            results.push({
              ...base,
              method: "internet-sku",
              url,
              error: "error-page",
            })
          } else {
            const data = await scrape(page)
            if (data.title) {
              console.log(
                `${data.title.substring(0, 40)}... $${data.price || "N/A"}`,
              )
              results.push({
                ...base,
                ...data,
                method: "internet-sku",
              })
              handled = true
            } else {
              console.log("no data (internet SKU)")
              results.push({
                ...base,
                method: "internet-sku",
                url: data.url || url,
                error: "no-data",
              })
            }
          }
        } catch (e) {
          console.log(`error (internet SKU): ${e.message}`)
          results.push({
            ...base,
            method: "internet-sku",
            url,
            error: e.message,
          })
        }
      }

      // Fallback: manual-style search by store SKU
      if (!handled && job.storeSku) {
        const searchUrl = `https://www.homedepot.com/s/${encodeURIComponent(
          job.storeSku,
        )}`
        try {
          await page.goto(searchUrl, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
          })
          await page.waitForTimeout(3000)

          let url = page.url()
          let content = await page.content()

          if (isErrorPage(content)) {
            console.log("error page (store SKU search)")
            results.push({
              ...base,
              method: "store-sku-search",
              url: searchUrl,
              error: "error-page",
            })
          } else {
            // If search took us directly to a PDP, scrape it
            if (url.includes("/p/")) {
              const data = await scrape(page)
              if (data.title) {
                console.log(
                  `${data.title.substring(0, 40)}... $${data.price || "N/A"}`,
                )
                results.push({
                  ...base,
                  ...data,
                  method: "store-sku-search",
                })
                handled = true
              } else {
                console.log("no data (store SKU direct PDP)")
                results.push({
                  ...base,
                  method: "store-sku-search",
                  url: data.url || url,
                  error: "no-data",
                })
              }
            } else {
              // Still on a search grid: click first product tile that leads to /p/
              const productHref = await page.evaluate(() => {
                const link =
                  document.querySelector('a[href*="/p/"]') ||
                  document.querySelector('a[data-productid]')
                return link ? link.href : null
              })

              if (!productHref) {
                console.log("no results (store SKU search)")
                results.push({
                  ...base,
                  method: "store-sku-search",
                  url: searchUrl,
                  error: "no-results",
                })
              } else {
                await page.goto(productHref, {
                  waitUntil: "domcontentloaded",
                  timeout: 30000,
                })
                await page.waitForTimeout(3000)

                url = page.url()
                content = await page.content()

                if (content.includes("not currently available")) {
                  console.log("discontinued (store SKU PDP)")
                  results.push({
                    ...base,
                    method: "store-sku-search",
                    url,
                    error: "discontinued",
                  })
                  handled = true
                } else if (isErrorPage(content)) {
                  console.log("error page (store SKU PDP)")
                  results.push({
                    ...base,
                    method: "store-sku-search",
                    url,
                    error: "error-page",
                  })
                } else {
                  const data = await scrape(page)
                  if (data.title) {
                    console.log(
                      `${data.title.substring(0, 40)}... $${data.price || "N/A"}`,
                    )
                    results.push({
                      ...base,
                      ...data,
                      method: "store-sku-search",
                    })
                    handled = true
                  } else {
                    console.log("no data (store SKU PDP)")
                    results.push({
                      ...base,
                      method: "store-sku-search",
                      url: data.url || url,
                      error: "no-data",
                    })
                  }
                }
              }
            }
          }
        } catch (e) {
          console.log(`error (store SKU search): ${e.message}`)
          results.push({
            ...base,
            method: "store-sku-search",
            url: searchUrl,
            error: e.message,
          })
        }
      }
    } finally {
      await browser.close()
    }

    if (i < jobs.length - 1 && CONFIG.delayBetween > 0) {
      await sleep(CONFIG.delayBetween)
    }
  }

  fs.writeFileSync(path.join(__dirname, 'scraped.json'), JSON.stringify(results, null, 2))

  const ok = results.filter(r => r.title).length
  const total = results.length
  console.log(`\nDone: ${ok}/${total} successful`)
}

main().catch(console.error)
