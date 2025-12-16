/**
 * Convert scraped data to verified pennies format
 *
 * Run with:
 *   tsx scripts/convert-verified-data.ts <input.json> [output.json]
 *
 * Example:
 *   tsx scripts/convert-verified-data.ts ./output/scraped_data_output.json ./data/verified-pennies.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"

interface ScrapedItem {
  title: string
  sku: string
  internet_sku?: string
  brand?: string
  model?: string
  images?: string[]
  price?: number
  qty?: number
}

interface VerifiedPenny {
  sku: string
  internetNumber: string
  name: string
  brand: string
  model: string
  imageUrl: string
}

function resolveCliPath(value: string): string {
  // Allow either relative or absolute paths.
  return path.isAbsolute(value) ? value : path.join(process.cwd(), value)
}

function resizeImageUrl(url: string, size: number = 400): string {
  // HD image URLs have _1000.jpg at the end, replace with desired size
  return url.replace(/_1000\.jpg$/, `_${size}.jpg`)
}

function shortenName(title: string): string {
  // Remove long product codes from end of title
  // e.g., "Feit Electric 60-Watt ... ETC60927CAWFILHDRP/3" -> "Feit Electric 60-Watt ..."
  const parts = title.split(" ")
  // If the last part looks like a model number (has letters and numbers/slashes), remove it
  if (parts.length > 3 && /[A-Z0-9\/\-]{6,}/.test(parts[parts.length - 1])) {
    parts.pop()
  }
  return parts.join(" ").trim()
}

async function main() {
  const inputArg = process.argv[2]
  const outputArg = process.argv[3]

  if (!inputArg) {
    console.error(
      "Usage: tsx scripts/convert-verified-data.ts <input.json> [output.json]\n" +
        "Example: tsx scripts/convert-verified-data.ts ./output/scraped_data_output.json ./data/verified-pennies.json"
    )
    process.exitCode = 1
    return
  }

  const inputPath = resolveCliPath(inputArg)
  const outputPath = outputArg
    ? resolveCliPath(outputArg)
    : path.join(process.cwd(), "data", "verified-pennies.json")

  console.log("Reading scraped data...")
  const rawData = readFileSync(inputPath, "utf8")
  const items: ScrapedItem[] = JSON.parse(rawData)

  console.log(`Found ${items.length} items in source file`)

  // Convert to verified pennies format
  const verifiedPennies: Record<string, VerifiedPenny> = {}

  for (const item of items) {
    if (!item.sku) continue

    const imageUrl =
      item.images && item.images.length > 0 ? resizeImageUrl(item.images[0], 400) : ""

    verifiedPennies[item.sku] = {
      sku: item.sku,
      internetNumber: item.internet_sku || "",
      name: shortenName(item.title || "Unknown Product"),
      brand: item.brand || "",
      model: item.model || "",
      imageUrl,
    }
  }

  const count = Object.keys(verifiedPennies).length
  console.log(`Converted ${count} unique items`)

  // Ensure data directory exists
  mkdirSync(path.dirname(outputPath), { recursive: true })

  // Write output
  writeFileSync(outputPath, JSON.stringify(verifiedPennies, null, 2))
  console.log(`Written to ${outputPath}`)

  // Show sample
  const sample = Object.values(verifiedPennies).slice(0, 3)
  console.log("\nSample items:")
  console.log(JSON.stringify(sample, null, 2))
}

main().catch(console.error)
