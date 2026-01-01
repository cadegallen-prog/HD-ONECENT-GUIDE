# Backlog (AI-Driven, Ordered)

**Last updated:** Dec 31, 2025  
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

### 6. Penny List card hierarchy pass (status band + report pills)

- **Goal:** Borrow “dense dashboard” clarity without claiming stock/store/aisle data we don’t have.
- **Done means:**
  - Add a clear top “fresh signal” band when reports are within 24h/48h.
  - Render total reports as a pill badge; optionally color-code state pills by frequency (CSS variables only).
  - Meet touch-target + a11y rules and keep primary navigation as the main tap target.
- **Prompt/task:**
  - GOAL: Improve card scanability via sections and badges.
  - WHY: Faster scanning = higher retention and better “Penny List” habit loop.
  - DONE: Cards show freshness + report pills; layout remains responsive.
  - FILES: `components/penny-list-card.tsx`, `app/globals.css` (tokens/classes if needed).
  - VERIFY: gates + Playwright screenshots before/after (light/dark) for `/penny-list`.

### 7. Icon-first card actions (tooltips + aria-labels)

- **Done means:**
  - Replace verbose action row text with icon buttons + accessible labels/tooltips.
  - Focus rings remain visible and consistent.
- **Prompt/task:**
  - GOAL: Make card actions compact and modern.
  - WHY: Reduces clutter without removing functionality.
  - DONE: Icon actions are keyboard/screen-reader accessible.
  - FILES: `components/penny-list-card.tsx`.
  - VERIFY: gates + Playwright proof.

### 8. Mobile filter ergonomics (bottom sheet/FAB)

- **Done means:**
  - Add a mobile-only launcher (FAB or bottom toolbar) that opens filter/sort controls.
  - Desktop layout unchanged; a11y + ≥44px targets.
- **Prompt/task:**
  - GOAL: Reduce vertical bloat from filters on mobile.
  - WHY: Improves browse speed and reduces bounce on small screens.
  - DONE: Filters are reachable within one tap and fully keyboard accessible.
  - FILES: `components/penny-list-client.tsx` (or relevant filter component), shared UI utilities if needed.
  - VERIFY: gates + Playwright screenshots mobile/desktop.

---

## P2 - Cleanup / Consistency

### 9. Support CTA consistency on homepage (decision + alignment)

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

