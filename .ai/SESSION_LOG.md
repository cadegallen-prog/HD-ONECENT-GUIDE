---

## 2026-01-18 - Codex - Real-data test fixture + placeholder SKU removal

**Goal:** Stop using fake/invalid SKU placeholders in tests/examples, and switch local/e2e to a one-time Supabase snapshot of real SKUs (no cron/ongoing backups) so testing is reliable.
**Status:** ✅ Complete + verified (all 4 gates passing) + CI green.

### Changes

- Removed placeholder SKUs (like `1001234567`, `123456`, `1009876543`) from tests/examples/UI copy and replaced with real SKUs.
- `data/penny-list.json`: replaced the old fake fixture with a one-time Supabase snapshot (sanitized: notes blank; state-only location counts).
- `scripts/snapshot-penny-list-fixture.ts` + `npm run fixture:snapshot`: manual generator for the fixture (reads `.env.local`/`.env` if present). No cron.
- Fixture timestamps are rebased to Playwright’s pinned `now` (`2025-12-10T12:00:00Z`) so freshness-based UI like "Hot Right Now" stays deterministic in CI.
- Tests that need a SKU now read from `data/penny-list.json` (instead of hardcoding fake SKUs).

### Verification

- `npm run ai:verify -- test`: `reports/verification/2026-01-18T20-22-52/summary.md`
- GitHub Actions: Quality Checks (Fast) ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21118092181`
- GitHub Actions: Full QA Suite ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21118092175`

---

## 2026-01-17 - Claude Code - Weekly Email Digest (P0-4c)

**Goal:** Send weekly penny list updates to all active subscribers every Sunday 8 AM UTC via Resend.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- `emails/weekly-digest.tsx`: React Email template with product cards, summary stats, responsive design, mobile-optimized for email clients
- `lib/email-sender.ts`: Resend API wrapper with error handling, rate limiting (100ms delay between sends), typed result objects
- `app/api/cron/send-weekly-digest/route.ts`: Cron endpoint that queries active subscribers + penny items (last 7 days), processes/aggregates by SKU, renders email template, sends via Resend with unsubscribe links
- `vercel.json`: Added cron schedule entry (Sunday 8 AM UTC: `0 8 * * 0`)
- `package.json`: Installed `resend`, `@react-email/components`, `react-email` (136 packages added, 0 vulnerabilities)

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (all passing)
✅ `npm run test:e2e` (all passing)

---

## 2026-01-17 - Claude Code - Ezoic Ads Integration (Bridge Monetization)

**Goal:** Add a temporary ad revenue bridge while Mediavine Grow collects analytics.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- Integrated Ezoic scripts and CSP allowances for production monetization readiness.
- Confirmed Grow and existing analytics remain intact.

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (all passing)
✅ `npm run test:e2e` (all passing)
