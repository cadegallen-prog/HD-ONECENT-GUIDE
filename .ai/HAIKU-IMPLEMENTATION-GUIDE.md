# Penny Card Visual Overhaul - Haiku Implementation Guide

> **Purpose:** Step-by-step instructions for Claude Haiku to implement the penny card visual overhaul
> **Created:** 2026-01-26
> **Approved by:** Cade (via Claude Opus 4.5)

---

## HOW TO USE THIS GUIDE

Run each prompt below in a **fresh conversation** with Haiku. Complete one chunk, verify it works, then move to the next.

**Order matters.** Do not skip steps.

---

## PRE-FLIGHT CHECK

Before starting, run in terminal:

```bash
npm run build
```

If build fails, fix it first. Don't start this work on a broken build.

---

## CHUNK 1: Fix Color Tokens in globals.css

### Prompt for Haiku:

```
Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for full context.

Your task: Update color tokens in `app/globals.css` to fix contrast issues.

**Light mode changes (around lines 35-56):**

Find and update these values:
- `--bg-recessed` change from `#f5f5f4` to `#f0f0ef`
- `--border-default` change from `#e7e5e4` to `#d4d4d4`

**Dark mode:** Leave unchanged (already has good contrast).

**After editing:**
1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass
3. Take screenshots of /penny-list in light mode to verify visible contrast

**Do not change any other values.** Only these 2 tokens.
```

### Verification:

- [ ] Build passes
- [ ] Lint passes
- [ ] Screenshot shows cards have visible borders (not faint/invisible)

---

## CHUNK 2: Update shadcn Card Component

### Prompt for Haiku:

````
Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Update `components/ui/card.tsx` to use solid backgrounds instead of glass effects.

**Current code (around line 8-11):**
```tsx
className={cn(
  "bg-card border border-border rounded-2xl p-4",
  "shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(99,102,241,0.1)]",
  className
)}
````

**Change to:**

```tsx
className={cn(
  "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl",
  "shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
  className
)}
```

**Key changes:**

- Use explicit CSS variables `var(--bg-card)` and `var(--border-default)`
- Simpler shadow (no dark mode inset)
- Remove p-4 (let consumers control padding)

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass

```

### Verification:
- [ ] Build passes
- [ ] Lint passes

---

## CHUNK 3: Remove Glass-Card Effect

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Modify the `.glass-card` class in `app/globals.css` to remove blur/transparency.

**Find the .glass-card class (around lines 376-400).**

**Change from:**

```css
.glass-card {
  background: var(--bg-card);
  background: color-mix(in srgb, var(--bg-card) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--border-default) 70%, transparent);
  /* ... other properties */
}
```

**Change to:**

```css
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  transition:
    border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: var(--border-strong);
}
```

**Key changes:**

- Remove `color-mix` transparency
- Remove `backdrop-filter` blur
- Solid background and border
- Keep hover effect simple

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass
3. Take screenshot of /penny-list - cards should have solid backgrounds, no blur

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] Cards have solid backgrounds (no glass/blur effect)

---

## CHUNK 4: Simplify Thumbnail (Remove Border)

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Update `components/penny-thumbnail.tsx` to remove its border.

**Find the container div styling and remove any border classes.**

The thumbnail should have:

- Size: 64px or 72px (keep existing)
- Border radius: 12px (keep)
- Background: `var(--bg-recessed)` for empty state
- Border: NONE (remove)

**Look for classes like:**

- `border`
- `border-[var(--border-default)]`

Remove them. The thumbnail should only have `rounded-xl` (or `rounded-lg`) and background color.

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] Thumbnails have no visible border

---

## CHUNK 5: Refactor Penny List Card - Part A (Structure)

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for full context.

Your task: Refactor `components/penny-list-card.tsx` to use shadcn Card and remove nested borders. This is Part A - structural changes only.

**Step 1: Update imports**
Add at top:

```tsx
import { Card } from "@/components/ui/card"
```

**Step 2: Replace the outer wrapper**

Find (around line 131-137):

```tsx
<div
  role="link"
  tabIndex={0}
  onClick={openSkuPage}
  onKeyDown={handleKeyDown}
  className="rounded-2xl glass-card h-full flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
  ...
>
```

Replace with:

```tsx
<Card
  role="link"
  tabIndex={0}
  onClick={openSkuPage}
  onKeyDown={handleKeyDown}
  className="h-full flex flex-col cursor-pointer p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
  ...
>
```

**Step 3: Update closing tag**
Change the matching `</div>` to `</Card>`

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass
3. Visual check: cards should render (may look slightly different, that's expected)

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] Cards render without errors

---

## CHUNK 6: Refactor Penny List Card - Part B (Remove SKU Pill Border)

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Remove the border/background from the SKU pill in `components/penny-list-card.tsx`.

**Find the SKU button (around lines 169-193):**

Look for the `penny-card-sku` class or similar SKU display with borders.

**Change the SKU display to plain text format:**

The SKU line should display as: `BRAND · SKU 123-456-7890`

Remove any:

- `border` classes
- `bg-[var(--bg-recessed)]` or similar background classes
- `rounded-full` or `rounded-lg` classes

Keep:

- The copy functionality (onClick handler)
- The copy icon
- Font styling (monospace, size)

**The new styling should be:**

```tsx
className =
  "inline-flex items-center text-[12px] text-[var(--text-muted)] font-medium cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
```

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] SKU shows as plain text (no pill/border)
- [ ] Copy still works when clicked

---

## CHUNK 7: Refactor Penny List Card - Part C (Remove State Badge Borders)

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Remove borders from state badges in `components/penny-list-card.tsx`.

**Find the state badges (around lines 227-244):**

Look for:

```tsx
className =
  "inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-recessed)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]"
```

**Change to:**

```tsx
className = "text-[11px] font-semibold text-[var(--text-secondary)]"
```

**Key changes:**

- Remove `rounded-full`
- Remove `border border-[var(--border-default)]`
- Remove `bg-[var(--bg-recessed)]`
- Remove `px-2 py-0.5`
- Keep `inline-flex items-center` if needed for layout

The states should appear as plain text: `TX  CA  FL  NY  +8`

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] State codes show as plain text (no pills)

---

## CHUNK 8: Refactor Penny List Card - Part D (Simplify Secondary Buttons)

### Prompt for Haiku:

```

Read the file `.ai/PENNY-CARD-VISUAL-OVERHAUL.md` for context.

Your task: Simplify the secondary action buttons (HD, Barcode, Save) in `components/penny-list-card.tsx`.

**Find the secondary buttons (around lines 275-316):**

These buttons currently have borders and backgrounds. Change them to icon-only with hover state.

**For the Home Depot link (around line 276-292):**

Change from:

```tsx
className =
  "flex-1 flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[36px] px-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-xs font-semibold transition-colors hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] ..."
```

Change to:

```tsx
className =
  "flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] rounded-lg text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--bg-recessed)] ..."
```

**For the Barcode button (around line 294-306):**
Apply same pattern - remove border/bg, add hover:bg-recessed

**Key changes for ALL secondary buttons:**

- Remove `border border-[var(--border-default)]`
- Remove `bg-[var(--bg-elevated)]`
- Add `hover:bg-[var(--bg-recessed)]`
- Keep 44px min touch target
- Keep the text labels on larger screens if they exist

**After editing:**

1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass

```

### Verification:
- [ ] Build passes
- [ ] Lint passes
- [ ] Secondary buttons are icon-focused (no visible borders until hover)

---

## CHUNK 9: Final Verification

### Prompt for Haiku:

```

Final verification of the penny card visual overhaul.

**Run all checks:**

```bash
npm run lint
npm run build
```

**Take screenshots using Playwright MCP:**

1. Navigate to http://localhost:3001/penny-list
2. Screenshot mobile viewport (375px) - light mode
3. Screenshot mobile viewport (375px) - dark mode
4. Screenshot desktop viewport (1280px) - light mode
5. Screenshot desktop viewport (1280px) - dark mode

**Verify against acceptance criteria:**

1. Only the card has a border (count = 1 bordered element per card)
2. No glass/blur effects visible
3. Report count visible on every card ("X reports")
4. State info visible ("X states" or state codes)
5. Recency visible ("Last seen: X")
6. Visual hierarchy clear in grayscale
7. Dark mode has no regressions
8. Report Find button is the only colored (cta-primary) element

**Report any issues found.**

```

### Verification:
- [ ] All 8 acceptance criteria pass
- [ ] Screenshots captured
- [ ] No console errors

---

## TROUBLESHOOTING

### If build fails:
- Check for syntax errors in the file you just edited
- Make sure all JSX tags are properly closed
- Check import statements

### If cards look broken:
- Verify Card component import is correct
- Check that className props are properly formatted
- Verify CSS variable names are spelled correctly

### If dark mode looks wrong:
- Dark mode tokens weren't changed - check you only modified light mode values
- Verify --bg-card and --bg-recessed are using CSS variables not hardcoded colors

---

## POST-IMPLEMENTATION

After all chunks complete:

1. Update `.ai/STATE.md` with completion status
2. Update `.ai/SESSION_LOG.md` with what was done
3. Commit with message: "refactor(penny-card): visual overhaul - remove glass, fix contrast, simplify borders"

---

## REFERENCE FILES

- Full spec: `.ai/PENNY-CARD-VISUAL-OVERHAUL.md`
- Constraints: `.ai/CONSTRAINTS.md`
- Color tokens: `app/globals.css`
- Card component: `components/ui/card.tsx`
- Penny card: `components/penny-list-card.tsx`
- Thumbnail: `components/penny-thumbnail.tsx`
```
