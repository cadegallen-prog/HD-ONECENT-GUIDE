import * as Sentry from "@sentry/nextjs"

const shouldEnableSentry =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production"

Sentry.init({
  dsn: "https://6c97a22cc0a22bf546df09e9051202f6@o4510605822394368.ingest.us.sentry.io/4510605823246336",

  // Avoid noisy reports from Vercel Preview/Development; only report Production.
  enabled: shouldEnableSentry,

  // Capture 10% of transactions for performance monitoring (stay in free tier)
  tracesSampleRate: 0.1,

  // Set environment to distinguish dev vs prod errors
  environment: process.env.NODE_ENV,

  // Enable debug mode in development
  debug: false,
})
