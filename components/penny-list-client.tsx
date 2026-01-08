"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  AlertTriangle,
  Bookmark,
  Package,
  Clock,
  CheckCircle2,
  Info,
  ChevronDown,
  Search,
  X,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  FilePlus,
} from "lucide-react"
import { TrackableLink } from "@/components/trackable-link"
import { trackEvent } from "@/lib/analytics"
import { FeedbackWidget } from "@/components/feedback-widget"
import {
  PennyListFilters,
  type SortOption,
  type ViewMode,
  type DateRange,
} from "./penny-list-filters"
import { PennyListCard, PennyListCardCompact } from "./penny-list-card"
import { PennyListTable } from "./penny-list-table"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { US_STATES } from "@/lib/us-states"
import { formatWindowLabel } from "@/lib/penny-list-utils"

interface PennyListClientProps {
  initialItems: PennyItem[]
  initialTotal: number
  hotItems?: PennyItem[]
  initialSearchParams?: Record<string, string | string[] | undefined>
}

function toURLSearchParams(
  params?: Record<string, string | string[] | undefined>
): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (!params) return searchParams

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((v) => searchParams.append(key, v))
    } else if (typeof value === "string") {
      searchParams.set(key, value)
    }
  })

  return searchParams
}

// Storage key for user's preferred state
const USER_STATE_KEY = "pennycentral_user_state"

const ITEMS_PER_PAGE_OPTIONS = [25, 50, 100]
const DEFAULT_ITEMS_PER_PAGE = 50
const DEFAULT_DATE_RANGE: DateRange = "1m"

const DATE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "1m", label: "1 mo" },
  { value: "3m", label: "3 mo" },
  { value: "6m", label: "6 mo" },
  { value: "12m", label: "12 mo" },
  { value: "18m", label: "18 mo" },
  { value: "24m", label: "24 mo" },
  { value: "all", label: "All" },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-reports", label: "Most Reports" },
  { value: "alphabetical", label: "A-Z" },
]

function getStateName(code: string): string {
  const state = US_STATES.find((item) => item.code === code)
  return state?.name || code
}

export function PennyListClient({
  initialItems,
  initialTotal,
  hotItems: serverHotItems = [],
  initialSearchParams,
}: PennyListClientProps) {
  const router = useRouter()
  const pathname = usePathname()

  const HOT_WINDOW_DAYS = 14

  const { initialParams, initialParamsString, hadTierParam } = useMemo(() => {
    const params = toURLSearchParams(initialSearchParams)
    const hadTierParam = params.has("tier")
    if (hadTierParam) params.delete("tier")
    return { initialParams: params, initialParamsString: params.toString(), hadTierParam }
  }, [initialSearchParams])
  const paramsRef = useRef<URLSearchParams>(initialParams)
  const hasMountedRef = useRef(false)
  const hasTrackedViewRef = useRef(false)
  const isInitialRenderRef = useRef(true)

  const getInitialParam = (key: string) => initialParams.get(key) || ""

  // Initialize state from URL params
  const [stateFilter, setStateFilter] = useState(() => getInitialParam("state"))
  const [searchQuery, setSearchQuery] = useState(() => getInitialParam("q"))
  const [mobileSearch, setMobileSearch] = useState(() => getInitialParam("q"))
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const value = getInitialParam("sort") as SortOption
    return value === "oldest" || value === "most-reports" || value === "alphabetical"
      ? value
      : "newest"
  })
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const value = getInitialParam("view") as ViewMode
    return value === "table" ? value : "cards"
  })
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const value = getInitialParam("days")

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

    return DEFAULT_DATE_RANGE // Default to 30 days per spec (PENNY-LIST-REDESIGN.md)
  })

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const param = getInitialParam("perPage")
    if (param) {
      const parsed = Number(param)
      if (ITEMS_PER_PAGE_OPTIONS.includes(parsed)) {
        return parsed
      }
    }
    return DEFAULT_ITEMS_PER_PAGE
  })

  const [currentPage, setCurrentPage] = useState(() => {
    const param = getInitialParam("page")
    if (param) {
      const parsed = Number(param)
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed
      }
    }
    return 1
  })

  // Items state - uses initial data from server, then fetches from API
  const [items, setItems] = useState<PennyItem[]>(initialItems)
  const [total, setTotal] = useState(initialTotal)
  const [isLoading, setIsLoading] = useState(false)
  const [hotItems, setHotItems] = useState<PennyItem[]>(serverHotItems)

  // User's saved state for "My State" button
  const [userState, setUserState] = useState<string | undefined>(undefined)

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false)

  useEffect(() => {
    hasMountedRef.current = true
  }, [])

  useEffect(() => {
    if (!hadTierParam) return
    const newURL = initialParamsString ? `${pathname}?${initialParamsString}` : pathname
    router.replace(newURL, { scroll: false })
  }, [hadTierParam, initialParamsString, pathname, router])

  // Compute freshness from current items (for analytics)
  const freshnessHours = useMemo(() => {
    const timestamps = items
      .map((item) => new Date(item.dateAdded).getTime())
      .filter((time) => !Number.isNaN(time))
    if (timestamps.length === 0) return null
    const latestTimestamp = Math.max(...timestamps)
    const diffMs = Date.now() - latestTimestamp
    return Math.max(0, Math.round(diffMs / (1000 * 60 * 60)))
  }, [items])

  // Load user's state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(USER_STATE_KEY)
    if (saved) {
      setUserState(saved)
    }
  }, [])

  // Save state filter to localStorage when user selects a state
  useEffect(() => {
    if (stateFilter && stateFilter !== userState) {
      localStorage.setItem(USER_STATE_KEY, stateFilter)
      setUserState(stateFilter)
    }
  }, [stateFilter, userState])

  // Sync filters to URL params
  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(paramsRef.current)

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          value === "newest" ||
          value === "cards" ||
          value === DEFAULT_DATE_RANGE
        ) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      paramsRef.current = params
      const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newURL, { scroll: false })
    },
    [pathname, router]
  )

  const trackFilterChange = useCallback(
    (filter: string, value: string, action: "apply" | "clear") => {
      if (!hasMountedRef.current) return
      trackEvent("penny_list_filter", { filter, value, action })
    },
    []
  )

  // Wrapper setters that also update URL
  const setStateFilterWithURL = useCallback(
    (value: string) => {
      setStateFilter(value)
      updateURL({ state: value })
      trackFilterChange("state", value || "all", value ? "apply" : "clear")
    },
    [trackFilterChange, updateURL]
  )

  const setSearchQueryWithURL = useCallback(
    (value: string) => {
      setSearchQuery(value)
      updateURL({ q: value })
    },
    [updateURL]
  )

  const setSortOptionWithURL = useCallback(
    (value: SortOption) => {
      setSortOption(value)
      updateURL({ sort: value === "newest" ? null : value })
      trackFilterChange("sort", value, value === "newest" ? "clear" : "apply")
    },
    [trackFilterChange, updateURL]
  )

  const setViewModeWithURL = useCallback(
    (value: ViewMode) => {
      setViewMode(value)
      updateURL({ view: value === "cards" ? null : value })
    },
    [updateURL]
  )

  const setDateRangeWithURL = useCallback(
    (value: DateRange) => {
      setDateRange(value)
      updateURL({ days: value === DEFAULT_DATE_RANGE ? null : value })
      trackFilterChange("date_range", value, value === DEFAULT_DATE_RANGE ? "clear" : "apply")
    },
    [trackFilterChange, updateURL]
  )

  const closeSheets = useCallback(() => {
    setIsFilterSheetOpen(false)
    setIsSortSheetOpen(false)
  }, [])

  const openFilterSheet = useCallback(() => {
    setIsFilterSheetOpen(true)
    setIsSortSheetOpen(false)
  }, [])

  const openSortSheet = useCallback(() => {
    setIsSortSheetOpen(true)
    setIsFilterSheetOpen(false)
  }, [])

  const clearAllFilters = useCallback(() => {
    setStateFilterWithURL("")
    setSearchQueryWithURL("")
    setMobileSearch("")
    setSortOptionWithURL("newest")
    setDateRangeWithURL(DEFAULT_DATE_RANGE)
  }, [setDateRangeWithURL, setSearchQueryWithURL, setSortOptionWithURL, setStateFilterWithURL])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mobileSearch !== searchQuery) {
        setSearchQueryWithURL(mobileSearch)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [mobileSearch, searchQuery, setSearchQueryWithURL])

  useEffect(() => {
    setMobileSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (!isFilterSheetOpen && !isSortSheetOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSheets()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeSheets, isFilterSheetOpen, isSortSheetOpen])

  // Fetch items from API when filters change
  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (stateFilter) params.set("state", stateFilter)
      if (searchQuery) params.set("q", searchQuery)
      if (sortOption !== "newest") params.set("sort", sortOption)
      if (dateRange !== DEFAULT_DATE_RANGE) params.set("days", dateRange)
      params.set("page", String(currentPage))
      params.set("perPage", String(itemsPerPage))
      // Include hot items only when no filters are active (for initial-like requests)
      const noFiltersActive = !stateFilter && !searchQuery && dateRange === DEFAULT_DATE_RANGE
      if (noFiltersActive) params.set("includeHot", "1")

      const response = await fetch(`/api/penny-list?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      setItems(data.items)
      setTotal(data.total)
      if (data.hotItems) {
        setHotItems(data.hotItems)
      }
    } catch (error) {
      console.error("Error fetching penny list:", error)
    } finally {
      setIsLoading(false)
    }
  }, [stateFilter, searchQuery, sortOption, dateRange, currentPage, itemsPerPage])

  // Fetch when params change (but not on initial render - we have server data)
  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false
      return
    }
    fetchItems()
  }, [fetchItems])

  const previousSearchRef = useRef(searchQuery)

  useEffect(() => {
    if (!hasMountedRef.current) return
    if (searchQuery === previousSearchRef.current) return
    previousSearchRef.current = searchQuery
    trackEvent("penny_list_search", {
      termLength: searchQuery.trim().length,
      hasResults: items.length > 0,
    })
  }, [items.length, searchQuery])

  const hasActiveFilters =
    stateFilter !== "" || searchQuery !== "" || dateRange !== DEFAULT_DATE_RANGE

  useEffect(() => {
    if (!hasMountedRef.current || hasTrackedViewRef.current) return
    hasTrackedViewRef.current = true
    trackEvent("penny_list_view", {
      page: "/penny-list",
      itemsVisible: total,
      hasFilter: hasActiveFilters,
      hasSearch: searchQuery.trim().length > 0,
      freshnessHours: freshnessHours ?? undefined,
      hotItemsCount: hotItems.length,
    })
  }, [total, freshnessHours, hasActiveFilters, searchQuery, hotItems.length])

  useEffect(() => {
    if (currentPage === 1) return
    setCurrentPage(1)
    updateURL({ page: null })
  }, [currentPage, dateRange, searchQuery, sortOption, stateFilter, updateURL])

  // Pagination - API returns the page slice, so we just use total from state
  const pageCount = Math.max(1, Math.ceil(total / itemsPerPage))
  const clampedPage = Math.min(Math.max(currentPage, 1), pageCount)
  const showingStartIndex = total === 0 ? 0 : (clampedPage - 1) * itemsPerPage + 1
  const showingEndIndex = Math.min(total, clampedPage * itemsPerPage)
  const resultsSummary =
    total === 0
      ? "Showing 0 results"
      : `Showing ${showingStartIndex}-${showingEndIndex} of ${total} results`

  const setItemsPerPageWithURL = useCallback(
    (value: number) => {
      setItemsPerPage(value)
      setCurrentPage(1)
      updateURL({
        perPage: value === DEFAULT_ITEMS_PER_PAGE ? null : String(value),
        page: null,
      })
    },
    [updateURL]
  )

  const goToPage = useCallback(
    (value: number) => {
      const nextPage = Math.max(1, Math.min(value, pageCount))
      setCurrentPage(nextPage)
      updateURL({
        page: nextPage === 1 ? null : String(nextPage),
      })
    },
    [pageCount, updateURL]
  )

  return (
    <>
      {/* Filter Bar (Desktop) */}
      <div className="hidden sm:block">
        <PennyListFilters
          totalItems={total}
          filteredCount={total}
          stateFilter={stateFilter}
          setStateFilter={setStateFilterWithURL}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQueryWithURL}
          sortOption={sortOption}
          setSortOption={setSortOptionWithURL}
          viewMode={viewMode}
          setViewMode={setViewModeWithURL}
          dateRange={dateRange}
          setDateRange={setDateRangeWithURL}
          userState={userState}
        />
      </div>

      {/* Mobile Action Bar + Sheets */}
      <div className="sm:hidden">
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-default)] bg-[var(--bg-elevated)]">
          <div className="grid grid-cols-4 gap-2 px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={openFilterSheet}
              aria-expanded={isFilterSheetOpen}
              aria-controls="penny-list-filter-sheet"
              className={`flex min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                isFilterSheetOpen
                  ? "border-[var(--cta-primary)] bg-[var(--bg-hover)] text-[var(--text-primary)]"
                  : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            <button
              type="button"
              onClick={openSortSheet}
              aria-expanded={isSortSheetOpen}
              aria-controls="penny-list-sort-sheet"
              className={`flex min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                isSortSheetOpen
                  ? "border-[var(--cta-primary)] bg-[var(--bg-hover)] text-[var(--text-primary)]"
                  : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
              }`}
            >
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
              Sort
            </button>
            <TrackableLink
              href="/lists"
              eventName="cta_click"
              eventParams={{ location: "penny-list-mobile-bar-lists" }}
              className="flex min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              My Lists
            </TrackableLink>
            <TrackableLink
              href="/report-find"
              eventName="find_submit"
              eventParams={{ location: "penny-list-mobile-bar-report" }}
              className="flex min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-lg bg-[var(--cta-primary)] text-xs font-semibold text-[var(--cta-text)] transition-colors hover:bg-[var(--cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            >
              <FilePlus className="h-4 w-4" aria-hidden="true" />
              Report
            </TrackableLink>
          </div>
        </div>

        {isFilterSheetOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[var(--bg-hover)] opacity-80"
              onClick={closeSheets}
              aria-hidden="true"
            />
            <div
              id="penny-list-filter-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="penny-list-filter-title"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  id="penny-list-filter-title"
                  className="text-base font-semibold text-[var(--text-primary)]"
                >
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={closeSheets}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="mobile-state-filter"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    State
                  </label>
                  <select
                    id="mobile-state-filter"
                    value={stateFilter}
                    onChange={(event) => setStateFilterWithURL(event.target.value)}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-primary)] min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  >
                    <option value="">All States</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name} ({state.code})
                      </option>
                    ))}
                  </select>
                </div>

                {userState && (
                  <button
                    type="button"
                    onClick={() =>
                      setStateFilterWithURL(stateFilter === userState ? "" : userState)
                    }
                    {...({ "aria-pressed": stateFilter === userState ? "true" : "false" } as Record<
                      string,
                      unknown
                    >)}
                    className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                      stateFilter === userState
                        ? "border-[var(--cta-primary)] bg-[var(--cta-primary)] text-[var(--cta-text)]"
                        : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                    }`}
                    title={`Show only items in ${getStateName(userState)}`}
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    My State
                  </button>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="mobile-search-filter"
                    className="text-sm font-semibold text-[var(--text-primary)]"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <input
                      id="mobile-search-filter"
                      type="search"
                      value={mobileSearch}
                      onChange={(event) => setMobileSearch(event.target.value)}
                      placeholder="Search by name or SKU..."
                      className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] min-h-[44px] placeholder:text-[var(--text-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Date range
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {DATE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDateRangeWithURL(option.value)}
                        {...({
                          "aria-pressed": dateRange === option.value ? "true" : "false",
                        } as Record<string, unknown>)}
                        className={`min-h-[44px] rounded-lg border px-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                          dateRange === option.value
                            ? "border-[var(--cta-primary)] bg-[var(--cta-primary)] text-[var(--cta-text)]"
                            : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openSortSheet}
                  className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                >
                  <span>Sort</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {SORT_OPTIONS.find((option) => option.value === sortOption)?.label ??
                      "Newest First"}
                  </span>
                </button>

                {(stateFilter ||
                  searchQuery ||
                  dateRange !== DEFAULT_DATE_RANGE ||
                  sortOption !== "newest") && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {isSortSheetOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[var(--bg-hover)] opacity-80"
              onClick={closeSheets}
              aria-hidden="true"
            />
            <div
              id="penny-list-sort-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="penny-list-sort-title"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  id="penny-list-sort-title"
                  className="text-base font-semibold text-[var(--text-primary)]"
                >
                  Sort
                </h2>
                <button
                  type="button"
                  onClick={closeSheets}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  aria-label="Close sort"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div role="radiogroup" aria-labelledby="penny-list-sort-title" className="space-y-2">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortOption === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setSortOptionWithURL(option.value)
                        setIsSortSheetOpen(false)
                      }}
                      className={`flex min-h-[44px] w-full items-center justify-between rounded-lg border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                        isSelected
                          ? "border-[var(--cta-primary)] bg-[var(--cta-primary)] text-[var(--cta-text)]"
                          : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hot Right Now - Only show if no filters active */}
      {!hasActiveFilters && hotItems.length > 0 && (
        <section
          aria-labelledby="hot-items-heading"
          className="mb-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2
                id="hot-items-heading"
                className="text-sm font-semibold text-[var(--text-primary)]"
              >
                Hot Right Now
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Frequently reported finds in the last {HOT_WINDOW_DAYS} days. YMMV.
              </p>
            </div>
            <span className="pill pill-success">Fresh signal</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotItems.map((item) => (
              <PennyListCardCompact key={`hot-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer Card */}
      <div
        className="mb-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 flex items-start gap-3 text-sm text-[var(--text-secondary)]"
        data-bookmark-tip="true"
      >
        <Bookmark
          className="w-5 h-5 text-[var(--cta-primary)] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Save it for later</p>
          <p className="leading-relaxed text-xs sm:text-sm">
            Tap the bookmark icon on a card to save the find to your personal lists. It will prompt
            you to sign in on first use, and you can review saved items on{" "}
            <TrackableLink
              href="/lists"
              eventName="cta_click"
              eventParams={{ location: "penny-list-bookmark-tip" }}
              className="font-semibold text-[var(--cta-primary)] underline decoration-[var(--cta-primary)] underline-offset-2"
            >
              your lists
            </TrackableLink>
            .
          </p>
        </div>
      </div>

      {/* Results */}
      <section
        aria-label="Penny list results"
        className="pb-[calc(80px+env(safe-area-inset-bottom))] sm:pb-0"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-secondary)]">
            {isLoading ? "Loading..." : resultsSummary}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="penny-list-items-per-page"
              className="text-xs font-semibold text-[var(--text-muted)]"
            >
              Items per page
            </label>
            <div className="relative">
              <select
                id="penny-list-items-per-page"
                value={itemsPerPage}
                onChange={(event) => setItemsPerPageWithURL(Number(event.target.value))}
                className="h-10 min-w-[88px] appearance-none rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] pl-3 pr-10 text-sm font-medium text-[var(--text-primary)] outline-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(clampedPage - 1)}
              disabled={clampedPage === 1}
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--cta-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              Page {clampedPage} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => goToPage(clampedPage + 1)}
              disabled={clampedPage === pageCount}
              className="inline-flex items-center justify-center min-h-[44px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--cta-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
        {total === 0 ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-8 text-center">
            <Package
              className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No items found
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms."
                : "No penny reports in the last 30 days. Check back soon or submit a find!"}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setStateFilterWithURL("")
                  setSearchQueryWithURL("")
                  setDateRangeWithURL(DEFAULT_DATE_RANGE)
                }}
                className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:bg-[var(--cta-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <PennyListTable
            items={items}
            sortOption={sortOption}
            onSortChange={setSortOptionWithURL}
            stateFilter={stateFilter}
            windowLabel={formatWindowLabel(dateRange)}
            userState={userState}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <PennyListCard
                key={item.id}
                item={item}
                stateFilter={stateFilter}
                windowLabel={formatWindowLabel(dateRange)}
                userState={userState}
              />
            ))}
          </div>
        )}
      </section>

      <FeedbackWidget />

      {/* About This List */}
      <details className="mt-12 mb-12 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
        <summary className="cursor-pointer text-lg font-semibold text-[var(--text-primary)]">
          How this works
        </summary>
        <div className="mt-4 space-y-4">
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--chip-accent-border)] bg-[var(--chip-accent-surface)] flex items-center justify-center">
              <Package className="w-4 h-4 text-[var(--cta-primary)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Members submit penny finds through the Report a Find form on PennyCentral.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--chip-success-border)] bg-[var(--chip-success-surface)] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[var(--status-success)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Submissions are added automatically, usually within about an hour.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--status-warning)] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[var(--status-warning)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-primary)] font-semibold leading-relaxed">
                Entries are not individually verified before they appear here.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                This is crowd‑sourced data — always verify in person.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Use the Facebook group for haul photos and real‑time confirmation.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--chip-muted-border)] bg-[var(--chip-muted-surface)] flex items-center justify-center">
              <Info className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Think of this as a{" "}
                <span className="font-semibold text-[var(--text-primary)]">lead board</span>, not a
                guarantee board.
              </p>
            </div>
          </div>
        </div>
      </details>

      {/* Affiliate CTA */}
      <div className="mt-6 mb-10">
        <a
          href="/go/befrugal"
          target="_blank"
          rel="noopener noreferrer"
          data-cta="befrugal"
          onClick={() =>
            trackEvent("affiliate_click", { surface: "penny-list", linkId: "befrugal" })
          }
          className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold min-h-[44px] hover:bg-[var(--cta-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        >
          Activate BeFrugal cashback - supports the site at no extra cost.
        </a>
      </div>

      <div className="mt-12 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 text-center">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Found a Penny Item?</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Help the community by reporting your find. It will appear on this list automatically.
        </p>
        <TrackableLink
          href="/report-find"
          eventName="find_submit"
          eventParams={{ location: "penny-list" }}
          className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium transition-colors duration-150 hover:bg-[var(--cta-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[44px]"
          aria-label="Submit a penny find to the community"
        >
          Report a Find
        </TrackableLink>
        <p className="text-xs text-[var(--text-muted)] mt-3">Shows up within about an hour.</p>
      </div>
    </>
  )
}
