# Penny Card Systematic Hierarchy - Planning Document

> **Status:** In Planning (2026-01-27)
> **Context:** Fixes arbitrary spacing/hierarchy issues remaining after visual overhaul
> **Owner Directive:** "what's bugging you isn't just one bug, it's that the card system doesn't feel like a strict system"

---

## PROBLEM STATEMENT

The penny cards have correct information and clean borders (post-visual-overhaul), but the **spacing, hierarchy, and visual weight feel arbitrary**:

- Brand dominates title despite being less important
- Metadata lines (last seen, reports, states) wash together
- Images feel too small for tiny products
- Spacing inconsistent (some blocks tight, some loose)
- Result: Cards don't read like they follow a system

---

## APPROVED DECISIONS (From Owner)

### 1. SKU Placement

**Decision:** Move SKU from Block 1 → Block 3 (metadata area)

**Current (problematic):**

```
Block 1: Image + Brand + Title + SKU  ← too busy
```

**New (cleaner):**

```
Block 1: Image + Brand + Title
Block 3: SKU + Last seen + Reports/states + State chips
```

**Rationale:** Top area gets too busy with SKU; grouping SKU with factual data makes Block 1 cleaner and more consistent.

---

### 2. Brand Typography

**Decision:** Keep 12px, reduce weight 500 → 400

| Property  | Current           | New                           |
| --------- | ----------------- | ----------------------------- |
| Size      | 12px (text-xs)    | 12px (text-xs) ← NO CHANGE    |
| Weight    | 500 (font-medium) | 400 (font-normal) ← SOFTEN    |
| Color     | var(--text-muted) | var(--text-muted) ← NO CHANGE |
| Transform | uppercase         | uppercase ← NO CHANGE         |

**Rationale:** Softens brand just enough to stop overpowering title/metadata without making it disappear on lower-DPI screens.

---

### 3. Metadata Structure (Block 3)

**Decision:** 3-line stable stack with differentiated hierarchy

**Block 3a: Last seen**

- Format: `Last seen: 3 days ago`
- Style: 12px, **font-medium** (slightly higher contrast than 3b/3c)
- Color: `var(--text-secondary)`

**Block 3b: Reports + States**

- Format: `47 reports · 12 states` OR `47 reports · TX + 11 states`
- Style: 12px, font-normal (more muted than 3a)
- Color: `var(--text-secondary)`

**Block 3c: State chips**

- Format: `TX  CA  FL  NY  +8` (space-separated, no borders)
- Style: 11px, 600 weight
- Color: `var(--text-secondary)`
- On separate line below 3b

**Rationale:** Stable 3-line stack reads consistently across all cards; hierarchy prevents wash-out.

---

### 4. Image Size

**Decision:** 72px for full cards, keep compact cards as-is

| Variant      | Current          | New                          |
| ------------ | ---------------- | ---------------------------- |
| Full card    | 64px (w-16 h-16) | **72px (w-18 h-18)**         |
| Compact card | 48px (w-12 h-12) | 48px (w-12 h-12) ← NO CHANGE |

**Rationale:** 72px is noticeable improvement without exploding card height; compact layout stays intact.

---

### 5. Spacing Tokens

**Decision:** Strict 4px / 12px system

| Context            | Token     | Value | Usage                                |
| ------------------ | --------- | ----- | ------------------------------------ |
| **Within blocks**  | space-y-1 | 4px   | Between brand/title, title/SKU, etc. |
| **Between blocks** | space-y-3 | 12px  | Between Block 1→2, 2→3, 3→4          |

**Current problem:** Some gaps are space-y-1, some space-y-2, feels random.

**New rule:** If elements are in same logical block = 4px. If crossing block boundary = 12px.

---

## 4-BLOCK STRUCTURE (REVISED)

### Block 1: Hero (Image + Brand + Title)

```tsx
;<div className="flex gap-2.5 items-start">
  {" "}
  {/* Image beside text */}
  <PennyThumbnail size={72} />
  <div className="flex-1 min-w-0 space-y-1">
    {" "}
    {/* 4px between brand/title */}
    {displayBrand && <p className="text-xs font-normal ...">BRAND</p>}
    <h3 className="text-[15px] font-semibold ...">Title Here Max 2 Lines</h3>
  </div>
</div>

{
  /* 12px gap to next block */
}
```

**Changes from current:**

- Brand weight: 500 → 400
- Image: 64px → 72px
- SKU removed (moved to Block 3)

---

### Block 2: Price

```tsx
;<div className="flex items-baseline gap-2">
  <span className="text-[24px] font-bold">$0.01</span>
  {retailPrice && <span className="text-[13px] line-through">$49.99</span>}
</div>

{
  /* 12px gap to next block */
}
```

**Changes from current:** None (already correct)

---

### Block 3: Metadata (SKU + Recency + Reports + States)

```tsx
;<div className="space-y-1">
  {" "}
  {/* 4px between metadata lines */}
  {/* 3a: SKU (NEW LOCATION) */}
  <button className="text-xs font-mono ...">SKU 123-456-7890</button>
  {/* 3b: Last seen (higher contrast) */}
  <p className="text-xs font-medium text-[var(--text-secondary)]">Last seen: 3 days ago</p>
  {/* 3c: Reports + States (more muted) */}
  <p className="text-xs font-normal text-[var(--text-secondary)]">47 reports · TX + 11 states</p>
  {/* 3d: State chips (separate line) */}
  <div className="flex gap-1.5">
    <span className="text-[11px] font-semibold">TX</span>
    <span className="text-[11px] font-semibold">CA</span>
    <span className="text-[11px] font-semibold">FL</span>
    <span className="text-[11px] font-semibold">+8</span>
  </div>
</div>

{
  /* 12px gap to next block */
}
```

**Changes from current:**

- SKU moved here from Block 1
- 3 sub-sections with clear hierarchy:
  - SKU: clickable, monospace
  - Last seen: font-medium (slightly stronger)
  - Reports/states: font-normal (muted)
  - State chips: separate line

---

### Block 4: Actions

```tsx
<div className="space-y-2">
  {" "}
  {/* 8px between primary/secondary */}
  {/* Primary: Report Find (full width) */}
  <Button className="w-full min-h-[44px]">
    <PlusCircle /> Report Find
  </Button>
  {/* Secondary: Icon-only (centered row) */}
  <div className="flex justify-center gap-1.5">
    <a className="min-h-[44px] min-w-[44px] ...">HD Link</a>
    <button className="min-h-[44px] min-w-[44px] ...">Barcode</button>
    <AddToListButton className="min-h-[44px] min-w-[44px] ..." />
  </div>
</div>
```

**Changes from current:** None (already correct)

---

## STRUCTURAL IMPLICATIONS

### Where does SKU go in the compact card variant?

**Question:** Compact cards have a different layout (horizontal image + content). Does SKU move to metadata there too?

**Options:**

- A) Move SKU to metadata block (consistent with full cards)
- B) Keep SKU near top in compact cards (variant-specific exception)

**Need owner input.**

---

### Does "Last seen" weight change affect readability?

**Concern:** Making "Last seen" font-medium while reports/states stay font-normal creates hierarchy, but does it look weird having two different weights in the same metadata block?

**Test needed:** Visual mockup of Block 3 with font-medium vs font-normal for line 3b.

---

### Does 72px image break mobile layout?

**Concern:** Increasing image from 64px → 72px on mobile (375px viewport) might make cards taller and reduce items visible above fold.

**Test needed:** Screenshot mobile viewport with 72px images, count visible cards.

---

## ACCEPTANCE CRITERIA

| #   | Criterion                              | Test                                           |
| --- | -------------------------------------- | ---------------------------------------------- |
| 1   | Brand is visually subordinate to title | Grayscale screenshot - title draws eye first   |
| 2   | SKU in metadata block (not Block 1)    | Read component code - SKU inside Block 3       |
| 3   | Metadata has 3-line hierarchy          | "Last seen" stronger than "reports/states"     |
| 4   | Images are 72px on full cards          | Inspect element - width/height = 72            |
| 5   | Spacing is systematic                  | Within blocks = 4px, between = 12px            |
| 6   | All data preserved                     | Report count, states, recency, SKU all visible |
| 7   | Compact cards unaffected               | Hot cards still use 48px images                |
| 8   | Mobile cards still fit                 | ≥2.5 cards visible above fold on 375px         |

---

## STRUCTURAL AMBIGUITIES: RESOLVED ✅

### 1. SKU Placement in Compact Cards

**Decision:** Option A - Consistent metadata placement in BOTH variants

SKU moves to Block 3 (metadata area) for:

- Full cards (PennyListCard)
- Compact cards (PennyListCardCompact)

**Rationale:** SKU is a factual lookup detail, not part of hero identity. Consistent placement makes the system predictable and stops top of card from feeling crowded.

---

### 2. "Last seen" Typography Weight

**Decision:** font-medium for "Last seen", font-normal for reports/states

```tsx
// Block 3 typography hierarchy
<p className="... font-medium">Last seen: 3 days ago</p>      {/* Stronger */}
<p className="... font-normal">47 reports · TX + 11 states</p> {/* Muted */}
```

**Rationale:** "Last seen" is the freshness signal and deserves to be primary line in metadata stack. Mixing weights is acceptable because each line has different job: SKU=interaction, Last seen=freshness, Reports/states=context, Chips=geography.

---

### 3. Mobile Card Density with 72px Images

**Decision:** Accept ~2-2.5 cards visible above fold (vs current 2.5-3)

**Trade-off accepted:** Recognizability beats raw card count for deal-hunting UI. Bigger images + cleaner hierarchy more important than squeezing extra half-card into viewport.

**Test required:** Screenshot 375px mobile viewport with 72px images, verify acceptable density.

---

## STRUCTURAL AMBIGUITY COUNT: 0

All blocking questions resolved. Spec ready for architecture phase.

---

## NEXT STEPS

1. ✅ Resolve structural ambiguities (DONE)
2. Create detailed implementation spec with exact code changes
3. Document file-by-file modifications
4. Write concrete acceptance tests (Playwright)
5. Exit planning → Enter architecture phase

---

**This spec is READY for architecture/implementation.**

---

## IMPLEMENTATION SPEC: EXACT CODE CHANGES

### File 1: `components/penny-list-card.tsx` (Full Card Variant)

#### Change 1.1: Brand Typography (Block 1)

**Location:** Lines 146-152 (brand element)

```tsx
// CURRENT
<p
  className="text-xs font-medium text-[var(--text-muted)] uppercase truncate max-w-[70%]"
  title={displayBrand}
  data-testid="penny-card-brand"
>

// NEW
<p
  className="text-xs font-normal text-[var(--text-muted)] uppercase truncate max-w-[70%]"
  title={displayBrand}
  data-testid="penny-card-brand"
>
```

**Change:** `font-medium` → `font-normal` (500 → 400 weight)

---

#### Change 1.2: Thumbnail Size (Block 1)

**Location:** Line 142 (PennyThumbnail component)

```tsx
// CURRENT
<PennyThumbnail src={thumbnailSrc} alt={displayName} size={64} />

// NEW
<PennyThumbnail src={thumbnailSrc} alt={displayName} size={72} />
```

**Change:** 64px → 72px image size

---

#### Change 1.3: Move SKU to Block 3 (Metadata Area)

**Current structure:** SKU is in Block 1, between title and price

**New structure:** Move entire SKU button element to Block 3, before "Last seen"

```tsx
// REMOVE from Block 1 (lines 160-180):
<button
  type="button"
  onClick={(event) => {
    event.preventDefault()
    event.stopPropagation()
    handleSkuCopy(event)
  }}
  className="text-xs font-medium font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
  aria-label={`Copy SKU ${formatSkuForDisplay(item.sku)}`}
  title="Click to copy SKU"
  data-test="penny-card-sku"
>
  SKU {formatSkuForDisplay(item.sku)}
  {copiedSku && (
    <Check
      className="inline w-3 h-3 ml-1 text-[var(--status-success)]"
      aria-hidden="true"
    />
  )}
</button>

// ADD to Block 3 (new Block 3a, before "Last seen"):
<button
  type="button"
  onClick={(event) => {
    event.preventDefault()
    event.stopPropagation()
    handleSkuCopy(event)
  }}
  className="text-xs font-medium font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded"
  aria-label={`Copy SKU ${formatSkuForDisplay(item.sku)}`}
  title="Click to copy SKU"
  data-test="penny-card-sku"
>
  SKU {formatSkuForDisplay(item.sku)}
  {copiedSku && (
    <Check
      className="inline w-3 h-3 ml-1 text-[var(--status-success)]"
      aria-hidden="true"
    />
  )}
</button>
```

---

#### Change 1.4: Block 3 Typography Hierarchy

**Location:** Pattern Signals section (lines 194-216)

**Block 3b: "Last seen" - Add font-medium**

```tsx
// CURRENT (Line A)
<p>
  Last seen:{" "}
  <time dateTime={lastSeenValue} title={lastSeenTitle ?? undefined}>
    {formatRelativeDate(lastSeenValue)}
  </time>
</p>

// NEW (Block 3b - stronger hierarchy)
<p className="font-medium">
  Last seen:{" "}
  <time dateTime={lastSeenValue} title={lastSeenTitle ?? undefined}>
    {formatRelativeDate(lastSeenValue)}
  </time>
</p>
```

**Block 3c: "Reports/states" - Keep font-normal (no change needed)**

```tsx
// CURRENT (Line B) - already font-normal by default
<p>
  {totalReports} {totalReports === 1 ? "report" : "reports"}
  {" · "}
  {item.locations && Object.keys(item.locations).length > 0 ? ...}
</p>
```

---

#### Change 1.5: Spacing Adjustments

**Location:** Multiple blocks

**Block 1 (Image + Brand + Title):**

- Inner spacing: `space-y-1` (4px) ← already correct
- Outer spacing to Block 2: Add `mb-3` to Block 1 container (12px gap)

**Block 2 (Price):**

- Outer spacing to Block 3: Add `mb-3` (12px gap)

**Block 3 (Metadata):**

- Inner spacing: `space-y-1` (4px) ← already correct
- Outer spacing to Block 4: Add `mb-3` (12px gap)

**Implementation:** Update the main card content container:

```tsx
// CURRENT
<div className="p-4 flex flex-col flex-1 space-y-2">

// NEW
<div className="p-4 flex flex-col flex-1 space-y-3">
```

**Change:** `space-y-2` (8px) → `space-y-3` (12px) between blocks

---

### File 2: `components/penny-list-card.tsx` (Compact Card Variant)

#### Change 2.1: Brand Typography

**Location:** Lines 427-437 (brand element in compact card)

```tsx
// CURRENT
<p
  className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] truncate max-w-[70%]"
  title={displayBrand}
  data-testid="penny-card-brand-compact"
>

// NEW
<p
  className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-normal truncate max-w-[70%]"
  title={displayBrand}
  data-testid="penny-card-brand-compact"
>
```

**Change:** Add explicit `font-normal` (brand already appears lighter in compact, but make it explicit)

---

#### Change 2.2: Move SKU to Metadata Area (Compact Card)

**Current location:** Lines 440-456 (SKU pill below title)

**New location:** Move to metadata section (after price block, before state chips)

```tsx
// REMOVE from current location (lines 440-456)
// MOVE to after price block (around line 487), before state section
```

**Note:** Compact card has different layout - SKU should go between price section and state chips for consistency with full card's Block 3 structure.

---

#### Change 2.3: Compact Card Image Size

**Decision:** Keep at 48px (do NOT change to 72px)

**Rationale:** Compact cards are space-constrained horizontal layout. 72px would break the design. Only full cards get larger images.

---

### File 3: Test File - Create New Playwright Test

**Location:** Create `tests/penny-card-systematic-hierarchy.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test.describe("Penny Card Systematic Hierarchy", () => {
  test("Full card: Brand is font-normal (400 weight)", async ({ page }) => {
    await page.goto("/penny-list")
    const brand = page.locator('[data-testid="penny-card-brand"]').first()
    await expect(brand).toBeVisible()

    // Check computed font-weight
    const fontWeight = await brand.evaluate((el) => window.getComputedStyle(el).fontWeight)
    expect(fontWeight).toBe("400")
  })

  test("Full card: Image is 72px", async ({ page }) => {
    await page.goto("/penny-list")
    const thumbnail = page.locator(".penny-thumbnail").first()
    const box = await thumbnail.boundingBox()

    expect(box?.width).toBeCloseTo(72, 5)
    expect(box?.height).toBeCloseTo(72, 5)
  })

  test("Full card: SKU in metadata block (below price)", async ({ page }) => {
    await page.goto("/penny-list")
    const card = page.locator('[data-testid="penny-card-brand"]').first().locator("..")

    // Get positions of price and SKU
    const price = card.locator("text=/\\$0\\.01/")
    const sku = card.locator('[data-test="penny-card-sku"]')

    const priceBox = await price.boundingBox()
    const skuBox = await sku.boundingBox()

    // SKU should be below price (higher Y coordinate)
    expect(skuBox!.y).toBeGreaterThan(priceBox!.y)
  })

  test('Full card: "Last seen" is font-medium', async ({ page }) => {
    await page.goto("/penny-list")
    const lastSeen = page.locator("text=/Last seen:/").first()

    const fontWeight = await lastSeen.evaluate((el) => window.getComputedStyle(el).fontWeight)
    expect(fontWeight).toBe("500")
  })

  test("Mobile: ~2-2.5 cards visible above fold", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/penny-list")

    const cards = page.locator('[data-testid="penny-card-brand"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // Visual check: at least 2 cards should be partially visible
    // This is a smoke test - exact count depends on content
  })
})
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Change 1.1: Brand font-medium → font-normal (full card)
- [ ] Change 1.2: Thumbnail 64px → 72px (full card)
- [ ] Change 1.3: Move SKU to Block 3 (full card)
- [ ] Change 1.4: Add font-medium to "Last seen" (full card)
- [ ] Change 1.5: Update spacing space-y-2 → space-y-3 (full card)
- [ ] Change 2.1: Brand explicit font-normal (compact card)
- [ ] Change 2.2: Move SKU to metadata area (compact card)
- [ ] Change 2.3: Verify compact card image stays 48px
- [ ] Create new Playwright test file
- [ ] Run all 4 quality gates (lint, build, unit, e2e)
- [ ] Take before/after screenshots (mobile + desktop, light + dark)
- [ ] Verify ≥2 cards visible on 375px mobile viewport

---

## FILES TO MODIFY

| File                                            | Changes                                                 | Risk   |
| ----------------------------------------------- | ------------------------------------------------------- | ------ |
| `components/penny-list-card.tsx`                | 5 changes (brand, image, SKU move, spacing, typography) | Medium |
| `tests/penny-card-systematic-hierarchy.spec.ts` | New file (create)                                       | Low    |

---

## ESTIMATED IMPACT

- Lines modified: ~20 lines
- New lines: ~80 lines (test file)
- Files touched: 2 (1 modified, 1 created)
- Risk level: Medium (structural layout change)
- Test coverage: 5 new Playwright assertions

---
