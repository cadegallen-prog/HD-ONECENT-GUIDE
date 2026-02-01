-- Migration: 026_serpapi_daily_usage_counter.sql
-- Purpose: Enforce a daily cap for realtime SerpApi enrichment.
--
-- Policy:
-- - Realtime SerpApi is preferred UX but must stay within the free tier budget.
-- - This table + RPC provides an atomic "claim a slot" operation for service role callers.

BEGIN;

CREATE TABLE IF NOT EXISTS public.serpapi_daily_usage (
  day DATE PRIMARY KEY,
  realtime_items_started INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_serpapi_daily_usage_updated_at
  ON public.serpapi_daily_usage(updated_at DESC);

-- Service role only (no policies).
ALTER TABLE public.serpapi_daily_usage ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION claim_serpapi_realtime_slot(p_max_per_day INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_day DATE := current_date;
  v_new_count INT;
BEGIN
  IF p_max_per_day IS NULL OR p_max_per_day < 1 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'invalid_max'
    );
  END IF;

  INSERT INTO public.serpapi_daily_usage(day)
  VALUES (v_day)
  ON CONFLICT (day) DO NOTHING;

  UPDATE public.serpapi_daily_usage
  SET
    realtime_items_started = realtime_items_started + 1,
    updated_at = now()
  WHERE day = v_day
    AND realtime_items_started < p_max_per_day
  RETURNING realtime_items_started INTO v_new_count;

  IF v_new_count IS NULL THEN
    SELECT realtime_items_started INTO v_new_count
    FROM public.serpapi_daily_usage
    WHERE day = v_day;

    RETURN jsonb_build_object(
      'allowed', false,
      'day', v_day,
      'count', COALESCE(v_new_count, 0)
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'day', v_day,
    'count', v_new_count
  );
END;
$$;

GRANT EXECUTE ON FUNCTION claim_serpapi_realtime_slot(INT) TO service_role;

COMMENT ON FUNCTION claim_serpapi_realtime_slot IS
  'Atomically claims a realtime SerpApi enrichment slot for today, enforcing a max-per-day cap.';

COMMIT;

