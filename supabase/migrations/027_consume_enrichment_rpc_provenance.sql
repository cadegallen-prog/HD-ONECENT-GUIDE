-- Migration: 027_consume_enrichment_rpc_provenance.sql
-- Purpose: Record staging provenance on "Penny List" enrichment fields.
--
-- Key policy:
-- - Staging is canonical/authoritative for the fields it provides.
-- - For opportunistic fields (UPC, internet_sku), a NULL from staging is treated as "confirmed absent"
--   and is written to provenance so downstream SerpApi logic can skip forever.
-- - retail_price is intentionally NOT copied from staging (see migration 022).

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
  v_prov_updates JSONB := '{}'::jsonb;
  v_now TIMESTAMPTZ := now();
  v_staging_upc TEXT := NULL;
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

  -- Normalize staging UPC: treat empty string as NULL.
  IF v_staging.barcode_upc IS NOT NULL AND v_staging.barcode_upc != '' THEN
    v_staging_upc := v_staging.barcode_upc;
  END IF;

  -- Build provenance updates (always mark staging touch + optional-field absence)
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

  -- Update Penny List.
  --
  -- IMPORTANT: retail_price is intentionally NOT copied from staging.
  UPDATE "Penny List" SET
    -- item_name: overwrite with canonical name when present
    item_name = CASE
      WHEN v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
      THEN v_staging.item_name
      ELSE item_name
    END,
    -- brand/image/url: prefer staging when present (do not overwrite with empty)
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
    -- opportunistic fields: staging is authoritative, including NULL (confirmed absent)
    upc = v_staging_upc,
    internet_sku = v_staging.internet_number,
    -- provenance merge
    enrichment_provenance = COALESCE(enrichment_provenance, '{}'::jsonb) || v_prov_updates
  WHERE id = p_penny_id;

  -- Track which fields were potentially filled (staging had non-null values)
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

  -- DELETE the staging row (consume it) - critical atomic operation
  DELETE FROM enrichment_staging WHERE sku = v_staging.sku;

  RETURN jsonb_build_object(
    'enriched', true,
    'match_type', v_match_type,
    'staging_sku', v_staging.sku,
    'fields_filled', v_fields_filled,
    'staging_row_deleted', true,
    'provenance_written', true
  );
END;
$$;

GRANT EXECUTE ON FUNCTION consume_enrichment_for_penny_item(UUID, TEXT, BIGINT) TO service_role;

COMMENT ON FUNCTION consume_enrichment_for_penny_item IS
  'Consumes an enrichment_staging row to enrich a Penny List item, writes enrichment_provenance, and treats NULL UPC/internet_sku as confirmed absent.';

