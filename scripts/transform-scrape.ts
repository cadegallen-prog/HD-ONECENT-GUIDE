/**
 * Transform Scrape Data Script
 *
 * Converts scraped product data from Tampermonkey format to bulk-enrich format.
 * - Deduplicates by SKU (keeps most recently scraped)
 * - Normalizes brand and item names for consistent display
 *
 * Input format (object keyed by URL):
 * {
 *   "https://www.homedepot.com/p/123456789": {
 *     "internetNumber": "123456789",
 *     "storeSku": "123456",
 *     "name": "Product Name",
 *     "brand": "Brand",
 *     "upc": "012345678901",
 *     "imageUrl": "https://...",
 *     "productUrl": "https://...",
 *     "scrapedAt": "..."
 *   }
 * }
 *
 * Output format (array):
 * [
 *   {
 *     "sku": "123456",
 *     "item_name": "Product Name",
 *     "brand": "Brand",
 *     "upc": "012345678901",
 *     "image_url": "https://...",
 *     "home_depot_url": "https://...",
 *     "internet_sku": 123456789
 *   }
 * ]
 *
 * Usage:
 *   npx tsx scripts/transform-scrape.ts [--input <file>] [--output <file>]
 *
 * Options:
 *   --input <file>   Input JSON file. Default: data/penny_scrape_1767249116267.json
 *   --output <file>  Output JSON file. Default: data/enrichment-input.json
 */

import * as fs from "fs"
import { resolve } from "path"

interface ScrapedItem {
  internetNumber?: string
  storeSku?: string
  name?: string
  brand?: string
  upc?: string
  categories?: string
  imageUrl?: string
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

// Common abbreviations that should stay uppercase
const UPPERCASE_WORDS = [
  "HD",
  "LED",
  "USB",
  "AC",
  "DC",
  "UV",
  "PVC",
  "ABS",
  "HVAC",
  "CFM",
  "PSI",
  "RPM",
  "GPM",
  "BTU",
  "DEWALT",
  "MILWAUKEE",
  "RIDGID",
  "RYOBI",
  "MAKITA",
  "BOSCH",
  "KOHLER",
  "MOEN",
  "DELTA",
  "PFISTER",
  "LIFEPROOF",
  "TRAFFICMASTER",
  "HUSKY",
  "EVERBILT",
  "HDX",
  "GLACIER BAY",
  "HAMPTON BAY",
  "DEFIANT",
  "COMMERCIAL ELECTRIC",
  "VIGORO",
  "BEHR",
  "GLIDDEN",
  "PPG",
  "RUST-OLEUM",
  "DAP",
  "GE",
  "LG",
  "SAMSUNG",
  "WHIRLPOOL",
  "MAYTAG",
  "FRIGIDAIRE",
  "TORO",
  "ECHO",
  "EGO",
  "STIHL",
  "DIABLO",
  "IRWIN",
  "STANLEY",
  "CRAFTSMAN",
  "WERNER",
  "GORILLA",
  "3M",
  "WD-40",
  "CLR",
  "ZINSSER",
]

/**
 * Normalizes a brand name for consistent display.
 */
function normalizeBrand(brand: string | undefined): string {
  if (!brand) return ""

  // Trim and collapse whitespace
  let normalized = brand.replace(/\s+/g, " ").trim()

  // Check if it's a known brand (case-insensitive)
  const upperBrand = normalized.toUpperCase()
  for (const knownBrand of UPPERCASE_WORDS) {
    if (upperBrand === knownBrand || upperBrand === knownBrand.replace(/\s+/g, "")) {
      return knownBrand
    }
  }

  // Title case for unknown brands
  normalized = normalized.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  return normalized
}

/**
 * Normalizes a product name for consistent display.
 */
function normalizeProductName(name: string, brand?: string): string {
  if (!name) return ""

  // Trim and collapse whitespace
  let normalized = name.replace(/\s+/g, " ").trim()

  // Remove brand from beginning if duplicated
  if (brand) {
    const brandLower = brand.toLowerCase()
    const nameLower = normalized.toLowerCase()
    if (nameLower.startsWith(brandLower)) {
      normalized = normalized
        .slice(brand.length)
        .replace(/^[\s-:]+/, "")
        .trim()
    }
  }

  // Convert to Title Case
  normalized = normalized.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  // Handle common abbreviations that should stay uppercase
  const abbreviations = ["HD", "LED", "USB", "AC", "DC", "UV", "PVC", "ABS", "HVAC", "CFM", "PSI", "RPM", "GPM", "BTU"]
  for (const abbr of abbreviations) {
    const regex = new RegExp(`\\b${abbr}\\b`, "gi")
    normalized = normalized.replace(regex, abbr)
  }

  // Handle common units that should stay lowercase
  // Match digit + optional space + unit + optional period, replace with standardized format
  const lowercaseUnits = ["in", "ft", "mm", "cm", "oz", "lb", "gal", "qt", "pk", "ct", "sq"]
  for (const unit of lowercaseUnits) {
    // First pass: match units WITH periods (to normalize spacing)
    const withPeriod = new RegExp(`(\\d)\\s*${unit}\\.`, "gi")
    normalized = normalized.replace(withPeriod, (_, digit) => `${digit} ${unit}.`)

    // Second pass: match units WITHOUT periods (add period)
    // Only match if followed by space or end, not if followed by another character
    const withoutPeriod = new RegExp(`(\\d)\\s*${unit}(?=\\s|$)`, "gi")
    normalized = normalized.replace(withoutPeriod, (_, digit) => `${digit} ${unit}.`)
  }

  return normalized
}

function parseArgs(): { input: string; output: string } {
  const args = process.argv.slice(2)
  let input = "data/penny_scrape_1767249116267.json"
  let output = "data/enrichment-input.json"

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      input = args[++i]
    } else if (args[i] === "--output" && args[i + 1]) {
      output = args[++i]
    }
  }

  return { input, output }
}

function main() {
  const { input, output } = parseArgs()

  const inputPath = resolve(process.cwd(), input)
  const outputPath = resolve(process.cwd(), output)

  console.log("Transform Scrape Data")
  console.log(`   Input: ${input}`)
  console.log(`   Output: ${output}`)
  console.log()

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`)
    process.exit(1)
  }

  const rawContent = fs.readFileSync(inputPath, "utf-8")
  const scraped: Record<string, ScrapedItem> = JSON.parse(rawContent)

  const items = Object.values(scraped)
  console.log(`Found ${items.length} scraped items`)

  // Deduplicate by SKU, keeping the most recently scraped version
  const skuMap = new Map<string, { item: ScrapedItem; scrapedAt: number }>()
  let noSku = 0

  for (const item of items) {
    const sku = item.storeSku?.trim()

    if (!sku) {
      noSku++
      continue
    }

    const scrapedAt = item.scrapedAt ? new Date(item.scrapedAt).getTime() : 0
    const existing = skuMap.get(sku)

    if (!existing || scrapedAt > existing.scrapedAt) {
      skuMap.set(sku, { item, scrapedAt })
    }
  }

  console.log(`Unique SKUs: ${skuMap.size}`)
  console.log(`Duplicates merged: ${items.length - noSku - skuMap.size}`)
  if (noSku > 0) {
    console.log(`Skipped (no storeSku): ${noSku}`)
  }

  // Convert to enrichment format with normalization
  const enrichmentRows: EnrichmentRow[] = []

  for (const [sku, { item }] of skuMap) {
    const normalizedBrand = normalizeBrand(item.brand)
    const normalizedName = normalizeProductName(item.name || "", normalizedBrand)

    const row: EnrichmentRow = {
      sku,
      item_name: normalizedName || null,
      brand: normalizedBrand || null,
      upc: item.upc || null,
      image_url: item.imageUrl || null,
      home_depot_url: item.productUrl || null,
      internet_sku: item.internetNumber ? parseInt(item.internetNumber, 10) || null : null,
    }

    enrichmentRows.push(row)
  }

  console.log(`\nOutput: ${enrichmentRows.length} unique items with normalized names`)

  fs.writeFileSync(outputPath, JSON.stringify(enrichmentRows, null, 2))
  console.log(`Written to: ${outputPath}`)
  console.log("\nNext step:")
  console.log(`  npx tsx scripts/bulk-enrich.ts --input ${output} --source bookmarklet --dry-run`)
}

main()
