# Codex User Start Here

You are using **Codex** (ChatGPT, GPT-5.2 with full MCP support via `~/.codex/config.toml`).

---

## Start Here

Read `VISION_CHARTER.md` first, then `.ai/START_HERE.md` for the universal entry point and read order.

This file contains Codex-specific notes only.

## Read Order (Mandatory)

Follow the sequence in `.ai/START_HERE.md`:

1. VISION_CHARTER.md
2. START_HERE.md
3. CRITICAL_RULES.md
4. STATE.md
5. BACKLOG.md
6. CONTRACT.md
7. DECISION_RIGHTS.md

**First session only:** Read `GROWTH_STRATEGY.md` for business context

**Then complete the Alignment Gate before any edits:** GOAL / WHY / DONE MEANS / NOT DOING / CONSTRAINTS / ASSUMPTIONS / CHALLENGES

Use `.ai/USAGE.md` (Habit 2) for the task template and `.ai/VERIFICATION_REQUIRED.md` for the proof bundle format.

---

## Codex Specifics

## MCP Configuration

Your config file: `~/.codex/config.toml`

Verify all 5 servers are configured:

1. **Filesystem** - File operations (automatically available)
2. **GitHub** - PR/issue/repo management (use when needed)
3. **Playwright** - Browser testing & screenshots (REQUIRED for UI changes)
4. **Supabase** - Database queries (optional, requires env vars)
5. **Vercel** - Deployment management (optional)

**Reference template:** `.ai/CODEX_CONFIG_SNIPPET.toml`

---

## See Also

- `.ai/AGENT_POOL.md` - Specialized agent roles
- `.ai/ORCHESTRATION.md` - How to chain agents
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes to avoid
- `.ai/SESSION_LOG.md` - Recent work history
