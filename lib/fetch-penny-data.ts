import Papa from "papaparse"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { extractStateFromLocation } from "./penny-list-utils"
import { PLACEHOLDER_IMAGE_URL } from "./image-cache"

const IMAGE_URL_FIELD = "IMAGE URL"
const INTERNET_SKU_FIELD = "INTERNET SKU"

// Define the shape of your penny item
export type PennyItem = {
  id: string
  name: string
  sku: string
  internetNumber?: string // For better Home Depot product links (backend only, never displayed)
  price: number
  dateAdded: string
  tier: "Very Common" | "Common" | "Rare"
  status: string
  quantityFound: string
  imageUrl: string
  notes: string
  locations: Record<string, number>
}

// Map your CSV columns to internal keys (normalized lowercase)
const FIELD_ALIASES: Record<string, string[]> = {
  timestamp: ["timestamp"],
  email: ["email address"],
  name: ["item name", "name", "product name", "item name"],
  sku: ["home depot sku (6 or 10 digits)", "sku", "item sku", "product sku"],
  internet_sku: [
    INTERNET_SKU_FIELD,
    "internet sku",
    "internet number",
    "internetnumber",
    "internetsku (private, backend only)",
    "internetsku (private, backend only) (optional, for better hd links)",
    "internetsku",
    "internet_sku",
  ],
  quantity: ["exact quantity found", "quantity", "qty", "quantity seen"],
  city_state: ["store (city, state)", "store", "location"],
  date_found: ["purchase date", "date found", "found date", "date"],
  image_url: [IMAGE_URL_FIELD, "image url"],
  notes: ["notes (optional)", "notes", "note", "comments", "comment"],
  approved: ["approved", "is approved"],
  status: ["status", "scope"],
  date_approved: ["date approved", "approved date"],
}

function normalizeHeaderLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, " ").replace(/\s+/g, " ").trim()
}

function pickField(row: Record<string, string>, key: string): string {
  const aliases = FIELD_ALIASES[key] || []
  const normalizedEntries = Object.entries(row).map(([header, value]) => ({
    normalizedHeader: normalizeHeaderLabel(header),
    value: typeof value === "string" ? value : "",
  }))

  for (const alias of aliases) {
    const normalizedAlias = normalizeHeaderLabel(alias)
    const match = normalizedEntries.find(
      (entry) =>
        !!entry.value &&
        (entry.normalizedHeader === normalizedAlias ||
          entry.normalizedHeader.startsWith(`${normalizedAlias} `) ||
          entry.normalizedHeader.startsWith(`${normalizedAlias}(`))
    )
    if (match) {
      return match.value
    }
  }

  return ""
}

// Return ISO date (YYYY-MM-DD) when valid, otherwise null
function parseDateToISO(value: string): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().split("T")[0]
}

/**
 * Auto-calculate tier based on report data
 * - Very Common: 6+ total reports OR 4+ states
 * - Common: 3-5 reports OR 2-3 states
 * - Rare: 1-2 reports AND only 1 state
 */
function calculateTier(locations: Record<string, number>): PennyItem["tier"] {
  const stateCount = Object.keys(locations).length
  const totalReports = Object.values(locations).reduce((sum, count) => sum + count, 0)

  // Very Common: widespread across states OR many reports
  if (totalReports >= 6 || stateCount >= 4) {
    return "Very Common"
  }

  // Common: moderate spread
  if (totalReports >= 3 || stateCount >= 2) {
    return "Common"
  }

  // Rare: limited reports in limited locations
  return "Rare"
}

type EnrichmentFields = {
  imageUrl?: string
  internetSku?: string
}

async function fetchEnrichmentBySku(): Promise<Map<string, EnrichmentFields>> {
  const enrichmentUrl = process.env.GOOGLE_SHEET_ENRICHMENT_URL
  if (!enrichmentUrl) return new Map()

  try {
    const res = await fetch(enrichmentUrl, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Failed to fetch enrichment sheet: ${res.statusText}`)
    const csvText = await res.text()

    const { data } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    const bySku = new Map<string, EnrichmentFields>()

    data.forEach((row) => {
      const sku = pickField(row, "sku").trim()
      if (!sku) return

      const imageUrl = pickField(row, "image_url").trim()
      const internetSku = pickField(row, "internet_sku").trim()
      if (!imageUrl && !internetSku) return

      const existing = bySku.get(sku) ?? {}
      if (imageUrl && !existing.imageUrl) {
        existing.imageUrl = imageUrl
      }
      if (internetSku && !existing.internetSku) {
        existing.internetSku = internetSku
      }
      bySku.set(sku, existing)
    })

    return bySku
  } catch (error) {
    console.error("Error fetching enrichment sheet:", error)
    return new Map()
  }
}

async function fetchPennyListRaw(): Promise<PennyItem[]> {
  // Playwright visual smoke uses a stable local fixture to avoid snapshot drift.
  if (process.env.PLAYWRIGHT === "1") {
    try {
      const fixturePath = path.join(process.cwd(), "data", "penny-list.json")
      const fixtureText = await readFile(fixturePath, "utf8")
      const fixtureItems = JSON.parse(fixtureText) as PennyItem[]
      return fixtureItems
    } catch (error) {
      console.warn("Playwright fixture load failed, falling back to live sheet.", error)
    }
  }

  const sheetUrl = process.env.GOOGLE_SHEET_URL
  if (!sheetUrl) {
    console.warn("GOOGLE_SHEET_URL is not set. Returning empty list.")
    return []
  }

  try {
    const enrichmentPromise = fetchEnrichmentBySku()
    const res = await fetch(sheetUrl, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`)
    const csvText = await res.text()

    const { data } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    })

    const grouped: Record<string, Omit<PennyItem, "tier"> & { tier?: PennyItem["tier"] }> = {}

    data.forEach((row) => {
      // 1. Parse basic fields
      const sku = pickField(row, "sku").trim()
      if (!sku) return

      const name = pickField(row, "name").trim()
      const internetSku = pickField(row, "internet_sku").trim()
      const quantity = pickField(row, "quantity").trim()
      const cityState = pickField(row, "city_state").trim()
      const dateFound = pickField(row, "date_found").trim()
      const timestamp = pickField(row, "timestamp").trim()
      const imageUrl = pickField(row, "image_url").trim()
      const notes = pickField(row, "notes").trim()
      const status = pickField(row, "status").trim()

      // 2. Parse Date
      const parsedDate = parseDateToISO(dateFound) ?? parseDateToISO(timestamp)
      const dateAdded = parsedDate ?? ""

      // 3. Parse Location
      const state = extractStateFromLocation(cityState)

      // 4. Aggregate by SKU
      if (!grouped[sku]) {
        grouped[sku] = {
          id: sku,
          name,
          sku,
          internetNumber: internetSku || undefined,
          price: 0.01,
          dateAdded,
          status,
          quantityFound: quantity,
          imageUrl,
          notes,
          locations: {},
        }
      }

      // Update internetNumber if this row has one and we don't yet
      if (internetSku && !grouped[sku].internetNumber) {
        grouped[sku].internetNumber = internetSku
      }

      // Update imageUrl if this row has one and we don't yet
      // Keep the first non-empty image URL across duplicate rows; blanks never override.
      if (imageUrl && !grouped[sku].imageUrl) {
        grouped[sku].imageUrl = imageUrl
      }

      // Update latest date
      if (
        dateAdded &&
        (!grouped[sku].dateAdded ||
          new Date(dateAdded).getTime() > new Date(grouped[sku].dateAdded).getTime())
      ) {
        grouped[sku].dateAdded = dateAdded
      }

      // Add location count
      if (state) {
        grouped[sku].locations[state] = (grouped[sku].locations[state] || 0) + 1
      }
    })

    // Apply enrichment overlay (same SKU map from a dedicated tab, if present)
    const enrichmentBySku = await enrichmentPromise
    enrichmentBySku.forEach((enrichment, sku) => {
      const existing = grouped[sku]
      if (!existing) return

      if (enrichment.internetSku && !existing.internetNumber) {
        existing.internetNumber = enrichment.internetSku
      }
      if (enrichment.imageUrl && !existing.imageUrl) {
        existing.imageUrl = enrichment.imageUrl
      }
    })

    // 5. Calculate tier for each item based on aggregated data
    // Use placeholder for items without user-submitted/enriched photos
    const items: PennyItem[] = Object.values(grouped).map((item) => {
      return {
        ...item,
        tier: calculateTier(item.locations),
        imageUrl: item.imageUrl || PLACEHOLDER_IMAGE_URL,
      }
    })

    return items
  } catch (error) {
    console.error("Error fetching penny list:", error)
    return []
  }
}

export async function getPennyList(): Promise<PennyItem[]> {
  return fetchPennyListRaw()
}
