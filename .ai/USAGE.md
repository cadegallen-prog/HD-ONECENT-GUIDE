# Daily Usage Guide (short)

Three habits keep every session consistent.

---

## Habit 1: Start

- Auto-load should read CLAUDE.md or .github/copilot-instructions.md which point to the .ai/ order in README.md.
- If auto-load fails, paste the backup prompt from SESSION_TEMPLATES.md to force reading: STATE, BACKLOG, CONTRACT, DECISION_RIGHTS, CONSTRAINTS, SESSION_LOG, LEARNINGS.

---

## Habit 2: Define the Task

Copy, fill, paste:

```
GOAL: [specific ask]
WHY: [who it helps / what it fixes]
DONE MEANS:
- [success criterion]
- [success criterion]
- npm run build + npm run lint + npm run test:unit + npm run test:e2e pass
- I verified the page/flow
```

---

## Habit 3: End the Session (no exceptions)

1. List what was completed.
2. List what is unfinished.
3. Write a copy-paste prompt for any unfinished item.
4. Update .ai/SESSION_LOG.md.
5. Refresh .ai/STATE.md (and BACKLOG.md if priorities changed).
6. Add new learnings to .ai/LEARNINGS.md when relevant.
7. Record gate results (lint, build, unit, e2e).

---

## Critical Rules (repeat daily)

- Default to **no new dependencies** and avoid one-off files; if you must add a file, prune or merge an obsolete one and log it.
- Stay on `main`; nothing ships until `main` is pushed.
- Use DECISION_RIGHTS for approval checks before UI/system changes.
- Keep edits inside the design system and constraints; prefer token-backed utilities.

---

## If Things Break

- Re-run the read order from README.md.
- Re-read CONSTRAINTS.md and FOUNDATION_CONTRACT.md before touching fragile files.
- If unsure, stop and ask using the GOAL/WHY/DONE prompt.
