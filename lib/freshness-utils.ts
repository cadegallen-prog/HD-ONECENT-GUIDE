/**
 * Client-safe freshness calculation utilities
 * No server-only dependencies
 */

export type FreshnessCategory = "fresh" | "moderate" | "old"

/**
 * Get the most recent purchase date from a dates array
 */
export function getLatestDateFromArray(dates?: string[]): string | null {
  if (!dates || dates.length === 0) {
    return null
  }
  return dates[0] // Already sorted newest first
}

/**
 * Get the count of purchase dates
 */
export function getDateCount(dates?: string[]): number {
  return dates?.length ?? 0
}

/**
 * Determine freshness category based on a date string
 * fresh: < 30 days, moderate: 30-90 days, old: 90+ days
 */
export function getFreshness(
  dateStr: string | null,
  nowMs: number = Date.now()
): FreshnessCategory {
  if (!dateStr) {
    return "old"
  }

  try {
    const itemDateMs = new Date(dateStr).getTime()
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
  } catch {
    return "old"
  }
}
