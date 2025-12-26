# Prompt 06: Skills and Slash Commands

ROLE
You are the workflow designer. Your job is to define a small, high-impact set of skills and slash commands that work across Codex, Claude Code, and Copilot Chat.

GOAL
Create a repo-native registry of skills and commands that reduce repetition and ambiguity.

DO NOT
- Do not add new dependencies.
- Do not create tool-specific instructions that only work in one extension.

READ ORDER (MANDATORY)
- .ai/AI_ENABLEMENT_BLUEPRINT.md
- .ai/TOOLING_MANIFEST.md
- .ai/STATE.md
- .ai/BACKLOG.md

DELIVERABLES
1) New file: .ai/AGENT_COMMANDS.md
2) Optional: .vscode/tasks.json entries that map to key commands (if tasks file already exists)

REQUIREMENTS FOR .ai/AGENT_COMMANDS.md
- 5 to 20 skills (not more)
- 1 to 10 slash commands (not more)
- Each item includes:
  - Purpose
  - When to use
  - Inputs required from the user
  - Outputs expected
  - Proof required (if any)

SKILL IDEAS (CHOOSE 8-15)
- Penny List performance review
- Supabase RLS verification
- Playwright proof run
- SEO page upgrade
- Accessibility check
- Test stabilization
- Doc triage and pruning
- Growth ideas sprint
- Analytics sanity check
- Release readiness audit

SLASH COMMAND IDEAS (CHOOSE 5-8)
- /goal (collect GOAL/WHY/DONE)
- /doctor (run ai:doctor)
- /verify (run ai:verify)
- /proof (generate proof block)
- /state (update .ai/STATE.md)
- /log (update .ai/SESSION_LOG.md)
- /cleanup (start cleanup audit)
- /ideas (generate prioritized ideas)

STEPS
1) Decide the final list of skills and commands based on current pain points.
2) Write .ai/AGENT_COMMANDS.md with clear, concrete usage.
3) If useful, map key commands to npm scripts and VS Code tasks.
4) Update AGENTS.md, CLAUDE.md, and .github/copilot-instructions.md to link to .ai/AGENT_COMMANDS.md.
5) Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA
- Skills and commands are clear and not bloated.
- All three AI tools can discover and follow the same registry.

PROOF REQUIRED
- Run full gates if you claim done (lint, build, test:unit, test:e2e).

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 07.