# Current Thread (Agent Continuity)

**Purpose:** This file carries the _reasoning chain_ forward between sessions. Not what happened (that's SESSION*LOG), not what's next (that's BACKLOG), but \_why we're doing what we're doing and how each piece connects to the last.*

**Rule:** Every agent — Claude, Codex, Copilot — must read this file at session start and update it at session end. If you don't update this file, the next agent starts disconnected. That wastes everything you just did.

**Last updated:** 2026-03-04 by Codex

---

## The Active Thread

### What we're building toward (near-term)

The product thread is still the same: make PennyCentral more trustworthy and easier to use so the core loop compounds (`/penny-list` habit -> submit finds -> better data -> stronger trust).

Three continuity facts now matter together:

1. **Site Recovery Program** (`.ai/impl/site-recovery-program.md`) is still the main product lane, and `S3 - Guide Core Rebuild` is the next implementation slice on `dev`.
2. **Manual data pipeline hardening** remains important: `manual:enrich` and `manual:cade-fast-track` are intentionally separate workflows and must stay that way.
3. **Branch/worktree clarity is now explicit**: `dev` is the canonical integration branch, a separate Sentry worktree exists for `feature/sentry-spam-fix-and-autofix`, `develop` still exists only as a stale side branch, and dirty-file checks are now overlap-first instead of hard-stop by default.

### Where we just were

The immediate problem was not product behavior but continuity drift. The repo canon pointed to a missing root `PENNYCENTRAL_MASTER_CONTEXT.md`, the backlog still named the wrong next recovery slice, and a parallel Sentry worktree created confusion about whether `dev` or `develop` was the real integration lane.

In this session chain, we verified:

- main worktree `C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE` is clean on `dev`
- Sentry worktree `C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE-sentry` is clean on `feature/sentry-spam-fix-and-autofix`
- `dev` is ahead of `develop` by 4 commits
- the Sentry feature branch is based on `develop`, not `dev`

The continuity fix was to restore the missing root founder-context file, correct the stale `S2` -> `S3` recovery reference, persist the verified branch/worktree reality in shared memory, and then patch the workflow rules so future agents stop freezing on unrelated dirty files.

### Where the next link goes

Next sessions should prioritize:

1. **Continue Site Recovery at `S3 - Guide Core Rebuild` on `dev`.**
2. **Keep manual workflow boundaries strict.**
   - Use `manual:enrich` only when Penny List rows already exist.
   - Use `manual:cade-fast-track` for founder direct submissions from pre-scraped payloads.
3. **Treat branch-topology cleanup as its own explicit git objective.**
   - Do not merge, delete, or re-target `develop`/Sentry branches based on assumption.
   - If Cade wants branch cleanup, start from the verified topology captured in `STATE.md` and `SESSION_LOG.md`.
4. **Use overlap-first dirty-file checks in multi-agent sessions.**
   - Unrelated dirty files are not an automatic blocker.
   - Shared-memory files still require the writer lock.
   - Separate worktrees are optional isolation tools, not the default workflow.

The thread connection: founder trust depends on continuity being understandable. Clarifying branch/worktree reality reduces future context loss the same way data-path clarification reduced manual workflow errors.

### What the agent must understand before working

**Surface briefs still apply.** Before modifying any user-facing surface, read its brief in `.ai/SURFACE_BRIEFS.md`. The brief tells you:

- What job this surface does for the user
- What success looks like (with metrics where available)
- What would make it worse
- Current baseline performance

If you make a change that doesn't serve the surface's stated job, or if you can't articulate _why_ your change makes the surface better at its job, stop and reconsider. "Tests pass" is not the same as "this is an improvement."

**Manual workflow contract is part of continuity.** Future agents should not assume `/manual` is allowed to create Penny List rows. Creation is founder-only fast-track behavior via `/manual:cade` / `manual:cade-fast-track`.

**Branch policy is also part of continuity now.** Use `dev` as the default implementation lane. `develop` exists but currently lags `dev`; do not treat it as canon unless Cade explicitly changes the policy.

**Multi-agent workflow preference is part of continuity now.** Default to the main repo folder on `dev`, inspect dirty-file overlap before blocking, and use separate worktrees only when there is a stated isolation reason.

---

## How to Update This File

At the end of your session, rewrite the sections above to reflect the new state. Be specific:

- **"What we're building toward"** — only update if the direction changed
- **"Where we just were"** — describe the reasoning behind what you did, not just what you did. What hypothesis were you working under? What did you learn?
- **"Where the next link goes"** — what should the next session accomplish, and _why_ does it matter in the chain?
- **"What the agent must understand"** — add anything the next agent needs to know that isn't obvious from the code

**Do not** append to this file. Rewrite the active sections so they stay current. This is a living document, not a log.

**Do not** rush this update. The 5 minutes you spend writing a thoughtful thread saves the next agent 30 minutes of re-discovery and prevents disconnected work.
