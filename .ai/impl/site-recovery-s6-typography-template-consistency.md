# Site Recovery S6 - Typography and Template Consistency

**Status:** Approved (Not Implemented)  
**Depends on:** `S2` homepage proof front door, `S3` guide core rebuild  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Remove the stitched-together visual feel caused by mismatched type scales, spacing, and template behaviors across the core content and trust pages.

## Why This Slice Exists

The site currently feels uneven because multiple page patterns are using slightly different heading sizes, spacing systems, and emphasis rules. This produces the "tacky" feeling the founder called out, even when no single component is obviously broken.

## Locked Technical Decisions

- Stay on the current font stack for this recovery pass. Fix hierarchy before considering any font-family change.
- Shared-system fixes are preferred over page-by-page patching.
- `app/globals.css` is high-risk; any edits there must be deliberate and narrow.
- No raw Tailwind palette colors.

## Required Sub-Slices

### `S6A` - Typography/template audit lock

**Goal**

- Write down the exact scale/spacing mismatches before runtime edits begin.

**Files**

- `.ai/topics/TYPOGRAPHY_TEMPLATE_AUDIT.md` (new)

**Verification**

- docs-only: `npm run ai:memory:check`, `npm run ai:checkpoint`

### `S6B` - Shared system normalization

**Goal**

- Normalize the shared heading, body, and section-spacing system.

**Files**

1. `components/page-templates.tsx`
2. `app/globals.css`
3. `tests/visual-smoke.spec.ts`

**Implementation rules**

- centralize the scale in shared templates and global classes,
- do not hide problems with one-off utility overrides,
- keep changes token-based.

### `S6C` - Route-cluster cleanup

Split route cleanup into two clusters to stay within slice size:

- `S6C1`
  - `app/page.tsx`
  - `app/guide/page.tsx`
  - `app/report-find/page.tsx`
  - relevant visual/smoke test file

- `S6C2`
  - `app/faq/page.tsx`
  - `app/about/page.tsx`
  - `app/transparency/page.tsx`
  - relevant visual/smoke test file

## Acceptance Criteria

- Heading scale feels intentional across home, guide, report-find, FAQ, and trust pages.
- Page sections no longer feel like they were assembled from different systems.
- Mobile spacing is more disciplined.
- Readability and accessibility remain intact.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke` if shared layouts or route shells change
- visual regression screenshots across touched routes

## Rollback

- Keep shared-template/global changes separate from route-cluster cleanup so rollback can be isolated.

## Risks / Watchouts

- The biggest risk is ad hoc cleanup that never becomes systemic.
- `app/globals.css` changes can create broad regressions if they are not tightly scoped.
- Avoid changing too many route files in one pass; this slice only works if it stays decomposed.
