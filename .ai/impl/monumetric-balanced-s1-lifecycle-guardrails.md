# Monumetric Balanced S1 - Lifecycle Guardrails (No Risky SPA Hook)

**Status:** Approved (Not Implemented)  
**Depends on:** none  
**Parent plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`  
**Last updated:** 2026-03-05

## Goal (Single Outcome)

Keep ad slots eligible across client-side route transitions without enabling undocumented Monumetric SPA callback APIs.

## Why This Slice Exists

Route transitions currently rely on ad runtime behavior that may not re-queue predictably. Prior callback testing showed runtime errors when using `$MMT.spa.setCallback(...)`, so this slice adds a first-party coordinator instead.

## Exact Files to Modify (Implementation Phase)

1. `app/layout.tsx`
2. `components/ads/route-ad-slots.tsx`
3. `lib/ads/slot-plan.ts`
4. `lib/ads/launch-config.ts`
5. `lib/ads/monumetric-runtime.ts` (new)
6. `types/ads-runtime.d.ts` (new or existing runtime typing file)

## Planned Changes

- Add client lifecycle coordinator that observes `pathname` changes and re-queues known slots.
- Make queue pushes idempotent so repeated route transitions do not spam the same slot key.
- Gate behavior behind `NEXT_PUBLIC_MONU_ROUTE_REQUEUE` (default `1` for this plan, reversible to `0`).
- Keep `NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA=0`; do not call undocumented SPA callback hooks.

## Risks / Edge Cases

- Duplicate queue pushes can cause unstable fill behavior.
- Race conditions on first load vs route transition can create false "already queued" state.
- Overly aggressive debouncing can miss legitimate route transitions.

## Acceptance Criteria

1. `/ -> /guide -> /penny-list` client navigation keeps placeholders active/eligible without hard refresh.
2. No console crashes tied to Monumetric SPA callback usage.
3. Requeue behavior can be disabled instantly via `NEXT_PUBLIC_MONU_ROUTE_REQUEUE=0`.

## Rollback Path

- Disable coordinator path with `NEXT_PUBLIC_MONU_ROUTE_REQUEUE=0`.
- If needed, revert only the coordinator wiring commit; keep existing script load path unchanged.

## Verification Lane

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright desktop/mobile route-navigation screenshots
- Playwright console capture proving no callback crash

## Stop/Go Checkpoint

- **Go to S2 only if:** route transition eligibility is stable and no Monumetric callback errors appear in console evidence.
- **Stop if:** route transitions still require hard refresh or duplicate queue spam is observed.
