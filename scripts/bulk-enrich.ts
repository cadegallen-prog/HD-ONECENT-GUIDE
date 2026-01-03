/**
 * Bulk Enrichment Upload Script
 *
 * Uploads pre-scraped product data to the penny_item_enrichment table.
 * When users submit finds, this data automatically populates card images/titles.
 *
 * Usage:
 *   npx tsx scripts/bulk-enrich.ts [options]
 *
 * Options:
 *   --input <file>   Input file (JSON or CSV). Default: data/enrichment-input.json
 *   --source <type>  Source tag (manual|scraperapi|bookmarklet|auto). Default: manual
 *   --dry-run        Preview changes without writing to database
 *   --force          Overwrite existing values (default is fill-blanks-only)
 *
 * Input JSON format:
 * [
 *   {
 *     "sku": "123456",
 *     "item_name": "Product Name",
 *     "brand": "Brand",
 *     "model_number": "MODEL123",
 *     "upc": "012345678901",
 *     "image_url": "https://...",
 *     "home_depot_url": "https://www.homedepot.com/p/...",
 *     "internet_sku": 123456789
 *   }
 * ]
 *
 * Or CSV with headers: sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials. Make sure environment variables are set:")
  console.error("  NEXT_PUBLIC_SUPABASE_URL")
  console.error("  SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Type for enrichment row
interface EnrichmentRow {
  sku: string
  item_name?: string | null
  brand?: string | null
  model_number?: string | null
  upc?: string | null
  image_url?: string | null
  home_depot_url?: string | null
  internet_sku?: number | null
  retail_price?: string | number | null
}

// Parse command line arguments
function parseArgs(): { input: string; source: string; dryRun: boolean; force: boolean } {
  const args = process.argv.slice(2)
  let input = "data/enrichment-input.json"
  let source = "manual"
  let dryRun = false
  let force = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      input = args[++i]
    } else if (args[i] === "--source" && args[i + 1]) {
      source = args[++i]
    } else if (args[i] === "--dry-run") {
      dryRun = true
    } else if (args[i] === "--force") {
      force = true
    }
  }

  return { input, source, dryRun, force }
}

// Normalize SKU (same logic as lib/sku.ts)
function normalizeSku(sku: string | number | null | undefined): string | null {
  if (sku === null || sku === undefined) return null
  const str = String(sku).trim().replace(/\D/g, "")
  if (str.length === 6) return str
  if (str.length === 10 && (str.startsWith("100") || str.startsWith("101"))) return str
  return null
}

function cleanPrice(value: string | number | undefined | null): number | null {
  if (value === null || value === undefined) return null
  const digits = String(value).trim().replace(/[^0-9.]/g, "")
  if (!digits) return null
  const parsed = Number(digits)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.round(parsed * 100) / 100
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

// Optimize image URL to 400px version
function optimizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.includes("thdstatic.com")) {
    // Convert common THD sizes to 400px for efficient loading
    if (url.includes("_1000.jpg")) return url.replace("_1000.jpg", "_400.jpg")
    if (url.includes("_100.jpg")) return url.replace("_100.jpg", "_400.jpg")
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/400.jpg")
  }
  return url
}

function normalizeOptionalText(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const trimmed = String(value).trim()
  return trimmed ? trimmed : null
}

function parseOptionalInt(value: unknown): number | null {
  const digits = String(value ?? "")
    .trim()
    .replace(/\D/g, "")
  if (!digits) return null
  const parsed = parseInt(digits, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function canonicalHomeDepotUrl(
  sku: string,
  internetSku: number | null,
  providedUrl: string | null
): string | null {
  if (internetSku) return `https://www.homedepot.com/p/${internetSku}`
  if (providedUrl) return providedUrl
  return sku ? `https://www.homedepot.com/s/${sku}` : null
}

function isValidHomeDepotUrl(url: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith("https://www.homedepot.com/") ||
    trimmed.startsWith("http://www.homedepot.com/")
  )
}

function isSearchHomeDepotUrl(url: string | null): boolean {
  if (!url) return false
  return url.includes("://www.homedepot.com/s/")
}

function toEnrichmentRowFromJson(value: unknown): EnrichmentRow | null {
  if (!value || typeof value !== "object") return null
  const row = value as Record<string, unknown>

  const sku =
    row.sku ??
    row.storeSku ??
    row.store_sku ??
    row.home_depot_sku ??
    row.home_depot_sku_6_or_10_digits

  const itemName = row.item_name ?? row.name ?? row.title
  const brand = row.brand ?? row.brandName
  const model = row.model_number ?? row.model
  const upc = row.upc ?? row.upcNumber
  const imageUrl = row.image_url ?? row.imageUrl ?? row.image ?? row.imageurl
  const homeDepotUrl = row.home_depot_url ?? row.homeDepotUrl ?? row.productUrl ?? row.url
  const internetSku = row.internet_sku ?? row.internetNumber ?? row.internet_number
  const retailPrice = row.retail_price ?? row.retailPrice ?? row.retailprice ?? row.price

  const normalizedSku = normalizeOptionalText(sku)
  if (!normalizedSku) return null

  return {
    sku: normalizedSku,
    item_name: normalizeOptionalText(itemName),
    brand: normalizeOptionalText(brand),
    model_number: normalizeOptionalText(model),
    upc: normalizeOptionalText(upc),
    image_url: normalizeOptionalText(imageUrl),
    home_depot_url: normalizeOptionalText(homeDepotUrl),
    internet_sku: parseOptionalInt(internetSku),
    retail_price:
      retailPrice === null || retailPrice === undefined ? null : String(retailPrice).trim(),
  }
}

function normalizeJsonInput(parsed: unknown): EnrichmentRow[] {
  const rawItems: unknown[] = []

  if (Array.isArray(parsed)) {
    rawItems.push(...parsed)
  } else if (parsed && typeof parsed === "object") {
    rawItems.push(...Object.values(parsed as Record<string, unknown>))
  }

  return rawItems.map(toEnrichmentRowFromJson).filter((row): row is EnrichmentRow => Boolean(row))
}

// Parse CSV content
function parseCSV(content: string): EnrichmentRow[] {
  const lines = content.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, "_"))
  const rows: EnrichmentRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length < headers.length) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() || ""
    })

    // Map common header variations
    const sku =
      row.sku ||
      row.home_depot_sku ||
      row.home_depot_sku_6_or_10_digits ||
      row["home_depot_sku_(6_or_10_digits)"]
    const internetSku =
      row.internet_sku || row.internet_number || row.internetnumber || row.internetsku
    const retailPrice =
      row.retail_price ||
      row.retailprice ||
      row["retail_price"] ||
      row.price ||
      row["retail price"] ||
      row["price"]

    if (sku) {
      rows.push({
        sku,
        item_name: row.item_name || row.name || row.title || null,
        brand: row.brand || null,
        model_number: row.model_number || row.model || null,
        upc: row.upc || null,
        image_url: row.image_url || row.imageurl || row.image || null,
        home_depot_url: row.home_depot_url || row.url || row.homedepoturl || null,
        internet_sku: internetSku ? parseInt(internetSku, 10) || null : null,
        retail_price: retailPrice || null,
      })
    }
  }

  return rows
}

// Parse a single CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

// Parse input file (JSON or CSV)
function parseInputFile(filePath: string): EnrichmentRow[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Input file not found: ${filePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(filePath, "utf-8")
  const ext = filePath.toLowerCase()

  if (ext.endsWith(".json")) {
    try {
      const parsed = JSON.parse(content) as unknown
      return normalizeJsonInput(parsed)
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      process.exit(1)
    }
  } else if (ext.endsWith(".csv")) {
    return parseCSV(content)
  } else {
    // Try JSON first, then CSV
    try {
      const parsed = JSON.parse(content) as unknown
      return normalizeJsonInput(parsed)
    } catch {
      return parseCSV(content)
    }
  }
}

type ExistingEnrichmentRow = {
  sku: string
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: string | number | null
  source: string | null
  updated_at: string | null
}

function normalizeExistingRow(row: ExistingEnrichmentRow) {
  const sku = String(row.sku ?? "").trim()
  return {
    sku,
    item_name: normalizeOptionalText(row.item_name),
    brand: normalizeOptionalText(row.brand),
    model_number: normalizeOptionalText(row.model_number),
    upc: normalizeOptionalText(row.upc),
    image_url: normalizeOptionalText(row.image_url),
    home_depot_url: isValidHomeDepotUrl(row.home_depot_url) ? normalizeOptionalText(row.home_depot_url) : null,
    internet_sku: row.internet_sku && row.internet_sku > 0 ? row.internet_sku : null,
    retail_price: cleanPrice(row.retail_price),
    source: normalizeOptionalText(row.source),
    updated_at: normalizeOptionalText(row.updated_at),
  }
}

async function fetchExistingBySku(
  skus: string[]
): Promise<Map<string, ReturnType<typeof normalizeExistingRow>>> {
  const existingBySku = new Map<string, ReturnType<typeof normalizeExistingRow>>()

  const BATCH_SIZE = 200
  for (let i = 0; i < skus.length; i += BATCH_SIZE) {
    const batch = skus.slice(i, i + BATCH_SIZE)
    const { data, error } = await supabase
      .from("penny_item_enrichment")
      .select(
        "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price,source,updated_at"
      )
      .in("sku", batch)

    if (error) {
      console.error("❌ Failed to fetch existing enrichment:", error.message)
      process.exit(1)
    }

    for (const row of (data as ExistingEnrichmentRow[] | null) ?? []) {
      const normalized = normalizeExistingRow(row)
      if (normalized.sku) existingBySku.set(normalized.sku, normalized)
    }
  }

  return existingBySku
}

// Main function
async function main() {
  const { input, source, dryRun, force } = parseArgs()
  const merge = !force

  console.log("🚀 Bulk Enrichment Upload")
  console.log(`   Input: ${input}`)
  console.log(`   Source: ${source}`)
  console.log(`   Dry run: ${dryRun}`)
  console.log(`   Mode: ${merge ? "merge (fill blanks only)" : "force overwrite"}`)
  console.log()

  // Parse input
  const rawRows = parseInputFile(resolve(process.cwd(), input))
  console.log(`📋 Found ${rawRows.length} rows in input file`)

  // Normalize and validate
  const validRows: Array<{
    sku: string
    item_name: string | null
    brand: string | null
    model_number: string | null
    upc: string | null
    image_url: string | null
    home_depot_url: string | null
    internet_sku: number | null
    retail_price: number | null
    source: string
    updated_at: string
  }> = []

  const invalidSkus: string[] = []
  const skippedZeroPrice: string[] = []

  for (const row of rawRows) {
    const normalizedSku = normalizeSku(row.sku)
    if (!normalizedSku) {
      invalidSkus.push(String(row.sku))
      continue
    }

    const priceInfo = parsePriceInfo(row.retail_price ?? null)
    if (priceInfo.isExplicitZero) {
      skippedZeroPrice.push(normalizedSku)
      continue
    }

    const internetSku = parseOptionalInt(row.internet_sku)
    const homeDepotUrl = canonicalHomeDepotUrl(
      normalizedSku,
      internetSku,
      normalizeOptionalText(row.home_depot_url)
    )

    validRows.push({
      sku: normalizedSku,
      item_name: normalizeOptionalText(row.item_name),
      brand: normalizeOptionalText(row.brand),
      model_number: normalizeOptionalText(row.model_number),
      upc: normalizeOptionalText(row.upc),
      image_url: optimizeImageUrl(normalizeOptionalText(row.image_url)),
      home_depot_url: homeDepotUrl && isValidHomeDepotUrl(homeDepotUrl) ? homeDepotUrl : null,
      internet_sku: internetSku,
      retail_price: priceInfo.cleaned,
      source,
      updated_at: new Date().toISOString(),
    })
  }

  console.log(`✅ Valid rows: ${validRows.length}`)
  if (skippedZeroPrice.length > 0) {
    console.log(`⛔ Skipped $0.00 price rows: ${skippedZeroPrice.length}`)
    if (skippedZeroPrice.length <= 10) {
      console.log(`   ${skippedZeroPrice.join(", ")}`)
    } else {
      console.log(`   ${skippedZeroPrice.slice(0, 10).join(", ")}...`)
    }
  }

  if (invalidSkus.length > 0) {
    console.log(`⚠️  Invalid SKUs skipped: ${invalidSkus.length}`)
    if (invalidSkus.length <= 10) {
      console.log(`   ${invalidSkus.join(", ")}`)
    } else {
      console.log(`   ${invalidSkus.slice(0, 10).join(", ")}...`)
    }
  }
  console.log()

  if (validRows.length === 0) {
    console.log("❌ No valid rows to process")
    process.exit(0)
  }

  // Deduplicate by SKU and keep the most complete row (never overwrite filled fields)
  const dedupedBySku = new Map<string, (typeof validRows)[number]>()
  for (const row of validRows) {
    const existing = dedupedBySku.get(row.sku)
    if (!existing) {
      dedupedBySku.set(row.sku, row)
      continue
    }

    dedupedBySku.set(row.sku, {
      ...existing,
      item_name: existing.item_name ?? row.item_name,
      brand: existing.brand ?? row.brand,
      model_number: existing.model_number ?? row.model_number,
      upc: existing.upc ?? row.upc,
      image_url: existing.image_url ?? row.image_url,
      home_depot_url:
        existing.home_depot_url && !isSearchHomeDepotUrl(existing.home_depot_url)
          ? existing.home_depot_url
          : row.home_depot_url ?? existing.home_depot_url,
      internet_sku: existing.internet_sku ?? row.internet_sku,
      retail_price: existing.retail_price ?? row.retail_price,
    })
  }

  const dedupedRows = Array.from(dedupedBySku.values())
  if (dedupedRows.length !== validRows.length) {
    console.log(`🔁 Deduped rows: ${validRows.length} → ${dedupedRows.length}`)
    console.log()
  }

  const nowIso = new Date().toISOString()
  const candidateSkus = dedupedRows.map((r) => r.sku)
  const existingBySku = merge ? await fetchExistingBySku(candidateSkus) : new Map()

  const rowsToUpsert: Array<(typeof validRows)[number]> = []
  let wouldInsert = 0
  let wouldUpdate = 0
  let wouldSkip = 0

  for (const row of dedupedRows) {
    if (!merge) {
      rowsToUpsert.push({ ...row, updated_at: nowIso })
      continue
    }

    const existing = existingBySku.get(row.sku)
    if (!existing) {
      rowsToUpsert.push({ ...row, updated_at: nowIso })
      wouldInsert++
      continue
    }

    const mergedRow: (typeof validRows)[number] = {
      sku: row.sku,
      item_name: existing.item_name ?? row.item_name,
      brand: existing.brand ?? row.brand,
      model_number: existing.model_number ?? row.model_number,
      upc: existing.upc ?? row.upc,
      image_url: existing.image_url ?? row.image_url,
      home_depot_url:
        existing.home_depot_url && !isSearchHomeDepotUrl(existing.home_depot_url)
          ? existing.home_depot_url
          : row.home_depot_url ?? existing.home_depot_url,
      internet_sku: existing.internet_sku ?? row.internet_sku,
      retail_price: existing.retail_price ?? row.retail_price,
      source: existing.source ?? row.source,
      updated_at: nowIso,
    }

    const changed =
      mergedRow.item_name !== existing.item_name ||
      mergedRow.brand !== existing.brand ||
      mergedRow.model_number !== existing.model_number ||
      mergedRow.upc !== existing.upc ||
      mergedRow.image_url !== existing.image_url ||
      mergedRow.home_depot_url !== existing.home_depot_url ||
      mergedRow.internet_sku !== existing.internet_sku ||
      mergedRow.retail_price !== existing.retail_price ||
      mergedRow.source !== existing.source

    if (!changed) {
      wouldSkip++
      continue
    }

    rowsToUpsert.push(mergedRow)
    wouldUpdate++
  }

  if (merge) {
    console.log("🧩 Merge summary (fill blanks only)")
    console.log(`   Existing rows found: ${existingBySku.size}`)
    console.log(`   Would insert: ${wouldInsert}`)
    console.log(`   Would update: ${wouldUpdate}`)
    console.log(`   Unchanged skipped: ${wouldSkip}`)
    console.log()
  }

  if (rowsToUpsert.length === 0) {
    console.log("✅ Nothing to upsert (all rows already enriched).")
    process.exit(0)
  }

  if (dryRun) {
    console.log("🔍 Dry run - would upsert these rows:")
    rowsToUpsert.slice(0, 5).forEach((row) => {
      console.log(`   ${row.sku}: ${row.item_name?.substring(0, 50) || "(no name)"}`)
    })
    if (rowsToUpsert.length > 5) {
      console.log(`   ... and ${rowsToUpsert.length - 5} more`)
    }
    console.log("\n✅ Dry run complete. Remove --dry-run to execute.")
    process.exit(0)
  }

  // Upsert in batches
  const BATCH_SIZE = 50
  let errors = 0

  for (let i = 0; i < rowsToUpsert.length; i += BATCH_SIZE) {
    const batch = rowsToUpsert.slice(i, i + BATCH_SIZE)
    const progress = `[${Math.min(i + BATCH_SIZE, rowsToUpsert.length)}/${rowsToUpsert.length}]`

    try {
      const { data, error } = await supabase
        .from("penny_item_enrichment")
        .upsert(batch, { onConflict: "sku", ignoreDuplicates: false })
        .select("sku")

      if (error) {
        console.error(`${progress} ❌ Batch error:`, error.message)
        errors += batch.length
      } else {
        const count = data?.length || batch.length
        console.log(`${progress} ✅ Upserted ${count} rows`)
      }
    } catch (e) {
      console.error(`${progress} ❌ Exception:`, e)
      errors += batch.length
    }

    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < rowsToUpsert.length) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  console.log()
  console.log("🎉 Bulk enrichment complete!")
  console.log(`   Processed: ${rowsToUpsert.length}`)
  console.log(`   Errors: ${errors}`)
}

main().catch(console.error)
