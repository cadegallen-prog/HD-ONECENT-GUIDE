# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

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

### Verification

- `npm run ai:memory:check` ✅
- `npx tsx --import ./tests/setup.ts --test tests/fetch-penny-data-aliases.test.ts` ✅
- `npx tsx --import ./tests/setup.ts --test tests/fetch-penny-data-supabase-fallback.test.ts` ✅
- `npm run verify:fast` ✅ (executed with `$env:SUBMIT_FIND_DRY_RUN='false'` because local `.env.local` has `SUBMIT_FIND_DRY_RUN=true` for safe localhost testing)
- `npm run e2e:smoke` ✅

---

## 2026-02-24 - Codex - Proof Noise Gating + Replay Robustness Hardening

**Goal:** Improve Visual Pointer proof fidelity by reducing irrelevant console noise and making replay more resilient.

**Status:** ✅ Completed

### Changes

- `scripts/ai-proof.ts`
  - blocks known third-party ad/analytics hosts during proof capture,
  - filters expected blocked-third-party console errors from `console-errors.txt`.
- `app/store-finder/page.tsx`
  - treats expected geolocation denials/timeouts as non-error paths,
  - only logs unexpected geolocation failures.
- `scripts/visual-pointer-proof.ts`
  - adds scroll-into-view + retry behavior in selector replay,
  - keeps positional artifact path support.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- /store-finder` ✅
  - artifact: `reports/proof/2026-02-24T09-31-18/`
  - console report: `reports/proof/2026-02-24T09-31-18/console-errors.txt` (`No console errors detected`)
- `npm run visual-pointer:proof -- reports/visual-pointing/manual-check-visible-2026-02-23T17-03-04/capture.json` ✅

---

## 2026-02-24 - Codex - Visual Pointer Anchor Disambiguation (Store-Finder Directions)

**Goal:** Remove remaining Visual Pointer anchor ambiguity by giving mobile and desktop store-finder directions links distinct `data-pc-id` values.

**Status:** ✅ Completed

### Changes

- `components/store-map.tsx`
  - mobile directions anchor changed to `store-finder.popup-directions-mobile`.
- `lib/visual-pointer/source-registry.ts`
  - `store-finder.popup-directions` maps to desktop line metadata,
  - added `store-finder.popup-directions-mobile` mapping to mobile line metadata.
- `tests/source-registry.test.ts`
  - added coverage for `store-finder.popup-directions-mobile`.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/source-registry.test.ts` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- /store-finder` ✅

---

## 2026-02-24 - Codex - Carryover Closure (Visual Pointer Hardening + SKU Name Normalization Reuse)

**Goal:** Finish and ship previously dirty carryover scope on `dev`.

**Status:** ✅ Completed

### Changes

- `app/sku/[sku]/page.tsx` now reuses `normalizeProductName(...)`.
- `lib/penny-list-utils.ts` preserves captured acronym casing.
- Visual Pointer hardening bundle landed across:
  - `lib/visual-pointer/source-registry.ts`
  - `playwright.config.ts`
  - `scripts/visual-pointer-proof.ts`
  - `tests/source-registry.test.ts`
  - `tests/visual-pointer-capture.spec.ts`

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/source-registry.test.ts` ✅
- `npx tsx --import ./tests/setup.ts --test tests/penny-list-utils.test.ts` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --project=chromium-mobile-light-390x844 --workers=1` ✅
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅

---

## 2026-02-24 - Codex - Submit-Find Name Priority Hardening + Unit Mismatch Resolution

**Goal:** Enforce strict trusted-source `item_name` priority and clear blocking unit mismatch.

**Status:** ✅ Completed

### Changes

- `app/api/submit-find/route.ts` trusted-source precedence for `item_name` with guarded realtime updates.
- `app/api/submit-find/route.ts` added `SUBMIT_FIND_DRY_RUN` safety mode (`true` => validate-only, no Supabase writes/RPC/SerpApi usage).
- `components/report-find/ReportFindFormClient.tsx` now surfaces dry-run copy and suppresses live-submit actions/analytics while dry-run is active.
- `tests/submit-find-route.test.ts` expanded trusted-source coverage.
- `tests/submit-find-route.test.ts` added dry-run regression coverage to verify no DB/RPC side effects.
- `.env.example` now documents `SUBMIT_FIND_DRY_RUN` so future agents/operators can test safely from localhost.
- `tests/penny-list-utils.test.ts` aligned expectation to `M18 FUEL`.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/submit-find-route.test.ts` ✅
- `npx playwright test tests/report-find-batch.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `npx tsx --import ./tests/setup.ts --test tests/penny-list-utils.test.ts` ✅
- `npm run verify:fast` ⚠️ blocked by unrelated pre-existing lint warnings in `app/store-finder/page.tsx`
- `npm run e2e:smoke` ✅

---
