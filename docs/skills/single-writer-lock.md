# Skill: Single-Writer Lock (parallel-agent shared-memory safety)

Use this when more than one agent/session may be active and you need to prevent `.ai` continuity-file conflicts.

## Why this exists

Only one active writer should touch shared-memory continuity files at a time:

- `.ai/HANDOFF.md`
- `.ai/STATE.md`
- `.ai/SESSION_LOG.md`
- `.ai/BACKLOG.md`

Feature files can still be edited in parallel when scopes do not overlap.

## Workflow

1. Check lock status:

```bash
npm run ai:writer-lock:status
```

2. Claim lock before editing shared-memory files:

```bash
npm run ai:writer-lock:claim -- <agent-name> "<objective>"
```

3. For long sessions, refresh heartbeat:

```bash
npm run ai:writer-lock:heartbeat -- <agent-name>
```

4. Release lock after memory updates are done:

```bash
npm run ai:writer-lock:release -- <agent-name>
```

## Stale lock handling

- Default stale timeout: 30 minutes without heartbeat.
- If lock is stale, claim command will take over and record prior owner.
- Use force release only for cleanup:

```bash
npm run ai:writer-lock:release -- --force
```

## Merge model with multiple worktrees

1. Default to the main repo folder on `dev`.
2. Use the writer lock for shared-memory files and an overlap check for dirty files before creating extra git structure.
3. Create a separate worktree only when file overlap, long-running git operations, or branch-switching risk make the main folder unsafe.
4. One integration owner merges verified branches into `dev`.
5. Promote `dev` to `main` after required checks.
6. Do not auto-merge unrelated agent branches without explicit merge instruction.
