import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { normalizeSku, validateSku } from "../lib/sku"

type PublicRow = {
  id: string
  item_name: string | null
  home_depot_sku_6_or_10_digits: string | number | null
  purchase_date: string | null
  timestamp: string | null
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
  updated_at: string | null
}

type ExportItem = {
  storeSku: string
  internetNumber?: string
  name?: string
  brand?: string
  modelNumber?: string
  upc?: string
  imageUrl?: string
  productUrl?: string
  retailPrice?: number
  timestamps: {
    firstSeenAt?: string
    lastSeenAt?: string
    lastReportAt?: string
    enrichmentUpdatedAt?: string
  }
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

function toDateMs(value: string | null | undefined): number | undefined {
  const t = value?.trim()
  if (!t) return undefined
  const ms = new Date(t).getTime()
  return Number.isNaN(ms) ? undefined : ms
}

function parsePrice(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined
  const digits = String(value).replace(/[^0-9.]/g, "")
  if (!digits) return undefined
  const n = Number(digits)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

async function fetchPaged<T>(
  supabase: ReturnType<typeof createClient>,
  table: string,
  select: string
): Promise<T[]> {
  const pageSize = 1000
  const rows: T[] = []
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1)
    if (error) throw error
    const batch = (data as T[] | null) ?? []
    rows.push(...batch)
    if (batch.length < pageSize) break
  }
  return rows
}

async function main() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const [publicRows, enrichmentRows] = await Promise.all([
    fetchPaged<PublicRow>(
      supabase,
      "penny_list_public",
      "id,item_name,home_depot_sku_6_or_10_digits,purchase_date,timestamp"
    ),
    fetchPaged<EnrichmentRow>(
      supabase,
      "penny_item_enrichment",
      "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price,updated_at"
    ),
  ])

  const bySku = new Map<string, ExportItem>()

  // Aggregate first/last timestamps and a fallback name from reports
  for (const row of publicRows) {
    const sku = normalizeSkuValue(row.home_depot_sku_6_or_10_digits)
    if (!sku) continue
    const item = bySku.get(sku) || { storeSku: sku, timestamps: {} }
    const tsMs = toDateMs(row.timestamp)
    const purchaseMs = toDateMs(row.purchase_date)
    // lastSeen uses purchase_date when present else timestamp
    const lastSeenMs = purchaseMs ?? tsMs
    if (lastSeenMs !== undefined) {
      if (
        !item.timestamps.lastSeenAt ||
        lastSeenMs > new Date(item.timestamps.lastSeenAt).getTime()
      ) {
        item.timestamps.lastSeenAt = new Date(lastSeenMs).toISOString()
      }
    }
    if (tsMs !== undefined) {
      if (
        !item.timestamps.lastReportAt ||
        tsMs > new Date(item.timestamps.lastReportAt).getTime()
      ) {
        item.timestamps.lastReportAt = new Date(tsMs).toISOString()
      }
    }
    const allMs = [tsMs, purchaseMs].filter((x): x is number => x !== undefined)
    if (allMs.length) {
      const min = Math.min(...allMs)
      if (!item.timestamps.firstSeenAt || min < new Date(item.timestamps.firstSeenAt).getTime()) {
        item.timestamps.firstSeenAt = new Date(min).toISOString()
      }
    }
    if (!item.name && row.item_name?.trim()) item.name = row.item_name.trim()
    bySku.set(sku, item)
  }

  // Overlay enrichment (wins for metadata)
  for (const erow of enrichmentRows) {
    const sku = normalizeSkuValue(erow.sku)
    if (!sku) continue
    const item = bySku.get(sku) || { storeSku: sku, timestamps: {} }
    if (erow.item_name?.trim()) item.name = erow.item_name.trim()
    if (erow.brand?.trim()) item.brand = erow.brand.trim()
    if (erow.model_number?.trim()) item.modelNumber = erow.model_number.trim()
    if (erow.upc?.trim()) item.upc = erow.upc.trim()
    if (erow.image_url?.trim()) item.imageUrl = erow.image_url.trim()
    if (erow.home_depot_url?.trim()) item.productUrl = erow.home_depot_url.trim()
    if (typeof erow.internet_sku === "number") item.internetNumber = String(erow.internet_sku)
    const price = parsePrice(erow.retail_price)
    if (price !== undefined) item.retailPrice = price
    if (erow.updated_at?.trim())
      item.timestamps.enrichmentUpdatedAt = new Date(erow.updated_at).toISOString()
    bySku.set(sku, item)
  }

  // Prepare outputs
  const items = Array.from(bySku.values()).sort((a, b) => a.storeSku.localeCompare(b.storeSku))
  const now = new Date()
  const stamp = now.toISOString().slice(0, 10)
  const outDir = path.resolve(".local")
  await mkdir(outDir, { recursive: true })
  const jsonPath = path.join(outDir, `pennycentral_export_${stamp}.json`)
  const summaryPath = path.join(outDir, `pennycentral_export_${stamp}.summary.md`)

  await writeFile(
    jsonPath,
    JSON.stringify({ generatedAt: now.toISOString(), count: items.length, items }, null, 2)
  )

  const withMeta = items.filter(
    (i) => i.name || i.brand || i.productUrl || i.upc || i.internetNumber || i.imageUrl
  ).length
  const lines = [
    `# PennyCentral Export Summary (${stamp})`,
    "",
    `Total SKUs: ${items.length}`,
    `With metadata: ${withMeta}`,
    "",
    "Fields: storeSku, internetNumber, name, brand, modelNumber, upc, imageUrl, productUrl, retailPrice, timestamps{firstSeenAt,lastSeenAt,lastReportAt,enrichmentUpdatedAt}",
  ]
  await writeFile(summaryPath, lines.join("\n"), "utf-8")

  console.log(`✅ Exported ${items.length} SKUs`) // eslint-disable-line no-console
  console.log(`   JSON: ${jsonPath}`)
  console.log(`   Summary: ${summaryPath}`)
}

main().catch((err) => {
  console.error(err) // eslint-disable-line no-console
  process.exitCode = 1
})
