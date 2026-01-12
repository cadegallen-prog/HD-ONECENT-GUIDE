# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-12 - Codex (GPT-5.2) - Canonical global analytics setup (GA4 + Grow + Vercel)

**Goal:** Make `app/layout.tsx` the single, canonical global analytics/script source so GA4, Mediavine Grow, and Vercel Analytics all load sitewide and don’t randomly disappear again.
**Status:** ✅ Local complete. ⏳ Production verification pending deploy.

### Actions

- Consolidated global analytics behavior into `app/layout.tsx` (no page-level installs).
- Mediavine Grow now ships as a real `<script src="https://faves.grow.me/main.js" ...>` in `<head>` so it appears in View Page Source.
- GA4 kept as a single global `<head>` install (Measurement ID `G-DJ4RJRX05E`) and now fires pageviews on SPA route changes (history hooks).
- Vercel Analytics + Speed Insights are rendered globally, only on Vercel production, never during Playwright/CI.
- Removed invalid wildcard `preconnect` links (`*.sentry.io`, `*.supabase.co`).
- Updated CSP to allow Grow (`https://faves.grow.me`, `https://*.grow.me`) without console errors.

### Verification

- `npm run ai:verify -- test`
- Proof bundle: `reports/verification/2026-01-12T22-29-04/summary.md`

### Next Steps

- Push `main` to deploy, then verify on production:
  - View Page Source on `/` and `/guide` contains GA4 and Grow
  - DevTools Network shows 200s for GA4 and Grow scripts

---

## 2026-01-12 - GitHub Copilot - Batch review & merge of security autofix PRs

**Goal:** Review all open security autofix PRs (code-scanning alerts) and merge passing ones.
**Status:** ✅ Complete

### Actions

- Listed open PRs (numbers: 71,72,73,74,75,76,77,78,79,80,82,83)
- Checked out each PR locally (PR #76 was already merged)
- Ran QA for each PR: lint ✅, unit tests (25) ✅, production `next build` ✅
- Merged passing PRs: **#71, #72, #73, #74, #75, #77, #78, #79, #80, #82, #83**
- Deleted branches and pushed updates to `main` (fast-forward merges)

### Verification

- After merging, ran `npm run qa:fast` on `main` (lint, unit tests, build) - all passed.

---

## 2026-01-12 - GitHub Copilot - Production error hardening + dependency update

**Goal:** Harden `/api/submit-find` error handling after discovering permission errors in Vercel logs + update dependencies
**Status:** ✅ Complete

### Root Cause (From Vercel Logs)

- Jan 11 logs showed repeated 500s with `Supabase insert error: { code: '42501', message: 'permission denied for table Penny List' }`
- Code wasn't reading `SUPABASE_SERVICE_ROLE_KEY` correctly (fixed in earlier session)
- Missing runtime guards to detect config issues early
- JSON parse errors returned generic 500s instead of helpful 400s

### Changes

- Added early guard for `SUPABASE_SERVICE_ROLE_KEY`, clearer logging, and better 400/500 responses.
- Updated dependencies (minor/patch): `@supabase/supabase-js`, `next`, `@vercel/analytics`, and tooling.

### Verification

- `npm run qa:fast`: lint ✅, 25/25 unit tests ✅, Next.js build ✅
- Production test: POST to `/api/submit-find` returned 200, row inserted successfully
