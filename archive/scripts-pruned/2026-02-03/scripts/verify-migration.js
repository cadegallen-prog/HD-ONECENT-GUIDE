/**
 * Verify migration results
 *
 * Usage: node scripts/verify-migration.js
 */

const { createClient } = require("@supabase/supabase-js")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  console.log("Verifying migration results...\n")

  // Check if new columns exist by selecting them
  console.log("1. Checking if new columns exist...")
  const { data: sample, error: sampleError } = await supabase
    .from("penny_list_public")
    .select("brand, model_number, upc, retail_price")
    .limit(1)

  if (sampleError) {
    console.error("❌ Error: New columns not found in penny_list_public view")
    console.error(sampleError)
    return false
  }

  console.log("✅ New columns exist in penny_list_public view\n")

  // Check how many rows have enrichment data
  console.log("2. Checking backfill results...")
  const { data: stats, error: statsError } = await supabase
    .from("penny_list_public")
    .select("brand, model_number, upc, retail_price, home_depot_sku_6_or_10_digits")

  if (statsError) {
    console.error("❌ Error fetching stats:", statsError)
    return false
  }

  const total = stats.length
  const withBrand = stats.filter((r) => r.brand).length
  const withModel = stats.filter((r) => r.model_number).length
  const withUPC = stats.filter((r) => r.upc).length
  const withRetailPrice = stats.filter((r) => r.retail_price).length

  console.log(`Total rows: ${total}`)
  console.log(`  With brand: ${withBrand} (${Math.round((withBrand / total) * 100)}%)`)
  console.log(`  With model_number: ${withModel} (${Math.round((withModel / total) * 100)}%)`)
  console.log(`  With upc: ${withUPC} (${Math.round((withUPC / total) * 100)}%)`)
  console.log(
    `  With retail_price: ${withRetailPrice} (${Math.round((withRetailPrice / total) * 100)}%)`
  )

  // Show a few example rows
  console.log("\n3. Sample enriched rows:")
  const enrichedSamples = stats.filter((r) => r.brand || r.model_number || r.upc).slice(0, 3)

  if (enrichedSamples.length === 0) {
    console.log("⚠️  Warning: No rows have enrichment data!")
  } else {
    enrichedSamples.forEach((row, idx) => {
      console.log(`\n   Row ${idx + 1}:`)
      console.log(`     SKU: ${row.home_depot_sku_6_or_10_digits}`)
      console.log(`     Brand: ${row.brand || "(none)"}`)
      console.log(`     Model: ${row.model_number || "(none)"}`)
      console.log(`     UPC: ${row.upc || "(none)"}`)
      console.log(`     Retail Price: ${row.retail_price || "(none)"}`)
    })
  }

  console.log("\n" + "=".repeat(50))
  console.log("✅ Migration verification complete!")
  return true
}

verify()
