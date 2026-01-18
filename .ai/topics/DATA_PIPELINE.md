# DATA_PIPELINE

## CURRENT STATUS

- ✅ Core pipeline stable: Scrape → Enrichment → Auto-enrich → Display
- ✅ Auto-enrich cron active (every 6 hours, SerpApi budget 1 query/run)
- ✅ Bulk enrichment scripts complete (validate, scrape-to-CSV, diff)
- ✅ RLS hardened (anon users cannot insert directly; use service role key in `/api/submit-find`)
- ✅ Rate limiting: `/api/submit-find` = 30 submissions/hour per IP (up from 5/hr)
- ✅ Manual scrape tooling: Tampermonkey userscript + HTML controller UI with pause/resume
- **Status:** No pending work; pipeline is self-healing

---

## LOCKED DECISIONS

- **Scrape source:** Home Depot search + product detail pages (via Tampermonkey + controller)
- **Storage:** `penny_item_enrichment` table (Supabase)
- **Merge strategy:** Fill-blanks-only (never overwrite existing good data)
- **Price validation:** Skip items with explicit `$0.00` retail prices
- **Auto-enrich trigger:** Cron every 6 hours (00, 06, 12, 18 UTC)
- **SerpApi budget:** 250 searches/month free tier → 1 query per cron run (safely under limit)
- **Canonical image URL:** `-64_600.jpg` (normalized in DB, downconverted at display time)
- **Brand normalization:** Auto-enrich standardizes brand case + removes duplicates
- **Python tooling:** Ruff formatter + pre-commit hooks for linting

---

## OPEN QUESTIONS

None (pipeline is stable and locked).

---

## NEXT ACTIONS

1. **Monitor SerpApi usage (weekly)**
   - Check dashboard: queries/month remaining
   - Alert if >250 queries/month trending
   - No action unless quota is exhausted

2. **Monitor enrichment table size**
   - Track row count: `SELECT COUNT(*) FROM penny_item_enrichment`
   - Goal: <10K rows (manageable size)
   - If >5K: Analyze coverage and decide on archiving strategy

3. **Manual scrape as needed (ad-hoc)**
   - When users report missing enrichment, use Tampermonkey controller
   - Export results to `.local/scrape_*.json`
   - Run: `npm run validate:scrape && npm run bulk:enrich`
   - Target: Keep >80% of items enriched

4. **Test fallback image handling (quarterly)**
   - Verify: List cards use `-64_400`, fallback to `-64_1000` if 404
   - Verify: Detail pages use `-64_600`, fallback chain works
   - No code change needed unless fallback fails

5. **Audit RLS policies (quarterly)**
   - Verify: Anon cannot INSERT directly into `Penny List`
   - Verify: Service role can INSERT via `/api/submit-find`
   - Run: Full E2E submission test + RLS test

---

## POINTERS

- **Core pipeline doc:** `.ai/CONSTRAINTS_TECHNICAL.md` (system architecture)
- **Auto-enrich script:** `scripts/serpapi-enrich.ts` (every 6 hours)
- **Validation script:** `scripts/validate-scrape-json.ts`
- **Bulk enrich script:** `scripts/bulk-enrich.ts`
- **Tampermonkey userscript:** `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html`
- **Image helper:** `lib/image-urls.ts` (variance builder, fallback logic)
- **RLS setup:** `supabase/migrations/008_apply_penny_list_rls.sql`
- **No implementation plan yet** (pipeline is stable, no pending work)

---

## Archive References

- None yet (this topic is active but stable)
