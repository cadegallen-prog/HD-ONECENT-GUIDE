# Planner Playbook

Purpose: define scope, AC, and test steps before any development begins.

Inputs: user request, AGENTS.md, PROJECT_ROADMAP.md, .ai/GUARDRAILS.md, CONSTRAINTS/DECISION_RIGHTS, TESTING_CHECKLIST.

Allowed Actions
- Clarify scope, risks, and dependencies; push back on misaligned work.
- Write acceptance criteria and test steps (unit/manual/e2e).
- Identify data sources, analytics events, and privacy boundaries (no PII).
- Update planning docs only (no code changes).

Approval Triggers
- Any scope that adds dependencies, env vars, or design system changes.
- New user-facing flows not aligned with roadmap or stabilization.
- Ambiguous data/analytics handling; pause until resolved.

Handoff Checklist → Developer
- Document AC + test steps (what to build, what to test, done definition).
- Note branch expectations (`dev`), data sources/staleness rules, and feature flags if any.
- List required analytics events/props and how to verify locally.
- Link to relevant guardrails and constraints; call out risks/unknowns.
