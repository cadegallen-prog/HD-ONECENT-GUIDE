"use client"

import type { SyntheticEvent } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Barcode, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddToListButton } from "@/components/add-to-list-button"
import { buildReportFindUrl } from "@/lib/report-find-link"
import { trackEvent } from "@/lib/analytics"
import { getHomeDepotProductUrl } from "@/lib/home-depot"

interface PennyListActionRowProps {
  sku: string
  itemName: string
  upc?: string | null
  homeDepotUrl?: string | null
  internetNumber?: string | null
  reportSource: string
  homeDepotSource: string
  onBarcodeOpen?: () => void
  stopPropagation?: boolean
}

export function PennyListActionRow({
  sku,
  itemName,
  upc,
  homeDepotUrl,
  internetNumber,
  reportSource,
  homeDepotSource,
  onBarcodeOpen,
  stopPropagation = true,
}: PennyListActionRowProps) {
  const router = useRouter()
  const trimmedUpc = upc?.trim()
  const hasUpc = Boolean(trimmedUpc)
  // Home Depot URL - always available via SKU fallback (matches SKU detail page behavior)
  const resolvedHomeDepotUrl = getHomeDepotProductUrl({
    sku,
    homeDepotUrl: homeDepotUrl ?? undefined,
    internetNumber: internetNumber ?? undefined,
  })

  const stopEvent = (event: SyntheticEvent) => {
    if (stopPropagation) {
      event.stopPropagation()
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      onClick={stopEvent}
      onKeyDown={stopEvent}
      aria-label="Item actions"
    >
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={(event) => {
          event.preventDefault()
          stopEvent(event)
          trackEvent("report_duplicate_click", {
            ui_source: reportSource,
            skuMasked: sku.slice(-4),
            hasItemName: Boolean(itemName),
          })
          router.push(buildReportFindUrl({ sku, name: itemName, src: reportSource }))
        }}
        className="relative z-10 pointer-events-auto min-h-[44px] px-3 text-sm leading-snug whitespace-normal text-left"
        aria-label={`Report finding ${itemName}`}
      >
        <PlusCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
        Report
      </Button>
      <div className="flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)]">
        <AddToListButton
          sku={sku}
          itemName={itemName}
          variant="icon"
          className="min-h-[44px] min-w-[44px]"
        />
        <span className="hidden sm:inline">Save</span>
      </div>
      {hasUpc && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            stopEvent(event)
            onBarcodeOpen?.()
          }}
          className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          aria-label={`Show barcode for ${itemName}`}
          title="Barcode"
        >
          <Barcode className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline">
            Barcode
          </span>
        </button>
      )}
      <a
        href={resolvedHomeDepotUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        aria-label={`Open Home Depot page for ${itemName}`}
        title="Home Depot"
        onClick={(event) => {
          stopEvent(event)
          trackEvent("home_depot_click", { skuMasked: sku.slice(-4), ui_source: homeDepotSource })
        }}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:inline">
          Home Depot
        </span>
      </a>
    </div>
  )
}
