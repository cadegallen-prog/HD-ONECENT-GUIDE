# MCP Baseline (Required Everywhere)

**Purpose:** Single source of truth for the minimum MCP servers every tool must have (Copilot, Claude Code, Codex). Optional servers are allowed but must be documented elsewhere.

## Required baseline

- **filesystem** — read/write repo files
- **github** — PRs/issues/status checks
- **playwright** — screenshots + browser automation (proof for UI changes)
- **supabase** — DB access for penny list and related data
- **interactive** — user input/clarification during complex tasks

> Note: `@modelcontextprotocol/server-git` is not published; we rely on `github` MCP for repo status/PR data and native git CLI for local git ops.

## Config locations (tool-specific shims)

- **Copilot (VS Code):** `.vscode/mcp.json`
- **Claude Code:** `.claude/settings.json`
- **Codex:** `~/.codex/config.toml` (user-level; copy from `.ai/MCP_SETUP.md`)

## Secrets

- Supabase credentials must come from environment variables (never hardcoded in repo-tracked files):
  - `SUPABASE_URL`
  - `SUPABASE_ACCESS_TOKEN`

## If something is missing

- Run `npm run ai:doctor` (once updated) or manually check the configs above.
- Add any missing baseline server to the tool’s config and restart the extension.

## Optional servers

- None defined today. If you add optional servers, document them in `.ai/TOOLING_MANIFEST.md` under "Optional MCPs" and keep this baseline unchanged.
