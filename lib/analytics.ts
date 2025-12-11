declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type DeviceType = "mobile" | "desktop" | "unknown"
export type ThemeName = "light" | "dark" | "unknown"

export type EventName =
  | "penny_list_view"
  | "penny_list_filter"
  | "penny_list_search"
  | "sku_copy"
  | "directions_click"
  | "coffee_click"
  | "affiliate_click"
  | "store_finder_search"
  | "map_interact"
  | "feedback_vote"
  | "feedback_comment"
  | "return_visit"
  // Legacy/compat events (keep until removed from UI)
  | "newsletter_click"
  | "store_search"
  | "trip_create"
  | "find_submit"
  | "donation_click"
  | "befrugal_click"
  | "cta_click"

export interface EventParams {
  page?: string
  device?: DeviceType
  theme?: ThemeName
  ts?: string
  event_category?: string
  event_label?: string
  value?: number | string | boolean
  location?: string
  [key: string]: unknown
}

const getDeviceType = (): DeviceType => {
  if (typeof window === "undefined") return "unknown"
  return window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop"
}

const getThemeName = (): ThemeName => {
  if (typeof document === "undefined") return "unknown"
  const root = document.documentElement
  if (root.classList.contains("dark") || root.dataset.theme === "dark") return "dark"
  return "light"
}

const getPagePath = (): string => {
  if (typeof window === "undefined") return ""
  return window.location.pathname
}

function buildPayload(params?: EventParams): Record<string, unknown> {
  const { page, device, theme, ts, ...rest } = params || {}
  return {
    page: page ?? getPagePath(),
    device: device ?? getDeviceType(),
    theme: theme ?? getThemeName(),
    ts: ts ?? new Date().toISOString(),
    event_category: "engagement",
    ...rest,
  }
}

/**
 * Track an event with Google Analytics.
 * Safe to call on server-side (no-op) or if gtag is not loaded.
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return
  const payload = buildPayload(params)

  if (process.env.NODE_ENV !== "production") {
    // Dev-friendly log for verification
    console.info("[analytics]", eventName, payload)
  }

  if (window.gtag) {
    window.gtag("event", eventName, payload)
  }
}

/**
 * Track a page view (useful for SPAs or custom tracking).
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined") return
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: title,
      device: getDeviceType(),
      theme: getThemeName(),
      ts: new Date().toISOString(),
    })
  }
}
