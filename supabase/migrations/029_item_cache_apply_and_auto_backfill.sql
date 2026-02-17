-- Migration: 029_item_cache_apply_and_auto_backfill.sql
-- Purpose:
--   1) Add a non-consuming Item Cache apply RPC.
--   2) Keep consume_enrichment_for_penny_item backward-compatible.
--   3) Add SKU/bulk backfill RPCs for existing Penny List gaps.
--   4) Auto-backfill Penny List when Item Cache rows are inserted/updated.
--
-- Canonical enrichment order supported by this migration:
--   Main List -> Item Cache -> Web Scraper -> Manual Add

BEGIN;

CREATE OR REPLACE FUNCTION _item_cache_enrichment_core(
  p_penny_id UUID,
  p_sku TEXT,
  p_internet_number BIGINT DEFAULT NULL,
  p_delete_cache_row BOOLEAN DEFAULT FALSE,
  p_require_gap BOOLEAN DEFAULT FALSE,
  p_skip_if_staging BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_staging enrichment_staging%ROWTYPE;
  v_fields_filled TEXT[] := '{}';
  v_match_type TEXT := 'none';
  v_prov_updates JSONB := '{}'::jsonb;
  v_now TIMESTAMPTZ := now();
  v_staging_upc TEXT := NULL;

  v_item_name TEXT;
  v_brand TEXT;
  v_image_url TEXT;
  v_home_depot_url TEXT;
  v_upc TEXT;
  v_internet_sku BIGINT;
  v_existing_provenance JSONB;

  v_has_gap BOOLEAN := FALSE;
  v_has_staging_marker BOOLEAN := FALSE;
BEGIN
  -- Load current row state.
  SELECT
    item_name,
    brand,
    image_url,
    home_depot_url,
    upc,
    internet_sku,
    enrichment_provenance
  INTO
    v_item_name,
    v_brand,
    v_image_url,
    v_home_depot_url,
    v_upc,
    v_internet_sku,
    v_existing_provenance
  FROM "Penny List"
  WHERE id = p_penny_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'enriched', false,
      'reason', 'penny_not_found'
    );
  END IF;

  v_has_staging_marker := COALESCE(v_existing_provenance, '{}'::jsonb) ? '_staging';
  IF p_skip_if_staging AND v_has_staging_marker THEN
    RETURN jsonb_build_object(
      'enriched', false,
      'reason', 'already_staging'
    );
  END IF;

  v_has_gap :=
    (v_item_name IS NULL OR btrim(v_item_name) = '')
    OR (v_brand IS NULL OR btrim(v_brand) = '')
    OR (v_image_url IS NULL OR btrim(v_image_url) = '')
    OR (v_home_depot_url IS NULL OR btrim(v_home_depot_url) = '')
    OR (v_upc IS NULL OR btrim(v_upc) = '')
    OR (v_internet_sku IS NULL);

  IF p_require_gap AND NOT v_has_gap THEN
    RETURN jsonb_build_object(
      'enriched', false,
      'reason', 'no_gap'
    );
  END IF;

  -- Find matching Item Cache row (SKU first, then internet number).
  SELECT * INTO v_staging
  FROM enrichment_staging
  WHERE sku = p_sku
  LIMIT 1;

  IF v_staging IS NOT NULL THEN
    v_match_type := 'sku';
  ELSIF p_internet_number IS NOT NULL THEN
    SELECT * INTO v_staging
    FROM enrichment_staging
    WHERE internet_number = p_internet_number
    LIMIT 1;

    IF v_staging IS NOT NULL THEN
      v_match_type := 'internet_number';
    END IF;
  END IF;

  IF v_staging IS NULL THEN
    RETURN jsonb_build_object(
      'enriched', false,
      'reason', 'no_match'
    );
  END IF;

  -- Normalize UPC: empty string is treated as NULL (authoritative absent).
  IF v_staging.barcode_upc IS NOT NULL AND v_staging.barcode_upc != '' THEN
    v_staging_upc := v_staging.barcode_upc;
  END IF;

  -- Build provenance updates.
  v_prov_updates := v_prov_updates || jsonb_build_object(
    '_schema', 1,
    '_staging', jsonb_build_object(
      'at', v_now,
      'match_type', v_match_type,
      'staging_sku', v_staging.sku
    ),
    'upc', jsonb_build_object(
      'source', 'staging',
      'at', v_now,
      'confirmed_absent', (v_staging_upc IS NULL)
    ),
    'internet_sku', jsonb_build_object(
      'source', 'staging',
      'at', v_now,
      'confirmed_absent', (v_staging.internet_number IS NULL)
    )
  );

  IF v_staging.item_name IS NOT NULL AND v_staging.item_name != '' THEN
    v_prov_updates := v_prov_updates || jsonb_build_object(
      'item_name', jsonb_build_object('source', 'staging', 'at', v_now)
    );
  END IF;
  IF v_staging.brand IS NOT NULL AND v_staging.brand != '' THEN
    v_prov_updates := v_prov_updates || jsonb_build_object(
      'brand', jsonb_build_object('source', 'staging', 'at', v_now)
    );
  END IF;
  IF v_staging.image_url IS NOT NULL AND v_staging.image_url != '' THEN
    v_prov_updates := v_prov_updates || jsonb_build_object(
      'image_url', jsonb_build_object('source', 'staging', 'at', v_now)
    );
  END IF;
  IF v_staging.product_link IS NOT NULL AND v_staging.product_link != '' THEN
    v_prov_updates := v_prov_updates || jsonb_build_object(
      'home_depot_url', jsonb_build_object('source', 'staging', 'at', v_now)
    );
  END IF;

  -- Apply merge rules.
  UPDATE "Penny List" SET
    -- Always prefer non-empty canonical item name from Item Cache.
    item_name = CASE
      WHEN v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
      THEN v_staging.item_name
      ELSE item_name
    END,
    -- Prefer Item Cache when non-empty (never overwrite with empty).
    brand = CASE
      WHEN v_staging.brand IS NOT NULL AND v_staging.brand != ''
      THEN v_staging.brand
      ELSE brand
    END,
    image_url = CASE
      WHEN v_staging.image_url IS NOT NULL AND v_staging.image_url != ''
      THEN v_staging.image_url
      ELSE image_url
    END,
    home_depot_url = CASE
      WHEN v_staging.product_link IS NOT NULL AND v_staging.product_link != ''
      THEN v_staging.product_link
      ELSE home_depot_url
    END,
    -- Authoritative nullable fields from Item Cache.
    upc = v_staging_upc,
    internet_sku = v_staging.internet_number,
    -- retail_price intentionally excluded from Item Cache merge policy.
    enrichment_provenance = COALESCE(enrichment_provenance, '{}'::jsonb) || v_prov_updates
  WHERE id = p_penny_id;

  IF v_staging.item_name IS NOT NULL AND v_staging.item_name != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'item_name');
  END IF;
  IF v_staging.brand IS NOT NULL AND v_staging.brand != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'brand');
  END IF;
  IF v_staging_upc IS NOT NULL THEN
    v_fields_filled := array_append(v_fields_filled, 'barcode_upc');
  END IF;
  IF v_staging.image_url IS NOT NULL AND v_staging.image_url != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'image_url');
  END IF;
  IF v_staging.product_link IS NOT NULL AND v_staging.product_link != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'product_link');
  END IF;
  IF v_staging.internet_number IS NOT NULL THEN
    v_fields_filled := array_append(v_fields_filled, 'internet_number');
  END IF;

  IF p_delete_cache_row THEN
    DELETE FROM enrichment_staging WHERE sku = v_staging.sku;
  END IF;

  RETURN jsonb_build_object(
    'enriched', true,
    'match_type', v_match_type,
    'staging_sku', v_staging.sku,
    'fields_filled', v_fields_filled,
    'staging_row_deleted', p_delete_cache_row,
    'provenance_written', true
  );
END;
$$;

-- Backward-compatible consuming RPC.
CREATE OR REPLACE FUNCTION consume_enrichment_for_penny_item(
  p_penny_id UUID,
  p_sku TEXT,
  p_internet_number BIGINT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN _item_cache_enrichment_core(
    p_penny_id,
    p_sku,
    p_internet_number,
    TRUE,   -- delete cache row
    FALSE,  -- no gap requirement
    FALSE   -- no _staging skip
  );
END;
$$;

-- New non-consuming Item Cache apply RPC.
CREATE OR REPLACE FUNCTION apply_item_cache_enrichment_for_penny_item(
  p_penny_id UUID,
  p_sku TEXT,
  p_internet_number BIGINT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN _item_cache_enrichment_core(
    p_penny_id,
    p_sku,
    p_internet_number,
    FALSE,  -- keep cache row
    FALSE,  -- no gap requirement
    FALSE   -- no _staging skip
  );
END;
$$;

-- Backfill for a single SKU.
CREATE OR REPLACE FUNCTION backfill_penny_list_from_item_cache_for_sku(
  p_sku TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_result JSONB;
  v_processed INT := 0;
  v_enriched INT := 0;
  v_no_match INT := 0;
  v_skipped INT := 0;
BEGIN
  FOR v_row IN
    SELECT
      id,
      home_depot_sku_6_or_10_digits::text AS sku,
      internet_sku
    FROM "Penny List"
    WHERE home_depot_sku_6_or_10_digits::text = p_sku
      AND NOT (COALESCE(enrichment_provenance, '{}'::jsonb) ? '_staging')
      AND (
        item_name IS NULL OR btrim(item_name) = ''
        OR brand IS NULL OR btrim(brand) = ''
        OR image_url IS NULL OR btrim(image_url) = ''
        OR home_depot_url IS NULL OR btrim(home_depot_url) = ''
        OR upc IS NULL OR btrim(upc) = ''
        OR internet_sku IS NULL
      )
    ORDER BY "timestamp" DESC NULLS LAST, id DESC
  LOOP
    v_processed := v_processed + 1;
    v_result := _item_cache_enrichment_core(
      v_row.id,
      v_row.sku,
      v_row.internet_sku,
      FALSE, -- keep cache row
      TRUE,  -- require gaps
      TRUE   -- skip if already _staging-marked
    );

    IF COALESCE((v_result->>'enriched')::BOOLEAN, FALSE) THEN
      v_enriched := v_enriched + 1;
    ELSIF v_result->>'reason' = 'no_match' THEN
      v_no_match := v_no_match + 1;
    ELSE
      v_skipped := v_skipped + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'sku', p_sku,
    'processed', v_processed,
    'enriched', v_enriched,
    'no_match', v_no_match,
    'skipped', v_skipped
  );
END;
$$;

-- Bulk backfill helper.
CREATE OR REPLACE FUNCTION backfill_penny_list_from_item_cache(
  p_limit INT DEFAULT 5000
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_result JSONB;
  v_processed INT := 0;
  v_enriched INT := 0;
  v_no_match INT := 0;
  v_skipped INT := 0;
BEGIN
  FOR v_row IN
    SELECT
      id,
      home_depot_sku_6_or_10_digits::text AS sku,
      internet_sku
    FROM "Penny List"
    WHERE NOT (COALESCE(enrichment_provenance, '{}'::jsonb) ? '_staging')
      AND (
        item_name IS NULL OR btrim(item_name) = ''
        OR brand IS NULL OR btrim(brand) = ''
        OR image_url IS NULL OR btrim(image_url) = ''
        OR home_depot_url IS NULL OR btrim(home_depot_url) = ''
        OR upc IS NULL OR btrim(upc) = ''
        OR internet_sku IS NULL
      )
    ORDER BY "timestamp" DESC NULLS LAST, id DESC
    LIMIT GREATEST(COALESCE(p_limit, 0), 0)
  LOOP
    v_processed := v_processed + 1;
    v_result := _item_cache_enrichment_core(
      v_row.id,
      v_row.sku,
      v_row.internet_sku,
      FALSE, -- keep cache row
      TRUE,  -- require gaps
      TRUE   -- skip if already _staging-marked
    );

    IF COALESCE((v_result->>'enriched')::BOOLEAN, FALSE) THEN
      v_enriched := v_enriched + 1;
    ELSIF v_result->>'reason' = 'no_match' THEN
      v_no_match := v_no_match + 1;
    ELSE
      v_skipped := v_skipped + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'limit', p_limit,
    'processed', v_processed,
    'enriched', v_enriched,
    'no_match', v_no_match,
    'skipped', v_skipped
  );
END;
$$;

CREATE OR REPLACE FUNCTION trigger_backfill_penny_list_from_item_cache_on_upsert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sku IS NOT NULL AND btrim(NEW.sku) != '' THEN
    PERFORM backfill_penny_list_from_item_cache_for_sku(NEW.sku);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Item Cache auto-backfill trigger failed for sku=%: %', NEW.sku, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_backfill_penny_list_from_item_cache_on_upsert
  ON enrichment_staging;

CREATE TRIGGER trg_backfill_penny_list_from_item_cache_on_upsert
AFTER INSERT OR UPDATE ON enrichment_staging
FOR EACH ROW
EXECUTE FUNCTION trigger_backfill_penny_list_from_item_cache_on_upsert();

GRANT EXECUTE ON FUNCTION consume_enrichment_for_penny_item(UUID, TEXT, BIGINT) TO service_role;
GRANT EXECUTE ON FUNCTION apply_item_cache_enrichment_for_penny_item(UUID, TEXT, BIGINT) TO service_role;
GRANT EXECUTE ON FUNCTION backfill_penny_list_from_item_cache_for_sku(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION backfill_penny_list_from_item_cache(INT) TO service_role;

COMMENT ON FUNCTION consume_enrichment_for_penny_item IS
  'Consumes (deletes) an Item Cache row after applying merge/provenance to Penny List.';

COMMENT ON FUNCTION apply_item_cache_enrichment_for_penny_item IS
  'Applies Item Cache merge/provenance to Penny List without deleting cache rows.';

COMMENT ON FUNCTION backfill_penny_list_from_item_cache_for_sku IS
  'Backfills existing Penny List rows for one SKU from Item Cache using non-consuming merge.';

COMMENT ON FUNCTION backfill_penny_list_from_item_cache IS
  'Backfills existing Penny List rows from Item Cache in bulk using non-consuming merge.';

COMMIT;
