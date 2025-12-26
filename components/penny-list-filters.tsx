"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, LayoutGrid, Table2, MapPin, Image } from "lucide-react"
import { US_STATES } from "@/lib/us-states"

export type SortOption = "newest" | "oldest" | "most-reports" | "alphabetical"
export type ViewMode = "cards" | "table"
export type DateRange = "1m" | "3m" | "6m" | "12m" | "18m" | "24m" | "all"

interface PennyListFiltersProps {
  totalItems: number
  filteredCount: number
  stateFilter: string
  setStateFilter: (state: string) => void
  hasPhotoOnly: boolean
  setHasPhotoOnly: (value: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortOption: SortOption
  setSortOption: (sort: SortOption) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  userState?: string // For "My State" quick filter
}

// Get state name from code
function getStateName(code: string): string {
  const state = US_STATES.find((s) => s.code === code)
  return state?.name || code
}

export function PennyListFilters({
  totalItems,
  filteredCount,
  stateFilter,
  setStateFilter,
  hasPhotoOnly,
  setHasPhotoOnly,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  dateRange,
  setDateRange,
  userState,
}: PennyListFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])

  // Sync local search with prop (for URL param changes)
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const hasActiveFilters =
    stateFilter !== "" ||
    hasPhotoOnly ||
    searchQuery !== "" ||
    sortOption !== "newest" ||
    dateRange !== "6m"

  const clearAllFilters = useCallback(() => {
    setStateFilter("")
    setHasPhotoOnly(false)
    setSearchQuery("")
    setLocalSearch("")
    setSortOption("newest")
    setDateRange("6m")
  }, [setStateFilter, setHasPhotoOnly, setSearchQuery, setSortOption, setDateRange])

  const dateOptions: { value: DateRange; label: string }[] = [
    { value: "1m", label: "1 mo" },
    { value: "3m", label: "3 mo" },
    { value: "6m", label: "6 mo" },
    { value: "12m", label: "12 mo" },
    { value: "18m", label: "18 mo" },
    { value: "24m", label: "24 mo" },
    { value: "all", label: "All" },
  ]

  const getDateRangeChipLabel = (value: DateRange): string => {
    const found = dateOptions.find((o) => o.value === value)
    if (!found) return ""

    switch (value) {
      case "1m":
        return "Last 1 month"
      case "3m":
        return "Last 3 months"
      case "6m":
        return "Last 6 months"
      case "12m":
        return "Last 12 months"
      case "18m":
        return "Last 18 months"
      case "24m":
        return "Last 24 months"
      case "all":
        return "All time"
    }
  }

  const getDateRangeWindowLabel = (value: DateRange): string => {
    switch (value) {
      case "1m":
        return "1 month"
      case "3m":
        return "3 months"
      case "6m":
        return "6 months"
      case "12m":
        return "12 months"
      case "18m":
        return "18 months"
      case "24m":
        return "24 months"
      case "all":
        return "all time"
    }
  }

  // Build active filter chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = []

  if (stateFilter) {
    activeChips.push({
      key: "state",
      label: getStateName(stateFilter),
      onRemove: () => setStateFilter(""),
    })
  }
  if (hasPhotoOnly) {
    activeChips.push({
      key: "photo",
      label: "Has photo",
      onRemove: () => setHasPhotoOnly(false),
    })
  }
  if (searchQuery) {
    activeChips.push({
      key: "search",
      label: `"${searchQuery}"`,
      onRemove: () => {
        setSearchQuery("")
        setLocalSearch("")
      },
    })
  }
  if (dateRange !== "6m") {
    activeChips.push({
      key: "date",
      label: getDateRangeChipLabel(dateRange),
      onRemove: () => setDateRange("6m"),
    })
  }
  if (sortOption !== "newest") {
    const sortLabels: Record<SortOption, string> = {
      newest: "Newest",
      oldest: "Oldest",
      "most-reports": "Most Reports",
      alphabetical: "A-Z",
    }
    activeChips.push({
      key: "sort",
      label: `Sorted: ${sortLabels[sortOption]}`,
      onRemove: () => setSortOption("newest"),
    })
  }

  return (
    <section
      aria-label="Filter penny list results"
      className="sticky top-16 z-20 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-4 sm:p-6 mb-6 shadow-sm"
    >
      {/* Row 1: State, My State, Photo, View Mode */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* State Dropdown */}
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="state-filter" className="sr-only">
            Filter by state
          </label>
          <select
            id="state-filter"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm min-h-[44px] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
            aria-describedby="state-filter-desc"
          >
            <option value="">All States</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} ({state.code})
              </option>
            ))}
          </select>
          <span id="state-filter-desc" className="sr-only">
            Filter items by the state where they were reported
          </span>
        </div>

        {/* My State Quick Filter */}
        {userState && (
          <button
            type="button"
            onClick={() => setStateFilter(stateFilter === userState ? "" : userState)}
            {...({ "aria-pressed": stateFilter === userState ? "true" : "false" } as Record<
              string,
              unknown
            >)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
              stateFilter === userState
                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                : "border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            }`}
            title={`Show only items in ${getStateName(userState)}`}
          >
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">My State</span>
            <span className="sm:hidden">{userState}</span>
          </button>
        )}

        {/* Has Photo Toggle */}
        <button
          type="button"
          onClick={() => setHasPhotoOnly(!hasPhotoOnly)}
          {...({ "aria-pressed": hasPhotoOnly ? "true" : "false" } as Record<string, unknown>)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
            hasPhotoOnly
              ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
              : "border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          }`}
          title="Show only items with photos"
        >
          <Image className="w-4 h-4" aria-hidden="true" />
          Has photo
        </button>

        {/* View Mode Toggle (Desktop Only) */}
        <div className="hidden lg:flex rounded-lg border border-[var(--border-default)] overflow-hidden">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            {...({ "aria-pressed": viewMode === "cards" ? "true" : "false" } as Record<
              string,
              unknown
            >)}
            className={`px-3 py-2.5 min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
              viewMode === "cards"
                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                : "bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            }`}
            title="Card view"
            aria-label="Switch to card view"
          >
            <LayoutGrid className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            {...({ "aria-pressed": viewMode === "table" ? "true" : "false" } as Record<
              string,
              unknown
            >)}
            className={`px-3 py-2.5 min-h-[44px] border-l border-[var(--border-default)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
              viewMode === "table"
                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                : "bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            }`}
            title="Table view"
            aria-label="Switch to table view"
          >
            <Table2 className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Row 2: Search, Date Range, Sort, Clear */}
      <div className="flex flex-wrap gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[180px] relative">
          <label htmlFor="search-filter" className="sr-only">
            Search by item name or SKU
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <input
            id="search-filter"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm min-h-[44px] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
            aria-describedby="search-filter-desc"
          />
          <span id="search-filter-desc" className="sr-only">
            Type to filter items by name or SKU number
          </span>
        </div>

        {/* Date Range Quick Filters */}
        <fieldset className="flex-shrink-0">
          <legend className="sr-only">Filter by date range</legend>
          <div
            className="flex rounded-lg border border-[var(--border-default)] overflow-hidden"
            role="group"
            aria-label="Date range filter"
          >
            {dateOptions.map((option, index) => {
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDateRange(option.value)}
                  {...({ "aria-pressed": dateRange === option.value ? "true" : "false" } as Record<
                    string,
                    unknown
                  >)}
                  className={`px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
                    dateRange === option.value
                      ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                      : "bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                  } ${index > 0 ? "border-l border-[var(--border-default)]" : ""}`}
                  title={`Show items from the last ${option.label}`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0 min-w-[150px]">
          <label htmlFor="sort-filter" className="sr-only">
            Sort results
          </label>
          <select
            id="sort-filter"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm min-h-[44px] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-reports">Most Reports</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-secondary)] text-sm font-medium min-h-[44px] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            aria-label="Clear all filters and reset to defaults"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-[var(--text-muted)] mr-1">Active:</span>
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--cta-primary)]/10 text-[var(--cta-primary)] text-xs font-medium hover:bg-[var(--cta-primary)]/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[28px]"
                aria-label={`Remove filter: ${chip.label}`}
              >
                {chip.label}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            ))}
            {activeChips.length > 1 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline ml-2 min-h-[28px]"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Count - Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 pt-4 border-t border-[var(--border-default)] text-sm text-[var(--text-secondary)]"
      >
        {filteredCount === totalItems ? (
          <span>
            Showing all <strong className="text-[var(--text-primary)]">{totalItems}</strong> items
          </span>
        ) : (
          <span>
            Showing <strong className="text-[var(--text-primary)]">{filteredCount}</strong> of{" "}
            <strong>{totalItems}</strong> items
          </span>
        )}
        {stateFilter && (
          <span className="ml-1">
            in <strong className="text-[var(--text-primary)]">{getStateName(stateFilter)}</strong>
          </span>
        )}
        {dateRange !== "6m" && (
          <span className="ml-1">
            from the last{" "}
            <strong className="text-[var(--text-primary)]">
              {getDateRangeWindowLabel(dateRange)}
            </strong>
          </span>
        )}
      </div>
    </section>
  )
}
