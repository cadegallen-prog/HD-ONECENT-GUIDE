# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-02 - ChatGPT Codex (GPT-5) - Penny List price pipeline & barcode refresh

**Goal:** Capture retail price data end-to-end and refresh the Penny List card layout to highlight savings, a UPC barcode modal, and the leaner action row referenced by the Opus 4.5 notes.

**Changes Made:**
- Added `retail_price` to the `penny_item_enrichment` schema/migrations, ingestion scripts, and the Supabase overlay so `PennyItem` objects know the retailer cost.
- Taught the Tampermonkey scraper/HTML controller to read/log the retail price and documented the new field for enrichment imports (`docs/CROWDSOURCE-SYSTEM.md`, `docs/HOW-CADE-ADDS-STOCK-PHOTOS.md`, `docs/SCRAPING_COSTS.md`, `docs/supabase-rls.md`).
- Overhauled `components/penny-list-card.tsx`/`components/penny-list-card.tsx` compact variant to show penny price + savings, added a barcode modal (`components/barcode-modal.tsx`) powered by the new `jsbarcode` dependency, and rewired the action row (Home Depot → Report → Save).
- Added `retailPrice` support in `lib/fetch-penny-data.ts`, `lib/penny-list-utils.ts`, and the enrichment tooling (`scripts/bulk-enrich.ts`, `scripts/enrichment-json-to-csv.ts`, `scripts/serpapi-enrich.ts`, `scripts/stealth-enrich.ts`); cleaned up Prettier/ESLint formatting.

**Proof (Playwright):**
- Screenshots: `reports/proof/2026-01-02T09-28-36/penny-list-light.png`, `.../penny-list-ui-light.png`, `.../penny-list-dark.png`, `.../penny-list-ui-dark.png`

**Verification:**
- `npm run lint`
- `npm run build` (Supabase warnings about `penny_item_enrichment.retail_price` expected until the real database adds the column)
- `npm run test:unit`
- `npm run test:e2e` *(fails because the live Supabase table still lacks `retail_price`, which floods the console and prevents the SKU-related-items visual assertion—see reports/playwright/results for failure details)*
- `npm run lint:colors`
- `npm run ai:proof -- /penny-list`

**Notes:** Playwright visual/console checks currently fail due to the missing `retail_price` column on Supabase (`42703: column does not exist`)—once the migration is applied, `test:e2e` and the related smoke suites should pass.


## 2026-01-02 - ChatGPT Codex (GPT-5) - Penny List hydration mismatch cleanup

**Goal:** Eliminate the `/penny-list` hydration mismatch warning seen in Playwright console logs.

**Changes Made:**
- Suppressed hydration warnings on the Penny List search input to stop dev-only console mismatch noise.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e`
- `npm run ai:proof -- /penny-list`
  - Before: `reports/proof/2026-01-02T00-14-49` (1 console hydration warning logged)
  - After: `reports/proof/2026-01-02T03-06-18` (no console errors)

**Notes:** Playwright reused the running dev server on port 3001; no restarts.

## 2026-01-02 - ChatGPT Codex (GPT-5) - Penny List mobile bottom bar + filter/sort sheets

**Goal:** Implement the backlog plan for a mobile bottom action bar with filter/sort sheets on `/penny-list` while keeping desktop unchanged.

**Changes Made:**
- Added a mobile-only bottom action bar (Filters, Sort, My Lists, Report) with safe-area padding.
- Moved mobile filter + sort controls into bottom sheets using existing state logic; desktop filter bar stays intact.
- Added mobile-only bottom padding to the results container so cards are not covered by the fixed bar.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e`
- `npm run ai:proof -- /penny-list`
  - Before: `reports/proof/2026-01-01T23-57-51` (2 console hydration warnings logged)
  - After: `reports/proof/2026-01-02T00-14-49` (1 console hydration warning logged)

**Notes:** Playwright reused the running dev server on port 3001; no restarts.

## 2026-01-02 - GitHub Copilot - Fix "Dead" Homepage & Missing Enrichment

**Goal:** Fix the "dead" look of the homepage caused by missing product enrichment data for recent finds, and resolve lint warnings causing verification failure.

**Changes Made:**
- Transformed `penny_scrape_1767297939418.json` into `data/enrichment-input.json` using `scripts/transform-scrape.ts`.
- Uploaded 23 enriched items to Supabase using `scripts/bulk-enrich.ts` (source: bookmarklet).
- Fixed Prettier formatting issues in `components/todays-finds.tsx` and `components/penny-list-card.tsx` to pass lint.

**Verification:**
- `npm run ai:proof -- /` (Screenshots captured, no console errors)
- `npm run ai:verify` (All gates passed: Lint, Build, Unit, E2E)

**Notes:** The "buffet" was full (scrape file existed) but the plates were empty (database missing data). I moved the food to the plates. Homepage should now show enriched items.

## 2026-01-03 - ChatGPT Codex (GPT-5) - Reduce VS Code "Edge Tools" noise (scraper HTML)

**Goal:** Clear the specific VS Code diagnostics Cade pasted (meta/label/inline-style hints) for the local scraper controller HTML.

**Changes Made:**
- Updated `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` with `lang`, `meta charset`, `meta viewport`.
- Added accessible labels (`aria-label` + `title`) for numeric inputs.
- Removed inline `style="background: ..."` on action buttons by moving those to CSS classes.

**Verification:**
- `npm run lint` (pass)
- `npm run build` (pass)
- `npm run test:unit` (pass)
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e` (pass)

**Notes:**
- `npm run test:e2e` without `PLAYWRIGHT_BASE_URL` failed due to `.next/dev/lock` because `next dev` was already running on port 3001; per repo rules, we reused the existing server instead of restarting it.
