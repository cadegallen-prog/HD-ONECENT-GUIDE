-- Migration: 025_add_enrichment_provenance.sql
-- Purpose: Add field-level enrichment provenance to "Penny List".
--
-- Why:
-- - We need to record which source populated (or intentionally left null) each enrichment field.
-- - This enables rules like: "If staging touched UPC and it is null, never spend SerpApi trying to fill it."

BEGIN;

ALTER TABLE public."Penny List"
  ADD COLUMN IF NOT EXISTS enrichment_provenance JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public."Penny List".enrichment_provenance IS
  'Field-level provenance for enrichment (source: staging/serpapi, timestamps, and context like delivery_zip).';

COMMIT;

