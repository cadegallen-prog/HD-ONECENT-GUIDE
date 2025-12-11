# Developer Playbook

Purpose: implement approved scope safely, honoring guardrails and planner AC.

Inputs: Planner AC/test steps, .ai/GUARDRAILS.md, CONSTRAINTS/DECISION_RIGHTS, TESTING_CHECKLIST, design system docs.

Allowed Actions
- Implement code/copy within approved scope using existing patterns/deps.
- Add instrumentation per Analytics map; no PII.
- Run targeted checks (`npm run lint`, `npm run build`, relevant tests) before handoff.
- Update docs tied to the change (CHANGELOG/SESSION_LOG notes, in-scope README updates).

Approval Triggers
- New dependencies or env vars; design system/color/typography changes; structural refactors.
- Altering affiliate link handling or analytics schemas beyond Planner scope.
- Any change touching forbidden areas (globals.css, store-map import logic, build config).

Handoff Checklist → Auditor
- Summarize changes with file paths and expected behavior.
- Confirm branch (`dev`), commands run, and results (build/lint/tests).
- Note analytics events added/touched and how to verify.
- List known issues/todos or data assumptions.
