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
  model?: string
  upc?: string
  categories?: string
  imageUrl?: string
  productUrl?: string
  homeDepotUrl?: string
  retailPrice?: string | number
  scrapedAt?: string
}

interface EnrichmentRow {
  sku: string
  item_name?: string | null
  brand?: string | null
  model_number?: string | null
  upc?: string | null
  image_url?: string | null
  home_depot_url?: string | null
  internet_sku?: number | null
  retail_price?: number | null
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
  const abbreviations = [
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
  ]
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

function parsePriceInfo(value: string | number | undefined | null): {
  cleaned: number | null
  isExplicitZero: boolean
} {
  if (value === null || value === undefined) return { cleaned: null, isExplicitZero: false }
  const text = String(value).trim()
  if (!text) return { cleaned: null, isExplicitZero: false }
  const digits = text.replace(/[^0-9.]/g, "")
  if (!digits) return { cleaned: null, isExplicitZero: false }
  const parsed = Number(digits)
  if (!Number.isFinite(parsed)) return { cleaned: null, isExplicitZero: false }
  if (parsed === 0) return { cleaned: null, isExplicitZero: true }
  if (parsed < 0) return { cleaned: null, isExplicitZero: false }
  return { cleaned: Math.round(parsed * 100) / 100, isExplicitZero: false }
}

function optimizeImageUrl(url: string | undefined): string | null {
  const trimmed = String(url ?? "").trim()
  if (!trimmed) return null
  let hostname: string
  try {
    const parsed = new URL(trimmed)
    hostname = parsed.hostname.toLowerCase()
  } catch {
    // If the URL cannot be parsed, do not attempt host-based optimization.
    return trimmed
  }
  const isThdStaticHost =
    hostname === "thdstatic.com" || hostname.endsWith(".thdstatic.com")
  if (!isThdStaticHost) return trimmed
  if (trimmed.includes("_100.jpg")) return trimmed.replace("_100.jpg", "_1000.jpg")
  if (trimmed.includes("_400.jpg")) return trimmed.replace("_400.jpg", "_1000.jpg")
  return trimmed.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
}

function canonicalHomeDepotUrl(
  sku: string,
  internetSku: number | null,
  providedUrl: string | undefined
): string | null {
  if (internetSku) return `https://www.homedepot.com/p/${internetSku}`
  const trimmed = String(providedUrl ?? "").trim()
  if (trimmed) return trimmed
  return sku ? `https://www.homedepot.com/s/${sku}` : null
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

  // Group by SKU and merge fields across versions (keep newest values, fill missing from older)
  const skuGroups = new Map<string, ScrapedItem[]>()
  let noSku = 0

  for (const item of items) {
    const sku = item.storeSku?.trim()
    if (!sku) {
      noSku++
      continue
    }

    const group = skuGroups.get(sku) ?? []
    group.push(item)
    skuGroups.set(sku, group)
  }

  const mergedBySku = new Map<string, ScrapedItem>()
  let duplicatesMerged = 0
  let skippedZeroPrice = 0

  for (const [sku, versions] of skuGroups) {
    if (versions.length > 1) duplicatesMerged += versions.length - 1

    const sorted = versions
      .slice()
      .sort((a, b) => new Date(b.scrapedAt || 0).getTime() - new Date(a.scrapedAt || 0).getTime())

    const merged: ScrapedItem = { ...sorted[0] }

    let sawExplicitZeroPrice = false
    let retailPrice: number | null = null

    for (const v of sorted) {
      const pickText = (current?: string, candidate?: string) =>
        current?.trim() ? current : candidate?.trim() ? candidate.trim() : current

      merged.internetNumber = pickText(merged.internetNumber, v.internetNumber)
      merged.name = pickText(merged.name, v.name)
      merged.brand = pickText(merged.brand, v.brand)
      merged.model = pickText(merged.model, v.model)
      merged.upc = pickText(merged.upc, v.upc)
      merged.categories = pickText(merged.categories, v.categories)
      merged.imageUrl = pickText(merged.imageUrl, v.imageUrl)
      merged.productUrl = pickText(merged.productUrl, v.productUrl)
      merged.homeDepotUrl = pickText(merged.homeDepotUrl, v.homeDepotUrl)

      const priceInfo = parsePriceInfo(v.retailPrice ?? null)
      if (priceInfo.isExplicitZero) sawExplicitZeroPrice = true
      if (retailPrice === null && priceInfo.cleaned !== null) retailPrice = priceInfo.cleaned
    }

    if (retailPrice === null && sawExplicitZeroPrice) {
      skippedZeroPrice++
      continue
    }

    if (retailPrice !== null) merged.retailPrice = retailPrice

    mergedBySku.set(sku, merged)
  }

  console.log(`Unique SKUs: ${mergedBySku.size}`)
  console.log(`Duplicates merged: ${duplicatesMerged}`)
  if (noSku > 0) console.log(`Skipped (no storeSku): ${noSku}`)
  if (skippedZeroPrice > 0) console.log(`Skipped (retailPrice $0.00): ${skippedZeroPrice}`)

  // Convert to enrichment format with normalization
  const enrichmentRows: EnrichmentRow[] = []

  for (const [sku, item] of mergedBySku) {
    const normalizedBrand = normalizeBrand(item.brand)
    const normalizedName = normalizeProductName(item.name || "", normalizedBrand)
    const internetSku = item.internetNumber ? parseInt(item.internetNumber, 10) || null : null

    const row: EnrichmentRow = {
      sku,
      item_name: normalizedName || null,
      brand: normalizedBrand || null,
      model_number: item.model || null,
      upc: item.upc || null,
      image_url: optimizeImageUrl(item.imageUrl),
      home_depot_url: canonicalHomeDepotUrl(sku, internetSku, item.homeDepotUrl || item.productUrl),
      internet_sku: internetSku,
      retail_price: item.retailPrice ? parsePriceInfo(item.retailPrice).cleaned : null,
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
