/**
 * Integrates scraped data from GHETTO_SCRAPER JSON into Supabase
 *
 * Usage:
 *   npx tsx scripts/integrate-scrape.ts --input <file> [--force]
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

config({ path: resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ScrapedItem {
  internetNumber?: string
  storeSku?: string
  name?: string
  brand?: string
  model?: string
  upc?: string
  imageUrl?: string
  retailPrice?: number | null
  productUrl?: string
  homeDepotUrl?: string
  scrapedAt?: string
}

async function main() {
  const args = process.argv.slice(2)
  const inputIdx = args.indexOf("--input")
  const forceFlag = args.includes("--force")

  if (inputIdx === -1 || !args[inputIdx + 1]) {
    console.error("Usage: npx tsx scripts/integrate-scrape.ts --input <file> [--force]")
    process.exit(1)
  }

  const inputFile = args[inputIdx + 1]

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`)
    process.exit(1)
  }

  console.log(`📖 Reading from: ${inputFile}`)
  const rawData = fs.readFileSync(inputFile, "utf-8")
  const data = JSON.parse(rawData) as Record<string, ScrapedItem>

  const items = Object.entries(data)
    .filter(([sku]) => {
      // Filter out invalid/placeholder entries
      return /^\d{6}$|^10\d{8}$/.test(sku) && sku !== "https://www.homedepot.com/s/1000003011"
    })
    .map(([sku, item]) => ({
      sku,
      item_name: item.name || null,
      brand: item.brand || null,
      model_number: item.model || null,
      upc: item.upc || null,
      image_url: item.imageUrl || null,
      home_depot_url: item.homeDepotUrl || item.productUrl || null,
      internet_sku: item.internetNumber ? parseInt(item.internetNumber) : null,
      retail_price:
        item.retailPrice && item.retailPrice > 0 ? parseFloat(String(item.retailPrice)) : null,
      source: "manual",
    }))

  console.log(`\n📊 Parsed ${items.length} items for enrichment`)

  if (items.length === 0) {
    console.error("❌ No valid items found")
    process.exit(1)
  }

  // Show sample
  console.log(`\n📌 Sample item:`)
  console.log(JSON.stringify(items[0], null, 2))

  if (!forceFlag) {
    console.log(`\n⚠️  Use --force to actually insert into Supabase`)
    console.log(`⚠️  This would insert/update ${items.length} items`)
    return
  }

  console.log(`\n⏳ Inserting ${items.length} items into Supabase...`)

  const { data: result, error } = await supabase
    .from("penny_item_enrichment")
    .upsert(items, { onConflict: "sku" })

  if (error) {
    console.error("❌ Upsert failed:", error)
    process.exit(1)
  }

  console.log(`✅ Successfully upserted ${items.length} items`)

  // Verify a few random SKUs
  const verifySkus = items.slice(0, 3).map((i) => i.sku)
  const { data: verified } = await supabase
    .from("penny_item_enrichment")
    .select("sku, item_name, retail_price, image_url")
    .in("sku", verifySkus)

  if (verified && verified.length > 0) {
    console.log(`\n✨ Verification sample:`)
    verified.forEach((v) => {
      console.log(`  ${v.sku}: ${v.item_name} - $${v.retail_price} - ${v.image_url ? "📸" : "❌"}`)
    })
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
