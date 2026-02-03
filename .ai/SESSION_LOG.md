# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-01 - Codex - Fix: staging warmer retail_price fill rate

**Goal:** Stop `enrichment_staging` from scraping “everything except retail_price”.

**Status:** ✅ Completed & verified locally.

### Root cause (confirmed)

- Upstream payload commonly provides `store_retail_price`, while `retail_price` is often the string `"N/A"`.
- `scripts/staging-warmer.py` used `item.get("retail_price") or ...`, which short-circuited on truthy `"N/A"` and dropped real values from other keys.

### Changes

- `scripts/staging-warmer.py`: Retail price extraction now tries keys sequentially (treats `"N/A"` as missing) and includes `store_retail_price`.
- `extracted/scraper_core.py`: Normalized `retail_price` now coalesces `store_retail_price` and other common variants.
- `scripts/print-enrichment-staging-status.ts`: Fixed freshness probing (`created_at` fallback) and added coverage stats (`with_retail_price`, etc.).
- `scripts/run-local-staging-warmer.mjs` + `docs/skills/run-local-staging-warmer.md`: Added `--zip-pool/--zip-sample/--zip-seed` and `PENNY_ZIP_POOL` to expand zip breadth safely.

### Before/after evidence (local snapshot)

- Before: `with_retail_price` 418/2002 (21%)
- After: `with_retail_price` 1758/2021 (87%) after rerunning the warmer with 5 zips (30301,30303,30305,30308,30309)

### Verification

- Bundle: `reports/verification/2026-02-02T19-24-43/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

### Follow-up: Penny List enrichment refresh (manual HomeDepot.com scrape)

- Implemented `scripts/apply-hd-enrichment-json.ts` to apply a HomeDepot.com scrape JSON to **enrichment fields only** on existing `"Penny List"` rows (Option A).
- Applied the provided batch: 29 input SKUs matched 33 Penny List rows (some SKUs had multiple finds) and updated 33/33 rows.
- `retail_price` remained null on 8 rows because the provided scrape JSON had `price: ""` for those items (by design we do not overwrite with empty/unparseable prices).

### Follow-up: Bookmarklet truncation (Chrome/Edge)

- `tools/bookmarklets/bookmarklet.txt` is now a compact inline bookmarklet (to avoid both URL truncation and Home Depot blocking external script injection).
- Added `tools/bookmarklets/export-saved-json.txt` to export saved items as a JSON file.

---

## 2026-01-30 - Codex - SerpApi credit spend control (free-tier safety)

**Goal:** Keep SerpApi usage firmly in the free tier by tying enrichment to recent activity only, reducing run frequency, and adding minimal audit logging.

**Status:** ✅ Completed & verified locally.

### Changes

- `scripts/serpapi-enrich.ts`: Added a 30-day lookback filter for “gap” selection (`timestamp >= now-30d`), early-exits with “No recent gaps to enrich; skipping.”, and writes a minimal per-run summary to `serpapi_logs` (non-fatal if table missing).
- `.github/workflows/serpapi-enrich.yml`: Reduced scheduled cadence from every 6 hours to **daily** (`0 2 * * *`).
- `supabase/migrations/023_backlog_cleanup_enrichment_attempts.sql`: One-time cleanup: sets `enrichment_attempts = 3` for rows older than 60 days that still have canonical gaps, preventing future SerpApi churn on historical backlog.
- `supabase/migrations/024_create_serpapi_logs.sql`: Adds `serpapi_logs` table for auditing attempted SerpApi usage without parsing GitHub logs.
- `docs/SCRAPING_COSTS.md`: Updated to reflect daily schedule.

### Verification

- Bundle: `reports/verification/2026-01-30T06-19-26/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

---

## 2026-01-30 - Codex - Fix: retail price accuracy (staging vs HomeDepot.com)

**Goal:** Stop showing obviously wrong “Retail” strike-through prices on Penny List cards (e.g., HomeDepot.com shows $139 but PennyCentral shows $49).

**Status:** ✅ Completed & verified locally.

### Root cause (confirmed)

- `retail_price` was being copied from `enrichment_staging` into `"Penny List"` during submission enrichment (`consume_enrichment_for_penny_item` RPC) and during cron seeding/trickling.
- That upstream “retail” value can be store/region-specific clearance context (and/or stale), so it can differ drastically from HomeDepot.com.

### Changes

- `supabase/migrations/022_consume_enrichment_rpc_skip_retail_price.sql`: Stops copying staging `retail_price` into `"Penny List"`.
- `app/api/cron/seed-penny-list/route.ts` and `app/api/cron/trickle-finds/route.ts`: Stops copying staging `retail_price` (leave null for SerpApi).
- `scripts/serpapi-enrich.ts`: Pins SerpApi `delivery_zip` (env: `SERPAPI_DELIVERY_ZIP`, default `30303`) for consistency.

### Verification

- Bundle: `reports/verification/2026-01-30T00-30-06/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)
