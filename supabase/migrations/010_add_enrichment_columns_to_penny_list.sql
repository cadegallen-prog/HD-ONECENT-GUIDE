/*
 * Add enrichment columns to Penny List table
 *
 * This migration moves enrichment data from the penny_item_enrichment table
 * directly into the Penny List table for simpler display logic and better performance.
 *
 * Changes:
 * 1. Add 4 new columns: brand, model_number, upc, retail_price
 * 2. Update penny_list_public view to expose new columns
 * 3. Backfill existing rows with enrichment data where available
 *
 * Migration Date: 2026-01-10
 */

BEGIN;

-- =============================================================================
-- ADD ENRICHMENT COLUMNS TO PENNY LIST
-- =============================================================================

ALTER TABLE public."Penny List"
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS model_number TEXT,
  ADD COLUMN IF NOT EXISTS upc TEXT,
  ADD COLUMN IF NOT EXISTS retail_price NUMERIC(10,2);

-- =============================================================================
-- UPDATE PUBLIC VIEW TO INCLUDE NEW COLUMNS
-- =============================================================================

CREATE OR REPLACE VIEW public.penny_list_public AS
SELECT
  id,
  purchase_date,
  item_name,
  home_depot_sku_6_or_10_digits,
  exact_quantity_found,
  store_city_state,
  image_url,
  notes_optional,
  home_depot_url,
  internet_sku,
  timestamp,
  brand,
  model_number,
  upc,
  retail_price
FROM public."Penny List";

-- Grant access to anonymous users
GRANT SELECT ON public.penny_list_public TO anon;

-- =============================================================================
-- BACKFILL EXISTING ROWS (one-time migration)
-- =============================================================================

-- Copy enrichment data to Penny List rows that have matching SKUs
-- Uses COALESCE to preserve any existing data in Penny List
UPDATE public."Penny List" pl
SET
  brand = COALESCE(pl.brand, e.brand),
  model_number = COALESCE(pl.model_number, e.model_number),
  upc = COALESCE(pl.upc, e.upc),
  retail_price = COALESCE(pl.retail_price, e.retail_price),
  -- Also update existing fields with enrichment data if not already set
  item_name = COALESCE(pl.item_name, e.item_name),
  image_url = COALESCE(pl.image_url, e.image_url),
  home_depot_url = COALESCE(pl.home_depot_url, e.home_depot_url),
  internet_sku = COALESCE(pl.internet_sku, e.internet_sku)
FROM public.penny_item_enrichment e
WHERE pl.home_depot_sku_6_or_10_digits::text = e.sku::text;

COMMIT;
