# Backlog (Top Priority Items)

**Last updated:** Jan 06, 2026
**Rule:** Keep ≤10 items. Archive completed/deferred items.

**Auto-archive:** Full backlog history preserved in `archive/backlog-history/`

Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Implement + verify (proof required)
4. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## P0 - Do Next

### 1. Restore + standardize the "PennyCentral export" artifact

- **Problem:** The `pennycentral_export_*.json` is missing, so we can't methodically diff/merge scraped metadata against current data
- **Done means:**
  - Define canonical schema (storeSku, internetNumber, name, brand, imageUrl, productUrl, upc, timestamps)
  - Implement `scripts/export-pennycentral-json.ts` that generates export from Supabase
  - Default output to `.local/` (never committed)
  - `npm run export:pennycentral` writes `.local/pennycentral_export_YYYY-MM-DD.json` + `.local/pennycentral_export_YYYY-MM-DD.summary.md`
- **Verify:** All 4 gates (lint/build/unit/e2e)

### 2. Validate + normalize the scrape JSON (make ingestion safe)

- **Done means:**
  - Implement `scripts/validate-scrape-json.ts` that validates and normalizes SKU formats
  - Emits deterministic summary (counts, missing fields, SKU-length histogram, % with images)
  - Writes cleaned output to `.local/penny_scrape_clean_YYYY-MM-DD.json`
  - `npm run scrape:validate -- --in <path>` prints summary + writes cleaned output
- **Verify:** Gates + include sample output in SESSION_LOG.md

### 3. Convert scrape-clean output to enrichment upload CSV (fill-blanks-only)

- **Policy:** Fill blanks only; never overwrite non-empty enrichment fields unless `--force`
- **Done means:**
  - Implement `scripts/scrape-to-enrichment-csv.ts` producing `.local/enrichment-upload.csv`
  - Deterministic ordering + stable headers for clean diffs
  - `npm run enrich:from-scrape -- --in <clean.json> --out .local/enrichment-upload.csv`
- **Verify:** Gates + show row counts + top "missing field" stats

### 4. Create diff report (scrape vs export) to review before uploading

- **Done means:**
  - Implement `scripts/enrichment-diff.ts` comparing scrape-clean to PennyCentral export
  - Output markdown report to `.local/` (new SKUs, mismatches, missing images, suspicious UPC mismatches)
  - `npm run enrich:diff -- --scrape <clean.json> --export <export.json>` writes `.local/enrichment-diff.md`
- **Verify:** Gates + paste diff summary snippet into SESSION_LOG.md

---

## ✅ Recently Completed

- **2026-01-06:** Implemented `scripts/print-penny-list-count.ts` and added `npm run penny:count`.

---

**For full backlog:** See `archive/backlog-history/BACKLOG_full_2025-12.md`
