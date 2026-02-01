-- Migration: 028_backfill_enrichment_provenance_seeded_trickle.sql
-- Purpose: Best-effort provenance backfill for rows that we can confidently attribute to staging
-- (auto-seeded rows + trickle rows).
--
-- Notes:
-- - We cannot reliably infer provenance for arbitrary historical user rows.
-- - We CAN infer for seeded rows (tracked in seeded_skus) and trickle rows (source='trickle'),
--   because those flows copy fields from enrichment_staging.

BEGIN;

-- Ensure schema marker exists for all rows (keeps JSON shape predictable).
UPDATE public."Penny List"
SET enrichment_provenance =
  COALESCE(enrichment_provenance, '{}'::jsonb) ||
  jsonb_build_object('_schema', 1)
WHERE enrichment_provenance IS NULL
  OR enrichment_provenance = '{}'::jsonb
  OR NOT (enrichment_provenance ? '_schema');

-- Backfill seeded rows (identified via seeded_skus.penny_list_id).
UPDATE public."Penny List" pl
SET enrichment_provenance =
  COALESCE(pl.enrichment_provenance, '{}'::jsonb) ||
  jsonb_build_object(
    '_schema', 1,
    '_staging', jsonb_build_object(
      'at', pl."timestamp",
      'match_type', 'backfill_seeded',
      'staging_sku', pl.home_depot_sku_6_or_10_digits::text
    )
  ) ||
  jsonb_strip_nulls(jsonb_build_object(
    'item_name', CASE WHEN pl.item_name IS NOT NULL AND pl.item_name != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'brand', CASE WHEN pl.brand IS NOT NULL AND pl.brand != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'model_number', CASE WHEN pl.model_number IS NOT NULL AND pl.model_number != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'image_url', CASE WHEN pl.image_url IS NOT NULL AND pl.image_url != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'home_depot_url', CASE WHEN pl.home_depot_url IS NOT NULL AND pl.home_depot_url != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END
  )) ||
  jsonb_build_object(
    'upc', jsonb_build_object(
      'source', 'staging',
      'at', pl."timestamp",
      'confirmed_absent', (pl.upc IS NULL OR pl.upc = '')
    ),
    'internet_sku', jsonb_build_object(
      'source', 'staging',
      'at', pl."timestamp",
      'confirmed_absent', (pl.internet_sku IS NULL)
    )
  )
FROM public.seeded_skus s
WHERE s.penny_list_id = pl.id
  AND NOT (COALESCE(pl.enrichment_provenance, '{}'::jsonb) ? '_staging');

-- Backfill trickle rows (source='trickle').
UPDATE public."Penny List" pl
SET enrichment_provenance =
  COALESCE(pl.enrichment_provenance, '{}'::jsonb) ||
  jsonb_build_object(
    '_schema', 1,
    '_staging', jsonb_build_object(
      'at', pl."timestamp",
      'match_type', 'backfill_trickle',
      'staging_sku', pl.home_depot_sku_6_or_10_digits::text
    )
  ) ||
  jsonb_strip_nulls(jsonb_build_object(
    'item_name', CASE WHEN pl.item_name IS NOT NULL AND pl.item_name != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'brand', CASE WHEN pl.brand IS NOT NULL AND pl.brand != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'model_number', CASE WHEN pl.model_number IS NOT NULL AND pl.model_number != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'image_url', CASE WHEN pl.image_url IS NOT NULL AND pl.image_url != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END,
    'home_depot_url', CASE WHEN pl.home_depot_url IS NOT NULL AND pl.home_depot_url != '' THEN jsonb_build_object('source','staging','at', pl."timestamp") ELSE NULL END
  )) ||
  jsonb_build_object(
    'upc', jsonb_build_object(
      'source', 'staging',
      'at', pl."timestamp",
      'confirmed_absent', (pl.upc IS NULL OR pl.upc = '')
    ),
    'internet_sku', jsonb_build_object(
      'source', 'staging',
      'at', pl."timestamp",
      'confirmed_absent', (pl.internet_sku IS NULL)
    )
  )
WHERE pl.source = 'trickle'
  AND NOT (COALESCE(pl.enrichment_provenance, '{}'::jsonb) ? '_staging');

COMMIT;

