-- Migration: 023_backlog_cleanup_enrichment_attempts.sql
-- Purpose: One-time credit-safety cleanup.
--
-- We cap enrichment_attempts for OLD rows with enrichment gaps so the SerpApi job
-- (which filters on enrichment_attempts < 2) won't churn historical backlog.
--
-- Policy:
-- - Only affects rows older than 60 days.
-- - Only affects rows that still have gaps in canonical enrichment fields:
--   item_name, brand, image_url, retail_price.
-- - Does NOT delete any data.

BEGIN;

UPDATE public."Penny List"
SET enrichment_attempts = 3
WHERE
  "timestamp" < (now() - interval '60 days')
  AND COALESCE(enrichment_attempts, 0) < 3
  AND (
    item_name IS NULL
    OR brand IS NULL
    OR image_url IS NULL
    OR retail_price IS NULL
  );

COMMIT;

