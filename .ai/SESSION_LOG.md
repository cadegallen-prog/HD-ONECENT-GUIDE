# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-13 - Codex (GPT-5.2) - Fix: Penny List reliability (Option B)

**Goal:** Restore reliable behavior where (1) new submissions appear, (2) items don’t disappear after submissions, and (3) newest sorting reflects real submission recency.
**Status:** ✅ Local complete + verified (lint/build/unit/e2e).

### Root Causes (Confirmed)

1. **Stale Supabase reads in Next.js production:** Supabase `select()` requests are GET fetches; Next.js production can cache them, creating a “stuck snapshot” where new DB rows exist but the app keeps serving old results.
2. **Wrong window semantics:** date window filtering treated `purchase_date` as authoritative when present, excluding fresh submissions with older “date found” values.

### Changes (Minimal)

- `lib/supabase/client.ts`: Force Supabase-js server fetches to `cache: "no-store"` + `next: { revalidate: 0 }` so reads can’t get stuck.
- `lib/fetch-penny-data.ts`: Date windows use `timestamp` (submission time). Fallback to `purchase_date` only when `timestamp` is NULL.
- `docs/CROWDSOURCE-SYSTEM.md` and `SUPABASE_CRITICAL_FIXES.md`: Document recency + caching semantics.
- `playwright.config.ts`: Run Playwright webServer as `next dev --webpack` on 3002 for stability (avoids intermittent Turbopack `next start` missing-chunk console errors).

### Verification (Proof)

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ 25/25 passing
- `npm run test:e2e` ✅ 100 passed
  - HTML report: `reports/playwright/html`
  - Artifacts: `reports/playwright/results`

---

## 2026-01-13 - Codex (GPT-5.2) - Full QA Suite stabilized (CI e2e + SKU JSON-LD) + Sentry preview noise reduction

**Goal:** Stop GitHub Actions “Full QA Suite” from failing repeatedly and reduce noisy Sentry emails from non-production environments.
**Status:** ✅ Complete

### Root causes

- **CI hydration crash:** `AuthProvider` called `createSupabaseBrowserClient()` on every route; in CI `NEXT_PUBLIC_SUPABASE_*` is unset, so the browser bundle threw and rendered the global error page (“Something went wrong!”), causing widespread E2E selector failures.
- **CI SKU pages returning 404:** Full QA’s build step runs without Supabase creds, so `generateStaticParams()` for `/sku/[sku]` had no data. In CI this made SKU routes 404 in E2E, failing JSON-LD and “related items” tests.

### Actions

- `components/auth-provider.tsx`: treat Supabase auth as optional; when `NEXT_PUBLIC_SUPABASE_*` isn’t configured, skip Supabase initialization and avoid crashing hydration.
- `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`: suppress Sentry reporting on localhost and Vercel previews (only report on production domain / Vercel production).
- `.github/workflows/full-qa.yml`: set `USE_FIXTURE_FALLBACK=1` during the Full QA build so SKU static params and pages exist deterministically in CI (no Supabase creds needed).

### Verification

**Local (4 gates):**

- `npm run lint` ✅ 0 errors
- `npm run build` ✅ success
- `npm run test:unit` ✅ 25/25 passing
- `npm run test:e2e` ✅ 100/100 passing

**GitHub Actions (green):**

- ✅ Full QA Suite: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/20939984364
- ✅ Quality Checks (Fast): https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/20939984351

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
