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
| 1 | Brand + SKU | 12–13px, muted, medium weight | 1 line |
| 2–3 | Item name | 16–18px, medium weight, primary color | 2 lines + ellipsis |

**SKU (LOCKED):** Must be visible on card face.

- Format: `Brand · SKU 123456`
- If brand missing: `SKU 123456`

**Model:** Omitted from card face in v1.0. Lives on detail page and barcode modal only.

**Status pill:** Omitted from card face in v1.0.

---

### Row 2: Value Module

**Layout:** Two-column (penny price left, retail right)

| Element              | Style                           | Format                                              |
| -------------------- | ------------------------------- | --------------------------------------------------- |
| Penny price          | 28–32px, bold, highest contrast | "$0.01"                                             |
| Retail price         | 12–13px, muted                  | "Retail ~~$49.98~~"                                 |
| Retail strikethrough | Amount only (LOCKED)            | Strikethrough the dollar amount, not "Retail" label |
| Savings line         | NOT shown on card face (v1.0)   | —                                                   |
| "PENNY PRICE" label  | NOT shown on card face          | —                                                   |

**Retail fallback:** If missing or invalid (≤0, null), omit retail entirely.

---

### Row 3: Pattern Signals

**Layout:** Always exactly 2 lines. Never more, never fewer.

**Style:** 12–13px, muted, regular weight. No icons. No pills.

| Line | Content                                | Format                                                                                                               |
| ---- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| A    | Recency                                | "Last seen: 6h ago" OR "Last seen: Recently"                                                                         |
| B    | State spread + report count (windowed) | "GA + X states · Y reports (Wd)" OR "Seen in N states · Y reports (Wd)" OR "State data unavailable · Y reports (Wd)" |

**Line A (Recency) rules:**

1. Use `date_purchased` if present, valid, and not future → format as relative time
2. Else use `report_created_at` → format as relative time
3. Else show **"Last seen: Recently"** (honest placeholder)

**Line B (State spread + report count) rules:**
| Condition | Display |
|-----------|---------|
| User has state filter AND reports_in_state(userState) > 0 | "GA + X states · Y reports (Wd)" |
| User has state filter AND reports_in_state(userState) = 0 | "Seen in N states · Y reports (Wd)" |
| No state filter AND location data exists | "Seen in N states · Y reports (Wd)" |
| Only 1 state | "Seen in 1 state · Y reports (Wd)" |
| No location data | **"State data unavailable · Y reports (Wd)"** (honest placeholder) |

**Y reports:** Total report count across all states within the active window (Wd).

**Do not imply user's state if that state has 0 reports.** State breakdown sheet can show GA=0.

**Report counts (LOCKED):** Always shown on Line B.

- If space is tight, abbreviate counts (e.g., 1.2k) but never remove them.

**Window label (Wd) rules (LOCKED):**

1. Use the active list time filter window when present (e.g., 7d, 30d, 6m).
2. If no active filter exists, default to 30 days and label as `(30d)`.
3. Map UI date ranges to label tokens (e.g., `1m`, `3m`, `6m`, `12m`, `18m`, `24m`, `all`).

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

- **Window:** Same window as card Line B (active list filter if present; default 30d)
- **Label:** Show the window label in the sheet header or subtitle (e.g., "State breakdown (30d)")
- **Sort:** By report count descending
- **userState pinning:** If userState exists, pin it to top even if count = 0
- **Format:** State code + count (e.g., "GA: 12 reports", "TX: 8 reports")
- **Empty state:** If no location data, show "No state data available for this item"

---

### Row 4: Actions

**Layout:** Horizontal row, left-aligned. Same structure on mobile and desktop.

| Action     | Type                 | Label                    | Tap target | Condition                     |
| ---------- | -------------------- | ------------------------ | ---------- | ----------------------------- |
| Report     | Primary button       | "Report" (text required) | 44px min   | Always shown                  |
| Save       | Icon button (toggle) | Tooltip on desktop       | 36–40px    | Always shown                  |
| Barcode    | Icon button          | Tooltip on desktop       | 36–40px    | Only if UPC/EAN exists        |
| Home Depot | Icon button (link)   | Tooltip on desktop       | 36–40px    | Only if Home Depot URL exists |

**Report button:** Text "Report" required on all viewports. Icon optional.

**Save button:** Filled when saved, outline when not. Tooltip on desktop hover.

**Barcode button:** Hidden entirely if no UPC/EAN. Tooltip on desktop hover.

**Home Depot button (LOCKED):**

- Opens Home Depot product page in a new tab/window
- Use `rel="noopener noreferrer"` and an accessible `aria-label`
- Render only when a valid Home Depot URL exists (do not invent)

---

### Tap / Navigation Behavior

| Tap target                | Behavior                                          |
| ------------------------- | ------------------------------------------------- |
| Card body (not an action) | Navigate to item detail page                      |
| Report button             | Navigate to Report Find form (prefilled)          |
| Save button               | Toggle saved state (no navigation)                |
| Barcode button            | Open barcode sheet/modal (no navigation)          |
| State spread line         | Open state breakdown bottom sheet (no navigation) |
| Home Depot button         | Open Home Depot product page (new tab/window)     |

---

### Barcode Container

| Viewport         | Container    |
| ---------------- | ------------ |
| Mobile (≤640px)  | Bottom sheet |
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

| Scenario                     | Behavior                                      |
| ---------------------------- | --------------------------------------------- |
| Missing image                | Neutral placeholder (same 72×72 size)         |
| Missing brand                | Show `SKU 123456` on Line 1 (no brand prefix) |
| Missing/invalid retail       | Omit retail from card face                    |
| Missing UPC/EAN              | Hide barcode button                           |
| Missing Home Depot URL       | Hide Home Depot button                        |
| Missing all timestamps       | Show "Last seen: Recently"                    |
| Missing states/location data | Show "State data unavailable"                 |
| Missing report count         | Treat as 0 reports for Line B formatting      |

**Pattern signals always render 2 lines** using honest placeholders when data is missing.

---

## 2. DECISION LOG

### LOCKED Decisions

| ID  | Decision                                               | Rationale                                                |
| --- | ------------------------------------------------------ | -------------------------------------------------------- |
| L1  | Image size: 72×72px                                    | Tighter layout, faster scan                              |
| L2  | No "PENNY PRICE" label                                 | Redundant, $0.01 is self-explanatory                     |
| L3  | No savings line on card face (v1.0)                    | Reduce noise, savings on detail page                     |
| L4  | Recency format: "Last seen: {relative}"                | Label removes ambiguity                                  |
| L5  | State spread taps → bottom sheet                       | Not in-place expand, not navigation                      |
| L6  | Report button: text required on all viewports          | Flywheel action must be obvious                          |
| L7  | Barcode: container only, not on card face              | Scannability requires full screen                        |
| L8  | Barcode container shows: name + price + barcode + code | Confirmed content                                        |
| L9  | No icons/pills in pattern signals                      | Text-only, no trust bar                                  |
| L10 | Report counts on card face (Line B)                    | Line B shows state spread + report count + window label  |
| L11 | No new palette colors                                  | Use existing design tokens                               |
| L12 | Card does NOT imply "in your store"                    | Pattern-level credibility only                           |
| L13 | SKU visible on card face (LOCKED)                      | Brand line shows "Brand · SKU 123456" or "SKU 123456"    |
| L14 | State spread: only show "GA + X" if GA_count > 0       | Do not imply state if 0 reports there                    |
| L15 | Barcode container: mobile=sheet, desktop=modal         | Platform-appropriate containers                          |
| L16 | Desktop actions: same as mobile, tooltips on icons     | Consistent structure, enhanced affordance                |
| L17 | HD link: VISIBLE on card face (LOCKED)                 | Icon button in Row 4 when URL exists                     |
| L18 | Status pill: REMOVE from card face (v1.0)              | Redundant, risk to truth constraints                     |
| L19 | Pattern signals always 2 lines with placeholders       | "Last seen: Recently" / "State data unavailable"         |
| L20 | State breakdown uses active window (default 30d)       | Must match card Line B window                            |
| L21 | Retail strikethrough: amount only                      | Strikethrough "$49.98" not entire "Retail $49.98" string |

---

## 3. STRUCTURAL AMBIGUITY REGISTER

**EMPTY** — All ambiguities resolved.

---

## 4. ACCEPTANCE CHECKLIST

| #   | Criterion                   | Pass/Fail Test                                                                                      |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | 1-second scan               | User identifies: item identity, $0.01, retail context, last seen, state spread in ≤1 second         |
| 2   | No trust bar                | Card face has zero icon rows, zero pill rows for pattern signals                                    |
| 3   | Report labeled              | Report button shows text "Report" on all viewports                                                  |
| 4   | Pattern = 2 lines           | Pattern signals always renders exactly 2 lines and never exceeds 2 lines (uses honest placeholders) |
| 5   | No broken layouts           | Card renders correctly when image/brand/retail/UPC/dates/states are missing                         |
| 6   | Barcode scannable           | Phone camera can scan barcode from container at arm's length                                        |
| 7   | State tap → sheet           | Tapping state spread opens bottom sheet, not navigation                                             |
| 8   | Grayscale readable          | Hierarchy is clear with all color removed                                                           |
| 9   | No new colors               | Only existing CSS variables used (no raw Tailwind colors)                                           |
| 10  | Card navigates              | Tapping card body (not action buttons) goes to detail page                                          |
| 11  | SKU visible on card         | Line 1 shows "Brand · SKU 123456" or "SKU 123456"; model omitted                                    |
| 12  | State + count logic correct | Line B uses correct state phrasing + report count + window label                                    |
| 13  | Desktop barcode = modal     | Barcode opens in modal dialog on desktop viewport                                                   |
| 14  | Desktop icons have tooltips | Save, Barcode, and Home Depot icons show tooltip on hover (desktop)                                 |
| 15  | HD link on card             | Home Depot icon visible when URL exists; opens new tab                                              |
| 16  | No status pill on card      | Status pill removed from card face                                                                  |
| 17  | State sheet window aligned  | Sheet uses active window (default 30d), sorted desc, userState pinned top                           |

---

# ARCHITECTURE OUTPUT

## 5. KEEP vs REMOVE (Element-by-Element)

### Current Card Elements → Disposition

| Element                         | Decision | Justification                                               |
| ------------------------------- | -------- | ----------------------------------------------------------- |
| Status pill                     | REMOVE   | L18: Redundant, risk to truth constraints                   |
| Date/freshness display          | MODIFY   | L4: Change to "Last seen: Xh ago" format                    |
| Image thumbnail                 | MODIFY   | L1: Change size 120px → 72px                                |
| Brand                           | KEEP     | Spec Row 1 includes brand                                   |
| Item name                       | KEEP     | Spec Row 1 includes name                                    |
| SKU copy button                 | REMOVE   | SKU visible as text in Brand line; copy button not required |
| Model number                    | REMOVE   | L13: Model omitted from card face                           |
| "PENNY PRICE" label             | REMOVE   | L2: Label is redundant                                      |
| Penny price ($0.01)             | KEEP     | Spec Row 2, style change to 28-32px bold                    |
| Retail price                    | KEEP     | Spec Row 2, style change to 12-13px muted                   |
| Savings line                    | REMOVE   | L3: Not shown on card face v1.0                             |
| UPC display on card             | REMOVE   | L7: Barcode container only, not on card face                |
| State pills                     | REMOVE   | L9: No icons/pills in pattern signals                       |
| Stats row (X reports, Y states) | REMOVE   | Counts now live in Line B (state spread + report count)     |
| HD link                         | KEEP     | L17: Visible on card face as action button                  |
| Report button                   | KEEP     | L6: Text required on all viewports                          |
| Save/Bookmark button            | KEEP     | Spec Row 4 includes Save                                    |
| Barcode button                  | KEEP     | Spec Row 4, icon-only, opens modal                          |

### Pattern Signals (v1.0 Rule)

**Always exactly 2 lines. No exceptions.**

- **Line A:** "Last seen: {relative}" OR "Last seen: Recently" (per L4, L19)
- **Line B:** State spread + report count + window label (per L10, L14, L19)
  - GA + X states · Y reports (Wd) if GA_count > 0
  - Seen in N states · Y reports (Wd) otherwise
  - State data unavailable · Y reports (Wd) if no location data

**Report counts are shown on the card face (LOCKED).** Counts also appear in:

- State breakdown sheet (window matches Line B)
- Detail page

---

## 6. INTERACTION CONTRACT (Explicit)

**Navigation pattern requirement (LOCKED):** Avoid nested interactive elements.
Use ONE of these safe patterns:

1. Link wraps only the non-interactive content region; action buttons live outside the Link.
2. Card container uses `router.push` on click + keyboard (Enter/Space), with `role="link"` and `tabIndex=0`; action buttons call `stopPropagation()`.

| Tap Target        | Behavior                                      | Navigation? | stopPropagation? |
| ----------------- | --------------------------------------------- | ----------- | ---------------- |
| Card body         | Navigate to `/sku/{sku}`                      | YES         | N/A (default)    |
| State spread line | Open state breakdown sheet                    | NO          | YES (required)   |
| Report button     | Navigate to Report Find form                  | YES         | YES              |
| Save button       | Toggle saved state                            | NO          | YES              |
| Barcode button    | Open barcode modal/sheet                      | NO          | YES              |
| Home Depot button | Open Home Depot product page (new tab/window) | YES         | YES              |

**Critical:** State spread line tap MUST call `stopPropagation()` to prevent card navigation.

---

## 7. IMPLEMENTATION PLAN

### Files to Modify

| #   | File Path                              | Change Type                                    | Risk   |
| --- | -------------------------------------- | ---------------------------------------------- | ------ |
| 1   | `lib/penny-list-utils.ts`              | Add helpers (window label + Line B formatting) | Low    |
| 2   | `components/state-breakdown-sheet.tsx` | **NEW FILE**                                   | Low    |
| 3   | `components/barcode-modal.tsx`         | Add optional props                             | Low    |
| 4   | `components/penny-list-card.tsx`       | Restructure + SKU/HD link + Line B             | Medium |
| 5   | `components/penny-list-client.tsx`     | Pass stateFilter + window label                | Low    |

### Steps 1-5 (in order)

1. `lib/penny-list-utils.ts`
   - Add `getLastSeenDate()` and `formatLineB()` helpers
   - Add `getWindowLabel(dateRange)` and `formatReportCount(count)` (abbrev as needed)
2. `components/state-breakdown-sheet.tsx`
   - New component (mobile: bottom sheet, desktop: modal)
   - Accept `windowLabel`, `stateCounts`, and `userState` props
3. `components/barcode-modal.tsx`
   - Add optional `productName`, `pennyPrice` props (display context)
4. `components/penny-list-card.tsx`
   - Add props: `stateFilter?: string`, `windowLabel: string`
   - Render Line 1 as `Brand · SKU 123456` (or `SKU 123456`)
   - Render Line B as state spread + report count + window label
   - Add Home Depot icon button (new tab, noopener) when URL exists
   - Implement safe navigation pattern (no nested interactive elements)
5. `components/penny-list-client.tsx`
   - Pass `stateFilter` and `windowLabel` to cards and state sheet

---

## 8. REGRESSION GUARD PLAN

### Risks & Mitigations

| Risk                               | Mitigation                                      |
| ---------------------------------- | ----------------------------------------------- |
| Card layout breaks on missing data | Always render 2 pattern lines with placeholders |
| Touch targets too small            | Verify ≥36px icons, ≥44px buttons               |
| State sheet doesn't open           | Test stopPropagation on mobile                  |
| Dark mode broken                   | Only use existing CSS variables                 |
| Window mismatch (card vs sheet)    | Derive window label once and pass to both       |
| Report count missing               | Default to 0 in Line B; never omit count        |

### Prevention Checklist

- [ ] No new CSS variables added
- [ ] No raw Tailwind colors (`npm run lint:colors`)
- [ ] "use client" preserved on interactive components
- [ ] Pattern signals always render exactly 2 lines
- [ ] Line B includes state spread + report count + window label
- [ ] SKU visible on Line 1 (brand + SKU or SKU only)
- [ ] Home Depot button only when URL exists; uses noopener

---

## 9. VERIFICATION PLAN

| #   | Criterion                   | Verification                                                                                                                                               |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 1-second scan               | Screenshot: item, $0.01, retail, last seen, state spread visible                                                                                           |
| 2   | No trust bar                | Visual: zero icon rows, zero pill rows                                                                                                                     |
| 3   | Report labeled              | Mobile 375px: "Report" text visible                                                                                                                        |
| 4   | Pattern = 2 lines           | Visual: always exactly 2 lines, never fewer, never more                                                                                                    |
| 5   | No broken layouts           | Test with null fields - must still show 2 pattern lines                                                                                                    |
| 6   | Barcode scannable           | Phone camera test                                                                                                                                          |
| 7   | State tap → sheet           | Playwright: opens sheet, no navigation                                                                                                                     |
| 8   | Grayscale readable          | Desaturated screenshot                                                                                                                                     |
| 9   | No new colors               | `npm run lint:colors` = 0                                                                                                                                  |
| 10  | Card navigates              | Playwright: body click → detail page                                                                                                                       |
| 11  | SKU visible                 | Visual: "Brand · SKU 123456" or "SKU 123456"; model omitted                                                                                                |
| 12  | State + count logic correct | Test: GA_count>0 → "GA + X states · Y reports (Wd)"; GA_count=0 → "Seen in N states · Y reports (Wd)"; no data → "State data unavailable · Y reports (Wd)" |
| 13  | Desktop barcode = modal     | 1280px: modal not sheet                                                                                                                                    |
| 14  | Desktop tooltips            | Hover test (Save/Barcode/Home Depot)                                                                                                                       |
| 15  | HD link on card             | Visual: Home Depot icon appears when URL exists                                                                                                            |
| 16  | No status pill              | Visual: status pill not on card face                                                                                                                       |
| 17  | State sheet window aligned  | Sheet shows counts for active window (default 30d), sorted desc, userState pinned top                                                                      |

---

### Required Proof Outputs (LOCKED)

- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:e2e`

### Proof Artifacts Checklist

- Screenshots: mobile + desktop, light + dark
- Screenshot before/after for card changes
- Browser console: no errors
- Store outputs in `reports/verification/<timestamp>/` and `reports/proof/<timestamp>/` (record paths in SESSION_LOG.md)

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
