# DATA_PIPELINE

## Architecture Overview (Read This First)

### The Two-Table System

```
External Penny Source (Scouter/ScouterPro) ─→ GitHub Action (Tue–Fri) ─→ enrichment_staging (~1,343 rows as of 2026-01-23)
                                                                      │
                                                                      ├─→ Vercel cron: seed/trickle → "Penny List" (social proof)
                                                                      └─→ (Future) Use as pre-enrichment cache for /api/submit-find
```

**`enrichment_staging`** = Pre-scraped penny items pool (current automated pipeline output)

- ~1,343 rows currently in production (may be stale until the pipeline is unblocked)
- Intended to refresh Tue–Fri from the external penny source
- Contains: SKU, item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price
- Purpose today: seed/trickle synthetic finds; future use: pre-enrichment cache to reduce SERP costs

**`"Penny List"`** = User-submitted finds (what displays on the website)

- Currently ~67 items visible in last 30 days
- Each row is a submission (user-reported find OR seeded from enrichment)
- Contains enrichment data merged in at submission time

**Important reality check:** Production Supabase currently does **not** have `penny_item_enrichment` (PostgREST `PGRST205` “table not found”). Docs/migrations may reference it, but do not treat it as the live source of truth until migrations are verified/applied.

### Why This Exists

**Problem:** SerpAPI costs money (~$0.01 per search). If we scraped product data for every user submission, it would cost us for each unique SKU.

**Solution:** Pre-scrape penny items from the external penny-tracking source (Tuesday-Friday). When users submit finds, we look up the SKU in our enrichment database and auto-populate the product details (name, image, brand, price, etc.) for free.

**Result:** Zero SerpAPI cost per submission. The external source already knows which items are penny items, so we scrape them proactively.

### Data Flow (Detailed)

1. **External penny source** publishes new penny items (Tue–Fri)
2. **GitHub Action** (`Enrichment Staging Warmer`) fetches across ZIPs and upserts into `enrichment_staging`
3. **Vercel cron** uses `enrichment_staging` to create social-proof finds:
   - `/api/cron/seed-penny-list` (3 quality items/day)
   - `/api/cron/trickle-finds` (5–10 finds/day)
4. **Users submit** finds via `/api/submit-find`:
   - Enrichment comes from existing Penny List + staging-queue consumption (not `penny_item_enrichment`)
   - SERP/API fallback enrichment is still available when needed
5. **Display** on `/penny-list` page with enriched product details

---

## Current Status

- ✅ Core product working: submissions + Penny List display
- ✅ `enrichment_staging` exists and currently has **1343** rows (as of 2026-01-23)
- ⚠️ **Automated pre-scrape is currently blocked:** GitHub-hosted runners get **403 + Cloudflare “Just a moment...” HTML** from `pro.scouterdev.io/api/penny-items` (see issue #106)
- ✅ Failures are no longer silent: the workflow prints `FETCH_DIAGNOSTICS` and opens/updates a GitHub issue on failure
- ⚠️ **Cron health depends on `CRON_SECRET`:** `/api/cron/*` routes return 401 if misconfigured
- ✅ Manual scrape tooling still exists (Tampermonkey controller) if needed
- ✅ SERP/API enrichment is still available for real-time enrichment when pre-scrape isn’t available

---

## Locked Decisions

- **Automated source:** `https://pro.scouterdev.io/api/penny-items` (cookie + guild ID)
- **Schedule:** Tue–Fri at 14:05 UTC (`.github/workflows/enrichment-staging-warmer.yml`)
- **Storage:** `enrichment_staging` table in Supabase (service role upserts)
- **Retention:** 60-day prune before inserting new data
- **Failure alerting:** Workflow auto-updates GitHub issue on failure (no silent 0-item successes)
- **Known blocker:** Cloudflare/bot protection blocks GitHub-hosted runners (403 + “Just a moment...” HTML)

**Manual fallback tooling (still in repo):** Tampermonkey controller + export/validate scripts.

---

## Open Questions

1. **How do we unblock Cloudflare?**
   - Ask provider to allowlist GitHub Actions IPs or provide a proper API token, **or**
   - Move this workflow to a self-hosted runner (runs from your own IP), **or**
   - Replace the upstream source.

---

## Next Actions

1. **Resolve Cloudflare blocker (required for automation)**
   - Preferred: ask provider for allowlisting or a real API auth method for server-to-server use.
   - Backup: move workflow to a self-hosted runner (runs from your IP).

2. **Confirm the workflow is healthy**
   - Expect: `Enrichment Staging Warmer` run turns green and logs show non-zero items fetched + upserted.
   - Monitor: `enrichment_staging` row count increases and `updated_at` refreshes.

3. **Confirm Vercel cron jobs are authorized**
   - Ensure `CRON_SECRET` is set (prod) and cron logs show 200s (not 401s) for:
     - `/api/cron/seed-penny-list`
     - `/api/cron/trickle-finds`
     - `/api/cron/send-weekly-digest`

4. **Optional fallback**
   - Keep manual scrape tooling available if the upstream source remains hostile to automation.

---

## Key Files

| Purpose                 | File                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Pre-scrape workflow     | `.github/workflows/enrichment-staging-warmer.yml`                                    |
| Pre-scrape runner       | `scripts/staging-warmer.py`                                                          |
| Upstream API client     | `extracted/scraper_core.py`                                                          |
| Staging table schema    | `supabase/migrations/016_enrichment_staging_queue.sql`                               |
| Consume RPC             | `supabase/migrations/017_consume_enrichment_rpc.sql`                                 |
| Seed/trickle cron       | `app/api/cron/seed-penny-list/route.ts`, `app/api/cron/trickle-finds/route.ts`       |
| Submit endpoint         | `app/api/submit-find/route.ts`                                                       |
| Bulk enrich script      | `scripts/bulk-enrich.ts`                                                             |
| SerpAPI enrich script   | `scripts/serpapi-enrich.ts`                                                          |
| Validate scrape         | `scripts/validate-scrape-json.ts`                                                    |
| Scraper controller      | `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` |
| Tampermonkey userscript | `scripts/GHETTO_SCRAPER/Tampermonkey.txt`                                            |
| Image URL helper        | `lib/image-urls.ts`                                                                  |
| RLS setup               | `supabase/migrations/008_apply_penny_list_rls.sql`                                   |

---

## Archive References

- None yet (this topic is active but stable)
