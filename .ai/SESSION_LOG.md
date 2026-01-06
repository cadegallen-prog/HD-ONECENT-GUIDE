# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

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

## 2026-01-06 - ChatGPT Codex (GPT-5.2) - Test smaller image variants (mobile perf)

**Goal:** Reduce image download size for a performance test by switching Home Depot CDN images from `-64_1000.jpg` to smaller variants where possible.

**Outcome:**

- Added `toThdImageVariant(...)` and used it for `Today's Finds` and `Hot Right Now` thumbnails (300px variant).
- Penny List card thumbnail now renders at 250×250px and requests the 300px variant.

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅ (92/92)

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

## 2026-01-05 - ChatGPT Codex (GPT-5.2) - Penny List date/sort consistency + window label clarity

**Goal:** Fix Penny List "wrong dates" perception + broken "Newest First" behavior by aligning defaults and making recency/window labeling consistent.

**Outcome:**

- Standardized the window label shown on cards/table to **(30d)**.
- Made "Newest/Oldest" sorting follow `lastSeenAt` (purchase date when present/valid, else report timestamp).

## 2026-01-06 - ChatGPT Codex (GPT-5.2) - Fix Penny List thumbnail images disappearing

**Goal:** Some items (example: SKU `1010086378`) showed an image on the SKU page but the Penny List card thumbnail went blank.

**Root cause:** The Penny List card thumbnail was requesting a smaller Home Depot CDN variant (ex: `-64_300.jpg`), but some products don’t actually have that variant, so the `<img>` request 404s.

**Outcome:**

- `PennyThumbnail` now auto-falls back to the `-64_1000` variant if the requested Home Depot thumbnail variant fails to load.

**Changes Made:**

- `components/penny-thumbnail.tsx`

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (21/21)
- `npm run test:e2e` ✅ (92/92)
