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

1. Each agent works in its own worktree/branch.
2. One integration owner merges verified branches into `dev`.
3. Promote `dev` to `main` after required checks.
4. Do not auto-merge unrelated agent branches without explicit merge instruction.
