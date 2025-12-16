"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AlertTriangle, Package, Clock, CheckCircle2, Info } from "lucide-react"
import { TrackableLink } from "@/components/trackable-link"
import { filterValidPennyItems, formatRelativeDate } from "@/lib/penny-list-utils"
import { trackEvent } from "@/lib/analytics"
import { FeedbackWidget } from "@/components/feedback-widget"
import {
  PennyListFilters,
  type TierFilter,
  type SortOption,
  type ViewMode,
  type DateRange,
} from "./penny-list-filters"
import { PennyListCard, PennyListCardCompact } from "./penny-list-card"
import { PennyListTable } from "./penny-list-table"
import type { PennyItem } from "@/lib/fetch-penny-data"

interface PennyListClientProps {
  initialItems: PennyItem[]
  initialSearchParams?: Record<string, string | string[] | undefined>
  whatsNewCount?: number
  whatsNewItems?: PennyItem[]
  lastUpdatedLabel?: string
}

// Get total reports across all states
function getTotalReports(locations: Record<string, number>): number {
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
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

export function PennyListClient({
  initialItems,
  initialSearchParams,
  whatsNewCount = 0,
  whatsNewItems = [],
  lastUpdatedLabel,
}: PennyListClientProps) {
  const router = useRouter()
  const pathname = usePathname()

  const HOT_WINDOW_DAYS = 14

  const initialParams = useMemo(() => toURLSearchParams(initialSearchParams), [initialSearchParams])
  const paramsRef = useRef<URLSearchParams>(initialParams)
  const hasMountedRef = useRef(false)
  const hasTrackedViewRef = useRef(false)

  const getInitialParam = (key: string) => initialParams.get(key) || ""

  // Initialize state from URL params
  const [stateFilter, setStateFilter] = useState(() => getInitialParam("state"))
  const [tierFilter, setTierFilter] = useState<TierFilter>(() => {
    const value = getInitialParam("tier") as TierFilter
    return value === "Very Common" || value === "Common" || value === "Rare" ? value : "all"
  })
  const [hasPhotoOnly, setHasPhotoOnly] = useState(() => getInitialParam("photo") === "1")
  const [searchQuery, setSearchQuery] = useState(() => getInitialParam("q"))
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
    const value = getInitialParam("days") as DateRange
    return value === "7" || value === "14" ? value : "30"
  })

  // User's saved state for "My State" button
  const [userState, setUserState] = useState<string | undefined>(undefined)

  useEffect(() => {
    hasMountedRef.current = true
  }, [])

  const validRows = useMemo(() => filterValidPennyItems(initialItems), [initialItems])
  const latestTimestamp = useMemo(() => {
    const timestamps = validRows
      .map((item) => new Date(item.dateAdded).getTime())
      .filter((time) => !Number.isNaN(time))
    if (timestamps.length === 0) return null
    return Math.max(...timestamps)
  }, [validRows])

  const freshnessHours = useMemo(() => {
    if (!latestTimestamp) return null
    const diffMs = Date.now() - latestTimestamp
    return Math.max(0, Math.round(diffMs / (1000 * 60 * 60)))
  }, [latestTimestamp])

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
          value === "all" ||
          value === "newest" ||
          value === "cards" ||
          value === "30"
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

  const setTierFilterWithURL = useCallback(
    (value: TierFilter) => {
      setTierFilter(value)
      updateURL({ tier: value === "all" ? null : value })
      trackFilterChange("tier", value, value === "all" ? "clear" : "apply")
    },
    [trackFilterChange, updateURL]
  )

  const setHasPhotoOnlyWithURL = useCallback(
    (value: boolean) => {
      setHasPhotoOnly(value)
      updateURL({ photo: value ? "1" : null })
      trackFilterChange("photo", value ? "with" : "all", value ? "apply" : "clear")
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
      updateURL({ days: value === "30" ? null : value })
      trackFilterChange("date_range", value, value === "30" ? "clear" : "apply")
    },
    [trackFilterChange, updateURL]
  )

  // Process and filter items
  const { recentItems, hotItems, filteredItems } = useMemo(() => {
    const today = new Date()
    const dateWindowDays = parseInt(dateRange, 10)

    const normalizeDate = (value: string) => {
      const parsed = new Date(`${value}T00:00:00Z`)
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    const isWithinDays = (date: Date, window: number) => {
      const diffMs = today.getTime() - date.getTime()
      const days = diffMs / (1000 * 60 * 60 * 24)
      return days >= 0 && days <= window
    }

    // Add parsed dates and filter to recent window
    const withMeta = validRows
      .map((item) => ({
        ...item,
        parsedDate: normalizeDate(item.dateAdded),
        tier: item.tier ?? "Rare",
      }))
      .filter((item) => item.parsedDate)

    // All items within 30 days (for total count)
    const allRecent = withMeta
      .filter((item) => item.parsedDate && isWithinDays(item.parsedDate, 30))
      .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime())

    // Hot items (Very Common in last 14 days) - unaffected by filters
    const hot = allRecent
      .filter(
        (item) =>
          item.tier === "Very Common" &&
          item.parsedDate &&
          isWithinDays(item.parsedDate, HOT_WINDOW_DAYS)
      )
      .slice(0, 6)

    // Apply date range filter first
    let filtered = allRecent.filter(
      (item) => item.parsedDate && isWithinDays(item.parsedDate, dateWindowDays)
    )

    // State filter
    if (stateFilter) {
      filtered = filtered.filter(
        (item) => item.locations && item.locations[stateFilter] !== undefined
      )
    }

    // Tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter((item) => item.tier === tierFilter)
    }

    // Photo filter
    if (hasPhotoOnly) {
      filtered = filtered.filter((item) => Boolean(item.imageUrl?.trim()))
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query))
      )
    }

    // Sort
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

    return {
      recentItems: allRecent,
      hotItems: hot,
      filteredItems: filtered,
    }
  }, [validRows, stateFilter, tierFilter, hasPhotoOnly, searchQuery, sortOption, dateRange])

  const previousSearchRef = useRef(searchQuery)

  useEffect(() => {
    if (!hasMountedRef.current) return
    if (searchQuery === previousSearchRef.current) return
    previousSearchRef.current = searchQuery
    trackEvent("penny_list_search", {
      termLength: searchQuery.trim().length,
      hasResults: filteredItems.length > 0,
    })
  }, [filteredItems.length, searchQuery])

  const hasActiveFilters =
    stateFilter !== "" ||
    tierFilter !== "all" ||
    hasPhotoOnly ||
    searchQuery !== "" ||
    dateRange !== "30"

  useEffect(() => {
    if (!hasMountedRef.current || hasTrackedViewRef.current) return
    hasTrackedViewRef.current = true
    trackEvent("penny_list_view", {
      page: "/penny-list",
      itemsVisible: filteredItems.length,
      hasFilter: hasActiveFilters,
      hasSearch: searchQuery.trim().length > 0,
      freshnessHours: freshnessHours ?? undefined,
      whatsNewCount,
    })
  }, [filteredItems.length, freshnessHours, hasActiveFilters, searchQuery, whatsNewCount])

  return (
    <>
      {/* Filter Bar */}
      <PennyListFilters
        totalItems={recentItems.length}
        filteredCount={filteredItems.length}
        stateFilter={stateFilter}
        setStateFilter={setStateFilterWithURL}
        tierFilter={tierFilter}
        setTierFilter={setTierFilterWithURL}
        hasPhotoOnly={hasPhotoOnly}
        setHasPhotoOnly={setHasPhotoOnlyWithURL}
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
                Very Common finds reported in the last {HOT_WINDOW_DAYS} days. YMMV.
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

      {whatsNewItems.length > 0 && (
        <section className="mb-8 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              What’s new this week (top 10)
            </h2>
            {lastUpdatedLabel && (
              <span className="text-xs text-[var(--text-muted)]">{lastUpdatedLabel}</span>
            )}
          </div>
          <ul className="divide-y divide-[var(--border-default)]">
            {whatsNewItems.map((item) => (
              <li key={item.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] truncate">{item.name}</p>
                  <p className="text-[var(--text-muted)] text-xs">SKU {item.sku}</p>
                </div>
                <div className="text-right text-xs text-[var(--text-secondary)] whitespace-nowrap">
                  <time dateTime={item.dateAdded}>
                    {formatRelativeDate(item.dateAdded, new Date())}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Disclaimer Card */}
      <div
        className="bg-[var(--bg-elevated)] dark:bg-[var(--bg-hover)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-warning)] rounded-lg p-4 mb-6 flex gap-3 items-start"
        role="alert"
      >
        <AlertTriangle
          className="w-5 h-5 text-[var(--status-warning)] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="font-semibold mb-2">Please Read:</p>
          <p className="mb-2">
            This page shows crowd-sourced reports from PennyCentral users. Submissions are added
            automatically and are not vetted or guaranteed.
          </p>
          <ul className="list-disc pl-4 space-y-1 mb-2">
            <li>Prices and availability are YMMV.</li>
            <li>Items may be mistyped, mis-scanned, or already pulled from the shelf.</li>
            <li>
              Always double-check in store and use the Facebook group for proof-of-purchase posts
              and discussion.
            </li>
          </ul>
          <p>
            The Facebook group remains the gold standard for verified hauls, receipts, and
            conversation. This list is a fast, experimental radar for possible leads.
          </p>
        </div>
      </div>

      {/* Monetization CTAs */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <a
          href="https://paypal.me/cadegallen"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("coffee_click", { surface: "penny-list" })}
          className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold min-h-[44px] hover:border-[var(--border-strong)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        >
          Buy me a coffee - optional tip if this helps you.
        </a>
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

      {/* Results */}
      <section aria-label="Penny list results">
        {filteredItems.length === 0 ? (
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
                  setTierFilterWithURL("all")
                  setSearchQueryWithURL("")
                  setDateRangeWithURL("30")
                }}
                className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:bg-[var(--cta-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <PennyListTable
            items={filteredItems}
            sortOption={sortOption}
            onSortChange={setSortOptionWithURL}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <PennyListCard key={item.id} item={item} />
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
