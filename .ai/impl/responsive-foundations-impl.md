# Implementation Plan: Responsive Foundations

**Status:** AWAITING APPROVAL
**Spec:** `.ai/impl/responsive-foundations-spec.md`
**Created:** 2026-03-05

---

## Goal

Make the entire site render fluidly across all viewport widths (320px to 1920px+) by adding responsive typography scaling, replacing `min-h-screen` with dvh-aware utilities, protecting against horizontal overflow, and improving the penny list table view.

## Done Means

- AC1-AC9 from the spec all pass (see Acceptance Checklist in spec)
- `npm run verify:fast` passes
- `npm run e2e:smoke` passes
- Visual spot-check at 320px, 375px, 768px, and 1280px shows no cramming or overflow

---

## Constraints and Non-Negotiables

1. **globals.css is protected** (CONSTRAINTS.md Section 1). Adding utilities requires explicit rationale:
   - RATIONALE for `.min-h-viewport`: `min-h-screen` causes iOS Safari overflow. Tailwind v3.4 has no `min-h-dvh` utility. A CSS class with vh fallback + dvh override is the minimal fix.
   - RATIONALE for `overflow-x: hidden` on body: Prevents rogue horizontal scroll sitewide. Existing `overflow-x-auto` wrappers are unaffected (new formatting context).
   - RATIONALE for `.text-fluid-*` utilities: Optional utilities for future use. Not referenced by any component in this plan (primary approach is inline Tailwind breakpoint classes).
   - None of these modify existing variables, colors, typography scale, spacing tokens, or dark mode selectors.
2. **No Tailwind config changes** (D6 from spec). Tailwind v3.4 stays as-is.
3. **No content changes** (Track 1 scope). Only CSS classes and responsive utilities change.
4. **No raw Tailwind colors** (Rule #2).
5. **Store map not touched** (fragile area).
6. **Port 3001 policy** (Rule #1): Use existing dev server if running.

---

## Files to Modify

### Phase 1: Foundation (globals.css)

| File              | Action                                                                    | Risk                                          | Lines Affected |
| ----------------- | ------------------------------------------------------------------------- | --------------------------------------------- | -------------- |
| `app/globals.css` | ADD 3 utility blocks after existing section-padding utilities (~line 918) | LOW - additive only, no existing code changed | +20 lines      |

**What gets added (after `.section-padding-sm`):**

Block 1: `.min-h-viewport` class (vh fallback + dvh override)
Block 2: `body { overflow-x: hidden; }` rule in @layer base
Block 3: `.text-fluid-display`, `.text-fluid-heading`, `.text-fluid-body` (optional clamp utilities)

### Phase 2: min-h-screen Replacement (10 files, 22 instances)

| File                           | Instances | Risk | Notes                             |
| ------------------------------ | --------- | ---- | --------------------------------- |
| `app/layout.tsx`               | 1         | LOW  | Main layout wrapper               |
| `app/penny-list/page.tsx`      | 1         | LOW  | Page wrapper                      |
| `app/report-find/page.tsx`     | 1         | LOW  | Page wrapper                      |
| `app/store-finder/page.tsx`    | 1         | LOW  | Page wrapper                      |
| `app/sku/[sku]/page.tsx`       | 1         | LOW  | Page wrapper                      |
| `app/login/page.tsx`           | 2         | LOW  | Login + loading states            |
| `app/lists/page.tsx`           | 4         | LOW  | My Lists + loading/error states   |
| `app/lists/[id]/page.tsx`      | 2         | LOW  | List detail + loading state       |
| `app/admin/dashboard/page.tsx` | 4         | LOW  | Admin + loading/auth states       |
| `app/s/[token]/page.tsx`       | 3         | LOW  | Share page + loading/error states |
| `app/unsubscribed/page.tsx`    | 1         | LOW  | Static page                       |

**Change per instance:** `min-h-screen` -> `min-h-viewport` (the CSS class from Phase 1).

Why not `min-h-[100dvh]` inline? Because Tailwind v3.4 doesn't guarantee dvh support in JIT, and the CSS class provides the vh fallback automatically.

### Phase 3: Penny List Responsive Typography (2 files)

| File                              | Action                                                                                        | Risk                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `app/penny-list/page.tsx`         | Update 3 typography classes (H1, subtitle, H2)                                                | LOW - class swaps only                                  |
| `components/penny-list-table.tsx` | Reduce `min-w-[880px]` to `min-w-[640px]`, hide photo column below lg, adjust colgroup widths | MEDIUM - table layout change, needs visual verification |

**Table changes (penny-list-table.tsx) in detail:**

1. Line 105: `min-w-[880px]` -> `min-w-[640px]`
2. Line 110 (photo col): `w-[10%]` -> `w-[10%] hidden lg:table-column` (hide below 1024px)
3. Line 118-123 (photo th): Add `hidden lg:table-cell`
4. Lines in tbody for photo td: Add `hidden lg:table-cell`
5. Remaining colgroup widths adjusted: Item 45%, Price 15%, Reports 25%, Actions 15%
6. Scroll hint (line 100): Change `lg:hidden` to match new breakpoint if needed

### Phase 4: Homepage Typography (1 file)

| File           | Action                               | Risk                   |
| -------------- | ------------------------------------ | ---------------------- |
| `app/page.tsx` | Update 2 typography classes (H2, H3) | LOW - class swaps only |

**Changes:**

- H2 (line ~90): `text-3xl` -> `text-2xl sm:text-3xl lg:text-4xl`
- H3 (line ~143): `text-xl` -> `text-lg sm:text-xl`

### Phase 5: Report-Find Typography (1 file)

| File                       | Action                                      | Risk                   |
| -------------------------- | ------------------------------------------- | ---------------------- |
| `app/report-find/page.tsx` | Update 2 typography classes (H1, body text) | LOW - class swaps only |

**Changes:**

- H1 (line ~47): `text-3xl sm:text-4xl` -> `text-2xl sm:text-3xl lg:text-4xl`
- Body (line ~50): `text-lg` -> `text-base sm:text-lg`

### Phase 6: Guide + FAQ Verification (0-2 files)

No typography changes expected. Only apply `min-h-viewport` if `min-h-screen` exists (already counted in Phase 2 if applicable). Visual spot-check only.

---

## Change Sequencing

```
Phase 1 (globals.css utilities)
    |
    v
Phase 2 (min-h-screen replacement - all 10 files)
    |
    v
Phase 3 (penny-list typography + table)
    |
    v
Phase 4 (homepage typography)
    |
    v
Phase 5 (report-find typography)
    |
    v
Phase 6 (guide/faq spot-check)
    |
    v
Verification: npm run verify:fast + npm run e2e:smoke
```

Each phase is independently committable. If any phase breaks tests, it can be reverted without affecting other phases.

---

## Risk Assessment

| Risk                                                             | Likelihood | Impact | Mitigation                                                                                                                |
| ---------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `overflow-x: hidden` on body hides legitimate horizontal content | LOW        | MEDIUM | Tables use `overflow-x-auto` on wrapper divs (new formatting context). Body overflow doesn't cascade into them.           |
| Table column hiding breaks sort buttons                          | LOW        | LOW    | Sort buttons are on Item and Reports columns, not Photo. Photo column has no interactive elements.                        |
| dvh not supported in older browsers                              | LOW        | NONE   | CSS fallback: `min-height: 100vh` declared before `min-height: 100dvh`. Browsers ignore properties they don't understand. |
| Smoke tests fail after typography changes                        | LOW        | LOW    | No test assertions reference specific CSS classes or text sizes. Tests check content presence and navigation.             |
| Text wrapping differently at new sizes causes layout shifts      | LOW        | LOW    | All headings already have `leading-tight` or `leading-snug`. Smaller base sizes mean LESS wrapping on mobile.             |

---

## Verification Plan

### During Implementation (per phase)

- Typecheck: `npx tsc --noEmit` after each phase
- Lint: `npm run lint` after each phase
- Visual: Playwright screenshot at 375px + 1280px for any changed page

### After All Phases

1. `npm run verify:fast` (lint + typecheck + unit + build)
2. `npm run e2e:smoke` (chromium-desktop, 1 worker)
3. Playwright screenshots at 320px, 375px, 768px, 1280px for:
   - `/penny-list` (card view)
   - `/penny-list?view=table` (table view)
   - `/` (homepage)
   - `/report-find`
4. Light + dark mode spot-check on penny-list and homepage

### FULL e2e Trigger Check

- `app/globals.css` is in the FULL e2e auto-trigger list
- `app/**/layout.tsx` changes also trigger FULL
- RECOMMENDATION: Run `npm run e2e:full` locally before pushing since globals.css is modified

---

## Rollback Plan

Each phase is a separate git commit on `dev`. If any phase causes problems:

1. `git revert <commit>` for the specific phase
2. Push to dev
3. Verify tests pass

If globals.css changes cause cascading issues:

1. Revert the Phase 1 commit
2. All Phase 2 changes (`min-h-viewport` class references) will need to be reverted back to `min-h-screen` since the class won't exist
3. Phases 3-5 (typography changes) are independent and can stay

---

## Open Questions (0)

All questions were resolved during /plan. No open questions remain.

---

## Commit Plan

| Commit | Phase   | Message                                                                        |
| ------ | ------- | ------------------------------------------------------------------------------ |
| 1      | Phase 1 | `feat(css): add responsive foundation utilities (dvh, overflow-x, fluid type)` |
| 2      | Phase 2 | `fix(mobile): replace min-h-screen with dvh-aware min-h-viewport sitewide`     |
| 3      | Phase 3 | `fix(penny-list): responsive typography and table column hiding`               |
| 4      | Phase 4 | `fix(homepage): responsive heading typography`                                 |
| 5      | Phase 5 | `fix(report-find): responsive heading and body typography`                     |
| 6      | -       | `chore(ai): update state and session log`                                      |
