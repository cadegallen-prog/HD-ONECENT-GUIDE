# Skill: Backfill HomeDepot.com Enrichment JSON (Penny List)

Use this when you (Cade) have a manual scrape export from HomeDepot.com (name/brand/model/upc/image/url/retail price) and want to refresh **enrichment fields only** on existing Penny List rows.

## What this does (and does not do)

- ✅ Updates only enrichment fields on `"Penny List"` rows matching the SKU:
  - `item_name`, `brand`, `model_number`, `upc`, `image_url`, `home_depot_url`, `internet_sku`, `retail_price`
- ✅ Skips overwriting with empty strings
- ✅ Skips `retail_price` when input `price` is blank/unparseable
- ❌ Does not touch user report fields (store/date/qty/notes/etc.)

## Run (recommended flow)

1. Save your scrape JSON to a local file (example: `C:\\temp\\hd-enrichment.json`).
2. Dry-run first:

```bash
tsx scripts/apply-hd-enrichment-json.ts --file C:\temp\hd-enrichment.json
```

3. Apply:

```bash
tsx scripts/apply-hd-enrichment-json.ts --file C:\temp\hd-enrichment.json --apply
```

## Notes

- Requires Supabase env vars in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
- This is intended for **small batches** (tens/hundreds of SKUs), not full-table rewrites.
- If your scrape JSON has `price: ""` for some SKUs, their `retail_price` will remain null (by design). Fix the scraper/bookmarklet export to include a price, then re-run.
