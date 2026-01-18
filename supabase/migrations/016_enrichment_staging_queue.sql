-- Migration: 016_enrichment_staging_queue.sql
-- Purpose: Replace penny_item_enrichment with enrichment_staging (temporary queue model)
--
-- Key changes:
-- - Drop existing penny_item_enrichment table (data is transient, OK to lose)
-- - Create new enrichment_staging table with minimal schema per spec
-- - No status/retry tracking (not needed for queue model)
-- - RLS enabled, service role only (no public read/write)

-- Drop existing table and related objects
DROP TABLE IF EXISTS penny_item_enrichment CASCADE;

-- Create new staging table
CREATE TABLE enrichment_staging (
  sku TEXT PRIMARY KEY CHECK (sku ~ '^\d{6}$' OR sku ~ '^10[01]\d{7}$'),
  internet_number BIGINT,
  barcode_upc TEXT,
  item_name TEXT,
  brand TEXT,
  retail_price NUMERIC(10,2),
  image_url TEXT,
  product_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for internet_number matching (partial index, only where not null)
CREATE UNIQUE INDEX idx_staging_internet_number
  ON enrichment_staging(internet_number)
  WHERE internet_number IS NOT NULL;

-- Index for efficient created_at ordering (for cleanup queries if needed)
CREATE INDEX idx_staging_created_at
  ON enrichment_staging(created_at);

-- Enable RLS (no policies = service role only)
ALTER TABLE enrichment_staging ENABLE ROW LEVEL SECURITY;

-- Comment for documentation
COMMENT ON TABLE enrichment_staging IS 'Temporary staging queue for enrichment data. Rows are consumed (deleted) when matched during submission.';
COMMENT ON COLUMN enrichment_staging.sku IS 'Home Depot SKU (6-digit store or 10-digit internet starting with 100/101)';
COMMENT ON COLUMN enrichment_staging.internet_number IS 'Home Depot internet/online SKU number';
COMMENT ON COLUMN enrichment_staging.barcode_upc IS 'UPC barcode (12-14 digits)';
COMMENT ON COLUMN enrichment_staging.product_link IS 'Home Depot product page URL';
