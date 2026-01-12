# Supabase RLS hardening (Penny List + Report Find)

## Tables involved

- Base table (writes + privileged reads): `public."Penny List"` (crowd reports).
- Public view (safe anon reads): `public.penny_list_public` (no emails/PII columns).
- Admin-only enrichment table: `public.penny_item_enrichment` (authoritative SKU details: name/brand/model/UPC/image/link, plus retail price for savings messaging).

## Apply once (SQL)

Run in the Supabase SQL editor or `psql` (adjust schema name if not `public`). The `BEGIN/COMMIT` block lets you review failures without partial changes.

```sql
BEGIN;

-- 0) Admin enrichment table (authoritative SKU metadata).
-- Store UPC as TEXT to preserve leading zeros.
create table if not exists public.penny_item_enrichment (
  sku text primary key,
  item_name text,
  brand text,
  model_number text,
  upc text,
  image_url text,
  home_depot_url text,
  internet_sku bigint,
  retail_price numeric(10,2),
  source text,
  updated_at timestamptz default now()
);

alter table public.penny_item_enrichment enable row level security;

drop policy if exists "anon-select-enrichment" on public.penny_item_enrichment;
create policy "anon-select-enrichment"
  on public.penny_item_enrichment
  for select
  to anon
  using (true);

revoke insert, update, delete on public.penny_item_enrichment from anon;

-- 1) Minimal public view for anon SELECT (no emails/PII).
-- NOTE: RLS policies apply to TABLES, not views; the view limits columns.
create or replace view public.penny_list_public as
select
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
from public."Penny List";

grant select on public.penny_list_public to anon;

-- 2) Enable RLS on the base table (controls INSERT, blocks UPDATE/DELETE).
alter table public."Penny List" enable row level security;

-- 3) Force safe defaults for newly inserted rows.
alter table public."Penny List" alter column timestamp set default now();
alter table public."Penny List" alter column timestamp set not null;
alter table public."Penny List" add column if not exists status text;
alter table public."Penny List" alter column status set default 'pending';
alter table public."Penny List" alter column status set not null;

-- 4) Privileges: direct anon INSERT is denied; submissions go through /api/submit-find (service role).
revoke all on public."Penny List" from anon;
revoke insert on public."Penny List" from anon;
grant insert on public."Penny List" to authenticated;

-- 5) RLS policies on the base table
drop policy if exists "authenticated-insert-penny-list" on public."Penny List";
create policy "authenticated-insert-penny-list"
  on public."Penny List"
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and home_depot_sku_6_or_10_digits::text ~ '^(\\d{6}|10\\d{8})$'
    and char_length(trim(coalesce(item_name, ''))) between 1 and 75
    and char_length(trim(coalesce(store_city_state, ''))) >= 2
    and (exact_quantity_found is null or (exact_quantity_found between 1 and 99))
    and coalesce(status, 'pending') = 'pending'
  );

drop policy if exists "anon-update-blocked" on public."Penny List";
create policy "anon-update-blocked"
  on public."Penny List"
  for update
  to anon
  using (false);

drop policy if exists "anon-delete-blocked" on public."Penny List";
create policy "anon-delete-blocked"
  on public."Penny List"
  for delete
  to anon
  using (false);

COMMIT;
```

## Quick verification (no data left behind)

Run inside a single SQL session so you can `ROLLBACK` after the checks:

```sql
BEGIN;
set local role anon;
set local "request.jwt.claim.role" = 'anon';
set local "request.jwt.claim.sub" = 'anon-test';

-- 1) Anon SELECT should work on the view.
select * from public.penny_list_public limit 3;

-- 2) Direct anon INSERT should be denied (submissions go through /api/submit-find).
select
  has_table_privilege('anon','public.\"Penny List\"','insert') as anon_insert,
  has_table_privilege('authenticated','public.\"Penny List\"','insert') as authenticated_insert;

-- 3) UPDATE/DELETE should be blocked for anon (permissions and/or RLS).
select
  has_table_privilege('anon','public.\"Penny List\"','update') as anon_update,
  has_table_privilege('anon','public.\"Penny List\"','delete') as anon_delete;

ROLLBACK; -- no changes committed
```

## App fallbacks

- `/api/submit-find` uses the service role key for inserts so the DB can keep direct anon INSERT locked down.
