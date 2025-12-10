"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AlertTriangle, Package, Clock, CheckCircle2, Info } from "lucide-react"
import { SUBMIT_FIND_FORM_URL, NEWSLETTER_URL } from "@/lib/constants"
import { TrackableLink } from "@/components/trackable-link"
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
}

// Get total reports across all states
function getTotalReports(locations: Record<string, number>): number {
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
}

// Storage key for user's preferred state
const USER_STATE_KEY = "pennycentral_user_state"

export function PennyListClient({ initialItems }: PennyListClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const HOT_WINDOW_DAYS = 14

  // Initialize state from URL params
  const [stateFilter, setStateFilter] = useState(() => searchParams.get("state") || "")
  const [tierFilter, setTierFilter] = useState<TierFilter>(
    () => (searchParams.get("tier") as TierFilter) || "all"
  )
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "")
  const [sortOption, setSortOption] = useState<SortOption>(
    () => (searchParams.get("sort") as SortOption) || "newest"
  )
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (searchParams.get("view") as ViewMode) || "cards"
  )
  const [dateRange, setDateRange] = useState<DateRange>(
    () => (searchParams.get("days") as DateRange) || "30"
  )

  // User's saved state for "My State" button
  const [userState, setUserState] = useState<string | undefined>(undefined)

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
      const params = new URLSearchParams(searchParams.toString())

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

      const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newURL, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Wrapper setters that also update URL
  const setStateFilterWithURL = useCallback(
    (value: string) => {
      setStateFilter(value)
      updateURL({ state: value })
    },
    [updateURL]
  )

  const setTierFilterWithURL = useCallback(
    (value: TierFilter) => {
      setTierFilter(value)
      updateURL({ tier: value === "all" ? null : value })
    },
    [updateURL]
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
    },
    [updateURL]
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
    },
    [updateURL]
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
    const withMeta = initialItems
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
  }, [initialItems, stateFilter, tierFilter, searchQuery, sortOption, dateRange])

  const hasActiveFilters =
    stateFilter !== "" || tierFilter !== "all" || searchQuery !== "" || dateRange !== "30"

  return (
    <>
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
            <span className="text-xs font-medium rounded-full px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
              Fresh signal
            </span>
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
        className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex gap-3 items-start"
        role="alert"
      >
        <AlertTriangle
          className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="text-sm text-amber-800 dark:text-amber-200">
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

      {/* Filter Bar */}
      <PennyListFilters
        totalItems={recentItems.length}
        filteredCount={filteredItems.length}
        stateFilter={stateFilter}
        setStateFilter={setStateFilterWithURL}
        tierFilter={tierFilter}
        setTierFilter={setTierFilterWithURL}
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
                className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-white font-medium hover:bg-[var(--cta-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
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

      {/* About This List */}
      <section
        aria-labelledby="how-it-works-heading"
        className="mt-12 mb-12 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6"
      >
        <h2
          id="how-it-works-heading"
          className="text-lg font-semibold text-[var(--text-primary)] mb-4"
        >
          How This List Works
        </h2>

        <div className="space-y-4">
          {/* Item 1: Submission */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Members submit penny finds through the Report a Find form on PennyCentral.
              </p>
            </div>
          </div>

          {/* Item 2: Automation */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Clock
                className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Submissions are added to this page automatically, usually within about an hour.
              </p>
            </div>
          </div>

          {/* Item 3: Unverified (highlighted) */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle
                className="w-4 h-4 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-primary)] font-semibold leading-relaxed">
                No admin reviews each entry before it appears here.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                This is crowd-sourced data—always verify in person.
              </p>
            </div>
          </div>

          {/* Item 4: Facebook verification */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CheckCircle2
                className="w-4 h-4 text-purple-600 dark:text-purple-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Use the Facebook group to look for haul posts, photos, and real-time feedback on
                these SKUs.
              </p>
            </div>
          </div>

          {/* Item 5: Lead board concept */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
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
      </section>

      {/* Call to Action Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        {/* Submit a Find */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Found a Penny Item?</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Help the community by reporting your finds. Your submission will appear on this list
            automatically.
          </p>
          <TrackableLink
            href={SUBMIT_FIND_FORM_URL}
            eventName="find_submit"
            eventParams={{ location: "penny-list" }}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium transition-all duration-200 hover:bg-[var(--cta-hover)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[44px]"
            aria-label="Submit a penny find to the community"
          >
            Submit a Find
          </TrackableLink>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Your submission appears within an hour.
          </p>
        </div>

        {/* Newsletter */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Get Penny Alerts</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Don&apos;t miss out. Get the weekly list of confirmed penny items delivered to your
            inbox.
          </p>
          <TrackableLink
            href={NEWSLETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            eventName="newsletter_click"
            eventParams={{ location: "penny-list" }}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium transition-all duration-200 hover:bg-[var(--cta-hover)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[44px]"
            aria-label="Subscribe to weekly penny alerts newsletter"
          >
            Subscribe to Alerts
          </TrackableLink>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            We respect your inbox. No spam, ever.
          </p>
        </div>
      </div>
    </>
  )
}
