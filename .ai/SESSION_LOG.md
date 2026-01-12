# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-12 - GitHub Copilot - Dependency update and security audit

**Goal:** Update low-risk dependencies and run security scans to keep project secure.
**Status:** ✅ Complete

### Changes

- Bumped: `@supabase/supabase-js` 2.89.0 → 2.90.1, `next` 16.0.10 → 16.1.1, `@vercel/analytics` 1.5.0 → 1.6.1, `framer-motion`, `lucide-react`, `jsbarcode`, `@tailwindcss/forms`, `autoprefixer`, `eslint` tooling, type packages and others (minor/patch)

### Verification

- `npm install` completed, `npm audit` found 0 vulnerabilities, `npm run qa:fast` (lint, unit tests, build) passed, `npm run security:scan` passed.

### Next Steps

- Pushed to `main` and monitoring Vercel deployment.

---

## 2026-01-12 - ChatGPT Codex (GPT-5.2) - Report Find Submission Outage Fix (CRITICAL)

**Goal:** Fix “Report a Find” submissions failing in production (`Failed to submit find. Please try again.` / follow-on `Too many submissions...` after retries)
**Status:** ✅ Complete

### Root Cause

- Supabase now blocks direct `anon` INSERT privileges + RLS policy is authenticated-only for `public."Penny List"`.
- `/api/submit-find` was still inserting with the anon key, so every submission failed (500), and repeated retries triggered the in-memory rate limiter.

### Fix

- `app/api/submit-find/route.ts`: inserts now use Supabase **service role** (keeps DB locked down from direct anon inserts while preserving low-friction web submissions); rate limiter now records **only successful** submissions; more robust rate-limit key when IP is missing.
- `tests/submit-find-route.test.ts`: updated to assert service-role insertion behavior.
- `docs/supabase-rls.md`: updated to match current production reality (direct anon INSERT denied; API route inserts with service role).
- `playwright.config.ts`: default `reuseExistingServer` is now off (opt-in via `PLAYWRIGHT_REUSE_EXISTING_SERVER=1`) to prevent stale Playwright servers from causing `.next` asset mismatch and MIME-type errors during `ai:verify` runs.
- `tests/visual-smoke.spec.ts`: updated Penny List H1 expectation to match current page title.

### Verification

- ✅ `reports/verification/2026-01-12T05-37-14/summary.md`

### Next Session Notes

- Deploy by pushing `main`, then do a real production submission on `/report-find` to confirm the Supabase row is created.
- If production still fails, double-check Vercel has `SUPABASE_SERVICE_ROLE_KEY` set (server-only).

## 2026-01-11 - Claude Code (Opus 4.5) - GA4 Analytics Review + Backlog Refresh

**Goal:** Review first clean GA4 analytics window (Jan 9-11) and refresh backlog with growth priorities
**Status:** ✅ Complete

### Context

Owner's Cartersville traffic (~3k views) was contaminating historical analytics. After fixing the filter, Jan 9-11 represents the first clean data window with ~587 real users.

### Key Analytics Findings

| Metric           | Value        | Implication                        |
| ---------------- | ------------ | ---------------------------------- |
| Active users     | 587 (3 days) | Solid traction                     |
| New vs returning | 80% new      | Acquisition working, retention not |
| Avg engagement   | 2m 12s       | Good for content site              |
| Views/user       | 5.90         | Users exploring multiple pages     |
| Conversion       | 42%          | 245 users clicked to Home Depot    |

**Traffic Sources:**

- Facebook referrals: 38% (#1 channel)
- Direct: 41%
- ChatGPT: 45 users (AI recommending the site)
- Organic search: Only 8 clicks (SEO weak)

**Problem Pages:**

- `/` (homepage): 10s engagement vs 1m 10s on `/penny-list`
- `/home-depot-penny-items`: 100% bounce rate
- `/how-to-find-penny-items`: 100% bounce rate

### Actions Taken

1. **Cleaned up stale backlog** - Marked 4 completed data pipeline scripts as done
2. **Added 4 new P0 items** in `.ai/BACKLOG.md`:
   - P0-1: Fix 100% bounce pages (quick win)
   - P0-2: Homepage conversion (10s → 30s+ engagement)
   - P0-3: SEO improvement (rank for "home depot penny list")
   - P0-4: User retention system (Day 7 retention >2%)

### Next Session Should

1. **Start with P0-1:** Investigate `/home-depot-penny-items` and `/how-to-find-penny-items`
2. These are SEO landing pages created Jan 8 - check if content is thin or misleading
3. Quick fixes: improve content + CTAs, or redirect to better pages

### Learnings

- **Facebook is the growth engine** - 38% of users, double down on groups
- **Core product works** - `/penny-list` has 1m 10s engagement
- **Homepage is a leak** - 10s engagement, users not finding value prop
- **SEO needs work** - Invisible for non-branded "home depot penny" queries

---

## 2026-01-11 - GitHub Copilot - Supabase Egress Optimization

**Goal:** Reduce Supabase egress from 6.3 GB to under 5 GB free tier limit
**Status:** ✅ Complete

### What Was Done

1. **Explicit column selection** - No more `select('*')`, only fetch needed columns
2. **Lazy-load notes** - `notes_optional` excluded from list queries, included only on detail pages
3. **Next.js ISR caching** - Pages use `revalidate = 1800` (30 min) to reduce repeated fetches

### Files Changed

- `lib/fetch-penny-data.ts` - Column lists, `{ includeNotes: false }` option
- `app/api/penny-list/route.ts` - Uses lightweight query
- `app/penny-list/page.tsx` - Uses lightweight query

### Expected Impact

~50% reduction in egress (6.3 GB → ~3.3 GB)

---

**Older entries archived to git history.**
