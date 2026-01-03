# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-03 - ChatGPT Codex (GPT-5.2) - SerpApi enrich: fill-blanks-only, no data wipes; safer Action budget; Supabase docs cleanup

**Goal:** Ensure the SerpApi GitHub Action keeps collecting the right enrichment fields going forward (not “image-only”), while protecting existing Supabase data (fill blanks by default; no destructive overwrites).

**Outcome:**

- SerpApi enrichment now queues SKUs when **any core enrichment fields** are missing (name/brand/model/image/link/internet_sku/retail_price), not just `image_url`.
- Upserts are **fill-blanks-only** by default; `--force` enables overwriting existing values when SerpApi returns data.
- `not_found` writes no longer wipe fields (previously `retail_price: null` could clobber real data).
- GitHub Action schedule/default limit updated to keep usage within the **250 searches/month** free tier in the worst case.
- Docs updated so we don’t treat the deprecated Google Sheets pipeline as the current system.

**Changes Made:**

- `scripts/serpapi-enrich.ts`: completeness-aware selection, fill-blanks upserts, safe not_found handling, `--force`, best-effort UPC fetch from PDP HTML (no SerpApi credits; may fail under bot/region blocks).
- `.github/workflows/serpapi-enrich.yml`: runs every 6 hours, default `--limit 1`, includes `--retry`.
- `docs/SCRAPING_COSTS.md`, `docs/CROWDSOURCE-SYSTEM.md`, `README.md`: document current Supabase tables/roles and SerpApi budgeting.

**Verification (Proof):**

- `npm run ai:verify` ✅
- Outputs saved to: `reports/verification/2026-01-03T11-58-42/`

## 2026-01-03 - ChatGPT Codex (GPT-5) - Enrich Supabase from latest scrape JSON (skip $0 prices)

**Goal:** Use `scripts/GHETTO_SCRAPER/penny_scrape_2026-01-03T11-15-29-344Z.json` to enrich Supabase (`penny_item_enrichment`) while ensuring any `$0.00` retail price rows are NOT used.

**Outcome:**

- Imported enrichment rows to Supabase successfully: **Processed 100**, **Errors 0**
- Skipped explicit `$0.00` rows entirely (7 SKUs): `420215`, `1001965219`, `1006017959`, `1007297185`, `1008776570`, `1009907169`, `1009951215`
- Post-import dry run shows **0 inserts / 0 updates** (fully up to date for this scrape file)

**Changes Made:**

- `scripts/bulk-enrich.ts`
  - Accepts Tampermonkey scrape JSON directly (object/array) and maps fields into enrichment rows.
  - Default **merge (fill blanks only)** behavior; `--force` enables overwrite mode.
  - Hard-skips rows with explicit `$0.00` retail price.
  - Canonicalizes `home_depot_url` to `https://www.homedepot.com/p/{internet_sku}` when available.
  - Improves THD image URL optimization to `_400.jpg`/`/400.jpg` variants.
- `scripts/transform-scrape.ts`
  - Merges duplicate SKUs across scrape versions and carries `model_number` + `retail_price` + canonical URLs into output.
- `playwright.config.ts`
  - Playwright `webServer.command` now uses `npm run start` (avoids `.next/dev/lock` conflicts when `next dev` is already running on port 3001).

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅

## 2026-01-03 - ChatGPT Codex (GPT-5) - Restore Tampermonkey retries + failure handling; add failures export

**Goal:** Undo regressions in the userscript so price scraping and failure reporting work again, and reintroduce a simple failures export in the controller.

**Changes Made:**

- Tampermonkey: restored search→PDP redirect, broader price parsing, second-pass retry for missing fields, and bot/region failure detection that reports `SCRAPE_FAIL` to the controller.
- Controller: added a single “Export Failures JSON” button (kept main JSON export and pause/stop controls).

**Files Modified:**

- `scripts/GHETTO_SCRAPER/Tampermonkey.txt`
- `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html`

**Verification:**

- Not run (script/HTML-only changes; no automated tests requested).

## 2026-01-03 - ChatGPT Codex (GPT-5) - Scraper controller pause/stop + single export + HD URL

**Goal:** Make the GHETTO_SCRAPER controller stop preemptive skips, simplify exports, add pause/stop controls, and ensure saved entries include a canonical Home Depot URL.

**Changes Made:**

- Added manual Pause/Resume + Stop Session controls with distinct status indicator states.
- Removed failure export buttons and functions (single export remains).
- Ensured each saved entry includes `homeDepotUrl` built from internet SKU (preferred) or store SKU fallback.

**Files Modified:**

- `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html`

**Verification:**

- Not run (UI-only HTML change; no automated tests requested).

## 2026-01-03 - GitHub Copilot (GPT-5.2) - Fix scraper skipping items missing retail price

**Goal:** Stop the GHETTO_SCRAPER controller from skipping items that still need a retail price, and allow updating existing entries once a price becomes available.

**Root Cause:**

- The controller was treating any previously-saved item as "already scraped" even when `retailPrice` was `0`/missing.
- `saveToDB` was deduping by key and refusing to update existing items, so even if you re-scraped, the price couldn't "upgrade" the existing record.

**Changes Made:**

- Pre-scrape skip is now **price-aware**: only skips when an existing entry has a valid `retailPrice`.
- `saveToDB` now **merges/upgrades** existing entries when a new scrape provides a valid `retailPrice` (and fills other missing fields), and canonicalizes keys to Store SKU when possible.
- Updated scraper README log expectations.

**Files Modified:**

- `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html`
- `scripts/GHETTO_SCRAPER/README.md`

**Verification (Proof):**

- `npm run ai:verify` ✅
- Outputs saved to: `reports/verification/2026-01-03T09-58-35/`
