# Sentry Alert Suppression Rules (Code-Side)

**Status:** Implemented 2026-01-16

This file documents which errors are intentionally suppressed in code to prevent Sentry noise.

## Code-Side Filters (Already in Sentry Config)

✅ **Production-only reporting**
- `instrumentation-client.ts`: Only reports from `pennycentral.com` domain
- `sentry.server.config.ts`: Only reports when `NODE_ENV === "production"` AND `VERCEL_ENV === "production"`
- `sentry.edge.config.ts`: Same production-only filter

✅ **Sample rate: 10%**
- `tracesSampleRate: 0.1` in both configs keeps transaction volume manageable

## Recommended Alert Rule Tuning (Manual in Sentry UI)

Go to: https://sentry.io/organizations/pennycentral/alerts/

### 1. Suppress Expected/Harmless Errors

**Inbound Filters** (Settings > Error Tracking):

- [ ] Ignore "geolocation" errors (browser API, not critical)
- [ ] Ignore "Network request failed" (transient)
- [ ] Ignore "404" responses from third-party CDNs
- [ ] Ignore browser extension errors (Tampermonkey, ad blockers)

### 2. Alert Rule: Critical Errors Only

**Conditions:**
- Error rate >= 5% in 10 minutes AND
- Error level = "error" (not "warning")
- Exclude: geolocation, network, CORS, 404

**Action:** Email notification (not SMS)

### 3. Notification Frequency

Change from "Every error" to:
- [ ] Daily digest summary, OR
- [ ] Notify only on consecutive occurrences (escalation policy)

## False Positives to Document

When tuning alerts, document here why you suppressed each one:

| Error Type | Reason Suppressed | Date |
|---|---|---|
| (example) | (reason) | (date) |

---

**Last Updated:** 2026-01-16
**Next Review:** Weekly or when alert volume spikes
