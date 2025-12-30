-- Add 'serpapi' as a valid source for enrichment data

BEGIN;

-- Drop the existing check constraint and add a new one with serpapi included
ALTER TABLE public.penny_item_enrichment
  DROP CONSTRAINT IF EXISTS penny_item_enrichment_source_check;

ALTER TABLE public.penny_item_enrichment
  ADD CONSTRAINT penny_item_enrichment_source_check
  CHECK (source IN ('manual', 'scraperapi', 'bookmarklet', 'auto', 'serpapi', 'stealth'));

COMMIT;
