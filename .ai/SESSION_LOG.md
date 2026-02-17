# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here (trim only when entries exceed 7). Git history preserves everything.

---

## 2026-02-17 - Codex - Manual Add Live Upsert Validation + Fixture-Target Guardrails

**Goal:** Confirm whether `data/penny-list.json` should be used for live upserts (it should not), process founder-provided missing-item payload into Supabase, and harden wording/rules to prevent future agent confusion.

**Status:** ✅ Completed (live upsert done, verification done, guardrails clarified).

### Changes

- Live data handling clarification:
  - Confirmed `data/penny-list.json` is local fixture/fallback data and not the production write target.
  - Updated founder-facing admin copy in `app/admin/dashboard/page.tsx`:
    - Removed instruction to edit `penny-list.json`.
    - Added explicit `/manual` + Supabase workflow guidance.
  - Reinforced policy in `AGENTS.md` Data Quality section:
    - Never use `data/penny-list.json` for live upserts.
- Founder payload upserted to Supabase:
  - Executed `npm run manual:enrich -- -- --input ./.local/cade-manual-payload-2026-02-17.json`.
  - Result summary:
    - `received_items: 14`
    - `cache_upserted: 14`
    - `penny_rows_updated_by_manual: 19`
    - `penny_rows_failed: 0`
  - Verified live presence via Supabase query script:
    - `unique_skus_found: 14`
    - `missing: []`

### Verification

- `npm run manual:enrich -- -- --input ./.local/cade-manual-payload-2026-02-17.json` ✅
- Supabase verification query via `npx tsx -e "<verification script>"` ✅ (`14/14` SKUs found; none missing)
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run check:docs-governance` ✅

---

## 2026-02-17 - Codex - Canonical Enrichment Rollout (Main List -> Item Cache -> Web Scraper -> Manual Add)

**Goal:** Implement the founder-approved canonical enrichment flow end-to-end, including non-consuming Item Cache apply/backfill, `/manual` ingestion, warmer skip fix, command wiring, docs, and verification.

**Status:** ✅ Completed (code + migration + docs + tests updated, verification green).

### Changes

- Database rollout:
  - Added `supabase/migrations/029_item_cache_apply_and_auto_backfill.sql`:
    - Shared merge helper `_item_cache_enrichment_core(...)`.
    - Backward-compatible consume RPC (`consume_enrichment_for_penny_item`).
    - New non-consuming apply RPC (`apply_item_cache_enrichment_for_penny_item`).
    - SKU and bulk backfill RPCs:
      - `backfill_penny_list_from_item_cache_for_sku`
      - `backfill_penny_list_from_item_cache`
    - Auto-backfill trigger on `enrichment_staging` insert/update.
- Submit route order hardening (`app/api/submit-find/route.ts`):
  - Keeps Main List self-enrichment first (best complete/recent row selection).
  - Applies Item Cache via non-consuming RPC after insert.
  - Always checks Web Scraper fallback after Item Cache apply; scraper exits immediately when no gaps remain.
- Item Cache backfill command:
  - Added `scripts/backfill-item-cache.ts`.
  - Added package scripts:
    - `npm run backfill:item-cache`
    - `npm run backfill:staging` (alias)
- Manual Add command:
  - Added `scripts/manual-enrich.ts`.
  - Supports single JSON object, JSON array, or keyed-object payload.
  - Accepts `/manual` prefix and fenced JSON input.
  - Upserts into Item Cache, then applies to matching Main List rows.
  - Added package script `npm run manual:enrich`.
- Warmer eligibility fix (`scripts/staging-warmer.py`):
  - Replaced skip-all-existing-SKU behavior with skip-only-fully-enriched-SKU behavior.
  - Partial/unenriched Main List SKUs are now eligible for Item Cache refresh/backfill.
- Test updates:
  - `tests/submit-find-route.test.ts`:
    - Asserts non-consuming Item Cache RPC call after insert.
    - Asserts best-self-enrichment row selection logic.
- Docs/terminology updates:
  - Added `docs/ENRICHMENT_CANON.md`.
  - Updated `docs/skills/run-local-staging-warmer.md`.
  - Updated `docs/SCRAPING_COSTS.md`.
  - Updated `AGENTS.md` with mandatory `/manual` agent behavior.
- Learning captured:
  - Updated `.ai/LEARNINGS.md` with npm arg-forwarding safety note (`0d`) for dry-run flags.
- Validation incident handled:
  - A first `npm run manual:enrich -- --dry-run` check did not forward the flag in this npm setup and performed one live Item Cache upsert test.
  - Immediately restored the affected sample SKU cache row to canonical values.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run check:docs-governance` ✅
- `npm run ai:memory:check` ✅
- `npx tsx scripts/manual-enrich.ts --dry-run` (stdin `/manual` payload) ✅
- `npm run manual:enrich -- -- --help` ✅
- `npm run backfill:item-cache -- -- --help` ✅
- No UI changes in this session (Playwright screenshot lane N/A).

---

## 2026-02-16 - Codex - Reset Recovery + Guide/Header Clarity Reapply

**Goal:** Recover from accidental local hard reset on `main`, then re-apply the founder-requested guide/header clarity fixes without touching unrelated privacy/legal scope.

**Status:** ✅ Completed (repo recovered, scoped UX/copy changes restored, local verification green).

### Changes

- Git state recovery:
  - Confirmed reflog reset event (`reset: moving to HEAD~1`) and local `main` drift (`behind 2`).
  - Restored local branch safely with fast-forward only:
    - `git pull --ff-only origin main`
  - No destructive history rewrite used.
- Re-applied scoped guide/copy fixes:
  - `app/inside-scoop/page.tsx`
    - Clarified ambiguous “supporting signal” language.
    - Replaced confusing “report” phrasing with “community posts/firsthand accounts”.
    - Clarified `.02` wording as ending-in-.02 signal (not a two-cent item).
  - `app/guide/page.tsx`
    - Removed duplicate “Where should you start?” card block.
    - Replaced top secondary CTA (`/report-find`) with `/penny-list`.
    - Removed direct Report a Find utility link from guide hub and reframed as post-confirmation action.
  - `components/navbar.tsx`
    - Reduced crowded top-level nav by removing `About` and `Contact`.
    - Converted desktop Guide submenu to click-toggle.
    - Added dismissal on link click, outside click, route change, and `Escape`.
    - Reordered guide submenu to `Step 0` (Guide Hub) through `Step 6` on desktop + mobile.
  - `tests/basic.spec.ts`
    - Updated desktop assertion for Guide button behavior and mobile submenu text expectation.
- Scope guard outcome:
  - No edits to privacy-policy/about/constants/cookie-banner in this session.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx playwright test tests/basic.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
- `npm run lint:colors` ✅
- `npm run ai:proof -- /guide /inside-scoop` ✅
  - `reports/proof/2026-02-16T23-03-18/guide-light.png`
  - `reports/proof/2026-02-16T23-03-18/guide-dark.png`
  - `reports/proof/2026-02-16T23-03-18/inside-scoop-light.png`
  - `reports/proof/2026-02-16T23-03-18/inside-scoop-dark.png`
  - `reports/proof/2026-02-16T23-03-18/guide-dropdown-open-desktop.png`
  - `reports/proof/2026-02-16T23-03-18/guide-dropdown-after-select-desktop.png`
  - `reports/proof/2026-02-16T23-03-18/guide-dropdown-open-mobile.png`
  - `reports/proof/2026-02-16T23-03-18/guide-dropdown-after-select-mobile.png`
- Known non-blocking console noise:
  - Dev-mode hydration mismatch in proof bundle (`reports/proof/2026-02-16T23-03-18/console-errors.txt`), unchanged from existing baseline behavior.

---

## 2026-02-16 - Codex - Internal Systems Route Retirement + Reference Scrub (Ad Review Hardening)

**Goal:** Remove `/internal-systems` as a thin public page, scrub active references from runtime/test surfaces, and verify strict crawler-safe behavior for Ad Manager/AdSense readiness.

**Status:** ✅ Completed (local verification green; ready for `dev` -> `main` promotion in this session).

### Changes

- Route retirement:
  - Deleted `app/internal-systems/page.tsx` from the app surface.
  - Added permanent redirects in `next.config.js`:
    - `/internal-systems` -> `/guide`
    - `/internal-systems/:path*` -> `/guide`
- Reference scrub (active code paths):
  - Removed `/internal-systems` from route-policy exclusion constants/matrix in `lib/ads/route-eligibility.ts`.
  - Removed internal-systems mention from active sitemap notes in `app/sitemap.ts`.
  - Updated tests to remove obsolete `/internal-systems` noindex expectations:
    - `tests/adsense-readiness.spec.ts`
    - `tests/sitemap-canonical.test.ts`
  - Removed stale route entry from `ROUTE-TREE.txt`.
- Crawler posture preserved:
  - Sitemap remains pillar-only and unchanged at 18 URLs.
  - Legacy utility route is now retired behind permanent redirect instead of serving thin indexed/noindex content.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅ (192 passed)

---

## 2026-02-16 - Codex - Transparency Naming + Internal Systems Route Hardening (Dev -> Main -> Production)

**Goal:** Remove trust-page naming drift ("Transparency & Funding"), fix `/internal-systems` crawler behavior, and deploy with full verification evidence before founder Search Console + AdSense resubmission.

**Status:** ✅ Completed and live on production.

### Changes

- Canonical trust naming alignment:
  - Updated public labels from `Transparency & Funding` -> `Transparency` in:
    - `components/footer.tsx`
    - `app/page.tsx`
    - `app/guide/page.tsx`
  - Updated top-level product description in `README.md` to match.
- `/internal-systems` route fix:
  - Replaced broken hash redirect (`/#internal-systems`) with a real page response in `app/internal-systems/page.tsx`.
  - Added explicit noindex metadata and canonical route metadata for crawler clarity.
- Legacy route canonicalization:
  - Updated `app/support/page.tsx` from temporary redirect to permanent redirect (`308`) -> `/transparency`.
- Sitemap/crawler hardening:
  - Clarified intentional sitemap exclusions in `app/sitemap.ts` (legacy/utility routes).
  - Expanded regression checks:
    - `tests/adsense-readiness.spec.ts` now verifies `/internal-systems` emits `noindex, nofollow`.
    - `tests/adsense-readiness.spec.ts` and `tests/sitemap-canonical.test.ts` now assert sitemap excludes `/support` and `/internal-systems`.
- Test reliability hardening:
  - Fixed mobile nav assertion drift in `tests/basic.spec.ts` (mobile now validates Guide button + submenu behavior).
  - Updated `tests/support.spec.ts` to match canonical transparency heading/content.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅ (192 passed)
- CI for merge commit `e9b7552c13e63de042c117c3b240de339c62c39a`:
  - FAST ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22059947502`
  - E2E Smoke ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22059947496`
  - Full QA ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22059947512`
- Production checks (`https://www.pennycentral.com`) after deploy:
  - `/support` returns `308` -> `/transparency` ✅
  - `/internal-systems` returns `200` with `<meta name="robots" content="noindex, nofollow">` ✅
  - `/sitemap.xml` has exactly `18` URLs and excludes `/support` + `/internal-systems` ✅
  - Homepage no longer shows `Transparency & Funding` label ✅
