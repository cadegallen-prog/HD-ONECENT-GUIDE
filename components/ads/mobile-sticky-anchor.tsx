"use client"

import { useEffect, useState } from "react"
import {
  getMonumetricSlotPolicy,
  MONUMETRIC_LAUNCH_CONFIG,
  MONUMETRIC_MOBILE_STICKY_SLOT_ID,
} from "@/lib/ads/launch-config"
import { useMonumetricSlotCollapse } from "@/lib/ads/monumetric-slot-shell"

interface MobileStickyAnchorProps {
  enabled: boolean
  collapsed?: boolean
  slotId?: string
}

export function MobileStickyAnchor({
  enabled,
  collapsed = false,
  slotId = MONUMETRIC_MOBILE_STICKY_SLOT_ID,
}: MobileStickyAnchorProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const stickyPolicy = getMonumetricSlotPolicy(slotId)
  const slotCollapseAfterMs = stickyPolicy?.collapseAfterMs ?? 7000
  const reserveMinHeightPx = stickyPolicy?.reserveMinHeightPx ?? 50
  const collapsedByEmptySlot = useMonumetricSlotCollapse({
    enabled,
    slotDomId: slotId,
    collapseEnabled: MONUMETRIC_LAUNCH_CONFIG.slotShell.collapseEmptyEnabled,
    collapseAfterMs: slotCollapseAfterMs,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncMotionPreference()
    mediaQuery.addEventListener("change", syncMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference)
    }
  }, [])

  if (!enabled) return null

  const shouldCollapse =
    collapsed || (MONUMETRIC_LAUNCH_CONFIG.slotShell.collapseEmptyEnabled && collapsedByEmptySlot)

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 sm:hidden ${
        shouldCollapse ? "translate-y-full" : "translate-y-0"
      } ${prefersReducedMotion ? "" : "transition-transform duration-150 ease-out"}`}
      data-mobile-sticky-anchor="true"
      data-mobile-sticky-collapsed={shouldCollapse ? "true" : "false"}
    >
      <div className="flex justify-center px-2 pb-[calc(4px+env(safe-area-inset-bottom))]">
        <div
          id={slotId}
          className="pointer-events-auto w-[320px] overflow-hidden"
          data-mobile-sticky-slot="true"
          aria-hidden="true"
          style={{
            minHeight: shouldCollapse ? 0 : reserveMinHeightPx,
          }}
        />
      </div>
    </div>
  )
}
