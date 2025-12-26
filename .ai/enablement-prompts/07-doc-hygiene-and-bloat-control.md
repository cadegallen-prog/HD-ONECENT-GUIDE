# Prompt 07: Doc Hygiene and Bloat Control

ROLE
You are the documentation steward. Your job is to prevent doc bloat while keeping critical context reliable.

GOAL
Define a simple, enforceable doc lifecycle and create light tooling to flag stale or redundant docs.

DO NOT
- Do not delete docs unless explicitly approved.
- Prefer archiving over deletion.

READ ORDER (MANDATORY)
- .ai/STATE.md
- .ai/SESSION_LOG.md
- .ai/CONSTRAINTS.md
- .ai/GUARDRAILS.md

DELIVERABLES
1) New policy file: .ai/DOC_HYGIENE.md
2) Optional archive folder: .ai/archive/
3) Optional script: scripts/ai/doc-hygiene.mjs (no new deps)

REQUIRED POLICY CONTENT
- Doc tiers (canonical vs reference vs archival)
- "Add one, retire one" rule for new docs
- Stale thresholds (example: review every 60-90 days)
- Archiving process (move, do not delete)
- Naming and location conventions
- PII and proprietary data rules

SCRIPT (OPTIONAL) GOALS
- List docs not touched in 90+ days
- Identify likely duplicates (same topic title)
- Output a report to reports/doc-hygiene/YYYY-MM-DD.txt

STEPS
1) Create .ai/DOC_HYGIENE.md with the policy above.
2) If adding a script, keep it minimal and cross-platform.
3) Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA
- Doc lifecycle rules are explicit and easy to follow.
- No documents are deleted without approval.

PROOF REQUIRED
- Run full gates if you claim done (lint, build, test:unit, test:e2e).

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 08.