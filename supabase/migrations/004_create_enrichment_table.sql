-- Pre-enrichment table for storing scraped product data
-- This data is automatically applied to Penny List submissions via applyEnrichment()

BEGIN;

-- =============================================================================
-- PENNY_ITEM_ENRICHMENT TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.penny_item_enrichment (
  sku TEXT PRIMARY KEY CHECK (sku ~ '^\d{6}$' OR sku ~ '^10\d{8}$'),
  item_name TEXT,
  brand TEXT,
  model_number TEXT,
  upc TEXT,
  image_url TEXT,
  home_depot_url TEXT,
  internet_sku BIGINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'scraperapi', 'bookmarklet', 'auto'))
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_enrichment_updated_at ON public.penny_item_enrichment(updated_at DESC);

-- Enable RLS (but allow public reads since this is reference data)
ALTER TABLE public.penny_item_enrichment ENABLE ROW LEVEL SECURITY;

-- Public can read enrichment data (used during Penny List display)
DROP POLICY IF EXISTS "public_read_enrichment" ON public.penny_item_enrichment;
CREATE POLICY "public_read_enrichment"
  ON public.penny_item_enrichment
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can write (used by scripts and cron jobs)
-- Service role bypasses RLS, so no policy needed for writes

-- =============================================================================
-- TRIGGER: Auto-update updated_at on enrichment
-- =============================================================================
DROP TRIGGER IF EXISTS trigger_enrichment_updated_at ON public.penny_item_enrichment;
CREATE TRIGGER trigger_enrichment_updated_at
  BEFORE UPDATE ON public.penny_item_enrichment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
