# Enablement Prompt Pack

Purpose: Persistent, multi-session prompts for improving AI workflow, tooling, verification, and reliability across Codex, Claude Code, and Copilot Chat.

These prompts are designed to be copied into NEW chat sessions. Each file is a complete prompt with its own scope, steps, and acceptance criteria. Do not run multiple prompts in one chat. This prevents context drift and reduces rework.

How to use:

1. Open one prompt file below.
2. Copy the entire prompt into a new chat.
3. Complete ONLY that prompt's deliverables.
4. Update .ai/SESSION_LOG.md and .ai/STATE.md after completion.
5. Share proof per .ai/VERIFICATION_REQUIRED.md.
6. Then move to the next prompt.

Prompt order (recommended):

- 01-tooling-and-permissions-inventory.md
- 02-instruction-entrypoints-and-doc-alignment.md
- 03-guardrails-and-proof-workflow.md
- 04-automation-scripts-core.md
- 05-playwright-proof-harness.md
- 06-skills-and-slash-commands.md
- 07-doc-hygiene-and-bloat-control.md
- 08-codebase-cleanup-audit.md
- 09-idea-pipeline-and-next-actions.md

Notes:

- These prompts assume the AI follows the canonical read order in README.md and .ai/.
- Main branch only. Never create dev/develop branches.
- No PII or proprietary lists in repo changes or logs.
- Full verification gates are still required before claiming done.

At the end of each prompt, the AI must propose 1-3 next actions (usually the next prompt in this pack) with a brief reason.
