import * as Sentry from "@sentry/nextjs"

const shouldEnableSentry =
  process.env.NODE_ENV === "production" &&
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("pennycentral.com")

Sentry.init({
  dsn: "https://6c97a22cc0a22bf546df09e9051202f6@o4510605822394368.ingest.us.sentry.io/4510605823246336",

  // Avoid noisy reports from localhost and Vercel preview deployments.
  enabled: shouldEnableSentry,

  // Capture 10% of transactions for performance monitoring (stay in free tier)
  tracesSampleRate: 0.1,

  // Set environment to distinguish dev vs prod errors
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: false,

  // Filter out expected/harmless errors before sending to Sentry
  beforeSend(event) {
    // Suppress geolocation API errors (not critical)
    if (event.message?.includes("geolocation")) {
      return null
    }
    // Suppress network errors (transient, not actionable)
    if (
      event.message?.includes("fetch") ||
      event.message?.includes("XMLHttpRequest") ||
      event.message?.includes("Network request failed")
    ) {
      return null
    }
    // Suppress CSP and third-party script load failures
    if (
      event.message?.includes("Content Security Policy") ||
      event.message?.includes("Refused to load the script")
    ) {
      return null
    }
    // Suppress CORS errors (expected in cross-origin scenarios)
    if (event.message?.includes("CORS") || event.message?.includes("Cross-Origin")) {
      return null
    }
    return event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
