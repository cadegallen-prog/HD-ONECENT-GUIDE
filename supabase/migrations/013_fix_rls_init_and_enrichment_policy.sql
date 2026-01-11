-- Migration 013: Fix RLS initialization re-evaluation and duplicate enrichment policy
-- - Wrap auth.uid() calls in SELECT to prevent per-row re-evaluation warnings
-- - Remove duplicate anon enrichment policy (keep public_read_enrichment)

BEGIN;

-- =====================
-- lists
-- =====================
DROP POLICY IF EXISTS "users_select_own_lists" ON public.lists;
CREATE POLICY "users_select_own_lists"
  ON public.lists
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "users_insert_own_lists" ON public.lists;
CREATE POLICY "users_insert_own_lists"
  ON public.lists
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "users_update_own_lists" ON public.lists;
CREATE POLICY "users_update_own_lists"
  ON public.lists
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "users_delete_own_lists" ON public.lists;
CREATE POLICY "users_delete_own_lists"
  ON public.lists
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

-- =====================
-- list_items
-- =====================
DROP POLICY IF EXISTS "users_select_own_list_items" ON public.list_items;
CREATE POLICY "users_select_own_list_items"
  ON public.list_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "users_insert_own_list_items" ON public.list_items;
CREATE POLICY "users_insert_own_list_items"
  ON public.list_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "users_update_own_list_items" ON public.list_items;
CREATE POLICY "users_update_own_list_items"
  ON public.list_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "users_delete_own_list_items" ON public.list_items;
CREATE POLICY "users_delete_own_list_items"
  ON public.list_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

-- =====================
-- list_shares
-- =====================
DROP POLICY IF EXISTS "owners_select_shares" ON public.list_shares;
CREATE POLICY "owners_select_shares"
  ON public.list_shares
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_shares.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "owners_insert_shares" ON public.list_shares;
CREATE POLICY "owners_insert_shares"
  ON public.list_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_shares.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "owners_delete_shares" ON public.list_shares;
CREATE POLICY "owners_delete_shares"
  ON public.list_shares
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_shares.list_id
        AND lists.owner_id = (SELECT auth.uid())
    )
  );

-- =====================
-- Penny List
-- =====================
DROP POLICY IF EXISTS "authenticated-insert-penny-list" ON public."Penny List";
CREATE POLICY "authenticated-insert-penny-list"
  ON public."Penny List"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
    AND (home_depot_sku_6_or_10_digits)::text ~ '^(\\d{6}|10\\d{8})$'
    AND char_length(trim(coalesce(item_name, ''))) BETWEEN 1 AND 75
    AND char_length(trim(coalesce(store_city_state, ''))) >= 2
    AND (exact_quantity_found IS NULL OR (exact_quantity_found BETWEEN 1 AND 99))
    AND coalesce(status, 'pending') = 'pending'
  );

-- =====================
-- penny_item_enrichment duplicate policy cleanup
-- =====================
DROP POLICY IF EXISTS "anon-select-enrichment" ON public.penny_item_enrichment;
-- Keep the combined public_read_enrichment policy

COMMIT;
