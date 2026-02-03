/**
 * Backup script for Penny List and enrichment tables
 *
 * Usage: node scripts/backup-tables.js
 *
 * Exports both tables to CSV files in the backups/ directory
 */

const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing Supabase credentials")
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function convertToCSV(data, columns) {
  if (!data || data.length === 0) return ""

  // CSV header
  const header = columns.join(",")

  // CSV rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col]
        if (value === null || value === undefined) return ""
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(",")
  })

  return [header, ...rows].join("\n")
}

async function backupTable(tableName, columns, filename) {
  console.log(`Backing up ${tableName}...`)

  try {
    const { data, error } = await supabase.from(tableName).select(columns.join(","))

    if (error) {
      console.error(`Error fetching ${tableName}:`, error)
      return false
    }

    console.log(`  Fetched ${data.length} rows`)

    const csv = convertToCSV(data, columns)
    const backupsDir = path.join(process.cwd(), "backups")

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    const filepath = path.join(backupsDir, filename)
    fs.writeFileSync(filepath, csv, "utf8")

    console.log(`  Saved to ${filepath}`)
    return true
  } catch (err) {
    console.error(`Error backing up ${tableName}:`, err)
    return false
  }
}

async function main() {
  const timestamp = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  console.log("Starting database backup...\n")

  // Backup Penny List
  const pennyListSuccess = await backupTable(
    "Penny List",
    [
      "id",
      "purchase_date",
      "item_name",
      "home_depot_sku_6_or_10_digits",
      "exact_quantity_found",
      "store_city_state",
      "image_url",
      "notes_optional",
      "home_depot_url",
      "internet_sku",
      "timestamp",
      "status",
      "source",
    ],
    `backup_penny_list_${timestamp}.csv`
  )

  console.log("")

  // Backup enrichment table
  const enrichmentSuccess = await backupTable(
    "penny_item_enrichment",
    [
      "sku",
      "item_name",
      "brand",
      "model_number",
      "upc",
      "image_url",
      "home_depot_url",
      "internet_sku",
      "retail_price",
      "updated_at",
      "source",
      "status",
      "attempt_count",
      "retry_after",
      "last_search_term",
    ],
    `backup_enrichment_${timestamp}.csv`
  )

  console.log("\n" + "=".repeat(50))
  if (pennyListSuccess && enrichmentSuccess) {
    console.log("✅ Backup completed successfully!")
  } else {
    console.log("❌ Backup completed with errors")
    process.exit(1)
  }
}

main()
