# Card UX Trust Refinements — Architecture Plan

**Created:** 2026-02-20
**Status:** Awaiting approval
**Philosophy:** Clarity builds trust. Trust compounds. We do not monetize friction.

---

## Goal

Improve the clarity, affordance, and continuity of three penny list interaction patterns — without competing with the primary "Report Find" CTA or introducing visual noise.

## Done Means (Testable)

1. Card secondary icons (HD link, barcode, bookmark) each have a visible micro-label on all viewports
2. SKU detail page "View on Home Depot" button has a subtle background tint distinguishing it from card surface
3. Returning from `/sku/[sku]` to `/penny-list` restores the user's previous scroll position
4. All four quality gates pass (lint, typecheck, unit, build)
5. Smoke e2e passes
6. No regressions to "Report Find" visibility or prominence

---

## Design Principles (Locked from /plan)

- **Clarity without competition** — micro-labels exist to reduce confusion, not to encourage outbound clicks
- **Primary > Secondary > Tertiary** — Report Find stays dominant; HD verify is secondary; barcode/bookmark are tertiary
- **No friction monetization** — scroll restore prioritizes user continuity over re-scroll ad impressions
- **Trust > extraction** — the HD link is for product identity verification, not penny price validation

---

## Change 1: Card Icon Micro-Labels

**File:** `components/penny-list-card.tsx`

### Current State

The secondary icon row (line ~278) renders three bare icons in a centered `flex` row:

- `ExternalLink` (5×5) — Home Depot link
- `Barcode` (5×5) — UPC barcode modal trigger (conditional on `hasUpc`)
- `AddToListButton` — bookmark icon

All are `text-[var(--text-muted)]` with no visible text. Users cannot identify function without tapping.

### Proposed Change

Convert each icon-only element into a small vertical stack: icon on top, micro-label beneath.

**Label specs:**

- Font: `text-[10px]` (matches existing disclaimer text size used elsewhere)
- Weight: `font-normal` (NOT semibold — must not draw attention)
- Color: `var(--text-muted)` (same as the icon — visually subordinate)
- Labels: "HD" for Home Depot, "Barcode" for barcode, "Save" for bookmark
- Alignment: `flex flex-col items-center` per icon group
- The outer row stays `flex justify-center gap-2.5` — no layout change

**Why these label names:**

- "HD" — 2 characters, universally understood in this community, doesn't say "Home Depot" (subtle)
- "Barcode" — self-explanatory, matches the icon meaning
- "Save" — shorter than "Bookmark", clearer intent

**What NOT to do:**

- No tooltips (fail on mobile)
- No color differentiation between labels (all equally subordinate)
- No increased icon size (stays 5×5)

### Risk: Low

- Text-only addition beneath existing icons
- No layout structure change — just adding a `<span>` below each icon
- No CSS token changes needed
- `AddToListButton` takes `variant="icon"` — may need a small wrapper div for the label beneath it

---

## Change 2: SKU Page Button Affordance

**File:** `app/sku/[sku]/page.tsx`

### Current State

The "View on Home Depot" button (line ~527-537) uses `btn-secondary` class directly:

```
className="btn-secondary w-full flex items-center justify-center gap-2 min-h-[44px] py-3 rounded-xl font-semibold text-sm"
```

`btn-secondary` in `globals.css` provides no background color — it's transparent with border transitions on hover. On the card surface (`var(--bg-card)`), it can feel like plain text rather than an interactive element, especially in dark mode.

### Proposed Change

Add a subtle background tint using an **existing design token** — `var(--bg-recessed)` — as an inline Tailwind class on the button. This gives it just enough fill to read as "clickable surface" without approaching primary CTA weight.

**Specific change:** Add `bg-[var(--bg-recessed)]` to the button's className.

This uses:

- Light mode: `#f0f0ef` — a very subtle warm gray lift
- Dark mode: `#1a1a1a` (or whatever `--bg-recessed` resolves to in dark) — slight lift from card surface

**Why `--bg-recessed` and not `--bg-subtle` or `--bg-hover`:**

- `--bg-recessed` is designed for surface differentiation — it says "this is a distinct interactive surface"
- `--bg-subtle` is lighter (used for badges/hints) — too close to card background
- `--bg-hover` should only appear on hover state, not resting state

**What NOT to do:**

- No changes to `globals.css` or the `btn-secondary` class definition
- No color changes — the text stays `var(--text-primary)`
- No size or padding changes
- No changes to the "Report this find" button (it's already correct)

### Risk: Very Low

- Single className addition on one element
- Uses existing design token
- No cascade risk (inline class, not global)
- Visual verification needed (light + dark mode screenshots)

---

## Change 3: Scroll Position Restoration

**Files:**

- `components/penny-list-client.tsx` — save scroll position before navigation, restore on mount
- `components/penny-list-card.tsx` — save scroll position in the `openSkuPage` handler

### Current State

- Cards navigate via `router.push(skuPageUrl)` — client-side push
- "← Back to Browse" on SKU page is a hardcoded `<Link href="/penny-list">`
- No scroll position is saved anywhere
- Browser bfcache is unreliable in Next.js App Router
- Users lose their place every time they view a SKU and return

### Proposed Approach

**Save on exit, restore on mount — using `sessionStorage`.**

**Step A: Save scroll position before navigating to SKU page**

In `penny-list-card.tsx`, modify `openSkuPage`:

```
Before router.push(), save window.scrollY to sessionStorage key "penny-list-scroll"
```

Also save in `penny-list-table.tsx` if table view has the same `openSkuPage` pattern (it does).

**Step B: Restore scroll position on penny list mount**

In `penny-list-client.tsx`, add a `useEffect` that:

1. Checks `sessionStorage` for `"penny-list-scroll"`
2. If found, waits for a single `requestAnimationFrame` (ensures layout is painted)
3. Calls `window.scrollTo({ top: savedPosition, behavior: 'instant' })` — NOT 'smooth', to avoid jarring animation
4. Removes the key from sessionStorage (one-time restore, not persistent)

**Step C: Clear scroll position on filter/sort/page changes**

The existing `router.replace(url, { scroll: false })` calls in `penny-list-client.tsx` handle filter changes. When the user explicitly changes page, sort, or filter, we should clear the saved scroll position so they don't jump back to a stale position.

In the pagination handlers (the `window.scrollTo({ top: 0 })` calls at lines ~982, ~997), also clear `sessionStorage.removeItem("penny-list-scroll")`.

**Why `sessionStorage` (not `localStorage`):**

- Session-scoped — cleared when tab closes. No stale data across sessions.
- No serialization complexity — just a number.
- No dependency added — browser-native API.

**Why `behavior: 'instant'` (not `'smooth'`):**

- Smooth scroll on restore would show the user whipping past content — jarring and confusing
- Instant puts them right back where they were, which is the expected behavior
- Ads still initialize normally (they load based on viewport intersection, not scroll events)

**What about ads/analytics concerns:**

- Ads: Modern ad libs (AdSense, Monumetric, etc.) use Intersection Observer. Scroll restoration doesn't prevent ad initialization — ads above the fold will load on page mount regardless, and below-fold ads load when scrolled into view. No impact.
- Analytics: `pageview` fires on route mount, before scroll restore. No impact.
- Layout shift: Content renders at the top first, then instantly jumps. The jump is invisible if it happens within the same paint frame (requestAnimationFrame). If there's a perceptible flash, we can add a brief opacity transition, but this is unlikely.

### Risk: Low-Medium

- **Low risk:** sessionStorage read/write is trivial and scoped
- **Medium consideration:** If the penny list content has changed between departure and return (e.g., data revalidated), the saved scroll position might land on a slightly different item. This is acceptable — the position is approximate, and "close enough" is far better than "back to top."
- **Edge case:** If the user navigates to `/penny-list` from somewhere other than a SKU page (e.g., nav menu), there shouldn't be a saved scroll position to restore (sessionStorage key won't exist). Safe.
- **Edge case:** If the user has JS disabled, `sessionStorage` calls silently fail. No harm.

---

## Files to Modify (Complete List)

| File                               | Change                                                     | Risk       |
| ---------------------------------- | ---------------------------------------------------------- | ---------- |
| `components/penny-list-card.tsx`   | Add micro-labels to icon row + save scroll on SKU navigate | Low        |
| `components/penny-list-table.tsx`  | Save scroll on SKU navigate (if applicable)                | Low        |
| `app/sku/[sku]/page.tsx`           | Add `bg-[var(--bg-recessed)]` to HD button                 | Very Low   |
| `components/penny-list-client.tsx` | Restore scroll on mount + clear on pagination              | Low-Medium |

**Files NOT touched:**

- `app/globals.css` — no new tokens or class changes
- `components/ui/button.tsx` — no component API changes
- `components/store-map.tsx` — not involved
- No new files created
- No dependencies added

---

## Sequencing

1. **Change 2 first** (SKU page button) — isolated, single-line change, easy to verify
2. **Change 1 second** (micro-labels) — card component change, visual verification needed
3. **Change 3 last** (scroll restore) — behavioral change, needs functional testing

Each change is independently deployable. If any fails verification, the others still ship.

---

## Verification Plan

1. `npm run lint` — zero warnings
2. `npm run typecheck` — clean
3. `npm run test:unit` — all pass
4. `npm run build` — clean production build
5. `npm run e2e:smoke` — route navigation, penny list load, SKU page
6. **Visual proof (Playwright screenshots):**
   - Penny card icon row (light + dark, mobile + desktop) — labels visible, subordinate to Report Find
   - SKU detail page buttons (light + dark) — HD button has visible fill, Report Find still dominant
7. **Manual functional check:**
   - Browse penny list → click card → land on SKU page → click "← Back to Browse" → verify scroll restores to approximate prior position
   - Change filter/sort → verify scroll position clears
   - Open SKU page in new tab → navigate to penny list → verify NO scroll restore (no stale data)

---

## Rollback Plan

Each change is a small, isolated edit. Rollback = revert the specific lines. No database changes, no migration, no config changes. Git revert of the commit handles all three cleanly.

---

## Open Questions (0)

All decisions were locked during the /plan phase. No ambiguities remain.

---

## Decision Log

| Decision                                 | Rationale                                                     | Status |
| ---------------------------------------- | ------------------------------------------------------------- | ------ |
| Micro-labels over tooltips               | Tooltips fail on mobile; labels are always visible            | Locked |
| Label text: "HD" / "Barcode" / "Save"    | Minimal, community-familiar, non-promotional                  | Locked |
| `var(--bg-recessed)` for HD button fill  | Existing token, correct semantic meaning, sufficient contrast | Locked |
| `sessionStorage` for scroll position     | Session-scoped, no stale data, zero dependencies              | Locked |
| `behavior: 'instant'` for scroll restore | Smooth would be jarring; instant is invisible                 | Locked |
| Clear scroll on filter/sort/page change  | Prevents stale position after list state changes              | Locked |
| No changes to globals.css                | Constraint compliance, no cascade risk                        | Locked |
