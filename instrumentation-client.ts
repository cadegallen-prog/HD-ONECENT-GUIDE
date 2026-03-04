import * as Sentry from "@sentry/nextjs"

import {
  FIRST_PARTY_URL_ALLOWLIST,
  INITIAL_NOISE_PATTERNS,
  RUNTIME_SENTRY_DSN,
  getClientSentryEnvironment,
  getSentryRuntimeTag,
  shouldDropSentryEvent,
} from "@/lib/monitoring/sentry-runtime"

const runtimeEnvironment =
  typeof window === "undefined"
    ? "development"
    : getClientSentryEnvironment(window.location.hostname)

const shouldEnableSentry = typeof window !== "undefined" && runtimeEnvironment === "production"

Sentry.init({
  dsn: RUNTIME_SENTRY_DSN,

  // Only report client errors from the production hostname.
  enabled: shouldEnableSentry,

  // Capture 10% of transactions for performance monitoring (stay in free tier)
  tracesSampleRate: 0.1,

  // Capture a subset of browser errors while keeping server/edge at 100%.
  sampleRate: 0.25,

  // Production is pinned to the canonical hostname even if the build came from preview.
  environment: runtimeEnvironment,

  initialScope: {
    tags: {
      runtime: getSentryRuntimeTag("client"),
    },
  },

  ignoreErrors: INITIAL_NOISE_PATTERNS,

  // Only accept first-party PennyCentral frames from the browser runtime.
  allowUrls: FIRST_PARTY_URL_ALLOWLIST,

  // Enable debug mode in development
  debug: false,

  // Keep low-signal browser noise out of the paid error stream.
  beforeSend(event) {
    return shouldDropSentryEvent(event) ? null : event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
