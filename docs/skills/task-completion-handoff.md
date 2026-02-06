# Skill: Task Completion + Next-Agent Handoff

Use this at the end of meaningful work so completion is reproducible and handoff-ready.

## When to use

- Any code/UI change
- Any session where another agent may continue next
- Any task where context-loss risk is high

## Required closeout sequence

1. Verify work with proof
   - `npm run lint`
   - `npm run build`
   - `npm run test:unit`
   - `npm run test:e2e`
   - UI changes: Playwright proof screenshots + console report
2. Update memory
   - `.ai/SESSION_LOG.md` (what changed + evidence)
   - `.ai/STATE.md` (if current reality changed)
   - `.ai/BACKLOG.md` (if priorities changed)
   - `.ai/LEARNINGS.md` (if a failed approach occurred)
3. Produce handoff block
   - Follow `.ai/HANDOFF_PROTOCOL.md`
   - Include: objective/why, completion status, files, verification paths, risks, immediate next step

## Non-negotiables

- No “done” claim without proof paths.
- No session end without a next-agent handoff.
- If a key fact/decision is only in chat, persist it in `.ai/` or it is considered lost.
