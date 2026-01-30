-- Migration: 024_create_serpapi_logs.sql
-- Purpose: Minimal SerpApi observability.
--
-- This table records per-run summary data from scripts/serpapi-enrich.ts so you (Cade)
-- can audit attempted SerpApi usage without parsing GitHub logs.
--
-- Note: "credits_attempted" reflects the script's internal counter (attempted searches),
-- not a provable SerpApi billing statement.

BEGIN;

CREATE TABLE IF NOT EXISTS public.serpapi_logs (
  run_id UUID PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  items_processed INT NOT NULL DEFAULT 0,
  credits_attempted INT NOT NULL DEFAULT 0,
  skus_enriched TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_serpapi_logs_started_at
  ON public.serpapi_logs(started_at DESC);

-- Service role only (no policies).
ALTER TABLE public.serpapi_logs ENABLE ROW LEVEL SECURITY;

COMMIT;

