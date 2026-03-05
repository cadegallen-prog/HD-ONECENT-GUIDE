# Monumetric Balanced S4 - CSP Compatibility Hardening (Minimal Safe Expansion)

**Status:** Approved (Not Implemented)  
**Depends on:** `S3`  
**Parent plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`  
**Last updated:** 2026-03-05

## Goal (Single Outcome)

Reduce known Monumetric delivery-chain CSP violations with minimal, directive-specific host additions.

## Why This Slice Exists

Runtime behavior is sensitive to blocked third-party hosts. CSP must allow required hosts while preserving strict security posture.

## Exact Files to Modify (Implementation Phase)

1. `next.config.js`
2. `tests/live/console.spec.ts`
3. `reports/playwright/` console artifacts (generated evidence, not committed runtime code)
4. `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` (evidence references)

## Planned Changes

- Add only observed-required hosts to specific directives:
  - `script-src`
  - `connect-src`
  - `frame-src`
  - `img-src`
- Do not broaden to wildcard host patterns.
- Keep host additions incremental and evidence-backed.

## Risks / Edge Cases

- Over-broad CSP changes can weaken security posture.
- Under-broad changes can keep runtime broken despite earlier stability work.
- Third-party host chains can change, requiring iterative follow-up.

## Acceptance Criteria

1. Known Monumetric chain CSP violations are materially reduced in console evidence.
2. No unnecessary wildcard broadening is introduced.
3. Existing non-ad security behavior remains intact.

## Rollback Path

- Revert the specific host additions in one commit.
- Keep earlier slices active while CSP list is re-audited.

## Verification Lane

- `npm run verify:fast`
- Playwright desktop/mobile console capture on `/`, `/guide`, `/penny-list`, `/report-find`
- Document blocked-host delta before/after in incident evidence

## Stop/Go Checkpoint

- **Go to S5 only if:** CSP violation trend is reduced without security over-broadening.
- **Stop if:** new high-risk CSP exposure is required or host additions cannot be justified by evidence.
