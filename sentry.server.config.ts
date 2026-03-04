import * as Sentry from "@sentry/nextjs"

import {
  INITIAL_NOISE_PATTERNS,
  RUNTIME_SENTRY_DSN,
  getSentryRuntimeTag,
  getServerSentryEnvironment,
  shouldDropSentryEvent,
} from "@/lib/monitoring/sentry-runtime"

const runtimeEnvironment = getServerSentryEnvironment()
const shouldEnableSentry =
  runtimeEnvironment === "production" && process.env.VERCEL_ENV === "production"

Sentry.init({
  dsn: RUNTIME_SENTRY_DSN,

  // Avoid noisy reports from Vercel Preview/Development; only report Production.
  enabled: shouldEnableSentry,

  // Capture 10% of transactions for performance monitoring (stay in free tier)
  tracesSampleRate: 0.1,

  sampleRate: 1.0,

  // Tag preview/dev separately while keeping event delivery production-only.
  environment: runtimeEnvironment,

  initialScope: {
    tags: {
      runtime: getSentryRuntimeTag("server"),
    },
  },

  ignoreErrors: INITIAL_NOISE_PATTERNS,

  // Enable debug mode in development
  debug: false,

  // Keep low-signal backend transport errors out of alerting.
  beforeSend(event) {
    return shouldDropSentryEvent(event) ? null : event
  },
})
