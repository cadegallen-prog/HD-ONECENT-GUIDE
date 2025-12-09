"use client"

import { Calendar, Package } from "lucide-react"
import { CopySkuButton } from "@/components/copy-sku-button"
import { US_STATES } from "@/lib/us-states"
import type { PennyItem } from "@/lib/fetch-penny-data"

interface PennyListCardProps {
  item: PennyItem & { parsedDate?: Date | null }
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

export function PennyListCard({ item }: PennyListCardProps) {
  const commonnessTone = (tier?: string) => {
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (tier === "Common")
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  }

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const stateCount = item.locations ? Object.keys(item.locations).length : 0

  return (
    <article
      className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      aria-labelledby={`item-${item.id}-name`}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Tier + Date */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {item.status && item.status !== item.tier && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {item.status}
              </span>
            )}
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${commonnessTone(item.tier)}`}
              aria-label={`Commonness: ${item.tier || "Rare"}`}
            >
              {item.tier || "Rare"}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={item.dateAdded}>{item.dateAdded}</time>
          </span>
        </div>

        {/* Item Name */}
        <h3
          id={`item-${item.id}-name`}
          className="font-semibold text-lg text-[var(--text-primary)] mb-2 line-clamp-2"
        >
          {item.name}
        </h3>

        {/* SKU */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1.5 rounded w-fit">
          <span className="select-all">SKU: {item.sku}</span>
          <CopySkuButton sku={item.sku} />
        </div>

        {/* Quantity Found Badge */}
        {item.quantityFound && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-3">
            <Package className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{item.quantityFound}</span>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <p className="text-sm text-[var(--text-muted)] mb-3 line-clamp-2">{item.notes}</p>
        )}

        {/* Location Data - Improved Display */}
        {item.locations && Object.keys(item.locations).length > 0 && (
          <div className="mb-4 mt-auto">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
              Reported in {stateCount} {stateCount === 1 ? "state" : "states"}:
            </p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="States with reports">
              {Object.entries(item.locations)
                .sort(([, a], [, b]) => b - a) // Sort by count descending
                .map(([state, count]) => (
                  <span
                    key={state}
                    role="listitem"
                    className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-xs font-medium min-h-[28px] flex items-center"
                    title={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                    aria-label={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                  >
                    {state} · {count}
                  </span>
                ))}
            </div>
            {totalReports > 1 && (
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {totalReports} total {totalReports === 1 ? "report" : "reports"}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between mt-auto">
          <span className="text-xs text-[var(--text-muted)]">Unverified report</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">$0.01</span>
        </div>
      </div>
    </article>
  )
}

// Compact card for "Hot Right Now" section
export function PennyListCardCompact({ item }: PennyListCardProps) {
  const commonnessTone = (tier?: string) => {
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (tier === "Common")
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  }

  return (
    <article
      className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4"
      aria-labelledby={`hot-item-${item.id}-name`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${commonnessTone(item.tier)}`}
          aria-label={`Commonness: ${item.tier || "Rare"}`}
        >
          {item.tier || "Rare"}
        </span>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <time dateTime={item.dateAdded}>{item.dateAdded}</time>
        </span>
      </div>
      <h3
        id={`hot-item-${item.id}-name`}
        className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2"
      >
        {item.name}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">
        SKU: {item.sku}
      </div>
      {item.locations && Object.keys(item.locations).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="list" aria-label="States with reports">
          {Object.entries(item.locations)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5) // Show max 5 states in compact view
            .map(([state, count]) => (
              <span
                key={`${item.id}-${state}`}
                role="listitem"
                className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-xs"
                aria-label={`${state}: ${count} ${count === 1 ? "report" : "reports"}`}
              >
                {state} · {count}
              </span>
            ))}
          {Object.keys(item.locations).length > 5 && (
            <span className="px-2 py-0.5 text-[var(--text-muted)] text-xs">
              +{Object.keys(item.locations).length - 5} more
            </span>
          )}
        </div>
      )}
    </article>
  )
}
