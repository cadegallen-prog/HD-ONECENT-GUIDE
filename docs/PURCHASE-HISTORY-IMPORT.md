# Purchase History → Community Penny List (Privacy-Safe)

This repo is public. **Never commit purchase-history exports or derived datasets.**

## What this does

- Takes one or more Home Depot purchase-history CSV exports.
- Keeps **only true penny items** (unit price == `$0.01`).
- Removes/ignores **store number**, **purchaser**, and any other identifiers.
- Applies the rule: **1 unique SKU per 1 unique person**.
  - Each CSV file is treated as one person.
  - If the same SKU appears multiple times in the same file, only the most recent purchase date is used.
  - If the same SKU appears across multiple files, it produces one row per file (so the site sees multiple reports).
- Outputs a **Google Sheet import CSV** that matches the column aliases consumed by the site.
- Generates an optional **private internet-SKU map** for backend-only Home Depot product links (UI still shows the regular SKU; fallback to SKU-based links when no map entry exists).

## Generate the import CSV

```bash
python scripts/purchase-history-to-sheet-import.py --out-sheet-csv ./.local/purchase-history-sheet-import.csv --out-internet-sku-map ./.local/purchase-history-internet-sku-map.json "C:\\path\\to\\STATE_...csv" "C:\\path\\to\\STATE_...csv"
```

Outputs:

- `./.local/purchase-history-sheet-import.csv` (safe for the community Penny List feed)
- `./.local/purchase-history-internet-sku-map.json` (keep private; do NOT commit; store in env/Blob/Drive if wired to backend outbound links)

## Load into Google Sheets

- Open your submissions Sheet (the one used by Vercel via `GOOGLE_SHEET_URL`).
- Create a new tab like `Purchase History Imports`.
- Import the CSV into that tab.
- Ensure your published CSV (or export automation) includes that tab, or copy/paste rows into the tab that is published.

## Avoid column shifting (Email Address column)

Google Sheets will still keep a column even if it is **hidden**.

If your published tab still has an **Email Address** column (visible or hidden), any CSV paste/import must include that column (even if it’s blank), otherwise every value shifts left and your data ends up in the wrong columns.

- **Email Address column exists (even hidden):** use the 10-column import (email is blank). For the merge pipeline outputs, paste/import `./.local/merged-sheet-import.noheader.csv` under your existing header row.
- **Email Address column truly removed (deleted):** use the 9-column import. For the merge pipeline outputs, paste/import `./.local/merged-sheet-import.noemail.noheader.csv` under your existing header row.

## Sanity check after import

- After you paste the rows, check the SKU column. It should be 6- or 10-digit numbers. If the column shows item names instead, you imported the wrong CSV variant (the Email Address column shifted everything left). Re-import with the correct file and try again.
- Use the `merged-sheet-import.noheader.csv` variant (10 columns) whenever the Email Address column still exists (even if hidden); use the `noemail` file only when that column is deleted so the SKU column stays numeric.

## Thumbnails (photo header)

Your published Sheet must use the canonical photo header or the site won't detect it.

- `IMAGE URL` (exact casing)

## Safety checks

Before committing anything, run:

```bash
npm run security:scan
```

This checks staged files and refuses commits that look like purchase history exports or contain common purchase-history headers.
