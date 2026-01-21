# Daily Usage Guide (short)

Three habits keep every session consistent.

---

## Habit 1: Start

- Auto-load should read CLAUDE.md or .github/copilot-instructions.md which point to the .ai/ order in README.md.
- If auto-load fails, paste the backup prompt from SESSION_TEMPLATES.md to force reading: STATE, BACKLOG, CONTRACT, DECISION_RIGHTS, CONSTRAINTS, SESSION_LOG, LEARNINGS.
- Check if the dev server is running on port 3001; if the port is already occupied, access http://localhost:3001 directly without restarting or killing any processes.
- **Note:** MCP servers (filesystem, git, github) load automatically - no manual setup needed.
- **Note (npm v11+):** To pass flags to an npm script, use `npm run <script> -- -- --flag ...` (extra `--`).

---

## Habit 2: Define the Task

Copy, fill, paste:

```
GOAL: [specific ask]
WHY: [who it helps / what it fixes]
EVIDENCE: [error message / screenshot / link / metric - if none yet, say "none"]
NOT DOING: [2-3 explicit exclusions to prevent scope creep]
CONSTRAINTS: [tokens-only colors, don’t touch globals.css, don’t kill port 3001, etc.]
EXAMPLES: Like this: [one sentence] / Not like this: [one sentence]
OPTIONS (if this needs approval): A) [fast/safe] B) [balanced] C) [ambitious]
DONE MEANS:
- [success criterion]
- [success criterion]
- npm run build + npm run lint + npm run test:unit + npm run test:e2e pass
- I verified the page/flow
```

If Cade is unsure, the agent should ask **one** non-technical clarifying question: “Which lever matters most right now: more submissions, better retention, or more SEO traffic?”

### Course-Correction Script (When AI Is Misaligned)

Use this exact pattern:

```
STOP: That’s not what I meant.
GOAL (revised): [...]
NOT DOING (revised): [...]
The misunderstanding is: [...]
Restate your understanding in 2-3 sentences before changing any code.
```

---

## Habit 2.5: Plan Canon (When Planning, Not Implementing)

If the request is planning-only (no code changes yet):

1. Open `.ai/plans/INDEX.md` (canonical registry)
2. Create or update a plan file under `.ai/plans/` using `.ai/plans/_TEMPLATE.md`
3. If needed, create a deeper audit doc under `.ai/topics/` and link it from the plan
4. Update `.ai/SESSION_LOG.md` with a docs-only entry ("gates not run")

This supports multiple concurrent plans without losing track of which is approved vs. still being refined.

---

## Habit 3: Verify BEFORE Claiming "Done"

**⛔ STOP:** Read [VERIFICATION_REQUIRED.md](.ai/VERIFICATION_REQUIRED.md) BEFORE claiming work is complete.

**You CANNOT say "done" without PROOF:**

1. ✅ Screenshots (for UI changes - use Playwright)
2. ✅ Test output (all 4 commands: lint, build, test:unit, test:e2e)
3. ✅ GitHub Actions status (if applicable - paste URL)
4. ✅ Before/after comparison (show the problem was actually fixed)

**If you claim "tests pass" without running them → User will be frustrated when they fail.**
**If you claim "bug fixed" without verifying → User will waste time checking.**

**See VERIFICATION_REQUIRED.md for detailed requirements.**

## Habit 4: End the Session (no exceptions)

1. List what was completed WITH PROOF (see VERIFICATION_REQUIRED.md).
2. List what is unfinished.
3. Write a copy-paste prompt for any unfinished item.
4. Update .ai/SESSION_LOG.md.
5. Refresh .ai/STATE.md (and BACKLOG.md if priorities changed).
6. Add new learnings to .ai/LEARNINGS.md when relevant.
7. Record gate results (lint, build, unit, e2e).
8. **NEVER kill port 3001** - if it's running, the user is using it intentionally.

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
