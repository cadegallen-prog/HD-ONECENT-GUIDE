#!/usr/bin/env tsx

/**
 * Convert Cade's bookmark-exported JSON (sku, imageUrl, internetSku) into a
 * Sheet-ready CSV with canonical headers:
 *   - Home Depot SKU (6 or 10 digits)
 *   - IMAGE URL
 *   - INTERNET SKU
 *
 * Usage:
 *   tsx scripts/enrichment-json-to-csv.ts input.json [output.csv]
 *
 * Defaults:
 *   output.csv -> ./.local/enrichment-upload.csv
 */

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type EnrichmentInput = {
  sku?: string | number
  imageUrl?: string
  internetSku?: string | number
  internetNumber?: string | number // Also support internetNumber field
}

type NormalizedRow = {
  sku: string
  imageUrl: string
  internetSku: string
}

function toDigits(value: string | number | undefined): string {
  const str = String(value ?? "").trim()
  const digits = str.replace(/\D+/g, "")
  return digits
}

function normalizeRows(raw: unknown): NormalizedRow[] {
  const rows: EnrichmentInput[] = []

  if (Array.isArray(raw)) {
    rows.push(...raw)
  } else if (raw && typeof raw === "object") {
    // Object keyed by SKU
    for (const value of Object.values(raw as Record<string, EnrichmentInput>)) {
      rows.push(value)
    }
  }

  const bySku = new Map<string, NormalizedRow>()

  for (const entry of rows) {
    const sku = toDigits(entry.sku)
    if (!sku) continue

    // Optimize image URL: standardize to 400.jpg for good retina quality
    // (thumbnails display at 72px, 400px is crisp on 2-3x retina without being wasteful)
    let imageUrl = String(entry.imageUrl ?? "").trim()
    if (imageUrl.includes("_1000.jpg")) {
      imageUrl = imageUrl.replace("_1000.jpg", "_400.jpg")
    }

    // Support both internetSku and internetNumber field names
    const internetSku = toDigits(entry.internetSku ?? entry.internetNumber)
    const existing = bySku.get(sku) ?? { sku, imageUrl: "", internetSku: "" }

    if (!existing.imageUrl && imageUrl) {
      existing.imageUrl = imageUrl
    }
    if (!existing.internetSku && internetSku) {
      existing.internetSku = internetSku
    }

    bySku.set(sku, existing)
  }

  return Array.from(bySku.values()).filter((row) => row.imageUrl || row.internetSku)
}

function toCsv(rows: NormalizedRow[]): string {
  const header = ["Home Depot SKU (6 or 10 digits)", "IMAGE URL", "INTERNET SKU"]
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  const lines = [header.join(",")]

  for (const row of rows) {
    lines.push([row.sku, row.imageUrl, row.internetSku].map(escape).join(","))
  }

  return lines.join("\n")
}

async function main() {
  const [, , inputPath, outputArg] = process.argv
  if (!inputPath) {
    console.error("Usage: tsx scripts/enrichment-json-to-csv.ts <input.json> [output.csv]")
    process.exit(1)
  }

  const outputPath = outputArg || path.join(".local", "enrichment-upload.csv")

  const raw = await readFile(inputPath, "utf8")
  const parsed = JSON.parse(raw) as unknown
  const normalized = normalizeRows(parsed)

  if (normalized.length === 0) {
    console.error("No valid enrichment rows found (need sku + imageUrl and/or internetSku).")
    process.exit(1)
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, toCsv(normalized), "utf8")

  console.log(`Wrote ${normalized.length} enrichment row(s) to ${path.resolve(outputPath)}`)
  console.log("Headers: Home Depot SKU (6 or 10 digits), IMAGE URL, INTERNET SKU")
}

void main()
