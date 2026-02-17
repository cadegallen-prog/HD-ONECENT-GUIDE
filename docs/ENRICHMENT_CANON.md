# Penny List Enrichment Canon

## Objective

Every Main List item should converge to complete enrichment while minimizing Web Scraper credit usage.
`data/penny-list.json` is not a production write target; it is a local fixture fallback for development/testing.

## Canonical Order

1. `Main List` self-absorption (same SKU, best existing row).
2. `Item Cache` apply (`enrichment_staging`, non-consuming).
3. `Web Scraper` (SerpAPI) only if gaps remain.
4. `Manual Add` via `/manual` JSON when automated sources cannot complete enrichment.

## Automatic Backfill Rule

When a SKU is inserted/updated in `Item Cache`, previously submitted Main List rows for that SKU are auto-backfilled by DB trigger.

## Merge Rules

1. `home_depot_sku_6_or_10_digits` is user identifier and is never replaced.
2. Non-empty automated values overwrite target fields.
3. Empty automated values never overwrite non-empty target text fields.
4. `item_name` from automated sources replaces user-typed name when non-empty.
5. `upc` and `internet_sku` from Item Cache keep authoritative-null behavior via provenance (`confirmed_absent`).
6. `retail_price` from Item Cache is excluded by policy (Web Scraper and Manual Add can set it).

## Item Cache Interfaces

1. `apply_item_cache_enrichment_for_penny_item` (non-consuming apply).
2. `consume_enrichment_for_penny_item` (legacy consuming behavior; backward compatibility).
3. `backfill_penny_list_from_item_cache_for_sku` (gap-only SKU backfill, skips rows already marked with `_staging` provenance).
4. `backfill_penny_list_from_item_cache` (bulk gap-only backfill).

## Commands

1. `npm run warm:staging` - fill Item Cache from Cache Loader.
2. `npm run backfill:item-cache` - bulk backfill gap rows from Item Cache.
3. `npm run backfill:staging` - alias for `backfill:item-cache`.
4. `npm run manual:enrich` - parse Manual Add JSON and apply to Item Cache + Main List.

## Manual Add Payloads

Accepts:

1. Single object JSON.
2. Array JSON.
3. Keyed object map (SKU keys).

Example:

```json
{
  "sku": "123456",
  "name": "Widget",
  "brand": "Acme",
  "image_url": "https://example.com/image.jpg",
  "home_depot_url": "https://www.homedepot.com/p/205744536",
  "internet_number": 205744536
}
```

## Glossary

- `Item Cache`: `enrichment_staging` table (reusable cache of item details).
- `Main List`: `Penny List` table shown publicly.
- `Web Scraper`: SerpAPI fallback source.
- `Manual Add`: founder-provided JSON enrichment input.
- `Upsert`: insert new row or update existing row for same key.
- `Cache Loader`: warmer/manual processes that fill Item Cache.
