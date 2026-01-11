# Supabase Critical Fixes - January 11, 2026

## Summary

Fixed three critical Supabase issues causing excessive egress and security vulnerabilities:

1. **Frontend Infinite Loop** - 44,000+ API calls to `penny_item_enrichment` and `penny_list_public`
2. **SECURITY DEFINER View** - `penny_list_public` view bypassing RLS
3. **Public Insert Vulnerability** - `Penny List` table allowing unauthenticated inserts

---

## Issue 1: Frontend Infinite Loop (CRITICAL - P0)

### Root Cause

The `useEffect` hook in [penny-list-client.tsx](c:\Users\cadeg\Projects\HD-ONECENT-GUIDE\components\penny-list-client.tsx#L377-L384) had a dependency on the `fetchItems` callback, which recreated on every filter change. This caused an infinite loop:

```tsx
// BEFORE (BROKEN):
useEffect(() => {
  if (isInitialRenderRef.current) {
    isInitialRenderRef.current = false
    return
  }
  fetchItems()
}, [fetchItems]) // ❌ fetchItems recreates on every dependency change
```

Every time a user interacted with filters, the `fetchItems` callback would recreate, triggering the `useEffect` again, which would call the API, which would potentially update state, which would cause `fetchItems` to recreate...

### Impact

- 44,000+ API calls in a short time period
- Destroyed Supabase egress limits
- Poor user experience (constant loading states)
- Potential browser performance issues

### Fix

Added a ref-based comparison to only fetch when filters **actually** change:

```tsx
// AFTER (FIXED):
const prevFiltersRef = useRef({
  stateFilter,
  searchQuery,
  sortOption,
  dateRange,
  currentPage,
  itemsPerPage,
})

useEffect(() => {
  if (isInitialRenderRef.current) {
    isInitialRenderRef.current = false
    return
  }

  const prev = prevFiltersRef.current
  const changed =
    prev.stateFilter !== stateFilter ||
    prev.searchQuery !== searchQuery ||
    prev.sortOption !== sortOption ||
    prev.dateRange !== dateRange ||
    prev.currentPage !== currentPage ||
    prev.itemsPerPage !== itemsPerPage

  if (changed) {
    prevFiltersRef.current = {
      stateFilter,
      searchQuery,
      sortOption,
      dateRange,
      currentPage,
      itemsPerPage,
    }
    fetchItems()
  }
}, [stateFilter, searchQuery, sortOption, dateRange, currentPage, itemsPerPage, fetchItems])
```

### Files Changed

- [components/penny-list-client.tsx](c:\Users\cadeg\Projects\HD-ONECENT-GUIDE\components\penny-list-client.tsx#L337-L401)

---

## Issue 2: SECURITY DEFINER View

### Root Cause

The `penny_list_public` view was created with `SECURITY DEFINER`, which means it runs with the permissions of the view creator (typically the superuser), bypassing Row Level Security (RLS) policies.

This is a security risk because it allows anyone to see data they shouldn't have access to.

### Impact

- View bypasses RLS policies
- Potential data exposure
- Flagged as security risk in Supabase dashboard
- Violates principle of least privilege

### Fix

Recreated the view with `SECURITY INVOKER` (the default and recommended setting):

```sql
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
```

**Important:** `SECURITY INVOKER` ensures the view respects the calling user's permissions, making RLS policies effective.

### Files Changed

- [supabase/migrations/011_fix_security_definer_view.sql](c:\Users\cadeg\Projects\HD-ONECENT-GUIDE\supabase\migrations\011_fix_security_definer_view.sql)

---

## Issue 3: Public Insert Vulnerability

### Root Cause

The `Penny List` table had an RLS policy allowing **anonymous (unauthenticated) users** to insert records. While this was intentional for community submissions, it creates several risks:

- Spam attacks
- Data poisoning
- Abuse of egress limits
- No accountability (no user ID)

### Impact

- Vulnerable to spam/abuse
- No rate limiting per user
- No accountability for submissions
- Potential for malicious data injection

### Fix

Updated RLS policy to **require authentication**:

```sql
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
```

**Trade-off:** This requires users to sign in before submitting finds. If you want to allow anonymous submissions later, you'll need to:

1. Add honeypot field validation
2. Implement rate limiting in the API endpoint
3. Add captcha verification (e.g., Cloudflare Turnstile)

The migration file includes commented-out Option 2 code for this approach.

### Files Changed

- [supabase/migrations/012_restrict_penny_list_inserts.sql](c:\Users\cadeg\Projects\HD-ONECENT-GUIDE\supabase\migrations\012_restrict_penny_list_inserts.sql)

---

## Deployment Instructions

### 1. Apply Supabase Migrations

```bash
# Apply migrations in order
supabase db push

# OR manually in Supabase SQL Editor:
# - Run 011_fix_security_definer_view.sql
# - Run 012_restrict_penny_list_inserts.sql
```

### 2. Deploy Frontend Fix

The frontend fix is already committed. Simply deploy to Vercel:

```bash
git add .
git commit -m "fix: stop infinite API loop in penny-list-client"
git push origin main
```

Vercel will auto-deploy on push to `main`.

### 3. Monitor Impact

After deployment:

1. **Check Supabase Dashboard** - API call rate should drop dramatically
2. **Test Penny List Page** - Filters should work without excessive network requests
3. **Browser DevTools** - Network tab should show 1 API call per filter change (not hundreds)
4. **Test Submissions** - Verify users must be authenticated to submit finds

---

## Expected Results

### Before

- 44,000+ API calls in short time period
- Excessive egress costs
- Security warnings in Supabase dashboard
- Anonymous spam vulnerability

### After

- ~1 API call per filter change
- Egress within normal limits
- No security warnings
- Submissions require authentication (accountable + rate-limitable)

---

## Rollback Plan

If something breaks:

### Rollback Frontend

```bash
git revert HEAD
git push origin main
```

### Rollback Migrations

```sql
-- Rollback 012 (restore anon inserts)
DROP POLICY IF EXISTS "authenticated-insert-penny-list" ON public."Penny List";
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

-- Rollback 011 (restore security definer - NOT RECOMMENDED)
DROP VIEW IF EXISTS public.penny_list_public;
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
  timestamp,
  brand,
  model_number,
  upc,
  retail_price
FROM public."Penny List";
GRANT SELECT ON public.penny_list_public TO anon;
```

---

## Learnings

1. **useEffect with callback dependencies is dangerous** - Always check if the callback recreates on every render
2. **Use refs to track previous values** - Prevents redundant effect triggers
3. **SECURITY DEFINER views are rarely needed** - Default to SECURITY INVOKER
4. **Anonymous inserts need rate limiting** - Require auth OR captcha + honeypot + rate limit
5. **Monitor Supabase egress** - Set up alerts for unusual API call patterns

---

## Next Steps (Optional)

1. **Add Supabase monitoring** - Set up alerts for egress/API call spikes
2. **Implement rate limiting** - Use Vercel Rate Limiting or Upstash Redis
3. **Add captcha for anon submissions** - If you want to re-enable anonymous submissions
4. **Add honeypot field** - Additional spam protection
5. **Set up Sentry error tracking** - Catch infinite loops earlier

---

## Files Modified

- `components/penny-list-client.tsx` - Fixed infinite loop
- `supabase/migrations/011_fix_security_definer_view.sql` - Fixed SECURITY DEFINER
- `supabase/migrations/012_restrict_penny_list_inserts.sql` - Locked down inserts

---

## Verification Checklist

- [ ] Supabase migrations applied successfully
- [ ] Frontend deployed to Vercel
- [ ] API call rate normalized (check Supabase dashboard)
- [ ] Penny List page loads without excessive requests
- [ ] Filters work correctly (state, search, sort, date range)
- [ ] Submissions require authentication
- [ ] No security warnings in Supabase dashboard
