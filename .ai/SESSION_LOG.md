# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-12 - Codex (GPT-5.2) - GitHub Actions noise reduction (QA, Sonar, SerpApi) + Sentry dev gating

**Goal:** Stop repeated GitHub failures/noise (qa-fast/full, SonarCloud, SerpApi) and reduce Sentry alert spam from local dev.
**Status:** ✅ Complete

### Actions

- Fixed CI unit test failures caused by missing `SUPABASE_SERVICE_ROLE_KEY`:
  - Reordered the `SUPABASE_SERVICE_ROLE_KEY` guard in `app/api/submit-find/route.ts` so invalid requests still return 400s.
  - Set a **dummy** `SUPABASE_SERVICE_ROLE_KEY=test` in GitHub workflows so unit tests can run in CI without production secrets.
- SonarCloud failures: changed `.github/workflows/sonarcloud.yml` to `workflow_dispatch` only, because SonarCloud automatic analysis is enabled and CI analysis fails when both are on.
- SerpApi Enrich failures:
  - Removed a build-breaking TS construct in `scripts/serpapi-enrich.ts` (replaced `matchAll`/spread parsing with a safe regex loop).
  - Added credit/quota exhaustion detection that exits cleanly (no-op) to avoid ad-nauseam failing scheduled runs.
- Sentry noise reduction:
  - Disabled Sentry reporting in local dev by adding `enabled: process.env.NODE_ENV === "production"` in Sentry init configs.

### Local Verification

- `npm run qa:fast` ✅

### Notes

- If you (Cade) still get Sentry emails after this, they are likely **production** issues/alerts and must be tuned in the Sentry UI (alert rules), or we need a concrete error message to filter with `ignoreErrors`/`beforeSend`.

---

## 2026-01-12 - Codex (GPT-5.2) - Canonical global analytics setup (GA4 + Grow + Vercel)

**Goal:** Make `app/layout.tsx` the single, canonical global analytics/script source so GA4, Mediavine Grow, and Vercel Analytics all load sitewide and don’t randomly disappear again.
**Status:** ✅ Complete

### Actions

- Consolidated global analytics behavior into `app/layout.tsx` (no page-level installs).
- Mediavine Grow now ships as a real `<script src="https://faves.grow.me/main.js" ...>` in `<head>` so it appears in View Page Source.
- GA4 kept as a single global `<head>` install (Measurement ID `G-DJ4RJRX05E`) and fires pageviews on SPA route changes (history hooks).
- Vercel Analytics + Speed Insights are rendered globally, only on Vercel production, never during Playwright/CI.
- Removed invalid wildcard `preconnect` links (`*.sentry.io`, `*.supabase.co`).
- Updated CSP to allow Grow (`https://faves.grow.me`, `https://*.grow.me`) without console errors.

### Verification

- `npm run ai:verify -- test`
- Proof bundle: `reports/verification/2026-01-12T22-29-04/summary.md`

---

## 2026-01-12 - GitHub Copilot - Production error hardening + dependency update

**Goal:** Harden `/api/submit-find` error handling after discovering permission errors in Vercel logs + update dependencies
**Status:** ✅ Complete

### Root Cause (From Vercel Logs)

- Jan 11 logs showed repeated 500s with `Supabase insert error: { code: '42501', message: 'permission denied for table Penny List' }`
- Code wasn't reading `SUPABASE_SERVICE_ROLE_KEY` correctly (fixed in earlier session)
- Missing runtime guards to detect config issues early
- JSON parse errors returned generic 500s instead of helpful 400s

### Verification

- `npm run qa:fast`: lint ✅, unit ✅, build ✅
- Production test: POST to `/api/submit-find` returned 200, row inserted successfully
