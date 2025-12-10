import { US_STATES } from "./us-states"
import type { PennyItem } from "./fetch-penny-data"

const DAY_MS = 24 * 60 * 60 * 1000
const THIRTY_DAYS_MS = 30 * DAY_MS
const STATE_CODES = new Set(US_STATES.map((state) => state.code.toUpperCase()))
const STATE_NAME_TO_CODE = new Map(US_STATES.map((state) => [state.name.toUpperCase(), state.code]))

function isValidDate(value: string): boolean {
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

function normalizeString(value: string | undefined): string {
  return value ? value.trim() : ""
}

/**
 * Phase 1a validation: Filters out invalid penny items.
 * Requirements: non-empty SKU, non-empty name, valid date.
 * Used by penny-list page to gate rendering - if no valid rows, show feed-unavailable banner.
 */
export function filterValidPennyItems(items: PennyItem[]): PennyItem[] {
  return items
    .map((item) => {
      const name = normalizeString(item.name)
      const sku = normalizeString(item.sku)
      const dateAdded = normalizeString(item.dateAdded)

      return {
        ...item,
        name,
        sku,
        dateAdded,
      }
    })
    .filter((item) => item.name !== "" && item.sku !== "" && isValidDate(item.dateAdded))
}

/**
 * Phase 1c: Convert dates to human-friendly relative format.
 * Rules: "Today", "Yesterday", "X days ago" (up to 14), then "MMM d" format.
 * Keeps semantic <time datetime> for SEO while showing friendly label.
 */
export function formatRelativeDate(dateStr: string, now: Date = new Date()): string {
  const date = new Date(dateStr)
  const timestamp = date.getTime()

  if (Number.isNaN(timestamp)) return dateStr

  const diffMs = now.getTime() - timestamp
  if (diffMs < 0) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const diffDays = Math.floor(diffMs / DAY_MS)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays <= 14) return `${diffDays} days ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function extractStateFromLocation(value: string): string {
  if (!value) return ""

  const trimmed = value.trim()
  if (!trimmed) return ""

  // Quick exact code match (e.g., "TX")
  const upper = trimmed.toUpperCase()
  if (STATE_CODES.has(upper)) return upper

  // Try comma-separated values (take the last segment)
  const parts = trimmed.split(",")
  const candidates = parts.length > 1 ? [parts[parts.length - 1], trimmed] : [trimmed]

  for (const candidate of candidates) {
    const candidateUpper = candidate.toUpperCase()

    // Look for a 2-letter state code anywhere in the string
    const codeMatch = candidateUpper.match(/\b([A-Z]{2})\b/)
    if (codeMatch && STATE_CODES.has(codeMatch[1])) {
      return codeMatch[1]
    }

    // Look for full state names
    for (const [nameUpper, code] of STATE_NAME_TO_CODE.entries()) {
      const nameRegex = new RegExp(`\\b${nameUpper}\\b`, "i")
      if (nameRegex.test(candidateUpper)) {
        return code
      }
    }
  }

  return ""
}

/**
 * Phase 1b: Calculate freshness metrics for the summary block.
 * Returns counts for: new items in last 24h, total items in last 30 days.
 * Uses ROLLING windows (not calendar days) - 24h = 86400000ms, 30d = 2592000000ms.
 * Only counts items with valid dates (invalid dates are skipped).
 */
export function computeFreshnessMetrics(
  items: PennyItem[],
  nowMs: number = Date.now()
): { newLast24h: number; totalLast30d: number } {
  return items.reduce(
    (acc, item) => {
      const timestamp = new Date(item.dateAdded).getTime()
      if (Number.isNaN(timestamp)) return acc

      const diff = nowMs - timestamp
      if (diff >= 0 && diff <= DAY_MS) {
        acc.newLast24h += 1
      }
      if (diff >= 0 && diff <= THIRTY_DAYS_MS) {
        acc.totalLast30d += 1
      }
      return acc
    },
    { newLast24h: 0, totalLast30d: 0 }
  )
}
