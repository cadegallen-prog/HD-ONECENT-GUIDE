# Responsive Foundations Spec

**Status:** PLANNING (awaiting /architect)
**Track:** Track 1 - Responsive/fluid foundations (no content changes)
**Created:** 2026-03-05
**Source:** Owner feedback + responsive audit

---

## Problem Statement

The site's content renders correctly on desktop but cramps, squishes, and fails to reflow on mobile devices and narrow browser windows. This is not device-specific -- it's a systemic lack of mobile-first fluid design: fixed typography sizes, missing viewport-height handling, and a table view that forces horizontal scrolling.

---

## Scope (Track 1 ONLY)

IN SCOPE:

- Fluid typography utilities in globals.css
- Replace `min-h-screen` with `min-h-dvh` sitewide
- Overflow-x protection at body level
- Responsive typography scaling on all page headings + body text
- Penny list table view: reduce min-width, consider responsive column hiding
- Card internal spacing at very narrow viewports (320px)
- Homepage typography + spacing scaling
- Report-find typography + spacing scaling

OUT OF SCOPE (Track 2 - future UX redesign):

- Guide hierarchy / content consolidation
- Link styling overhaul
- Information architecture changes
- Homepage content direction
- Report-find credibility restructuring
- Navigation flow changes

---

## Locked Decisions

| #   | Decision                                                 | Rationale                                                                                                                                                                                 |
| --- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Card view remains default on all viewports               | Already the default; card grid is `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` which stacks properly on mobile                                                                             |
| D2  | Table view stays opt-in but gets responsive improvements | Table at 880px min-width is hostile; reduce to ~640px with column hiding on narrow screens                                                                                                |
| D3  | Use stepped responsive typography (not clamp)            | Breakpoint steps (`text-2xl sm:text-3xl lg:text-4xl`) are simpler, more predictable, easier to maintain than clamp(). Clamp reserved only for globals.css utility classes if needed later |
| D4  | Replace `min-h-screen` with `min-h-dvh` everywhere       | iOS Safari dynamic URL bar causes content overflow with `min-h-screen`. `dvh` handles this. Fallback: `min-h-screen` for older browsers via `@supports`                                   |
| D5  | Add `overflow-x: hidden` on body as safety net           | Prevents any rogue element from creating horizontal scroll. Individual components can override with `overflow-x-auto` where needed (e.g., tables)                                         |
| D6  | No new breakpoints in Tailwind config                    | Default breakpoints (sm:640, md:768, lg:1024, xl:1280) are sufficient. No need for xs: breakpoint -- mobile-first base styles handle 320px+                                               |
| D7  | Penny list card grid stays at current breakpoints        | `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` is correct. No change needed to grid layout                                                                                                   |

---

## Concrete Spec

### Layer 1: globals.css Foundation Changes

**New utilities to add:**

```
.text-fluid-display  -- clamp(2rem, 5vw, 3.5rem) for hero headings
.text-fluid-heading  -- clamp(1.5rem, 4vw, 2.25rem) for section headings
.text-fluid-body     -- clamp(0.938rem, 2vw, 1.125rem) for body text
```

NOTE: These are OPTIONAL utilities. Primary approach is stepped responsive classes directly on elements. Fluid classes exist for components that need smooth scaling (e.g., hero text).

**Body-level overflow protection:**

```css
body {
  overflow-x: hidden;
}
```

**dvh utility class (with fallback):**

```css
.min-h-viewport {
  min-height: 100vh; /* fallback */
  min-height: 100dvh;
}
```

### Layer 2: min-h-screen Replacement (22 instances across 10 files)

Every `min-h-screen` becomes `min-h-dvh` (Tailwind v4 supports this natively via `min-h-dvh`). If Tailwind version doesn't support it, use the `.min-h-viewport` utility class from Layer 1.

**Files affected:**

- `app/layout.tsx` (1 instance)
- `app/penny-list/page.tsx` (1)
- `app/report-find/page.tsx` (1)
- `app/store-finder/page.tsx` (1)
- `app/sku/[sku]/page.tsx` (1)
- `app/login/page.tsx` (2)
- `app/lists/page.tsx` (4)
- `app/lists/[id]/page.tsx` (2)
- `app/admin/dashboard/page.tsx` (4)
- `app/s/[token]/page.tsx` (3)
- `app/unsubscribed/page.tsx` (1)

### Layer 3: Penny List Page (`/penny-list`)

#### 3a. Page header typography (app/penny-list/page.tsx)

| Element          | Current                | Target                                                    |
| ---------------- | ---------------------- | --------------------------------------------------------- |
| H1               | `text-3xl sm:text-4xl` | `text-2xl sm:text-3xl lg:text-4xl` (scale down on mobile) |
| Subtitle p       | `text-lg` (fixed)      | `text-base sm:text-lg`                                    |
| Disclaimer p     | `text-sm` (fixed)      | No change (already small enough)                          |
| H2 (methodology) | `text-2xl` (fixed)     | `text-xl sm:text-2xl`                                     |

#### 3b. Table view responsive improvement (components/penny-list-table.tsx)

Current: `min-w-[880px]` forces horizontal scroll.

Target: Reduce minimum width and hide least-critical column on narrow screens.

| Change                       | Detail                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| Remove `min-w-[880px]`       | Replace with `min-w-[640px]`                                 |
| Hide "Photo" column below lg | Add `hidden lg:table-cell` to photo column header + cells    |
| Adjust column widths         | Without photo: Item 45%, Price 15%, Reports 25%, Actions 15% |
| Keep scroll hint             | Already exists (`lg:hidden` scroll hint div)                 |

This gives tablet users (768px+) a usable table without scrolling. Phone users still scroll but see fewer columns.

#### 3c. Card internal spacing (components/penny-list-card.tsx)

| Element              | Current           | Target                                                                                                                 |
| -------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Card padding         | `p-4`             | No change (1rem is fine for mobile)                                                                                    |
| Thumbnail            | `size={72}` fixed | `size={56}` on base, `size={72}` via responsive class (or keep 72 -- 72px is fine even on 320px with flex-1 text area) |
| Brand text max-width | `max-w-[70%]`     | No change                                                                                                              |
| State chips          | `max-w-[70%]`     | No change                                                                                                              |

DECISION: Card internals are already well-structured. Only change if 320px viewport testing reveals actual cramming. No preemptive changes.

### Layer 4: Homepage (`/`)

| Element       | Current                | Target                                    |
| ------------- | ---------------------- | ----------------------------------------- |
| Section label | `text-sm`              | No change                                 |
| H2            | `text-3xl` (fixed)     | `text-2xl sm:text-3xl lg:text-4xl`        |
| Body text     | `text-base` (fixed)    | No change (base is readable at all sizes) |
| H3 (cards)    | `text-xl` (fixed)      | `text-lg sm:text-xl`                      |
| Card body     | `text-sm sm:text-base` | Already responsive -- no change           |
| Card padding  | `p-6 sm:p-8`           | Already responsive -- no change           |

### Layer 5: Report-Find (`/report-find`)

| Element        | Current                | Target                                                 |
| -------------- | ---------------------- | ------------------------------------------------------ |
| H1             | `text-3xl sm:text-4xl` | `text-2xl sm:text-3xl lg:text-4xl` (scale down mobile) |
| Body           | `text-lg` (fixed)      | `text-base sm:text-lg`                                 |
| Info grid      | `gap-3 sm:grid-cols-3` | No change (already responsive)                         |
| Info card text | `text-sm`              | No change                                              |

### Layer 6: Guide + FAQ (minor polish)

These pages already use `PageShell` with good responsive patterns. Changes:

- Verify `min-h-screen` replacement applies
- No typography changes needed (guide already uses `text-3xl md:text-5xl`)

### Layer 7: Navbar + Footer (no changes expected)

Already responsive. Navbar has proper mobile menu breakpoint. Footer stacks correctly. No changes unless testing reveals issues.

---

## Acceptance Checklist

| #   | Criterion                                             | How to Verify                                                                      |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| AC1 | No horizontal scroll on any page at 320px viewport    | Playwright screenshot at 320px width for all routes, check no horizontal scrollbar |
| AC2 | Penny list table view usable without scroll at 768px+ | Open /penny-list?view=table at 768px, all visible columns fit                      |
| AC3 | All headings scale down on mobile (no cramped text)   | Visual check at 375px: headings don't wrap more than 2 lines                       |
| AC4 | No `min-h-screen` remains in codebase                 | `grep -r "min-h-screen"` returns 0 results in app/ and components/                 |
| AC5 | iOS Safari URL bar doesn't cause overflow             | Test on real device or Playwright mobile emulation                                 |
| AC6 | `overflow-x: hidden` on body                          | Inspect body element in devtools                                                   |
| AC7 | All existing tests pass                               | `npm run verify:fast` passes                                                       |
| AC8 | Smoke e2e passes                                      | `npm run e2e:smoke` passes                                                         |
| AC9 | No visual regression on desktop (1280px+)             | Playwright screenshots at 1280px match baseline                                    |

---

## Structural Ambiguity Register

| #   | Ambiguity                                                                   | Resolution                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SA1 | Does Tailwind v4 support `min-h-dvh` natively?                              | RESOLVED: Check `tailwind.config.ts` during implementation. If supported, use directly. If not, use the `.min-h-viewport` CSS class with fallback.                                     |
| SA2 | Should card thumbnail shrink on very narrow viewports?                      | RESOLVED: No. 72px thumbnail + flex-1 text area fits fine at 320px (72 + 16 padding + ~216px text = 320px). Only change if testing proves otherwise.                                   |
| SA3 | What happens to table view at exactly 640-768px?                            | RESOLVED: Photo column hidden below lg (1024px). At 640-768px: 4 columns (Item, Price, Reports, Actions) fit within 640px min-width. Horizontal scroll only below 640px.               |
| SA4 | Does `overflow-x: hidden` on body break any existing scrollable containers? | RESOLVED: No. Scrollable containers use `overflow-x-auto` on their own wrapper divs, which creates a new formatting context. Body overflow doesn't affect them.                        |
| SA5 | Are clamp() fluid type utilities actually needed?                           | RESOLVED: Added as optional utilities but NOT the primary approach. Primary approach is stepped breakpoint classes. Fluid utilities exist for future use if smooth scaling is desired. |

ALL AMBIGUITIES RESOLVED.

---

## Rollout Order

1. globals.css (foundation: fluid type utilities, overflow-x, dvh class)
2. Sitewide min-h-screen -> min-h-dvh replacement (mechanical, all 10 files)
3. /penny-list page header typography
4. /penny-list table responsive improvements
5. Homepage typography scaling
6. Report-find typography scaling
7. Guide + FAQ verification pass
8. Full test suite (verify:fast + e2e:smoke)

Each step is independently deployable. No step depends on a later step.
