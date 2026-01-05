# Penny List Card Redesign

> **Status:** Architecture drafted, pending Cade approval
> **Created:** 2026-01-04
> **Last Updated:** 2026-01-05
> **Owner:** Cade + Claude

---

## 1. CONCRETE SPEC

### Card Container
- Width: full-width (single-column list)
- Padding: 12–14px
- Border radius: 14–16px
- Separation: 1px subtle border OR subtle shadow (not both)
- Background: standard surface color (no new palette)

---

### Row 1: Identity Block

**Layout:** Two-column (image left, text right)

**Left: Image Thumbnail**
| Property | Value |
|----------|-------|
| Size | 72×72px (fixed) |
| Border radius | 12px |
| Object fit | cover (no distortion) |
| Loading | Reserve space (no layout jump) |
| Fallback | Neutral placeholder box, same size |

**Right: Text Stack**
| Line | Content | Style | Clamp |
|------|---------|-------|-------|
| 1 (optional) | Brand | 12–13px, muted, medium weight | 1 line |
| 2–3 | Item name | 16–18px, medium weight, primary color | 2 lines + ellipsis |

**SKU/Model:** Omitted from card face in v1.0. Lives on detail page and barcode modal only.

**Status pill:** Omitted from card face in v1.0.

---

### Row 2: Value Module

**Layout:** Two-column (penny price left, retail right)

| Element | Style | Format |
|---------|-------|--------|
| Penny price | 28–32px, bold, highest contrast | "$0.01" |
| Retail price | 12–13px, muted | "Retail ~~$49.98~~" |
| Retail strikethrough | Amount only (LOCKED) | Strikethrough the dollar amount, not "Retail" label |
| Savings line | NOT shown on card face (v1.0) | — |
| "PENNY PRICE" label | NOT shown on card face | — |

**Retail fallback:** If missing or invalid (≤0, null), omit retail entirely.

---

### Row 3: Pattern Signals

**Layout:** Always exactly 2 lines. Never more, never fewer.

**Style:** 12–13px, muted, regular weight. No icons. No pills.

| Line | Content | Format |
|------|---------|--------|
| A | Recency | "Last seen: 6h ago" OR "Last seen: Recently" |
| B | State spread | "GA + X states" OR "Seen in N states" OR "State data unavailable" |

**Line A (Recency) rules:**
1. Use `date_purchased` if present, valid, and not future → format as relative time
2. Else use `report_created_at` → format as relative time
3. Else show **"Last seen: Recently"** (honest placeholder)

**Line B (State spread) rules:**
| Condition | Display |
|-----------|---------|
| User has state filter AND reports_in_state(userState) > 0 | "GA + X states" |
| User has state filter AND reports_in_state(userState) = 0 | "Seen in N states" |
| No state filter AND location data exists | "Seen in N states" |
| Only 1 state | "Seen in 1 state" |
| No location data | **"State data unavailable"** (honest placeholder) |

**Do not imply user's state if that state has 0 reports.** State breakdown sheet can show GA=0.

**Report counts:** NOT shown on card face in v1.0. Counts appear in state breakdown sheet and detail page.

**Tap behavior:** Tapping state spread line opens bottom sheet with full state breakdown (even if "State data unavailable").

---

### State Breakdown Sheet

**Trigger:** Tap on state spread line (Line B of pattern signals)

**Container:**
| Viewport | Container |
|----------|-----------|
| Mobile (≤640px) | Bottom sheet |
| Desktop (>640px) | Modal dialog |

**Content rules:**
- **Window:** Same 14-day window as card pattern signals
- **Sort:** By report count descending
- **userState pinning:** If userState exists, pin it to top even if count = 0
- **Format:** State code + count (e.g., "GA: 12 reports", "TX: 8 reports")
- **Empty state:** If no location data, show "No state data available for this item"

---

### Row 4: Actions

**Layout:** Horizontal row, left-aligned. Same structure on mobile and desktop.

| Action | Type | Label | Tap target | Condition |
|--------|------|-------|------------|-----------|
| Report | Primary button | "Report" (text required) | 44px min | Always shown |
| Save | Icon button (toggle) | Tooltip on desktop | 36–40px | Always shown |
| Barcode | Icon button | Tooltip on desktop | 36–40px | Only if UPC/EAN exists |

**Report button:** Text "Report" required on all viewports. Icon optional.

**Save button:** Filled when saved, outline when not. Tooltip on desktop hover.

**Barcode button:** Hidden entirely if no UPC/EAN. Tooltip on desktop hover.

---

### Tap / Navigation Behavior

| Tap target | Behavior |
|------------|----------|
| Card body (not an action) | Navigate to item detail page |
| Report button | Navigate to Report Find form (prefilled) |
| Save button | Toggle saved state (no navigation) |
| Barcode button | Open barcode sheet/modal (no navigation) |
| State spread line | Open state breakdown bottom sheet (no navigation) |

---

### Barcode Container

| Viewport | Container |
|----------|-----------|
| Mobile (≤640px) | Bottom sheet |
| Desktop (>640px) | Modal dialog |

**Content:**
| Element | Style |
|---------|-------|
| Item name | 1 line, truncate if needed |
| Penny price | Small but visible |
| Barcode | Large, with quiet zone margins for scannability |
| Numeric code | Below barcode |
| Copy button | Optional, subtle toast on success |

**Priority:** Scannability > aesthetics. Do not shrink barcode.

---

### Missing Data Fallbacks

| Scenario | Behavior |
|----------|----------|
| Missing image | Neutral placeholder (same 72×72 size) |
| Missing brand | Omit brand line (collapse space) |
| Missing/invalid retail | Omit retail from card face |
| Missing UPC/EAN | Hide barcode button |
| Missing all timestamps | Show "Last seen: Recently" |
| Missing states/location data | Show "State data unavailable" |

**Pattern signals always render 2 lines** using honest placeholders when data is missing.

---

## 2. DECISION LOG

### LOCKED Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| L1 | Image size: 72×72px | Tighter layout, faster scan |
| L2 | No "PENNY PRICE" label | Redundant, $0.01 is self-explanatory |
| L3 | No savings line on card face (v1.0) | Reduce noise, savings on detail page |
| L4 | Recency format: "Last seen: {relative}" | Label removes ambiguity |
| L5 | State spread taps → bottom sheet | Not in-place expand, not navigation |
| L6 | Report button: text required on all viewports | Flywheel action must be obvious |
| L7 | Barcode: container only, not on card face | Scannability requires full screen |
| L8 | Barcode container shows: name + price + barcode + code | Confirmed content |
| L9 | No icons/pills in pattern signals | Text-only, no trust bar |
| L10 | No report counts on card face (v1.0) | Pattern signals = exactly 2 lines |
| L11 | No new palette colors | Use existing design tokens |
| L12 | Card does NOT imply "in your store" | Pattern-level credibility only |
| L13 | SKU/Model omitted from card face (v1.0) | Brand + Item Name only; IDs on detail/modal |
| L14 | State spread: only show "GA + X" if GA_count > 0 | Do not imply state if 0 reports there |
| L15 | Barcode container: mobile=sheet, desktop=modal | Platform-appropriate containers |
| L16 | Desktop actions: same as mobile, tooltips on icons | Consistent structure, enhanced affordance |
| L17 | HD link: REMOVE from card face (v1.0) | Not in spec Row 4; available on detail page |
| L18 | Status pill: REMOVE from card face (v1.0) | Redundant, risk to truth constraints |
| L19 | Pattern signals always 2 lines with placeholders | "Last seen: Recently" / "State data unavailable" |
| L20 | State breakdown: 14d window, sorted desc, userState pinned | Consistent with card, relevant first |
| L21 | Retail strikethrough: amount only | Strikethrough "$49.98" not entire "Retail $49.98" string |

---

## 3. STRUCTURAL AMBIGUITY REGISTER

**EMPTY** — All ambiguities resolved.

---

## 4. ACCEPTANCE CHECKLIST

| # | Criterion | Pass/Fail Test |
|---|-----------|----------------|
| 1 | 1-second scan | User identifies: item identity, $0.01, retail context, last seen, state spread in ≤1 second |
| 2 | No trust bar | Card face has zero icon rows, zero pill rows for pattern signals |
| 3 | Report labeled | Report button shows text "Report" on all viewports |
| 4 | Pattern = 2 lines | Pattern signals always renders exactly 2 lines and never exceeds 2 lines (uses honest placeholders) |
| 5 | No broken layouts | Card renders correctly when image/brand/retail/UPC/dates/states are missing |
| 6 | Barcode scannable | Phone camera can scan barcode from container at arm's length |
| 7 | State tap → sheet | Tapping state spread opens bottom sheet, not navigation |
| 8 | Grayscale readable | Hierarchy is clear with all color removed |
| 9 | No new colors | Only existing CSS variables used (no raw Tailwind colors) |
| 10 | Card navigates | Tapping card body (not action buttons) goes to detail page |
| 11 | No SKU/Model on card | Card face shows only Brand + Item Name (no identifiers) |
| 12 | State logic correct | "GA + X" only when GA_count > 0; else "Seen in N states" or "State data unavailable" |
| 13 | Desktop barcode = modal | Barcode opens in modal dialog on desktop viewport |
| 14 | Desktop icons have tooltips | Save and Barcode icons show tooltip on hover (desktop) |
| 15 | No HD link on card | HD link removed from card face, available on detail page |
| 16 | No status pill on card | Status pill removed from card face |
| 17 | State sheet: 14d, sorted, pinned | Sheet shows 14d counts, sorted desc, userState pinned to top |

---

# ARCHITECTURE OUTPUT

## 5. KEEP vs REMOVE (Element-by-Element)

### Current Card Elements → Disposition

| Element | Decision | Justification |
|---------|----------|---------------|
| Status pill | REMOVE | L18: Redundant, risk to truth constraints |
| Date/freshness display | MODIFY | L4: Change to "Last seen: Xh ago" format |
| Image thumbnail | MODIFY | L1: Change size 120px → 72px |
| Brand | KEEP | Spec Row 1 includes brand |
| Item name | KEEP | Spec Row 1 includes name |
| SKU copy button | REMOVE | L13: SKU omitted from card face |
| Model number | REMOVE | L13: Model omitted from card face |
| "PENNY PRICE" label | REMOVE | L2: Label is redundant |
| Penny price ($0.01) | KEEP | Spec Row 2, style change to 28-32px bold |
| Retail price | KEEP | Spec Row 2, style change to 12-13px muted |
| Savings line | REMOVE | L3: Not shown on card face v1.0 |
| UPC display on card | REMOVE | L7: Barcode container only, not on card face |
| State pills | REMOVE | L9: No icons/pills in pattern signals |
| Stats row (X reports, Y states) | REMOVE | L10: No report counts on card face v1.0 |
| HD link | REMOVE | L17: Not in spec Row 4, available on detail page |
| Report button | KEEP | L6: Text required on all viewports |
| Save/Bookmark button | KEEP | Spec Row 4 includes Save |
| Barcode button | KEEP | Spec Row 4, icon-only, opens modal |

### Pattern Signals (v1.0 Rule)

**Always exactly 2 lines. No exceptions.**

- **Line A:** "Last seen: {relative}" OR "Last seen: Recently" (per L4, L19)
- **Line B:** State spread OR "State data unavailable" (per L14, L19)
  - GA + X states (if GA_count > 0)
  - Seen in N states (otherwise)
  - State data unavailable (if no location data)

**Report counts NOT shown on card face in v1.0.** Counts appear in:
- State breakdown sheet (14d window, sorted desc, userState pinned)
- Detail page

---

## 6. INTERACTION CONTRACT (Explicit)

| Tap Target | Behavior | Navigation? | stopPropagation? |
|------------|----------|-------------|------------------|
| Card body | Navigate to `/sku/{sku}` | YES | N/A (default) |
| State spread line | Open state breakdown sheet | NO | YES (required) |
| Report button | Navigate to Report Find form | YES | YES |
| Save button | Toggle saved state | NO | YES |
| Barcode button | Open barcode modal/sheet | NO | YES |

**Critical:** State spread line tap MUST call `stopPropagation()` to prevent card navigation.

---

## 7. IMPLEMENTATION PLAN

### Files to Modify

| # | File Path | Change Type | Risk |
|---|-----------|-------------|------|
| 1 | `lib/penny-list-utils.ts` | Add helpers | Low |
| 2 | `components/state-breakdown-sheet.tsx` | **NEW FILE** | Low |
| 3 | `components/barcode-modal.tsx` | Add optional props | Low |
| 4 | `components/penny-list-card.tsx` | Restructure | Medium |
| 5 | `components/penny-list-client.tsx` | Pass stateFilter prop | Low |

### Change Sequencing

**Phase 1: Foundation**
1. `lib/penny-list-utils.ts` - Add `getLastSeenDate()`, `formatStateSpread()`
2. `components/state-breakdown-sheet.tsx` - New component (mobile: bottom sheet, desktop: modal)
3. `components/barcode-modal.tsx` - Add optional `productName`, `pennyPrice` props

**Phase 2: Card Restructure**
4. `components/penny-list-card.tsx`:
   - Add prop: `stateFilter?: string`
   - Apply KEEP/REMOVE decisions from table above
   - Restructure to 4-row layout per spec
   - Implement interaction contract with stopPropagation

**Phase 3: Integration**
5. `components/penny-list-client.tsx` - Pass `stateFilter` to cards

---

## 8. REGRESSION GUARD PLAN

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Card layout breaks on missing data | Always render 2 pattern lines with placeholders |
| Touch targets too small | Verify ≥36px icons, ≥44px buttons |
| State sheet doesn't open | Test stopPropagation on mobile |
| Dark mode broken | Only use existing CSS variables |

### Prevention Checklist

- [ ] No new CSS variables added
- [ ] No raw Tailwind colors (`npm run lint:colors`)
- [ ] "use client" preserved on interactive components
- [ ] Pattern signals always render exactly 2 lines

---

## 9. VERIFICATION PLAN

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | 1-second scan | Screenshot: item, $0.01, retail, last seen, state spread visible |
| 2 | No trust bar | Visual: zero icon rows, zero pill rows |
| 3 | Report labeled | Mobile 375px: "Report" text visible |
| 4 | Pattern = 2 lines | Visual: always exactly 2 lines, never fewer, never more |
| 5 | No broken layouts | Test with null fields - must still show 2 pattern lines |
| 6 | Barcode scannable | Phone camera test |
| 7 | State tap → sheet | Playwright: opens sheet, no navigation |
| 8 | Grayscale readable | Desaturated screenshot |
| 9 | No new colors | `npm run lint:colors` = 0 |
| 10 | Card navigates | Playwright: body click → detail page |
| 11 | No SKU/Model | Visual: only Brand + Name |
| 12 | State logic correct | Test: GA_count>0 → "GA + X"; GA_count=0 → "Seen in N"; no data → "State data unavailable" |
| 13 | Desktop barcode = modal | 1280px: modal not sheet |
| 14 | Desktop tooltips | Hover test |
| 15 | No HD link | Visual: HD link not on card face |
| 16 | No status pill | Visual: status pill not on card face |
| 17 | State sheet content | Sheet shows: 14d counts, sorted desc, userState pinned top |

---

## Fragile Area Check

- ✅ **globals.css**: NOT modified
- ✅ **store-map.tsx**: NOT touched
- ✅ **"use client"**: Preserved
- ✅ **Build config**: NOT touched

---

## Pending Cade Approval

Structural Ambiguity Register: **EMPTY**

Ready for /implement approval.
