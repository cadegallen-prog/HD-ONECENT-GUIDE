import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { normalizeSku, validateSku } from "../lib/sku"

type RawScrapeItem = Record<string, unknown>

type CleanItem = {
  storeSku: string
  internetNumber?: string
  name?: string
  brand?: string
  modelNumber?: string
  upc?: string
  imageUrl?: string
  productUrl?: string
  retailPrice?: number
}

function parseArgs() {
  const args = process.argv.slice(2)
  const map: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--in" && args[i + 1]) {
      map.in = args[++i]
    }
  }
  if (!map.in) throw new Error("Missing --in <path-to-scrape.json>")
  return map
}

function normalizeSkuValue(value: unknown): string | null {
  const normalized = normalizeSku(String(value ?? ""))
  if (!normalized) return null
  const { error } = validateSku(normalized)
  if (error) return null
  return normalized
}

function parsePrice(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined
  const s = String(v)
  const digits = s.replace(/[^0-9.]/g, "")
  if (!digits) return undefined
  const n = Number(digits)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function pick<T extends string>(
  obj: Record<string, unknown>,
  keys: T[]
): Partial<Record<T, unknown>> {
  const out: Partial<Record<T, unknown>> = {}
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k]
  return out
}

async function main() {
  const { in: inPath } = parseArgs()
  const rawText = await readFile(inPath, "utf-8")
  const input = JSON.parse(rawText) as RawScrapeItem[]

  const clean: CleanItem[] = []
  let invalidSku = 0
  const fieldStats: Record<string, number> = {
    name: 0,
    brand: 0,
    modelNumber: 0,
    upc: 0,
    imageUrl: 0,
    productUrl: 0,
    internetNumber: 0,
    retailPrice: 0,
  }

  for (const row of input) {
    const src = pick(row, [
      "sku",
      "storeSku",
      "name",
      "brand",
      "model",
      "modelNumber",
      "upc",
      "image",
      "imageUrl",
      "url",
      "productUrl",
      "internet_sku",
      "internetNumber",
      "price",
      "retail",
      "retailPrice",
    ])

    const skuCandidate = src.storeSku ?? src.sku
    const storeSku = normalizeSkuValue(skuCandidate)
    if (!storeSku) {
      invalidSku++
      continue
    }

    const internetCandidate = src.internetNumber ?? src.internet_sku
    const internetNumber =
      internetCandidate != null ? String(internetCandidate).replace(/\D/g, "") : undefined
    const name = (src.name ?? undefined) as string | undefined
    const brand = (src.brand ?? undefined) as string | undefined
    const modelNumber = ((src.modelNumber ?? src.model) as string | undefined) || undefined
    const upc = (src.upc ?? undefined) as string | undefined
    const imageUrl = ((src.imageUrl ?? src.image) as string | undefined) || undefined
    const productUrl = ((src.productUrl ?? src.url) as string | undefined) || undefined
    const retailPrice = parsePrice(src.retailPrice ?? src.retail ?? src.price)

    const cleaned: CleanItem = { storeSku }
    if (internetNumber) cleaned.internetNumber = internetNumber
    if (name?.trim()) cleaned.name = name.trim()
    if (brand?.trim()) cleaned.brand = brand.trim()
    if (modelNumber?.trim()) cleaned.modelNumber = modelNumber.trim()
    if (upc?.trim()) cleaned.upc = upc.trim()
    if (imageUrl?.trim()) cleaned.imageUrl = imageUrl.trim()
    if (productUrl?.trim()) cleaned.productUrl = productUrl.trim()
    if (retailPrice !== undefined) cleaned.retailPrice = retailPrice
    clean.push(cleaned)

    if (cleaned.name) fieldStats.name++
    if (cleaned.brand) fieldStats.brand++
    if (cleaned.modelNumber) fieldStats.modelNumber++
    if (cleaned.upc) fieldStats.upc++
    if (cleaned.imageUrl) fieldStats.imageUrl++
    if (cleaned.productUrl) fieldStats.productUrl++
    if (cleaned.internetNumber) fieldStats.internetNumber++
    if (cleaned.retailPrice !== undefined) fieldStats.retailPrice++
  }

  const outDir = path.resolve(".local")
  await mkdir(outDir, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 10)
  const outPath = path.join(outDir, `penny_scrape_clean_${stamp}.json`)
  await writeFile(outPath, JSON.stringify(clean, null, 2), "utf-8")

  // Summary to stdout
  const total = input.length
  console.log("✅ Scrape validated and cleaned")
  console.log(`   Input rows: ${total}`)
  console.log(`   Kept rows: ${clean.length}`)
  console.log(`   Invalid SKU rows: ${invalidSku}`)
  console.log("   Field presence among kept rows:")
  for (const [k, v] of Object.entries(fieldStats)) console.log(`   - ${k}: ${v}`)
  console.log(`   Output: ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
