#!/usr/bin/env node
/**
 * Import purchase dates from Home Depot purchase history CSV
 *
 * Usage: npx tsx scripts/add-purchase-dates.ts <path-to-csv>
 * Example: npx tsx scripts/add-purchase-dates.ts "Purchase_History_November-23-2025_7-42-AM.csv"
 */

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

interface VerifiedPenny {
  sku: string
  internetNumber: string
  name: string
  brand: string
  model: string
  imageUrl: string
  purchaseDates?: string[]
}

interface PurchaseRecord {
  sku: string
  date: string
}

// Parse CSV file
function parseCSV(filePath: string): PurchaseRecord[] {
  const content = readFileSync(filePath, "utf8")
  const lines = content.split("\n")

  // Skip first 7 header lines
  const dataLines = lines.slice(7)

  const purchases: PurchaseRecord[] = []

  for (const line of dataLines) {
    if (!line.trim()) continue

    // Simple CSV parsing - handle quoted fields
    const fields = line
      .split(",")
      .map((field) => field.replace(/^"(.*)"$/, "$1").trim())

    if (fields.length < 19) continue

    const date = fields[0]?.trim() // Column 1: Date
    const sku = fields[5]?.trim() // Column 6: SKU Number
    const unitPrice = fields[8]?.trim() // Column 9: Unit price

    // Only include penny items ($0.01)
    if (unitPrice !== "$0.01") continue
    if (!date || !sku) continue

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue

    purchases.push({ sku, date })
  }

  return purchases
}

// Group purchases by SKU, collecting all unique dates
function groupBySkuAndDate(purchases: PurchaseRecord[]): Record<string, string[]> {
  const grouped: Record<string, Set<string>> = {}

  for (const { sku, date } of purchases) {
    if (!grouped[sku]) {
      grouped[sku] = new Set()
    }
    grouped[sku].add(date)
  }

  // Convert sets to sorted arrays (newest first)
  const result: Record<string, string[]> = {}
  for (const [sku, dates] of Object.entries(grouped)) {
    result[sku] = Array.from(dates).sort().reverse() // Newest first
  }

  return result
}

// Main function
async function main() {
  const csvPath = process.argv[2]

  if (!csvPath) {
    console.error("Usage: npx tsx scripts/add-purchase-dates.ts <path-to-csv>")
    process.exit(1)
  }

  try {
    console.log(`📖 Reading CSV from: ${csvPath}`)
    const purchases = parseCSV(csvPath)
    console.log(`✅ Found ${purchases.length} penny purchases in CSV`)

    const groupedPurchases = groupBySkuAndDate(purchases)
    console.log(`✅ Grouped into ${Object.keys(groupedPurchases).length} unique SKUs`)

    // Load verified-pennies.json
    const verifiedPath = path.join(process.cwd(), "data", "verified-pennies.json")
    console.log(`\n📖 Reading verified pennies from: ${verifiedPath}`)

    const verifiedContent = readFileSync(verifiedPath, "utf8")
    const verified: Record<string, VerifiedPenny> = JSON.parse(verifiedContent)

    // Create backup
    const backupPath = path.join(
      process.cwd(),
      "data",
      `verified-pennies.backup.${new Date().getTime()}.json`
    )
    writeFileSync(backupPath, verifiedContent)
    console.log(`💾 Backup created: ${backupPath}`)

    // Merge dates into verified pennies
    let matchCount = 0
    let totalDatesAdded = 0

    for (const [sku, dates] of Object.entries(groupedPurchases)) {
      if (verified[sku]) {
        verified[sku].purchaseDates = dates
        matchCount++
        totalDatesAdded += dates.length
      }
    }

    console.log(`\n✅ Matched ${matchCount} SKUs from CSV to verified pennies`)
    console.log(`✅ Added ${totalDatesAdded} purchase dates total`)

    // Save updated verified-pennies.json
    writeFileSync(verifiedPath, JSON.stringify(verified, null, 2))
    console.log(`\n💾 Updated: ${verifiedPath}`)

    // Summary
    console.log("\n📊 Summary:")
    console.log(`  - Total CSV penny purchases: ${purchases.length}`)
    console.log(`  - Unique SKUs in CSV: ${Object.keys(groupedPurchases).length}`)
    console.log(`  - Matched to verified pennies: ${matchCount}`)
    console.log(`  - Unmatched SKUs: ${Object.keys(groupedPurchases).length - matchCount}`)
    console.log(`  - Total purchase dates added: ${totalDatesAdded}`)

    // Show some examples
    const examples = Object.entries(verified)
      .filter(([, item]) => item.purchaseDates && item.purchaseDates.length > 0)
      .slice(0, 5)

    if (examples.length > 0) {
      console.log("\n📝 Examples of added dates:")
      for (const [sku, item] of examples) {
        const count = item.purchaseDates?.length ?? 0
        const latest = item.purchaseDates?.[0] ?? "N/A"
        console.log(`  - SKU ${sku}: ${count} purchase(es), latest: ${latest}`)
      }
    }

    console.log("\n✨ Done! Dates have been successfully imported.")
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
