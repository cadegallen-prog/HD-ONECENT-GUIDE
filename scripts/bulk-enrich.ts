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
}

// Parse command line arguments
function parseArgs(): { input: string; source: string; dryRun: boolean } {
  const args = process.argv.slice(2)
  let input = "data/enrichment-input.json"
  let source = "manual"
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" && args[i + 1]) {
      input = args[++i]
    } else if (args[i] === "--source" && args[i + 1]) {
      source = args[++i]
    } else if (args[i] === "--dry-run") {
      dryRun = true
    }
  }

  return { input, source, dryRun }
}

// Normalize SKU (same logic as lib/sku.ts)
function normalizeSku(sku: string | number | null | undefined): string | null {
  if (sku === null || sku === undefined) return null
  const str = String(sku).trim().replace(/\D/g, "")
  if (str.length === 6) return str
  if (str.length === 10 && (str.startsWith("100") || str.startsWith("101"))) return str
  return null
}

// Optimize image URL to 400px version
function optimizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  // Convert to 400px version for efficient loading
  if (url.includes("thdstatic.com")) {
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/400.jpg")
  }
  return url
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
      return JSON.parse(content)
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      process.exit(1)
    }
  } else if (ext.endsWith(".csv")) {
    return parseCSV(content)
  } else {
    // Try JSON first, then CSV
    try {
      return JSON.parse(content)
    } catch {
      return parseCSV(content)
    }
  }
}

// Main function
async function main() {
  const { input, source, dryRun } = parseArgs()

  console.log("🚀 Bulk Enrichment Upload")
  console.log(`   Input: ${input}`)
  console.log(`   Source: ${source}`)
  console.log(`   Dry run: ${dryRun}`)
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
    source: string
    updated_at: string
  }> = []

  const invalidSkus: string[] = []

  for (const row of rawRows) {
    const normalized = normalizeSku(row.sku)
    if (!normalized) {
      invalidSkus.push(String(row.sku))
      continue
    }

    validRows.push({
      sku: normalized,
      item_name: row.item_name || null,
      brand: row.brand || null,
      model_number: row.model_number || null,
      upc: row.upc || null,
      image_url: optimizeImageUrl(row.image_url),
      home_depot_url: row.home_depot_url || null,
      internet_sku: row.internet_sku || null,
      source,
      updated_at: new Date().toISOString(),
    })
  }

  console.log(`✅ Valid rows: ${validRows.length}`)
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

  if (dryRun) {
    console.log("🔍 Dry run - would upsert these rows:")
    validRows.slice(0, 5).forEach((row) => {
      console.log(`   ${row.sku}: ${row.item_name?.substring(0, 50) || "(no name)"}`)
    })
    if (validRows.length > 5) {
      console.log(`   ... and ${validRows.length - 5} more`)
    }
    console.log("\n✅ Dry run complete. Remove --dry-run to execute.")
    process.exit(0)
  }

  // Upsert in batches
  const BATCH_SIZE = 50
  let inserted = 0
  let updated = 0
  let errors = 0

  for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
    const batch = validRows.slice(i, i + BATCH_SIZE)
    const progress = `[${Math.min(i + BATCH_SIZE, validRows.length)}/${validRows.length}]`

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
        inserted += count
        console.log(`${progress} ✅ Upserted ${count} rows`)
      }
    } catch (e) {
      console.error(`${progress} ❌ Exception:`, e)
      errors += batch.length
    }

    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < validRows.length) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  console.log()
  console.log("🎉 Bulk enrichment complete!")
  console.log(`   Processed: ${inserted}`)
  console.log(`   Errors: ${errors}`)
}

main().catch(console.error)
