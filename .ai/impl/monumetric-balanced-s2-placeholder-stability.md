# Monumetric Balanced S2 - Placeholder Stability + Empty Container Behavior

**Status:** Approved (Not Implemented)  
**Depends on:** `S1`  
**Parent plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`  
**Last updated:** 2026-03-05

## Goal (Single Outcome)

Reduce layout shift and stale empty ad boxes by reserving slot space and collapsing truly empty containers after a controlled timeout.

## Why This Slice Exists

Late ad loads can cause visual jump and unfilled containers can linger indefinitely. This slice stabilizes wrapper behavior without changing route eligibility policy.

## Exact Files to Modify (Implementation Phase)

1. `components/ads/monumetric-in-content-slot.tsx`
2. `components/ads/mobile-sticky-anchor.tsx`
3. `components/ads/route-ad-slots.tsx`
4. `lib/ads/slot-plan.ts`
5. `lib/ads/launch-config.ts`
6. `lib/ads/monumetric-slot-shell.tsx` (new shared wrapper, optional if reuse improves clarity)

## Planned Changes

- Reserve route/slot-specific `min-height` before creative render.
- Add controlled collapse timer (`collapseAfterMs`) for empty slots only.
- Apply `overflow: hidden` on wrappers to prevent visual bleed during viewport changes.
- Gate collapse behavior with `NEXT_PUBLIC_MONU_COLLAPSE_EMPTY`.

## Risks / Edge Cases

- Collapsing too early can hide slow-but-valid creatives.
- Collapsing too late weakens UX gains and leaves empty ad framing visible.
- Mobile viewport resize events can create false empty checks if not debounced.

## Acceptance Criteria

1. `/guide` and `/penny-list` no longer show major jump when ads load late.
2. Empty "Advertisement" containers do not persist indefinitely when no creative renders.
3. Collapse behavior can be disabled immediately (`NEXT_PUBLIC_MONU_COLLAPSE_EMPTY=0`).

## Rollback Path

- Set `NEXT_PUBLIC_MONU_COLLAPSE_EMPTY=0`.
- Revert wrapper/timer changes if collapse heuristics prove unstable.

## Verification Lane

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright before/after CLS-focused screenshots on `/guide` and `/penny-list`
- Playwright console capture for runtime warnings

## Stop/Go Checkpoint

- **Go to S3 only if:** wrapper reserve + collapse behavior improves stability without hiding legitimate creatives.
- **Stop if:** creatives are collapsing prematurely or severe visual regressions appear on mobile.
