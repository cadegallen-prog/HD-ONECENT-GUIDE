# Backlog (AI-Driven, Ordered)

**Last updated:** Jan 01, 2026  
Keep this list short and ruthless (≤10 items).

Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Implement + verify (proof required)
4. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## P0 - Do Next (Foundation / Data Pipeline)

### 1. Restore + standardize the “PennyCentral export” artifact (missing file)

- **Problem:** The open-tab path `C:\Users\cadeg\Downloads\pennycentral_export_2025-12-31.json` is missing, so we can’t methodically diff/merge scraped metadata against PennyCentral’s current data.
- **Done means:**
  - Define a canonical schema for `pennycentral_export_*.json` (at minimum: `storeSku`, `internetNumber`, `name`, `brand`, `imageUrl`, `productUrl`, `upc`, timestamps).
  - Implement `scripts/export-pennycentral-json.ts` that can generate the export from the real source of truth (Supabase/view) and/or fixture mode.
  - Default output goes to `.local/` (never committed).
- **Prompt/task for an agent (copy/paste):**
  - GOAL: Create a repeatable PennyCentral export JSON generator.
  - WHY: Enables safe diffs/merges vs scraped metadata; no one-shot manual comparisons.
  - DONE: `npm run export:pennycentral` writes `.local/pennycentral_export_YYYY-MM-DD.json` and a short `.local/pennycentral_export_YYYY-MM-DD.summary.md`.
  - FILES: `scripts/export-pennycentral-json.ts`, `package.json` (script), docs if needed.
  - VERIFY: `npm run lint && npm run build && npm run test:unit && npm run test:e2e`.

### 2. Validate + normalize the scrape JSON (make ingestion safe)

- **Input:** `C:\Users\cadeg\Downloads\penny_scrape_2025-12-31.json` (JSON object keyed by Home Depot URLs; values include `storeSku`, `internetNumber`, `name`, `brand`, `imageUrl`, `productUrl`, `upc`, `categories`, `scrapedAt`).
- **Done means:**
  - Implement `scripts/validate-scrape-json.ts` that:
    - Validates and normalizes SKU formats using `lib/sku.ts`.
    - Emits a deterministic summary (counts, missing fields, SKU-length histogram, % with images).
    - Writes cleaned output to `.local/` (e.g., `.local/penny_scrape_clean_YYYY-MM-DD.json`).
- **Prompt/task:**
  - GOAL: Add a scrape validator + cleaner.
  - WHY: Prevents “bad scrape” from polluting enrichment and makes downstream diffs reproducible.
  - DONE: `npm run scrape:validate -- --in <path>` prints a summary + writes cleaned output under `.local/`.
  - FILES: `scripts/validate-scrape-json.ts`, `package.json` (script), optionally tests.
  - VERIFY: gates + include sample output in `.ai/SESSION_LOG.md`.

### 3. Convert scrape-clean output to enrichment upload CSV (fill-blanks-only)

- **Policy:** fill blanks only; never overwrite non-empty enrichment fields unless explicitly `--force`.
- **Done means:**
  - Implement `scripts/scrape-to-enrichment-csv.ts` that produces `.local/enrichment-upload.csv` compatible with the current enrichment pipeline/table.
  - Deterministic ordering + stable headers for clean diffs.
- **Prompt/task:**
  - GOAL: Turn scrape JSON into a safe enrichment upload.
  - WHY: Adds images/brand/name/UPC/internet# at scale without touching crowdsourced report signal.
  - DONE: `npm run enrich:from-scrape -- --in <clean.json> --out .local/enrichment-upload.csv` works reliably.
  - FILES: `scripts/scrape-to-enrichment-csv.ts`, `package.json`.
  - VERIFY: gates + show row counts + top “missing field” stats.

### 4. Create a diff report (scrape vs export) to review before uploading

- **Done means:**
  - Implement `scripts/enrichment-diff.ts` that compares scrape-clean output to the PennyCentral export artifact.
  - Output markdown report to `.local/` (new SKUs, mismatches, missing images, suspicious UPC mismatches).
- **Prompt/task:**
  - GOAL: Produce a reviewable diff report before enrichment uploads.
  - WHY: Prevents silent bad merges and makes changes auditable.
  - DONE: `npm run enrich:diff -- --scrape <clean.json> --export <export.json>` writes `.local/enrichment-diff.md`.
  - FILES: `scripts/enrichment-diff.ts`, `package.json`.
  - VERIFY: gates + paste a snippet of the diff summary into `.ai/SESSION_LOG.md`.

### 5. Implement `scripts/print-penny-list-count.ts` (currently empty)

- **Done means:**
  - Script prints: total distinct SKUs, total reports, top states by report count, and a “last updated” timestamp.
  - Works in both normal mode (Supabase) and fixture mode (Playwright/local data).
  - Add `npm run penny:count`.
- **Prompt/task:**
  - GOAL: Add a fast CLI sanity check for Penny List health.
  - WHY: Daily checks catch regressions before they hit production.
  - DONE: `npm run penny:count` prints a stable summary and exits 0.
  - FILES: `scripts/print-penny-list-count.ts`, `package.json`.
  - VERIFY: gates.

---

## P1 - UX Improvements (Card Density + Clarity, Token-Safe)

### 6. Mobile Penny Card “Utilitarian Dense v2” (inspired by reference screenshots; not a clone)

- **Goal:** Max info density per vertical inch while staying scannable + accessible.
- **Constraints:** token-only colors; no misleading store/stock claims; preserve existing deep-links + analytics; keep touch targets ≥44px.
- **Checklist (ship in this order):**
  - [x] Define the “scan order” for mobile: title/brand → SKU → barcode/UPC → freshness → price → states/locations → actions.
  - [x] Make identifiers always visible on mobile (no hidden `<details>` for core identifiers).
  - [x] Add a barcode/UPC visual that is readable on-phone (pick 1 approach: SVG barcode vs monospaced numeric block) while keeping a11y text.
  - [x] Compact the layout: consistent spacing + fewer stacked rows; avoid wrapping chaos in pills.
  - [x] Keep the primary tap target clear (title/link region) and actions secondary.
  - [x] Preserve existing actions: internal SKU page, report-find, external HD link, share, save/bookmark.
- **Done means:**
  - Mobile cards feel “dense but calm” (fast scan); no broken links; no regressions in Save/My Lists.
- **Prompt/task (copy/paste):**
  - GOAL: Implement a mobile-first dense Penny List card layout.
  - WHY: In-store BOLO scanning depends on rapid visual matching.
  - DONE: New card layout ships on `/penny-list` (mobile), with identifiers visible and actions preserved.
  - FILES: `components/penny-list-card.tsx` (+ small helper components if needed).
  - VERIFY: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`, plus Playwright screenshots for `/penny-list` (mobile light/dark).

### 7. Protect + elevate the “Save” function (My Lists / BOLO driver)

- **Goal:** Saving items to personal lists must stay front-and-center as card density increases.
- **Checklist:**
  - [ ] Confirm `AddToListButton` remains present and obvious on both `PennyListCard` variants.
  - [ ] Ensure Save state is unambiguous (saved vs not saved) and doesn’t get lost in the dense layout.
  - [ ] Confirm Save works from `/penny-list` and from `/sku/[sku]` contexts (no auth regressions, no runtime errors).
  - [ ] Verify the “bookmark tip” copy still matches the UI (no stale instructions).
- **Done means:**
  - Users can reliably build a BOLO list and recognize saved items at a glance.
- **Prompt/task:**
  - GOAL: Make Save/My Lists a first-class action in the dense card UI.
  - WHY: Personal lists are a retention + repeat-visit loop.
  - DONE: Save is always reachable in ≤1 tap and visually distinct; behavior unchanged.
  - FILES: `components/add-to-list-button.tsx`, `components/penny-list-card.tsx`, `components/penny-list-client.tsx`.
  - VERIFY: gates + Playwright screenshots for `/penny-list`, `/lists`, and a sample `/lists/[id]`.

### 8. Mobile bottom action bar (only if it reduces clutter; no extra features)

- **Goal:** Keep scanning space high while still making key actions reachable on mobile.
- **Checklist:**
  - [ ] Decide the minimal set of actions (recommended: Filters, Sort, My Lists, Report).
  - [ ] Collapse the current top filter stack on mobile once the bar exists (keep desktop as-is).
  - [ ] Implement a mobile-only bar that doesn't cover content (safe-area padding) and is keyboard accessible.
  - [ ] Implement a lightweight bottom sheet (no new deps) for Filters + Sort using existing state.
  - [ ] Ensure desktop UI remains unchanged.
- **Done means:**
  - Filters/search/lists remain easy to reach without adding vertical bloat to the list.
- **Prompt/task:**
  - GOAL: Add a minimal mobile bottom bar on `/penny-list`.
  - WHY: Faster in-store browsing with less scroll friction.
  - DONE: Mobile bottom bar exists and is a11y-correct; desktop unaffected.
  - FILES: `components/penny-list-client.tsx` (and minimal new component if required).
  - VERIFY: gates + Playwright screenshots (mobile).
  - **Implementation plan (temporary, for next session):**
    - Layout: add a `MobileActionBar` (fixed bottom, `sm:hidden`, safe-area padding) with 4 buttons: Filters, Sort, My Lists, Report Find.
    - Sheets: implement two minimal bottom sheets (Filters/Sort) in `components/penny-list-client.tsx` with `role="dialog"`, `aria-modal="true"`, close button, overlay click to close, and `Escape` handling.
    - Filters sheet content: reuse existing state (state, search, hasPhoto, dateRange, sort). No new logic; just relocate controls into the sheet on mobile.
    - Sort sheet content: radio-like list using existing `sortOption` values; keep labels consistent with desktop.
    - Desktop: keep `PennyListFilters` intact; wrap with `hidden sm:block` so it remains full on desktop/tablet.
    - Mobile content padding: add bottom padding to the results container (`pb-[calc(80px+env(safe-area-inset-bottom))]`) so the bar never covers cards.
    - Hot Right Now: keep as-is for desktop; consider moving below the list on mobile to reduce above-the-fold bloat (optional).
    - Acceptance: first card visible without scrolling on 375×667, bar buttons ≥44×44, no console errors, URLs/filters still sync to query params.

---

## P2 - Cleanup / Consistency

### 9. Optional: “Not on your list” / “On your list” affordance (avoid overkill)

- **Idea:** When viewing `/penny-list` results, show a subtle badge if an item SKU matches something in a user’s saved lists.
- **Important:** This is optional and should not ship until #6–#8 are stable.
- **Done means:**
  - If enabled, the badge is accurate, fast, and doesn’t add popups/modals.
- **Prompt/task:**
  - GOAL: Add an “On your list” indicator to Penny List cards.
  - WHY: Helps users quickly rule-in/out BOLO items in-store.
  - DONE: Cards can reflect list membership without impacting performance.
  - FILES: `components/penny-list-client.tsx`, `lib/supabase/lists` (if needed).
  - VERIFY: gates + Playwright proof.

### 10. Support CTA consistency on homepage (decision + alignment)

- **Observation:** `app/page.tsx` currently includes a PayPal “Buy Me a Coffee” card; prior work removed PayPal CTAs elsewhere.
- **Done means:**
  - Decide keep/remove (and where).
  - Ensure tracking/copy is consistent with the monetization foundations strategy.
- **Prompt/task:**
  - GOAL: Align “Support Penny Central” CTAs across the site.
  - WHY: Consistency reduces confusion and avoids accidental regressions.
  - DONE: Decision applied and documented; UI proof captured if changed.
  - FILES: `app/page.tsx` (and any other support CTA surfaces).
  - VERIFY: gates + Playwright proof if UI changed.
