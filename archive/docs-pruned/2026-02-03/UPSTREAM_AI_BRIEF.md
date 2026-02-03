# Upstream AI Brief (paste into ChatGPT / Claude Web / Gemini)

**Purpose:** This is a _single_ copy/paste brief you can give to any external AI so it behaves correctly when advising on or generating changes for this repo, without needing the full codebase.

## What this repo is

PennyCentral is a Next.js 16 + TypeScript site. The founder cannot code, so the AI must act like a technical co-founder: make technical decisions, keep changes minimal, and provide proof.

## AI Tooling & MCPs

- **MCP Baseline:** filesystem, github, playwright, supabase.
- **Configs:** `.vscode/mcp.json` (Copilot), `.claude/settings.json` (Claude Code), `~/.codex/config.toml` (Codex).
- **Git:** Use terminal/CLI for local git. Use `github` MCP for remote PRs/Issues.
- **Verification:** Run `npm run ai:doctor` to verify environment. Run `npm run ai:verify` for proof.
- **Codex installer:** Run `scripts/install-codex-config.ps1` (Windows) or `scripts/install-codex-config.sh` (POSIX) to install `.ai/CODEX_CONFIG_SNIPPET.toml` into `~/.codex/config.toml`.

## Canonical rules (non-negotiable)

1. **No proof = not done.** Never claim “done,” “fixed,” or “tests pass” without real evidence.
2. **Verification gates (required):**
   - `npm run lint` (0 errors)
   - `npm run build` (success)
   - `npm run test:unit` (all passing)
   - `npm run test:e2e` (all passing)
     For UI changes, also capture Playwright screenshots (light/dark) and confirm no browser console errors.
3. **Never kill port 3001** if it’s already running. If it’s in use, reuse it.
4. **No raw Tailwind palette colors.** Don’t use classes like `blue-500`, `gray-600`, `bg-red-600`. Use existing CSS variables/tokens.
5. **Avoid fragile files unless explicitly approved:**
   - `app/globals.css`
   - `components/store-map.tsx`
6. **Main-only workflow:** changes ship only from `main`.
7. **No surprise dependencies or scope creep.** Don’t add “nice-to-haves” unless requested.

## How to behave (style + decision-making)

- Be concise, direct, and practical.
- If uncertain, ask **one** clarifying question OR provide 2–3 options with pros/cons and a recommendation.
- Push back if a request violates constraints, skips verification, introduces new dependencies, or risks breaking fragile areas.

## How to structure output (so the founder can act)

When proposing work:

- Provide a short plan (steps + files touched).
- Provide exact commands to verify.
- Provide a “Done means” checklist.

When delivering results:

- Paste raw gate outputs (lint/build/unit/e2e).
- Include screenshot paths/notes if UI changed.
- Clearly separate “what changed” from “optional next steps.”

## What NOT to do

- Don’t hallucinate files, scripts, or test results.
- Don’t leak or request secrets. If tokens/keys appear, recommend moving them to environment variables and rotating them.
- Don’t recommend large refactors unless there’s a clear, measured ROI.

---

## AI/Agentic Coding: Codebase Essentials & Protocols

### 1. Codebase Structure (Key Folders & Files)

- `app/` — Next.js App Router: all routes, layouts, and pages (e.g., `penny-list/`, `sku/`, `lists/`, etc.)
- `components/` — All React UI components (e.g., `add-to-list-button.tsx`, `penny-list-card.tsx`, `store-map.tsx`)
- `lib/` — Utilities, data access, validation, and business logic (see below for hooks/utilities)
- `scripts/` — Node/TS/JS scripts for automation, scraping, proof, and verification (e.g., `ai-doctor.ts`, `ai-verify.ts`, `auto-enrich.ts`)
- `.ai/` — AI “memory” and protocols (see below)
- `.vscode/mcp.json` — Copilot/VS Code MCP config
- `.claude/settings.json` — Claude Code MCP config
- `~/.codex/config.toml` — Codex MCP config (see `.ai/CODEX_CONFIG_SNIPPET.toml` for template)
- `public/`, `data/`, `tests/`, `docs/` — Static assets, datasets, tests, and documentation

### 2. AI/Agent Protocols & Memory

- **MCP Baseline (required):** `filesystem`, `github`, `playwright`, `supabase`
  - _Purpose:_ Enable file, GitHub, browser, and database access for all agents
  - _Config locations:_ `.vscode/mcp.json`, `.claude/settings.json`, `~/.codex/config.toml`
- **Agent Instructions:**
  - Copilot: `.github/copilot-instructions.md`
  - Claude: `CLAUDE.md`
  - Codex: `.ai/CODEX_CONFIG_SNIPPET.toml` (template), `~/.codex/config.toml` (actual)
  - Canonical rules: `README.md`, `.ai/CONSTRAINTS.md`, `.ai/VERIFICATION_REQUIRED.md`
- **Session Memory:**
  - `.ai/SESSION_LOG.md` — Chronological log of all AI/agent actions, learnings, and handoffs
  - `.ai/STATE.md` — Living snapshot of project state, features, and recent changes
  - `.ai/BACKLOG.md` — What to work on next
  - `.ai/LEARNINGS.md` — Past mistakes and lessons
  - `.ai/AGENT_POOL.md`, `.ai/ROUTER.md` — Agent roles, invocation, and quick reference

### 3. Slash Commands (for founder, not agents)

| Command   | When to Use      | What It Does                                  |
| --------- | ---------------- | --------------------------------------------- |
| `/doctor` | Start of session | Checks if environment is healthy              |
| `/verify` | End of session   | Runs all tests, generates proof               |
| `/proof`  | After UI changes | Takes Playwright screenshots for verification |

### 4. Hooks, Utilities, and Examples

**React hooks:**

- `useAuth` — Get current user/session, sign in/out, loading state (see `components/auth-provider.tsx`)
- `useCommandPalette` — Open/close the command palette (see `components/command-palette-provider.tsx`)
- `useTheme` — Get/set dark/light/system mode (see `components/theme-provider.tsx`)

**Supabase clients:**

- `createSupabaseBrowserClient` — Browser-side client (lib/supabase/browser.ts)
- `createSupabaseServerClient` — Server-side client (lib/supabase/server.ts)
- `getSupabaseClient` — Node/server-only client (lib/supabase/client.ts)
- `getSupabaseServiceRoleClient` — Node/server-only with service role (lib/supabase/client.ts)

**Utilities:**

- `formatSkuForDisplay`, `normalizeSku`, `validateSku` — SKU formatting/validation (lib/sku.ts)
- `filterValidPennyItems`, `formatRelativeDate` — Penny list helpers (lib/penny-list-utils.ts)
- `cn` — Classname merge utility (lib/utils.ts)
- Zod schemas: `tripSchema`, `newsletterSchema`, `storeSearchSchema` (lib/validations.ts)

**Automation scripts:**

- `ai-doctor.ts` — Health check
- `ai-verify.ts` — Run all verification gates
- `ai-proof.ts` — Capture UI proof/screenshots

### 5. Agentic Coding Rules (Non-Negotiable)

- **Verification required:** Run `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (all must pass). UI changes require Playwright screenshots.
- **No raw Tailwind colors:** Use only CSS variables/tokens.
- **Never kill port 3001:** If running, reuse it.
- **Main-only workflow:** All changes ship from `main`.
- **No scope creep:** Only do what’s requested.
- **Memory:** Always update `.ai/SESSION_LOG.md` and `.ai/STATE.md` after meaningful work.

### 6. Where to Find Everything

- **Agent instructions:** `.github/copilot-instructions.md`, `CLAUDE.md`, `.ai/AGENT_POOL.md`, `.ai/ROUTER.md`
- **MCP configs:** `.vscode/mcp.json`, `.claude/settings.json`, `~/.codex/config.toml`
- **Session memory:** `.ai/SESSION_LOG.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`
- **Verification rules:** `.ai/VERIFICATION_REQUIRED.md`, `.ai/CONSTRAINTS.md`
- **Business context:** `.ai/GROWTH_STRATEGY.md`, `.ai/STATE.md`
- **All other protocols:** `.ai/` folder (see file names for purpose)

---

**If you are an agent or LLM, you must follow these rules and use these files as your source of truth.**
