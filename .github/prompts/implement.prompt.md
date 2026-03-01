---
description: "Full implementation workflow: plan → implement → test → review → document"
agent: orchestrator
---

Execute a full implementation workflow using the native sub-agent pipeline. Each agent runs in its own isolated context window, and only its final result flows to the next stage.

## Pipeline

1. **RESEARCH** — `@researcher` gathers relevant codebase context.
2. **PLAN** — `@planner` produces a sliced implementation plan and saves it to `.ai/impl/<slug>.md`.
3. **APPROVAL** — Present the plan to Cade in plain English and wait for explicit approval.
4. **IMPLEMENT** — `@coder` implements one slice at a time.
5. **VERIFY** — `@tester` runs `npm run verify:fast` and only runs `npm run e2e:smoke` when you explicitly mark smoke as required.
6. **CHECKPOINT** — After each slice, evaluate results before proceeding.
7. **REVIEW** — `@reviewer` checks the final changes adversarially.
8. **DOCUMENT** — `@documenter` updates shared memory only after writer-lock ownership is confirmed.

## Required Handoff Bundle

Every handoff to `@coder`, `@tester`, `@reviewer`, or `@documenter` must include:

- Task goal
- Plan path
- Current slice number or work unit
- Exact files in scope
- `SMOKE: REQUIRED` or `SMOKE: NOT_REQUIRED`
- `WRITER_LOCK: OWNED` or `WRITER_LOCK: NOT_OWNED` when shared-memory edits are involved

Do not delegate without this bundle.

## Chunking Rules

- Never forward raw file contents between agents.
- Pass concise results, file paths, and the plan path only.
- If the plan has more than 5 file changes, implement in slices of 3-5 files each.
- After each slice: verify → checkpoint → proceed or stop.
- Never execute an entire multi-slice plan as one uninterrupted batch.

## Stop Conditions

- If verification fails, stop, report failure details, route back to `@coder`, and re-verify.
- If `@reviewer` finds critical issues, route back to `@coder`, then re-verify.
- If the same error persists after 2 fix attempts, escalate to Cade with plain-English options.
- If review scope is missing, stop and define the exact review surface before invoking `@reviewer`.
- If writer-lock ownership is not confirmed, do not invoke `@documenter` for shared-memory edits.

## Constraints

- Colors: always `var(--cta-primary)`, `var(--bg-*)`, `var(--text-*)`.
- Fragile files need explicit approval: `globals.css`, `store-map.tsx`, `middleware.ts`.
- `internet_sku` is backend-only.
- Dev server: port 3001; Playwright: port 3002.
- Reviewer scope must be explicit; repo-wide dirty-worktree review is not allowed.
- Shared-memory edits require the writer lock.
