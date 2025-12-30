-- Add negative caching columns to track failed enrichment attempts
-- This prevents wasting SerpApi credits on discontinued/unavailable items

BEGIN;

-- Add status column to track enrichment state
ALTER TABLE public.penny_item_enrichment
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'enriched'
  CHECK (status IN ('enriched', 'not_found', 'error'));

-- Add attempt tracking
ALTER TABLE public.penny_item_enrichment
  ADD COLUMN IF NOT EXISTS attempt_count INT DEFAULT 1;

-- Add retry window (skip until this date)
ALTER TABLE public.penny_item_enrichment
  ADD COLUMN IF NOT EXISTS retry_after TIMESTAMPTZ;

-- Add search term used (for debugging)
ALTER TABLE public.penny_item_enrichment
  ADD COLUMN IF NOT EXISTS last_search_term TEXT;

-- Index for efficient queries on status and retry
CREATE INDEX IF NOT EXISTS idx_enrichment_status_retry
  ON public.penny_item_enrichment(status, retry_after);

-- Comment explaining the columns
COMMENT ON COLUMN public.penny_item_enrichment.status IS
  'enriched = data found, not_found = no results after all attempts, error = API/network error';
COMMENT ON COLUMN public.penny_item_enrichment.retry_after IS
  'Skip this SKU until this date (prevents wasting credits on discontinued items)';
COMMENT ON COLUMN public.penny_item_enrichment.last_search_term IS
  'Last search term tried (SKU, item name, etc.) for debugging';

COMMIT;
