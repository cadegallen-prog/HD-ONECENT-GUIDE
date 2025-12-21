#!/usr/bin/env tsx

/**
 * Merge enrichment data (images + internet SKUs) into current Google Sheet export
 * Creates ONE canonical merged CSV file
 *
 * Usage:
 *   tsx scripts/merge-enrichment.ts [current-sheet.csv] [enrichment.csv] [output.csv]
 *
 * Defaults:
 *   current-sheet.csv -> .local/Current-sheet-export.csv
 *   enrichment.csv -> .local/enrichment-upload.csv
 *   output.csv -> .local/penny-list-merged.csv
 */

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type EnrichmentRow = {
  sku: string
  imageUrl: string
  internetSku: string
}

type SheetRow = {
  timestamp: string
  itemName: string
  sku: string
  quantity: string
  store: string
  purchaseDate: string
  imageUrl: string
  notes: string
  internetSku: string
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField)
      currentField = ""
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++ // Skip \n in \r\n
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField)
        rows.push(currentRow)
        currentRow = []
        currentField = ""
      }
    } else {
      currentField += char
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  return rows
}

function toDigits(value: string): string {
  return value.replace(/\D+/g, "")
}

function optimizeImageUrl(url: string): string {
  // Standardize to 400.jpg for good retina quality (72px display, 400px is crisp on 2-3x)
  if (url.includes("_1000.jpg")) {
    return url.replace("_1000.jpg", "_400.jpg")
  }
  if (url.includes("_100.jpg")) {
    return url.replace("_100.jpg", "_400.jpg")
  }
  if (url.includes("_200.jpg")) {
    return url.replace("_200.jpg", "_400.jpg")
  }
  return url
}

function parseEnrichment(text: string): Map<string, EnrichmentRow> {
  const rows = parseCsv(text)
  const enrichmentMap = new Map<string, EnrichmentRow>()

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const [sku, imageUrl, internetSku] = rows[i]
    if (!sku) continue

    enrichmentMap.set(toDigits(sku), {
      sku: toDigits(sku),
      imageUrl: imageUrl || "",
      internetSku: toDigits(internetSku || ""),
    })
  }

  return enrichmentMap
}

function parseSheet(text: string): { headers: string[]; rows: SheetRow[] } {
  const csvRows = parseCsv(text)
  if (csvRows.length === 0) {
    throw new Error("Empty CSV file")
  }

  const headers = csvRows[0]
  const rows: SheetRow[] = []

  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i]
    if (row.length < 9) continue // Need all 9 columns

    rows.push({
      timestamp: row[0] || "",
      itemName: row[1] || "",
      sku: toDigits(row[2] || ""),
      quantity: row[3] || "",
      store: row[4] || "",
      purchaseDate: row[5] || "",
      imageUrl: row[6] || "",
      notes: row[7] || "",
      internetSku: toDigits(row[8] || ""),
    })
  }

  return { headers, rows }
}

function mergeCsv(
  sheet: { headers: string[]; rows: SheetRow[] },
  enrichment: Map<string, EnrichmentRow>
): string {
  const escape = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const lines = [sheet.headers.map(escape).join(",")]
  let enrichedCount = 0
  let imagesFilled = 0
  let internetSkusFilled = 0

  for (const row of sheet.rows) {
    const enrichData = enrichment.get(row.sku)
    let wasEnriched = false

    // Optimize existing image URLs to 400.jpg
    if (row.imageUrl) {
      row.imageUrl = optimizeImageUrl(row.imageUrl)
    }

    // Fill missing image URL from enrichment
    if (!row.imageUrl && enrichData?.imageUrl) {
      row.imageUrl = optimizeImageUrl(enrichData.imageUrl)
      imagesFilled++
      wasEnriched = true
    }

    // Fill missing internet SKU from enrichment
    if (!row.internetSku && enrichData?.internetSku) {
      row.internetSku = enrichData.internetSku
      internetSkusFilled++
      wasEnriched = true
    }

    if (wasEnriched) {
      enrichedCount++
    }

    lines.push(
      [
        row.timestamp,
        row.itemName,
        row.sku,
        row.quantity,
        row.store,
        row.purchaseDate,
        row.imageUrl,
        row.notes,
        row.internetSku,
      ]
        .map(escape)
        .join(",")
    )
  }

  console.log(`✅ Merged ${sheet.rows.length} rows`)
  console.log(`   - Enriched ${enrichedCount} rows`)
  console.log(`   - Filled ${imagesFilled} missing images`)
  console.log(`   - Filled ${internetSkusFilled} missing internet SKUs`)

  return lines.join("\n")
}

async function main() {
  const [, , currentSheetPath, enrichmentPath, outputPath] = process.argv

  const currentPath =
    currentSheetPath || path.join(".local", "Current-sheet-export.csv")
  const enrichPath =
    enrichmentPath || path.join(".local", "enrichment-upload.csv")
  const outPath = outputPath || path.join(".local", "penny-list-merged.csv")

  console.log("📊 Reading files...")
  const [currentText, enrichmentText] = await Promise.all([
    readFile(currentPath, "utf8"),
    readFile(enrichPath, "utf8"),
  ])

  console.log("🔄 Parsing data...")
  const enrichment = parseEnrichment(enrichmentText)
  const sheet = parseSheet(currentText)

  console.log(`   - Enrichment data: ${enrichment.size} SKUs`)
  console.log(`   - Current sheet: ${sheet.rows.length} rows`)

  console.log("🔗 Merging...")
  const merged = mergeCsv(sheet, enrichment)

  console.log("💾 Writing merged file...")
  await writeFile(outPath, merged, "utf8")

  console.log(`\n✨ Done! Merged file: ${path.resolve(outPath)}`)
  console.log("\n📋 Next steps:")
  console.log("   1. Review the merged file")
  console.log("   2. Copy all rows (Ctrl+A, Ctrl+C)")
  console.log("   3. Paste into Google Sheets")
  console.log("   4. Delete .local/enrichment-upload.csv (no longer needed)")
}

void main()
