/**
 * Verified Pennies Data Access
 *
 * Provides access to the admin-verified list of penny items
 * with product images from Home Depot.
 */

import { readFileSync } from "node:fs"
import path from "node:path"

export interface VerifiedPenny {
  sku: string
  internetNumber: string
  name: string
  brand: string
  model: string
  imageUrl: string
  purchaseDates?: string[] // Optional: ISO 8601 dates (sorted newest first)
}

// Cache the data after first load
let cachedData: Record<string, VerifiedPenny> | null = null

/**
 * Load verified pennies data from JSON file
 */
function loadVerifiedPennies(): Record<string, VerifiedPenny> {
  if (cachedData) {
    return cachedData
  }

  try {
    const filePath = path.join(process.cwd(), "data", "verified-pennies.json")
    const rawData = readFileSync(filePath, "utf8")
    cachedData = JSON.parse(rawData) as Record<string, VerifiedPenny>
    return cachedData
  } catch (error) {
    console.error("Error loading verified pennies:", error)
    return {}
  }
}

/**
 * Get all verified penny items
 */
export function getVerifiedPennies(): VerifiedPenny[] {
  const data = loadVerifiedPennies()
  return Object.values(data)
}

/**
 * Get a verified penny by SKU
 */
export function getVerifiedPennyBySku(sku: string): VerifiedPenny | null {
  const data = loadVerifiedPennies()
  return data[sku] || null
}

/**
 * Check if a SKU is a verified penny
 */
export function isVerifiedPenny(sku: string): boolean {
  const data = loadVerifiedPennies()
  return sku in data
}

/**
 * Get the image URL for a SKU if it's a verified penny
 * Returns null if not found
 */
export function getVerifiedImageUrl(sku: string): string | null {
  const penny = getVerifiedPennyBySku(sku)
  return penny?.imageUrl || null
}

/**
 * Get total count of verified pennies
 */
export function getVerifiedPennyCount(): number {
  const data = loadVerifiedPennies()
  return Object.keys(data).length
}

/**
 * Search verified pennies by name or SKU
 */
export function searchVerifiedPennies(query: string): VerifiedPenny[] {
  const data = loadVerifiedPennies()
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return Object.values(data)
  }

  return Object.values(data).filter((penny) => {
    return (
      penny.name.toLowerCase().includes(lowerQuery) ||
      penny.sku.includes(lowerQuery) ||
      penny.brand.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Get verified pennies grouped by brand
 */
export function getVerifiedPenniesByBrand(): Record<string, VerifiedPenny[]> {
  const data = loadVerifiedPennies()
  const grouped: Record<string, VerifiedPenny[]> = {}

  for (const penny of Object.values(data)) {
    const brand = penny.brand || "Unknown"
    if (!grouped[brand]) {
      grouped[brand] = []
    }
    grouped[brand].push(penny)
  }

  return grouped
}

/**
 * Get list of all brands with verified pennies
 */
export function getVerifiedBrands(): string[] {
  const byBrand = getVerifiedPenniesByBrand()
  return Object.keys(byBrand).sort()
}

/**
 * Get the most recent purchase date for a verified penny
 */
export function getLatestPurchaseDate(item: VerifiedPenny): string | null {
  if (!item.purchaseDates || item.purchaseDates.length === 0) {
    return null
  }
  return item.purchaseDates[0] // Already sorted newest first
}

/**
 * Get the count of times a penny has been purchased
 */
export function getPurchaseCount(item: VerifiedPenny): number {
  return item.purchaseDates?.length ?? 0
}

/**
 * Determine freshness category based on most recent purchase date
 * fresh: < 30 days, moderate: 30-90 days, old: 90+ days
 */
export function getFreshnessCategory(
  item: VerifiedPenny,
  nowMs: number = Date.now()
): "fresh" | "moderate" | "old" {
  const latestDate = getLatestPurchaseDate(item)
  if (!latestDate) {
    return "old"
  }

  const itemDateMs = new Date(latestDate).getTime()
  const ageMs = nowMs - itemDateMs

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

  if (ageMs < THIRTY_DAYS_MS) {
    return "fresh"
  }
  if (ageMs < NINETY_DAYS_MS) {
    return "moderate"
  }
  return "old"
}
