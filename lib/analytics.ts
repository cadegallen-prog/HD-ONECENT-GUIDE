/**
 * Analytics utility for tracking events with Google Analytics
 *
 * Usage:
 * import { trackEvent } from '@/lib/analytics'
 * trackEvent('newsletter_click', { location: 'penny-list' })
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type EventName =
  | "newsletter_click"
  | "store_search"
  | "trip_create"
  | "find_submit"
  | "donation_click"
  | "befrugal_click"
  | "cta_click"

export interface EventParams {
  event_category?: string
  event_label?: string
  value?: number
  location?: string
  [key: string]: unknown
}

/**
 * Track an event with Google Analytics
 * Safe to call on server-side (no-op) or if gtag is not loaded
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: params?.event_category || "engagement",
      ...params,
    })
  }
}

/**
 * Track a page view (useful for SPAs or custom tracking)
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: url,
      page_title: title,
    })
  }
}
