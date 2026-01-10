import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import Papa from "papaparse"
import { createClient } from "@supabase/supabase-js"
import { normalizeSku, validateSku } from "../lib/sku"

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

type EnrichmentRow = {
  sku: string | number | null
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: string | number | null
}

function getEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

function normalizeSkuValue(value: string | number | null): string | null {
  const normalized = normalizeSku(String(value ?? ""))
  if (!normalized) return null
  const { error } = validateSku(normalized)
  if (error) return null
  return normalized
}

function parseArgs() {
  const args = process.argv.slice(2)
  const opts: { in?: string; overwrite?: boolean } = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--in" && args[i + 1]) opts.in = args[++i]
    else if (a === "--overwrite") opts.overwrite = true
  }
  if (!opts.in) throw new Error("Missing --in <cleaned-scrape.json>")
  return opts
}

function shouldUse(value: string | null, overwrite: boolean): boolean {
  if (!value || !value.trim()) return false
  return overwrite || true
}

function parsePrice(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined
  const digits = String(value).replace(/[^0-9.]/g, "")
  if (!digits) return undefined
  const n = Number(digits)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

async function fetchEnrichmentMap(supabase: ReturnType<typeof createClient>, skus: string[]) {
  // Fetch in chunks of 1000 to avoid URL length limits
  const map = new Map<string, EnrichmentRow>()
  const chunk = 900
  for (let i = 0; i < skus.length; i += chunk) {
    const slice = skus.slice(i, i + chunk)
    const { data, error } = await supabase
      .from("penny_item_enrichment")
      .select(
        "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price"
      )
      .in("sku", slice)
    if (error) throw error
    for (const row of data ?? []) {
      const sku = normalizeSkuValue(row.sku)
      if (sku) map.set(sku, row as EnrichmentRow)
    }
  }
  return map
}

async function main() {
  const { in: inPath, overwrite } = parseArgs()
  const raw = JSON.parse(await readFile(inPath, "utf-8")) as CleanItem[]
  const skus = Array.from(new Set(raw.map((r) => r.storeSku))).filter(Boolean)

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const enrichMap = await fetchEnrichmentMap(supabase, skus)

  type CsvRow = {
    sku: string
    item_name?: string
    brand?: string
    model_number?: string
    upc?: string
    image_url?: string
    home_depot_url?: string
    internet_sku?: string
    retail_price?: string
  }

  const rows: CsvRow[] = []

  for (const item of raw) {
    const existing = enrichMap.get(item.storeSku)
    const out: CsvRow = { sku: item.storeSku }

    const nameNew = item.name?.trim() || undefined
    const nameOld = existing?.item_name?.trim() || ""
    if (nameNew && (overwrite || !nameOld)) out.item_name = nameNew

    const brandNew = item.brand?.trim() || undefined
    const brandOld = existing?.brand?.trim() || ""
    if (brandNew && (overwrite || !brandOld)) out.brand = brandNew

    const modelNew = item.modelNumber?.trim() || undefined
    const modelOld = existing?.model_number?.trim() || ""
    if (modelNew && (overwrite || !modelOld)) out.model_number = modelNew

    const upcNew = item.upc?.trim() || undefined
    const upcOld = existing?.upc?.trim() || ""
    if (upcNew && (overwrite || !upcOld)) out.upc = upcNew

    const imgNew = item.imageUrl?.trim() || undefined
    const imgOld = existing?.image_url?.trim() || ""
    if (imgNew && (overwrite || !imgOld)) out.image_url = imgNew

    const urlNew = item.productUrl?.trim() || undefined
    const urlOld = existing?.home_depot_url?.trim() || ""
    if (urlNew && (overwrite || !urlOld)) out.home_depot_url = urlNew

    const inetNew = item.internetNumber?.trim() || undefined
    const inetOld = existing?.internet_sku != null ? String(existing.internet_sku) : ""
    if (inetNew && (overwrite || !inetOld)) out.internet_sku = inetNew

    const priceNew = item.retailPrice
    const priceOld = parsePrice(existing?.retail_price)
    if (priceNew !== undefined && (overwrite || priceOld === undefined))
      out.retail_price = String(priceNew)

    // Only include if we have at least one field to set
    const keys = Object.keys(out)
    if (keys.length > 1) rows.push(out)
  }

  const csv = Papa.unparse(rows, { header: true })
  const outDir = path.resolve(".local")
  await mkdir(outDir, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 10)
  const outPath = path.join(outDir, `enrichment_patch_${stamp}.csv`)
  await writeFile(outPath, csv, "utf-8")

  console.log(`✅ Generated CSV rows: ${rows.length}`) // eslint-disable-line no-console
  console.log(`   Output: ${outPath}`) // eslint-disable-line no-console
}

main().catch((err) => {
  console.error(err) // eslint-disable-line no-console
  process.exitCode = 1
})
