# Task Completion + Handoff Protocol (Canonical)

**Purpose:** Ensure every completed task is reproducible and immediately actionable for the next agent, with context that survives window resets.

---

## Required End-of-Task Sequence

1. **Implement scope exactly**
   - Stay within approved objective.
   - Do not include unrelated cleanup/refactors.
2. **Run verification with proof**
   - Required gates for meaningful code changes:
     - `npm run lint`
     - `npm run build`
     - `npm run test:unit`
     - `npm run test:e2e`
   - UI changes: capture Playwright proof bundle.
3. **Update persistent memory**
   - `.ai/SESSION_LOG.md` (always for meaningful work)
   - `.ai/STATE.md` (if current project reality changed)
   - `.ai/BACKLOG.md` (only if priorities changed)
   - `.ai/LEARNINGS.md` (if mistakes/failed approaches occurred)
4. **Publish next-agent handoff**
   - Include a structured handoff block in the final response and/or session log.
   - The handoff must let another agent continue without re-discovery.

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

- `npm run lint`:
- `npm run build`:
- `npm run test:unit`:
- `npm run test:e2e`:
- Playwright proof path(s):
- Known non-blocking console noise:

### 5) Risks / Watchouts

- Remaining risks:
- Regressions to watch:

### 6) Immediate Next Step

- Single next task:
- First command/file to open:
```

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
