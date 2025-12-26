# SKU Import Workflow (Privacy-Safe)

This repo is public. **Never commit raw HD export files or derived datasets.**

## What this does

- Takes one or more Home Depot export CSV files
- Keeps **only true penny items** (unit price == `$0.01`)
- Removes/ignores **store identifiers**, **buyer info**, and any other PII
- Applies the rule: **1 unique SKU per 1 unique person**
  - Each CSV file is treated as one person
  - If the same SKU appears multiple times in the same file, only the most recent date is used
  - If the same SKU appears across multiple files, it produces one row per file
- Outputs a CSV that can be imported into Supabase
- Generates an optional **private internet-SKU map** for backend-only Home Depot product links

## Generate the import CSV

```bash
python scripts/sku-history-to-import.py \
  --out-csv ./.local/sku-import.csv \
  --out-internet-sku-map ./.local/internet-sku-map.json \
  "C:\\path\\to\\export1.csv" "C:\\path\\to\\export2.csv"
```

Outputs:
- `./.local/sku-import.csv` (safe for Supabase import)
- `./.local/internet-sku-map.json` (keep private; do NOT commit)

## Import into Supabase

1. Open your Supabase project dashboard
2. Go to the "Penny List" table
3. Use the CSV import feature to upload the generated CSV
4. Map columns appropriately:
   - `Home Depot SKU (6 or 10 digits)` → `home_depot_sku_6_or_10_digits`
   - `Item Name` → `item_name`
   - `Date Found` → `purchase_date`
   - etc.

## Safety checks

Before committing anything, run:

```bash
npm run security:scan
```

This checks staged files and refuses commits that look like raw export data or contain PII headers.

## Internet SKU Map

The internet SKU map is used by the backend to generate more reliable Home Depot product links. Keep it private:
- Store in environment variables, Vercel Blob, or Google Drive
- Never commit to the repository
- The UI still shows regular SKU; internet SKU is backend-only
