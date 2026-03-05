# Current Thread (Agent Continuity)

**Purpose:** This file carries the _reasoning chain_ forward between sessions. Not what happened (that's SESSION*LOG), not what's next (that's BACKLOG), but \_why we're doing what we're doing and how each piece connects to the last.*

**Rule:** Every agent — Claude, Codex, Copilot — must read this file at session start and update it at session end. If you don't update this file, the next agent starts disconnected. That wastes everything you just did.

**Last updated:** 2026-03-05 by Claude Code (Opus 4.6)

---

## The Active Thread

### What we're building toward (near-term)

The product thread is still the same: make PennyCentral more trustworthy and easier to use so the core loop compounds (`/penny-list` habit -> submit finds -> better data -> stronger trust).

Five continuity facts now matter together:

1. **Responsive foundations (READY TO IMPLEMENT):** `.ai/impl/responsive-foundations-impl.md` is the approved implementation plan. `.ai/impl/responsive-foundations-spec.md` is the concrete spec. This is the immediate next implementation task.
2. **UX redesign (Track 2, PLANNED BUT NOT STARTED):** `.ai/impl/ux-redesign-requirements.md` captures owner feedback on guide hierarchy, link styling, report-find credibility, and overall cohesion. This is a separate future `/plan` session.
3. **dev-to-main merge is BLOCKED** until owner reviews user-facing page changes (homepage, guide hub, FAQ, report-find). The 25+ "safe" commits (docs, scripts, bug fixes) are intertwined with 7 "needs-review" commits via shared test files, making clean cherry-picking impractical.
4. **Monetization execution has a locked parent+child stabilization plan:** `.ai/impl/monumetric-balanced-stabilization-density-recovery.md` with `S1` through `S5` child docs.
5. **Manual workflow and branch workflow rules remain strict:** `dev` remains the canonical branch.

### Where we just were

Owner expressed deep frustration with the site's mobile responsiveness and overall UX quality. The core issue is NOT device-specific (not just iPhone XR) -- it's systemic: fixed typography sizes, missing viewport-height handling, and cramped layouts at all narrow widths.

This session:

- Fixed immediate mobile clipping bug (viewport-fit=cover + safe-area-inset-top on navbar) -- already committed and pushed to dev.
- Installed 3 new MCPs: Context7, Chrome DevTools, Sequential Thinking.
- Ran full responsive audit of the codebase (all pages, all components).
- Completed `/plan` session defining Track 1 (responsive foundations) vs Track 2 (UX redesign).
- Completed `/architect` session producing a 5-phase implementation plan with 14 files, each phase independently committable.
- Attempted dev-to-main merge but owner skipped all 5 user-facing page reviews. PR #147 was closed.

### Where the next link goes

Next session should:

1. **IMPLEMENT responsive foundations** using `/implement` skill.
   - Read `.ai/impl/responsive-foundations-impl.md` first.
   - Follow the 5 phases in order: globals.css -> min-h-screen replacement -> penny-list -> homepage -> report-find.
   - Each phase is a separate commit.
   - Run `npm run verify:fast` + `npm run e2e:smoke` after all phases.
   - Since globals.css is modified, run `npm run e2e:full` before pushing.
2. **Do NOT start Track 2 (UX redesign) yet.** That needs a fresh `/plan` session when owner has energy.
3. **Do NOT attempt dev-to-main merge.** Owner is not ready to review page content.
4. **Keep monetization lane separate.** If monetization is the session objective, start from `.ai/impl/monumetric-balanced-s1-lifecycle-guardrails.md`.
5. **Use overlap-first dirty-file checks in multi-agent sessions.** `.roo/**` research files are optional carryover, not blockers.

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

**Monetization now has a single active stabilization plan.** Use `.ai/impl/monumetric-balanced-stabilization-density-recovery.md` and one child slice at a time; do not run multi-slice monetization implementation in one batch.

**SPA callback caveat is locked.** Do not enable `$MMT.spa.setCallback(...)` in production paths until isolated canary evidence resolves the prior `updateConfig is not a function` runtime failure.

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
