"use client"

import { useEffect, useState } from "react"

interface MobileStickyAnchorProps {
  enabled: boolean
  collapsed?: boolean
  slotId?: string
}

export function MobileStickyAnchor({
  enabled,
  collapsed = false,
  slotId = "pc-mobile-sticky-anchor",
}: MobileStickyAnchorProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

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

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 sm:hidden ${
        collapsed ? "translate-y-full" : "translate-y-0"
      } ${prefersReducedMotion ? "" : "transition-transform duration-150 ease-out"}`}
      data-mobile-sticky-anchor="true"
    >
      <div className="flex justify-center px-2 pb-[calc(4px+env(safe-area-inset-bottom))]">
        <div
          id={slotId}
          className="pointer-events-auto h-[50px] w-[320px]"
          data-mobile-sticky-slot="true"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
