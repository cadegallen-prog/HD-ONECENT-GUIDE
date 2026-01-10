import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
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
  const opts: { in?: string } = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--in" && args[i + 1]) opts.in = args[++i]
  }
  if (!opts.in) throw new Error("Missing --in <cleaned-scrape.json>")
  return opts
}

function parsePrice(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined
  const digits = String(value).replace(/[^0-9.]/g, "")
  if (!digits) return undefined
  const n = Number(digits)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

async function fetchEnrichmentMap(supabase: ReturnType<typeof createClient>, skus: string[]) {
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
  const { in: inPath } = parseArgs()
  const input = JSON.parse(await readFile(inPath, "utf-8")) as CleanItem[]
  const skus = Array.from(new Set(input.map((r) => r.storeSku))).filter(Boolean)

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const enrichMap = await fetchEnrichmentMap(supabase, skus)

  const diffs: Array<{
    sku: string
    changes: Partial<
      Record<
        | "item_name"
        | "brand"
        | "model_number"
        | "upc"
        | "image_url"
        | "home_depot_url"
        | "internet_sku"
        | "retail_price",
        { from?: string; to: string }
      >
    >
  }> = []

  const tally: Record<string, number> = {
    item_name: 0,
    brand: 0,
    model_number: 0,
    upc: 0,
    image_url: 0,
    home_depot_url: 0,
    internet_sku: 0,
    retail_price: 0,
  }

  for (const item of input) {
    const ex = enrichMap.get(item.storeSku)
    const change: any = {}

    if (item.name?.trim() && !ex?.item_name?.trim()) {
      change.item_name = { from: ex?.item_name ?? undefined, to: item.name.trim() }
      tally.item_name++
    }
    if (item.brand?.trim() && !ex?.brand?.trim()) {
      change.brand = { from: ex?.brand ?? undefined, to: item.brand.trim() }
      tally.brand++
    }
    if (item.modelNumber?.trim() && !ex?.model_number?.trim()) {
      change.model_number = { from: ex?.model_number ?? undefined, to: item.modelNumber.trim() }
      tally.model_number++
    }
    if (item.upc?.trim() && !ex?.upc?.trim()) {
      change.upc = { from: ex?.upc ?? undefined, to: item.upc.trim() }
      tally.upc++
    }
    if (item.imageUrl?.trim() && !ex?.image_url?.trim()) {
      change.image_url = { from: ex?.image_url ?? undefined, to: item.imageUrl.trim() }
      tally.image_url++
    }
    if (item.productUrl?.trim() && !ex?.home_depot_url?.trim()) {
      change.home_depot_url = { from: ex?.home_depot_url ?? undefined, to: item.productUrl.trim() }
      tally.home_depot_url++
    }
    if (item.internetNumber?.trim() && ex?.internet_sku == null) {
      change.internet_sku = {
        from: ex?.internet_sku != null ? String(ex.internet_sku) : undefined,
        to: item.internetNumber.trim(),
      }
      tally.internet_sku++
    }
    const priceNew = item.retailPrice
    const priceOld = parsePrice(ex?.retail_price)
    if (priceNew !== undefined && priceOld === undefined) {
      change.retail_price = {
        from: ex?.retail_price != null ? String(ex.retail_price) : undefined,
        to: String(priceNew),
      }
      tally.retail_price++
    }

    if (Object.keys(change).length > 0) diffs.push({ sku: item.storeSku, changes: change })
  }

  const outDir = path.resolve(".local")
  await mkdir(outDir, { recursive: true })
  const stamp = new Date().toISOString().slice(0, 10)
  const outPath = path.join(outDir, `enrichment_diff_${stamp}.md`)

  const lines: string[] = []
  lines.push(`# Enrichment Diff (${stamp})`)
  lines.push("")
  lines.push(`SKUs considered: ${skus.length}`)
  lines.push(`SKUs with proposed fills: ${diffs.length}`)
  lines.push("")
  lines.push("## Field Fills")
  for (const k of Object.keys(tally)) lines.push(`- ${k}: ${tally[k]}`)
  lines.push("")
  lines.push("## Sample Changes (first 20)")
  for (const d of diffs.slice(0, 20)) {
    lines.push(`- ${d.sku}`)
    for (const [k, v] of Object.entries(d.changes)) {
      lines.push(`  - ${k}: ${v?.from ?? "(empty)"} → ${v?.to}`)
    }
  }

  await writeFile(outPath, lines.join("\n"), "utf-8")
  console.log(`✅ Wrote diff report: ${outPath}`) // eslint-disable-line no-console
}

main().catch((err) => {
  console.error(err) // eslint-disable-line no-console
  process.exitCode = 1
})
