# Monumetric Balanced S5 - Controlled Production Rollout

**Status:** Approved (Not Implemented)  
**Depends on:** `S4`  
**Parent plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`  
**Last updated:** 2026-03-05

## Goal (Single Outcome)

Roll out the stabilized balanced configuration in production with staged flags, observation windows, and a clear rollback order.

## Why This Slice Exists

Even with passing local/staging checks, production ad behavior can diverge due to provider runtime variability. A staged rollout reduces blast radius.

## Exact Files to Modify (Implementation Phase)

1. Vercel production environment flags (`NEXT_PUBLIC_MONU_*`)
2. `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
3. `.ai/topics/SITE_MONETIZATION_CURRENT.md`
4. `.ai/SESSION_LOG.md`
5. `.ai/STATE.md`

## Planned Stages

- **Stage A:** Lifecycle + placeholder stability (`S1` + `S2`) only.
- **Stage B:** Balanced density profile (`S3`).
- **Stage C:** CSP finalized (`S4`) and observed.
- **Observation window:** 24 hours between stages with founder-visible evidence.

## Risks / Edge Cases

- Header/nav interference can reappear only under production traffic/load patterns.
- Density improvements can hurt trust metrics even when rendering is technically stable.
- Ad-provider runtime changes can invalidate assumptions between stages.

## Acceptance Criteria

1. No recurring header/nav obstruction on audited mobile and desktop routes.
2. Route transitions render ads without hard-refresh dependency.
3. Guide + Penny List coverage improves without major UX regression.

## Rollback Path

1. `NEXT_PUBLIC_MONU_DENSITY_PROFILE=conservative`
2. `NEXT_PUBLIC_MONU_COLLAPSE_EMPTY=0`
3. `NEXT_PUBLIC_MONU_ROUTE_REQUEUE=0`
4. emergency kill switch: `NEXT_PUBLIC_MONUMETRIC_ENABLED=false`

## Verification Lane

- `npm run verify:fast` at each code stage
- `npm run e2e:smoke` whenever route/UI-flow changes are present
- Playwright desktop/mobile smoke evidence for each rollout stage
- Console capture and incident register updates per stage

## Stop/Go Checkpoint

- **Go (close plan) only if:** all stage windows pass with no blocker regressions and founder confirms observed stability.
- **Stop and roll back if:** header obstruction, nonstop refresh behavior, or report-find interference recurs.
