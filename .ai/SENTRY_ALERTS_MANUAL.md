# Sentry Alert Configuration (Manual Steps)

## Problem

Sentry is sending hourly email alerts for every error, including harmless ones (geolocation, network timeouts, etc.). This is **Sentry alert rule configuration**, not code configuration.

## Solution: Adjust Sentry Alert Rules

**Go to:** https://sentry.io/organizations/pennycentral/alerts/

### 1. Create "Critical Errors Only" Alert Rule

Settings:

- **Condition:** Error rate >= 5% in 10 minutes AND error type is NOT geolocation/network/cors
- **Action:** Email notification
- **Avoid:** "All errors" trigger

### 2. Ignore Harmless Errors (Inbound Filters)

Settings > Error Tracking > Inbound Filters:

- Ignore browser extensions (Tampermonkey, ad blockers)
- Ignore localhost/preview deployments (already in code: `VERCEL_ENV === 'production'`)
- Ignore geolocation errors (low priority)
- Ignore 404s from third-party scripts

### 3. Adjust Email Notification Frequency

Organization Settings > Email > Alert Frequency:

- Change from "Every error" to "Daily digest" or "Weekly summary"

## What I've Already Fixed in Code

✅ **instrumentation-client.ts**: Only reports errors from `pennycentral.com` (production domain)
✅ **sentry.server.config.ts**: Only reports in production mode (`VERCEL_ENV === 'production'`)
✅ **sentry.edge.config.ts**: Only reports in production mode
✅ **Sample rate**: 10% of transactions to stay in free tier

## Next Steps (You Need to Do)

1. Log into https://sentry.io/
2. Go to project settings
3. Configure alert rules to reduce noise (above)
4. Test by triggering a real error and verifying you only get notified for critical issues

Once done, Sentry will be useful (catching real production bugs) instead of noisy (every geolocation fail).
