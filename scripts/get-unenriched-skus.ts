/**
 * Get SKUs that need enrichment
 *
 * Queries Supabase for Penny List items that don't have enrichment data.
 * Outputs to data/skus-to-enrich.txt for the stealth scraper.
 *
 * Usage:
 *   npx tsx scripts/get-unenriched-skus.ts --limit 20
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"

// Load env
config({ path: resolve(process.cwd(), ".env.local") })

const OUTPUT_FILE = "data/skus-to-enrich.txt"

// Parse args
function parseArgs(): { limit: number } {
  const args = process.argv.slice(2)
  let limit = 20

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[++i], 10)
    }
  }

  return { limit }
}

// Normalize SKU
function normalizeSku(sku: string | number | null): string | null {
  if (!sku) return null
  const str = String(sku).trim().replace(/\D/g, "")
  if (str.length === 6) return str
  if (str.length === 10 && (str.startsWith("100") || str.startsWith("101"))) return str
  return null
}

async function main() {
  const { limit } = parseArgs()

  console.log("📋 Getting SKUs that need enrichment...")
  console.log(`   Limit: ${limit}`)

  // Validate Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get all SKUs from Penny List
  const { data: pennyItems, error: pennyError } = await supabase
    .from("Penny List")
    .select("home_depot_sku_6_or_10_digits")
    .order("timestamp", { ascending: false })
    .limit(500)

  if (pennyError) {
    console.error("❌ Failed to fetch Penny List:", pennyError.message)
    process.exit(1)
  }

  // Get existing enrichment SKUs
  const { data: enrichedItems, error: enrichError } = await supabase
    .from("penny_item_enrichment")
    .select("sku")

  if (enrichError && enrichError.code !== "PGRST205") {
    console.error("❌ Failed to fetch enrichment:", enrichError.message)
    process.exit(1)
  }

  const enrichedSkus = new Set(
    (enrichedItems || []).map((e) => normalizeSku(e.sku)).filter(Boolean)
  )

  console.log(`   Penny List items: ${pennyItems?.length || 0}`)
  console.log(`   Already enriched: ${enrichedSkus.size}`)

  // Find SKUs needing enrichment
  const needsEnrichment: string[] = []
  const seen = new Set<string>()

  for (const item of pennyItems || []) {
    const sku = normalizeSku(item.home_depot_sku_6_or_10_digits)
    if (sku && !enrichedSkus.has(sku) && !seen.has(sku)) {
      needsEnrichment.push(sku)
      seen.add(sku)
      if (needsEnrichment.length >= limit) break
    }
  }

  console.log(`   Need enrichment: ${needsEnrichment.length}`)

  if (needsEnrichment.length === 0) {
    console.log("\n✅ All SKUs already enriched!")
    // Write empty file so workflow doesn't fail
    fs.writeFileSync(resolve(process.cwd(), OUTPUT_FILE), "")
    process.exit(0)
  }

  // Write to file
  const outputPath = resolve(process.cwd(), OUTPUT_FILE)
  fs.mkdirSync(resolve(process.cwd(), "data"), { recursive: true })
  fs.writeFileSync(outputPath, needsEnrichment.join("\n"))

  console.log(`\n✅ Wrote ${needsEnrichment.length} SKUs to ${OUTPUT_FILE}`)
  console.log(`   First few: ${needsEnrichment.slice(0, 5).join(", ")}...`)
}

main().catch(console.error)
