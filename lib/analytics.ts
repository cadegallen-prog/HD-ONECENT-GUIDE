declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type DeviceType = "mobile" | "desktop" | "unknown"
export type ThemeName = "light" | "dark" | "unknown"

export type EventName =
  | "penny_list_filter"
  | "penny_list_search"
  | "bookmark_banner_shown"
  | "bookmark_banner_dismissed"
  | "sku_copy"
  | "home_depot_click"
  | "share_click"
  | "directions_click"
  | "coffee_click"
  | "affiliate_click"
  | "store_finder_search"
  | "map_interact"
  | "feedback_vote"
  | "feedback_comment"
  | "return_visit"
  | "report_duplicate_click"
  | "report_prefill_loaded"
  | "report_find_click"
  // Personal list events
  | "add_to_list_clicked"
  | "add_to_list_completed"
  | "list_item_removed"
  | "priority_changed"
  | "found_status_changed"
  // Sharing events
  | "share_link_copied"
  | "shared_list_viewed"
  | "save_copy_clicked"
  | "save_copy_completed"
  // In-store mode events
  | "in_store_mode_enabled"
  | "in_store_mode_disabled"
  // Email signup events
  | "email_signup_shown"
  | "email_signup_dismissed"
  | "email_signup"
  | "email_signup_error"
  // PWA install events
  | "pwa_prompt_shown"
  | "pwa_prompt_dismissed"
  | "pwa_install_started"
  | "pwa_install_accepted"
  | "pwa_install_declined"
  | "pwa_install_error"
  // Legacy/compat events (keep until removed from UI)
  | "newsletter_click"
  | "store_search"
  | "trip_create"
  | "find_submit"
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
  ui_source?: string
  placement?: string
  pc_source?: string
  pc_medium?: string
  pc_campaign?: string
  src?: string
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

const RESERVED_PARAM_REMAP = {
  source: "pc_source",
  medium: "pc_medium",
  campaign: "pc_campaign",
} as const

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== ""
}

export function sanitizeEventParams(params: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = { ...params }

  // Normalize legacy attribution keys before applying GA-like reserved-key remapping.
  if (!hasValue(normalized.ui_source)) {
    if (hasValue(normalized.src)) {
      normalized.ui_source = normalized.src
    } else if (hasValue(normalized.source)) {
      normalized.ui_source = normalized.source
    }
  }
  delete normalized.src

  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(normalized)) {
    if (value === undefined) continue
    const safeKey = RESERVED_PARAM_REMAP[key as keyof typeof RESERVED_PARAM_REMAP] ?? key
    if (safeKey in sanitized && key !== safeKey) continue
    sanitized[safeKey] = value
  }

  return sanitized
}

function buildPayload(params?: EventParams): Record<string, unknown> {
  const { page, device, theme, ts, ...rest } = params || {}
  const sanitizedParams = sanitizeEventParams(rest)
  return {
    page: page ?? getPagePath(),
    device: device ?? getDeviceType(),
    theme: theme ?? getThemeName(),
    ts: ts ?? new Date().toISOString(),
    event_category: "engagement",
    ...sanitizedParams,
  }
}

/**
 * Track an event with the configured analytics provider.
 * Safe to call on server-side (no-op) or if the provider is not loaded.
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
  if (typeof window === "undefined") return
  const payload = buildPayload(params)

  if (process.env.NODE_ENV !== "production") {
    // Dev-friendly log for verification
    console.info("[analytics]", eventName, payload)
  }

  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false" && window.gtag) {
    window.gtag("event", eventName, payload)
  }
}

/**
 * Track a page view (useful for SPAs or custom tracking).
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined") return
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: title,
      device: getDeviceType(),
      theme: getThemeName(),
      ts: new Date().toISOString(),
    })
  }
}
