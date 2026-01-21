# Penny Central - Claude Code Guide

## Start Here

Read `.ai/START_HERE.md` for the universal entry point and read order.

This file contains Claude Code-specific notes only.

## Read Order (Mandatory)

Follow the sequence in `.ai/START_HERE.md`:

1. START_HERE.md
2. CRITICAL_RULES.md
3. STATE.md
4. BACKLOG.md
5. CONTRACT.md
6. DECISION_RIGHTS.md

**First session only:** Read `GROWTH_STRATEGY.md` for business context

**Then ask:** GOAL / WHY / DONE for this session

Use `.ai/USAGE.md` (Habit 2) for the task template and `.ai/VERIFICATION_REQUIRED.md` for the proof bundle format.

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

### When to Challenge Cade

Push back (politely but firmly) when Cade:

- Requests a feature that would break existing functionality
- Wants to skip testing or verification
- Proposes something that contradicts documented constraints
- Asks for something technically impossible or inadvisable

**Example:** "I can do that, but it would break X. Here's an alternative that achieves the same goal without the risk..."

---

## MCP Servers (5 available)

**Configuration:** `.vscode/mcp.json` (for Claude Code only)

1. **Filesystem** - File operations (use automatically)
2. **GitHub** - PRs/issues/repo management (use when needed)
3. **Playwright** - Browser testing & screenshots (REQUIRED for UI changes)
4. **Supabase** - Database queries during development (optional, requires VSCode restart)
5. **Vercel** - Deployment management (optional, requires VSCode restart)

**Playwright required for:**

- UI changes (buttons, forms, layouts, colors)
- JavaScript changes (Store Finder, interactive features)
- "Bug fixed" claims (visual bugs need proof)

**Note:** Git MCP removed (package doesn't exist) - use Bash tool for git operations instead.

## AI Tool Differentiation

**When user mentions "Copilot" or GitHub Copilot:**

- Refers to GitHub Copilot Chat within VSCode
- No MCP server support
- Primarily code completion and inline chat

**When user mentions "Codex" or ChatGPT Codex:**

- Refers to the ChatGPT Codex VSCode extension (GPT-5.2)
- Uses MCPs configured in `~/.codex/config.toml`
- Full development agent with high reasoning effort

**When user mentions "Claude" or Claude Code:**

- Refers to Claude Code VSCode extension (Sonnet 4.5 or Opus 4.5)
- Uses MCPs configured in `.vscode/mcp.json`
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
