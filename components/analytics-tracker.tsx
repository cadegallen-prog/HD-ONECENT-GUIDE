"use client"

import { useEffect, Suspense, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function AnalyticsTrackerComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)
  const lastTrackedUrl = useRef<string>("")

  useEffect(() => {
    // Skip tracking on the very first mount because it is handled by the
    // GTAG config in RootLayout (head) to capture bounces before hydration.
    if (isFirstRender.current) {
      isFirstRender.current = false
      lastTrackedUrl.current = pathname + searchParams.toString()
      return
    }

    if (typeof window !== "undefined" && window.gtag) {
      const search = searchParams.toString()
      const url = pathname + (search ? "?" + search : "")

      // Prevent duplicate tracking of the same URL within the same interaction
      if (url === lastTrackedUrl.current) return
      lastTrackedUrl.current = url

      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
        // Standardize common parameters for all page views
        device: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
        theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      })
    }
  }, [pathname, searchParams])

  return null
}

/**
 * AnalyticsTracker handles client-side page view tracking for Next.js App Router.
 * It ensures that every navigation is recorded properly in GA4 without redundant events.
 *
 * Wrap in Suspense as required by Next.js for client components using searchParams hooks.
 */
export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerComponent />
    </Suspense>
  )
}
