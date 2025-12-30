BEGIN;

-- =============================================================================
-- PENNY ITEM ENRICHMENT RLS (PUBLIC READS ONLY)
-- =============================================================================
ALTER TABLE public.penny_item_enrichment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon-select-enrichment" ON public.penny_item_enrichment;
CREATE POLICY "anon-select-enrichment"
  ON public.penny_item_enrichment
  FOR SELECT
  TO anon
  USING (true);

REVOKE INSERT, UPDATE, DELETE ON public.penny_item_enrichment FROM anon;

-- =============================================================================
-- PENNY LIST PUBLIC VIEW (READS ONLY)
-- =============================================================================
CREATE OR REPLACE VIEW public.penny_list_public AS
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
  timestamp
FROM public."Penny List";

GRANT SELECT ON public.penny_list_public TO anon;

-- =============================================================================
-- PENNY LIST RLS (ANON INSERT ONLY)
-- =============================================================================
ALTER TABLE public."Penny List" ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Penny List" ALTER COLUMN timestamp SET DEFAULT now();
ALTER TABLE public."Penny List" ADD COLUMN IF NOT EXISTS status TEXT;

UPDATE public."Penny List"
SET timestamp = now()
WHERE timestamp IS NULL;

ALTER TABLE public."Penny List" ALTER COLUMN timestamp SET NOT NULL;

UPDATE public."Penny List"
SET status = 'pending'
WHERE status IS NULL;

ALTER TABLE public."Penny List" ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public."Penny List" ALTER COLUMN status SET NOT NULL;

REVOKE ALL ON public."Penny List" FROM anon;
GRANT INSERT ON public."Penny List" TO anon;

DROP POLICY IF EXISTS "anon-insert-penny-list" ON public."Penny List";
CREATE POLICY "anon-insert-penny-list"
  ON public."Penny List"
  FOR INSERT
  TO anon
  WITH CHECK (
    auth.role() = 'anon'
    AND home_depot_sku_6_or_10_digits::text ~ '^(\\d{6}|10\\d{8})$'
    AND char_length(trim(coalesce(item_name, ''))) BETWEEN 1 AND 75
    AND char_length(trim(coalesce(store_city_state, ''))) >= 2
    AND (exact_quantity_found IS NULL OR (exact_quantity_found BETWEEN 1 AND 99))
    AND coalesce(status, 'pending') = 'pending'
  );

DROP POLICY IF EXISTS "anon-update-blocked" ON public."Penny List";
CREATE POLICY "anon-update-blocked"
  ON public."Penny List"
  FOR UPDATE
  TO anon
  USING (false);

DROP POLICY IF EXISTS "anon-delete-blocked" ON public."Penny List";
CREATE POLICY "anon-delete-blocked"
  ON public."Penny List"
  FOR DELETE
  TO anon
  USING (false);

COMMIT;
