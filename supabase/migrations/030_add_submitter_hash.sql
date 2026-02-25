-- Migration: 030_add_submitter_hash.sql
-- Purpose: Add a privacy-safe submitter identifier to "Penny List" for abuse investigation and analytics.
--
-- Privacy: SHA-256 is one-way. Not exposed in penny_list_public view.

BEGIN;

ALTER TABLE public."Penny List"
  ADD COLUMN IF NOT EXISTS submitter_hash TEXT;

COMMENT ON COLUMN public."Penny List".submitter_hash IS
  'SHA-256 hash of the submitter client IP. Used for abuse investigation and analytics. Not exposed in the public view.';

CREATE INDEX IF NOT EXISTS idx_penny_list_submitter_hash
  ON public."Penny List" (submitter_hash)
  WHERE submitter_hash IS NOT NULL;

COMMIT;
