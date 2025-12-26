# Tooling Manifest

**Last verified:** December 26, 2025

## npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| ai:doctor | `npm run ai:doctor` | Pre-flight health check |
| ai:verify | `npm run ai:verify` | Run all 4 quality gates |
| ai:proof | `npm run ai:proof -- [routes]` | Screenshot capture |
| lint | `npm run lint` | ESLint check |
| build | `npm run build` | Next.js build |
| test:unit | `npm run test:unit` | Unit tests |
| test:e2e | `npm run test:e2e` | Playwright E2E tests |
| lint:colors | `npm run lint:colors` | Block raw Tailwind colors |
| security:scan | `npm run security:scan` | Block PII in commits |

## Slash Commands (Claude Code)

| Command | Purpose |
|---------|---------|
| /doctor | Run pre-flight health check |
| /verify | Run all quality gates + generate proof |
| /proof | Capture screenshots of routes |
| /session-start | Start session with proper context |
| /session-end | End session with verification |

## MCP Servers (5 Active - Unified Across All Tools)

MCPs are configured for ALL THREE AI tools:

| Config File | Tool |
|-------------|------|
| `.vscode/mcp.json` | VS Code Copilot |
| `.claude/settings.json` | Claude Code |
| `~/.codex/config.toml` | Codex (see `.ai/MCP_SETUP.md`) |

| MCP | Purpose |
|-----|---------|
| Filesystem | Read/write project files |
| Git | Version control operations |
| GitHub | PRs, issues, actions |
| Supabase | Direct database access, SQL queries |
| Vercel | Deployment info (Claude only) |

**Setup Guide:** `.ai/MCP_SETUP.md`

## Git Hooks (Husky)

| Hook | Runs |
|------|------|
| pre-commit | `security:scan` + `lint:colors` |

## Fixture Mode

When `PLAYWRIGHT=1` is set, the app uses deterministic fixture data instead of live Supabase calls. This enables stable E2E tests.

| Fixture File | Purpose |
|--------------|---------|
| `data/penny-list.json` | Penny list items |
| `data/home-depot-stores.json` | Store locations |

Playwright automatically sets `PLAYWRIGHT=1` when running tests (see `playwright.config.ts`).

## Agent System

| Document | Purpose |
|----------|---------|
| `.ai/AGENT_POOL.md` | All agent definitions (Architect, Implementer, Tester, etc.) |
| `.ai/ORCHESTRATION.md` | How to chain agents together |
| `.ai/AGENT_QUICKREF.md` | One-page cheat sheet for owner |

**How to invoke:** Say "Act as the [agent name] agent"

| Agent | Purpose |
|-------|---------|
| Architect | Design plans, don't code |
| Implementer | Build approved plans |
| Tester | Write tests, run verification |
| Debugger | Investigate and fix bugs |
| Reviewer | Check code before merge |
| Documenter | Update .ai/ docs |
| Brainstormer | Explore ideas |

## Parallel Agent Patterns

Use parallel agents for:
- UI + Tests (separate ownership)
- API + Frontend integration
- Core implementation + Documentation

Avoid parallel agents for:
- Debugging (needs shared context)
- Refactoring (naming drift risk)
- Single-file changes

See `.ai/ORCHESTRATION.md` for full patterns.
