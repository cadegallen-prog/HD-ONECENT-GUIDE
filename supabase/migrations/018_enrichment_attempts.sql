-- Migration: Add enrichment_attempts column to track retry count
-- Purpose: Prevent wasting SerpApi credits on bad SKUs by limiting retries
-- Date: 2026-01-18

-- Add column to track enrichment attempts
ALTER TABLE "Penny List"
  ADD COLUMN IF NOT EXISTS enrichment_attempts INT DEFAULT 0;

-- Index for efficient querying of rows that haven't exceeded retry limit
-- Partial index only includes rows with < 2 attempts (reduces index size)
CREATE INDEX IF NOT EXISTS idx_penny_list_enrichment_attempts
  ON "Penny List"(enrichment_attempts)
  WHERE enrichment_attempts < 2;
