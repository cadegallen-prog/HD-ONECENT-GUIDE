# Task Completion + Handoff Protocol (Canonical)

**Purpose:** Ensure every completed task is reproducible and immediately actionable for the next agent, with context that survives window resets.

---

## Required End-of-Task Sequence

1. **Implement scope exactly**
   - Stay within approved objective.
   - Do not include unrelated cleanup/refactors.
2. **Run verification with proof**
   - Required lanes for meaningful code changes:
     - `npm run verify:fast` (always)
     - `npm run e2e:smoke` (route/form/API/navigation/UI-flow changes)
     - `npm run e2e:full` (only when FULL trigger policy applies)
   - UI changes: capture Playwright proof bundle.
3. **Update persistent memory**
   - `.ai/SESSION_LOG.md` (always for meaningful work)
   - `.ai/STATE.md` (if current project reality changed)
   - `.ai/BACKLOG.md` (only if priorities changed)
   - `.ai/LEARNINGS.md` (if mistakes/failed approaches occurred)
   - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` (required whenever any monetization incident is open or touched)
   - Run `npm run ai:checkpoint` before handoff when work spans multiple sessions/context windows
4. **Publish next-agent handoff**

- Include a structured handoff block in the final response and/or session log.
- The handoff must let another agent continue without re-discovery.
- If the task involved planning docs, include canonical plan evidence (path + hash + sync status).
- Label this block explicitly as "for future AI agents."

5. **Publish founder-readable summary**

- In the same final response, include plain-English notes for Cade:
  - what changed
  - why it changed
  - what action Cade should take (or "no action needed")
- Define any technical terms used in those notes.

---

## Handoff Block (Required Fields)

Use this schema every time:

```markdown
## Next-Agent Handoff

### 1) Objective + Why

- Goal:
- Why it matters:

### 2) Completion Status

- Completed:
- Not completed:
- Out of scope (explicit):

### 3) Files Changed

- `path/to/file` — why it changed

### 4) Verification Evidence

- `npm run verify:fast`:
- `npm run e2e:smoke` (or N/A + reason):
- `npm run e2e:full` (or N/A + trigger status):
- Playwright proof path(s):
- Memory checkpoint artifact path (when multi-session):
- Known non-blocking console noise:
- Canonical plan path (if planning task):
- Canonical plan SHA256 (if planning task):
- No unsynced tool-local plan: YES/NO (if planning task):

### 5) Risks / Watchouts

- Remaining risks:
- Regressions to watch:
- Monetization incident register updated (YES/NO):

### 6) Immediate Next Step

- Single next task:
- First command/file to open:
```

Notes on field meaning:

- "First command/file to open" is primarily for the next AI agent to resume quickly.
- If Cade is expected to run a command personally, say so explicitly in the founder summary.

---

## Meta-Awareness Persistence Rules

To survive context windows, convert volatile chat context into durable repo context:

1. **Facts and status** -> `.ai/STATE.md` (date-stamped, concrete)
2. **What happened in this session** -> `.ai/SESSION_LOG.md`
3. **Priority decisions** -> `.ai/BACKLOG.md`
4. **Domain-specific durable context** -> `.ai/topics/<TOPIC>_CURRENT.md`
5. **Failure pattern + prevention** -> `.ai/LEARNINGS.md`

If it is not in `.ai/`, assume it will be lost.

---

## Quality Bar

- No "done" claim without verification proof paths.
- No handoff without explicit next step.
- No memory update means no durable completion.
