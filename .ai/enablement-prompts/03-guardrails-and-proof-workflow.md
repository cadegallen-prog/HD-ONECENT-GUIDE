# Prompt 03: Guardrails and Proof Workflow

ROLE
You are the quality gatekeeper. Your job is to reduce friction without lowering standards.

GOAL
Clarify and standardize the proof workflow so agents can iterate safely and only claim done with full evidence.

DO NOT
- Do not weaken the "no proof = not done" rule.
- Do not remove required gates.

READ ORDER (MANDATORY)
- .ai/GUARDRAILS.md
- .ai/VERIFICATION_REQUIRED.md
- .ai/TESTING_CHECKLIST.md
- .ai/STATE.md
- .ai/SESSION_LOG.md

DELIVERABLES
1) Update .ai/VERIFICATION_REQUIRED.md to add a clear "Work In Progress" path:
   - WIP is allowed only when explicitly labeled and never claimed as done.
   - WIP must list which proofs are missing and why.
2) Standardize proof bundle format:
   - Default path: reports/verification/YYYY-MM-DD-proof.txt
   - Screenshot naming convention (route + mode + viewport)
3) Clarify doc-only changes:
   - If docs only and no code changes, tests are still required to claim done.
   - If tests cannot be run, state NOT DONE with missing proof list.
4) Add a short "Friction Reduction" section:
   - Encourage batching changes so tests run once per prompt, not per edit.

STEPS
1) Identify any contradictions between guardrails and verification docs.
2) Update .ai/VERIFICATION_REQUIRED.md with the WIP policy and proof bundle format.
3) If needed, add a short note in .ai/GUARDRAILS.md pointing to the proof bundle format.
4) Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA
- WIP workflow is explicit and does not override the done requirements.
- Proof bundle format is clear and consistent.
- No changes reduce the required quality gates.

PROOF REQUIRED
- Run full gates if you claim done (lint, build, test:unit, test:e2e).
- If you cannot run tests, explicitly say NOT DONE and list missing proof.

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 04.