-- Migration 014: Fix penny_list_public view permissions
--
-- Issue: Migration 011 changed penny_list_public to SECURITY INVOKER which respects
-- caller permissions. But anon users have no SELECT permission on "Penny List" table,
-- causing "permission denied for table Penny List" errors.
--
-- Fix: Add a SELECT RLS policy for anon users on the "Penny List" table.
-- This allows the SECURITY INVOKER view to work correctly while maintaining RLS.

BEGIN;

-- Add SELECT policy for anon users on "Penny List" table
-- This allows reading through the penny_list_public view
DROP POLICY IF EXISTS "anon-select-penny-list" ON public."Penny List";
CREATE POLICY "anon-select-penny-list"
  ON public."Penny List"
  FOR SELECT
  TO anon
  USING (true);

-- Also grant SELECT on the base table to anon (required for RLS policy to work)
GRANT SELECT ON public."Penny List" TO anon;

COMMIT;
