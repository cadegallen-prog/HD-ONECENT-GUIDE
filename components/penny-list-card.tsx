"use client"

import { useState, useCallback } from "react"
import { Calendar, PlusCircle, Copy, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { copyToClipboard } from "@/components/copy-sku-button"
import { AddToListButton } from "@/components/add-to-list-button"
import { BarcodeModal } from "@/components/barcode-modal"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import {
  formatRelativeDate,
  formatCurrency,
  formatLastSeen,
  formatLineB,
  normalizeProductName,
  normalizeBrand,
} from "@/lib/penny-list-utils"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { formatSkuForDisplay } from "@/lib/sku"
import { buildReportFindUrl } from "@/lib/report-find-link"
import { trackEvent } from "@/lib/analytics"
import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PennyListActionRow } from "@/components/penny-list-action-row"
import { StateBreakdownSheet } from "@/components/state-breakdown-sheet"

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

export function PennyListCard({ item, stateFilter, windowLabel, userState }: PennyListCardProps) {
  const router = useRouter()
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false)
  const [isStateBreakdownOpen, setIsStateBreakdownOpen] = useState(false)

  const displayBrand = normalizeBrand(item.brand)
  const displayName = normalizeProductName(item.name, { brand: item.brand })
  const upc = item.upc?.trim()
  const hasUpc = Boolean(upc)
  const skuPageUrl = `/sku/${item.sku}`
  const skuLine = displayBrand
    ? `${displayBrand} | SKU ${formatSkuForDisplay(item.sku)}`
    : `SKU ${formatSkuForDisplay(item.sku)}`

  const retailPrice =
    typeof item.retailPrice === "number" && item.retailPrice > 0 ? item.retailPrice : null
  const formattedPrice = formatCurrency(item.price)
  const formattedRetail = retailPrice ? formatCurrency(retailPrice) : null

  const resolvedWindowLabel = windowLabel?.trim() || "30d"
  const nowMs = Date.now()
  const lastSeenLabel = formatLastSeen(item.lastSeenAt ?? item.dateAdded, nowMs)
  const lineB = formatLineB({
    locations: item.locations,
    stateFilter,
    windowLabel: resolvedWindowLabel,
  })

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
      className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] transition-colors hover:border-[var(--border-strong)] h-full flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-label={`View details for ${item.name} (SKU ${item.sku})`}
      aria-labelledby={`item-${item.id}-name`}
    >
      <article className="flex flex-col h-full">
        <div className="p-3 flex flex-col flex-1 space-y-3">
          <div className="flex gap-3 items-start">
            <PennyThumbnail src={item.imageUrl} alt={displayName} size={72} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs text-[var(--text-muted)] font-medium truncate">{skuLine}</p>
              <h3
                id={`item-${item.id}-name`}
                className="text-base sm:text-lg font-medium text-[var(--text-primary)] leading-[1.5] line-clamp-2-table"
                title={displayName}
              >
                {displayName}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <p className="text-[28px] font-semibold text-[var(--text-primary)]">{formattedPrice}</p>
            {formattedRetail && (
              <p className="text-xs text-[var(--text-muted)]">
                Retail <span className="line-through">{formattedRetail}</span>
              </p>
            )}
          </div>

          <div className="space-y-1 text-xs text-[var(--text-muted)]">
            <p>{lastSeenLabel}</p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setIsStateBreakdownOpen(true)
              }}
              className="text-left text-[var(--cta-primary)] underline decoration-[var(--cta-primary)] underline-offset-2 hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              aria-label={`View state breakdown for ${displayName}`}
            >
              {lineB}
            </button>
          </div>

          <PennyListActionRow
            sku={item.sku}
            itemName={item.name}
            upc={upc}
            homeDepotUrl={item.homeDepotUrl}
            internetNumber={item.internetNumber}
            reportSource="card"
            homeDepotSource="penny-list-card"
            onBarcodeOpen={() => setIsBarcodeOpen(true)}
          />
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
  const stateCount = item.locations ? Object.keys(item.locations).length : 0
  const skuPageUrl = `/sku/${item.sku}`

  const retailPrice = typeof item.retailPrice === "number" ? item.retailPrice : null
  const compactSavings =
    retailPrice && retailPrice > item.price ? Number((retailPrice - item.price).toFixed(2)) : 0
  const compactHasSavings = Boolean(retailPrice && compactSavings > 0)
  const compactFormattedPrice = formatCurrency(item.price)
  const compactFormattedRetail = retailPrice ? formatCurrency(retailPrice) : null
  const compactFormattedSavings = compactHasSavings ? formatCurrency(compactSavings) : null

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
            <time dateTime={item.lastSeenAt ?? item.dateAdded}>
              {formatRelativeDate(item.lastSeenAt ?? item.dateAdded)}
            </time>
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
                {displayBrand && (
                  <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
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
            <p className="text-base font-semibold text-[var(--status-success)]">
              {compactFormattedPrice}
            </p>
          </div>
          {compactFormattedRetail && (
            <div className="flex flex-col gap-1">
              <span className="text-[var(--text-muted)]">Retail</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {compactFormattedRetail}
              </span>
              {compactHasSavings && compactFormattedSavings && (
                <span className="text-[var(--cta-primary)]">Save {compactFormattedSavings}</span>
              )}
            </div>
          )}
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
            className="relative z-10 pointer-events-auto flex-1 min-h-[44px]"
            aria-label={`Report finding ${item.name}`}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Report this find
          </Button>
          <BookmarkAction sku={item.sku} itemName={item.name} />
        </div>
      </article>
    </div>
  )
}
