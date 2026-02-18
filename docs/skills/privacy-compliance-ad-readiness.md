# privacy-compliance-ad-readiness

## When to use

Use this when Cade asks for privacy-policy work, trust/legal route checks, monetization review readiness, or compliance hardening before ad-network resubmission.

## Goal

Lower policy-risk and reviewer-friction by keeping trust/legal/compliance surfaces complete, consistent, and verifiable.

## Compliance pass workflow

1. Confirm required trust routes are live and reachable:
   - `/privacy-policy`
   - `/terms-of-service`
   - `/contact`
   - `/transparency`
2. Confirm sitemap + robots behavior matches canonical policy.
3. Confirm legal/trust pages are easy to reach from global navigation.
4. Confirm policy language is factual and non-promissory.
5. Confirm ad/analytics disclosures match actual runtime behavior.
6. Confirm sensitive routes use correct indexing posture (`noindex` where intended).

## PennyCentral-specific checks

- Use canonical absolute domain: `https://www.pennycentral.com`.
- Keep legal page UX calm and non-solicitous.
- Keep ads off legal/trust surfaces unless explicitly approved.
- Ensure admin and tokenized surfaces are not treated as public SEO targets.
- Reuse existing skills when needed:
  - `docs/skills/solo-dev-ads-approval-triage.md`
  - `docs/skills/legal-sitemap-trust-pages.md`
  - `docs/skills/legal-monetization-copy-guard.md` (when channel status changes require disclosure copy sync)

## Verification lane

- `npm run verify:fast`
- `npm run e2e:smoke` (route/API/UI-flow edits)
- `npx playwright test tests/adsense-readiness.spec.ts --project=chromium-desktop-light --workers=1` (when route policy/disclosure scope changes)

## Founder-safe output format

- Compliance risks found (Critical/High/Medium/Low)
- What changed to reduce each risk
- Remaining risks and deadline-sensitive next action
- What Cade should do next (or `No action needed`)
