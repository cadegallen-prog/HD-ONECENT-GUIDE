# Current Thread (Agent Continuity)

**Purpose:** This file carries the _reasoning chain_ forward between sessions. Not what happened (that's SESSION*LOG), not what's next (that's BACKLOG), but \_why we're doing what we're doing and how each piece connects to the last.*

**Rule:** Every agent — Claude, Codex, Copilot — must read this file at session start and update it at session end. If you don't update this file, the next agent starts disconnected. That wastes everything you just did.

**Last updated:** 2026-03-04 by Codex

---

## The Active Thread

### What we're building toward (near-term)

The product thread is still the same: make PennyCentral more trustworthy and easier to use so the core loop compounds (`/penny-list` habit -> submit finds -> better data -> stronger trust).

Three continuity facts now matter together:

1. **Site Recovery Program** (`.ai/impl/site-recovery-program.md`) is still the main product lane, and `/guide` is now the canonical long-form beginner route on `dev`.
2. **The next guide slice is no longer `/guide` itself.** `S3B` is complete, so the next runtime work is `S3C1 - supporting chapter-route demotion` for `/what-are-pennies`, `/clearance-lifecycle`, and `/digital-pre-hunt`.
3. **Manual workflow and branch workflow rules remain strict:** `manual:enrich` vs `manual:cade-fast-track` stay separate, `dev` remains the canonical branch, and dirty-file checks are overlap-first instead of hard-stop by default.

### Where we just were

After the workflow cleanup and `S3A` ownership lock, the remaining risk was that `/guide` could still become a dressed-up hub instead of a real teaching route. The content map solved "what belongs where," but not the actual beginner experience.

This session executed `S3B` as the runtime follow-through:

- replaced the old hub/chapter-grid posture on `/guide` with one seven-section long-form narrative,
- added jump navigation so returning users can reach the exact section they need without route-hopping,
- kept supporting-route links as secondary deep dives instead of the main spine,
- updated smoke coverage and verified the route with fast, smoke, and standalone visual-smoke lanes,
- recorded the shell-specific `npx cross-env` learning so future standalone Playwright retries do not repeat the same PATH mistake.

The key lesson carried forward is that guide recovery only works if `/guide` keeps ownership of the full beginner flow. If a future agent reintroduces a chapter-grid-first posture, the architecture regression will be immediate even if the copy looks better.

### Where the next link goes

Next sessions should prioritize:

1. **Implement `S3C1 - supporting chapter-route demotion` on `dev`.**
   - Start with `/what-are-pennies`, `/clearance-lifecycle`, and `/digital-pre-hunt`.
   - Each route should visibly point back to `/guide` as the canonical path before its unique detail begins.
   - Preserve the useful detail; do not turn the routes into empty shells.
2. **Keep `/faq` untouched until `S3D`.**
   - `S3B` already moved the primary conceptual teaching onto `/guide`.
   - Do not widen scope into FAQ cleanup during `S3C1`.
3. **Keep manual workflow boundaries strict.**
   - Use `manual:enrich` only when Penny List rows already exist.
   - Use `manual:cade-fast-track` for founder direct submissions from pre-scraped payloads.
4. **Treat branch-topology cleanup as its own explicit git objective.**
   - Do not merge, delete, or re-target `develop`/Sentry branches based on assumption.
   - If Cade wants branch cleanup, start from the verified topology captured in `STATE.md` and `SESSION_LOG.md`.
5. **Use overlap-first dirty-file checks in multi-agent sessions.**
   - Unrelated dirty files are not an automatic blocker.
   - `.roo/**` research files and `.roo/mcp.json` are usually optional carryover, not blockers.
   - Shared-memory files still require the writer lock.
   - Separate worktrees are optional isolation tools, not the default workflow.

The thread connection: founder trust depends on continuity being understandable. The branch/worktree cleanup removed operational confusion, `S3A` removed content-ownership confusion, and `S3B` finally turned `/guide` into the primary learning path. `S3C1` matters next because supporting routes still need to acknowledge that new hierarchy instead of competing with it.

### What the agent must understand before working

**Surface briefs still apply.** Before modifying any user-facing surface, read its brief in `.ai/SURFACE_BRIEFS.md`. The brief tells you:

- What job this surface does for the user
- What success looks like (with metrics where available)
- What would make it worse
- Current baseline performance

If you make a change that doesn't serve the surface's stated job, or if you can't articulate _why_ your change makes the surface better at its job, stop and reconsider. "Tests pass" is not the same as "this is an improvement."

**The guide content map is now canon for `S3`.** `.ai/topics/GUIDE_CORE_CONTENT_MAP.md` is the ownership lock for `/guide`, `/faq`, `/what-are-pennies`, and the chapter routes. Update that map first if you need to change ownership decisions.

**`/guide` is already rebuilt.** Do not reintroduce the old chapter-grid hub posture on `app/guide/page.tsx`. The page now owns the full beginner narrative and should stay the canonical long-form teaching surface.

**Route roles are now explicit.** `/guide` owns the full beginner narrative, `/faq` is tactical, `/what-are-pennies` is the short supporting explainer, and the other chapter routes are supporting reference pages with unique detail.

**Supporting routes must be repositioned, not gutted.** `S3C1` and `S3C2` should add canonical-guide framing before unique detail, not remove all useful reference content.

**Standalone visual smoke now has a known shell rule.** In this environment, use `npx cross-env ...` for one-off Playwright build/test commands instead of assuming `cross-env` is directly on PATH.

**Roo research files are optional input, not canon.** `.roo/research/**` and `.roo/mcp.json` may exist because Cade is using free Roo/GLM credits to probe for possible improvements. Treat that material as optional scratch research: useful when it helps the current objective, safe to ignore when it does not, and never a blocker unless the task actually overlaps those files.

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
