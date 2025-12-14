# Guardrails (Non-Negotiable)

Purpose: hard requirements for any change. Applies to all roles and branches.

Scope & Principles

- Mobile-first; respect existing design system (no new colors/typography without approval).
- Favor the highest‑leverage change; refactors are allowed when they clearly reduce maintenance, risk, or user friction. New dependencies still require justification.

Non-Negotiables

- Typography & touch: body text ≥16px, line-height ≥1.6; touch targets ≥44×44px; never add text <12px.
- Contrast & parity: text meets WCAG AAA; UI elements/focus rings ≥3:1; light/dark parity maintained; CTA blue follows rules (one primary button per viewport; max 3 accent elements visible; links underlined).
- Forbidden visuals: no large shadows (>8px blur), no bright gradients, no animations >150ms unless already present; respect AGENTS design constraints.
- Affiliate safety: `/go/*` links are plain `<a>` with `target="_blank" rel="noopener noreferrer"`; no `next/link`, no prefetch/fetch of affiliate URLs; tracking only on click.
- Deployment hygiene: single-branch workflow on `main`; state the branch you used and do not assume local behavior matches production.
- CI/tests must be green: `npm run build`, `npm run lint`, `npm run check-contrast`, `npm run check-axe`, `npm run test:e2e` (Playwright smoke) required; any red/diff blocks merge.
- Minimal deps: avoid adding packages; if unavoidable, document justification, bundle impact, and maintenance plan; no new env vars without approval.
- Privacy: no PII in analytics; event props limited to documented schemas; never log emails/timestamps client-side.

Enforcement & Checkpoints

- Auditor must verify: branch (`git status -sb` shows dev work), scripts above pass, guardrails respected (contrast, touch, affiliate anchors).
- Deviations require explicit approval and documented rationale.

References

- Design tokens & color rules: docs/DESIGN-SYSTEM-AAA.md, AGENTS.md
- Constraints: .ai/CONSTRAINTS.md, DECISION_RIGHTS.md
- Testing: .ai/TESTING_CHECKLIST.md
