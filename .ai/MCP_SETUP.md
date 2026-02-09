# MCP Setup Guide

**Purpose:** Configure MCPs (Model Context Protocol servers) so all AI tools have the same capabilities.

---

## Quick Summary

| Tool                    | Config Location         | Status                    |
| ----------------------- | ----------------------- | ------------------------- |
| **VS Code Copilot**     | `.vscode/mcp.json`      | Auto-configured (in repo) |
| **Claude Code**         | `.claude/settings.json` | Auto-configured (in repo) |
| **Codex CLI/Extension** | `~/.codex/config.toml`  | Manual (see below)        |

---

## Codex Configuration (One-Time Setup)

Codex uses a user-level config file. Copy this to your `~/.codex/config.toml`:

```toml
# Penny Central MCP Configuration for Codex
# Copy this entire block to ~/.codex/config.toml

[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE"]

[mcp_servers.git]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-git", "--repository", "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE"]

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]

[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@latest"]

[mcp_servers.supabase]
command = "npx"
args = ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref", "djtejotbcnzzjfsogzlc"]

[mcp_servers.supabase.env]
SUPABASE_ACCESS_TOKEN = "${SUPABASE_ACCESS_TOKEN}"

[mcp_servers.interactive]
command = "npx"
args = ["-y", "interactive-mcp"]

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

**Getting your Supabase Access Token:**

1. Go to https://supabase.com/dashboard/account/tokens
2. Generate a new access token
3. Set it as a **user environment variable** on your machine: `SUPABASE_ACCESS_TOKEN`

---

## Available MCPs

| MCP            | What It Does                        | All 3 Tools? |
| -------------- | ----------------------------------- | ------------ |
| **filesystem** | Read/write project files            | Yes          |
| **git**        | Git operations (status, diff, log)  | Yes          |
| **github**     | GitHub API (PRs, issues, repos)     | Yes          |
| **supabase**   | Direct database access, SQL queries | Yes          |

---

## What Supabase MCP Enables

With Supabase MCP, any AI tool can:

- Query the penny list directly from the database
- Check store locations
- Run SQL queries
- Manage database schema
- View table structures

Example: "Show me the 10 most recent penny items from the database"

---

## Troubleshooting

### MCPs not working in Copilot

1. Make sure VS Code is v1.102+
2. Reload VS Code after adding `.vscode/mcp.json`
3. Check `Output > GitHub Copilot` for errors

### MCPs not working in Claude Code

1. Restart the Claude Code extension
2. Check `.claude/settings.json` syntax

### MCPs not working in Codex

1. Check `~/.codex/config.toml` exists
2. Use `mcp_servers` (snake_case), not `mcpServers` or `mcp-servers`
3. Update Codex if needed (older versions don't have `codex mcp list`)
4. Run `codex mcp list` to verify

---

## Sources

- [VS Code MCP Docs](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Supabase MCP](https://supabase.com/docs/guides/getting-started/mcp)
- [Codex MCP Config](https://developers.openai.com/codex/mcp/)
