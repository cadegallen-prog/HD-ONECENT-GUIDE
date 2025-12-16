"use client"

import Image from "next/image"
import { useState } from "react"
import { BadgeCheck, ImageOff } from "lucide-react"
import { CopySkuButton } from "@/components/copy-sku-button"
import type { VerifiedPenny } from "@/lib/verified-pennies"

interface VerifiedPennyCardProps {
  item: VerifiedPenny
}

export function VerifiedPennyCard({ item }: VerifiedPennyCardProps) {
  const [imageError, setImageError] = useState(false)
  const hasImage = item.imageUrl && item.imageUrl.startsWith("https://")

  return (
    <article
      className="elevation-card border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full flex flex-col group"
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
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
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

        {/* Verified Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--status-success)] text-[var(--cta-text)] text-xs font-semibold shadow-md">
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--cta-primary)] text-[var(--cta-text)] text-sm font-bold shadow-md">
            $0.01
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        {/* Brand */}
        {item.brand && (
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
            {item.brand}
          </span>
        )}

        {/* Product Name */}
        <h3
          id={`verified-${item.sku}-name`}
          className="font-semibold text-base text-[var(--text-primary)] leading-snug line-clamp-2 flex-1"
        >
          {item.name}
        </h3>

        {/* SKU with copy button */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2 py-1.5 rounded w-fit font-medium">
          <span className="select-all">SKU: {item.sku}</span>
          <CopySkuButton sku={item.sku} source="verified-card" />
        </div>

        {/* Model number if available */}
        {item.model && item.model !== item.sku && (
          <p className="text-xs text-[var(--text-muted)]">Model: {item.model}</p>
        )}
      </div>
    </article>
  )
}
