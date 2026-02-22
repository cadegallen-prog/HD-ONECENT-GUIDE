# Codex User Start Here

You are using **Codex** (ChatGPT, GPT-5.2 with full MCP support via `~/.codex/config.toml`).

---

## Start Here

Read `VISION_CHARTER.md` first, then `.ai/START_HERE.md` for the universal entry point and read order.

This file contains Codex-specific notes only.

## Read Order (Mandatory)

Follow `.ai/START_HERE.md` — it defines the canonical tiered read order for all tools.

Tier 1 (every session): START_HERE → CRITICAL_RULES → STATE → BACKLOG
Tier 2 (before implementing): CONTRACT → DECISION_RIGHTS
Tier 3 (contextual): See START_HERE.md for the full list.

Use `.ai/VERIFICATION_REQUIRED.md` for the proof bundle format.

---

## Codex Specifics

## MCP Configuration

Your config file: `~/.codex/config.toml`

Active servers:

1. **Filesystem** - File operations (automatically available)
2. **Git** - Version control operations
3. **GitHub** - PR/issue/repo management (use when needed)
4. **Playwright** - Browser testing & screenshots (REQUIRED for UI changes)
5. **Supabase** - Database queries (requires env vars)
6. **OpenAI Developer Docs** - API reference

**Other agents' MCP configs:**

- **Copilot:** `.vscode/mcp.json` (includes `interactive` MCP — Copilot-only)
- **Claude Code:** `.claude/settings.json` (project-level)

---

## GA4 + GSC Analytics Access

**Not an MCP server** — uses a custom archive script with OAuth refresh-token auth.

**Credentials:** `.env.local` contains `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`

| Command                     | What It Does                                                    |
| --------------------------- | --------------------------------------------------------------- |
| `npm run analytics:delta`   | Smart delta pull (only new data since last run) — **preferred** |
| `npm run analytics:archive` | Full pull (default: 2024-01-01 to today)                        |

**Automation:** Windows Task Scheduler runs `analytics:delta` every Sunday at 2am. Catches up on next boot if PC was off. Task: `PennyCentral-AnalyticsDelta`. Log: `.local/analytics-history/scheduled-run.log`.

**Output:** `.local/analytics-history/runs/<timestamp>/` (git-ignored, local-only)

---

## Staging Warmer Automation

**Script:** `npm run warm:staging` (scrapes Scouter Pro → populates item cache in Supabase)

**Auth:** `PENNY_RAW_COOKIE` + `PENNY_GUILD_ID` in `.env.local` (session cookie — expires periodically)

**Automation:** Windows Task Scheduler runs Mon/Wed/Fri at 6am. On failure (expired cookie), a Windows toast notification alerts Cade. Task: `PennyCentral-StagingWarmer`. Log: `.local/staging-warmer-scheduled.log`.

**When cookie expires:** Update `PENNY_RAW_COOKIE` in `.env.local` with fresh cookie from Scouter Pro.

---

## See Also

- `.ai/AGENT_POOL.md` - Specialized agent roles
- `.ai/ORCHESTRATION.md` - How to chain agents
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes to avoid
- `.ai/SESSION_LOG.md` - Recent work history
