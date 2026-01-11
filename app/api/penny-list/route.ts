import { NextResponse } from "next/server"
import { getPennyListFiltered } from "@/lib/fetch-penny-data"
import { filterValidPennyItems } from "@/lib/penny-list-utils"
import {
  queryPennyItems,
  getHotItems,
  type SortOption,
  type DateRange,
} from "@/lib/penny-list-query"

const VALID_PER_PAGE = [25, 50, 100]
const DEFAULT_PER_PAGE = 50
const CACHE_SECONDS = 1800 // 30 minutes - aligned with SerpAPI enrichment schedule
const STALE_SECONDS = 1800

function parsePerPage(value: string | null): number {
  if (!value) return DEFAULT_PER_PAGE
  const parsed = Number(value)
  if (VALID_PER_PAGE.includes(parsed)) return parsed
  return DEFAULT_PER_PAGE
}

function parsePage(value: string | null): number {
  if (!value) return 1
  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed >= 1) return parsed
  return 1
}

function parseSort(value: string | null): SortOption {
  if (
    value === "newest" ||
    value === "oldest" ||
    value === "most-reports" ||
    value === "alphabetical"
  ) {
    return value
  }
  return "newest"
}

function parseDays(value: string | null): DateRange {
  // Backward compatibility for old day-based links
  if (value === "7" || value === "14" || value === "30") return "1m"

  if (
    value === "1m" ||
    value === "3m" ||
    value === "6m" ||
    value === "12m" ||
    value === "18m" ||
    value === "24m" ||
    value === "all"
  ) {
    return value
  }
  return "1m"
}

export async function GET(request: Request) {
  const url = new URL(request.url)

  // Parse query parameters
  const state = url.searchParams.get("state") || undefined
  const photo = url.searchParams.get("photo") === "1"
  const q = url.searchParams.get("q") || undefined
  const sort = parseSort(url.searchParams.get("sort"))
  const days = parseDays(url.searchParams.get("days"))
  const perPage = parsePerPage(url.searchParams.get("perPage"))
  const page = parsePage(url.searchParams.get("page"))
  const includeHot = url.searchParams.get("includeHot") === "1"

  try {
    const nowMs =
      process.env.PLAYWRIGHT === "1" ? new Date("2025-12-10T12:00:00Z").getTime() : Date.now()

    // Fetch items with date window filtering at the database level for performance
    // This reduces data transfer by only fetching rows within the selected time range
    const pennyItems = await getPennyListFiltered(days, nowMs, { includeNotes: false })
    const validItems = filterValidPennyItems(pennyItems)

    // Apply additional filters and sorting
    // Note: date filtering is already done at DB level, so we pass days: "all" to skip redundant filtering
    const { items: filteredItems, total } = queryPennyItems(
      validItems,
      { state, photo, q, sort, days: "all" },
      nowMs
    )

    // Calculate pagination
    const pageCount = Math.max(1, Math.ceil(total / perPage))
    const clampedPage = Math.min(Math.max(page, 1), pageCount)
    const startIndex = (clampedPage - 1) * perPage
    const endIndex = Math.min(startIndex + perPage, total)
    const pageItems = filteredItems.slice(startIndex, endIndex)

    // Optionally include hot items (for initial load)
    const hotItems = includeHot ? getHotItems(validItems, 14, 6, nowMs) : undefined

    const response = {
      items: pageItems,
      total,
      pageCount,
      page: clampedPage,
      perPage,
      ...(hotItems !== undefined && { hotItems }),
    }

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    })
  } catch (error) {
    console.error("Failed to fetch penny list", error)
    return NextResponse.json(
      { error: "Failed to fetch penny list" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=30",
        },
      }
    )
  }
}
