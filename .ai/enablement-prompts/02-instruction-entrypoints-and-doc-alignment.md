# Prompt 02: Instruction Entrypoints and Doc Alignment

ROLE
You are the alignment engineer. Your job is to remove contradictory instructions so Codex, Claude Code, and Copilot behave the same.

GOAL
Make all instruction entrypoints and core AI workflow docs consistent with the canonical read order and the tooling manifest.

DO NOT

- Do not change product code.
- Do not add new dependencies.
- Do not invent MCP servers that are not actually configured.

READ ORDER (MANDATORY)

- Root README.md (AI Canon and read order)
- .ai/TOOLING_MANIFEST.md (from Prompt 01)
- .ai/AI_ENABLEMENT_BLUEPRINT.md
- .ai/AI-TOOLS-SETUP.md
- .ai/MCP_SERVERS.md
- AGENTS.md
- CLAUDE.md
- .github/copilot-instructions.md

TARGET FILES TO ALIGN

- README.md (root)
- AGENTS.md
- CLAUDE.md
- .github/copilot-instructions.md
- .ai/AI-TOOLS-SETUP.md
- .ai/MCP_SERVERS.md
- .ai/AI_ENABLEMENT_BLUEPRINT.md

DELIVERABLES

1. Instruction entrypoints must all reference the same canonical read order.
2. MCP documentation must match reality from .ai/TOOLING_MANIFEST.md.
3. Add a single pointer to the Enablement Prompt Pack:
   - .ai/enablement-prompts/README.md
   - Mention: use these prompts for multi-session enablement work.

STEPS

1. Compare the read order and rules across all entrypoints. List conflicts.
2. Update each entrypoint so it points to the root README and the canonical read order.
3. Reconcile MCP docs:
   - If AI-TOOLS-SETUP.md and MCP_SERVERS.md disagree, align both to the manifest.
   - Remove or clearly mark any outdated MCP lists.
4. Add a short note in AI_ENABLEMENT_BLUEPRINT.md that the prompt pack is the preferred way to run enablement work.
5. Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA

- No contradictions between entrypoints.
- MCP docs reflect the actual configured servers.
- Enablement prompt pack is discoverable from AI_ENABLEMENT_BLUEPRINT.md.

PROOF REQUIRED

- Run full gates if you claim done (lint, build, test:unit, test:e2e).
- If you cannot run tests, explicitly say NOT DONE and list missing proof.

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 03.
