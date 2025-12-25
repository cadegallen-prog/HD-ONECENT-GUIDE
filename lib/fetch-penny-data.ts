import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { cache } from "react"
import { extractStateFromLocation } from "./penny-list-utils"
import { PLACEHOLDER_IMAGE_URL } from "./image-cache"
import { getSupabaseClient, getSupabaseServiceRoleClient } from "./supabase/client"
import { normalizeSku, validateSku } from "./sku"

const envConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// TODO: Remove service role fallback once RLS allows anon reads without gaps.
function allowServiceRoleFallbackEnabled() {
  const v = process.env.SUPABASE_ALLOW_SERVICE_ROLE_FALLBACK
  return (v ?? "true").toLowerCase() !== "false" && v !== "0"
}

const fetchWarningsLogged = {
  anonEmpty: false,
  serviceRoleEmpty: false,
  fallbackDisabled: false,
  enrichmentMissing: false,
}

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
  dateAdded: string
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
  notes_optional: string | null
  home_depot_url: string | null
  internet_sku: number | null
  timestamp: string | null
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
  source: string | null
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

type PennyItemEnrichment = {
  sku: string
  name?: string
  brand?: string
  modelNumber?: string
  upc?: string
  imageUrl?: string
  internetNumber?: string
  homeDepotUrl?: string
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
  rows: SupabasePennyEnrichmentRow[] | null
): PennyItem[] {
  if (!rows || rows.length === 0) return items
  const index = buildEnrichmentIndex(rows)
  if (index.size === 0) return items

  return items.map((item) => {
    const enrichment = index.get(item.sku)
    if (!enrichment) return item

    return {
      ...item,
      name: enrichment.name ?? item.name,
      brand: enrichment.brand ?? item.brand,
      modelNumber: enrichment.modelNumber ?? item.modelNumber,
      upc: enrichment.upc ?? item.upc,
      imageUrl: enrichment.imageUrl ?? item.imageUrl,
      internetNumber: enrichment.internetNumber ?? item.internetNumber,
      homeDepotUrl: enrichment.homeDepotUrl ?? item.homeDepotUrl,
    }
  })
}

function pickBestDate(row: SupabasePennyRow): { iso: string; ms: number } | null {
  const timestamp = row.timestamp ? new Date(row.timestamp) : null
  if (timestamp && !Number.isNaN(timestamp.getTime())) {
    return { iso: timestamp.toISOString(), ms: timestamp.getTime() }
  }

  if (row.purchase_date) {
    const purchase = new Date(`${row.purchase_date}T00:00:00Z`)
    if (!Number.isNaN(purchase.getTime())) {
      return { iso: purchase.toISOString(), ms: purchase.getTime() }
    }
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
}

export function buildPennyItemsFromRows(rows: SupabasePennyRow[]): PennyItem[] {
  const grouped = new Map<string, AggregatedItem>()

  rows.forEach((row) => {
    const sku = normalizeSkuValue(row.home_depot_sku_6_or_10_digits)
    if (!sku) return

    const dateInfo = pickBestDate(row)
    const timestampMs = dateInfo?.ms ?? 0

    const state = extractStateFromLocation(row.store_city_state ?? "")
    const quantity = row.exact_quantity_found ?? null
    const imageUrl = row.image_url?.trim() || ""
    const notes = row.notes_optional?.trim() || ""
    const internetNumber = normalizeIntToString(row.internet_sku)
    const homeDepotUrl = row.home_depot_url?.trim() || null
    const name = row.item_name?.trim()

    const existing = grouped.get(sku)

    if (!existing) {
      grouped.set(sku, {
        id: sku,
        sku,
        name: name || `SKU ${sku}`,
        internetNumber,
        homeDepotUrl,
        price: 0.01,
        dateAdded: dateInfo?.iso || new Date().toISOString(),
        status: "",
        quantityFound: quantity !== null ? String(quantity) : "",
        imageUrl,
        notes,
        locations: state ? { [state]: 1 } : {},
        latestTimestampMs: timestampMs,
      })
      return
    }

    existing.latestTimestampMs = Math.max(existing.latestTimestampMs, timestampMs)

    if (dateInfo && dateInfo.ms >= existing.latestTimestampMs) {
      existing.dateAdded = dateInfo.iso
    }

    if (name && (!existing.name || timestampMs >= existing.latestTimestampMs)) {
      existing.name = name
    }

    if (notes && (!existing.notes || timestampMs >= existing.latestTimestampMs)) {
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

    if (state) {
      existing.locations[state] = (existing.locations[state] || 0) + 1
    }
  })

  const items: PennyItem[] = Array.from(grouped.values()).map((item) => {
    const { latestTimestampMs, ...rest } = item
    void latestTimestampMs
    return {
      ...rest,
      tier: calculateTier(rest.locations),
      imageUrl: rest.imageUrl || PLACEHOLDER_IMAGE_URL,
    }
  })

  return items
}

async function fetchRows(
  client: ReturnType<typeof getSupabaseClient>,
  label: "anon" | "service_role"
): Promise<SupabasePennyRow[] | null> {
  const { data, error } = await client
    .from("Penny List")
    .select(
      "id,purchase_date,item_name,home_depot_sku_6_or_10_digits,exact_quantity_found,store_city_state,image_url,notes_optional,home_depot_url,internet_sku,timestamp"
    )

  if (error) {
    console.error(`Error fetching penny list from Supabase (${label}):`, error)
    return null
  }

  const rows = (data as SupabasePennyRow[] | null) ?? []

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
  label: "anon" | "service_role"
): Promise<SupabasePennyEnrichmentRow[] | null> {
  const { data, error } = await client
    .from("penny_item_enrichment")
    .select(
      "sku,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,updated_at,source"
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

  const rows = (data as SupabasePennyEnrichmentRow[] | null) ?? []
  return rows
}

type SupabaseClientLike = ReturnType<typeof getSupabaseClient>

function getSupabaseAnonReadClient(): SupabaseClientLike {
  const override = (globalThis as { __supabaseAnonReadOverride?: SupabaseClientLike })
    .__supabaseAnonReadOverride
  if (override) return override
  return getSupabaseClient()
}

function getSupabaseServiceRoleReadClient(): SupabaseClientLike | null {
  const override = (globalThis as { __supabaseServiceRoleReadOverride?: SupabaseClientLike })
    .__supabaseServiceRoleReadOverride
  if (override) return override

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return getSupabaseServiceRoleClient()
}

export async function fetchPennyItemsFromSupabase(): Promise<PennyItem[]> {
  try {
    const anonClient = getSupabaseAnonReadClient()
    const anonRows = await fetchRows(anonClient, "anon")
    const anonEnrichment = await fetchEnrichmentRows(anonClient, "anon")

    if (anonRows && anonRows.length > 0) {
      return applyEnrichment(buildPennyItemsFromRows(anonRows), anonEnrichment)
    }

    // Anon read returned empty or null - try service role fallback
    if (!allowServiceRoleFallbackEnabled()) {
      if (!fetchWarningsLogged.fallbackDisabled && envConfigured) {
        console.warn(
          "Service role read fallback disabled (SUPABASE_ALLOW_SERVICE_ROLE_FALLBACK=0 or false)."
        )
        fetchWarningsLogged.fallbackDisabled = true
      }
    } else if (process.env.NODE_ENV === "development") {
      console.warn("Anon read empty/failed; attempting service role fallback")
    }

    const serviceRoleClient = allowServiceRoleFallbackEnabled()
      ? getSupabaseServiceRoleReadClient()
      : null
    if (serviceRoleClient) {
      const serviceRows = await fetchRows(serviceRoleClient, "service_role")
      if (serviceRows && serviceRows.length > 0) {
        if (process.env.NODE_ENV === "development") {
          console.log("Service role fallback succeeded")
        }
        const serviceEnrichment = await fetchEnrichmentRows(serviceRoleClient, "service_role")
        const fallbackEnrichment =
          serviceEnrichment && serviceEnrichment.length > 0 ? serviceEnrichment : anonEnrichment
        return applyEnrichment(buildPennyItemsFromRows(serviceRows), fallbackEnrichment)
      }

      if (
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        envConfigured &&
        !fetchWarningsLogged.serviceRoleEmpty
      ) {
        console.warn("Supabase (service role) returned no penny list rows.")
        fetchWarningsLogged.serviceRoleEmpty = true
      }
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

  if (process.env.PLAYWRIGHT === "1") {
    return tryLocalFixtureFallback()
  }

  try {
    const items = await fetchPennyItemsFromSupabase()

    // Update global cache
    if (items.length > 0) {
      globalCache = { data: items, timestamp: Date.now() }
    }

    if (items.length === 0) {
      // If Supabase returns nothing (or failed), and we are in dev mode or explicitly asked,
      // fall back to the local fixture so the app isn't empty.
      if (process.env.NODE_ENV === "development" || process.env.USE_FIXTURE_FALLBACK === "1") {
        console.warn("Supabase empty/failed; falling back to local fixture data.")
        const fixtureItems = await tryLocalFixtureFallback()
        // Cache the fixture too so we don't re-read disk constantly
        if (fixtureItems.length > 0) {
          globalCache = { data: fixtureItems, timestamp: Date.now() }
        }
        return fixtureItems
      }
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
