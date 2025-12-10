import Papa from "papaparse"

// Define the shape of your penny item
export type PennyItem = {
  id: string
  name: string
  sku: string
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
  quantity: ["exact quantity found", "quantity", "qty", "quantity seen"],
  city_state: ["store (city, state)", "store", "location"],
  date_found: ["purchase date", "date found", "found date", "date"],
  photo: [
    "upload photo(s) of item / shelf tag / receipt",
    "photo proof",
    "photo",
    "image",
    "upload",
  ],
  notes: ["notes (optional)", "notes", "note", "comments", "comment"],
  approved: ["approved", "is approved"],
  status: ["status", "scope"],
  date_approved: ["date approved", "approved date"],
}

function pickField(row: Record<string, string>, key: string): string {
  const aliases = FIELD_ALIASES[key] || []
  for (const alias of aliases) {
    // Check exact match or trimmed match
    if (row[alias]) return row[alias]
    // Check keys in row for case-insensitive match
    const foundKey = Object.keys(row).find(
      (k) => k.toLowerCase().trim() === alias.toLowerCase().trim()
    )
    if (foundKey && row[foundKey]) return row[foundKey]
  }
  return ""
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

async function fetchPennyListRaw(): Promise<PennyItem[]> {
  const sheetUrl = process.env.GOOGLE_SHEET_URL
  if (!sheetUrl) {
    console.warn("GOOGLE_SHEET_URL is not set. Returning empty list.")
    return []
  }

  try {
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
      const quantity = pickField(row, "quantity").trim()
      const cityState = pickField(row, "city_state").trim()
      const dateFound = pickField(row, "date_found").trim()
      const photo = pickField(row, "photo").trim()
      const notes = pickField(row, "notes").trim()
      const status = pickField(row, "status").trim()

      // 2. Parse Date
      let dateAdded = new Date().toISOString().split("T")[0]
      if (dateFound) {
        const d = new Date(dateFound)
        if (!isNaN(d.getTime())) {
          dateAdded = d.toISOString().split("T")[0]
        }
      }

      // 3. Parse Location
      let state = ""
      if (cityState.includes(",")) {
        const parts = cityState.split(",")
        state = parts[1].trim().toUpperCase()
      }

      // 4. Aggregate by SKU
      if (!grouped[sku]) {
        grouped[sku] = {
          id: sku,
          name,
          sku,
          price: 0.01,
          dateAdded,
          status,
          quantityFound: quantity,
          imageUrl: photo,
          notes,
          locations: {},
        }
      }

      // Update latest date
      if (dateAdded > grouped[sku].dateAdded) {
        grouped[sku].dateAdded = dateAdded
      }

      // Add location count
      if (state) {
        grouped[sku].locations[state] = (grouped[sku].locations[state] || 0) + 1
      }
    })

    // 5. Calculate tier for each item based on aggregated data
    const items: PennyItem[] = Object.values(grouped).map((item) => ({
      ...item,
      tier: calculateTier(item.locations),
    }))

    return items
  } catch (error) {
    console.error("Error fetching penny list:", error)
    return []
  }
}

export async function getPennyList(): Promise<PennyItem[]> {
  return fetchPennyListRaw()
}
