"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, FilePlus, Heart, SlidersHorizontal } from "lucide-react"
import { TrackableLink } from "@/components/trackable-link"

interface PennyListMobileUtilityBarProps {
  isFilterSheetOpen: boolean
  isSortSheetOpen: boolean
  onOpenFilterSheet: () => void
  onOpenSortSheet: () => void
}

const HIDE_AFTER_SCROLL_Y = 120
const SHOW_AT_TOP_SCROLL_Y = 72
const HIDE_SCROLL_DELTA = 16
const SHOW_SCROLL_DELTA = 12

export function PennyListMobileUtilityBar({
  isFilterSheetOpen,
  isSortSheetOpen,
  onOpenFilterSheet,
  onOpenSortSheet,
}: PennyListMobileUtilityBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const isVisibleRef = useRef(true)
  const previousScrollYRef = useRef(0)
  const downwardDistanceRef = useRef(0)
  const upwardDistanceRef = useRef(0)
  const isSheetOpen = isFilterSheetOpen || isSortSheetOpen

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncMotionPreference()
    mediaQuery.addEventListener("change", syncMotionPreference)

    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference)
    }
  }, [])

  useEffect(() => {
    if (!isSheetOpen) return

    isVisibleRef.current = true
    setIsVisible(true)
    previousScrollYRef.current = window.scrollY
    downwardDistanceRef.current = 0
    upwardDistanceRef.current = 0
  }, [isSheetOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - previousScrollYRef.current
      previousScrollYRef.current = currentScrollY

      if (isSheetOpen) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true
          setIsVisible(true)
        }
        downwardDistanceRef.current = 0
        upwardDistanceRef.current = 0
        return
      }

      if (currentScrollY <= SHOW_AT_TOP_SCROLL_Y) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true
          setIsVisible(true)
        }
        downwardDistanceRef.current = 0
        upwardDistanceRef.current = 0
        return
      }

      if (delta > 0) {
        downwardDistanceRef.current += delta
        upwardDistanceRef.current = 0

        if (
          isVisibleRef.current &&
          currentScrollY > HIDE_AFTER_SCROLL_Y &&
          downwardDistanceRef.current >= HIDE_SCROLL_DELTA
        ) {
          isVisibleRef.current = false
          setIsVisible(false)
          downwardDistanceRef.current = 0
        }

        return
      }

      if (delta < 0) {
        upwardDistanceRef.current += Math.abs(delta)
        downwardDistanceRef.current = 0

        if (!isVisibleRef.current && upwardDistanceRef.current >= SHOW_SCROLL_DELTA) {
          isVisibleRef.current = true
          setIsVisible(true)
          upwardDistanceRef.current = 0
        }
      }
    }

    previousScrollYRef.current = window.scrollY
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isSheetOpen])

  return (
    <>
      <div className="h-[72px] sm:hidden" aria-hidden="true" />
      <div
        className={`fixed inset-x-0 top-16 z-30 border-b border-[var(--border-default)] bg-[var(--bg-elevated)] ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${prefersReducedMotion ? "" : "transition-transform duration-150 ease-out"} sm:hidden`}
        data-mobile-utility-bar="true"
      >
        <div className="grid h-[72px] grid-cols-4 gap-2 px-3 py-2">
          <button
            type="button"
            onClick={onOpenFilterSheet}
            aria-expanded={isFilterSheetOpen}
            aria-controls="penny-list-filter-sheet"
            className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
              isFilterSheetOpen
                ? "border-[var(--cta-primary)] bg-[var(--bg-hover)] text-[var(--text-primary)]"
                : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>
          <button
            type="button"
            onClick={onOpenSortSheet}
            aria-expanded={isSortSheetOpen}
            aria-controls="penny-list-sort-sheet"
            className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
              isSortSheetOpen
                ? "border-[var(--cta-primary)] bg-[var(--bg-hover)] text-[var(--text-primary)]"
                : "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
            }`}
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            Sort
          </button>
          <TrackableLink
            href="/lists"
            eventName="cta_click"
            eventParams={{ location: "penny-list-mobile-bar-lists" }}
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            My List
          </TrackableLink>
          <TrackableLink
            href="/report-find?src=penny-list-mobile-bar"
            eventName="report_find_click"
            eventParams={{
              ui_source: "penny-list-mobile-bar-report",
              location: "penny-list-mobile-bar-report",
            }}
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg bg-[var(--cta-primary)] text-xs font-semibold text-[var(--cta-text)] transition-colors hover:bg-[var(--cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          >
            <FilePlus className="h-4 w-4" aria-hidden="true" />
            Report
          </TrackableLink>
        </div>
      </div>
    </>
  )
}
