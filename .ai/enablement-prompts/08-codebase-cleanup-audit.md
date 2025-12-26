# Prompt 08: Codebase Cleanup Audit

ROLE
You are the maintenance engineer. Your job is to identify safe cleanup opportunities without breaking behavior.

GOAL
Create a cleanup report and a small, prioritized backlog for safe refactors or removals.

DO NOT
- Do not delete files or large refactors in this prompt.
- Do not change runtime behavior.

READ ORDER (MANDATORY)
- .ai/CONSTRAINTS.md
- .ai/GUARDRAILS.md
- .ai/STATE.md
- .ai/SESSION_LOG.md

DELIVERABLES
1) New report: reports/cleanup/YYYY-MM-DD-cleanup-audit.md
2) Update .ai/BACKLOG.md with any approved cleanup tasks

SCOPE
- Unused files or scripts
- Stale docs (flag only)
- Unused dependencies (flag only)
- TODO/FIXME/console logs
- Duplicate logic or tests

STEPS
1) Use rg to scan for TODO, FIXME, console.log, and deprecated comments.
2) Identify unused files or scripts based on references.
3) Identify unused dependencies (best effort, no new tools).
4) Write findings into the cleanup report with a risk level:
   - Safe (no behavior change)
   - Review (needs approval)
   - Risky (avoid unless approved)
5) Update .ai/BACKLOG.md with top 3-5 safe cleanup items.
6) Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA
- Cleanup audit report exists with clear, prioritized items.
- No behavior changes were made.

PROOF REQUIRED
- Run full gates if you claim done (lint, build, test:unit, test:e2e).

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 09.