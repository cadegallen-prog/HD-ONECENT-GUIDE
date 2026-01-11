# Apply Supabase Migrations - MANUAL STEPS

Since Supabase CLI is not installed, follow these steps to apply the migrations manually:

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

---

## Step 2: Run Migration 011 (Fix SECURITY DEFINER View)

Copy and paste this SQL into the editor and click **Run**:

```sql
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
```

✅ You should see: **Success. No rows returned**

---

## Step 3: Run Migration 012 (Restrict Penny List Inserts)

Copy and paste this SQL into the editor and click **Run**:

```sql
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

COMMIT;
```

✅ You should see: **Success. No rows returned**

---

## Step 4: Verify in Supabase Dashboard

After running both migrations:

1. Go to **Database** → **Tables** → **Penny List**
2. Click **Policies** tab
3. Verify you see `authenticated-insert-penny-list` policy (not `anon-insert-penny-list`)

4. Go to **Database** → **Views**
5. Find `penny_list_public`
6. Verify it shows `security_invoker = true` (no security warnings)

---

## What This Fixed

1. **Infinite API Loop**: Frontend now makes 1 API call per filter change instead of thousands
2. **Security View**: View now respects RLS policies (no longer bypasses permissions)
3. **Insert Protection**: Users must authenticate to submit penny finds (prevents spam)

---

## Frontend Deployment

✅ **Already deployed!**

Your code was pushed to GitHub at: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/commit/5c7f154

Vercel is automatically deploying now. Check: https://vercel.com/your-project/deployments

---

## Monitor Impact

After deployment completes:

1. **Supabase Dashboard** → **Reports** → Check API call rate (should drop dramatically)
2. Visit https://pennycentral.com/penny-list
3. Open Browser DevTools → Network tab
4. Change a filter (state, search, etc.)
5. Verify only 1 API call to `/api/penny-list` per change (not hundreds)

---

## Rollback Plan

If something breaks, see [SUPABASE_CRITICAL_FIXES.md](./SUPABASE_CRITICAL_FIXES.md) for rollback SQL.
