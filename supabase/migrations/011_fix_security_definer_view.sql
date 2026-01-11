-- Migration 011: Fix SECURITY DEFINER view
-- 
-- Issue: penny_list_public was created as SECURITY DEFINER which bypasses RLS
-- Fix: Recreate as SECURITY INVOKER (default) to respect user permissions
--
-- Context: The view was flagged in Supabase dashboard as a security risk.
-- SECURITY INVOKER ensures the view respects the calling user's permissions.

BEGIN;

-- Drop the existing view
DROP VIEW IF EXISTS public.penny_list_public;

-- Recreate as SECURITY INVOKER (default - no need to specify)
-- This ensures the view runs with the permissions of the user calling it
CREATE OR REPLACE VIEW public.penny_list_public 
WITH (security_invoker = true) AS
SELECT
  id,
  purchase_date,
  item_name,
  home_depot_sku_6_or_10_digits,
  exact_quantity_found,
  store_city_state,
  image_url,
  notes_optional,
  home_depot_url,
  internet_sku,
  timestamp,
  brand,
  model_number,
  upc,
  retail_price
FROM public."Penny List";

-- Grant SELECT to anon (public read access)
GRANT SELECT ON public.penny_list_public TO anon;

-- Add comment for documentation
COMMENT ON VIEW public.penny_list_public IS 'Public read-only view of penny list items. Uses SECURITY INVOKER to respect RLS policies.';

COMMIT;
