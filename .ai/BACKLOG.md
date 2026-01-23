# Backlog (Top Priority Items)

**Last updated:** Jan 23, 2026
**Rule:** Keep ≤10 items. Archive completed/deferred items.

**Auto-archive:** Full backlog history preserved in `archive/backlog-history/`

Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Implement + verify (proof required)
4. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

**Planning (canonical):** See `.ai/plans/INDEX.md` for all concurrent plans and their statuses.

---

## P0 - Do Next (Analytics-Driven Growth)

### 0. Data Pipeline Reliability - Pre-scrape + Cron Auth (P0-0)

- **Problem:** The pre-scrape workflow (`Enrichment Staging Warmer`) is failing due to **403 + Cloudflare “Just a moment...”** from the upstream API when running on GitHub-hosted runners. Separately, Vercel cron endpoints will return 401 if `CRON_SECRET` is missing/mismatched.
- **Done means:**
  - A scheduled run of `Enrichment Staging Warmer` is ✅ green and updates `enrichment_staging` with non-zero items
  - Failure issue #106 closes automatically on recovery
  - Vercel cron logs show 200s (not 401s) for `/api/cron/seed-penny-list`, `/api/cron/trickle-finds`, `/api/cron/send-weekly-digest`
- **Approach options:** Provider allowlisting / proper API auth (preferred) vs self-hosted runner vs new data source

### 1. SEO Improvement - Schema Markup + Internal Linking (P0-3)

- **Problem:** Zero non-branded organic clicks. Position 11.6 for "home depot penny list". 100% dependent on Facebook.
- **Done means:**
  - FAQ schema added to `/guide`
  - HowTo schema added to `/guide`
  - Both schemas validate in Google Rich Results Test
  - Internal links strengthened (guide ↔ penny-list ↔ homepage)
  - H1s verified to match target keywords
  - Meta descriptions updated
- **Verify:** All 4 gates + schema validation
- **Evidence:** Search Console shows 80 clicks, all branded ("penny central"). Zero clicks for "home depot penny list" despite 6 impressions.
- **Timeline:** 2-3 weeks for Google to respond after deployment

---

## ✅ Recently Completed

- **2026-01-17:** P0-4c (Weekly Email Cron) - Implemented weekly email digest sent every Sunday 8 AM UTC to all active subscribers. Queries new penny items from last 7 days, renders responsive React email template, sends via Resend API with proper unsubscribe links. All 4 gates passing.
- **2026-01-16:** P0-4b (Email Signup Form) - Implemented email signup form on `/penny-list` with `email_subscribers` table, subscribe/unsubscribe endpoints, dismissible UI, localStorage persistence, and GA4 tracking. All 4 gates passing.
- **2026-01-16:** P0-4a (PWA Install Prompt) - Implemented "Add to Home Screen" prompt on `/penny-list` with app icons (192px, 512px), PWA manifest, dismissible UI, localStorage persistence, and GA4 tracking. All 4 gates passing.
- **2026-01-16:** P0-1 (bounce page redirects) - Redirected `/home-depot-penny-items`, `/how-to-find-penny-items`, and `/home-depot-penny-list` to appropriate pages. Bounce rates improved from 100% to 21-29%.
- **2026-01-10:** Data pipeline scripts completed:
  - `scripts/export-pennycentral-json.ts` - PennyCentral export artifact
  - `scripts/validate-scrape-json.ts` - Scrape JSON validation/normalization
  - `scripts/scrape-to-enrichment-csv.ts` - Scrape to enrichment CSV conversion
  - `scripts/enrichment-diff.ts` - Diff report (scrape vs export)
- **2026-01-06:** Implemented `scripts/print-penny-list-count.ts` and added `npm run penny:count`.

---

## Analytics Context (Jan 12-16, 2026)

**Source:** Fresh GA4 + Search Console data (see plan file for full details)

| Metric           | Value | Insight                         |
| ---------------- | ----- | ------------------------------- |
| Daily users      | 680   | Up 3.5x from 196/day (Jan 9-11) |
| Conversion rate  | 26%   | 906 HD clicks / 3,451 users     |
| Facebook traffic | 28%   | #1 referral channel             |
| Organic clicks   | 80    | All branded ("penny central")   |
| SEO position     | 11.6  | Page 2 for target keywords      |

**Key insight:** Traffic growing, core product works, but retention and SEO are critical gaps.

---

**For full backlog:** See `archive/backlog-history/BACKLOG_full_2025-12.md`
