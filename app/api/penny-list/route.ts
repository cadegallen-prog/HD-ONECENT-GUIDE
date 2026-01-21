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
const CACHE_SECONDS = 300 // 5 minutes (public freshness target)
const STALE_SECONDS = 60 // allow short stale while CDN revalidates

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
  const fresh = url.searchParams.get("fresh") === "1"
  // Phase 3: SKU filtering for list enrichment
  const skusParam = url.searchParams.get("skus")
  const skuList = skusParam
    ? skusParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined

  try {
    const nowMs =
      process.env.PLAYWRIGHT === "1" ? new Date("2025-12-10T12:00:00Z").getTime() : Date.now()

    // Fetch items with date window filtering at the database level for performance
    // This reduces data transfer by only fetching rows within the selected time range
    // Phase 3: Also supports SKU filtering for efficient list enrichment
    const pennyItems = await getPennyListFiltered(days, nowMs, {
      includeNotes: false,
      bypassCache: fresh,
      skuList,
    })
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

    // Default: cache at CDN for 5 minutes, but prevent browser caching.
    // Submitter "fresh=1" bypass: no-store (force true fresh read for that one user flow).
    const cacheControl = fresh
      ? "no-store"
      : `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": cacheControl,
      },
    })
  } catch (error) {
    console.error("Failed to fetch penny list", error)
    return NextResponse.json(
      { error: "Failed to fetch penny list" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=30",
        },
      }
    )
  }
}
