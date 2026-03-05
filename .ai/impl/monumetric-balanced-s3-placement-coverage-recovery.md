# Monumetric Balanced S3 - Placement Coverage Recovery (Balanced Density)

**Status:** Approved (Not Implemented)  
**Depends on:** `S2`  
**Parent plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`  
**Last updated:** 2026-03-05

## Goal (Single Outcome)

Recover monetizable in-content opportunities on Guide and Penny List while preserving exclusions and avoiding duplicate anchor/footer behavior.

## Why This Slice Exists

Current provider-managed posture is stable but under-served on key utility/editorial routes. This slice adds controlled density where user value allows it.

## Exact Files to Modify (Implementation Phase)

1. `lib/ads/route-eligibility.ts`
2. `lib/ads/slot-plan.ts`
3. `lib/ads/launch-config.ts`
4. `components/ads/route-ad-slots.tsx`
5. `components/ads/monumetric-in-content-slot.tsx`
6. `app/guide/page.tsx`
7. `app/penny-list/page.tsx`
8. `components/penny-list-client.tsx`

## Planned Changes

- Keep `/report-find` ad exclusion unchanged.
- Add balanced in-content cadence for `/guide` sections.
- Add in-feed insertion opportunities on `/penny-list`.
- Enforce per-route slot caps to prevent stacked/duplicate footer or anchor behavior.
- Gate profile choice with `NEXT_PUBLIC_MONU_DENSITY_PROFILE` (`balanced` vs `conservative`).

## Risks / Edge Cases

- Over-insertion can degrade readability and trust.
- Duplicate anchor/footer logic can trigger if slot-cap checks are incomplete.
- Mobile list interactions may feel heavier if slot cadence is too dense.

## Acceptance Criteria

1. `/guide` has more than one policy-allowed monetization opportunity where layout allows.
2. `/penny-list` includes in-content opportunities without breaking list utility.
3. No duplicate/stacked anchor behavior beyond configured caps.

## Rollback Path

- Switch `NEXT_PUBLIC_MONU_DENSITY_PROFILE=conservative`.
- Revert in-content insertion points while retaining `S1` + `S2` stability protections.

## Verification Lane

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright desktop/mobile full-page screenshots for `/guide` and `/penny-list`
- Slot-count notes captured with screenshots

## Stop/Go Checkpoint

- **Go to S4 only if:** added opportunities improve coverage with no major UX regression.
- **Stop if:** anchor duplication, layout crowding, or list usability regressions appear.
