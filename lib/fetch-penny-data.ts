import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { extractStateFromLocation } from "./penny-list-utils"
import { PLACEHOLDER_IMAGE_URL } from "./image-cache"
import { getSupabaseClient } from "./supabase/client"
import { normalizeSku, validateSku } from "./sku"
import { filterValidPennyItems } from "./penny-list-utils"

const envConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const fetchWarningsLogged = {
  anonEmpty: false,
  enrichmentMissing: false,
  pennyListMissing: false,
}
const PENNY_LIST_CACHE_SECONDS = 60
const PENNY_LIST_BASE_COLUMNS = [
  "id",
  "purchase_date",
  "item_name",
  "home_depot_sku_6_or_10_digits",
  "exact_quantity_found",
  "store_city_state",
  "image_url",
  "home_depot_url",
  "internet_sku",
  "timestamp",
  "brand",
  "model_number",
  "upc",
  "retail_price",
]
const PENNY_LIST_HEAVY_COLUMNS = ["notes_optional"]

export type PennyItem = {
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

export type SupabasePennyRow = {
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

export type SupabasePennyEnrichmentRow = {
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
  const raw = value?.trim()
  if (!raw) return null

  const candidates: string[] = []
  const seen = new Set<string>()

  const addCandidate = (candidate: string) => {
    const normalized = candidate.trim()
    if (!normalized || seen.has(normalized)) return
    seen.add(normalized)
    candidates.push(normalized)
  }

  addCandidate(raw)

  const spaceReplaced = raw.replace(/\s+/g, "T")
  if (spaceReplaced !== raw) {
    addCandidate(spaceReplaced)
  }

  if (spaceReplaced.includes("T") && !/[zZ]|[+\-]\d{2}:?\d{2}$/.test(spaceReplaced)) {
    addCandidate(`${spaceReplaced}Z`)
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    addCandidate(`${raw}T00:00:00Z`)
  }

  for (const candidate of candidates) {
    const parsed = new Date(candidate)
    if (!Number.isNaN(parsed.getTime())) {
      return { iso: parsed.toISOString(), ms: parsed.getTime() }
    }
  }

  return null
}

type PennyItemEnrichment = {
  sku: string
  name?: string
  brand?: string
  modelNumber?: string
  upc?: string
  imageUrl?: string
  internetNumber?: string
  homeDepotUrl?: string
  retailPrice?: number
  updatedAtMs: number
}

function normalizeEnrichmentRow(row: SupabasePennyEnrichmentRow): PennyItemEnrichment | null {
  const sku = normalizeSkuValue(row.sku)
  if (!sku) return null

  const updatedAtText = normalizeOptionalText(row.updated_at)
  const updatedAtMs = updatedAtText ? new Date(updatedAtText).getTime() : 0

  return {
    sku,
    name: normalizeOptionalText(row.item_name),
    brand: normalizeOptionalText(row.brand),
    modelNumber: normalizeOptionalText(row.model_number),
    upc: normalizeOptionalText(row.upc),
    imageUrl: normalizeOptionalText(row.image_url),
    internetNumber: normalizeIntToString(row.internet_sku),
    homeDepotUrl: normalizeOptionalText(row.home_depot_url),
    retailPrice: parsePriceValue(row.retail_price),
    updatedAtMs: Number.isNaN(updatedAtMs) ? 0 : updatedAtMs,
  }
}

function buildEnrichmentIndex(
  rows: SupabasePennyEnrichmentRow[]
): Map<string, PennyItemEnrichment> {
  const index = new Map<string, PennyItemEnrichment>()

  rows.forEach((row) => {
    const normalized = normalizeEnrichmentRow(row)
    if (!normalized) return

    const existing = index.get(normalized.sku)
    if (!existing || normalized.updatedAtMs >= existing.updatedAtMs) {
      index.set(normalized.sku, normalized)
    }
  })

  return index
}

export function applyEnrichment(
  items: PennyItem[],
  rows: SupabasePennyEnrichmentRow[] | null,
  options: { hideUnenriched?: boolean } = {}
): PennyItem[] {
  const { hideUnenriched = true } = options

  // If no enrichment data and hiding unenriched, return empty list
  if (!rows || rows.length === 0) {
    return hideUnenriched ? [] : items
  }

  const index = buildEnrichmentIndex(rows)
  if (index.size === 0) {
    return hideUnenriched ? [] : items
  }

  // Map items and apply enrichment, then filter if hideUnenriched is true
  const enrichedItems = items
    .map((item) => {
      const enrichment = index.get(item.sku)
      if (!enrichment) return hideUnenriched ? null : item

      return {
        ...item,
        // Enriched data ALWAYS overrides user-submitted data when available
        name: enrichment.name || item.name,
        brand: enrichment.brand || item.brand,
        modelNumber: enrichment.modelNumber || item.modelNumber,
        upc: enrichment.upc || item.upc,
        imageUrl: enrichment.imageUrl || item.imageUrl,
        internetNumber: enrichment.internetNumber || item.internetNumber,
        homeDepotUrl: enrichment.homeDepotUrl || item.homeDepotUrl,
        retailPrice: enrichment.retailPrice ?? item.retailPrice,
      }
    })
    .filter((item): item is PennyItem => item !== null)

  return enrichedItems
}

function pickBestDate(row: SupabasePennyRow): { iso: string; ms: number } | null {
  const timestamp = row.timestamp ? new Date(row.timestamp) : null
  if (timestamp && !Number.isNaN(timestamp.getTime())) {
    return { iso: timestamp.toISOString(), ms: timestamp.getTime() }
  }

  const purchase = parsePurchaseDateValue(row.purchase_date)
  if (purchase) {
    return purchase
  }

  return null
}

function pickLastSeenDate(
  row: SupabasePennyRow,
  nowMs: number
): { iso: string; ms: number } | null {
  // Use timestamp (when submitted) for "Last Seen" - ensures freshness signal
  // reflects actual platform activity, not user-claimed dates.
  // This prevents "phantom activity" where old backdated submissions
  // increase find counts without updating freshness indicators.
  const timestamp = row.timestamp ? new Date(row.timestamp) : null
  if (timestamp && !Number.isNaN(timestamp.getTime()) && timestamp.getTime() <= nowMs) {
    return { iso: timestamp.toISOString(), ms: timestamp.getTime() }
  }

  // Fallback to purchase_date only if no timestamp (legacy data)
  const purchase = parsePurchaseDateValue(row.purchase_date)
  if (purchase && purchase.ms <= nowMs) {
    return purchase
  }

  return null
}

function calculateTier(locations: Record<string, number>): PennyItem["tier"] {
  const stateCount = Object.keys(locations).length
  const totalReports = Object.values(locations).reduce((sum, count) => sum + count, 0)

  if (totalReports >= 6 || stateCount >= 4) return "Very Common"
  if (totalReports >= 3 || stateCount >= 2) return "Common"
  return "Rare"
}

async function tryLocalFixtureFallback(): Promise<PennyItem[]> {
  try {
    const fixturePath = path.join(process.cwd(), "data", "penny-list.json")
    const fixtureText = await readFile(fixturePath, "utf8")
    const fixtureItems = JSON.parse(fixtureText) as PennyItem[]
    return fixtureItems
  } catch (error) {
    console.warn("Local fixture unavailable; returning empty list.", error)
    return []
  }
}

type AggregatedItem = Omit<PennyItem, "tier"> & {
  tier?: PennyItem["tier"]
  latestTimestampMs: number
  latestSeenAtMs: number
}

export function buildPennyItemsFromRows(rows: SupabasePennyRow[]): PennyItem[] {
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
        brand,
        modelNumber,
        upc,
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

    // Save the previous timestamp before updating
    const previousTimestampMs = existing.latestTimestampMs
    const previousLastSeenMs = existing.latestSeenAtMs

    // Update to track the latest timestamp
    existing.latestTimestampMs = Math.max(existing.latestTimestampMs, timestampMs)
    existing.latestSeenAtMs = Math.max(existing.latestSeenAtMs, lastSeenMs)

    // Use the previous value for comparisons to ensure newer submissions win
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

    if (imageUrl && (!existing.imageUrl || existing.imageUrl === PLACEHOLDER_IMAGE_URL)) {
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

    // Merge enrichment data (prefer non-null values)
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

  const items: PennyItem[] = Array.from(grouped.values()).map((item) => {
    const { latestTimestampMs, latestSeenAtMs, ...rest } = item
    void latestTimestampMs
    void latestSeenAtMs
    return {
      ...rest,
      tier: calculateTier(rest.locations),
      imageUrl: rest.imageUrl || PLACEHOLDER_IMAGE_URL,
    }
  })

  return items
}

/**
 * Date window for filtering Supabase queries at the database level.
 * Used to reduce data transfer by fetching only rows within a time range.
 */
export type DateWindow = {
  /** ISO string for the start of the window (inclusive) */
  startDate: string
  /** ISO string for the end of the window (inclusive), defaults to now */
  endDate?: string
}

type FetchRowsOptions = {
  dateWindow?: DateWindow
  includeNotes?: boolean
}

async function fetchRows(
  client: ReturnType<typeof getSupabaseClient>,
  label: "anon",
  options: FetchRowsOptions = {}
): Promise<SupabasePennyRow[] | null> {
  const { dateWindow, includeNotes = true } = options
  const columns = [
    ...PENNY_LIST_BASE_COLUMNS,
    ...(includeNotes ? PENNY_LIST_HEAVY_COLUMNS : []),
  ].join(",")

  let query = client.from("penny_list_public").select(columns)

  // Apply date window filter at database level for performance
  // Filter using "last seen" semantics:
  // - If purchase_date exists, treat it as authoritative for recency windows.
  // - Otherwise fall back to timestamp (report created time).
  if (dateWindow) {
    const { startDate, endDate } = dateWindow
    const startIso = startDate
    const endIso = endDate
    const startDateOnly = startIso.slice(0, 10)
    const endDateOnly = endIso ? endIso.slice(0, 10) : undefined

    const orFilters = endIso
      ? [
          `and(purchase_date.is.null,timestamp.gte.${startIso},timestamp.lte.${endIso})`,
          `and(purchase_date.not.is.null,purchase_date.gte.${startDateOnly},purchase_date.lte.${endDateOnly})`,
        ].join(",")
      : [
          `and(purchase_date.is.null,timestamp.gte.${startIso})`,
          `and(purchase_date.not.is.null,purchase_date.gte.${startDateOnly})`,
        ].join(",")
    query = query.or(orFilters)
  }

  const { data, error } = await query

  if (error) {
    const code = (error as { code?: unknown } | null)?.code
    if (code === "PGRST205") {
      if (!fetchWarningsLogged.pennyListMissing && process.env.NODE_ENV === "development") {
        console.warn(
          `Supabase view is not available yet (penny_list_public missing); falling back to fixture (${label}).`
        )
        fetchWarningsLogged.pennyListMissing = true
      }
      return null
    }

    console.error(`Error fetching penny list from Supabase (${label}):`, error)
    return null
  }

  const rows = (data as unknown as SupabasePennyRow[] | null) ?? []

  // Only warn in development mode - during builds, parallel workers may have timing issues
  // that cause spurious empty results even when data exists
  if (
    envConfigured &&
    rows.length === 0 &&
    !fetchWarningsLogged.anonEmpty &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn(`Supabase (${label}) returned no penny list rows.`)
    fetchWarningsLogged.anonEmpty = true
  }

  return rows
}

async function fetchEnrichmentRows(
  client: ReturnType<typeof getSupabaseClient>,
  label: "anon"
): Promise<SupabasePennyEnrichmentRow[] | null> {
  const { data, error } = await client
    .from("penny_item_enrichment")
    .select(
      "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price,updated_at"
    )

  if (error) {
    const code = (error as { code?: unknown } | null)?.code
    if (code === "PGRST205") {
      if (!fetchWarningsLogged.enrichmentMissing && process.env.NODE_ENV === "development") {
        console.warn(
          `Supabase enrichment table is not available yet (penny_item_enrichment missing); skipping enrichment (${label}).`
        )
        fetchWarningsLogged.enrichmentMissing = true
      }
      return null
    }

    console.error(`Error fetching penny enrichment from Supabase (${label}):`, error)
    return null
  }

  const rows = (data as unknown as SupabasePennyEnrichmentRow[] | null) ?? []
  return rows
}

type SupabaseClientLike = ReturnType<typeof getSupabaseClient>

function getSupabaseAnonReadClient(): SupabaseClientLike {
  const override = (globalThis as { __supabaseAnonReadOverride?: SupabaseClientLike })
    .__supabaseAnonReadOverride
  if (override) return override
  return getSupabaseClient()
}

export async function fetchPennyItemsFromSupabase(
  options: FetchRowsOptions = {}
): Promise<PennyItem[]> {
  try {
    const anonClient = getSupabaseAnonReadClient()
    const anonRows = await fetchRows(anonClient, "anon", options)

    if (anonRows && anonRows.length > 0) {
      const anonEnrichment = await fetchEnrichmentRows(anonClient, "anon")
      return applyEnrichment(buildPennyItemsFromRows(anonRows), anonEnrichment)
    }
  } catch (error) {
    // If Supabase is not configured or fails, we'll return empty
    // so the caller can decide to use the fixture fallback.
    // Only log if it's not the expected "env vars not set" error
    const msg = error instanceof Error ? error.message : String(error)
    if (!msg.includes("Supabase environment variables are not set")) {
      console.warn("Supabase fetch failed:", msg)
    }
  }

  return []
}

// Global cache for dev mode to prevent Supabase hammering
const GLOBAL_CACHE_DURATION = 60 * 1000 // 60 seconds
let globalCache: { data: PennyItem[]; timestamp: number } | null = null

const cacheFn =
  typeof cache === "function"
    ? cache
    : <T extends (...args: unknown[]) => Promise<PennyItem[]>>(fn: T) =>
        (...args: Parameters<T>) =>
          fn(...args)

const getPennyListSource = async (): Promise<PennyItem[]> => {
  if (process.env.PLAYWRIGHT === "1") {
    return tryLocalFixtureFallback()
  }

  const items = await fetchPennyItemsFromSupabase()

  if (items.length === 0) {
    // If Supabase returns nothing (or failed), and we are in dev mode or explicitly asked,
    // fall back to the local fixture so the app isn't empty.
    if (process.env.NODE_ENV === "development" || process.env.USE_FIXTURE_FALLBACK === "1") {
      console.warn("Supabase empty/failed; falling back to local fixture data.")
      const fixtureItems = await tryLocalFixtureFallback()
      return fixtureItems
    }
  }

  return items
}

/**
 * Returns penny items added within the last N hours (default: 48).
 * Uses a 3-month Supabase window to keep the upstream query small, then filters in-memory.
 */
export async function getRecentFinds(hours: number = 48, nowMs: number = Date.now()) {
  const cutoffMs = nowMs - hours * 60 * 60 * 1000
  const windowRange: "1m" | "3m" | "6m" = hours <= 720 ? "3m" : "6m" // cap at 6m for long windows
  const items = await getPennyListFiltered(windowRange, nowMs, { includeNotes: false })
  const valid = filterValidPennyItems(items)
  return valid
    .filter((item) => {
      const added = new Date(item.dateAdded).getTime()
      return !Number.isNaN(added) && added >= cutoffMs && added <= nowMs
    })
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
}

const getPennyListCached =
  typeof unstable_cache === "function"
    ? unstable_cache(getPennyListSource, ["penny-list"], {
        revalidate: PENNY_LIST_CACHE_SECONDS,
      })
    : getPennyListSource

const getPennyListFilteredCached =
  typeof unstable_cache === "function"
    ? unstable_cache(
        async (
          dateRange: "1m" | "3m" | "6m" | "12m" | "18m" | "24m" | "all" | undefined,
          bucketedNowMs: number,
          includeNotes: boolean
        ) => {
          const dateWindow = dateRange ? dateRangeToWindow(dateRange, bucketedNowMs) : undefined
          return fetchPennyItemsFromSupabase({ dateWindow, includeNotes })
        },
        ["penny-list-filtered"],
        {
          revalidate: PENNY_LIST_CACHE_SECONDS,
        }
      )
    : null

export const getPennyList = cacheFn(async (): Promise<PennyItem[]> => {
  // Check global cache first (useful for dev mode HMR)
  // IMPORTANT: This cache is dev-only to prevent stale data in production
  if (process.env.NODE_ENV === "development" && globalCache) {
    const age = Date.now() - globalCache.timestamp
    if (age < GLOBAL_CACHE_DURATION) {
      console.log(`Using cached penny list (age: ${Math.round(age / 1000)}s)`)
      return globalCache.data
    }
  }

  try {
    const items = await getPennyListCached()

    // Update global cache
    if (items.length > 0) {
      globalCache = { data: items, timestamp: Date.now() }
    }

    if (items.length === 0 && process.env.NODE_ENV === "development") {
      // Cache the fixture too so we don't re-read disk constantly
      const fixtureItems = await tryLocalFixtureFallback()
      if (fixtureItems.length > 0) {
        globalCache = { data: fixtureItems, timestamp: Date.now() }
      }
      return fixtureItems
    }
    return items
  } catch (error) {
    console.error("Unexpected error fetching penny list:", error)
    // Final safety net: try fixture
    if (process.env.NODE_ENV === "development") {
      return tryLocalFixtureFallback()
    }
    return []
  }
})

/**
 * Converts a date range string (e.g., "1m", "6m", "all") to a DateWindow object.
 * Used by getPennyListFiltered to translate UI filter to Supabase query.
 */
function dateRangeToWindow(
  dateRange: "1m" | "3m" | "6m" | "12m" | "18m" | "24m" | "all",
  nowMs: number = Date.now()
): DateWindow | undefined {
  if (dateRange === "all") return undefined

  const months: Record<string, number> = {
    "1m": 1,
    "3m": 3,
    "6m": 6,
    "12m": 12,
    "18m": 18,
    "24m": 24,
  }

  const monthsBack = months[dateRange]
  if (!monthsBack) return undefined

  const startDate = new Date(nowMs)
  startDate.setMonth(startDate.getMonth() - monthsBack)

  return {
    startDate: startDate.toISOString(),
    endDate: new Date(nowMs).toISOString(),
  }
}

/**
 * Fetches penny list items with optional date window filtering at the database level.
 * This is more efficient than getPennyList when displaying a filtered date range,
 * as it reduces the amount of data transferred from Supabase.
 *
 * @param dateRange - Optional date range filter ("1m", "3m", "6m", "12m", "18m", "24m", "all")
 * @param nowMs - Current timestamp in milliseconds (for date calculations)
 * @returns Filtered penny items
 */
type GetPennyListFilteredOptions = {
  includeNotes?: boolean
}

export async function getPennyListFiltered(
  dateRange?: "1m" | "3m" | "6m" | "12m" | "18m" | "24m" | "all",
  nowMs: number = Date.now(),
  options: GetPennyListFilteredOptions = {}
): Promise<PennyItem[]> {
  // For Playwright tests, use fixture data (no date filtering needed for deterministic tests)
  if (process.env.PLAYWRIGHT === "1") {
    return tryLocalFixtureFallback()
  }

  const includeNotes = options.includeNotes ?? true
  const cacheBucketMs =
    Math.floor(nowMs / (PENNY_LIST_CACHE_SECONDS * 1000)) * PENNY_LIST_CACHE_SECONDS * 1000
  const dateWindow = dateRange ? dateRangeToWindow(dateRange, cacheBucketMs) : undefined

  try {
    const items =
      getPennyListFilteredCached !== null
        ? await getPennyListFilteredCached(dateRange, cacheBucketMs, includeNotes)
        : await fetchPennyItemsFromSupabase({ dateWindow, includeNotes })

    if (items.length === 0) {
      // Fall back to fixture in dev mode if windowed query returns nothing
      if (process.env.NODE_ENV === "development" || process.env.USE_FIXTURE_FALLBACK === "1") {
        console.warn("Supabase windowed query empty; falling back to local fixture data.")
        return tryLocalFixtureFallback()
      }
    }

    return items
  } catch (error) {
    console.error("Unexpected error fetching filtered penny list:", error)
    if (process.env.NODE_ENV === "development") {
      return tryLocalFixtureFallback()
    }
    return []
  }
}
