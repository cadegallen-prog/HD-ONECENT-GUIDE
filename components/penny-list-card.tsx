"use client"

import { useState, useCallback } from "react"
import { Calendar, PlusCircle, Copy, Check, Barcode, ExternalLink } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { copyToClipboard } from "@/components/copy-sku-button"
import { AddToListButton } from "@/components/add-to-list-button"
import { BarcodeModal } from "@/components/barcode-modal"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import {
  formatRelativeDate,
  formatCurrency,
  normalizeProductName,
  normalizeBrand,
} from "@/lib/penny-list-utils"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { formatSkuForDisplay } from "@/lib/sku"
import { buildReportFindUrl } from "@/lib/report-find-link"
import { getHomeDepotProductUrl } from "@/lib/home-depot"
import { trackEvent } from "@/lib/analytics"
import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StateBreakdownSheet } from "@/components/state-breakdown-sheet"
import { toPennyListThumbnailUrl } from "@/lib/image-cache"

interface PennyListCardProps {
  item: PennyItem & { parsedDate?: Date | null }
  stateFilter?: string
  windowLabel?: string
  userState?: string
}

// Get total reports across all states
function getTotalReports(locations: Record<string, number>): number {
  return Object.values(locations).reduce((sum, count) => sum + count, 0)
}

interface BookmarkActionProps {
  sku: string
  itemName: string
}

function BookmarkAction({ sku, itemName }: BookmarkActionProps) {
  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)] pointer-events-auto"
      data-bookmark-action="true"
    >
      <AddToListButton
        sku={sku}
        itemName={itemName}
        variant="icon"
        className="min-h-[44px] min-w-[44px]"
      />
    </div>
  )
}

export function PennyListCard({ item, windowLabel, userState }: PennyListCardProps) {
  const router = useRouter()
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false)
  const [isStateBreakdownOpen, setIsStateBreakdownOpen] = useState(false)

  const displayBrand = normalizeBrand(item.brand)
  const displayName = normalizeProductName(item.name, { brand: item.brand })
  const upc = item.upc?.trim()
  const hasUpc = Boolean(upc)
  const skuPageUrl = `/sku/${item.sku}`
  const retailPrice =
    typeof item.retailPrice === "number" && item.retailPrice > 0 ? item.retailPrice : null
  const formattedPrice = formatCurrency(item.price)
  const formattedRetail = retailPrice ? formatCurrency(retailPrice) : null
  // Home Depot URL resolution - always available via SKU fallback (matches SKU detail page behavior)
  const resolvedHomeDepotUrl = getHomeDepotProductUrl({
    sku: item.sku,
    homeDepotUrl: item.homeDepotUrl ?? undefined,
    internetNumber: item.internetNumber ?? undefined,
  })

  const resolvedWindowLabel = windowLabel?.trim() || "30d"
  const lastSeenValue = item.lastSeenAt ?? item.dateAdded
  const lastSeenTitle = (() => {
    const parsed = new Date(lastSeenValue)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/New_York",
    })
  })()
  // lineB is unused but kept for potential future use
  const thumbnailSrc = item.imageUrl ? toPennyListThumbnailUrl(item.imageUrl) : item.imageUrl
  const totalReports = item.locations ? getTotalReports(item.locations) : 0

  const openSkuPage = () => router.push(skuPageUrl)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openSkuPage()
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openSkuPage}
      onKeyDown={handleKeyDown}
      className="rounded-2xl glass-card h-full flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-label={`View details for ${item.name} (SKU ${item.sku})`}
      aria-labelledby={`item-${item.id}-name`}
    >
      <article className="flex flex-col h-full relative">
        {/* Status only (recency) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[11px] text-[var(--text-muted)] pointer-events-none">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <time dateTime={lastSeenValue} title={lastSeenTitle ?? undefined}>
            {formatRelativeDate(lastSeenValue)}
          </time>
        </div>

        <div className="p-2.5 flex flex-col flex-1 space-y-2">
          {/* Tier 1 + 2: Image + Brand + Name + SKU */}
          <div className="flex gap-2.5 items-start pr-9">
            <PennyThumbnail src={thumbnailSrc} alt={displayName} size={64} />
            <div className="flex-1 space-y-1">
              {/* Brand (small) */}
              {displayBrand && (
                <p className="penny-card-brand whitespace-nowrap -ml-[74px]">{displayBrand}</p>
              )}

              {/* Name (2 lines) */}
              <h3
                id={`item-${item.id}-name`}
                className="penny-card-name line-clamp-2-table"
                title={displayName}
              >
                {displayName}
              </h3>

              {/* SKU badge (compact pill) */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-recessed)] px-2 py-0.5 text-[11px] font-mono text-[var(--text-secondary)]">
                  SKU {formatSkuForDisplay(item.sku)}
                </span>
              </div>
            </div>
          </div>

          {/* Tier 3: Price Block */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="penny-card-price text-[var(--text-primary)]">{formattedPrice}</span>
              {formattedRetail && (
                <span className="text-sm text-[var(--text-muted)]">
                  Retail{" "}
                  <span className="line-through text-[var(--price-strike)]">{formattedRetail}</span>
                </span>
              )}
            </div>
          </div>

          {/* Tier 4: State + report info */}
          {item.locations && Object.keys(item.locations).length > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setIsStateBreakdownOpen(true)
              }}
              className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
              aria-label={`View state breakdown for ${displayName}`}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {Object.entries(item.locations)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4)
                  .map(([state]) => (
                    <span
                      key={`${item.id}-${state}`}
                      className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-recessed)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]"
                    >
                      {state}
                    </span>
                  ))}
                {Object.keys(item.locations).length > 4 && (
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                    +{Object.keys(item.locations).length - 4}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                {totalReports} {totalReports === 1 ? "report" : "reports"} total
              </p>
            </button>
          )}

          {/* Tier 5: Actions - Report (full-width primary), then HD + Barcode row */}
          <div className="space-y-2" onClick={(event) => event.stopPropagation()}>
            {/* Row 1: Full-width Report button (primary action) */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={(event) => {
                event.preventDefault()
                trackEvent("report_duplicate_click", {
                  sku: item.sku,
                  name: item.name,
                  src: "card",
                })
                router.push(buildReportFindUrl({ sku: item.sku, name: item.name, src: "card" }))
              }}
              className="w-full min-h-[40px]"
              aria-label={`Report finding ${item.name}`}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Report Find
            </Button>

            {/* Row 2: Secondary actions (HD always shows via SKU fallback, Barcode only if UPC exists) */}
            <div className="flex gap-1.5">
              <a
                href={resolvedHomeDepotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[36px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs font-semibold transition-colors hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                aria-label={`Open Home Depot page for ${item.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  trackEvent("home_depot_click", {
                    skuMasked: item.sku.slice(-4),
                    source: "penny-list-card",
                  })
                }}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Home Depot</span>
              </a>
              {hasUpc && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsBarcodeOpen(true)
                  }}
                  className="flex items-center justify-center gap-1.5 min-h-[36px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs font-semibold transition-colors hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  aria-label={`Show barcode for ${item.name}`}
                >
                  <Barcode className="w-4 h-4" aria-hidden="true" />
                  <span>Barcode</span>
                </button>
              )}
              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <AddToListButton
                  sku={item.sku}
                  itemName={item.name}
                  variant="icon"
                  className="min-h-[36px] min-w-[36px]"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
      <BarcodeModal
        open={isBarcodeOpen && hasUpc}
        upc={upc || ""}
        onClose={() => setIsBarcodeOpen(false)}
        productName={displayName}
        pennyPrice={item.price}
      />
      <StateBreakdownSheet
        open={isStateBreakdownOpen}
        onClose={() => setIsStateBreakdownOpen(false)}
        stateCounts={item.locations}
        windowLabel={resolvedWindowLabel}
        userState={userState}
      />
    </div>
  )
}

export function PennyListCardCompact({ item }: PennyListCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  // Normalize display values
  const displayBrand = normalizeBrand(item.brand)
  const displayName = normalizeProductName(item.name, { brand: item.brand })
  const identifiers = [
    { label: "Model", value: item.modelNumber },
    { label: "UPC", value: item.upc },
  ]
  const hasIdentifiers = identifiers.some((identifier) => identifier.value)

  const totalReports = item.locations ? getTotalReports(item.locations) : 0
  const skuPageUrl = `/sku/${item.sku}`
  const resolvedHomeDepotUrl = getHomeDepotProductUrl({
    sku: item.sku,
    homeDepotUrl: item.homeDepotUrl ?? undefined,
    internetNumber: item.internetNumber ?? undefined,
  })

  const retailPrice = typeof item.retailPrice === "number" ? item.retailPrice : null
  const compactFormattedPrice = formatCurrency(item.price)
  const compactFormattedRetail = retailPrice ? formatCurrency(retailPrice) : null
  const thumbnailSrc = item.imageUrl ? toPennyListThumbnailUrl(item.imageUrl) : item.imageUrl

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
          <span className="text-[11px] text-[var(--text-muted)] font-medium flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={item.lastSeenAt ?? item.dateAdded}>
              {formatRelativeDate(item.lastSeenAt ?? item.dateAdded)}
            </time>
          </span>
        </div>
        <div className="flex gap-3 items-start">
          <Link
            href={skuPageUrl}
            prefetch={false}
            aria-label={`View details for ${item.name}`}
            onClick={(e) => e.stopPropagation()}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
          >
            <PennyThumbnail src={thumbnailSrc} alt={item.name} size={48} />
          </Link>
          <div className="min-w-0 flex-1 space-y-2">
            <Link
              href={skuPageUrl}
              prefetch={false}
              onClick={(e) => e.stopPropagation()}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
            >
              <div className="space-y-2">
                {displayBrand && (
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] -ml-[60px] w-fit">
                    {displayBrand}
                  </p>
                )}
                <h3
                  id={`hot-item-${item.id}-name`}
                  className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-[1.5] line-clamp-2 group-hover:text-[var(--cta-primary)] transition-colors"
                  title={displayName}
                >
                  {displayName}
                </h3>
              </div>
            </Link>
            <button
              type="button"
              onClick={handleSkuCopy}
              className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2.5 py-1.5 rounded w-fit font-medium cursor-pointer hover:border-[var(--cta-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] flex-shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              aria-label={`Copy SKU ${item.sku} to clipboard`}
              title="Tap to copy SKU"
            >
              <span>SKU:</span>
              <span className="font-semibold whitespace-nowrap">
                {formatSkuForDisplay(item.sku)}
              </span>
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
        <div className="mt-2 flex flex-wrap items-end gap-3 text-xs">
          <div>
            <p className="text-[var(--text-muted)]">Penny price</p>
            <p className="penny-card-price text-[var(--text-primary)]">{compactFormattedPrice}</p>
          </div>
          {compactFormattedRetail && (
            <div className="flex flex-col gap-1">
              <span className="text-[var(--text-muted)]">Retail</span>
              <span className="text-sm font-semibold text-[var(--price-strike)] line-through">
                {compactFormattedRetail}
              </span>
            </div>
          )}
        </div>
        {item.locations && Object.keys(item.locations).length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="States with reports">
              {Object.entries(item.locations)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([state]) => (
                  <span
                    key={`${item.id}-${state}`}
                    role="listitem"
                    className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-recessed)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]"
                  >
                    {state}
                  </span>
                ))}
              {Object.keys(item.locations).length > 4 && (
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                  +{Object.keys(item.locations).length - 4}
                </span>
              )}
            </div>
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              {totalReports} {totalReports === 1 ? "report" : "reports"} total
            </p>
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
            className="relative z-10 pointer-events-auto flex-1 min-h-[44px]"
            aria-label={`Report finding ${item.name}`}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Report this find
          </Button>
          <a
            href={resolvedHomeDepotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            aria-label={`Open Home Depot page for ${item.name}`}
            title="Home Depot"
            onClick={(event) => {
              event.stopPropagation()
              trackEvent("home_depot_click", {
                skuMasked: item.sku.slice(-4),
                source: "penny-list-hot-card",
              })
            }}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline text-xs font-medium text-[var(--text-secondary)]">
              Home Depot
            </span>
          </a>
          <BookmarkAction sku={item.sku} itemName={item.name} />
        </div>
      </article>
    </div>
  )
}
