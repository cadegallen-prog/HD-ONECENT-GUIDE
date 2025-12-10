"use client"

import { ArrowUpDown, ArrowUp, ArrowDown, Copy, Check } from "lucide-react"
import { useState } from "react"
import { US_STATES } from "@/lib/us-states"
import { formatRelativeDate } from "@/lib/penny-list-utils"
import type { PennyItem } from "@/lib/fetch-penny-data"
import type { SortOption } from "./penny-list-filters"

interface PennyListTableProps {
  items: (PennyItem & { parsedDate?: Date | null })[]
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
}

// Get full state name from abbreviation
function getStateName(code: string): string {
  const state = US_STATES.find((s) => s.code === code)
  return state?.name || code
}

// Get total reports across all states
function getTotalReports(locations: Record<string, number>): number {
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
}

function CopyButton({ sku }: { sku: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sku)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)]"
      aria-label={copied ? "SKU copied" : `Copy SKU ${sku}`}
      title={copied ? "Copied!" : "Copy SKU"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
      )}
    </button>
  )
}

function SortButton({
  column,
  currentSort,
  onSort,
  children,
}: {
  column: SortOption
  currentSort: SortOption
  onSort: (sort: SortOption) => void
  children: React.ReactNode
}) {
  const isActive = currentSort === column
  const isNewestOrMost = column === "newest" || column === "most-reports"

  // Toggle between ascending/descending for the same column
  const handleClick = () => {
    if (column === "newest" && currentSort === "newest") {
      onSort("oldest")
    } else if (column === "oldest" && currentSort === "oldest") {
      onSort("newest")
    } else {
      onSort(column)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 font-medium transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] ${
        isActive ? "text-[var(--cta-primary)]" : "text-[var(--text-muted)]"
      }`}
      aria-label={`Sort by ${column}`}
    >
      {children}
      {isActive ? (
        isNewestOrMost ? (
          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
      )}
    </button>
  )
}

function TierBadge({ tier }: { tier?: string }) {
  const colorClasses = (() => {
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (tier === "Common")
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  })()

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
    >
      {tier || "Rare"}
    </span>
  )
}

export function PennyListTable({ items, sortOption, onSortChange }: PennyListTableProps) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Penny list items">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-zinc-50 dark:bg-zinc-900/50">
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                <SortButton column="alphabetical" currentSort={sortOption} onSort={onSortChange}>
                  Item Name
                </SortButton>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                SKU
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                Tier
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                States
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                <SortButton column="most-reports" currentSort={sortOption} onSort={onSortChange}>
                  Reports
                </SortButton>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]"
              >
                <SortButton column="newest" currentSort={sortOption} onSort={onSortChange}>
                  Date
                </SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const totalReports = item.locations ? getTotalReports(item.locations) : 0
              const stateCount = item.locations ? Object.keys(item.locations).length : 0
              const topStates = item.locations
                ? Object.entries(item.locations)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                : []

              return (
                <tr
                  key={item.id}
                  className={`border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-page)] transition-colors ${
                    index % 2 === 0 ? "bg-transparent" : "bg-zinc-50/50 dark:bg-zinc-900/20"
                  }`}
                >
                  {/* Item Name */}
                  <td className="px-4 py-3">
                    <div className="max-w-[300px]">
                      <span className="font-medium text-[var(--text-primary)] line-clamp-1">
                        {item.name}
                      </span>
                      {item.notes && (
                        <span
                          className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5 block"
                          title={item.notes}
                        >
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded select-all">
                        {item.sku}
                      </code>
                      <CopyButton sku={item.sku} />
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-3">
                    <TierBadge tier={item.tier} />
                  </td>

                  {/* States */}
                  <td className="px-4 py-3">
                    {stateCount > 0 ? (
                      <div
                        className="flex flex-wrap gap-1"
                        title={`Reported in ${stateCount} states`}
                      >
                        {topStates.map(([state]) => (
                          <span
                            key={state}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs text-[var(--text-secondary)]"
                            title={getStateName(state)}
                          >
                            {state}
                          </span>
                        ))}
                        {stateCount > 3 && (
                          <span className="text-xs text-[var(--text-muted)]">
                            +{stateCount - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>

                  {/* Reports */}
                  <td className="px-4 py-3 tabular-nums">
                    {totalReports > 0 ? (
                      <span className="text-[var(--text-primary)] font-medium">{totalReports}</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 tabular-nums text-[var(--text-secondary)]">
                    <time dateTime={item.dateAdded}>{formatRelativeDate(item.dateAdded)}</time>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="px-4 py-8 text-center text-[var(--text-muted)]">
          No items match your filters. Try adjusting your search criteria.
        </div>
      )}
    </div>
  )
}
