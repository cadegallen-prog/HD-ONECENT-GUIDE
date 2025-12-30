BEGIN;
set local role anon;
set local "request.jwt.claim.role" = 'anon';
set local "request.jwt.claim.sub" = 'anon-test';

-- 1) Anon SELECT should work on the public view.
select * from public.penny_list_public limit 3;

-- 2) Anon INSERT should succeed and get status pending + timestamp default.
insert into public."Penny List" (
  item_name,
  home_depot_sku_6_or_10_digits,
  store_city_state,
  purchase_date,
  exact_quantity_found,
  notes_optional
) values (
  'RLS smoke test',
  '123456',
  'ATL, GA',
  current_date::text,
  2,
  'temp test row'
) returning id, status, timestamp;

-- 3) UPDATE should be blocked (permission and/or RLS).
update public."Penny List" set notes_optional = 'should fail' where item_name = 'RLS smoke test';

-- 4) DELETE should be blocked (permission and/or RLS).
delete from public."Penny List" where item_name = 'RLS smoke test';

ROLLBACK;
