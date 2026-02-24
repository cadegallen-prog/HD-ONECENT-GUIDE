# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-02-24 - Codex - Visual Pointer Anchor Disambiguation (Store-Finder Directions)

**Goal:** Remove the remaining Visual Pointer anchor ambiguity by giving mobile and desktop store-finder directions links distinct `data-pc-id` values.

**Status:** ✅ Completed

### Changes

- `components/store-map.tsx`
  - mobile directions anchor changed to `store-finder.popup-directions-mobile`.
- `lib/visual-pointer/source-registry.ts`
  - `store-finder.popup-directions` now maps to desktop popup source line,
  - added `store-finder.popup-directions-mobile` mapping to mobile popup source line.
- `tests/source-registry.test.ts`
  - added explicit test coverage for `store-finder.popup-directions-mobile`.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/source-registry.test.ts` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- --mode=dev /store-finder` ✅
  - Proof artifacts: `reports/proof/2026-02-24T07-44-21/`

---

## 2026-02-24 - Codex - Carryover Closure (Visual Pointer Hardening + SKU Name Normalization Reuse)

**Goal:** Finish and ship the previously dirty carryover scope on `dev`.

**Status:** ✅ Completed

### Changes

- `app/sku/[sku]/page.tsx` now reuses `normalizeProductName(...)` for title cleanup.
- `lib/penny-list-utils.ts` preserves captured acronym casing during normalization.
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

**Goal:** Enforce strict trusted-source `item_name` priority and clear the blocking unit mismatch.

**Status:** ✅ Completed

### Changes

- `app/api/submit-find/route.ts`
  - trusted source precedence for `item_name` (`staging`, `serpapi`, `manual`) with guarded realtime updates.
- `tests/submit-find-route.test.ts`
  - updated/expanded trusted-source coverage.
- `tests/penny-list-utils.test.ts`
  - aligned expectation to current normalization behavior (`M18 FUEL`).

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/submit-find-route.test.ts` ✅
- `npx tsx --import ./tests/setup.ts --test tests/penny-list-utils.test.ts` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅

---

## 2026-02-23 - Codex - Visual Pointer v1 Hardening (Source Precision + Anchored Capture + 390x844)

**Goal:** Close key Visual Pointer v1 plan drift for source precision, anchored capture assertions, and dual mobile viewport coverage.

**Status:** ✅ Completed

### Changes

- `lib/visual-pointer/source-registry.ts`:
  - replaced placeholder line metadata,
  - corrected ownership mappings for filters/cards.
- `tests/source-registry.test.ts`:
  - owner mapping assertion update,
  - `line > 0` assertions.
- `tests/visual-pointer-capture.spec.ts`:
  - anchored `/penny-list` + `/store-finder` checks,
  - unanchored fallback check.
- `playwright.config.ts`: added `chromium-mobile-light-390x844`.
- `scripts/visual-pointer-proof.ts`: accepts `--artifact` or positional path.

### Verification

- targeted source-registry + capture specs ✅
- `npm run e2e:smoke` ✅
- `npm run verify:fast` was blocked at the time by unrelated carryover in `lib/penny-list-utils.ts` (resolved in later session).

---

## 2026-02-22 - Codex - Visual Pointing Tool v1 Canonical Plan (Two-Route Pilot)

**Goal:** Publish a decision-complete canonical plan for the dev-only visual pointing pilot (`/penny-list`, `/store-finder`).

**Status:** ✅ Completed (planning-only)

### Changes

- Added `.ai/impl/visual-pointing-tool.md` with:
  - contract definitions,
  - route anchor inventory,
  - sliced implementation sequence with acceptance/rollback/verification per slice.
- Updated `.ai/STATE.md` to reflect canonical plan availability.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
- Runtime lanes N/A (docs-only planning work)
