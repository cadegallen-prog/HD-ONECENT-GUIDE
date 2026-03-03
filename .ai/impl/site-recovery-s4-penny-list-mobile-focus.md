# Site Recovery S4 - Penny List Mobile Focus

**Status:** Approved (Not Implemented)  
**Depends on:** `S2` homepage proof front door  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Protect `/penny-list` as the product core by simplifying the mobile hierarchy, reducing section competition, and keeping the list itself visually and structurally dominant.

## Why This Slice Exists

The Penny List is the strongest page on the site, but its mobile experience is heavier than it should be. The problem is not lack of value. The problem is that too many adjacent sections compete with the list for attention.

## Locked Product Decisions

- The list stays primary.
- Mobile users should reach usable list content quickly.
- Supporting education stays available, but it must stop competing with the live list.
- No new feature work is introduced in this slice.
- This slice should simplify hierarchy, not inflate the route.

## Exact Files To Modify

1. `app/penny-list/page.tsx`
2. `components/penny-list-client.tsx`
3. `components/penny-list-mobile-utility-bar.tsx`
4. `components/penny-list-card.tsx`
5. `tests/visual-smoke.spec.ts`

If one more runtime file is required, split the slice before coding instead of silently expanding scope.

## Default Mobile Decisions

- Keep the route title, freshness signal, and primary filter access near the top.
- Keep the main list within the first meaningful viewport.
- Collapse or demote long explanatory sections below the core list experience.
- Consolidate lower-page prompts so feedback, report encouragement, and methodology do not behave like separate competing sections.

## Planned UI Changes

### Top-of-page compression

- compress the current top matter into one clean summary band,
- keep freshness, list intent, and core controls visible,
- do not stack multiple equal-priority panels before the user reaches real items.

### Hot-right-now treatment

- on mobile, reduce "hot" content to a compact supporting strip rather than a large competing section,
- keep the full richer presentation only where it does not bury the main list.

### Methodology treatment

- preserve methodology content, but demote it below the main list flow,
- prefer a compact secondary pattern such as a `details` disclosure or condensed card instead of a long uninterrupted block competing with the list.

### Bottom-of-page consolidation

- merge lower-priority follow-on content into one end-of-list support area,
- keep "Report a Find" strong, but do not let multiple stacked cards re-complicate the page.

## Acceptance Criteria

- The list remains the obvious focal point on mobile.
- The route feels shorter or more structured even if total content length does not change drastically.
- Supporting content is still available but no longer competes with the live list.
- No new hydration, performance, or usability regressions are introduced.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright mobile proof at `390px` width
- Console clean on load and common interactions

## Rollback

- Revert only Penny List hierarchy/presentation changes.
- Do not mix rollback with homepage, guide, or typography slices.

## Risks / Watchouts

- It is easy to hide too much useful information and accidentally weaken trust.
- The route should feel sharper, not emptier.
- Do not let mobile-only fixes create a worse desktop hierarchy unless the change is explicitly intended and verified.
