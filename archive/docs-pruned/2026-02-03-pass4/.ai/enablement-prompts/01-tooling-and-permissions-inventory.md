# Prompt 01: Tooling and Permissions Inventory

ROLE
You are the enablement engineer. Your job is to capture the exact current tooling, permissions, and constraints so future AI sessions stop guessing.

GOAL
Create a repo-native, non-sensitive tooling manifest that any AI tool (Codex, Claude Code, Copilot Chat) can rely on.

DO NOT

- Do not change application code.
- Do not add new dependencies.
- Do not modify instruction entrypoints yet (that is Prompt 02).
- Do not include any secrets, PII, or proprietary lists.

READ ORDER (MANDATORY)

- Root README.md (AI Canon and read order)
- .ai/STATE.md
- .ai/BACKLOG.md
- .ai/CONTRACT.md and .ai/DECISION_RIGHTS.md
- .ai/CONSTRAINTS.md, .ai/FOUNDATION_CONTRACT.md, .ai/GUARDRAILS.md
- .ai/SESSION_LOG.md
- .ai/CONTEXT.md (only if product decisions needed)
- .ai/AI-TOOLS-SETUP.md
- .ai/MCP_SERVERS.md

OUTPUT FILE
Create: .ai/TOOLING_MANIFEST.md

CONTENT REQUIRED (in the new file)

1. Environment snapshot

- OS and shell
- Node version, npm version
- Repo root path
- Date of snapshot

2. AI tools in use

- Codex (VS Code extension/CLI)
- Claude Code (VS Code extension)
- GitHub Copilot Chat (VS Code extension)
- Any other active AI tools you can confirm

3. Permissions and sandbox

- Sandbox mode
- Network access
- Approval policy
- Anything that blocks running tests or browser automation

4. MCP reality check (non-sensitive)

- Actual MCP servers available in THIS environment
- Where config lives (paths only, no secrets)
- Any drift between .ai/AI-TOOLS-SETUP.md and .ai/MCP_SERVERS.md

5. VS Code capabilities (best effort)

- Confirm if VS Code CLI is available: `code --list-extensions`
- If not available, note that and ask the user to paste extension list

6. Known friction points (short list)

- Examples: port 3001 conflicts, Playwright flake, long verification times

7. Capability gaps and recommendations

- 3-7 short items only
- Emphasize ROI and reducing retries
- Explicitly state: more tooling is not always better

STEPS

1. Collect environment details using safe local commands (no network).
2. Record findings in .ai/TOOLING_MANIFEST.md.
3. Do NOT fix any doc drift yet; only report it in the manifest.
4. Update .ai/SESSION_LOG.md and .ai/STATE.md to reference the new manifest.

ACCEPTANCE CRITERIA

- .ai/TOOLING_MANIFEST.md exists with all sections above.
- No secrets or proprietary data included.
- .ai/SESSION_LOG.md and .ai/STATE.md updated to mention the manifest.

PROOF REQUIRED

- Run full gates if you claim done (lint, build, test:unit, test:e2e).
- If you cannot run tests, explicitly say NOT DONE and list missing proof.

NEXT ACTIONS (MANDATORY)
At the end of the session, propose 1-3 next actions with reasons. Usually this means moving to Prompt 02.
