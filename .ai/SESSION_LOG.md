# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-02-25 - Codex - Monumetric CSP Update + Verify Stall Root-Cause Fix

**Goal:** Complete Monumetric CSP blocker remediation and stop repeated local verification stalls before they consume more founder time.

**Status:** ✅ Completed (with founder-directed non-build verification lane)

### Changes

- `next.config.js`
  - added both Monumetric-requested `script-src` domains:
    - `https://securepubads.g.doubleclick.net`
    - `https://cdn.confiant-integrations.net`
- `package.json`
  - added `build:verify` using isolated output dir (`NEXT_DIST_DIR=.next-playwright`) to reduce `.next` contention risk.
  - updated `verify:fast` to call `build:verify`.
  - updated `test:unit` to force deterministic env: `SUBMIT_FIND_DRY_RUN=false`.
- `scripts/run-unit-tests.mjs`
  - added hard timeout support (`UNIT_TEST_TIMEOUT_MS`, default 10m).
  - added explicit timeout failure handling (exit `124`) so hangs fail fast with clear messaging.
- `tests/setup.ts`
  - silenced dotenv tip noise (`quiet: true`) for cleaner unit output.
- Scope hygiene:
  - removed unrelated carryover edit from `.claude/settings.local.json` via explicit founder approval.

### Verification

- `npm run ai:memory:check` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm run test:unit` ✅
- `npx tsx scripts/ads-readiness-check.ts --production` ✅ (7/7 passed)
- Endpoint checks (production):
  - `curl -D - https://www.pennycentral.com` ✅ (CSP header present, current production still pending deploy for new domains)
  - `curl https://www.pennycentral.com | rg "monu.delivery/site"` ✅ (Monumetric head script present)
  - `curl -I https://www.pennycentral.com/ads.txt` ✅ (`308` redirect to Monumetric hosted ads.txt)
  - `curl https://www.pennycentral.com/sitemap.xml` ✅ (`loc_count=18`, canonical trust routes present)
- Not run by explicit founder instruction:
  - `npm run verify:fast` (blocked: includes build)
  - `npm run e2e:smoke` (blocked: includes build)

---

## 2026-02-25 - Codex - Promote Full QA Stabilization Fixes to Main

**Goal:** Ensure production (`main`) includes the recent Full QA CI stabilization fixes already validated on `dev`.

**Status:** ✅ Completed

### Changes

- Promoted `dev` into `main` with merge commit `345a22f`:
  - carried `5509098` (`fix(ci): stabilize full-qa playwright lanes`)
  - carried `6950a54` (`fix(ci): sync chromedriver before axe checks`)
- Switched branch back to `dev` after promotion, as requested.

### Verification

- Branch containment check before promotion:
  - `git diff --name-status origin/main..origin/dev` showed missing fix files on `main`:
    - `.github/workflows/full-qa.yml`
    - `playwright.config.ts`
    - `tests/live/console.spec.ts`
- Promotion commands:
  - `git checkout dev`
  - `git pull origin dev`
  - `git checkout main`
  - `git pull origin main`
  - `git merge --no-ff origin/dev -m "Merge dev: promote full QA CI stabilization fixes"`
  - `git push origin main`
  - `git checkout dev`
- Post-push CI on `main` SHA `345a22fb2b7406f383af603d0ca3d3d8682cb52e`:
  - FAST: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22409205329` (in progress at handoff time)
  - SMOKE: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22409205277` (in progress at handoff time)
  - FULL: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22409205332` (queued at handoff time)
- Session-end branch hygiene:
  - current branch: `dev`
  - `git status --short`: clean

---

## 2026-02-25 - Codex - Full QA CI Stabilization (Visual Pointer + Axe Driver Sync)

**Goal:** Recover failing Full QA runs by fixing deterministic Playwright/CI infra mismatches without changing product behavior.

**Status:** ✅ Completed

### Changes

- `playwright.config.ts`
  - forced `chromium-mobile-light-390x844` to `browserName: "chromium"` so CI no longer tries to launch missing WebKit binaries.
- `.github/workflows/full-qa.yml`
  - set `NEXT_PUBLIC_VISUAL_POINTER_ENABLED: "true"` for `full-e2e` job to allow visual-pointer capture tests in production-style Playwright builds.
  - added `Sync ChromeDriver with runner Chrome` step (`npx browser-driver-manager install chrome`) before `check-axe` in `extended-ui-checks`.
- `tests/live/console.spec.ts`
  - increased test timeout to 180s to prevent false failures from slow external page loads during console-audit runs.

### Verification

- `npm run ai:memory:check` ✅
- `$env:SUBMIT_FIND_DRY_RUN='false'; npm run verify:fast` ✅
- `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_VISUAL_POINTER_ENABLED='true'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; $env:USE_FIXTURE_FALLBACK='1'; $env:SUPABASE_SERVICE_ROLE_KEY='test'; npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --project=chromium-desktop-dark --project=chromium-mobile-light --project=chromium-mobile-dark --project=chromium-mobile-light-390x844 --workers=1` ✅
- `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; $env:USE_FIXTURE_FALLBACK='1'; $env:SUPABASE_SERVICE_ROLE_KEY='test'; npx playwright test tests/live/console.spec.ts --project=chromium-desktop-dark --workers=1` ✅
- Manual Full QA workflow on `dev` (`6950a54cf9922c76dd4b7a4d6fc3a0e510d4f591`): `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22408795587` ✅
  - `fast-gate` ✅
  - `full-e2e (1/2)` ✅
  - `full-e2e (2/2)` ✅
  - `extended-ui-checks` ✅

---

## 2026-02-25 - Codex - Submit-Find Canonical Name Authority Lock + SKU-Only Report Input

**Goal:** Ensure user-submitted item names never become canonical authority, align report-find UX to SKU-only manual submission, and ship with full verification.

**Status:** ✅ Completed

### Changes

- `app/api/submit-find/route.ts`
  - `itemName` is now optional input-only compatibility data,
  - canonical `item_name` assignment now comes from self-enrichment/trusted enrichment paths only,
  - trusted `item_name` provenance now accepts `self_enriched`,
  - added canonical-signal fallback logic so prior self-enriched names can still be reused when provenance metadata is missing.
- `components/report-find/ReportFindFormClient.tsx`
  - removed manual `Item Name` input from Add Item UX,
  - manual basket adds now use SKU + optional quantity only,
  - API payload mapping no longer sends `itemName`,
  - display fallback now renders `SKU {formatted}` when no prefill name exists.
- `app/report-find/page.tsx`
  - updated static explainer copy to remove “Item name required” guidance and document trusted auto-resolution.
- Tests updated:
  - `tests/submit-find-route.test.ts`
  - `tests/report-find-batch.spec.ts`
  - `tests/report-find-prefill.spec.ts`
  - `tests/smoke-critical.spec.ts`

### Verification

- `npm run ai:memory:check` ✅
- `$env:SUBMIT_FIND_DRY_RUN='false'; npx tsx --import ./tests/setup.ts --test tests/submit-find-route.test.ts` ✅
- `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; npx playwright test tests/report-find-prefill.spec.ts tests/report-find-batch.spec.ts tests/smoke-critical.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `$env:SUBMIT_FIND_DRY_RUN='false'; npm run verify:fast` ✅
- `npm run e2e:smoke` ✅

---

## 2026-02-25 - Codex - SKU Name Regression Fix (Item Cache Source + Name Downgrade Guard)

**Goal:** Stop low-quality names (for example `"Item One"`) from overriding canonical item names, and restore display-time enrichment reads to the active Item Cache table path.

**Status:** ✅ Completed

### Changes

- `lib/fetch-penny-data.ts`
  - enrichment overlay now queries `enrichment_staging` first (aliased to expected enrichment fields),
  - legacy fallback to `penny_item_enrichment` is retained for compatibility,
  - display-name replacement now uses quality-aware comparison (`shouldPreferEnrichedName`) so low-quality newer names cannot downgrade a detailed existing name.
- `tests/fetch-penny-data-aliases.test.ts`
  - added regression test proving a newer low-quality `"Item One"` row does not replace a detailed existing product name.
- `tests/fetch-penny-data-supabase-fallback.test.ts`
  - added test proving fetch overlay hydrates from `enrichment_staging`,
  - added fallback test proving legacy table fallback still works when staging is unavailable.
- `CLAUDE.md`
  - post-push CI follow-up: startup read-order now explicitly mentions `VISION_CHARTER.md` to satisfy governance drift checks.

### Verification

- `npm run ai:memory:check` ✅
- `npx tsx --import ./tests/setup.ts --test tests/fetch-penny-data-aliases.test.ts` ✅
- `npx tsx --import ./tests/setup.ts --test tests/fetch-penny-data-supabase-fallback.test.ts` ✅
- `npm run verify:fast` ✅ (executed with `$env:SUBMIT_FIND_DRY_RUN='false'` because local `.env.local` has `SUBMIT_FIND_DRY_RUN=true` for safe localhost testing)
- `npm run e2e:smoke` ✅
- `npm run check:docs-governance` ✅
