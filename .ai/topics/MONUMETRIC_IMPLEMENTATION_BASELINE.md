# MONUMETRIC_IMPLEMENTATION_BASELINE

**Last updated:** 2026-03-07
**Owner:** Cade (founder)
**Status:** Stable baseline in production; key March regressions resolved.

---

## Objective

Prevent reintroduction of known Monumetric regressions by preserving the exact implementation truth for route gating, in-content setup, and ownership boundaries.

---

## Canonical baseline summary

- Penny List in-content now works because it uses the real slot UUID.
- Manual shell chrome was removed so in-content blocks are visually clean.
- SPA route refresh behavior is improved on Penny List transitions.
- Monumetric script is now route-gated and no longer global.
- Excluded routes remain ad-free in production checks.

Operational doc:

- `docs/ads/monumetric-ops-baseline.md`

---

## Why this topic exists

Most historical Monumetric pain came from two preventable classes of drift:

1. Wrong assumptions about who controls which placements.
2. Missing canonical record of what changed when the fixes finally stabilized.

This file and the linked runbook are the "do not rediscover" source.

---

## Ownership boundaries (locked)

### Monumetric-owned

- Provider-managed placement enablement for header/footer/sidebar/pillar.
- Creative-size mix, fill dynamics, and provider-side refresh policy.
- Desktop jump/CLS behavior for provider-injected containers.

### App-owned

- Global enable switch (`NEXT_PUBLIC_MONUMETRIC_ENABLED`).
- Hard route exclusions.
- SPA route lifecycle/requeue behavior.
- Manual in-content slot insertion where auto-insertion does not apply.

---

## Route policy truth

- All non-excluded routes are eligible by default.
- Exclusions are explicit and enforced in `lib/ads/route-eligibility.ts`.
- Script injection/removal is enforced in `components/ads/monumetric-script-gate.tsx`.

---

## Commits that define current baseline

- `fcc185e` - real Penny List in-content UUID
- `ea5d60f` - removed shell box chrome
- `7d45fb9` - Penny List refresh improvements
- `0c3a74b` - route-gated script loading + excluded-route cleanup
- `8ee66eb` - removed residual black gap + pagination scroll fix

---

## Future-agent guardrail

Before changing Monumetric code, read:

1. `docs/ads/monumetric-ops-baseline.md`
2. `lib/ads/route-eligibility.ts`
3. `components/ads/monumetric-script-gate.tsx`
4. `lib/ads/launch-config.ts`

If a proposed change conflicts with this baseline, stop and document why the baseline is no longer valid before implementing.
