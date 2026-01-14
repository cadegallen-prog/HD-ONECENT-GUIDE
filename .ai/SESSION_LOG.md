# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-13 - Codex (GPT-5.2) - Penny List: 5-min freshness + submitter instant refresh + missing items fix

**Goal:** (A) Public Penny List updates within ~5 minutes, (B) submitter sees their item immediately after submit (no global polling), (C) fix why some specific SKUs were missing (ex: water hose).
**Status:** ✅ Complete + locally verified (lint/build/unit/e2e) + UI screenshots captured.

### Root Causes (Confirmed)

1. **Enrichment table was treated as a gate:** `lib/fetch-penny-data.ts` previously dropped SKUs that did not yet have a `penny_item_enrichment` row (`hideUnenriched=true`), which made real submissions appear “missing” until enrichment existed.
2. **Public caching too slow for the core loop:** public list caching/revalidation was longer than needed for “live” UX.

### Changes (Minimal)

- **5-minute public caching:**
  - `app/api/penny-list/route.ts`: `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=60`
  - `app/penny-list/page.tsx`: `revalidate = 300`
- **Submitter immediate gratification (no global polling):**
  - `/api/penny-list?fresh=1` returns `Cache-Control: no-store` and bypasses server-side function caching for that request only.
  - `app/report-find/page.tsx`: success CTA goes to `/penny-list?fresh=1`.
  - `components/penny-list-client.tsx`: one-time forced fresh fetch when loaded with `fresh=1`, then strips the param.
- **Missing items fix:**
  - `lib/fetch-penny-data.ts`: enrichment overlay is no longer a gate (`hideUnenriched: false`).

### Evidence (Supabase)

- Water hose SKU `1009408133` exists in `penny_list_public` and is readable via anon, but has **no** `penny_item_enrichment` row.
- Clermont flooring SKU `1009591316` exists in `penny_list_public` and does have a `penny_item_enrichment` row (even if mostly empty).
- This explains “some SKUs missing, some showing” before the overlay/gate fix.

### Verification (Proof)

**All 4 gates (bundle):**

- `reports/verification/2026-01-13T08-16-40/summary.md`

**UI screenshots:**

- `reports/proof/2026-01-13T08-22-19/penny-list-light.png`
- `reports/proof/2026-01-13T08-22-19/penny-list-dark.png`
- `reports/proof/2026-01-13T08-22-19/report-find-light.png`
- `reports/proof/2026-01-13T08-22-19/report-find-dark.png`
- `reports/proof/2026-01-13T08-22-19/console-errors.txt` (no errors)

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
- ✅ SerpApi Enrich (manual run; credits-exhausted should no-op): https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/20940157597

---

## 2026-01-13 - Codex (GPT-5.2) - Grow connectivity: align snippet with Grow portal canonical tag

**Goal:** Reduce false-negative “Check Grow Connectivity” failures by matching the Grow portal’s canonical install snippet shape (single `script[data-grow-initializer]` that injects `https://faves.grow.me/main.js` and sets `data-grow-faves-site-id`).
**Status:** ✅ Local change + locally verified (lint/build/unit/e2e). ⏳ Needs production deploy + Grow portal re-check.

### Change (minimal)

- `app/layout.tsx`: replaced the split Grow implementation (inline stub + separate external script tag) with the canonical single-tag initializer snippet provided by Grow.

### Verification (local)

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (25/25)
- `npm run test:e2e` ✅ (100/100)

### Next step (production)

- Deploy (commit + push) then re-run Grow portal “Check Grow Connectivity”.

---

## 2026-01-14 - Codex (GPT-5.2) - Add Privacy Policy page for Monumetric approval

**Goal:** Add a crawler-visible Privacy Policy page containing Monumetric’s required disclosure text and provide a stable link for Monumetric onboarding.
**Status:** ✅ Complete + locally verified (all 4 gates via `ai:verify`) + ready to deploy.

### Changes (minimal)

- `app/privacy-policy/page.tsx`: new Privacy Policy page with Monumetric “Publisher Advertising Privacy” disclosure and link.
- `components/footer.tsx`: add `Privacy Policy` link in the global footer (sitewide).
- `app/sitemap.ts`: include `/privacy-policy` in sitemap.

### Verification (bundle)

- `reports/verification/2026-01-14T20-23-25/summary.md`
