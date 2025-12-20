# Cade Enrichment (IMAGE URL + INTERNET SKU)

1. **Rename headers to canonical names (once):** In the published Sheet tab behind `GOOGLE_SHEET_URL`, rename the photo + internet number headers to exactly `IMAGE URL` and `INTERNET SKU`. Remove/replace any legacy headers like "Upload Photo(s)...", "Receipt...", or "internetSku (private...)".

2. **One-off manual edits (safest):** Find the earliest row for the SKU you want to enrich and paste the stock image link into `IMAGE URL` (and the internet number into `INTERNET SKU` if you have it). Leave duplicates blank—aggregation keeps the first non-empty value per SKU and ignores blanks.

3. **Bulk from bookmark JSON (safe overlay):**
   - Run `tsx scripts/enrichment-json-to-csv.ts <export.json> [output.csv]` to produce a CSV with headers `Home Depot SKU (6 or 10 digits), IMAGE URL, INTERNET SKU` (defaults to `./.local/enrichment-upload.csv`).
   - Create an **Enrichment** tab in the same Google Sheet, paste the CSV there (no other columns needed).
   - Publish that tab as CSV and set `GOOGLE_SHEET_ENRICHMENT_URL` to its published link. The site overlays this tab by SKU, filling missing image/internet fields without touching community-submitted data. Blanks never overwrite existing values.

4. **Fallbacks:** Until `IMAGE URL` is populated, the Penny List shows the built-in placeholder image. Product links always stay clickable—`INTERNET SKU` is preferred, and the regular SKU search link is the fallback.
