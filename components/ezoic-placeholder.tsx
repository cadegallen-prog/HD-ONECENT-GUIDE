"use client"

import { useEffect, useRef } from "react"
import { EZOIC_ENABLED, AD_MIN_HEIGHTS, type AdSlotId, type AdFormat } from "@/lib/ads"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface EzoicPlaceholderProps {
  /** Slot ID from AD_SLOTS - must match Ezoic dashboard */
  slotId: AdSlotId
  /** Ad format determines reserved height for CLS protection */
  format?: AdFormat
  /** Override min-height (pixels) */
  minHeight?: number
  /** Additional CSS classes */
  className?: string
  /** Format for mobile breakpoint (responsive ads) */
  mobileFormat?: AdFormat
}

interface EzoicInlineAdProps {
  /** Slot ID from AD_SLOTS */
  slotId: AdSlotId
  /** Additional CSS classes */
  className?: string
}

// Ezoic global type
interface EzStandalone {
  cmd: Array<() => void>
  define?: (...args: number[]) => void
  enable?: () => void
  display?: () => void
  refresh?: () => void
}

declare global {
  interface Window {
    ezstandalone?: EzStandalone
  }
}

// =============================================================================
// EZOIC PLACEHOLDER COMPONENT
// =============================================================================

/**
 * Ezoic ad placeholder with CLS protection.
 *
 * Features:
 * - Only renders when EZOIC_ENABLED is true (kill switch)
 * - Reserves space with min-height to prevent layout shift
 * - Uses ezstandalone.cmd.push pattern for SPA compatibility
 * - Supports responsive formats (different sizes on mobile/desktop)
 *
 * @example
 * <EzoicPlaceholder slotId={AD_SLOTS.HOME_TOP} format="leaderboard" />
 */
export function EzoicPlaceholder({
  slotId,
  format = "rectangle",
  minHeight,
  className = "",
  mobileFormat,
}: EzoicPlaceholderProps) {
  const hasInitialized = useRef(false)

  // Calculate heights for CLS protection
  const desktopHeight = minHeight ?? AD_MIN_HEIGHTS[format]
  const mobileHeight = mobileFormat ? AD_MIN_HEIGHTS[mobileFormat] : desktopHeight

  useEffect(() => {
    // Skip if ads disabled or already initialized
    if (!EZOIC_ENABLED) return
    if (hasInitialized.current) return
    if (typeof window === "undefined") return
    if (!window.ezstandalone?.cmd) return

    hasInitialized.current = true

    // Use Ezoic's command queue pattern for SPA compatibility
    window.ezstandalone.cmd.push(() => {
      // Define the placeholder slot
      if (window.ezstandalone?.define) {
        window.ezstandalone.define(slotId)
      }
      // Enable and display
      if (window.ezstandalone?.enable) {
        window.ezstandalone.enable()
      }
      if (window.ezstandalone?.display) {
        window.ezstandalone.display()
      }
    })

    // Cleanup on unmount (SPA navigation)
    return () => {
      hasInitialized.current = false
    }
  }, [slotId])

  // Kill switch - render nothing if ads disabled
  if (!EZOIC_ENABLED) return null

  return (
    <div
      id={`ezoic-pub-ad-placeholder-${slotId}`}
      className={`ezoic-ad-placeholder flex items-center justify-center bg-[var(--bg-muted)] rounded-lg border border-[var(--border-default)] overflow-hidden ${className}`}
      style={{
        // Mobile-first min-height
        minHeight: `${mobileHeight}px`,
        // CSS containment for performance
        contain: "layout style",
      }}
      data-ezoic-ad={slotId}
      aria-hidden="true"
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Skeleton placeholder while ad loads */}
      <span className="animate-pulse text-xs text-[var(--text-muted)] opacity-40 select-none">
        Ad
      </span>

      {/* Responsive height for desktop */}
      {mobileHeight !== desktopHeight && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media (min-width: 768px) {
                #ezoic-pub-ad-placeholder-${slotId} {
                  min-height: ${desktopHeight}px !important;
                }
              }
            `,
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// INLINE AD COMPONENT (FOR LIST INJECTION)
// =============================================================================

/**
 * Inline ad component for injecting between list items.
 *
 * Uses a compact style suitable for feeds/grids.
 * Designed to span full width in grid layouts.
 *
 * @example
 * // In a grid with col-span-full
 * <div className="col-span-full">
 *   <EzoicInlineAd slotId={AD_SLOTS.LIST_AFTER_N} />
 * </div>
 */
export function EzoicInlineAd({ slotId, className = "" }: EzoicInlineAdProps) {
  // Kill switch
  if (!EZOIC_ENABLED) return null

  return (
    <div className={`my-4 ${className}`}>
      <EzoicPlaceholder
        slotId={slotId}
        format="mobileLeaderboard"
        mobileFormat="mobileBanner"
        className="w-full"
      />
    </div>
  )
}
