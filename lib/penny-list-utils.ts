import { US_STATES } from "./us-states"
import type { PennyItem } from "./fetch-penny-data"
import { validateSku } from "./sku"

const DAY_MS = 24 * 60 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000

/**
 * Normalizes a product name for consistent display.
 * - Converts to Title Case
 * - Trims excessive whitespace
 * - Truncates for mobile display (with ellipsis)
 * - Separates brand from item name if provided together
 */
export function normalizeProductName(
  name: string,
  options: { maxLength?: number; brand?: string } = {}
): string {
  const { maxLength = 80, brand } = options

  if (!name) return ""

  // Trim and collapse multiple whitespace
  let normalized = name.replace(/\s+/g, " ").trim()

  // Remove brand from beginning if it's duplicated
  if (brand) {
    const brandLower = brand.toLowerCase()
    const nameLower = normalized.toLowerCase()
    if (nameLower.startsWith(brandLower)) {
      normalized = normalized
        .slice(brand.length)
        .replace(/^[\s\-–—:]+/, "")
        .trim()
    }
  }

  // Convert to Title Case (lowercase everything, then capitalize first letter of each word)
  normalized = normalized.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  // Handle common abbreviations that should stay uppercase
  const uppercaseWords = [
    "HD",
    "LED",
    "USB",
    "AC",
    "DC",
    "UV",
    "PVC",
    "ABS",
    "HVAC",
    "CFM",
    "PSI",
    "RPM",
    "GPM",
    "BTU",
  ]
  for (const word of uppercaseWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    normalized = normalized.replace(regex, word)
  }

  // Handle common units that should stay lowercase
  const lowercaseUnits = ["in", "ft", "mm", "cm", "oz", "lb", "gal", "qt", "pk", "ct", "sq"]
  for (const unit of lowercaseUnits) {
    // Match unit preceded by number and followed by word boundary or period
    const regex = new RegExp(`(\\d)\\s*${unit}\\.?\\b`, "gi")
    normalized = normalized.replace(regex, `$1 ${unit}.`)
  }

  // Truncate if needed
  if (normalized.length > maxLength) {
    normalized = normalized.slice(0, maxLength - 3).trim() + "..."
  }

  return normalized
}

/**
 * Formats a brand name consistently.
 */
export function normalizeBrand(brand: string | undefined): string {
  if (!brand) return ""

  // Trim and collapse whitespace
  let normalized = brand.replace(/\s+/g, " ").trim()

  // Title case
  normalized = normalized.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())

  return normalized
}

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return USD_FORMATTER.format(0)
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return USD_FORMATTER.format(0)
  return USD_FORMATTER.format(numeric)
}
const THIRTY_DAYS_MS = 30 * DAY_MS
const STATE_CODES = new Set(US_STATES.map((state) => state.code.toUpperCase()))
const STATE_NAME_TO_CODE = new Map(US_STATES.map((state) => [state.name.toUpperCase(), state.code]))
const WINDOW_LABELS: Record<string, string> = {
  "1m": "30d",
  "3m": "90d",
  "6m": "6m",
  "12m": "12m",
  "18m": "18m",
  "24m": "24m",
  all: "All time",
  "7": "7d",
  "14": "14d",
  "30": "30d",
}

const WINDOW_DESCRIPTIONS: Record<string, string> = {
  "30d": "last 30 days",
  "90d": "last 90 days",
  "6m": "last 6 months",
  "12m": "last 12 months",
  "18m": "last 18 months",
  "24m": "last 24 months",
  "7d": "last 7 days",
  "14d": "last 14 days",
  all: "all time",
}

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
      const skuRaw = normalizeString(item.sku)
      const skuCheck = validateSku(skuRaw)
      const dateAdded = normalizeString(item.dateAdded)

      return {
        item: {
          ...item,
          name,
          sku: skuCheck.normalized || skuRaw,
          dateAdded,
        },
        skuError: skuCheck.error,
      }
    })
    .filter(
      ({ item, skuError }) =>
        item.name !== "" && item.sku !== "" && !skuError && isValidDate(item.dateAdded)
    )
    .map(({ item }) => item)
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/New_York",
    })
  }

  const diffDays = Math.floor(diffMs / DAY_MS)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays <= 14) return `${diffDays} days ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  })
}

function getTotalReports(locations: Record<string, number> | undefined): number {
  if (!locations) return 0
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
}

export function formatReportCount(count: number): string {
  if (count >= 1_000_000) {
    const value = count / 1_000_000
    const decimals = value >= 10 ? 0 : 1
    return `${value.toFixed(decimals).replace(/\.0$/, "")}m`
  }
  if (count >= 1_000) {
    const value = count / 1_000
    const decimals = value >= 10 ? 0 : 1
    return `${value.toFixed(decimals).replace(/\.0$/, "")}k`
  }
  return String(count)
}

export function formatLastSeen(
  dateValue: string | null | undefined,
  nowMs: number = Date.now()
): string {
  if (!dateValue) return "Last seen: Recently"
  const parsed = new Date(dateValue)
  const timestamp = parsed.getTime()
  if (Number.isNaN(timestamp)) return "Last seen: Recently"
  const diffMs = nowMs - timestamp
  if (diffMs <= 0) return "Last seen: Recently"

  const diffHours = Math.floor(diffMs / HOUR_MS)
  if (diffHours < 1) return "Last seen: Recently"
  if (diffHours < 24) return `Last seen: ${diffHours}h ago`

  const diffDays = Math.floor(diffMs / DAY_MS)
  if (diffDays === 1) return "Last seen: 1 day ago"
  if (diffDays < 30) return `Last seen: ${diffDays} days ago`

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths === 1) return "Last seen: 1 month ago"
  if (diffMonths < 12) return `Last seen: ${diffMonths} months ago`

  const diffYears = Math.floor(diffDays / 365)
  if (diffYears === 1) return "Last seen: 1 year ago"
  return `Last seen: ${diffYears} years ago`
}

export function formatWindowLabel(value: string | null | undefined): string {
  const trimmed = value?.trim()
  if (!trimmed) return "30d"
  return WINDOW_LABELS[trimmed] ?? trimmed
}

function formatWindowDescription(windowLabel: string): string {
  const lowered = windowLabel.toLowerCase()
  const normalized = lowered.replace(/\s+/g, "")
  if (WINDOW_DESCRIPTIONS[lowered]) return WINDOW_DESCRIPTIONS[lowered]
  if (WINDOW_DESCRIPTIONS[normalized]) return WINDOW_DESCRIPTIONS[normalized]
  const canonical = formatWindowLabel(windowLabel).toLowerCase()
  return WINDOW_DESCRIPTIONS[canonical] ?? windowLabel
}

export function formatLineB({
  locations,
  stateFilter,
  windowLabel,
}: {
  locations?: Record<string, number>
  stateFilter?: string
  windowLabel: string
}): string {
  const totalReports = getTotalReports(locations)
  const reportLabel = `${formatReportCount(totalReports)} ${
    totalReports === 1 ? "report" : "reports"
  }`
  const resolvedWindow = formatWindowLabel(windowLabel)
  const windowPhrase = formatWindowDescription(resolvedWindow)

  if (!locations || Object.keys(locations).length === 0) {
    return `State data unavailable · ${reportLabel} (${windowPhrase})`
  }

  const stateCount = Object.keys(locations).length
  const normalizedState = stateFilter?.trim().toUpperCase()
  const reportsInState = normalizedState ? (locations[normalizedState] ?? 0) : 0

  if (normalizedState && reportsInState > 0) {
    const remainingStates = Math.max(0, stateCount - 1)
    const remainingLabel = remainingStates === 1 ? "state" : "states"
    return `${normalizedState} + ${remainingStates} ${remainingLabel} · ${reportLabel} (${windowPhrase})`
  }

  const stateLabel = stateCount === 1 ? "state" : "states"
  return `Seen in ${stateCount} ${stateLabel} · ${reportLabel} (${windowPhrase})`
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
