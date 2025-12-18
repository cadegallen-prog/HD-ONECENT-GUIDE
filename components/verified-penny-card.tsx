"use client"

import Image from "next/image"
import { useState } from "react"
import type { KeyboardEvent } from "react"
import { BadgeCheck, ImageOff, ExternalLink } from "lucide-react"
import { CopySkuButton } from "@/components/copy-sku-button"
import type { VerifiedPenny } from "@/lib/verified-pennies"
import { getHomeDepotProductUrl } from "@/lib/home-depot"

interface VerifiedPennyCardProps {
  item: VerifiedPenny
}

export function VerifiedPennyCard({ item }: VerifiedPennyCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasImage = item.imageUrl && item.imageUrl.startsWith("https://")
  const homeDepotUrl = getHomeDepotProductUrl({
    sku: item.sku,
    internetNumber: item.internetNumber,
  })

  const openHomeDepot = () => {
    window.open(homeDepotUrl, "_blank", "noopener,noreferrer")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openHomeDepot()
    }
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Open Home Depot page for ${item.name} (SKU ${item.sku})`}
      onClick={openHomeDepot}
      onKeyDown={handleKeyDown}
      className="elevation-card border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full flex flex-col group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      aria-labelledby={`verified-${item.sku}-name`}
    >
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
          <span className="pill pill-muted inline-flex items-center gap-1 text-xs font-semibold">
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* Product Name */}
        <h3
          id={`verified-${item.sku}-name`}
          className="font-semibold text-base text-[var(--text-primary)] leading-snug truncate"
          title={item.name}
        >
          {item.name}
        </h3>

        {/* SKU with copy button */}
        <div
          className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2 py-1.5 rounded w-fit font-medium"
          onClickCapture={(event) => event.stopPropagation()}
          onKeyDownCapture={(event) => event.stopPropagation()}
        >
          <span className="select-all">SKU: {item.sku}</span>
          <CopySkuButton sku={item.sku} source="verified-card" />
        </div>

        {/* Model number if available */}
        {item.model && item.model !== item.sku && (
          <p className="text-xs text-[var(--text-muted)] truncate" title={item.model}>
            Model: {item.model}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] pt-1">
          <span className="font-semibold text-[var(--status-success)]">$0.01</span>
          <span className="inline-flex items-center gap-1 text-xs" aria-hidden="true">
            <ExternalLink className="w-4 h-4" />
            homedepot.com
          </span>
        </div>
      </div>
    </article>
  )
}
