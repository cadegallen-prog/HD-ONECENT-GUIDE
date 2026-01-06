# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-06 - ChatGPT Codex (GPT-5.2) - Fix barcode blank renders + add audit counts

**Goal:** Stop the barcode modal from showing a blank white box, and produce hard numbers explaining why “everything looks recent” after importing historical purchases.

**Outcome:**

- Barcode modal now validates UPC-A/EAN-13 check digits and falls back to `CODE128` when invalid, so `JsBarcode` won’t render blank.
- Added `scripts/print-penny-list-count.ts` + `npm run penny:count` to print: total reports, distinct SKUs, enriched vs. unenriched, and “last 1m” by last-seen semantics vs. “last 1m” by submission timestamp.
- Fixed Playwright strict-mode failure by targeting the state breakdown sheet dialog via `aria-labelledby="state-breakdown-title"`.

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅ (92/92; screenshots in `reports/proof/`)

## 2026-01-05 - ChatGPT Codex (GPT-5.2) - Penny List Option A: date/sort consistency + window label clarity

**Goal:** Fix Penny List "wrong dates" perception + broken "Newest First" behavior by aligning defaults and making recency/window labeling consistent.

**Outcome:**

- Fixed root-cause mismatch: client defaulted to `1m` but treated `6m` as the "default" in URL sync + fetch logic.
- Standardized the window label shown on cards/table to **(30d)** instead of ambiguous `(1m)`.
- Made "Newest/Oldest" sorting use `lastSeenAt` (purchase date when present/valid, else report timestamp) for consistency with "Last seen".
- Tightened date window filtering to use "last seen" semantics (purchase date when present, else timestamp).

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅
- Playwright screenshots created:
  - `reports/proof/penny-list-mobile-light-redesign.png`
  - `reports/proof/penny-list-mobile-dark-redesign.png`
  - `reports/proof/penny-list-desktop-table-light-redesign.png`
  - `reports/proof/penny-list-desktop-table-dark-redesign.png`
  - `reports/proof/penny-list-state-breakdown-sheet-open.png`

## 2026-01-05 - ChatGPT Codex (GPT-5.2) - Normalize purchase_date parsing for last seen

**Goal:** Prevent historical imports from appearing “recent” by ensuring `purchase_date` remains authoritative for “last seen”.

**Outcome:**

- Added `parsePurchaseDateValue` so timestamp-like `purchase_date` strings parse correctly and don’t fall back to submission `timestamp`.
