# Copilot Agentic Orchestration

**Status:** Superseded on 2026-03-01
**Current canonical path:** Native Copilot custom agents in `.github/agents/` plus prompt files in `.github/prompts/`
**Unsupported path:** Repo-local CLI orchestration or `npm run ai:copilot*`

---

## Current Decision

PennyCentral keeps the native GitHub Copilot agent setup but does **not** use a repo-local Node wrapper to orchestrate those agents.

Why:

1. The approved direction is Copilot-native inside VS Code, not a headless npm wrapper.
2. Repo-local CLI orchestration added unsafe behavior:
   - non-deterministic smoke checks,
   - repo-wide review leakage on dirty worktrees,
   - missing shared-memory writer-lock protection,
   - an extra maintenance surface that duplicated native Copilot behavior.

---

## Canonical Copilot Workflow

Use these files as the source of truth:

- `.github/copilot-instructions.md`
- `.github/agents/orchestrator.md`
- `.github/agents/planner.md`
- `.github/agents/coder.md`
- `.github/agents/tester.md`
- `.github/agents/reviewer.md`
- `.github/agents/researcher.md`
- `.github/agents/documenter.md`
- `.github/prompts/implement.prompt.md`
- `.github/prompts/debug.prompt.md`
- `.github/prompts/verify.prompt.md`
- `.github/prompts/review.prompt.md`
- `.github/prompts/session-end.prompt.md`
- `.github/prompts/explore.prompt.md`

The operating rules are:

1. Use native Copilot agents and prompt files inside VS Code.
2. Keep the 7-agent PennyCentral role split.
3. Require exact scope for reviewer, tester, and documenter handoffs.
4. Require writer-lock ownership before shared-memory edits.
5. Keep approval gates for user-facing or structural work.

---

## Explicit Non-Goals

- No repo-local Copilot wrapper script
- No `ai:copilot*` npm commands
- No merge of Copilot orchestration into Claude Code or Codex flows
- No repo-wide review or verification by default when scope is ambiguous

---

## If Headless Orchestration Is Reconsidered Later

It must be proposed as a new, narrow plan with explicit founder approval.

That future proposal must prove:

1. deterministic smoke behavior,
2. scoped review and verification surfaces,
3. shared-memory writer-lock safety,
4. lower founder workload than native Copilot alone.
