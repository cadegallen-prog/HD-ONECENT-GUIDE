"use client"

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import {
  formatCurrency,
  formatLastSeen,
  formatLineB,
  normalizeBrand,
  normalizeProductName,
} from "@/lib/penny-list-utils"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import type { PennyItem } from "@/lib/fetch-penny-data"
import type { SortOption } from "./penny-list-filters"
import { formatSkuForDisplay } from "@/lib/sku"
import { BarcodeModal } from "@/components/barcode-modal"
import { PennyListActionRow } from "@/components/penny-list-action-row"
import { StateBreakdownSheet } from "@/components/state-breakdown-sheet"

interface PennyListTableProps {
  items: (PennyItem & { parsedDate?: Date | null })[]
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
  stateFilter?: string
  windowLabel?: string
  userState?: string
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
      type="button"
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

export function PennyListTable({
  items,
  sortOption,
  onSortChange,
  stateFilter,
  windowLabel,
  userState,
}: PennyListTableProps) {
  const router = useRouter()
  const [barcodeItem, setBarcodeItem] = useState<{
    upc: string
    name: string
    price: number
  } | null>(null)
  const [stateSheetItem, setStateSheetItem] = useState<PennyItem | null>(null)
  const resolvedWindowLabel = windowLabel?.trim() || "30d"
  const nowMs = Date.now()

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden">
      {/* Mobile scroll hint */}
      <div className="lg:hidden px-4 py-2 bg-[var(--bg-hover)] border-b border-[var(--border-default)] text-xs text-[var(--text-muted)] text-center">
         Scroll horizontally to see all columns 
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm table-fixed min-w-[880px] penny-list-table"
          role="table"
          aria-label="Penny list items"
        >
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[36%]" />
            <col className="w-[15%]" />
            <col className="w-[24%]" />
            <col className="w-[15%]" />
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
                  Item
                </SortButton>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                Price
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                <div className="flex flex-col gap-1">
                  <SortButton column="most-reports" currentSort={sortOption} onSort={onSortChange}>
                    Reports
                  </SortButton>
                  <SortButton column="newest" currentSort={sortOption} onSort={onSortChange}>
                    Last seen
                  </SortButton>
                </div>
              </th>
              <th
                scope="col"
                className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const displayBrand = normalizeBrand(item.brand)
              const displayName = normalizeProductName(item.name, { brand: item.brand })
              const skuLine = displayBrand
                ? `${displayBrand} | SKU ${formatSkuForDisplay(item.sku)}`
                : `SKU ${formatSkuForDisplay(item.sku)}`
              const retailPrice =
                typeof item.retailPrice === "number" && item.retailPrice > 0
                  ? item.retailPrice
                  : null
              const formattedPrice = formatCurrency(item.price)
              const formattedRetail = retailPrice ? formatCurrency(retailPrice) : null
              const lastSeenLabel = formatLastSeen(item.lastSeenAt ?? item.dateAdded, nowMs)
              const lineB = formatLineB({
                locations: item.locations,
                stateFilter,
                windowLabel: resolvedWindowLabel,
              })
              const upc = item.upc?.trim()
              const skuPageUrl = `/sku/${item.sku}`

              const openSkuPage = () => router.push(skuPageUrl)

              const handleRowKeyDown = (event: ReactKeyboardEvent<HTMLTableRowElement>) => {
                if (event.currentTarget !== event.target) return
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openSkuPage()
                }
              }

              return (
                <tr
                  key={item.id}
                  tabIndex={0}
                  aria-label={`View details for ${displayName} (SKU ${item.sku})`}
                  onClick={openSkuPage}
                  onKeyDown={handleRowKeyDown}
                  className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] focus-visible:outline-offset-2"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-4 align-top">
                    <PennyThumbnail src={item.imageUrl} alt={displayName} size={72} />
                  </td>
                  {/* Item */}
                  <td className="px-4 py-4 align-top min-w-0">
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-muted)] font-medium">{skuLine}</p>
                      <p
                        className="text-base font-semibold text-[var(--text-primary)] leading-[1.5] line-clamp-2-table"
                        title={displayName}
                      >
                        {displayName}
                      </p>
                    </div>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1">
                      <p className="text-[28px] font-semibold text-[var(--text-primary)]">
                        {formattedPrice}
                      </p>
                      {formattedRetail && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Retail <span className="line-through">{formattedRetail}</span>
                        </p>
                      )}
                    </div>
                  </td>
                  {/* Pattern signals */}
                  <td className="px-4 py-4 align-top">
                    <div className="space-y-1 text-xs text-[var(--text-muted)]">
                      <p>{lastSeenLabel}</p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setStateSheetItem(item)
                        }}
                        className="text-left text-[var(--cta-primary)] underline decoration-[var(--cta-primary)] underline-offset-2 hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                        aria-label={`View state breakdown for ${displayName}`}
                      >
                        {lineB}
                      </button>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4 align-top">
                    <PennyListActionRow
                      sku={item.sku}
                      itemName={item.name}
                      upc={upc}
                      homeDepotUrl={item.homeDepotUrl}
                      internetNumber={item.internetNumber}
                      reportSource="table"
                      homeDepotSource="penny-list-table"
                      onBarcodeOpen={() => {
                        if (!upc) return
                        setBarcodeItem({ upc, name: displayName, price: item.price })
                      }}
                    />
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

      <BarcodeModal
        open={Boolean(barcodeItem?.upc)}
        upc={barcodeItem?.upc ?? ""}
        onClose={() => setBarcodeItem(null)}
        productName={barcodeItem?.name}
        pennyPrice={barcodeItem?.price}
      />
      <StateBreakdownSheet
        open={Boolean(stateSheetItem)}
        onClose={() => setStateSheetItem(null)}
        stateCounts={stateSheetItem?.locations}
        windowLabel={resolvedWindowLabel}
        userState={userState}
      />
    </div>
  )
}
