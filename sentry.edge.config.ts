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

  // Tag edge preview/dev traffic separately while only sending production events.
  environment: runtimeEnvironment,

  initialScope: {
    tags: {
      runtime: getSentryRuntimeTag("edge"),
    },
  },

  ignoreErrors: INITIAL_NOISE_PATTERNS,

  // Enable debug mode in development
  debug: false,

  // Drop low-signal edge transport noise before it reaches alerting.
  beforeSend(event) {
    return shouldDropSentryEvent(event) ? null : event
  },
})
