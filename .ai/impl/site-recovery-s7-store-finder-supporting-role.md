# Site Recovery S7 - Store Finder Supporting Role

**Status:** Approved (Not Implemented)  
**Depends on:** `S2` homepage proof front door, `S4` Penny List mobile focus  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Reposition `/store-finder` as a supporting utility that helps real store trips without pretending to be a core front-door feature.

## Why This Slice Exists

Store Finder is not worthless, but it is over-exposed relative to its current user value. The first-run experience is also rough, especially on mobile and especially when geolocation fails.

## Locked Product Decisions

- Store Finder is not a star feature in this recovery program.
- It should support trip planning, not compete with the Penny List.
- The route should not auto-create a bad first impression with intrusive geolocation failure behavior.
- This slice should avoid a map-system rewrite unless a later blocker proves one is required.

## Exact Files To Modify

1. `app/store-finder/page.tsx`
2. `app/store-finder/layout.tsx`
3. `components/navbar.tsx`
4. `tests/smoke-critical.spec.ts`
5. `tests/visual-smoke.spec.ts`

## Files Explicitly Not To Modify In The First Pass

- `components/store-map.tsx`

Treat the map component as fragile. Only expand scope there if the route cannot meet acceptance without it, and if that happens, split a follow-on slice first.

## Planned Changes

### First-run behavior

- remove automatic geolocation prompt on initial load,
- replace it with a clear first-state choice:
  - search by ZIP/city/address,
  - or tap a deliberate "Use my location" action,
- replace blocking alert behavior with inline status messaging.

### Product positioning

- reduce top-level emphasis so the route reads as a supporting utility,
- keep links from the Penny List and guide where they serve trip planning,
- do not let Store Finder compete with the two main homepage paths.

### Mobile behavior

- make the first screen understandable before the map becomes interactive,
- ensure denied location permission leaves the route calm and usable.

## Acceptance Criteria

- First-load behavior is calmer and clearer.
- Denied geolocation no longer produces a clumsy alert-driven experience.
- Navigation emphasis matches Store Finder's supporting role.
- The route is still useful for planning a real trip.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- mobile screenshots
- explicit geolocation-denied scenario coverage

## Rollback

- Revert Store Finder behavior and emphasis changes only.
- Do not mix rollback with map-system experimentation.

## Risks / Watchouts

- This route can absorb too much effort because of map complexity.
- The correct first-pass win is calmer onboarding and clearer positioning, not more functionality.
