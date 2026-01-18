-- Migration: 017_consume_enrichment_rpc.sql
-- Purpose: Create atomic consume function for enrichment staging
--
-- This function:
-- 1. Finds a matching staging row (by SKU first, then internet_number)
-- 2. Updates the Penny List row with merge rules (never degrade existing data)
-- 3. Deletes the staging row (consume it)
-- 4. Returns result metadata
--
-- All operations happen in a single transaction (atomic).

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
DECLARE
  v_staging enrichment_staging%ROWTYPE;
  v_fields_filled TEXT[] := '{}';
  v_match_type TEXT := 'none';
BEGIN
  -- Find matching staging row (SKU takes priority, then internet_number)
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

  -- No match found
  IF v_staging IS NULL THEN
    RETURN jsonb_build_object(
      'enriched', false,
      'reason', 'no_match'
    );
  END IF;

  -- Update Penny List with merge rules (never degrade existing data)
  -- item_name: ALWAYS overwrite with canonical name (staging row deleted after consumption)
  -- Other fields: Only fill NULL or empty fields, never overwrite good data
  UPDATE "Penny List" SET
    item_name = CASE
      WHEN v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
      THEN v_staging.item_name  -- ALWAYS overwrite with canonical name
      ELSE item_name
    END,
    brand = CASE
      WHEN (brand IS NULL OR brand = '') AND v_staging.brand IS NOT NULL AND v_staging.brand != ''
      THEN v_staging.brand
      ELSE brand
    END,
    retail_price = CASE
      WHEN retail_price IS NULL AND v_staging.retail_price IS NOT NULL
      THEN v_staging.retail_price
      ELSE retail_price
    END,
    upc = CASE
      WHEN (upc IS NULL OR upc = '') AND v_staging.barcode_upc IS NOT NULL AND v_staging.barcode_upc != ''
      THEN v_staging.barcode_upc
      ELSE upc
    END,
    image_url = CASE
      WHEN (image_url IS NULL OR image_url = '') AND v_staging.image_url IS NOT NULL AND v_staging.image_url != ''
      THEN v_staging.image_url
      ELSE image_url
    END,
    home_depot_url = CASE
      WHEN (home_depot_url IS NULL OR home_depot_url = '') AND v_staging.product_link IS NOT NULL AND v_staging.product_link != ''
      THEN v_staging.product_link
      ELSE home_depot_url
    END,
    internet_sku = CASE
      WHEN internet_sku IS NULL AND v_staging.internet_number IS NOT NULL
      THEN v_staging.internet_number
      ELSE internet_sku
    END
  WHERE id = p_penny_id;

  -- Track which fields were potentially filled (staging had non-null values)
  IF v_staging.item_name IS NOT NULL AND v_staging.item_name != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'item_name');
  END IF;
  IF v_staging.brand IS NOT NULL AND v_staging.brand != '' THEN
    v_fields_filled := array_append(v_fields_filled, 'brand');
  END IF;
  IF v_staging.retail_price IS NOT NULL THEN
    v_fields_filled := array_append(v_fields_filled, 'retail_price');
  END IF;
  IF v_staging.barcode_upc IS NOT NULL AND v_staging.barcode_upc != '' THEN
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

  -- DELETE the staging row (consume it) - this is the critical atomic operation
  DELETE FROM enrichment_staging WHERE sku = v_staging.sku;

  RETURN jsonb_build_object(
    'enriched', true,
    'match_type', v_match_type,
    'staging_sku', v_staging.sku,
    'fields_filled', v_fields_filled,
    'staging_row_deleted', true
  );
END;
$$;

-- Grant execute to service role (needed for RPC calls)
GRANT EXECUTE ON FUNCTION consume_enrichment_for_penny_item(UUID, TEXT, BIGINT) TO service_role;

-- Comment for documentation
COMMENT ON FUNCTION consume_enrichment_for_penny_item IS 'Atomically consume a staging row to enrich a Penny List item. Matches by SKU (priority) or internet_number, applies merge rules (never degrade), and deletes the staging row.';
