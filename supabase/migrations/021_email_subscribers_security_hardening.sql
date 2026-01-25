-- Migration: Harden email_subscribers security
-- Purpose: Fix search_path warning and remove overly permissive anon policies
-- Date: 2026-01-24
--
-- Changes:
-- 1. Fix function search_path (security warning)
-- 2. Drop anon INSERT/UPDATE policies (API will use service_role instead)
-- 3. Keep SELECT policy for unsubscribe token lookup
-- 4. Keep service_role policy for API access

BEGIN;

-- =============================================================================
-- FIX 1: Function search_path mutable warning
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_email_subscribers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- FIX 2: Remove overly permissive anon INSERT policy
-- (API will use service_role for inserts)
-- =============================================================================
DROP POLICY IF EXISTS email_subscribers_insert_policy ON public.email_subscribers;

-- =============================================================================
-- FIX 3: Remove overly permissive anon UPDATE policy
-- (API will use service_role for updates)
-- =============================================================================
DROP POLICY IF EXISTS email_subscribers_update_policy ON public.email_subscribers;

-- =============================================================================
-- KEEP: SELECT policy for anon to look up by unsubscribe token
-- (Needed for /api/unsubscribe endpoint)
-- =============================================================================
-- email_subscribers_select_by_token already exists, no changes needed

-- =============================================================================
-- KEEP: Service role policy for API access
-- (service_role bypasses RLS, but explicit policy is good practice)
-- =============================================================================
-- email_subscribers_service_role_all already exists, no changes needed

COMMIT;
