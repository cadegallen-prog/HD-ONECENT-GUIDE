# Monumetric Balanced Stabilization + Density Recovery (Parent)

**Status:** In Progress (`S1`-`S3` implemented locally; `S4` next)  
**Created:** 2026-03-05  
**Last updated:** 2026-03-05  
**Owner:** Cade (founder approval), AI agents (execution)  
**Related incident:** `INC-MONUMETRIC-001` (`.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`)

## 0) Alignment Gate (Completed)

- **GOAL:** Stabilize Monumetric runtime behavior and recover controlled ad density without repeating the prior mobile/header failures.
- **WHY:** Production reactivation is live again, but lifecycle reliability, placeholder stability, and route density still need a defensive implementation path.
- **DONE MEANS:** Five ordered slices are documented with dependency, acceptance, rollback, and verification requirements and can be executed one slice at a time.
- **NOT DOING:** No one-shot implementation batch, no blind production enablement of undocumented SPA callbacks, and no broad CSP wildcard expansion.
- **CONSTRAINTS:** Keep `/report-find` ad-excluded; default to mobile-safe behavior; preserve `dev` workflow + verification contract; no scope drift into unrelated UI rewrites.
- **ASSUMPTIONS:** Monumetric runtime behavior can be non-deterministic across routes and reload cycles; first-party code must guard against duplicate queueing and empty shells.
- **CHALLENGES:** Existing monetization docs focus on initial launch policy; they do not fully encode post-reactivation stabilization + density recovery sequencing.

## 1) Locked Facts (Do Not Re-Decide Mid-Implementation)

1. **Balanced objective is founder-selected.** This is not conservative-only and not aggressive density-first.
2. **Undocumented SPA callback is not production-safe yet.** Prior test evidence recorded `updateConfig is not a function` when `$MMT.spa.setCallback(...)` was enabled.
3. **`NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA` remains default-off** until isolated canary evidence proves safety.
4. **`/report-find` remains ad-excluded** across all slices.
5. **Rollout must be staged** with observation windows and reversible env flag gates.

## 2) Public Interface + Config Contract

Planned interface/config additions for implementation slices:

### `lib/ads/slot-plan.ts`

- `AdSlotPolicy.reserveMinHeightPx`
- `AdSlotPolicy.collapseAfterMs`
- `AdSlotPolicy.maxPerRoute`
- `AdSlotPolicy.mobileEnabled`
- `AdSlotPolicy.desktopEnabled`

### Runtime flags (ads config layer)

- `NEXT_PUBLIC_MONU_ROUTE_REQUEUE=1`
- `NEXT_PUBLIC_MONU_COLLAPSE_EMPTY=1`
- `NEXT_PUBLIC_MONU_DENSITY_PROFILE=balanced`
- `NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA=0` (default)

### Type safety

- Add explicit `window.$MMT` typings in ad runtime types.
- Remove unsafe `any` casting in Monumetric coordinator code paths.

## 3) Parent -> Child Slice Topology (Ordered)

| Slice | Status                         | Depends on | Primary outcome                                                   | Child plan                                                       |
| ----- | ------------------------------ | ---------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| `S1`  | Implemented (Locally Verified) | none       | Route lifecycle requeue guardrails without risky SPA callback     | `.ai/impl/monumetric-balanced-s1-lifecycle-guardrails.md`        |
| `S2`  | Implemented (Locally Verified) | `S1`       | Placeholder reserve + controlled empty collapse behavior          | `.ai/impl/monumetric-balanced-s2-placeholder-stability.md`       |
| `S3`  | Implemented (Locally Verified) | `S2`       | Balanced in-content placement recovery on Guide + Penny List      | `.ai/impl/monumetric-balanced-s3-placement-coverage-recovery.md` |
| `S4`  | Approved (Not Implemented)     | `S3`       | Minimal-safe CSP host expansion by directive                      | `.ai/impl/monumetric-balanced-s4-csp-compat-hardening.md`        |
| `S5`  | Approved (Not Implemented)     | `S4`       | Controlled production rollout with staged flags + rollback ladder | `.ai/impl/monumetric-balanced-s5-controlled-rollout.md`          |

## 4) Stop/Go Rule (Mandatory)

After each slice:

1. run required verification,
2. capture artifacts,
3. update monetization incident register + memory files,
4. publish a stop/go checkpoint,
5. do not start next slice until checkpoint is explicitly green.

## 5) Verification Contract (Per Slice)

- `npm run verify:fast` (always)
- `npm run e2e:smoke` (route/form/API/UI-flow slices)
- Playwright desktop + mobile screenshots for touched routes
- Playwright console capture for ad-runtime/CSP slices
- Docs-only memory proof lanes when a slice is planning/ops-only

## 6) Rollback Ladder (Global)

1. `density` rollback first (`NEXT_PUBLIC_MONU_DENSITY_PROFILE=conservative`)
2. `collapse` rollback second (`NEXT_PUBLIC_MONU_COLLAPSE_EMPTY=0`)
3. `route requeue` rollback third (`NEXT_PUBLIC_MONU_ROUTE_REQUEUE=0`)
4. emergency global runtime kill remains available (`NEXT_PUBLIC_MONUMETRIC_ENABLED=false`)

## 7) Test Scenarios (Execution Baseline)

### Desktop

- `/guide`: initial load, mid-scroll, bottom-scroll
- `/penny-list`: initial load, filter/pagination interaction, deep-scroll
- client-side route transitions without hard refresh

### Mobile

- header/menu open/close while ads load
- anchor visibility and close behavior
- route transitions with no nav obstruction

### Negative tests

- empty-container collapse trigger
- duplicate footer/anchor prevention via slot caps
- `/report-find` remains excluded

### Observability

- collect console warnings/errors from ad script
- capture slot-presence count vs filled creative count per route

## 8) Out of Scope

- Adding new monetization providers
- Reworking core navigation IA
- Major component redesign outside ad wrappers/slot insertion points
- Expanding ad eligibility to currently excluded trust/system routes

## 9) Immediate Next Task

- **Single next task:** Execute `S4` from `.ai/impl/monumetric-balanced-s4-csp-compat-hardening.md`
- **First files to open:**
  - `.ai/impl/monumetric-balanced-s4-csp-compat-hardening.md`
  - `next.config.js`
  - `tests/live/console.spec.ts`
  - `reports/playwright/console-report-*.json`
