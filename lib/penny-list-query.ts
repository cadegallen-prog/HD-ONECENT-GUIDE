import type { PennyItem } from "./fetch-penny-data"

export type TierFilter = "Very Common" | "Common" | "Rare" | "all"
export type SortOption = "newest" | "oldest" | "most-reports" | "alphabetical"
export type DateRange = "1m" | "3m" | "6m" | "12m" | "18m" | "24m" | "all"

export type QueryParams = {
  state?: string
  tier?: TierFilter
  photo?: boolean
  q?: string
  sort?: SortOption
  days?: DateRange
}

export type QueryResult = {
  items: PennyItem[]
  total: number
}

type ItemWithMeta = PennyItem & {
  parsedDate: Date | null
}

function getTotalReports(locations: Record<string, number>): number {
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
}

function normalizeDate(value: string): Date | null {
  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime())) return direct
  const fallback = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

function getWindowMonths(dateRange: DateRange): number | null {
  switch (dateRange) {
    case "1m":
      return 1
    case "3m":
      return 3
    case "6m":
      return 6
    case "12m":
      return 12
    case "18m":
      return 18
    case "24m":
      return 24
    case "all":
      return null
  }
}

function isWithinWindow(date: Date, windowStart: Date | null, today: Date): boolean {
  const time = date.getTime()
  if (Number.isNaN(time)) return false
  if (windowStart === null) return true
  return time >= windowStart.getTime() && time <= today.getTime()
}

/**
 * Filters and sorts penny items based on query parameters.
 * This is the shared logic used by both the API endpoint and for computing initial results.
 *
 * @param items - Valid penny items (already filtered by filterValidPennyItems)
 * @param params - Query parameters for filtering/sorting
 * @param nowMs - Current timestamp in milliseconds (for date calculations, defaults to Date.now())
 * @returns Filtered and sorted items with total count
 */
export function queryPennyItems(
  items: PennyItem[],
  params: QueryParams,
  nowMs: number = Date.now()
): QueryResult {
  const today = new Date(nowMs)
  const dateRange = params.days ?? "1m"
  const windowMonths = getWindowMonths(dateRange)

  const windowStart = (() => {
    if (windowMonths === null) return null
    const start = new Date(today)
    start.setMonth(start.getMonth() - windowMonths)
    return start
  })()

  // Add parsed dates and filter to window
  const withMeta: ItemWithMeta[] = items
    .map((item) => ({
      ...item,
      parsedDate: normalizeDate(item.lastSeenAt ?? item.dateAdded),
      tier: item.tier ?? "Rare",
    }))
    .filter((item) => item.parsedDate !== null)

  // Filter to date window
  let filtered = withMeta.filter(
    (item) => item.parsedDate && isWithinWindow(item.parsedDate, windowStart, today)
  )

  // State filter
  if (params.state) {
    filtered = filtered.filter(
      (item) => item.locations && item.locations[params.state!] !== undefined
    )
  }

  // Tier filter
  if (params.tier && params.tier !== "all") {
    filtered = filtered.filter((item) => item.tier === params.tier)
  }

  // Photo filter
  if (params.photo) {
    filtered = filtered.filter((item) => Boolean(item.imageUrl?.trim()))
  }

  // Search filter
  if (params.q) {
    const query = params.q.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))
    )
  }

  // Sort
  const sortOption = params.sort ?? "newest"
  switch (sortOption) {
    case "newest":
      filtered.sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime())
      break
    case "oldest":
      filtered.sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime())
      break
    case "most-reports":
      filtered.sort((a, b) => {
        const aReports = a.locations ? getTotalReports(a.locations) : 0
        const bReports = b.locations ? getTotalReports(b.locations) : 0
        return bReports - aReports
      })
      break
    case "alphabetical":
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  // Strip parsedDate from results (it's internal metadata)
  const results: PennyItem[] = filtered.map(({ parsedDate, ...item }) => {
    void parsedDate
    return item
  })

  return {
    items: results,
    total: results.length,
  }
}

/**
 * Computes "hot" items - Very Common tier items from the last N days.
 * Used for the "Hot Right Now" section.
 */
export function getHotItems(
  items: PennyItem[],
  windowDays: number = 14,
  limit: number = 6,
  nowMs: number = Date.now()
): PennyItem[] {
  const today = new Date(nowMs)

  const isWithinDays = (date: Date, window: number) => {
    const diffMs = today.getTime() - date.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    return days >= 0 && days <= window
  }

  return items
    .map((item) => ({
      ...item,
      parsedDate: normalizeDate(item.lastSeenAt ?? item.dateAdded),
    }))
    .filter(
      (item) =>
        item.tier === "Very Common" && item.parsedDate && isWithinDays(item.parsedDate, windowDays)
    )
    .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime())
    .slice(0, limit)
    .map(({ parsedDate, ...item }) => {
      void parsedDate
      return item
    })
}
