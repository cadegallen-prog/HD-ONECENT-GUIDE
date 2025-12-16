"use client"

import Link from "next/link"
import { ArrowUpDown, ArrowUp, ArrowDown, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { KeyboardEvent } from "react"
import { US_STATES } from "@/lib/us-states"
import { formatRelativeDate } from "@/lib/penny-list-utils"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import type { PennyItem } from "@/lib/fetch-penny-data"
import type { SortOption } from "./penny-list-filters"
import { trackEvent } from "@/lib/analytics"
import { getHomeDepotProductUrl } from "@/lib/home-depot"

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
    const skuMasked = sku.slice(-4)
    trackEvent("sku_copy", { skuMasked, source: "table" })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] min-h-[36px] hover:bg-[var(--bg-hover)]"
      aria-label={copied ? "SKU copied" : `Copy SKU ${sku}`}
      title={copied ? "Copied!" : "Copy SKU"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[var(--status-success)]" aria-hidden="true" />
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
    if (tier === "Very Common") {
      return "pill pill-success"
    }
    if (tier === "Common") {
      return "pill pill-accent"
    }
    return "pill pill-strong"
  })()

  return <span className={colorClasses}>{tier || "Rare"}</span>
}

export function PennyListTable({ items, sortOption, onSortChange }: PennyListTableProps) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden">
      {/* Mobile scroll hint */}
      <div className="lg:hidden px-4 py-2 bg-[var(--bg-hover)] border-b border-[var(--border-default)] text-xs text-[var(--text-muted)] text-center">
        ← Scroll horizontally to see all columns →
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm table-fixed min-w-[980px] penny-list-table"
          role="table"
          aria-label="Penny list items"
        >
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-recessed)]">
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                Photo
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                <SortButton column="alphabetical" currentSort={sortOption} onSort={onSortChange}>
                  Item Name
                </SortButton>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                SKU
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                Tier
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                States
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                <SortButton column="most-reports" currentSort={sortOption} onSort={onSortChange}>
                  Reports
                </SortButton>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                <SortButton column="newest" currentSort={sortOption} onSort={onSortChange}>
                  Date
                </SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const totalReports = item.locations ? getTotalReports(item.locations) : 0
              const stateCount = item.locations ? Object.keys(item.locations).length : 0
              const topStates = item.locations
                ? Object.entries(item.locations)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                : []
              const homeDepotUrl = getHomeDepotProductUrl({ sku: item.sku })

              const openHomeDepot = () => window.open(homeDepotUrl, "_blank", "noopener,noreferrer")

              const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openHomeDepot()
                }
              }

              return (
                <tr
                  key={item.id}
                  tabIndex={0}
                  aria-label={`Open Home Depot page for ${item.name} (SKU ${item.sku})`}
                  onClick={openHomeDepot}
                  onKeyDown={handleRowKeyDown}
                  className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] focus-visible:outline-offset-2"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3 align-top">
                    <PennyThumbnail src={item.imageUrl} alt={item.name} size={40} />
                  </td>
                  {/* Item Name */}
                  <td className="px-4 py-3 align-top min-w-0">
                    <div className="space-y-1.5">
                      <Link
                        href={`/sku/${item.sku}`}
                        className="font-semibold text-[var(--text-primary)] leading-[1.4] truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                        title={item.name}
                        onClickCapture={(event) => event.stopPropagation()}
                        onKeyDownCapture={(event) => event.stopPropagation()}
                      >
                        {item.name}
                      </Link>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-3 align-top">
                    <div
                      className="flex items-center gap-1.5"
                      onClickCapture={(event) => event.stopPropagation()}
                      onKeyDownCapture={(event) => event.stopPropagation()}
                    >
                      <code className="font-mono text-sm bg-[var(--bg-elevated)] border border-[var(--border-default)] px-2.5 py-1.5 rounded select-all text-[var(--text-primary)] font-medium">
                        {item.sku}
                      </code>
                      <CopyButton sku={item.sku} />
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-3 align-top">
                    <TierBadge tier={item.tier} />
                  </td>

                  {/* States */}
                  <td className="px-4 py-3 align-top">
                    {stateCount > 0 ? (
                      <div
                        className="flex flex-wrap gap-1.5"
                        title={`Reported in ${stateCount} states`}
                      >
                        {topStates.map(([state]) => (
                          <span
                            key={state}
                            className="pill pill-strong"
                            title={getStateName(state)}
                          >
                            {state}
                          </span>
                        ))}
                        {stateCount > 3 && (
                          <span className="text-xs text-[var(--text-muted)] font-medium">
                            +{stateCount - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">-</span>
                    )}
                  </td>

                  {/* Reports */}
                  <td className="px-4 py-3 align-top">
                    {totalReports > 0 ? (
                      <span className="text-[var(--text-primary)] font-semibold tabular-nums">
                        {totalReports}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">-</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 align-top">
                    <time
                      className="text-[var(--text-primary)] tabular-nums"
                      dateTime={item.dateAdded}
                    >
                      {formatRelativeDate(item.dateAdded)}
                    </time>
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
