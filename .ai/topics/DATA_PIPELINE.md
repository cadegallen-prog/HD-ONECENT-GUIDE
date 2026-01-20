# DATA_PIPELINE

## Architecture Overview (Read This First)

### The Two-Table System

```
External Penny Source ─→ Scraper (Tue-Fri) ─→ penny_item_enrichment (~1,600+ items)
                                                        │
                                                        ▼
                              User submits SKU ─→ Auto-enriched from DB ─→ "Penny List" (public display)
```

**`penny_item_enrichment`** = Pre-scraped penny items (source of truth for enrichment)

- ~1,600+ items and growing
- Scraped Tuesday through Friday from external penny-tracking source
- Contains: SKU, item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price
- Purpose: When users submit a SKU, we auto-enrich their submission from this database

**`"Penny List"`** = User-submitted finds (what displays on the website)

- Currently ~67 items visible in last 30 days
- Each row is a submission (user-reported find OR seeded from enrichment)
- Contains enrichment data merged in at submission time

### Why This Exists

**Problem:** SerpAPI costs money (~$0.01 per search). If we scraped product data for every user submission, it would cost us for each unique SKU.

**Solution:** Pre-scrape penny items from the external penny-tracking source (Tuesday-Friday). When users submit finds, we look up the SKU in our enrichment database and auto-populate the product details (name, image, brand, price, etc.) for free.

**Result:** Zero SerpAPI cost per submission. The external source already knows which items are penny items, so we scrape them proactively.

### Data Flow (Detailed)

1. **External penny source** publishes new penny items (Tuesday-Friday)
2. **Scraper** (Tampermonkey + HTML controller) scrapes product data from Home Depot
3. **Enrichment database** (`penny_item_enrichment`) stores the scraped data
4. **User submits** a find via `/api/submit-find`
5. **Auto-enrichment** looks up the SKU in enrichment database
6. **Merge** enrichment data into the submission (fill-blanks-only)
7. **Insert** to `"Penny List"` table
8. **Display** on `/penny-list` page with full product details

---

## Current Status

- ✅ Core pipeline stable: Scrape → Enrichment → Auto-enrich → Display
- ✅ Enrichment database: ~1,600+ items, refreshed Tue-Fri
- ✅ Bulk enrichment scripts complete (validate, scrape-to-CSV, diff)
- ✅ RLS hardened (anon users cannot insert directly; use service role key in `/api/submit-find`)
- ✅ Rate limiting: `/api/submit-find` = 30 submissions/hour per IP
- ✅ Manual scrape tooling: Tampermonkey userscript + HTML controller UI with pause/resume
- ❌ **Auto-enrich cron (ScraperAPI): DISABLED** (reverted in commit `8945fee` - ScraperAPI proxy was broken)
- ✅ **SerpAPI enrichment scripts:** Available (`scripts/serpapi-enrich.ts`) - 250 searches/month free tier
- **Status:** Pipeline is self-healing; enrichment comes from external source scrapes, not SerpAPI

---

## Locked Decisions

- **Scrape source:** External penny-tracking website (via Tampermonkey + controller)
- **Scrape schedule:** Tuesday, Wednesday, Thursday, Friday
- **Storage:** `penny_item_enrichment` table (Supabase)
- **Merge strategy:** Fill-blanks-only (never overwrite existing good data)
- **Price validation:** Skip items with explicit `$0.00` retail prices
- **ScraperAPI auto-enrich cron:** DISABLED (proxy was broken)
- **SerpAPI scripts:** Available for manual enrichment (250/month free tier)
- **Canonical image URL:** `-64_600.jpg` (normalized in DB, downconverted at display time)
- **Brand normalization:** Scraper standardizes brand case + removes duplicates

---

## Open Questions

None (pipeline is stable and locked).

---

## Next Actions

1. **Monitor enrichment table growth (monthly)**
   - Track row count: `SELECT COUNT(*) FROM penny_item_enrichment`
   - No upper limit concern - external source provides filtered penny items

2. **Manual scrape as needed (Tue-Fri)**
   - When external source updates, use Tampermonkey controller
   - Export results to `.local/scrape_*.json`
   - Run: `npm run validate:scrape && npm run bulk:enrich`

3. **Test fallback image handling (quarterly)**
   - Verify: List cards use `-64_400`, fallback to `-64_1000` if 404
   - Verify: Detail pages use `-64_600`, fallback chain works

4. **Audit RLS policies (quarterly)**
   - Verify: Anon cannot INSERT directly into `Penny List`
   - Verify: Service role can INSERT via `/api/submit-find`
   - Run: Full E2E submission test + RLS test

---

## Key Files

| Purpose                 | File                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Enrichment table schema | `supabase/migrations/004_create_enrichment_table.sql`                                |
| Retail price column     | `supabase/migrations/009_add_retail_price_to_enrichment.sql`                         |
| Staging queue           | `supabase/migrations/016_enrichment_staging_queue.sql`                               |
| Consume RPC             | `supabase/migrations/017_consume_enrichment_rpc.sql`                                 |
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
