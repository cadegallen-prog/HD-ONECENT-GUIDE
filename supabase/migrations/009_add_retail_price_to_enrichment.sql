/*
 * Add a retail_price column to penny_item_enrichment so scraped price data
 * can be surfaced on Penny List cards and enrichment imports.
 */

BEGIN;

ALTER TABLE public.penny_item_enrichment
  ADD COLUMN IF NOT EXISTS retail_price numeric(10,2);

COMMIT;
