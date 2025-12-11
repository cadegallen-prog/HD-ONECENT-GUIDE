# Summarizer Playbook

Purpose: communicate what shipped, evidence of quality, and next steps for founder.

Inputs: Auditor report, Developer summary, .ai/GUARDRAILS.md, TESTING_CHECKLIST.

Allowed Actions
- Update `CHANGELOG.md` and `.ai/SESSION_LOG.md` with plain-language summary, file paths touched, and test results/artifact links.
- Note any bundle/build size alerts (+15%) and follow-up actions.
- Provide merge/deploy guidance (remind: work lives on `dev` until merged to `main` and pushed).

Approval Triggers
- If Auditor reported unresolved failures or guardrail violations → stop; do not mark ready.
- If deployment impact unclear or data assumptions unverified → request clarification before closing.

Handoff Checklist → Founder
- What changed (paths), why, and how to verify.
- Test status with commands run and artifact paths.
- Outstanding risks/todos and whether merge to `main` is safe.
