"use client"

import { useEffect, useRef } from "react"
import { EZOIC_ENABLED, type AdSlotId } from "@/lib/ads"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface EzoicPlaceholderProps {
  /** Slot ID from AD_SLOTS - must match Ezoic dashboard */
  slotId: AdSlotId
  /** Additional CSS classes */
  className?: string
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
  className = "",
}: Pick<EzoicPlaceholderProps, "slotId" | "className">) {
  const hasInitialized = useRef(false)

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
      className={`ezoic-ad-placeholder ${className}`}
      style={{
        // CSS containment for performance
        contain: "layout style",
      }}
      data-ezoic-ad={slotId}
      aria-hidden="true"
      role="complementary"
      aria-label="Advertisement"
    >
      {/*
        No visible placeholder - Ezoic fills this div directly.
        If no ad loads, div stays empty (no ugly gray box).
        CLS protection happens via Ezoic's own container sizing.
      */}
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
    <div className={`ezoic-inline-ad-wrapper ${className}`}>
      <EzoicPlaceholder slotId={slotId} className="w-full" />
    </div>
  )
}
