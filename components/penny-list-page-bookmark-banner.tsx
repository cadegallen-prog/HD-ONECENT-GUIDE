"use client"

import { useEffect, useMemo, useState } from "react"
import { Bookmark, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const DISMISSED_KEY = "pennycentral_penny_list_bookmark_banner_dismissed_v1"

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function PennyListPageBookmarkBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const isDismissed = useMemo(() => safeGetItem(DISMISSED_KEY) === "1", [])

  useEffect(() => {
    if (isDismissed) return

    let hasShown = false

    const show = () => {
      if (hasShown) return
      hasShown = true
      setIsVisible(true)
      trackEvent("bookmark_banner_shown", { surface: "penny-list" })
    }

    const timeoutId = window.setTimeout(show, 20_000)

    const onScroll = () => {
      if (window.scrollY >= 500) show()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [isDismissed])

  if (!isVisible || isDismissed) return null

  return (
    <section
      aria-label="Bookmark tip"
      className="mb-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5"
      data-bookmark-page-banner="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
            <Bookmark className="h-5 w-5 text-[var(--cta-primary)]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Bookmark this page — new finds roll in all day
            </p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              If you check the Penny List often, bookmarking makes it a one-tap habit.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            safeSetItem(DISMISSED_KEY, "1")
            setIsVisible(false)
            trackEvent("bookmark_banner_dismissed", { surface: "penny-list" })
          }}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          aria-label="Dismiss bookmark tip"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <details className="mt-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--cta-primary)] underline decoration-[var(--cta-primary)] underline-offset-2">
          How to bookmark (quick)
        </summary>
        <div className="mt-3 space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
          <p>
            <span className="font-semibold text-[var(--text-primary)]">iPhone (Safari):</span> Share
            → Add to Home Screen
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Android (Chrome):</span> Menu
            (⋮) → Add to Home screen
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Desktop:</span> Ctrl+D (or
            Cmd+D) to bookmark
          </p>
        </div>
      </details>
    </section>
  )
}
