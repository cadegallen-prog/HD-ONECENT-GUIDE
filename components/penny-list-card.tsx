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
  const [copiedSku, setCopiedSku] = useState(false)

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

  const handleSkuCopy = useCallback(
    async (e?: MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      const success = await copyToClipboard(item.sku)
      if (success) {
        const skuMasked = item.sku.slice(-4)
        trackEvent("sku_copy", { skuMasked, ui_source: "card-sku-pill" })
        setCopiedSku(true)
        toast.success(`Copied SKU ${formatSkuForDisplay(item.sku)}`, {
          duration: 1500,
        })
        setTimeout(() => setCopiedSku(false), 1500)
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
      className="rounded-2xl glass-card h-full flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-label={`View details for ${item.name} (SKU ${item.sku})`}
      aria-labelledby={`item-${item.id}-name`}
    >
      <article className="flex flex-col h-full relative">
        <div className="p-4 flex flex-col flex-1 space-y-3">
          {/* Tier 1 + 2: Image + Brand + Name + SKU */}
          <div className="flex gap-2.5 items-start">
            <PennyThumbnail src={thumbnailSrc} alt={displayName} size={72} />
            <div className="flex-1 min-w-0 space-y-1 overflow-hidden">
              {/* Brand */}
              {displayBrand && (
                <p
                  className="text-xs font-normal text-[var(--text-muted)] uppercase truncate max-w-[70%]"
                  title={displayBrand}
                  data-testid="penny-card-brand"
                >
                  {displayBrand}
                </p>
              )}

              {/* Name (2 lines) */}
              <h3
                id={`item-${item.id}-name`}
                className="penny-card-name line-clamp-2-table"
                title={displayName}
              >
                {displayName}
              </h3>
            </div>
          </div>

          {/* Tier 3: Price Block */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="penny-card-price">{formattedPrice}</span>
            {formattedRetail && (
              <span className="text-[13px] font-normal text-[var(--text-muted)] line-through">
                {formattedRetail}
              </span>
            )}
          </div>

          {/* Tier 4: Pattern Signals (SKU + recency + reports + states) */}
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            {/* SKU (moved from Block 1) */}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                handleSkuCopy(event)
              }}
              className={`penny-card-sku ${copiedSku ? "copied" : ""}`}
              aria-label={`Copy SKU ${formatSkuForDisplay(item.sku)}`}
              title="Click to copy SKU"
              data-test="penny-card-sku"
            >
              SKU {formatSkuForDisplay(item.sku)}
              {copiedSku && (
                <Check
                  className="inline w-3 h-3 ml-1 text-[var(--status-success)]"
                  aria-hidden="true"
                />
              )}
            </button>

            <p className="font-medium">
              Last seen:{" "}
              <time dateTime={lastSeenValue} title={lastSeenTitle ?? undefined}>
                {formatRelativeDate(lastSeenValue)}
              </time>
            </p>
            <p>
              {totalReports} {totalReports === 1 ? "report" : "reports"}
              {" · "}
              {item.locations && Object.keys(item.locations).length > 0
                ? (() => {
                    const stateCount = Object.keys(item.locations).length
                    const userStateInLocations = userState && item.locations[userState]
                    if (userStateInLocations) {
                      return `${userState} + ${stateCount - 1} ${stateCount - 1 === 1 ? "state" : "states"}`
                    }
                    return `${stateCount} ${stateCount === 1 ? "state" : "states"}`
                  })()
                : "State data unavailable"}
            </p>
          </div>

          {/* Tier 4b: State Chips (text, tappable) */}
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
                      className="inline-flex items-center text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--chip-muted-surface)] border border-[var(--chip-muted-border)] px-1.5 py-0.5 rounded"
                    >
                      {state}
                    </span>
                  ))}
                {Object.keys(item.locations).length > 4 && (
                  <span className="inline-flex items-center text-[11px] font-medium text-[var(--text-muted)] bg-[var(--chip-muted-surface)] border border-[var(--chip-muted-border)] px-1.5 py-0.5 rounded">
                    +{Object.keys(item.locations).length - 4}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Tier 5: Actions */}
          <div className="space-y-2" onClick={(event) => event.stopPropagation()}>
            {/* Primary: Report Find (full-width) */}
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
              className="w-full min-h-[44px] rounded-[10px] text-sm font-semibold"
              aria-label={`Report finding ${item.name}`}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Report Find
            </Button>

            {/* Secondary: icon-only, no borders */}
            <div className="flex justify-center gap-2.5">
              <a
                href={resolvedHomeDepotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-recessed)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                aria-label={`Open Home Depot page for ${item.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  trackEvent("home_depot_click", {
                    skuMasked: item.sku.slice(-4),
                    ui_source: "penny-list-card",
                  })
                }}
              >
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
              </a>
              {hasUpc && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsBarcodeOpen(true)
                  }}
                  className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-recessed)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  aria-label={`Show barcode for ${item.name}`}
                >
                  <Barcode className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
              <AddToListButton
                sku={item.sku}
                itemName={item.name}
                variant="icon"
                className="min-h-[44px] min-w-[44px] text-[var(--text-muted)] hover:bg-[var(--bg-recessed)] hover:text-[var(--text-primary)]"
              />
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
        trackEvent("sku_copy", { skuMasked, ui_source: "card-compact-pill" })
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
                  <p
                    className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-normal truncate max-w-[70%]"
                    title={displayBrand}
                    data-testid="penny-card-brand-compact"
                  >
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
        {/* SKU (moved to metadata area) */}
        <button
          type="button"
          onClick={handleSkuCopy}
          className="mt-3 flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2.5 py-1.5 rounded w-fit font-medium cursor-pointer hover:border-[var(--cta-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[44px] flex-shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          aria-label={`Copy SKU ${item.sku} to clipboard`}
          title="Tap to copy SKU"
        >
          <span>SKU:</span>
          <span className="font-semibold whitespace-nowrap">{formatSkuForDisplay(item.sku)}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[var(--status-success)]" aria-hidden="true" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
          )}
        </button>
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
                    className="inline-flex items-center text-[11px] font-semibold text-[var(--text-secondary)]"
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
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-lg text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            aria-label={`Open Home Depot page for ${item.name}`}
            title="Home Depot"
            onClick={(event) => {
              event.stopPropagation()
              trackEvent("home_depot_click", {
                skuMasked: item.sku.slice(-4),
                ui_source: "penny-list-hot-card",
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
