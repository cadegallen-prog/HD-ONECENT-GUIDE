-- 003: Security Fix - Add explicit search_path to all functions
-- Fixes: "Function Search Path Mutable" warnings from Supabase Security Advisor
-- Run in Supabase SQL Editor or via CLI migration

BEGIN;

-- =============================================================================
-- FIX 1: update_updated_at_column (trigger function)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- FIX 2: create_share_token (SECURITY DEFINER)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_share_token(p_list_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_owner_id UUID;
  v_token TEXT;
  v_existing TEXT;
BEGIN
  -- Check ownership
  SELECT owner_id INTO v_owner_id
  FROM public.lists
  WHERE id = p_list_id;

  IF v_owner_id IS NULL THEN
    RAISE EXCEPTION 'List not found';
  END IF;

  IF v_owner_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Check for existing token
  SELECT share_token INTO v_existing
  FROM public.list_shares
  WHERE list_id = p_list_id
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Generate new token (12 chars, URL-safe)
  v_token := encode(gen_random_bytes(9), 'base64');
  v_token := replace(replace(replace(v_token, '+', '-'), '/', '_'), '=', '');

  INSERT INTO public.list_shares (list_id, share_token)
  VALUES (p_list_id, v_token);

  RETURN v_token;
END;
$$;

-- =============================================================================
-- FIX 3: get_shared_list (SECURITY DEFINER, public access)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_shared_list(p_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_list_id UUID;
  v_title TEXT;
  v_items JSON;
BEGIN
  -- Get list ID from token
  SELECT ls.list_id, l.title
  INTO v_list_id, v_title
  FROM public.list_shares ls
  JOIN public.lists l ON l.id = ls.list_id
  WHERE ls.share_token = p_token;

  IF v_list_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get items (no user-specific data)
  SELECT json_agg(json_build_object(
    'id', li.id,
    'sku', li.sku,
    'priority', li.priority,
    'notes', li.notes,
    'added_at', li.added_at
  ) ORDER BY li.added_at DESC)
  INTO v_items
  FROM public.list_items li
  WHERE li.list_id = v_list_id
  AND li.priority != 'ignore';

  RETURN json_build_object(
    'title', v_title,
    'items', COALESCE(v_items, '[]'::json),
    'item_count', COALESCE(json_array_length(v_items), 0)
  );
END;
$$;

-- =============================================================================
-- FIX 4: fork_shared_list (SECURITY DEFINER)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.fork_shared_list(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_list_id UUID;
  v_title TEXT;
  v_new_list_id UUID;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get source list
  SELECT ls.list_id, l.title
  INTO v_list_id, v_title
  FROM public.list_shares ls
  JOIN public.lists l ON l.id = ls.list_id
  WHERE ls.share_token = p_token;

  IF v_list_id IS NULL THEN
    RAISE EXCEPTION 'Shared list not found';
  END IF;

  -- Create new list for current user
  INSERT INTO public.lists (owner_id, title)
  VALUES (auth.uid(), v_title || ' (Copy)')
  RETURNING id INTO v_new_list_id;

  -- Copy items (excluding ignored)
  INSERT INTO public.list_items (list_id, sku, priority, notes)
  SELECT v_new_list_id, sku,
    CASE WHEN priority = 'must' THEN 'must' ELSE 'maybe' END,
    notes
  FROM public.list_items
  WHERE list_id = v_list_id
  AND priority != 'ignore';

  RETURN v_new_list_id;
END;
$$;

COMMIT;
