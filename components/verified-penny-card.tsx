"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { BadgeCheck, ImageOff, ExternalLink } from "lucide-react"
import { CopySkuButton } from "@/components/copy-sku-button"
import type { VerifiedPenny } from "@/lib/verified-pennies"
import { getLatestDateFromArray } from "@/lib/freshness-utils"

interface VerifiedPennyCardProps {
  item: VerifiedPenny
}

export function VerifiedPennyCard({ item }: VerifiedPennyCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasImage = item.imageUrl && item.imageUrl.startsWith("https://")
  const skuUrl = `/sku/${item.sku}`

  const latestDate = getLatestDateFromArray(item.purchaseDates)

  const latestDateLabel = latestDate
    ? new Date(`${latestDate}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        timeZone: "America/New_York",
      })
    : null

  return (
    <Link
      href={skuUrl}
      className="elevation-card border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full flex flex-col group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-labelledby={`verified-${item.sku}-name`}
    >
      <article className="flex flex-col h-full">
        {/* Product Image - Pinterest style prominent display */}
        <div className="relative aspect-square bg-[var(--bg-muted)] overflow-hidden">
          {hasImage && !imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageOff
                className="w-16 h-16 text-[var(--text-muted)]"
                aria-label="Image not available"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {item.brand && (
              <span
                className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide truncate"
                title={item.brand}
              >
                {item.brand}
              </span>
            )}
            <div className="flex flex-col gap-1 items-end">
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <BadgeCheck className="w-3 h-3" aria-hidden="true" />
                <span className="sr-only">Verified item</span>
                <span className="text-[var(--text-muted)]">Verified</span>
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            id={`verified-${item.sku}-name`}
            className="font-semibold text-base text-[var(--text-primary)] leading-snug truncate group-hover:text-[var(--cta-primary)] transition-colors"
            title={item.name}
          >
            {item.name}
          </h3>

          {latestDate && latestDateLabel && (
            <div className="text-xs text-[var(--text-muted)] mt-1">
              <span className="mr-1">Added on:</span>
              <time dateTime={latestDate} className="font-medium text-[var(--text-secondary)]">
                {latestDateLabel}
              </time>
            </div>
          )}

          {/* SKU with copy button */}
          <div
            className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2 py-1.5 rounded w-fit font-medium"
            onClick={(e) => e.preventDefault()}
          >
            <span className="select-all">SKU: {item.sku}</span>
            <CopySkuButton sku={item.sku} source="verified-card" />
          </div>

          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] pt-1 mt-auto">
            <span className="font-semibold text-[var(--status-success)]">$0.01</span>
            <span className="inline-flex items-center gap-1 text-xs" aria-hidden="true">
              View Details
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
