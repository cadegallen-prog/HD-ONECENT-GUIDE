# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.


---

## 2026-01-08 - Claude (Opus 4.5) - Penny List Card Typography Restructuring

**Goal:** Fix cascading layout/typography issues on penny-list cards: brand/SKU truncation, item names too large, Save button duplication.

**Authorization:** Cade explicitly authorized redefining typography/layout constraints (2026-01-08).

**Root Causes:**
1. Item names at 16-18px competing with penny price for visual hierarchy
2. Layout too cramped at 320px (only ~156px effective text width)
3. Save button duplicated (top-right absolute + in action row)
4. Brand/SKU silently truncated by `overflow-hidden`

**Implementation:**
- Added 4 card-specific CSS utilities to globals.css (`.penny-card-name`, `.penny-card-brand`, `.penny-card-sku`, `.penny-card-price`)
- Reduced item name from 16-18px to 14px (all viewports)
- Reduced brand/SKU from 12px to 11px
- Reduced image from 72px to 64px
- Reduced card padding from 16px to 12px
- Removed top-right Save button, kept only in action row
- Removed `overflow-hidden` from Brand and SKU (now fully visible)

**Files Modified:**
- `app/globals.css` (+40 lines: 4 new utilities)
- `components/penny-list-card.tsx` (~20 lines changed)
- `.ai/CONSTRAINTS.md` (added exception section)
- `.ai/CONSTRAINTS_TECHNICAL.md` (added authorized exceptions note)

**Verification:**
- ✅ `npm run lint` passed (0 errors, 0 warnings)
- ✅ `npm run build` passed (production build successful)
- ⏳ Screenshots pending (320, 360, 375, 1280px at light/dark)
- ⏳ Playright visual regression testing pending

**Space Gained:** +64px horizontal space at 320px viewport (~40% gain)

**Next Session:** Run Playwright screenshots at 4 breakpoints × light/dark modes, verify accept criteria checklist.

---

## 2026-01-08 - GitHub Copilot (GPT-5.2) - Standardize THD thumbnails to 400px

**Goal:** Make thumbnail loading reliable (no 404s/blank images) while keeping all quality gates green.

**Root cause:** The codebase had conflicting intent vs. reality: some components were still requesting the `-64_300` variant even though that size isn’t consistently available across products.

**Outcome:**

- Standardized thumbnail requests back to the more reliable `-64_400` variant in the Penny List cards and the homepage "Today's Finds" module.

**Changes Made:**

- `components/penny-list-card.tsx`
- `components/todays-finds.tsx`

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (21/21)
- `npm run test:e2e` ✅ (92/92)

---

## 2026-01-06 - ChatGPT Codex (GPT-5.2) - Fix barcode blank renders + add audit counts

**Goal:** Stop the barcode modal from showing a blank white box, and produce hard numbers explaining why "everything looks recent" after importing historical purchases.

**Outcome:**

- Barcode modal now validates UPC-A/EAN-13 check digits and falls back to `CODE128` when invalid, so `JsBarcode` won't render blank.
- Added `scripts/print-penny-list-count.ts` + `npm run penny:count` to print: total reports, distinct SKUs, enriched vs. unenriched, and "last 1m" by last-seen semantics vs. "last 1m" by submission timestamp.
- Fixed Playwright strict-mode failure by targeting the state breakdown sheet dialog via `aria-labelledby="state-breakdown-title"`.

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅ (92/92; screenshots in `reports/proof/`)

---

## 2026-01-06 - ChatGPT Codex (GPT-5.2) - Fix stale homepage "Today's Finds"

**Goal:** SKU pages and Penny List updated immediately after enrichment fixes, but the homepage "Today's Finds" module could keep showing an old/wrong product.

**Root cause:** `/` was fully static, so it could serve stale "recent finds" until the next deploy.

**Outcome:**

- Enabled ISR for `/` so it refreshes periodically without redeploys.
- Set homepage revalidate to 5 minutes.

**Changes Made:**

- `app/page.tsx`

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅ (shows `/` revalidate `5m`)
- `npm run test:unit` ✅ (21/21)
- `npm run test:e2e` ✅ (92/92)
