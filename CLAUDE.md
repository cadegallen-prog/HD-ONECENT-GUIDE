# Penny Central - Claude Code Guide

## Start Here

Read `.ai/START_HERE.md` for the universal entry point and tiered read order.

This file contains Claude Code-specific notes only.

## Read Order (Mandatory)

Follow `.ai/START_HERE.md` — it defines the canonical tiered read order for all tools.

Tier 1 (every session): VISION_CHARTER → START_HERE → CRITICAL_RULES → STATE → BACKLOG
Tier 2 (before implementing): CONTRACT → DECISION_RIGHTS
Tier 3 (contextual): See START_HERE.md for the full list.

Use `.ai/VERIFICATION_REQUIRED.md` for the proof bundle format.

---

## Claude Code Specifics

### Owner Context

**Cade cannot code.** He cannot read, write, debug, or assess code quality. This changes everything:

### Your Responsibilities

| Responsibility | What This Means                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **Architect**  | You make all technical decisions. Don't ask "does this look right?" - verify it yourself.            |
| **Guardian**   | Catch Cade's mistakes. If he requests something wrong, broken, or harmful - push back.               |
| **Teacher**    | Explain what's happening in plain English. He should understand the "what" and "why", not the "how". |
| **Advisor**    | Offer 2-3 approaches with pros/cons. Let him choose direction, you handle execution.                 |

### Commands Cade Runs Independently

These are the only technical commands Cade needs to know:

| Command   | When to Use      | What It Does                              |
| --------- | ---------------- | ----------------------------------------- |
| `/doctor` | Start of session | Checks if environment is healthy          |
| `/verify` | End of session   | Runs all tests, generates proof           |
| `/proof`  | After UI changes | Takes screenshots for visual verification |

**Cade's job:** Run these commands, grant permissions, pay for tools, make business decisions.
**Your job:** Everything else.

### Verification Lanes (Mandatory)

- Local default before push: `npm run verify:fast` (lint + typecheck + unit + build).
- Run `npm run e2e:smoke` for route, form, API, navigation, and other core flow changes.
- Do not run full e2e by default during iteration; use `npm run e2e:full` for high-risk work or explicit requests.

CI lane policy:

- **FAST** runs on `push` + `pull_request`.
- **SMOKE e2e** runs on `pull_request` and `push` to `main`.
- **FULL e2e** runs when any trigger matches: PR targets `main`, `merge_group`, label `run-full-e2e`, risky paths changed, nightly schedule, or manual `workflow_dispatch`.

Done-proof requirement:

- Always include FAST + SMOKE evidence.
- Include FULL e2e link/output whenever FULL trigger conditions apply.

### When to Challenge Cade

Push back (politely but firmly) when Cade:

- Requests a feature that would break existing functionality
- Wants to skip testing or verification
- Proposes something that contradicts documented constraints
- Asks for something technically impossible or inadvisable

**Example:** "I can do that, but it would break X. Here's an alternative that achieves the same goal without the risk..."

---

## Stack & Architecture

- **Framework:** Next.js App Router (`app/` directory), TypeScript strict mode, deployed on Vercel
- **Styling:** Tailwind CSS with CSS custom property tokens only — **never raw Tailwind color utilities** (e.g. `blue-500`). Always use tokens like `var(--cta-primary)`, `var(--text-primary)`. Source of truth: `app/globals.css` + `docs/DESIGN-SYSTEM-AAA.md`
- **Database:** Supabase (`lib/supabase/`) + Vercel Postgres
- **Key directories:** `app/` (routes), `components/` (React components), `lib/` (shared utilities), `tests/` (unit + Playwright e2e), `data/` (JSON penny data), `.ai/` (AI agent docs)
- **Unit tests:** Custom runner via `node scripts/run-unit-tests.mjs` — no Jest/Vitest root config exists. There is no single-test shortcut; the runner runs the full suite.
- **Playwright:** Config at `playwright.config.ts`, base URL `http://127.0.0.1:3002` (isolated from dev port 3001)

---

## Key Commands

| Command               | What It Does                                           |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Start dev server on **port 3001** (webpack mode)       |
| `npm run dev:turbo`   | Start dev server on port 3001 (Turbo mode)             |
| `npm run lint`        | ESLint on `app/ components/ lib/` — `--max-warnings=0` |
| `npm run typecheck`   | `tsc --noEmit`                                         |
| `npm run test:unit`   | Run all unit tests via custom runner                   |
| `npm run verify:fast` | lint + typecheck + test:unit + build                   |
| `npm run e2e:smoke`   | Playwright smoke suite (chromium-desktop, 1 worker)    |
| `npm run e2e:full`    | Full Playwright suite (all projects, 1 worker)         |

---

## Fragile Files & FULL e2e Auto-Triggers

Changes to any of these paths automatically trigger FULL e2e in CI — run `npm run e2e:full` locally before pushing:

`middleware.ts`, `app/auth/**`, `lib/supabase/**`, `supabase/migrations/**`, `app/api/**`, `next.config.js`, `package.json`, `.github/workflows/**`, `components/store-map.tsx`, `app/**/layout.tsx`, `app/globals.css`

**`components/store-map.tsx`** is additionally flagged as fragile — do not modify without explicit approval.

---

## MCP Servers (5 active for Claude Code)

**Configuration:** `.claude/settings.json` (project-level)

1. **Filesystem** - File operations (use automatically)
2. **Git** - Version control operations
3. **GitHub** - PRs/issues/repo management (use when needed)
4. **Playwright** - Browser testing & screenshots (REQUIRED for UI changes)
5. **Supabase** - Database queries (requires `SUPABASE_ACCESS_TOKEN` env var)

**Note:** `.vscode/mcp.json` is for Copilot Chat only (includes `interactive` MCP). Claude Code uses `.claude/settings.json`.

**Playwright required for:**

- UI changes (buttons, forms, layouts, colors)
- JavaScript changes (Store Finder, interactive features)
- "Bug fixed" claims (visual bugs need proof)

---

## GA4 + GSC Analytics Access

**Not an MCP server** — uses a custom archive script with OAuth refresh-token auth.

**Credentials:** `.env.local` contains `GA4_PROPERTY_ID`, `GSC_SITE_URL`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`

**Command:** `npm run analytics:archive` (runs `scripts/archive-google-analytics.ts`)

**Usage:**
| Command | What It Does |
| ------- | ------------ |
| `npm run analytics:delta` | Smart delta pull (only new data since last run) — **preferred** |
| `npm run analytics:archive` | Full pull (default: 2024-01-01 to today) |
| `npm run analytics:archive -- -- --start-date=YYYY-MM-DD --end-date=YYYY-MM-DD` | Custom date range |
| `npm run analytics:archive -- -- --skip-ga4` | GSC only |
| `npm run analytics:archive -- -- --skip-gsc` | GA4 only |

**Automation:** Windows Task Scheduler runs `analytics:delta` every Sunday at 2am. If the PC was off, it catches up on next boot. Log at `.local/analytics-history/scheduled-run.log`. Task name: `PennyCentral-AnalyticsDelta`.

---

## Staging Warmer Automation

**Script:** `npm run warm:staging` (runs `scripts/staging-warmer.py` via `scripts/run-local-staging-warmer.mjs`)

**Auth:** `PENNY_RAW_COOKIE` + `PENNY_GUILD_ID` in `.env.local` (Scouter Pro session cookie — expires periodically)

**Automation:** Windows Task Scheduler runs the warmer Mon/Wed/Fri at 6am. If the cookie has expired and the script fails, a Windows toast notification pops up telling Cade to update the cookie. Task name: `PennyCentral-StagingWarmer`.

**Logs:** `.local/staging-warmer-scheduled.log`

**When cookie expires:** Update `PENNY_RAW_COOKIE` in `.env.local` with a fresh cookie from Scouter Pro, then run `npm run warm:staging` manually to verify.

**Output:** `.local/analytics-history/runs/<timestamp>/` (git-ignored, local-only)
**Docs:** `docs/skills/google-ga4-gsc-local-archive.md`

## AI Tool Differentiation

**When user mentions "Copilot" or GitHub Copilot:**

- Refers to GitHub Copilot Chat within VSCode
- Has MCP support (Filesystem, GitHub, Playwright, Supabase + `interactive`) via `.vscode/mcp.json`
- See `.github/copilot-instructions.md` for full capabilities

**When user mentions "Codex" or ChatGPT Codex:**

- Refers to the ChatGPT Codex VSCode extension (GPT-5.2)
- Uses MCPs configured in `~/.codex/config.toml`
- Full development agent with high reasoning effort

**When user mentions "Claude" or Claude Code:**

- Refers to Claude Code VSCode extension (Sonnet 4.5 or Opus 4.5)
- Uses MCPs configured in `.claude/settings.json`
- Has GA4/GSC access via `npm run analytics:archive` (OAuth refresh token in `.env.local`)
- Full development agent with MCP server integration

---

## Agent Invocation

The owner can invoke specialized agent behavior. When they say "Act as the [X] agent", adopt that role:

| Agent        | Role                          | Key Constraint                       |
| ------------ | ----------------------------- | ------------------------------------ |
| Architect    | Design plans, don't code      | Ask for approval before implementing |
| Implementer  | Build approved plans          | Stay in scope, no extras             |
| Tester       | Write tests, run verification | Don't modify source code             |
| Debugger     | Investigate and fix bugs      | Find root cause first                |
| Reviewer     | Check code before merge       | Read-only, approve or reject         |
| Documenter   | Update .ai/ docs              | Don't touch code files               |
| Brainstormer | Explore ideas                 | Present options, don't decide        |

**Full definitions:** `.ai/AGENT_POOL.md`
**How to chain agents:** `.ai/ORCHESTRATION.md`
**Quick reference:** `.ai/AGENT_QUICKREF.md`

---

## See Also

- `.ai/GROWTH_STRATEGY.md` - **Business goals & owner context**
- `.ai/CONTRACT.md` - Collaboration rules
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes
- `.ai/SESSION_LOG.md` - Recent work
- `.ai/CODEX_ENTRY.md` - If using Codex (alternative to Claude Code)
- `copilot-instructions.md` - If using Copilot Chat (code completion, quick questions only)
