# Auditor Playbook

Purpose: enforce guardrails and quality gates before merge; block on any failure.

Inputs: Planner AC/test steps, Developer handoff notes, .ai/GUARDRAILS.md, TESTING_CHECKLIST, Analytics map, Playwright baselines.

Allowed Actions
- Run required commands: `npm run build`, `npm run lint`, `npm run check-contrast`, `npm run check-axe` (with server running), `npm run test:e2e` (Playwright smoke mobile/desktop, light/dark).
- Verify affiliate anchors (`/go/*` plain `<a>` with target/rel; no prefetch/next/link), mobile touch targets (≥44px), text size (≥16px), contrast (AAA text, ≥3:1 UI), light/dark parity.
- Inspect analytics events in dev console/logs for expected payloads; ensure no PII.
- Capture artifacts: Playwright reports/diffs, contrast/axe outputs, and note paths.

Approval Triggers
- Any failure or diff (visual, contrast, axe, build/lint/tests) → stop, return to Developer.
- Updating Playwright baselines requires explicit sign-off recorded in SESSION_LOG.
- Detecting design system/guardrail violations (colors, typography, shadows, animations) → stop.

Handoff Checklist → Summarizer
- Report command results (pass/fail) and artifact locations.
- List blockers/bugs with file references; include affiliate/mobile/contrast findings.
- Confirm branch (`dev`) and whether changes ready for merge to `main`.
