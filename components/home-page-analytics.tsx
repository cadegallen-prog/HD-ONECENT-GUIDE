"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export function HomePageAnalytics() {
  useEffect(() => {
    trackEvent("home_page_view", { page: "/" })
  }, [])

  return null
}
