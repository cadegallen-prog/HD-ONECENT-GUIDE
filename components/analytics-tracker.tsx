"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function AnalyticsTrackerComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + searchParams.toString()
      window.gtag("config", "G-DJ4RJRX05E", {
        page_path: url,
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
 */
export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerComponent />
    </Suspense>
  )
}
