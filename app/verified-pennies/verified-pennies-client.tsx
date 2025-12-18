"use client"

import { useState, useMemo } from "react"
import { Search, Filter, X } from "lucide-react"
import { VerifiedPennyCard } from "@/components/verified-penny-card"
import type { VerifiedPenny } from "@/lib/verified-pennies"
import { getFreshness, getLatestDateFromArray } from "@/lib/freshness-utils"

interface VerifiedPenniesClientProps {
  items: VerifiedPenny[]
  brands: string[]
}

export function VerifiedPenniesClient({ items, brands }: VerifiedPenniesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [freshnessFilter, setFreshnessFilter] = useState<"all" | "fresh" | "recent" | "older">(
    "all"
  )
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest")

  const filteredItems = useMemo(() => {
    let result = items

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.includes(query) ||
          item.brand.toLowerCase().includes(query)
      )
    }

    // Filter by brand
    if (selectedBrand) {
      result = result.filter((item) => item.brand === selectedBrand)
    }

    // Filter by freshness
    if (freshnessFilter !== "all") {
      result = result.filter((item) => {
        const latestDate = getLatestDateFromArray(item.purchaseDates)
        const freshness = getFreshness(latestDate)
        if (freshnessFilter === "fresh") return freshness === "fresh"
        if (freshnessFilter === "recent") return freshness === "fresh" || freshness === "moderate"
        if (freshnessFilter === "older") return freshness === "old"
        return true
      })
    }

    // Sort results
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = a.purchaseDates?.[0] ?? ""
        const dateB = b.purchaseDates?.[0] ?? ""
        return dateB.localeCompare(dateA)
      } else if (sortBy === "oldest") {
        const dateA = a.purchaseDates?.[a.purchaseDates.length - 1] ?? ""
        const dateB = b.purchaseDates?.[b.purchaseDates.length - 1] ?? ""
        return dateA.localeCompare(dateB)
      } else {
        // Sort by name (A-Z)
        return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [items, searchQuery, selectedBrand, freshnessFilter, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBrand(null)
    setFreshnessFilter("all")
    setSortBy("newest")
  }

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedBrand !== null || freshnessFilter !== "all"

  return (
    <main className="section-padding-sm px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-3">
          {/* Search Input */}
          <div className="relative max-w-xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
              aria-label="Search verified penny items"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--bg-muted)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2">
            <Filter className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />

            {/* Brand Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Brand:</span>
              <select
                value={selectedBrand || ""}
                onChange={(e) => setSelectedBrand(e.target.value || null)}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                aria-label="Filter by brand"
              >
                <option value="">All</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Freshness Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Freshness:</span>
              <select
                value={freshnessFilter}
                onChange={(e) =>
                  setFreshnessFilter(e.target.value as "all" | "fresh" | "recent" | "older")
                }
                className="px-3 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                aria-label="Filter by freshness"
              >
                <option value="all">All</option>
                <option value="fresh">Fresh (30d)</option>
                <option value="recent">Recent (90d)</option>
                <option value="older">Older</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)]"
                aria-label="Sort items"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 px-3 py-1.5 text-sm text-[var(--cta-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Showing {filteredItems.length.toLocaleString()} of {items.length.toLocaleString()} items
          </p>
        </div>

        {/* Results Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredItems.map((item) => (
              <VerifiedPennyCard key={item.sku} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[var(--text-secondary)] mb-4">No items match your search.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:bg-[var(--cta-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-default)] text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            <strong>Note:</strong> Penny items can vary by store and timing. Always verify the price
            at checkout. These items have been confirmed as penny deals but availability changes.
          </p>
        </div>
      </div>
    </main>
  )
}
