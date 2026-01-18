# Architecture: Enrichment System Fixes + Report Find Form Simplification

**Plan:** `zesty-puzzling-scone.md`
**Date:** 2026-01-18
**Status:** Ready for Implementation

---

## Executive Summary

This architecture implements fixes to the enrichment staging system and simplifies the Report Find form UX. The changes address three core issues:

1. **Item name not overwriting** on first submission (canonical name lost forever when staging consumed)
2. **No retry limiting** on failed SerpApi enrichments (wasting credits on bad SKUs)
3. **No staging table pruning** (unconsumed rows accumulate indefinitely)
4. **Form noise** (URL/notes fields add friction, City hidden in dropdown, SKU help text confusing)

---

## Implementation Plan

### Phase 1: Database Schema Changes

**Migration:** `018_enrichment_attempts.sql` (NEW)

**Purpose:** Add retry tracking column to Penny List table to prevent wasting SerpApi credits on bad SKUs.

**Schema Change:**
```sql
-- Add column to track enrichment attempts
ALTER TABLE "Penny List"
  ADD COLUMN IF NOT EXISTS enrichment_attempts INT DEFAULT 0;

-- Index for efficient querying of rows that haven't exceeded retry limit
CREATE INDEX IF NOT EXISTS idx_penny_list_enrichment_attempts
  ON "Penny List"(enrichment_attempts)
  WHERE enrichment_attempts < 2;
```

**Rationale:**
- Default `0` ensures existing rows start fresh
- Partial index optimizes queries for "retry-eligible" rows (< 2 attempts)
- Column tracks both SKU search AND item name fallback attempts

**Side Effects:**
- Adds ~4 bytes per row (~30 KB total for 8000 rows)
- Index size negligible due to partial index filter

---

### Phase 2: RPC Migration Update

**Migration:** `017_consume_enrichment_rpc.sql` (MODIFY)

**Current Behavior:**
```sql
-- Fill-blanks-only (lines 56-61)
item_name = CASE
  WHEN (item_name IS NULL OR item_name = '') AND v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
  THEN v_staging.item_name
  ELSE item_name
END
```

**New Behavior:**
```sql
-- Always overwrite with canonical name (lines 56-61)
item_name = CASE
  WHEN v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
  THEN v_staging.item_name  -- ALWAYS overwrite with canonical name
  ELSE item_name
END
```

**Rationale:**
- Staging row is deleted after consumption (line 118)
- If we don't overwrite item_name, canonical name from enrichment is **lost forever**
- User-provided item names are often incomplete/inaccurate (e.g., "drill" vs. "Milwaukee M18 FUEL Hammer Drill/Driver Kit")
- Brand/retail_price/etc. can stay fill-blanks because staging may have incomplete data

**Other Fields (NO CHANGE):**
- `brand`: Fill-blanks (users cannot submit brand, always NULL on insert)
- `retail_price`, `upc`, `image_url`, etc.: Fill-blanks (staging may be incomplete)

**Function Signature (NO CHANGE):**
```sql
CREATE OR REPLACE FUNCTION consume_enrichment_for_penny_item(
  p_penny_id UUID,
  p_sku TEXT,
  p_internet_number BIGINT DEFAULT NULL
)
RETURNS JSONB
```

**Lines to Change:** Lines 56-61 in `supabase/migrations/017_consume_enrichment_rpc.sql`

---

### Phase 3: SerpApi Script Retry Limiting

**File:** `scripts/serpapi-enrich.ts`

**Changes Required:**

#### 3A. Update Query to Skip Max-Attempt Rows

**Location:** `getPennyListGaps()` function, line ~452

**Current:**
```typescript
const { data, error } = await supabase
  .from("Penny List")
  .select(
    "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc"
  )
  .or("item_name.is.null,brand.is.null,image_url.is.null,retail_price.is.null")
  .order("timestamp", { ascending: false })
  .limit(limit * 2)
```

**New:**
```typescript
const { data, error } = await supabase
  .from("Penny List")
  .select(
    "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc, enrichment_attempts"
  )
  .or("item_name.is.null,brand.is.null,image_url.is.null,retail_price.is.null")
  .lt("enrichment_attempts", 2)  // ADD: Skip items that already failed 2x
  .order("timestamp", { ascending: false })
  .limit(limit * 2)
```

**Changes:**
1. Add `enrichment_attempts` to SELECT list
2. Add `.lt("enrichment_attempts", 2)` filter

#### 3B. Add enrichment_attempts to PennyListGapRow Type

**Location:** Line ~68

**Current:**
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
}
```

**New:**
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
  enrichment_attempts: number  // ADD: Track retry count
}
```

#### 3C. Increment Attempt Counter on Failure

**Location:** Main processing loop, after line ~666 (`failed++`)

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

**Behavior:**
- After 2 failed attempts (SKU search + item name fallback), row is flagged
- `.lt("enrichment_attempts", 2)` filter prevents future processing
- Manual reset required: `UPDATE "Penny List" SET enrichment_attempts = 0 WHERE home_depot_sku_6_or_10_digits = 'XXXXXX'`

#### 3D. Add Logging for Skipped Rows

**Location:** Main processing loop, after line ~631

**Add (optional, for visibility):**
```typescript
console.log(`[${i + 1}/${itemsToEnrich.length}] SKU: ${sku}`)
const missing = getMissingFields(row)
console.log(`   Missing: ${missing.join(", ")}`)

// ADD: Log if row is approaching max attempts
if (row.enrichment_attempts >= 1) {
  console.log(`   Warning: ${row.enrichment_attempts} previous attempt(s)`)
}
```

**Summary of Changes:**
- 3 locations modified
- 1 type updated
- ~15 lines of code added
- No breaking changes (existing rows default to `enrichment_attempts = 0`)

---

### Phase 4: Staging Table Pruning

**File:** `scripts/staging-warmer.py`

**Changes Required:**

#### 4A. Add Pruning Function

**Location:** After `extract_staging_row()` function, before `get_existing_skus()` (around line 205)

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

**Function Signature:**
- `supabase`: Supabase client instance
- `retention_days`: Days to retain (default 60)
- Returns: Number of rows deleted

**Error Handling:**
- Logs warning on failure, returns 0
- Does NOT fail the script (non-critical operation)

#### 4B. Call Pruning in main()

**Location:** In `main()` function, after Supabase connection (around line 241)

**Current:**
```python
def main():
    print("=" * 60)
    print("ENRICHMENT STAGING WARMER")
    print("=" * 60)

    # Load config
    config = get_config()
    print(f"Config: max_uniques={config['max_uniques']}, batch_size={config['batch_size']}")

    # Initialize Supabase client
    supabase = create_client(config["supabase_url"], config["supabase_key"])
    print("Connected to Supabase")

    # Get existing SKUs in Penny List (to skip)
    print("Fetching existing SKUs from Penny List...")
```

**New:**
```python
def main():
    print("=" * 60)
    print("ENRICHMENT STAGING WARMER")
    print("=" * 60)

    # Load config
    config = get_config()
    print(f"Config: max_uniques={config['max_uniques']}, batch_size={config['batch_size']}")

    # Initialize Supabase client
    supabase = create_client(config["supabase_url"], config["supabase_key"])
    print("Connected to Supabase")

    # Prune stale staging rows before adding new ones
    print("\nPruning stale staging rows...")
    prune_stale_staging(supabase, retention_days=60)

    # Get existing SKUs in Penny List (to skip)
    print("\nFetching existing SKUs from Penny List...")
```

**Import Changes:**
- Move `from datetime import datetime, timedelta` to top of `prune_stale_staging()` function (local import)
- OR add to top-level imports (line ~23): `from datetime import datetime, timedelta`

**Behavior:**
- Runs on every warmer execution (Tue-Fri via GitHub Actions)
- Deletes rows where `created_at < (now - 60 days)`
- Expected deletions: ~0-50 rows per run (most rows consumed within hours)
- Logs deletions for visibility

**Why not pg_cron?**
- No Postgres extension required
- Simpler to test locally
- Runs automatically with warmer (no separate schedule)

**Summary of Changes:**
- 1 new function (~15 lines)
- 2 lines added to `main()`
- 1 import added (optional)

---

### Phase 5: Report Find Form Simplification

**File:** `app/report-find/page.tsx`

**Changes Required:**

#### 5A. Remove Home Depot URL Field

**Lines to Delete:** 306-328

**Current:**
```tsx
{/* Optional: Paste Home Depot URL */}
<div>
  <label
    htmlFor="productUrl"
    className="block text-sm font-medium text-[var(--text-primary)] mb-2"
  >
    Home Depot product URL{" "}
    <span className="text-xs text-[var(--text-muted)] font-normal">
      (optional - auto-fills product details)
    </span>
  </label>
  <input
    type="url"
    id="productUrl"
    value={productUrl}
    onChange={handleProductUrlChange}
    placeholder="https://www.homedepot.com/p/product-name/1234567890"
    className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent text-sm"
  />
  <p className="mt-1 text-xs text-[var(--text-muted)]">
    Paste a product URL to auto-fill item name and SKU
  </p>
</div>
```

**Also Remove:**
- **State:** Line 23: `const [productUrl, setProductUrl] = useState("")`
- **Handler:** Lines 133-151: `handleProductUrlChange` function
- **Helper:** Lines 124-131: `extractSkuFromUrl` function
- **Reset:** Line 222: `setProductUrl("")` in form reset

**Rationale:**
- Backend enrichment handles product URLs automatically via staging queue
- Field adds cognitive load without clear value (users prefer direct SKU entry)
- Removal reduces form length, improves conversion

#### 5B. Remove Optional Details Dropdown + Notes

**Lines to Delete:** 505-545

**Current:**
```tsx
{/* Optional details (collapsed by default) */}
<details className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3">
  <summary className="cursor-pointer text-sm font-medium text-[var(--text-primary)]">
    Add optional details (city, notes)
  </summary>
  <div className="mt-4 space-y-4">
    <div>
      <label
        htmlFor="storeCity"
        className="block text-sm font-medium text-[var(--text-primary)] mb-2"
      >
        City (optional)
      </label>
      <input
        type="text"
        id="storeCity"
        value={formData.storeCity}
        onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
        placeholder="e.g., Tampa"
        className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
      />
    </div>

    <div>
      <label
        htmlFor="notes"
        className="block text-sm font-medium text-[var(--text-primary)] mb-2"
      >
        Additional Notes (optional)
      </label>
      <textarea
        id="notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="e.g., Found in clearance aisle, back corner near garden..."
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent resize-none"
      />
    </div>
  </div>
</details>
```

**Also Remove:**
- **State:** Line 31: `notes: ""` from formData initialization
- **Reset:** Line 216: `notes: ""` from form reset

**Rationale:**
- Notes field rarely adds value (most submissions are empty)
- City will move to visible field (see 5C)
- Reduces cognitive load, improves submission rate

#### 5C. Move City to Visible Field (Above State)

**Location:** Add AFTER SKU field block (after line 433), BEFORE State field (before line 448)

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

**Styling:**
- Matches Quantity Found field style (visible optional field)
- Label: `(optional)` in muted text
- Helper text: "Optional: helps show regional patterns."

**Rationale:**
- City is more discoverable when visible (not hidden in dropdown)
- Users are more likely to fill it in → better regional data
- Maintains form flow: Name → SKU → City → State

#### 5D. Fix SKU Help Text

**Location:** Line 422-425 (help text below SKU input)

**Current:**
```tsx
<p id="sku-hint" className="mt-1 text-xs text-[var(--text-muted)]">
  Use the 6‑digit shelf SKU or the Home Depot app. Receipts usually show a
  UPC/barcode, not the SKU.
</p>
```

**New:**
```tsx
<p id="sku-hint" className="mt-1 text-xs text-[var(--text-muted)]">
  Enter the 6 or 10-digit SKU from the shelf tag or Home Depot app. Do not use Store SO SKU, Internet #, or UPC (receipts show UPC, not SKU).
</p>
```

**Changes:**
1. "6 or 10-digit SKU" (was "6-digit shelf SKU")
2. "Do not use Store SO SKU, Internet #, or UPC" (explicit warnings)
3. Maintains UPC/receipt context

**Rationale:**
- Users often submit wrong SKU types (SO SKU, Internet #)
- Explicit warnings reduce submission errors
- Matches collapsible helper content (lines 360-392)

#### New Form Order (After Changes)

1. Item Name (required)
2. SKU Number (required) + collapsible "How to find the SKU" help
3. City (optional, visible)
4. State (required)
5. Date Found (required)
6. Quantity Found (optional, visible)
7. Submit Button

**Field Count:**
- Before: 8 fields (Name, URL, SKU, State, Date, City*, Notes*, Qty)
- After: 6 fields (Name, SKU, City, State, Date, Qty)
- Reduction: 2 fields (-25%)

**Summary of Changes:**
- 4 blocks removed (~140 lines)
- 1 block added (~20 lines)
- 1 help text updated (~2 lines)
- Net reduction: ~120 lines

---

### Phase 6: Unit Test Updates

**File:** `tests/submit-find-route.test.ts`

**Changes Required:**

#### 6A. Update Self-Enrichment Test to Verify Always-Overwrite

**Current Behavior:**
- Tests verify item_name is filled when blank
- Does NOT verify item_name is overwritten when present

**New Test Case to Add:**

**Add after line 125:**

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

**Test Coverage:**
- ✅ Verifies item_name uses enrichment canonical name (not user input)
- ✅ Verifies enrichment fields (brand, retail_price, image_url) are included
- ✅ Uses realistic scenario (user enters "drill", enrichment has full name)

**Expected Behavior:**
- **Before Fix:** Test would FAIL (item_name = "drill" from user input)
- **After Fix:** Test should PASS (item_name = canonical from enrichment)

**Note:** This test validates **self-enrichment** behavior (existing Penny List rows). The RPC always-overwrite logic is tested separately via staging queue integration tests (out of scope for this unit test file).

**Summary of Changes:**
- 1 new test case (~60 lines)
- No changes to existing tests
- Total tests: 5 (was 4)

---

## Regression Guard Plan

### What Could Break

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **RPC item_name overwrite breaks valid use cases** | Low | High | Unit tests verify behavior; plan explicitly approved always-overwrite for staging consumption |
| **enrichment_attempts index missing on existing DB** | Medium | Medium | Migration includes `IF NOT EXISTS`; index creation is idempotent |
| **SerpApi script fails on missing enrichment_attempts column** | Low | High | Migration 018 must run BEFORE script deployment; added to verification steps |
| **Staging pruning deletes unconsumed rows too aggressively** | Low | Medium | 60-day retention is conservative; most rows consumed within hours; logs deletions for monitoring |
| **Form City field breaks mobile UX** | Low | Low | Uses same styling as Quantity Found (proven working); Playwright screenshots required |
| **Form reset doesn't clear removed fields** | Low | Low | Removed fields deleted from formData state; reset logic updated |

### Prevention Strategies

1. **Migration Order Enforcement:**
   - Run migrations 018 → 017 (modify) in sequence
   - Verify `enrichment_attempts` column exists before deploying script
   - Add to verification checklist

2. **Script Deployment:**
   - Deploy `staging-warmer.py` changes BEFORE GitHub Actions run (Tue-Fri schedule)
   - Test pruning locally first: `python scripts/staging-warmer.py` (dry run)
   - Monitor logs for unexpected deletion counts

3. **Form Changes:**
   - Playwright screenshots REQUIRED (before/after)
   - Test mobile viewport (375px width)
   - Verify City field placement visually

4. **Rollback Plan:**
   - RPC change: Revert migration 017 to fill-blanks logic
   - Script change: Remove `.lt("enrichment_attempts", 2)` filter
   - Form change: Git revert to previous commit
   - Migrations are additive (no DROP commands) → safe to rollback

---

## Verification Plan

### Acceptance Checklist Mapping

| # | Criterion | Verification Steps | Tool | Success Criteria |
|---|-----------|-------------------|------|------------------|
| 1 | Lint passes | `npm run lint` | ESLint | 0 errors, 0 warnings |
| 2 | Build passes | `npm run build` | Next.js | Build succeeds, no type errors |
| 3 | Unit tests pass | `npm run test:unit` | Node.js Test Runner | All tests pass (5/5) |
| 4 | E2E tests pass | `npm run test:e2e` | Playwright | All tests pass (28/28) |
| 5 | RPC always overwrites item_name | Manual DB test | psql / Supabase Studio | Submit find with "drill", verify staging canonical name in DB |
| 6 | SerpApi skips max-attempt rows | Run script | `npx tsx scripts/serpapi-enrich.ts --limit 5` | Logs show "skipped: enrichment_attempts >= 2" |
| 7 | Staging pruning works | Run warmer | `python scripts/staging-warmer.py` | Logs show "Pruned X stale staging rows (> 60 days old)" |
| 8 | Apply migrations to Supabase | `supabase db push` | Supabase CLI | Migrations apply without errors |
| 9 | URL field removed | Visual inspection | Playwright screenshot | No "Home Depot product URL" input on `/report-find` |
| 10 | Notes field removed | Visual inspection | Playwright screenshot | No "Additional Notes" input on `/report-find` |
| 11 | City field visible | Visual inspection | Playwright screenshot | City appears above State, styled like Quantity Found |
| 12 | SKU help text updated | Visual inspection | Playwright screenshot | Text mentions "6 or 10 digits" + "Do not use SO SKU/Internet #" |

### Manual Testing Steps

#### Test 1: RPC Always-Overwrite Behavior

**Setup:**
1. Insert staging row via Supabase Studio:
   ```sql
   INSERT INTO enrichment_staging (sku, item_name, brand, retail_price, image_url, product_link)
   VALUES (
     '123456',
     'Milwaukee M18 FUEL Hammer Drill/Driver Kit',
     'Milwaukee',
     199.00,
     'https://example.com/image.jpg',
     'https://www.homedepot.com/p/1001234567'
   );
   ```

2. Submit find via `/report-find`:
   - Item Name: "drill"
   - SKU: 123456
   - State: GA
   - Submit

**Verify:**
```sql
SELECT item_name, brand, retail_price
FROM "Penny List"
WHERE home_depot_sku_6_or_10_digits = '123456'
ORDER BY timestamp DESC
LIMIT 1;
```

**Expected:**
- `item_name` = "Milwaukee M18 FUEL Hammer Drill/Driver Kit" (NOT "drill")
- `brand` = "Milwaukee"
- `retail_price` = 199.00

**Staging row should be deleted:**
```sql
SELECT * FROM enrichment_staging WHERE sku = '123456';
```
Expected: 0 rows

---

#### Test 2: SerpApi Retry Limiting

**Setup:**
1. Update test row to max attempts:
   ```sql
   UPDATE "Penny List"
   SET enrichment_attempts = 2
   WHERE home_depot_sku_6_or_10_digits = '999999';
   ```

2. Run script:
   ```bash
   npx tsx scripts/serpapi-enrich.ts --limit 10
   ```

**Verify:**
- Logs show row 999999 is NOT in processing list
- Query confirms filter works:
  ```sql
  SELECT home_depot_sku_6_or_10_digits, enrichment_attempts
  FROM "Penny List"
  WHERE enrichment_attempts >= 2;
  ```

---

#### Test 3: Staging Pruning

**Setup:**
1. Insert old staging row (backdated created_at):
   ```sql
   INSERT INTO enrichment_staging (sku, item_name, created_at)
   VALUES ('888888', 'Old Item', now() - interval '65 days');
   ```

2. Run warmer:
   ```bash
   python scripts/staging-warmer.py
   ```

**Verify:**
- Logs show "Pruned 1 stale staging rows (> 60 days old)"
- Row deleted:
  ```sql
  SELECT * FROM enrichment_staging WHERE sku = '888888';
  ```
  Expected: 0 rows

---

#### Test 4: Form Visual Verification

**Playwright Script:**
```typescript
await page.goto('http://localhost:3001/report-find')
await page.screenshot({ path: 'reports/proof/report-find-after.png', fullPage: true })

// Verify City field is visible (not in dropdown)
const cityField = page.locator('#storeCity')
await expect(cityField).toBeVisible()

// Verify URL field is gone
const urlField = page.locator('#productUrl')
await expect(urlField).not.toBeVisible()

// Verify notes field is gone
const notesField = page.locator('#notes')
await expect(notesField).not.toBeVisible()

// Verify SKU help text
const skuHint = page.locator('#sku-hint')
await expect(skuHint).toContainText('6 or 10-digit SKU')
await expect(skuHint).toContainText('Do not use Store SO SKU')
```

---

### Quality Gates

**All 4 must pass:**

```bash
npm run lint        # Expected: 0 errors
npm run build       # Expected: successful build
npm run test:unit   # Expected: 5/5 passing (4 existing + 1 new)
npm run test:e2e    # Expected: 28/28 passing
```

**Additional Checks:**

```bash
# Verify migrations syntax
supabase db lint

# Verify Python syntax
ruff check scripts/staging-warmer.py

# Verify TypeScript types
npx tsc --noEmit
```

---

## File Manifest

### Files to Create

| File | Purpose | Lines |
|------|---------|-------|
| `supabase/migrations/018_enrichment_attempts.sql` | Add enrichment_attempts column + index | ~15 |

### Files to Modify

| File | Changes | Lines Changed |
|------|---------|---------------|
| `supabase/migrations/017_consume_enrichment_rpc.sql` | Update item_name merge logic (lines 56-61) | ~6 |
| `scripts/serpapi-enrich.ts` | Add retry limiting logic | ~30 |
| `scripts/staging-warmer.py` | Add pruning function | ~20 |
| `app/report-find/page.tsx` | Remove URL/notes, move City, fix SKU text | ~-120 |
| `tests/submit-find-route.test.ts` | Add always-overwrite test | ~60 |

**Total:** 1 new file, 5 modified files, ~250 lines changed

---

## Implementation Sequence

### Critical Path

1. **Migrations (in order):**
   - `018_enrichment_attempts.sql` (NEW - must run FIRST)
   - `017_consume_enrichment_rpc.sql` (MODIFY)

2. **Backend Scripts:**
   - `scripts/serpapi-enrich.ts` (depends on migration 018)
   - `scripts/staging-warmer.py` (independent)

3. **Frontend:**
   - `app/report-find/page.tsx` (independent)

4. **Tests:**
   - `tests/submit-find-route.test.ts` (independent)

### Deployment Order

```
1. Apply migrations (dev):
   supabase db push

2. Deploy backend scripts:
   git add scripts/
   git commit -m "Add retry limiting + staging pruning"

3. Deploy frontend:
   git add app/report-find/
   git commit -m "Simplify Report Find form"

4. Deploy tests:
   git add tests/
   git commit -m "Add item_name overwrite test"

5. Verify all gates pass:
   npm run lint && npm run build && npm run test:unit && npm run test:e2e

6. Apply migrations (production):
   supabase db push --linked
```

---

## Risk Assessment

### High Risk Changes

**None.** All changes are additive or conservative:
- Migration 018: Adds column (default 0), does NOT modify existing data
- Migration 017: Logic change, but only affects new submissions (existing data unchanged)
- Scripts: Query filters + pruning are non-destructive

### Medium Risk Changes

1. **Form UX changes** (City field placement)
   - Mitigation: Playwright screenshots, mobile testing
   - Rollback: Git revert

2. **SerpApi query filter** (might skip valid rows if column missing)
   - Mitigation: Migration 018 runs FIRST
   - Rollback: Remove `.lt("enrichment_attempts", 2)` filter

### Low Risk Changes

1. **Staging pruning** (deletes old rows)
   - 60-day retention is conservative
   - Most rows consumed within hours
   - Logs deletions for monitoring

---

## Performance Impact

### Database

| Change | Impact | Magnitude |
|--------|--------|-----------|
| Add `enrichment_attempts` column | Storage | +4 bytes/row (~30 KB total) |
| Add partial index | Index size | ~10 KB (filtered index) |
| RPC item_name logic change | Query performance | Negligible (same CASE block) |

**Total:** <50 KB additional storage

### Scripts

| Change | Impact | Magnitude |
|--------|--------|-----------|
| SerpApi `.lt()` filter | Query time | -10ms (uses index) |
| Staging pruning | Warmer runtime | +100-500ms (once per run) |

**Total:** Negligible

### Frontend

| Change | Impact | Magnitude |
|--------|--------|-----------|
| Remove URL/notes fields | Bundle size | -2 KB gzipped |
| Remove helper functions | Bundle size | -1 KB gzipped |

**Total:** -3 KB bundle size (improvement)

---

## Rollback Plan

### If RPC Change Breaks Production

**Revert Migration 017:**
```sql
-- Revert to fill-blanks logic
CREATE OR REPLACE FUNCTION consume_enrichment_for_penny_item(
  p_penny_id UUID,
  p_sku TEXT,
  p_internet_number BIGINT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_staging enrichment_staging%ROWTYPE;
  v_fields_filled TEXT[] := '{}';
  v_match_type TEXT := 'none';
BEGIN
  -- [... same logic as before ...]

  UPDATE "Penny List" SET
    item_name = CASE
      WHEN (item_name IS NULL OR item_name = '') AND v_staging.item_name IS NOT NULL AND v_staging.item_name != ''
      THEN v_staging.item_name
      ELSE item_name  -- Revert to fill-blanks
    END,
    -- [... rest unchanged ...]
  WHERE id = p_penny_id;

  -- [... rest unchanged ...]
END;
$$;
```

### If SerpApi Script Fails

**Remove retry filter:**
```typescript
// In getPennyListGaps():
const { data, error } = await supabase
  .from("Penny List")
  .select(
    "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc"
  )
  .or("item_name.is.null,brand.is.null,image_url.is.null,retail_price.is.null")
  // .lt("enrichment_attempts", 2)  // Comment out or remove
  .order("timestamp", { ascending: false })
  .limit(limit * 2)
```

### If Form Changes Break UX

**Git revert:**
```bash
git revert <commit-hash>
git push
```

Vercel auto-deploys revert within ~60 seconds.

---

## Architecture Ready

**Status:** ✅ Architecture complete

**Next Steps:**
1. Review architecture document
2. Approve for implementation
3. Run `/implement` with this architecture file

**Estimated Implementation Time:**
- Migrations: 10 minutes
- Scripts: 30 minutes
- Frontend: 20 minutes
- Tests: 15 minutes
- Verification: 30 minutes
- **Total:** ~2 hours

---

**END OF ARCHITECTURE DOCUMENT**
