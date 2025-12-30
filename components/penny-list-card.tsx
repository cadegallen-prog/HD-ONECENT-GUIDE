"use client"

import { useState, useCallback } from "react"
import { Calendar, ExternalLink, PlusCircle, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { copyToClipboard } from "@/components/copy-sku-button"
import { ShareButton } from "@/components/share-button"
import { AddToListButton } from "@/components/add-to-list-button"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import { US_STATES } from "@/lib/us-states"
import { formatRelativeDate } from "@/lib/penny-list-utils"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { getHomeDepotProductUrl } from "@/lib/home-depot"
import { formatSkuForDisplay } from "@/lib/sku"
import { buildReportFindUrl } from "@/lib/report-find-link"
import { trackEvent } from "@/lib/analytics"
import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const identifiers = [
    { label: "Model", value: item.modelNumber },
    { label: "UPC", value: item.upc },
  ]
  const hasIdentifiers = identifiers.some((identifier) => identifier.value)

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const stateCount = item.locations ? Object.keys(item.locations).length : 0
  const homeDepotUrl = getHomeDepotProductUrl({
    sku: item.sku,
    internetNumber: item.internetNumber,
    homeDepotUrl: item.homeDepotUrl,
  })
  const skuPageUrl = `/sku/${item.sku}`

  const openSkuPage = () => router.push(skuPageUrl)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openSkuPage()
    }
  }

  const handleSkuCopy = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const success = await copyToClipboard(item.sku)
      if (success) {
        const skuMasked = item.sku.slice(-4)
        trackEvent("sku_copy", { skuMasked, source: "card-pill" })
        setCopied(true)
        toast.success(`Copied SKU ${formatSkuForDisplay(item.sku)}`, {
          duration: 2000,
        })
        setTimeout(() => setCopied(false), 1500)
      } else {
        toast.error("Failed to copy SKU", { duration: 2000 })
      }
    },
    [item.sku]
  )

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openSkuPage}
      onKeyDown={handleKeyDown}
      className="elevation-card border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full flex flex-col group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-label={`View details for ${item.name} (SKU ${item.sku})`}
      aria-labelledby={`item-${item.id}-name`}
    >
      <article className="flex flex-col h-full">
        {/* 8pt grid: p-5 = 20px, space-y-4 = 16px between elements */}
        <div className="p-5 flex flex-col flex-1 space-y-4">
          <div className="flex items-start gap-3">
            {item.status && <span className="pill pill-strong">{item.status}</span>}
            <span className="ml-auto text-sm text-[var(--text-secondary)] font-medium flex items-center gap-1.5 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <time dateTime={item.dateAdded}>{formatRelativeDate(item.dateAdded)}</time>
            </span>
          </div>

          <div className="flex gap-4 items-start">
            <Link
              href={skuPageUrl}
              aria-label={`View details for ${item.name}`}
              onClick={(e) => e.stopPropagation()}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
            >
              <PennyThumbnail src={item.imageUrl} alt={item.name} size={72} />
            </Link>
            <div className="min-w-0 flex-1 space-y-2">
              <Link
                href={skuPageUrl}
                onClick={(e) => e.stopPropagation()}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
              >
                <div className="space-y-2">
                  {item.brand && (
                    <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                      {item.brand}
                    </p>
                  )}
                  <h3
                    id={`item-${item.id}-name`}
                    className="font-semibold text-base sm:text-lg text-[var(--text-primary)] leading-[1.5] line-clamp-2 group-hover:text-[var(--cta-primary)] transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleSkuCopy}
                className="flex items-center gap-2 text-sm text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-3 py-2 rounded w-fit font-medium cursor-pointer hover:border-[var(--cta-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                aria-label={`Copy SKU ${item.sku} to clipboard`}
                title="Tap to copy SKU"
              >
                <span className="text-[var(--text-muted)]">SKU</span>
                <span className="font-semibold">{formatSkuForDisplay(item.sku)}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-[var(--status-success)]" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                )}
              </button>
              {hasIdentifiers && (
                <>
                  <div className="hidden sm:flex items-center flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-muted)]">Identifiers:</span>
                    {identifiers
                      .filter((identifier) => identifier.value)
                      .map((identifier) => (
                        <span key={identifier.label} className="flex items-center gap-1">
                          <span className="text-[var(--text-muted)]">{identifier.label}</span>
                          <span className="text-[var(--text-primary)] font-medium">
                            {identifier.value}
                          </span>
                        </span>
                      ))}
                  </div>
                  <details className="sm:hidden">
                    <summary className="text-xs font-semibold text-[var(--cta-primary)] underline decoration-[var(--cta-primary)] underline-offset-2">
                      Details
                    </summary>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                      {identifiers
                        .filter((identifier) => identifier.value)
                        .map((identifier) => (
                          <span key={identifier.label} className="flex items-center gap-1">
                            <span className="text-[var(--text-muted)]">{identifier.label}</span>
                            <span className="text-[var(--text-primary)] font-medium">
                              {identifier.value}
                            </span>
                          </span>
                        ))}
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>

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
                      className="pill pill-strong min-h-[28px] flex items-center"
                      title={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                      aria-label={`${getStateName(state)}: ${count} ${count === 1 ? "report" : "reports"}`}
                    >
                      {state} × {count}
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

          <div className="pt-4 border-t border-[var(--border-default)] mt-auto">
            <div className="flex items-center flex-wrap gap-3 text-sm font-semibold text-[var(--text-primary)]">
              <span className="text-[var(--status-success)]">$0.01</span>
              <a
                href={homeDepotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  trackEvent("home_depot_click", {
                    skuMasked: item.sku.slice(-4),
                    source: "penny-list-card",
                  })
                }}
              >
                View on Home Depot
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <ShareButton sku={item.sku} itemName={item.name} source="card" />
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <AddToListButton sku={item.sku} itemName={item.name} variant="icon" />
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  trackEvent("report_duplicate_click", {
                    sku: item.sku,
                    name: item.name,
                    src: "card",
                  })
                  router.push(buildReportFindUrl({ sku: item.sku, name: item.name, src: "card" }))
                }}
                className="relative z-10 pointer-events-auto"
                aria-label={`Report finding ${item.name}`}
              >
                <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Report this find
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export function PennyListCardCompact({ item }: PennyListCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const identifiers = [
    { label: "Model", value: item.modelNumber },
    { label: "UPC", value: item.upc },
  ]
  const hasIdentifiers = identifiers.some((identifier) => identifier.value)

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const stateCount = item.locations ? Object.keys(item.locations).length : 0
  const skuPageUrl = `/sku/${item.sku}`

  const openSkuPage = () => router.push(skuPageUrl)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openSkuPage()
    }
  }

  const handleSkuCopy = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const success = await copyToClipboard(item.sku)
      if (success) {
        const skuMasked = item.sku.slice(-4)
        trackEvent("sku_copy", { skuMasked, source: "card-compact-pill" })
        setCopied(true)
        toast.success(`Copied SKU ${formatSkuForDisplay(item.sku)}`, {
          duration: 2000,
        })
        setTimeout(() => setCopied(false), 1500)
      } else {
        toast.error("Failed to copy SKU", { duration: 2000 })
      }
    },
    [item.sku]
  )

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openSkuPage}
      onKeyDown={handleKeyDown}
      className="rounded-lg border border-[var(--border-strong)] elevation-card p-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] group"
      aria-label={`View details for ${item.name} (SKU ${item.sku})`}
      aria-labelledby={`hot-item-${item.id}-name`}
    >
      <article>
        <div className="flex items-center justify-end mb-2">
          <span className="text-xs text-[var(--text-secondary)] font-medium flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={item.dateAdded}>{formatRelativeDate(item.dateAdded)}</time>
          </span>
        </div>
        <div className="flex gap-3 items-start">
          <Link
            href={skuPageUrl}
            aria-label={`View details for ${item.name}`}
            onClick={(e) => e.stopPropagation()}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
          >
            <PennyThumbnail src={item.imageUrl} alt={item.name} size={48} />
          </Link>
          <div className="min-w-0 flex-1 space-y-2">
            <Link
              href={skuPageUrl}
              onClick={(e) => e.stopPropagation()}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
            >
              <div className="space-y-2">
                {item.brand && (
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                    {item.brand}
                  </p>
                )}
                <h3
                  id={`hot-item-${item.id}-name`}
                  className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-[1.5] line-clamp-2 group-hover:text-[var(--cta-primary)] transition-colors"
                  title={item.name}
                >
                  {item.name}
                </h3>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleSkuCopy}
              className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2.5 py-1.5 rounded w-fit font-medium cursor-pointer hover:border-[var(--cta-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[36px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              aria-label={`Copy SKU ${item.sku} to clipboard`}
              title="Tap to copy SKU"
            >
              <span>SKU:</span>
              <span className="font-semibold">{formatSkuForDisplay(item.sku)}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--status-success)]" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              )}
            </button>
            {hasIdentifiers && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-muted)]">Identifiers:</span>
                {identifiers
                  .filter((identifier) => identifier.value)
                  .map((identifier) => (
                    <span key={identifier.label} className="flex items-center gap-1">
                      <span className="text-[var(--text-muted)]">{identifier.label}</span>
                      <span className="text-[var(--text-primary)] font-medium">
                        {identifier.value}
                      </span>
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
        {totalReports > 0 && (
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {totalReports} {totalReports === 1 ? "report" : "reports"} × {stateCount}{" "}
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
                  className="pill pill-strong"
                  aria-label={`${state}: ${count} ${count === 1 ? "report" : "reports"}`}
                >
                  {state} × {count}
                </span>
              ))}
            {Object.keys(item.locations).length > 5 && (
              <span className="px-2 py-1 text-[var(--text-muted)] text-xs font-medium">
                +{Object.keys(item.locations).length - 5} more
              </span>
            )}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              trackEvent("report_duplicate_click", {
                sku: item.sku,
                name: item.name,
                src: "card-compact",
              })
              router.push(
                buildReportFindUrl({ sku: item.sku, name: item.name, src: "card-compact" })
              )
            }}
            className="relative z-10 pointer-events-auto flex-1"
            aria-label={`Report finding ${item.name}`}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Report this find
          </Button>
          <span onClick={(e) => e.stopPropagation()}>
            <AddToListButton sku={item.sku} itemName={item.name} variant="icon" />
          </span>
        </div>
      </article>
    </div>
  )
}
