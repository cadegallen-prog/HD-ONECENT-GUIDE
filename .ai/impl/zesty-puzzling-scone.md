# Implementation Plan: Enrichment System Fixes + Report Find Form Simplification

**Feature:** `zesty-puzzling-scone`
**Date:** 2026-01-18
**Status:** Ready for Implementation
**Architecture:** [.ai/architectures/zesty-puzzling-scone-arch.md](.ai/architectures/zesty-puzzling-scone-arch.md)

---

## Overview

This implementation fixes three enrichment system issues and simplifies the Report Find form:

1. **Item name not overwriting** on staging consumption (canonical name lost)
2. **No retry limiting** on failed SerpApi enrichments (wasting credits)
3. **No staging table pruning** (unconsumed rows accumulate)
4. **Form UX friction** (URL/notes fields add noise, City hidden, SKU help text confusing)

---

## Implementation Steps

### Step 1: Add enrichment_attempts Column

**File:** `supabase/migrations/018_enrichment_attempts.sql` (NEW)

```sql
-- Add column to track enrichment attempts
ALTER TABLE "Penny List"
  ADD COLUMN IF NOT EXISTS enrichment_attempts INT DEFAULT 0;

-- Index for efficient querying of rows that haven't exceeded retry limit
CREATE INDEX IF NOT EXISTS idx_penny_list_enrichment_attempts
  ON "Penny List"(enrichment_attempts)
  WHERE enrichment_attempts < 2;
```

**Purpose:** Track retry count to prevent wasting SerpApi credits on bad SKUs.

---

### Step 2: Update RPC to Always Overwrite item_name

**File:** `supabase/migrations/017_consume_enrichment_rpc.sql` (MODIFY)

**Location:** Lines 56-61

**Change:**
```sql
-- OLD (fill-blanks only):
item_name = CASE
  WHEN (item_name IS NULL OR item_name = '') AND v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
  THEN v_staging.item_name
  ELSE item_name
END

-- NEW (always overwrite):
item_name = CASE
  WHEN v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
  THEN v_staging.item_name  -- ALWAYS overwrite with canonical name
  ELSE item_name
END
```

**Rationale:** Staging row is deleted after consumption. If we don't overwrite, canonical name is lost forever.

---

### Step 3: Add Retry Limiting to SerpApi Script

**File:** `scripts/serpapi-enrich.ts`

#### 3A. Add enrichment_attempts to Type

**Location:** Line ~68

**Change:**
```typescript
interface PennyListGapRow {
  id: string
  home_depot_sku_6_or_10_digits: string | number | null
  item_name: string | null
  brand: string | null
  image_url: string | null
  retail_price: number | null
  internet_sku: number | null
  home_depot_url: string | null
  model_number: string | null
  upc: string | null
  enrichment_attempts: number  // ADD THIS
}
```

#### 3B. Update Query to Skip Max-Attempt Rows

**Location:** `getPennyListGaps()` function, line ~452

**Change:**
```typescript
const { data, error } = await supabase
  .from("Penny List")
  .select(
    "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc, enrichment_attempts"  // ADD enrichment_attempts
  )
  .or("item_name.is.null,brand.is.null,image_url.is.null,retail_price.is.null")
  .lt("enrichment_attempts", 2)  // ADD THIS LINE
  .order("timestamp", { ascending: false })
  .limit(limit * 2)
```

#### 3C. Increment Attempt Counter on Failure

**Location:** After line ~666 (`failed++`)

**Add:**
```typescript
// After failed enrichment (line ~666)
if (!result || !result.item_name) {
  console.log(`   No results found (tried ${creditsUsed} search${creditsUsed > 1 ? "es" : ""})`)

  // Increment attempt counter on failure
  const currentAttempts = row.enrichment_attempts || 0
  await supabase
    .from("Penny List")
    .update({ enrichment_attempts: currentAttempts + 1 })
    .eq("id", row.id)

  console.log(`   Updated enrichment_attempts: ${currentAttempts} → ${currentAttempts + 1}`)
  failed++
}
```

#### 3D. Add Warning Log for High-Attempt Rows

**Location:** Main processing loop, after line ~631

**Add (optional):**
```typescript
console.log(`[${i + 1}/${itemsToEnrich.length}] SKU: ${sku}`)
const missing = getMissingFields(row)
console.log(`   Missing: ${missing.join(", ")}`)

// ADD: Log if row is approaching max attempts
if (row.enrichment_attempts >= 1) {
  console.log(`   Warning: ${row.enrichment_attempts} previous attempt(s)`)
}
```

---

### Step 4: Add Staging Table Pruning

**File:** `scripts/staging-warmer.py`

#### 4A. Add Pruning Function

**Location:** After `extract_staging_row()`, before `get_existing_skus()` (around line 205)

**Add:**
```python
def prune_stale_staging(supabase, retention_days: int = 60):
    """Delete staging rows older than retention period."""
    from datetime import datetime, timedelta

    cutoff = (datetime.utcnow() - timedelta(days=retention_days)).isoformat()

    try:
        result = supabase.table("enrichment_staging").delete().lt("created_at", cutoff).execute()
        deleted_count = len(result.data) if result.data else 0
        if deleted_count > 0:
            print(f"Pruned {deleted_count} stale staging rows (> {retention_days} days old)")
        return deleted_count
    except Exception as e:
        print(f"WARNING: Failed to prune staging: {e}")
        return 0
```

#### 4B. Call Pruning in main()

**Location:** In `main()`, after Supabase connection (around line 241)

**Add:**
```python
# Initialize Supabase client
supabase = create_client(config["supabase_url"], config["supabase_key"])
print("Connected to Supabase")

# Prune stale staging rows before adding new ones
print("\nPruning stale staging rows...")
prune_stale_staging(supabase, retention_days=60)

# Get existing SKUs in Penny List (to skip)
print("\nFetching existing SKUs from Penny List...")
```

---

### Step 5: Simplify Report Find Form

**File:** `app/report-find/page.tsx`

#### 5A. Remove Home Depot URL Field

**Delete:**
- Lines 306-328 (URL input block)
- Line 23: `const [productUrl, setProductUrl] = useState("")`
- Lines 133-151: `handleProductUrlChange` function
- Lines 124-131: `extractSkuFromUrl` function
- Line 222: `setProductUrl("")` in form reset

#### 5B. Remove Optional Details Dropdown + Notes

**Delete:**
- Lines 505-545 (details dropdown with City/Notes)
- Line 31: `notes: ""` from formData initialization
- Line 216: `notes: ""` from form reset

#### 5C. Move City to Visible Field

**Location:** Add AFTER SKU field (after line 433), BEFORE State field (before line 448)

**Add:**
```tsx
{/* City (optional) - ABOVE State */}
<div>
  <label
    htmlFor="storeCity"
    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
  >
    City{" "}
    <span className="text-xs text-[var(--text-muted)] font-normal">(optional)</span>
  </label>
  <input
    type="text"
    id="storeCity"
    value={formData.storeCity}
    onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
    placeholder="e.g., Tampa"
    className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
  />
  <p className="mt-1 text-xs text-[var(--text-muted)]">
    Optional: helps show regional patterns.
  </p>
</div>
```

#### 5D. Fix SKU Help Text

**Location:** Lines 422-425

**Change:**
```tsx
<!-- OLD: -->
<p id="sku-hint" className="mt-1 text-xs text-[var(--text-muted)]">
  Use the 6‑digit shelf SKU or the Home Depot app. Receipts usually show a
  UPC/barcode, not the SKU.
</p>

<!-- NEW: -->
<p id="sku-hint" className="mt-1 text-xs text-[var(--text-muted)]">
  Enter the 6 or 10-digit SKU from the shelf tag or Home Depot app. Do not use Store SO SKU, Internet #, or UPC (receipts show UPC, not SKU).
</p>
```

---

### Step 6: Add Unit Test for Always-Overwrite

**File:** `tests/submit-find-route.test.ts`

**Location:** Add after line 125

**Add:**
```typescript
test("always overwrites item_name with enrichment canonical name", async () => {
  const inserted: Record<string, unknown>[] = []

  // Mock anon client with enrichment lookup that returns canonical name
  const anonReadClient: any = {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: () => ({
            maybeSingle: async () => ({
              data: {
                item_name: "Milwaukee M18 FUEL Hammer Drill/Driver Kit",  // Canonical
                brand: "Milwaukee",
                retail_price: 199.00,
                image_url: "https://example.com/image.jpg",
              },
              error: null,
            }),
          }),
        }),
      }),
    }),
  }

  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-overwrite" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "drill",  // User-provided (incomplete)
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: new Date().toISOString().split("T")[0],
      quantity: "1",
      notes: "",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.30",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 200)
  const payload = inserted[0] as Record<string, unknown>

  // Verify canonical name from enrichment is used (NOT user input)
  assert.strictEqual(
    payload.item_name,
    "Milwaukee M18 FUEL Hammer Drill/Driver Kit",
    "Should use canonical name from enrichment, not user input"
  )

  // Verify enrichment fields are included
  assert.strictEqual(payload.brand, "Milwaukee")
  assert.strictEqual(payload.retail_price, 199.00)
  assert.strictEqual(payload.image_url, "https://example.com/image.jpg")

  clearSupabaseMocks()
})
```

---

## Verification Checklist

### Quality Gates

```bash
npm run lint        # Expected: 0 errors
npm run build       # Expected: successful build
npm run test:unit   # Expected: 5/5 passing (4 existing + 1 new)
npm run test:e2e    # Expected: 28/28 passing
```

### Manual Testing

#### Test 1: RPC Always-Overwrite
1. Insert staging row with canonical name
2. Submit find with "drill" as item name
3. Verify Penny List has canonical name (NOT "drill")
4. Verify staging row deleted

#### Test 2: SerpApi Retry Limiting
1. Set SKU to `enrichment_attempts = 2`
2. Run `npx tsx scripts/serpapi-enrich.ts --limit 10`
3. Verify SKU is NOT processed (skipped)

#### Test 3: Staging Pruning
1. Insert staging row with `created_at = now() - interval '65 days'`
2. Run `python scripts/staging-warmer.py`
3. Verify logs show "Pruned 1 stale staging rows"
4. Verify row deleted

#### Test 4: Form Visual Verification (Playwright REQUIRED)
- City field visible (above State)
- URL field removed
- Notes field removed
- SKU help text mentions "6 or 10 digits" + "Do not use SO SKU"

---

## Deployment Order

1. **Apply migrations:**
   ```bash
   supabase db push
   ```

2. **Commit changes:**
   ```bash
   git add supabase/migrations/ scripts/ app/ tests/
   git commit -m "Enrichment fixes + form simplification"
   ```

3. **Verify all gates pass:**
   ```bash
   npm run lint && npm run build && npm run test:unit && npm run test:e2e
   ```

4. **Push to production:**
   ```bash
   git push
   supabase db push --linked  # Production migrations
   ```

---

## Rollback Plan

### If RPC breaks production:
Revert migration 017 to fill-blanks logic (remove conditional change)

### If SerpApi script fails:
Remove `.lt("enrichment_attempts", 2)` filter

### If form changes break UX:
```bash
git revert <commit-hash>
git push
```

---

## File Summary

**New Files:**
- `supabase/migrations/018_enrichment_attempts.sql`

**Modified Files:**
- `supabase/migrations/017_consume_enrichment_rpc.sql` (~6 lines)
- `scripts/serpapi-enrich.ts` (~30 lines)
- `scripts/staging-warmer.py` (~20 lines)
- `app/report-find/page.tsx` (~-120 lines net)
- `tests/submit-find-route.test.ts` (~60 lines)

**Total Changes:** ~250 lines

---

**END OF IMPLEMENTATION PLAN**
