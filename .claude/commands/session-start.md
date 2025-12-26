---
name: session-start
description: Start a new coding session with proper context
---

Start a new session by completing these steps in order:

## 1. Read Required Docs (in order)

Read these files to understand the project context:
1. `.ai/VERIFICATION_REQUIRED.md` - Quality gates (all 4 must pass)
2. `.ai/CONSTRAINTS.md` - Rules and fragile areas
3. `.ai/STATE.md` - Current snapshot
4. `.ai/BACKLOG.md` - Prioritized work
5. Latest entry in `.ai/SESSION_LOG.md` - Recent context

## 2. Run Health Check

Execute: `npm run ai:doctor`

If any checks fail, fix them before proceeding.

## 3. Capture Goal

Ask the user for or confirm:
- **GOAL:** What will be accomplished this session
- **WHY:** Business/user value
- **DONE:** How we'll know it's done

## 4. Create Session Entry

Add a new entry to `.ai/SESSION_LOG.md`:

```markdown
## Session [DATE] - [TIME]
**Goal:** [from step 3]
**Why:** [from step 3]
**Done when:** [from step 3]
**Status:** In Progress
```

## 5. Confirm Ready

Tell the user: "I've read the docs and captured the goal. Ready to begin?"
