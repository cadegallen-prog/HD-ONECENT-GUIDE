# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here (trim only when entries exceed 7). Git history preserves everything.

---

## 2026-02-19 - Codex - Added `dev:reset-3001` One-Command Local Recovery

**Goal:** Give the founder a single command to recover when port `3001` is stuck/in use but `localhost:3001` is not loading.

**Status:** ✅ Completed

### Changes

- Added `scripts/dev-reset-3001.mjs`:
  - checks `http://localhost:3001` health,
  - kills `3001` listener(s) only when unhealthy (or when explicitly forced),
  - starts `npm run dev` automatically after reset.
- Added npm scripts in `package.json`:
  - `dev:reset-3001`
  - `dev:Reset-3001` (alias matching founder-requested command style)
  - `dev:reset-3001:cleanup`
  - `dev:Reset-3001:cleanup` (mixed-case cleanup alias)
  - `dev:reset-3001:force`
- Updated `docs/skills/local-dev-faststart.md` with the new command and helper variants.
- Fixed Windows process-launch reliability in the helper by using shell mode for `npm run dev` spawn.

### Verification

- `npm run dev:reset-3001:cleanup` ✅
- `npm run dev:Reset-3001:cleanup` ✅
- `node scripts/dev-reset-3001.mjs --help` ✅
- `npm run ai:memory:check` ✅
- `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run verify:fast` ✅
- `npm run e2e:smoke` N/A (no route/form/API/navigation/UI-flow change)

---

## 2026-02-19 - Codex - Submit-Flow Name Quality Guard (Prevent Generic Name Lock-In)

**Goal:** Reduce founder manual cleanup by preventing low-quality item names from persisting when better enrichment names are available.

**Status:** ✅ Completed

### Changes

- Added `lib/item-name-quality.ts` with deterministic helpers:
  - `isLowQualityItemName(...)`
  - `shouldPreferEnrichedName(...)`
- Updated `app/api/submit-find/route.ts`:
  - Main payload now prefers enrichment `item_name` only when it is clearly better than user text.
  - Realtime SerpApi path can now replace an existing low-quality non-empty `item_name` when a better name is returned.
  - Canonical-gap detection now treats low-quality `item_name` as a gap, allowing quality remediation.
- Added regression coverage:
  - `tests/item-name-quality.test.ts` (quality heuristics)
  - `tests/submit-find-route.test.ts` new case ensuring low-quality enrichment does **not** overwrite a better user name.

### Verification

- `npm run test:unit` ✅
- `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run verify:fast` ✅
- `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run e2e:smoke` ✅
- Operational check: `npm run warm:staging` ✅
  - `upserted_to_staging: 1107`
  - `error_count: 0`

---

## 2026-02-19 - Codex - Coast Headlamp Name Correction (SKU 1014011639)

**Goal:** Review prior agent work on the Coast headlamp listing and correct the wrong display name path end-to-end.

**Status:** ✅ Completed

### Changes

- Audited the prior SKU-page patch and traced the active data path for `SKU 1014011639`.
- Confirmed live row issue: `item_name` was `"Coast headlamp"` while enrichment fields (brand/model/upc/image/internet SKU/url/price) were already present.
- Ran the canonical manual-enrichment workflow for this SKU with corrected product title:
  - `Coast FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp`
  - This updated both Item Cache and the existing `Penny List` row/provenance.
- Kept the SKU page brand-strip guard in `app/sku/[sku]/page.tsx` (prevents collapsing to one-word generic names).
- Added a list/table display normalization hardening in `lib/penny-list-utils.ts` so model-style tokens (letters+digits) stay uppercase (for example `FLX65R`, `M18`).
- Added regression assertions in `tests/penny-list-utils.test.ts` for the new normalization behavior.

### Verification

- `npm run manual:enrich -- -- --json {...}` ✅
  - Summary: `cache_upserted: 1`, `penny_rows_updated_by_manual: 1`, `penny_rows_failed: 0`
  - Report: `reports/manual-enrich/2026-02-19T06-12-21.178Z.json`
- DB verification query for `home_depot_sku_6_or_10_digits = 1014011639` ✅
  - Confirmed `item_name` now equals `Coast FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp`
  - Confirmed `enrichment_provenance.item_name.source = manual`
- `npx tsx -e "normalizeProductName(...)"` ✅
  - Confirmed list-display normalization now yields `FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp`
- `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run verify:fast` ✅
- `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run e2e:smoke` ✅
- `npm run ai:proof -- test /penny-list /sku/1014-011-639` ✅
  - Proof bundle: `reports/proof/2026-02-19T06-27-00/`
  - Note: console report includes one `404` static-resource error on `/sku/1014-011-639` (`console-errors.txt`).

---

## 2026-02-18 - Codex - Remove "Back to Penny List" Across Trust/Legal Pages

**Goal:** Remove the shared "Back to Penny List" UI from About/Contact/Privacy/Terms/Do-Not-Sell pages.

**Status:** ✅ Completed

### Changes

- Updated `components/legal-back-link.tsx` to return `null`.
- Because this component is shared, the backlink was removed everywhere it was rendered:
  - `/about`
  - `/contact`
  - `/privacy-policy`
  - `/terms-of-service`
  - `/do-not-sell-or-share`
- Confirmed no remaining `"Back to Penny List"` string in app/components.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run lint:colors` ✅
- `npm run ai:proof -- /about /contact /privacy-policy /terms-of-service /do-not-sell-or-share` ✅
  - Proof bundle: `reports/proof/2026-02-18T08-46-35/`
  - Includes light/dark route screenshots + console report.
  - Note: console report contains existing dev-mode hydration mismatch noise tied to global script injection order.

---

## 2026-02-18 - Codex - Homepage Guide-First Flow + Navigation/Footer Consistency Cleanup

**Goal:** Shift first-time user flow to Guide-first while preserving a fast Penny List path for returning users.

**Status:** ✅ Completed

### Changes

- Updated homepage hero in `app/page.tsx`:
  - New H1 and explanatory subtext focused on first-visit clarity/trust.
  - Primary CTA switched to `Start with the Guide` (`/guide`).
  - Secondary text link set to `Already read the guide? Browse Penny List`.
  - Added trust row beneath hero CTAs using community/source framing.
- Updated navigation in `components/navbar.tsx`:
  - Header order is now `Guide`, `Penny List`, `My List`, `Report a Find`, `Store Finder`, `FAQ`.
  - Guide default action now routes directly to `/guide` hub on desktop and mobile.
  - Guide chapter jump menu remains available via a dedicated chevron toggle on desktop and mobile.
- Updated footer and supporting labels for IA consistency:
  - `components/footer.tsx` Navigate links now match the same priority order as the header.
  - Removed external `Community` quick-link from footer Navigate list.
  - Consolidated footer disclaimer placement so copyright + non-affiliation read as one line.
- Removed user-facing "Support" wording from homepage UI:
  - `app/page.tsx` section heading changed from `Transparency & Support` to `Transparency & Contact`.
  - `app/page.tsx` CTA label changed from `Contact Support` to `Contact`.
- Normalized command palette label in `components/command-palette.tsx`:
  - `Community Penny List` -> `Penny List`.
- Updated smoke assertion in `tests/smoke-critical.spec.ts` for the new homepage H1 copy.
- Updated guide-nav Playwright coverage in `tests/basic.spec.ts` so mobile assertions target the menu container and the new guide-toggle behavior.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run lint:colors` ✅
- `npx playwright test tests/basic.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
- `npm run ai:proof -- / /guide /penny-list /transparency` ✅
  - Proof bundle: `reports/proof/2026-02-18T08-26-14/`
  - Includes light/dark route screenshots and console report.
  - Note: console report contains existing dev-mode hydration mismatch noise tied to external script injection order.
