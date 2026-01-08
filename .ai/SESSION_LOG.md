# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-08 - Codex (GPT-5.2) - SEO landing pages + sitemap

**Goal:** Improve Google rankings for "Home Depot penny items" / "penny list" / "how to find penny items" by adding intent-matching landing pages and strengthening crawl paths.

**Outcome:**

- Added 3 intent-matching SEO landing pages that funnel to `/guide` and `/penny-list`.
- Added these pages to `app/sitemap.ts` so Google discovers them quickly.
- Fixed a Windows-only Playwright build flake by cleaning `.next/` before the Playwright build.

**Files Modified:**

- `app/home-depot-penny-items/page.tsx`
- `app/home-depot-penny-list/page.tsx`
- `app/how-to-find-penny-items/page.tsx`
- `app/sitemap.ts`
- `playwright.config.ts`

**Verification (Proof):**

- `npm run lint` ?
- `npm run build` ?
- `npm run test:unit` ? (21/21)
- `npm run test:e2e` ? (92/92)

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

- ? `npm run lint` (0 errors, 0 warnings)
- ? `npm run build` (production build successful)
- ? Screenshots pending (320, 360, 375, 1280px at light/dark)
- ? Playwright visual regression testing pending

---

## 2026-01-08 - GitHub Copilot (GPT-5.2) - Standardize THD thumbnails to 400px

**Goal:** Make thumbnail loading reliable (no 404s/blank images) while keeping all quality gates green.

**Root cause:** The codebase had conflicting intent vs. reality: some components were still requesting the `-64_300` variant even though that size isn't consistently available across products.

**Outcome:**

- Standardized thumbnail requests back to the more reliable `-64_400` variant in the Penny List cards and the homepage "Today's Finds" module.

**Changes Made:**

- `components/penny-list-card.tsx`
- `components/todays-finds.tsx`

**Verification (Proof):**

- ? `npm run lint`
- ? `npm run build`
- ? `npm run test:unit` (21/21)
- ? `npm run test:e2e` (92/92)

---

## 2026-01-08 - Codex (GPT-5.2) - Penny List bookmark banner (returning users)

**Goal:** Increase returning visitors by nudging users to bookmark the Penny List without using an intrusive popup.

**Outcome:**

- Added a small, dismissible bookmark banner on `/penny-list` that appears after scroll or ~20 seconds and never shows again after dismissal.
- Added quick “How to bookmark” instructions (iPhone/Android/Desktop) inside a `<details>` disclosure.
- Added two analytics events for measurement (`bookmark_banner_shown`, `bookmark_banner_dismissed`).
- Hardened `scripts/ai-proof.ts` to avoid `networkidle` hangs/resets (uses retries + non-full-page screenshots).

**Files Modified:**

- `components/penny-list-client.tsx`
- `components/penny-list-page-bookmark-banner.tsx`
- `lib/analytics.ts`
- `scripts/ai-proof.ts`

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (21/21)
- `npm run test:e2e` ✅ (92/92)
- Playwright screenshots: `reports/proof/2026-01-08T22-13-12/`
