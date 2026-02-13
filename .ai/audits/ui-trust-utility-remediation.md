# UI Trust + Utility Remediation Plan

Date: 2026-02-11
Source audit: `.ai/audits/ui-trust-utility-audit-2026-02.md`

Priority framework:

- P0 = immediate leverage on retention/submission trust loop
- P1 = meaningful UX gain with moderate implementation effort
- P2 = strategic polish and conversion refinement

## P0 (Immediate)

1. Replace placeholder SKU-help assets on `/report-find`.
   - Outcome target: increase submission confidence and reduce low-quality form exits.
   - Why P0: explicit trust break in a core loop page.

2. Tighten homepage first-action hierarchy.
   - Change intent: one clear primary action above fold (`Browse Penny List`) and demote supporting actions visually.
   - Outcome target: improve returning-visitor habit loop and reduce decision latency on first load.

3. Add explicit "last verified/report freshness" cue near primary identifiers on `/sku/[sku]`.
   - Outcome target: increase trust in SKU details and reduce false certainty.

## P1 (Near-Term)

1. Refactor `/store-finder` geolocation failure UX away from blocking `alert(...)` flows.
   - Outcome target: reduce mobile friction and abandonment during location lookup.

2. Add quick-action strip in `/guide` for "In store now" users.
   - Outcome target: improve scan speed for urgent utility use without reducing long-form depth.

3. Add clear "what to do next" trust module after successful report submission.
   - Outcome target: reinforce contribution loop and encourage repeat submissions.

## P2 (Strategic)

1. Unify trust microcopy patterns across `/`, `/penny-list`, `/sku/[sku]`, and `/report-find`.
   - Outcome target: consistent expectations and reduced cognitive switching.

2. Build reusable utility/trust section primitives for route-level consistency.
   - Outcome target: faster future UI iterations with lower drift risk.

3. Add route-level before/after telemetry checkpoints (CTA clicks, form starts/completes, bounce deltas).
   - Outcome target: prioritize future UX work by measurable product outcomes.

## Verification Plan for Remediation Work

1. `npm run verify:fast`
2. `npm run e2e:smoke` for affected route flows
3. Playwright proof bundle (desktop/mobile, light/dark, console report)
4. Update `.ai/SESSION_LOG.md` + `.ai/STATE.md` with outcome evidence
