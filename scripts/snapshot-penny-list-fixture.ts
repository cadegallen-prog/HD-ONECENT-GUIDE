import { writeFile } from "node:fs/promises"
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { normalizeSku, validateSku } from "../lib/sku"
import { extractStateFromLocation } from "../lib/penny-list-utils"

type PennyItem = {
  id: string
  name: string
  sku: string
  brand?: string
  modelNumber?: string
  upc?: string
  internetNumber?: string
  homeDepotUrl?: string | null
  price: number
  retailPrice?: number | null
  dateAdded: string
  lastSeenAt?: string
  tier: "Very Common" | "Common" | "Rare"
  status: string
  quantityFound: string
  imageUrl: string
  notes: string
  locations: Record<string, number>
}

type SupabasePennyRow = {
  id: string
  purchase_date: string | null
  item_name: string | null
  home_depot_sku_6_or_10_digits: string | number | null
  exact_quantity_found: number | null
  store_city_state: string | null
  image_url: string | null
  notes_optional?: string | null
  home_depot_url: string | null
  internet_sku: number | null
  timestamp: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  retail_price: string | number | null
}

type SupabasePennyEnrichmentRow = {
  sku: string | number | null
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  updated_at: string | null
  retail_price: string | number | null
}

function loadEnvFileIfPresent(relativePath: string): void {
  const fullPath = path.join(process.cwd(), relativePath)
  if (!fs.existsSync(fullPath)) return
  const text = fs.readFileSync(fullPath, "utf8")
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (!key) continue

    // Basic unquoting for .env style values.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
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

function normalizeIntToString(value: number | null): string | undefined {
  if (value === null || value === undefined) return undefined
  const digits = String(value).replace(/\D/g, "")
  return digits || undefined
}

function normalizeOptionalText(value: string | number | null | undefined): string | undefined {
  if (value === null || value === undefined) return undefined
  const trimmed = String(value).trim()
  return trimmed ? trimmed : undefined
}

function parsePriceValue(value: string | number | null | undefined): number | undefined {
  if (value === null || value === undefined) return undefined
  const digits = String(value)
    .trim()
    .replace(/[^0-9.]/g, "")
  if (!digits) return undefined
  const parsed = Number(digits)
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined
  return parsed
}

function parsePurchaseDateValue(
  value: string | null | undefined
): { iso: string; ms: number } | null {
  const text = value?.trim()
  if (!text) return null
  const ms = new Date(text).getTime()
  if (Number.isNaN(ms)) return null
  return { iso: new Date(ms).toISOString(), ms }
}

function pickBestDate(row: SupabasePennyRow): { iso: string; ms: number } | null {
  const timestamp = row.timestamp ? new Date(row.timestamp) : null
  if (timestamp && !Number.isNaN(timestamp.getTime())) {
    return { iso: timestamp.toISOString(), ms: timestamp.getTime() }
  }

  const purchase = parsePurchaseDateValue(row.purchase_date)
  if (purchase) return purchase

  return null
}

function pickLastSeenDate(
  row: SupabasePennyRow,
  nowMs: number
): { iso: string; ms: number } | null {
  const timestamp = row.timestamp ? new Date(row.timestamp) : null
  if (timestamp && !Number.isNaN(timestamp.getTime()) && timestamp.getTime() <= nowMs) {
    return { iso: timestamp.toISOString(), ms: timestamp.getTime() }
  }

  const purchase = parsePurchaseDateValue(row.purchase_date)
  if (purchase && purchase.ms <= nowMs) return purchase

  return null
}

function calculateTier(locations: Record<string, number>): PennyItem["tier"] {
  const stateCount = Object.keys(locations).length
  const totalReports = Object.values(locations).reduce((sum, count) => sum + count, 0)

  if (totalReports >= 6 || stateCount >= 4) return "Very Common"
  if (totalReports >= 3 || stateCount >= 2) return "Common"
  return "Rare"
}

type AggregatedItem = Omit<PennyItem, "tier"> & {
  latestTimestampMs: number
  latestSeenAtMs: number
}

function buildPennyItemsFromRows(rows: SupabasePennyRow[]): PennyItem[] {
  const grouped = new Map<string, AggregatedItem>()
  const nowMs = Date.now()

  rows.forEach((row) => {
    const sku = normalizeSkuValue(row.home_depot_sku_6_or_10_digits)
    if (!sku) return

    const dateInfo = pickBestDate(row)
    const timestampMs = dateInfo?.ms ?? 0
    const lastSeenInfo = pickLastSeenDate(row, nowMs)
    const lastSeenMs = lastSeenInfo?.ms ?? 0

    const state = extractStateFromLocation(row.store_city_state ?? "")
    const quantity = row.exact_quantity_found ?? null
    const imageUrl = row.image_url?.trim() || ""
    const notes = row.notes_optional?.trim() || ""
    const internetNumber = normalizeIntToString(row.internet_sku)
    const homeDepotUrl = row.home_depot_url?.trim() || null
    const name = row.item_name?.trim()
    const brand = row.brand?.trim()
    const modelNumber = row.model_number?.trim()
    const upc = row.upc?.trim()
    const retailPrice = parsePriceValue(row.retail_price)

    const existing = grouped.get(sku)

    if (!existing) {
      grouped.set(sku, {
        id: sku,
        sku,
        name: name || `SKU ${sku}`,
        brand: normalizeOptionalText(brand),
        modelNumber: normalizeOptionalText(modelNumber),
        upc: normalizeOptionalText(upc),
        internetNumber,
        homeDepotUrl,
        price: 0.01,
        retailPrice,
        dateAdded: dateInfo?.iso || new Date().toISOString(),
        lastSeenAt: lastSeenInfo?.iso,
        status: "",
        quantityFound: quantity !== null ? String(quantity) : "",
        imageUrl,
        notes,
        locations: state ? { [state]: 1 } : {},
        latestTimestampMs: timestampMs,
        latestSeenAtMs: lastSeenMs,
      })
      return
    }

    const previousTimestampMs = existing.latestTimestampMs
    const previousLastSeenMs = existing.latestSeenAtMs

    existing.latestTimestampMs = Math.max(existing.latestTimestampMs, timestampMs)
    existing.latestSeenAtMs = Math.max(existing.latestSeenAtMs, lastSeenMs)

    if (dateInfo && dateInfo.ms > previousTimestampMs) {
      existing.dateAdded = dateInfo.iso
    }
    if (lastSeenInfo && lastSeenInfo.ms > previousLastSeenMs) {
      existing.lastSeenAt = lastSeenInfo.iso
    }

    if (name && (!existing.name || timestampMs > previousTimestampMs)) {
      existing.name = name
    }

    if (notes && (!existing.notes || timestampMs > previousTimestampMs)) {
      existing.notes = notes
    }

    if (imageUrl && !existing.imageUrl) {
      existing.imageUrl = imageUrl
    }

    if (internetNumber && !existing.internetNumber) {
      existing.internetNumber = internetNumber
    }

    if (homeDepotUrl && !existing.homeDepotUrl) {
      existing.homeDepotUrl = homeDepotUrl
    }

    if (quantity !== null && !existing.quantityFound) {
      existing.quantityFound = String(quantity)
    }

    if (brand && !existing.brand) {
      existing.brand = brand
    }

    if (modelNumber && !existing.modelNumber) {
      existing.modelNumber = modelNumber
    }

    if (upc && !existing.upc) {
      existing.upc = upc
    }

    if (retailPrice !== undefined && existing.retailPrice === undefined) {
      existing.retailPrice = retailPrice
    }

    if (state) {
      existing.locations[state] = (existing.locations[state] || 0) + 1
    }
  })

  return Array.from(grouped.values()).map((item) => {
    const { latestTimestampMs, latestSeenAtMs, ...rest } = item
    void latestTimestampMs
    void latestSeenAtMs
    return {
      ...rest,
      tier: calculateTier(rest.locations),
      imageUrl: rest.imageUrl || "/images/hd-product-placeholder.svg",
    }
  })
}

function applyEnrichment(
  items: PennyItem[],
  rows: SupabasePennyEnrichmentRow[] | null
): PennyItem[] {
  if (!rows || rows.length === 0) return items

  const index = new Map<string, SupabasePennyEnrichmentRow>()
  for (const row of rows) {
    const sku = normalizeSkuValue(row.sku)
    if (!sku) continue
    const existing = index.get(sku)
    const existingMs = existing?.updated_at ? new Date(existing.updated_at).getTime() : 0
    const rowMs = row.updated_at ? new Date(row.updated_at).getTime() : 0
    if (!existing || rowMs >= existingMs) index.set(sku, row)
  }

  return items.map((item) => {
    const row = index.get(item.sku)
    if (!row) return item

    return {
      ...item,
      name: normalizeOptionalText(row.item_name) || item.name,
      brand: normalizeOptionalText(row.brand) || item.brand,
      modelNumber: normalizeOptionalText(row.model_number) || item.modelNumber,
      upc: normalizeOptionalText(row.upc) || item.upc,
      imageUrl: normalizeOptionalText(row.image_url) || item.imageUrl,
      homeDepotUrl: normalizeOptionalText(row.home_depot_url) || item.homeDepotUrl,
      internetNumber: normalizeIntToString(row.internet_sku) || item.internetNumber,
      retailPrice: parsePriceValue(row.retail_price) ?? item.retailPrice,
    }
  })
}

async function fetchRecentRows(
  supabase: ReturnType<typeof createClient>,
  options: { targetUniqueSkus: number; maxRows: number }
): Promise<SupabasePennyRow[]> {
  const pageSize = 1000
  const rows: SupabasePennyRow[] = []
  const seenSkus = new Set<string>()

  const select =
    "id,purchase_date,item_name,home_depot_sku_6_or_10_digits,exact_quantity_found,store_city_state,image_url,notes_optional,home_depot_url,internet_sku,timestamp,brand,model_number,upc,retail_price"

  for (let offset = 0; offset < options.maxRows; offset += pageSize) {
    const { data, error } = await supabase
      .from("penny_list_public")
      .select(select)
      .order("timestamp", { ascending: false })
      .range(offset, Math.min(offset + pageSize - 1, options.maxRows - 1))

    if (error) throw error
    const batch = (data as SupabasePennyRow[] | null) ?? []
    rows.push(...batch)

    for (const row of batch) {
      const sku = normalizeSkuValue(row.home_depot_sku_6_or_10_digits)
      if (sku) seenSkus.add(sku)
    }

    if (batch.length < pageSize) break
    if (seenSkus.size >= options.targetUniqueSkus) break
  }

  return rows
}

async function main() {
  // Make local runs "just work" without adding dotenv as a dependency.
  loadEnvFileIfPresent(".env.local")
  loadEnvFileIfPresent(".env")

  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

  const targetUniqueSkus = Number(process.env.FIXTURE_ITEM_COUNT || "100")
  const maxRows = Number(process.env.FIXTURE_MAX_ROWS || "10000")

  const rows = await fetchRecentRows(supabase, { targetUniqueSkus, maxRows })
  const allItems = buildPennyItemsFromRows(rows)

  // Choose the newest items, but save deterministically (sorted by SKU) to minimize diffs.
  const newest = allItems
    .slice()
    .sort((a, b) => {
      const aMs = new Date(a.lastSeenAt || a.dateAdded).getTime()
      const bMs = new Date(b.lastSeenAt || b.dateAdded).getTime()
      return bMs - aMs
    })
    .slice(0, targetUniqueSkus)

  const skus = newest.map((i) => i.sku)

  let enrichmentRows: SupabasePennyEnrichmentRow[] | null = null
  const enrichmentResp = await supabase
    .from("penny_item_enrichment")
    .select(
      "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price,updated_at"
    )
    .in("sku", skus)

  if (enrichmentResp.error) {
    // Some environments (or anon key access) may not expose this table. The fixture is still useful without it.
    if (String((enrichmentResp.error as any)?.code || "") === "PGRST205") {
      // eslint-disable-next-line no-console
      console.warn(
        "⚠️  penny_item_enrichment not available; generating fixture without enrichment overlay."
      )
    } else {
      throw enrichmentResp.error
    }
  } else {
    enrichmentRows = (enrichmentResp.data as SupabasePennyEnrichmentRow[] | null) ?? null
  }

  // For a fixture, keep items even if enrichment is unavailable (anon key, local env, etc).
  const enriched = applyEnrichment(newest, enrichmentRows, { hideUnenriched: false })

  const sanitized = enriched
    .map((item) => ({
      ...item,
      // Notes often contain store-specific info; fixture should be safe to commit.
      notes: "",
    }))
    .sort((a, b) => a.sku.localeCompare(b.sku))

  const outPath = path.join(process.cwd(), "data", "penny-list.json")
  await writeFile(outPath, JSON.stringify(sanitized, null, 2) + "\n", "utf8")

  // eslint-disable-next-line no-console
  console.log(`✅ Wrote ${sanitized.length} items to ${outPath}`)
  // eslint-disable-next-line no-console
  console.log(
    "   Source: penny_list_public + penny_item_enrichment (sanitized; state-only locations, notes blank)"
  )
}

main().catch((err) => {
  console.error("❌ Failed to generate fixture:", err) // eslint-disable-line no-console
  process.exit(1)
})
