/**
 * Analyze UPC and URL coverage in scraped data
 * Check if deduplication lost any data
 */

import * as fs from "fs"
import { resolve } from "path"

interface ScrapedItem {
  internetNumber?: string
  storeSku?: string
  name?: string
  brand?: string
  upc?: string
  productUrl?: string
  scrapedAt?: string
}

interface EnrichmentRow {
  sku: string
  item_name?: string | null
  brand?: string | null
  upc?: string | null
  image_url?: string | null
  home_depot_url?: string | null
  internet_sku?: number | null
}

const rawPath = resolve(process.cwd(), "data/penny_scrape_1767249116267.json")
const enrichedPath = resolve(process.cwd(), "data/enrichment-input.json")

const rawContent = fs.readFileSync(rawPath, "utf-8")
const scraped: Record<string, ScrapedItem> = JSON.parse(rawContent)
const items = Object.values(scraped)

console.log("=== RAW SCRAPED DATA ANALYSIS ===")
console.log("Total items:", items.length)

const withSku = items.filter((d) => d.storeSku?.trim()).length
const withUpc = items.filter((d) => d.upc?.trim()).length
const withUrl = items.filter((d) => d.productUrl?.trim()).length

console.log("With storeSku:", withSku)
console.log("With UPC:", withUpc)
console.log("With productUrl:", withUrl)
console.log("")

// Group by SKU
const skuMap = new Map<string, ScrapedItem[]>()
for (const item of items) {
  const sku = item.storeSku?.trim()
  if (!sku) continue
  if (!skuMap.has(sku)) skuMap.set(sku, [])
  skuMap.get(sku)!.push(item)
}

console.log("Unique SKUs:", skuMap.size)
console.log("")

// Check for data loss when picking 'most recent'
let lostUpc = 0
let lostUrl = 0
const lostUpcSkus: string[] = []
const lostUrlSkus: string[] = []

for (const [sku, versions] of skuMap) {
  const sorted = versions.sort(
    (a, b) => new Date(b.scrapedAt || 0).getTime() - new Date(a.scrapedAt || 0).getTime()
  )
  const newest = sorted[0]
  const older = sorted.slice(1)

  // Check UPC loss
  if (!newest.upc?.trim() && older.some((o) => o.upc?.trim())) {
    lostUpc++
    lostUpcSkus.push(sku)
  }

  // Check URL loss
  if (!newest.productUrl?.trim() && older.some((o) => o.productUrl?.trim())) {
    lostUrl++
    lostUrlSkus.push(sku)
  }
}

console.log("=== DATA LOSS FROM DEDUPLICATION ===")
console.log("SKUs where newest is missing UPC but older has it:", lostUpc)
if (lostUpcSkus.length > 0 && lostUpcSkus.length <= 10) {
  console.log("  SKUs:", lostUpcSkus.join(", "))
}
console.log("SKUs where newest is missing URL but older has it:", lostUrl)
if (lostUrlSkus.length > 0 && lostUrlSkus.length <= 10) {
  console.log("  SKUs:", lostUrlSkus.join(", "))
}
console.log("")

// What we actually uploaded
const enrichedContent = fs.readFileSync(enrichedPath, "utf-8")
const enriched: EnrichmentRow[] = JSON.parse(enrichedContent)

const uploadedWithUpc = enriched.filter((d) => d.upc?.trim()).length
const uploadedWithUrl = enriched.filter((d) => d.home_depot_url?.trim()).length

console.log("=== UPLOADED DATA ===")
console.log("Total uploaded:", enriched.length)
console.log("With UPC:", uploadedWithUpc, `(${Math.round((uploadedWithUpc / enriched.length) * 100)}%)`)
console.log("With home_depot_url:", uploadedWithUrl, `(${Math.round((uploadedWithUrl / enriched.length) * 100)}%)`)
console.log("")

// Summary
console.log("=== RECOMMENDATION ===")
if (lostUpc > 0 || lostUrl > 0) {
  console.log("Consider updating deduplication logic to MERGE fields from all versions,")
  console.log("keeping the most complete data rather than just the most recent.")
}
