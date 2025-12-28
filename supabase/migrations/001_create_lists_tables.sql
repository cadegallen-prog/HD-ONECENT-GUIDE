-- PR-3: Personal Lists Tables
-- Run in Supabase SQL Editor or via CLI migration

BEGIN;

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- LISTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by owner
CREATE INDEX IF NOT EXISTS idx_lists_owner_id ON public.lists(owner_id);

-- Enable RLS
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only CRUD their own lists
DROP POLICY IF EXISTS "users_select_own_lists" ON public.lists;
CREATE POLICY "users_select_own_lists"
  ON public.lists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "users_insert_own_lists" ON public.lists;
CREATE POLICY "users_insert_own_lists"
  ON public.lists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "users_update_own_lists" ON public.lists;
CREATE POLICY "users_update_own_lists"
  ON public.lists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "users_delete_own_lists" ON public.lists;
CREATE POLICY "users_delete_own_lists"
  ON public.lists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- =============================================================================
-- LIST_ITEMS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  sku TEXT NOT NULL CHECK (sku ~ '^\d{6}$' OR sku ~ '^10\d{8}$'),
  priority TEXT NOT NULL DEFAULT 'maybe' CHECK (priority IN ('maybe', 'must', 'ignore')),
  found_status TEXT NOT NULL DEFAULT 'unknown' CHECK (found_status IN ('unknown', 'found', 'not_found')),
  notes TEXT CHECK (notes IS NULL OR char_length(notes) <= 500),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one SKU per list
CREATE UNIQUE INDEX IF NOT EXISTS idx_list_items_list_sku ON public.list_items(list_id, sku);

-- Index for fast lookup by list
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON public.list_items(list_id);

-- Enable RLS
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only CRUD items in their own lists
-- We check ownership via a join to lists table

DROP POLICY IF EXISTS "users_select_own_list_items" ON public.list_items;
CREATE POLICY "users_select_own_list_items"
  ON public.list_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
      AND lists.owner_id = auth.uid()
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
      AND lists.owner_id = auth.uid()
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
      AND lists.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      WHERE lists.id = list_items.list_id
      AND lists.owner_id = auth.uid()
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
      AND lists.owner_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGER: Auto-update updated_at on lists
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_lists_updated_at ON public.lists;
CREATE TRIGGER trigger_lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
