# Backlog (Top Priority Items)

**Last updated:** Jan 16, 2026
**Rule:** Keep ≤10 items. Archive completed/deferred items.

**Auto-archive:** Full backlog history preserved in `archive/backlog-history/`

Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Implement + verify (proof required)
4. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## P0 - Do Next (Analytics-Driven Growth)

### 1. User Retention - Email Signup (P0-4b)

- **Problem:** No way to capture users who want updates. Organic growth without return visits is wasted.
- **Done means:**
  - Email signup form on `/penny-list`
  - `email_subscribers` table in Supabase
  - `POST /api/subscribe` endpoint working
  - `GET /api/unsubscribe` endpoint working
  - Form is dismissible and tracks GA4 `email_signup` event
- **Verify:** All 4 gates + manual test (signup works)
- **Evidence:** 3,262 bookmark_banner_shown events but no capture mechanism

### 2. User Retention - Weekly Email Cron (P0-4c)

- **Problem:** Email signups without delivery = broken promise to users
- **Prerequisites:** Owner must set up Resend.com account first
- **Done means:**
  - GitHub Action runs every Sunday 8 AM UTC
  - Email template renders correctly
  - Cron queries Supabase for new items (last 7 days)
  - Sends via Resend to all active subscribers
  - Unsubscribe link works in email
- **Verify:** All 4 gates + manual test email
- **Blocked by:** Resend.com account setup

### 3. SEO Improvement - Schema Markup + Internal Linking (P0-3)

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

| Metric | Value | Insight |
|--------|-------|---------|
| Daily users | 680 | Up 3.5x from 196/day (Jan 9-11) |
| Conversion rate | 26% | 906 HD clicks / 3,451 users |
| Facebook traffic | 28% | #1 referral channel |
| Organic clicks | 80 | All branded ("penny central") |
| SEO position | 11.6 | Page 2 for target keywords |

**Key insight:** Traffic growing, core product works, but retention and SEO are critical gaps.

---

**For full backlog:** See `archive/backlog-history/BACKLOG_full_2025-12.md`
