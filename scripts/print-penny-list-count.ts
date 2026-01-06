import { createClient } from "@supabase/supabase-js"
import { normalizeSku, validateSku } from "../lib/sku"

type PennyListPublicRow = {
  id: string
  purchase_date: string | null
  home_depot_sku_6_or_10_digits: string | number | null
  timestamp: string | null
}

type PennyItemEnrichmentRow = {
  sku: string | number | null
}

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function normalizeSkuValue(value: string | number | null): string | null {
  const normalized = normalizeSku(String(value ?? ""))
  if (!normalized) return null
  const { error } = validateSku(normalized)
  if (error) return null
  return normalized
}

function parsePurchaseDate(value: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  // purchase_date is stored as a date string (YYYY-MM-DD) in Supabase; accept ISO timestamps too.
  const dateOnly = trimmed.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return null
  return dateOnly
}

function parseTimestampMs(value: string | null): number | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const ms = new Date(trimmed).getTime()
  return Number.isNaN(ms) ? null : ms
}

function isInLastSeenWindow(row: PennyListPublicRow, startIso: string, endIso: string): boolean {
  const purchaseDate = parsePurchaseDate(row.purchase_date)
  if (purchaseDate) {
    const start = startIso.slice(0, 10)
    const end = endIso.slice(0, 10)
    return purchaseDate >= start && purchaseDate <= end
  }

  const timestampMs = parseTimestampMs(row.timestamp)
  if (timestampMs === null) return false
  const startMs = new Date(startIso).getTime()
  const endMs = new Date(endIso).getTime()
  return timestampMs >= startMs && timestampMs <= endMs
}

async function countExact(
  supabase: ReturnType<typeof createClient>,
  table: string,
  apply?: (query: any) => any
): Promise<number> {
  let query = supabase.from(table).select("id", { count: "exact", head: true })
  if (apply) query = apply(query)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

async function fetchAllRows(
  supabase: ReturnType<typeof createClient>,
  table: string,
  select: string
): Promise<PennyListPublicRow[]> {
  const pageSize = 1000
  const rows: PennyListPublicRow[] = []

  for (let offset = 0; ; offset += pageSize) {
    const from = offset
    const to = offset + pageSize - 1
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order("id", { ascending: true })
      .range(from, to)

    if (error) throw error
    const batch = (data as PennyListPublicRow[] | null) ?? []
    rows.push(...batch)
    if (batch.length < pageSize) break
  }

  return rows
}

async function fetchEnrichedSkuSet(
  supabase: ReturnType<typeof createClient>
): Promise<Set<string>> {
  const pageSize = 1000
  const skuSet = new Set<string>()

  for (let offset = 0; ; offset += pageSize) {
    const from = offset
    const to = offset + pageSize - 1
    const { data, error } = await supabase
      .from("penny_item_enrichment")
      .select("sku")
      .order("sku", { ascending: true, nullsFirst: false })
      .range(from, to)

    if (error) throw error
    const batch = (data as PennyItemEnrichmentRow[] | null) ?? []
    batch.forEach((row) => {
      const normalized = normalizeSkuValue(row.sku)
      if (normalized) skuSet.add(normalized)
    })
    if (batch.length < pageSize) break
  }

  return skuSet
}

async function main() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL")
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  })

  const nowMs = Date.now()
  const endIso = new Date(nowMs).toISOString()
  const start1m = new Date(nowMs)
  start1m.setMonth(start1m.getMonth() - 1)
  const start1mIso = start1m.toISOString()
  const start1mDateOnly = start1mIso.slice(0, 10)

  const [reportRowsAllTime, reportRowsLast30dByTimestamp] = await Promise.all([
    countExact(supabase, "penny_list_public"),
    countExact(supabase, "penny_list_public", (q) => q.gte("timestamp", start1mIso)),
  ])

  const [rowsAll, enrichedSkus] = await Promise.all([
    fetchAllRows(
      supabase,
      "penny_list_public",
      "id,purchase_date,home_depot_sku_6_or_10_digits,timestamp"
    ),
    fetchEnrichedSkuSet(supabase),
  ])

  const distinctAll = new Set<string>()
  const distinctAllEnriched = new Set<string>()
  const distinctAllUnenriched = new Set<string>()
  const distinctLastSeen30d = new Set<string>()
  const distinctLastSeen30dEnriched = new Set<string>()
  const distinctLastSeen30dUnenriched = new Set<string>()
  let invalidSkuRows = 0
  let rowsWithPurchaseDateLast30d = 0

  for (const row of rowsAll) {
    const sku = normalizeSkuValue(row.home_depot_sku_6_or_10_digits)
    if (!sku) {
      invalidSkuRows += 1
      continue
    }

    distinctAll.add(sku)
    if (enrichedSkus.has(sku)) distinctAllEnriched.add(sku)
    else distinctAllUnenriched.add(sku)

    const purchaseDate = parsePurchaseDate(row.purchase_date)
    if (purchaseDate && purchaseDate >= start1mDateOnly && purchaseDate <= endIso.slice(0, 10)) {
      rowsWithPurchaseDateLast30d += 1
    }

    if (isInLastSeenWindow(row, start1mIso, endIso)) {
      distinctLastSeen30d.add(sku)
      if (enrichedSkus.has(sku)) distinctLastSeen30dEnriched.add(sku)
      else distinctLastSeen30dUnenriched.add(sku)
    }
  }

  console.log("Penny List Counts")
  console.log("=================")
  console.log(`Now: ${endIso}`)
  console.log("")
  console.log(`Reports (rows) all-time: ${reportRowsAllTime}`)
  console.log(`Reports (rows) last 1m by timestamp: ${reportRowsLast30dByTimestamp}`)
  console.log(`Reports with purchase_date in last 1m (rows): ${rowsWithPurchaseDateLast30d}`)
  console.log("")
  console.log(`Distinct SKUs all-time (raw): ${distinctAll.size}`)
  console.log(`- enriched: ${distinctAllEnriched.size}`)
  console.log(`- unenriched: ${distinctAllUnenriched.size}`)
  console.log("")
  console.log(`Distinct SKUs last 1m by last-seen semantics: ${distinctLastSeen30d.size}`)
  console.log(`- enriched: ${distinctLastSeen30dEnriched.size}`)
  console.log(`- unenriched: ${distinctLastSeen30dUnenriched.size}`)
  console.log("")
  console.log(`Rows skipped (invalid SKU): ${invalidSkuRows}`)
  console.log("")
  console.log(
    "Notes: API/UI totals match the enriched SKU sets (unenriched items are intentionally hidden today)."
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
