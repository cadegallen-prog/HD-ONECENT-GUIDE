-- Migration 012: Restrict Penny List inserts to authenticated users only
-- 
-- Issue: Public inserts allow unauthenticated spam/abuse
-- Fix: Require authentication OR implement rate limiting/verification
--
-- Decision: Require authentication for now (can be relaxed with captcha later)

BEGIN;

-- =============================================================================
-- OPTION 1: Require Authentication (RECOMMENDED)
-- =============================================================================

-- Drop existing anon insert policy
DROP POLICY IF EXISTS "anon-insert-penny-list" ON public."Penny List";

-- Create new policy requiring authentication
CREATE POLICY "authenticated-insert-penny-list"
  ON public."Penny List"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND home_depot_sku_6_or_10_digits::text ~ '^(\\d{6}|10\\d{8})$'
    AND char_length(trim(coalesce(item_name, ''))) BETWEEN 1 AND 75
    AND char_length(trim(coalesce(store_city_state, ''))) >= 2
    AND (exact_quantity_found IS NULL OR (exact_quantity_found BETWEEN 1 AND 99))
    AND coalesce(status, 'pending') = 'pending'
  );

-- Revoke INSERT from anon role
REVOKE INSERT ON public."Penny List" FROM anon;

-- Grant INSERT to authenticated users
GRANT INSERT ON public."Penny List" TO authenticated;

-- Add comment for documentation
COMMENT ON POLICY "authenticated-insert-penny-list" ON public."Penny List" 
IS 'Requires authentication to submit penny finds. Prevents anonymous spam.';

-- =============================================================================
-- OPTION 2 (ALTERNATIVE): Keep anon with honeypot + rate limiting
-- =============================================================================
-- If you want to keep anonymous submissions, you'll need to:
-- 1. Add honeypot field validation in the WITH CHECK clause
-- 2. Implement rate limiting in the API endpoint
-- 3. Add captcha verification (e.g., Turnstile)
--
-- To enable Option 2, uncomment below and comment out Option 1:
--
-- DROP POLICY IF EXISTS "anon-insert-penny-list-with-honeypot" ON public."Penny List";
-- CREATE POLICY "anon-insert-penny-list-with-honeypot"
--   ON public."Penny List"
--   FOR INSERT
--   TO anon
--   WITH CHECK (
--     auth.role() = 'anon'
--     AND home_depot_sku_6_or_10_digits::text ~ '^(\\d{6}|10\\d{8})$'
--     AND char_length(trim(coalesce(item_name, ''))) BETWEEN 1 AND 75
--     AND char_length(trim(coalesce(store_city_state, ''))) >= 2
--     AND (exact_quantity_found IS NULL OR (exact_quantity_found BETWEEN 1 AND 99))
--     AND coalesce(status, 'pending') = 'pending'
--     -- Add honeypot check here when ready:
--     -- AND (honeypot_field IS NULL OR honeypot_field = '')
--   );

COMMIT;
