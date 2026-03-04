# Site Recovery S3 - Guide Core Rebuild

**Status:** In Progress (`S3A` and `S3B` complete; `S3C1` next)  
**Depends on:** `S2` homepage proof front door  
**Owner:** AI agents  
**Last updated:** 2026-03-04

## Summary

Restore a real editorial spine by making `/guide` the canonical long-form guide and demoting the existing chapter pages into supporting references.

## Progress Note

- `S3A` is complete.
- `S3B` is complete.
- Canonical content-ownership artifact: `.ai/topics/GUIDE_CORE_CONTENT_MAP.md`
- `/guide` is now the canonical seven-section long-form route with jump navigation.
- Immediate next runtime slice: `S3C1 - supporting chapter-route demotion` for `/what-are-pennies`, `/clearance-lifecycle`, and `/digital-pre-hunt`

## Why This Slice Exists

The current guide system is not failing because it lacks content volume. It is failing because it lacks one curated, authoritative path for beginners. Right now the learning load is split across `/guide`, `/faq`, and `/what-are-pennies`, while the chapter pages behave like a fragmented primary guide.

## Locked Product Decisions

- `/guide` becomes the main curated teaching experience.
- The current hub-plus-chapters model is no longer the primary guide architecture.
- Existing chapter routes remain live as supporting references, not the main beginner spine.
- The guide must feel authored and cohesive, not AI-assembled.
- No route deletions or SEO-breaking removals in the first recovery pass.

## Required Sub-Slices

`S3` is too large to implement as one uninterrupted coding batch. It must be executed as four ordered child slices.

### `S3A` - Guide information architecture lock

**Goal**

- Freeze the canonical section map and content-source mapping before runtime edits begin.

**Files**

- `.ai/topics/GUIDE_CORE_CONTENT_MAP.md` (new)

**Required output**

- section-by-section outline for the new `/guide`,
- source-page mapping showing what material moves where,
- explicit keep/merge/drop decisions for overlap between `/guide`, `/faq`, and `/what-are-pennies`.

**Verification**

- docs-only: `npm run ai:memory:check`, `npm run ai:checkpoint`

### `S3B` - `/guide` long-form implementation

**Goal**

- Turn `/guide` into the canonical long-form guide with jump navigation and one clear beginner flow.

**Files**

1. `app/guide/page.tsx`
2. `components/guide/GuideJumpNav.tsx` (new)
3. `components/guide/GuideSection.tsx` (new, only if it reduces duplication cleanly)
4. `tests/smoke-critical.spec.ts`
5. `tests/visual-smoke.spec.ts`

**Implementation rules**

- `/guide` must contain the primary narrative, not just route links.
- Keep the page SSR-first.
- Use jump navigation for section access.
- Keep the guide readable on mobile without forcing separate route-hopping.

**Completion note (2026-03-04)**

- implemented in `app/guide/page.tsx` with `components/guide/GuideJumpNav.tsx`.
- verified with `npm run verify:fast`, `npm run e2e:smoke`, and standalone four-project `tests/visual-smoke.spec.ts`.

### `S3C` - Supporting chapter-route demotion

**Goal**

- Keep the chapter URLs alive while making it obvious they are supporting references back to the canonical guide.

Because there are too many chapter files for one slice, split this into two mini-batches:

- `S3C1`
  - `app/what-are-pennies/page.tsx`
  - `app/clearance-lifecycle/page.tsx`
  - `app/digital-pre-hunt/page.tsx`
  - `components/guide/SupportingRouteNotice.tsx` (new)
  - relevant smoke/visual test file

- `S3C2`
  - `app/in-store-strategy/page.tsx`
  - `app/inside-scoop/page.tsx`
  - `app/facts-vs-myths/page.tsx`
  - reuse `components/guide/SupportingRouteNotice.tsx`
  - relevant smoke/visual test file

**Implementation rules**

- Each supporting route must visibly identify the canonical guide as the primary path.
- Keep unique value that justifies the route.
- Remove "this is the main guide" posture from supporting routes.

### `S3D` - FAQ role cleanup

**Goal**

- Convert `/faq` into a tactical question layer instead of a competing guide.

**Files**

1. `app/faq/page.tsx`
2. `tests/smoke-critical.spec.ts`
3. `tests/visual-smoke.spec.ts`

**Implementation rules**

- FAQ answers practical questions.
- The canonical conceptual explanation belongs to `/guide`.
- `/faq` must route readers back into `/guide`, `/penny-list`, and `/report-find` without trying to be the main teaching surface.

## Canonical `/guide` Section Map

The rebuilt `/guide` should follow this order unless founder-approved changes are recorded in `S3A`:

1. What penny items are
2. How the markdown cycle works
3. How to scout before a store trip
4. How to verify in-store
5. What checkout and pull behavior means
6. What myths to ignore
7. What to do after a confirmed find

## Route Role Decisions

- `/guide`: canonical long-form guide
- `/faq`: tactical support layer
- `/what-are-pennies`: supporting explainer unless `S3A` proves it should be narrowed further
- chapter routes: supporting reference pages, not the main guide architecture

## Acceptance Criteria

- `/guide` reads as one coherent experience.
- There is one definitive beginner path.
- FAQ no longer competes with the guide for primary authority.
- Supporting chapter pages clearly point back to the canonical guide.
- No SEO-destructive route removals happen in the first pass.

## Verification

Each `S3` child slice requires:

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright screenshots for `/guide`, `/faq`, `/what-are-pennies`, and at least one touched supporting route

## Rollback

- Each `S3` child slice must have its own rollback.
- Do not treat guide recovery as one giant revert.

## Risks / Watchouts

- The main risk is trying to "improve copy" without actually collapsing the information architecture.
- The canonical guide will fail if it becomes a dressed-up hub rather than a real narrative.
- Supporting routes should not become thin shells; each one must either retain unique value or be visibly repositioned as a support page.

## Drift Checks (2026-03-04)

- No guide-specific naming collisions surfaced in the drift scan.
- No risky active-route substring matching patterns surfaced for the planned guide work.
- No mobile touch-target regressions surfaced in the current guide-related surfaces.
- Unrelated My List bookmark-history references were found in older planning artifacts and shared memory; they are out of scope for `S3`.
