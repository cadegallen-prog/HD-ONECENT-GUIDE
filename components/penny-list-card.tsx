"use client"

import { Calendar, Package } from "lucide-react"
import { CopySkuButton } from "@/components/copy-sku-button"
import { US_STATES } from "@/lib/us-states"
import { formatRelativeDate } from "@/lib/penny-list-utils"
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
    // Using CSS variables that automatically adapt to light/dark mode
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    if (tier === "Common")
      return "bg-[var(--bg-elevated)] text-[var(--status-info)] border-[var(--border-strong)]"
    // Rare items use elevation-2 background for subtle distinction
    return "elevation-2 text-[var(--text-primary)] border-[var(--border-strong)]"
  }

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const stateCount = item.locations ? Object.keys(item.locations).length : 0

  return (
    <article
      className="elevation-card border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full flex flex-col"
      aria-labelledby={`item-${item.id}-name`}
    >
      {/* 8pt grid: p-5 = 20px, space-y-4 = 16px between elements */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {item.status && item.status !== item.tier && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full elevation-2 border border-[var(--border-strong)] text-[var(--text-primary)]">
                {item.status}
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${commonnessTone(item.tier)}`}
              aria-label={`Commonness: ${item.tier || "Rare"}`}
            >
              {item.tier || "Rare"}
            </span>
          </div>
          <span className="text-sm text-[var(--text-secondary)] font-medium flex items-center gap-1.5 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={item.dateAdded}>{formatRelativeDate(item.dateAdded)}</time>
          </span>
        </div>

        <h3
          id={`item-${item.id}-name`}
          className="font-semibold text-lg text-[var(--text-primary)] leading-[1.5] line-clamp-2"
        >
          {item.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2.5 py-1.5 rounded w-fit font-medium">
          <span className="select-all">SKU: {item.sku}</span>
          <CopySkuButton sku={item.sku} source="card" />
        </div>

        {item.quantityFound && (
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
            <Package className="w-4 h-4" aria-hidden="true" />
            <span>{item.quantityFound}</span>
          </div>
        )}

        {item.notes && (
          <p className="text-base text-[var(--text-primary)] leading-[1.7] line-clamp-3">
            {item.notes}
          </p>
        )}

        {item.locations && Object.keys(item.locations).length > 0 && (
          <div className="mt-auto space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Reported in {stateCount} {stateCount === 1 ? "state" : "states"}:
            </p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="States with reports">
              {Object.entries(item.locations)
                .sort(([, a], [, b]) => b - a)
                .map(([state, count]) => (
                  <span
                    key={state}
                    role="listitem"
                    className="px-2.5 py-1 rounded-full elevation-2 border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-semibold min-h-[28px] flex items-center"
                    title={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                    aria-label={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                  >
                    {state} · {count}
                  </span>
                ))}
            </div>
            {totalReports > 0 && (
              <p className="text-sm text-[var(--text-secondary)]">
                {totalReports} total {totalReports === 1 ? "report so far" : "reports"}
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between mt-auto">
          <span className="text-sm text-[var(--text-secondary)]">Unverified report</span>
          <span className="font-bold text-lg text-[var(--status-success)]">$0.01</span>
        </div>
      </div>
    </article>
  )
}

export function PennyListCardCompact({ item }: PennyListCardProps) {
  const commonnessTone = (tier?: string) => {
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
    if (tier === "Common")
      return "bg-[var(--bg-elevated)] text-[var(--status-info)] border-[var(--border-strong)]"
    return "elevation-2 text-[var(--text-primary)] border-[var(--border-strong)]"
  }

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const stateCount = item.locations ? Object.keys(item.locations).length : 0

  return (
    <article
      className="rounded-lg border border-[var(--border-strong)] elevation-card p-4"
      aria-labelledby={`hot-item-${item.id}-name`}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${commonnessTone(item.tier)}`}
          aria-label={`Commonness: ${item.tier || "Rare"}`}
        >
          {item.tier || "Rare"}
        </span>
        <span className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1 flex-shrink-0">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <time dateTime={item.dateAdded}>{formatRelativeDate(item.dateAdded)}</time>
        </span>
      </div>
      <h3
        id={`hot-item-${item.id}-name`}
        className="text-sm font-semibold text-[var(--text-primary)] leading-[1.5] line-clamp-2"
      >
        {item.name}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2 py-1 rounded w-fit font-medium">
        SKU: {item.sku}
      </div>
      {totalReports > 0 && (
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          {totalReports} {totalReports === 1 ? "report" : "reports"} · {stateCount}{" "}
          {stateCount === 1 ? "state" : "states"}
        </p>
      )}
      {item.locations && Object.keys(item.locations).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5" role="list" aria-label="States with reports">
          {Object.entries(item.locations)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([state, count]) => (
              <span
                key={`${item.id}-${state}`}
                role="listitem"
                className="px-2 py-1 rounded-full elevation-2 border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-semibold"
                aria-label={`${state}: ${count} ${count === 1 ? "report" : "reports"}`}
              >
                {state} · {count}
              </span>
            ))}
          {Object.keys(item.locations).length > 5 && (
            <span className="px-2 py-1 text-[var(--text-muted)] text-xs font-medium">
              +{Object.keys(item.locations).length - 5} more
            </span>
          )}
        </div>
      )}
    </article>
  )
}
