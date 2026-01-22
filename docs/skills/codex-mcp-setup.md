# Codex MCP setup (and why env vars “don’t work”)

**When to use:** Codex can’t see MCP tools/resources, MCP servers aren’t listed, or secrets/env vars aren’t available to tools.

## 1) Make sure Codex is new enough

Run:

```bash
codex --version
codex mcp list
```

If `codex mcp list` errors, update Codex (older versions don’t support MCP management).

## 2) Fix global npm installs (Windows)

If `npm install -g ...` fails, your npm `prefix` may be pointing at a non-existent path.

Check:

```bash
npm config get prefix
```

Recommended Windows prefix:

- `C:\Users\<you>\AppData\Roaming\npm`

Then install/update Codex:

```bash
npm install -g @openai/codex@latest
```

## 3) Use `mcp_servers` (snake_case) in `~/.codex/config.toml`

Codex uses the `mcp_servers` table (snake_case). Example:

```toml
[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

Repo reference: `.ai/MCP_SETUP.md` and `.ai/CODEX_CONFIG_SNIPPET.toml`.

## 4) Why secrets/env vars “don’t work”

Two common causes:

1. **The env var isn’t actually set where Codex is running.** If you set it in Vercel, Codex on your laptop won’t see it.
2. **Codex filtered it.** Set:

```toml
[shell_environment_policy]
inherit = "all"
ignore_default_excludes = true
```

For MCP servers, prefer:

```toml
[mcp_servers.supabase.env]
SUPABASE_ACCESS_TOKEN = "${SUPABASE_ACCESS_TOKEN}"
```

## 5) Verify MCPs are loaded

Run:

```bash
codex mcp list
```

Restart VS Code / Codex after editing `~/.codex/config.toml` or changing environment variables.

## 6) “Uninhibited” mode (use sparingly)

If you explicitly want to run without sandboxing for a single session:

```bash
codex --dangerously-bypass-approvals-and-sandbox
```

This is powerful and risky; prefer `--full-auto` (sandboxed) for day-to-day work.
