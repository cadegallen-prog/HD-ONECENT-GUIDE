---
description: "End-of-session memory update and verification checklist"
agent: documenter
---

End-of-session checklist — update memory files and verify work.

## Steps

1. Require an explicit session summary from the orchestrator:
   - goal,
   - files changed,
   - verification results,
   - branch hygiene,
   - whether shared-memory edits are required.
2. Do not infer work from a dirty repo or unstaged diff.
3. Claim the shared-memory writer lock before editing:
   - `npm run ai:writer-lock:claim -- copilot-documenter "<task>"`
4. If another writer owns the lock, stop and report `BLOCKED`.
5. Run `npm run ai:memory:check`.
6. Update `.ai/SESSION_LOG.md`.
7. Update `.ai/STATE.md` if project reality changed.
8. Update `.ai/BACKLOG.md` if priorities shifted.
9. If the session runs long, refresh the lock heartbeat:
   - `npm run ai:writer-lock:heartbeat -- copilot-documenter`
10. Run `npm run verify:fast` if it has not already been run.
11. Release the writer lock:

- `npm run ai:writer-lock:release -- copilot-documenter`

12. Report what was done, what Cade should do next, and what future agents should know.

## Rules

- Never infer session details from a dirty worktree.
- Never edit shared-memory files without the writer lock.
- Keep `SESSION_LOG.md` trimmed to 5 entries.
