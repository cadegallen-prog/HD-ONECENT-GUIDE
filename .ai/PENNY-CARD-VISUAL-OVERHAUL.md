# Penny Card Visual Overhaul - Complete Spec for Haiku

> **Status:** Ready for implementation
> **Created:** 2026-01-26
> **Decision Authority:** Claude Opus 4.5 (delegated by Cade)
> **Implementer:** Claude Haiku

---

## EXECUTIVE SUMMARY

The penny cards have correct information architecture but broken visual design. This spec fixes the visual layer while preserving all core data.

**Root causes being fixed:**

1. Color tokens too similar (bg-elevated vs bg-recessed imperceptible)
2. Too many bordered containers (8+ per card)
3. Glass-card blur compounds contrast issues
4. No visual hierarchy (everything "medium importance")

**What stays the same:**

- All information: image, title, brand, SKU, price, retail, recency, state distribution, report counts
- Card-to-SKU-page navigation
- All action buttons (Report, HD, Barcode, Save)
- Mobile-first responsive design

---

## 1. COLOR TOKEN FIXES (globals.css)

### Light Mode - Increase Contrast Between Surfaces

```css
/* BEFORE (imperceptible differences) */
--bg-page: #ffffff;
--bg-elevated: #fafaf9; /* 0.4% darker - invisible */
--bg-recessed: #f5f5f4; /* 1.5% darker - barely visible */

/* AFTER (visible differences) */
--bg-page: #ffffff;
--bg-elevated: #fafafa; /* Keep similar - this is card background */
--bg-recessed: #f0f0ef; /* NOW VISIBLE - 6% darker */
```

### Dark Mode - Verify Contrast

Dark mode tokens are already better separated. Verify these work:

```css
--bg-page: #121212;
--bg-card: #1e1e1e; /* 8% lighter - visible */
--bg-elevated: #2a2a2a; /* 16% lighter - visible */
--bg-recessed: #1a1a1a; /* 4% darker - visible */
```

### Border Tokens - Make Borders Visible

```css
/* Light mode */
--border-default: #d4d4d4; /* Was #e7e5e4 - now darker, visible */
--border-strong: #a3a3a3; /* Was #d6d3d1 - now clearly stronger */
```

---

## 2. CARD CONTAINER - KILL GLASS-CARD

### Current (broken)

```css
.glass-card {
  background: color-mix(in srgb, var(--bg-card) 82%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--border-default) 70%, transparent);
}
```

### New Approach

```css
.penny-card {
  background: var(--bg-card); /* Solid, no transparency */
  border: 1px solid var(--border-default);
  border-radius: 16px;
  /* NO backdrop-filter, NO transparency */
}
```

**Decision:** Cards use solid backgrounds. Glass effects removed. This alone fixes 50% of the visual mud.

---

## 3. NESTED CONTAINERS - BORDERS REMOVED

### Current Problem

Every element has its own border + background:

- Card border ✓ (keep this one)
- Thumbnail border ✗
- SKU pill border ✗
- State badges border ✗ (×4)
- Action buttons border ✗

### New Rule: ONE BORDERED SURFACE PER CARD

Only the card itself has a border. Everything inside uses:

- **Typography hierarchy** (size, weight, color)
- **Background color** (for buttons only, not pills/badges)
- **Spacing** (whitespace separates regions)

---

## 4. COMPONENT-BY-COMPONENT SPEC

### 4.1 Card Container

| Property      | Value                                           |
| ------------- | ----------------------------------------------- |
| Background    | `var(--bg-card)` solid                          |
| Border        | `1px solid var(--border-default)`               |
| Border radius | 16px                                            |
| Padding       | 16px                                            |
| Shadow        | `0 1px 3px rgba(0,0,0,0.08)` (subtle, not blur) |

**Use shadcn Card component** as base, override glass-card styles.

### 4.2 Thumbnail

| Property      | Value                                               |
| ------------- | --------------------------------------------------- |
| Size          | 72×72px fixed                                       |
| Border radius | 12px                                                |
| Border        | NONE (remove)                                       |
| Background    | `var(--bg-recessed)` (visible difference from card) |
| Object fit    | contain                                             |

### 4.3 Brand + SKU Line

**UPDATED 2026-01-27: Single line with interpunct DOES NOT WORK due to horizontal space constraints.**

**Current implementation (CORRECT):**

- Brand: Separate line, uppercase, 12px, muted, **max-w-[70%]** to prevent overlap with "today" indicator
- SKU: Separate line below title, copyable button, monospace font
- Both vertically stacked (not inline)

**Critical fix applied:** Added `max-w-[70%]` to brand to prevent overlap with window label ("today") in top-right corner.

| Property          | Value                        |
| ----------------- | ---------------------------- |
| Brand font size   | 12px (text-xs)               |
| Brand font weight | 500 (medium)                 |
| Brand color       | `var(--text-muted)`          |
| Brand max-width   | **70%** (prevents overlap)   |
| SKU placement     | Below title, copyable button |
| SKU font          | Monospace, 13px              |

### 4.4 Title

| Property    | Value                 |
| ----------- | --------------------- |
| Font size   | 15px                  |
| Font weight | 600                   |
| Color       | `var(--text-primary)` |
| Line clamp  | 2 lines               |
| Line height | 1.4                   |

### 4.5 Price Block

| Property     | Value                                                |
| ------------ | ---------------------------------------------------- |
| Penny price  | 24px, 700 weight, `var(--text-primary)`              |
| Retail price | 13px, 400 weight, `var(--text-muted)`, strikethrough |
| Layout       | Inline with gap-2                                    |

### 4.6 Pattern Signals (THE CORE DATA)

**Always exactly 2 lines. Text only. No pills. No icons.**

| Line   | Content                  | Style                         |
| ------ | ------------------------ | ----------------------------- |
| Line A | `Last seen: 3 days ago`  | 12px, `var(--text-secondary)` |
| Line B | `47 reports · 12 states` | 12px, `var(--text-secondary)` |

If user has state filter AND their state has reports:

- Line B: `47 reports · TX + 11 states`

If no location data:

- Line B: `47 reports · State data unavailable`

**Report count is ALWAYS shown.** This is the core value prop.

### 4.7 State Chips (When Shown)

**Decision: Show state chips, but as TEXT not bordered pills.**

| Property   | Value                                              |
| ---------- | -------------------------------------------------- |
| Format     | `TX  CA  FL  NY  +8` (space-separated, no borders) |
| Font       | 11px, 600 weight, `var(--text-secondary)`          |
| Background | NONE                                               |
| Border     | NONE                                               |

The states are still visible and tappable (opens breakdown sheet), but they don't add visual noise.

### 4.8 Action Buttons

**Primary action (Report Find):**
| Property | Value |
|----------|-------|
| Width | Full width |
| Height | 44px min |
| Background | `var(--cta-primary)` |
| Text | White, 14px, 600 weight |
| Border radius | 10px |

**Secondary actions (HD, Barcode, Save):**
| Property | Value |
|----------|-------|
| Size | 44×44px (touch target) |
| Background | `var(--bg-recessed)` on hover only, transparent default |
| Border | NONE |
| Icons | 20px, `var(--text-muted)` |

**Removing borders from secondary buttons.** They're icon-only with hover state.

---

## 5. VISUAL HIERARCHY (THE FIX)

### Current: Everything = Medium

- 8 bordered containers
- All similar background colors
- No clear primary/secondary/tertiary

### New: Clear Levels

| Level         | Elements                                   | Treatment                                   |
| ------------- | ------------------------------------------ | ------------------------------------------- |
| **Primary**   | Title, Penny Price                         | Largest, boldest, `--text-primary`          |
| **Secondary** | Brand+SKU, Retail, Pattern Signals, States | Medium, `--text-secondary`                  |
| **Tertiary**  | Action icons (not Report)                  | Smallest, `--text-muted`, no bg until hover |
| **Accent**    | Report Find button                         | Only colored element on card                |

**One accent color per card.** The Report Find button is the ONLY thing with `--cta-primary` background.

---

## 6. SHADCN CONSOLIDATION

### Use These Components

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
```

### Don't Use (Remove)

- Custom `glass-card` class
- Inline border/background on state badges
- Inline border/background on SKU pill

### Update shadcn Card Component

Edit `components/ui/card.tsx`:

```tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl",
        "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        // NO glass effects, NO backdrop-filter
        className
      )}
      {...props}
    />
  )
)
```

---

## 7. IMPLEMENTATION CHECKLIST FOR HAIKU

### Step 1: globals.css Token Updates

- [x] Update `--bg-recessed` to `#f0f0ef` (light mode) **DONE**
- [x] Update `--border-default` to `#d4d4d4` (light mode) **DONE**
- [x] Verify dark mode tokens are unchanged (already good) **DONE**

### Step 2: Remove glass-card

- [x] `.glass-card` already solid (no backdrop-filter) **VERIFIED**
- [ ] **REMAINING:** Remove `glass-card` class from penny-list-card.tsx, replace with inline styles

### Step 3: Update shadcn Card

- [ ] **SKIPPED** (not worth the refactor - glass-card works fine)

### Step 4: Refactor penny-list-card.tsx

- [x] ~~Use shadcn `Card` as wrapper~~ **SKIPPED** (glass-card already solid, not worth the refactor)
- [x] Remove borders from thumbnail container **DONE**
- [x] Remove borders from SKU display (make it plain text) **DONE**
- [x] Remove borders from state badges (make them plain text) **DONE**
- [x] Remove borders from secondary action buttons (icon-only) **DONE**
- [x] Keep Report Find as full-width primary button with bg **DONE**
- [ ] **NEW:** Add `max-w-[70%]` to brand to prevent overlap with window label

### Step 5: Verify

- [ ] Screenshot light mode - clear visual hierarchy
- [ ] Screenshot dark mode - no regressions
- [ ] WCAG contrast check on all text
- [ ] `npm run lint && npm run build`

---

## 8. BEFORE/AFTER MENTAL MODEL

### BEFORE (Current)

```
┌─ Card ──────────────────────────────────┐
│ ┌─ Thumb ─┐  Brand                      │
│ │ border  │  Title                      │
│ └─────────┘  ┌─ SKU pill ─┐             │
│              │  border    │             │
│              └────────────┘             │
│                                         │
│ $0.01  ~~$49.99~~                       │
│                                         │
│ ┌─ State ─┐ ┌─ State ─┐ ┌─ State ─┐     │
│ │ border  │ │ border  │ │ border  │ +5  │
│ └─────────┘ └─────────┘ └─────────┘     │
│                                         │
│ ┌─ Report btn ─┐ ┌─ HD ─┐ ┌─ BC ─┐      │
│ │   border     │ │border│ │border│      │
│ └──────────────┘ └──────┘ └──────┘      │
└─────────────────────────────────────────┘

= 9 bordered containers = visual chaos
```

### AFTER (This Spec)

```
┌─ Card (only border) ────────────────────┐
│                                         │
│  [Thumb]   BRAND · SKU 123-456-7890     │
│  no border Title of the Product Here    │
│            Max two lines with clamp     │
│                                         │
│  $0.01  was $49.99                      │
│                                         │
│  Last seen: 3 days ago                  │
│  47 reports · TX + 11 states            │
│                                         │
│  ████████ Report Find ████████          │
│                                         │
│  [HD]  [Barcode]  [Save]   ← icons only │
│                                         │
└─────────────────────────────────────────┘

= 1 bordered container = visual clarity
```

---

## 9. WHAT THIS PRESERVES

| Data Point         | Status  | Why                                    |
| ------------------ | ------- | -------------------------------------- |
| Report count       | ✅ KEPT | Core value prop - community validation |
| State distribution | ✅ KEPT | Core value prop - geographic spread    |
| Recency            | ✅ KEPT | Core value prop - freshness signal     |
| SKU                | ✅ KEPT | In-store lookup essential              |
| All actions        | ✅ KEPT | Report, HD, Barcode, Save all remain   |
| Card → SKU page    | ✅ KEPT | Navigation preserved                   |

**Nothing is removed.** The information architecture from the existing plan is preserved. Only the visual presentation changes.

---

## 10. ACCEPTANCE CRITERIA

| #   | Criterion              | Test                             |
| --- | ---------------------- | -------------------------------- |
| 1   | Only card has border   | Count bordered elements = 1      |
| 2   | No glass/blur effects  | Inspect CSS - no backdrop-filter |
| 3   | Report count visible   | "47 reports" shown on every card |
| 4   | State info visible     | "12 states" or "TX + 11" shown   |
| 5   | Recency visible        | "Last seen: X" shown             |
| 6   | Visual hierarchy clear | Grayscale screenshot readable    |
| 7   | WCAG AA contrast       | All text ≥4.5:1 ratio            |
| 8   | Dark mode works        | No regressions                   |
| 9   | Build passes           | `npm run build` = 0 errors       |
| 10  | Report Find prominent  | Only element with cta-primary bg |

---

## 11. FILES TO MODIFY

| File                             | Change                                 | Risk                  |
| -------------------------------- | -------------------------------------- | --------------------- |
| `app/globals.css`                | Update 2 color tokens                  | Low - targeted change |
| `components/ui/card.tsx`         | Remove glass, solid bg                 | Low                   |
| `components/penny-list-card.tsx` | Remove nested borders, use shadcn Card | Medium                |
| `components/penny-thumbnail.tsx` | Remove border                          | Low                   |

---

## 12. DO NOT CHANGE

- Information shown (reports, states, recency, SKU)
- Action buttons (all four remain)
- Navigation behavior (card tap → SKU page)
- Mobile responsiveness
- State breakdown sheet functionality

---

## DECISION LOG

| Decision                   | Rationale                               |
| -------------------------- | --------------------------------------- |
| Kill glass-card blur       | Root cause of visual mud                |
| Only card gets border      | Reduces 9 containers → 1                |
| States as text, not pills  | Reduces visual noise while keeping info |
| Report count always shown  | North Star says it's CORE               |
| shadcn Card as base        | Maintainability for AI coders           |
| Token fixes in globals.css | Approved by Cade for this work          |

---

---

## 13. CURRENT STATUS (2026-01-27)

### Completed in Previous Session ✅

- Thumbnail: 64x64, rounded-xl (12px)
- Title: 15px/600, 1.4 line-height
- Price block: 24px/700 penny, 13px/400 retail
- Pattern signals: 2-line text format
- State chips: Plain text, no borders
- Action buttons: 44px primary, icon-only secondary
- Color tokens: bg-recessed and border-default updated

### Remaining Tasks (80/20 Approach)

**80% Fix (Critical, Low Effort):**

1. Add `max-w-[70%]` to brand element (fixes overlap with "today" indicator)
2. Remove `glass-card` class, use inline styles (explicit > implicit)

**20% Polish (Optional, High Effort):**

- Fine-tune brand max-width percentage
- Add subtle backgrounds to pattern signals section
- Add divider lines between sections
- Perfect spacing adjustments

**Recommendation:** Complete the 80% fix now. Evaluate 20% polish only if needed after visual inspection.

---

**This spec is complete. Haiku can implement the 80% fix in <5 minutes.**
