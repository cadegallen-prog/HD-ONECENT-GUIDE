# Current Thread (Agent Continuity)

**Purpose:** This file carries the _reasoning chain_ forward between sessions. Not what happened (that's SESSION_LOG), not what's next (that's BACKLOG), but _why we're doing what we're doing and how each piece connects to the last._

**Rule:** Every agent — Claude, Codex, Copilot — must read this file at session start and update it at session end. If you don't update this file, the next agent starts disconnected. That wastes everything you just did.

**Last updated:** 2026-03-03 by Claude Code (Opus 4.6)

---

## The Active Thread

### What we're building toward (near-term)

PennyCentral's core loop is: visitors check the penny list habitually, submit finds with low friction, data trust grows, utility compounds. The site already has real product value — `/penny-list` alone gets 55K+ views/month with 75% engagement. But the _surrounding experience_ isn't earning the trust or creating the urgency that the core utility deserves. The homepage doesn't prove value fast enough, the educational content is fragmented, and mobile feels heavier than it should.

The **Site Recovery Program** (`.ai/impl/site-recovery-program.md`) is the current vehicle for fixing this. It's 8 ordered slices, each additive to the last:

| Slice  | Purpose                                                    | Status                        |
| ------ | ---------------------------------------------------------- | ----------------------------- |
| S1     | Fix global hydration mismatch so everything else is stable | Done (verified, needs commit) |
| **S2** | **Redesign homepage as proof-first front door**            | **Next**                      |
| S3     | Rebuild guide into one canonical long-form experience      | Planned                       |
| S4     | Protect penny list utility on mobile                       | Planned                       |
| S5     | Compress report-find flow                                  | Planned                       |
| S6     | Typography/template consistency                            | Planned                       |
| S7     | Demote store finder to supporting role                     | Planned                       |
| S8     | Harden trust pages                                         | Planned                       |

### Where we just were

**The dead-end remediation thread:** We identified through analytics that several entry pages (FAQ, report-find) were acting as dead ends — users landed, got their answer, and left without entering the product loop. The FAQ fix shipped (added next-step CTAs routing to `/penny-list`, `/what-are-pennies`, `/report-find`). Report-find improvements were started by a previous agent session but left uncommitted. That work is currently stashed on dev.

**The shipping thread:** We cherry-picked 5 verified commits from dev into PR #143 to get safe work merged to main. The PR passes fast gate and smoke but fails full-e2e on `report-find-batch.spec.ts` — a pre-existing test that expects batch submit behavior that's been fixed on dev but wasn't included in the cherry-pick.

**The continuity discussion:** Cade identified a fundamental gap — agents have been executing tasks without understanding _what good looks like_ for each part of the site. Changes get made because a backlog item says to make them, not because the agent understands the surface's job, its current performance, and what improvement actually means. This led to creating this file (THREAD.md) and the surface briefs (`.ai/SURFACE_BRIEFS.md`).

### Where the next link goes

The next session should do these (in priority order):

1. **Add Context7 MCP to all three agent configs.** This is quick, free, and immediately makes every agent better by giving it access to current library documentation instead of guessing from stale training data. Setup commands are in `.ai/HANDOFF.md` under "MCP Upgrades." Do this first because it improves every subsequent session.

2. **Commit the uncommitted work on dev.** There are ~22 modified/new files sitting dirty — S1 hydration fix, continuity system (THREAD.md, SURFACE_BRIEFS.md, read order updates), site recovery plans, email docs, archived orphans. Commit as 3-4 logical groups. See HANDOFF.md for the file list and recommended commit grouping.

3. **Get PR #143 green and merged.** The report-find batch test expects behavior that's already fixed on dev. Either cherry-pick the basket hotfix onto the release branch, or fix the test. This unblocks shipping 5 commits to production.

4. **Start S2 (Homepage Proof Front Door).** Plan exists at `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`. The homepage currently gets 27K views/month with 77% engagement — it's the second most viewed page but Cade's assessment is "generic, bland, no focal point, no proof imagery." S2 should make the homepage prove value immediately using real data (recent finds, community stats) instead of explaining itself with text.

**The thread connecting these:** #1 makes every agent smarter for free. #2 cleans the workspace so future agents don't inherit a dirty tree. #3 gets past work live. #4 starts the next meaningful product improvement. Each one sets up the next.

### What the agent must understand before working

**Surface briefs exist now.** Before modifying any surface, read its brief in `.ai/SURFACE_BRIEFS.md`. The brief tells you:

- What job this surface does for the user
- What success looks like (with metrics where available)
- What would make it worse
- Current baseline performance

If you make a change that doesn't serve the surface's stated job, or if you can't articulate _why_ your change makes the surface better at its job, stop and reconsider. "Tests pass" is not the same as "this is an improvement."

**MCP Memory Service is on the radar.** Cade and the agent discussed whether a semantic memory service (https://github.com/doobidoo/mcp-memory-service) could replace or augment the markdown-based context system. It works cross-agent, does semantic search, and is mature (v10.20+). Needs Windows compatibility check and honest evaluation of whether it's worth the setup overhead for a solo-founder project. Don't adopt it without Cade's approval — evaluate first.

---

## How to Update This File

At the end of your session, rewrite the sections above to reflect the new state. Be specific:

- **"What we're building toward"** — only update if the direction changed
- **"Where we just were"** — describe the reasoning behind what you did, not just what you did. What hypothesis were you working under? What did you learn?
- **"Where the next link goes"** — what should the next session accomplish, and _why_ does it matter in the chain?
- **"What the agent must understand"** — add anything the next agent needs to know that isn't obvious from the code

**Do not** append to this file. Rewrite the active sections so they stay current. This is a living document, not a log.

**Do not** rush this update. The 5 minutes you spend writing a thoughtful thread saves the next agent 30 minutes of re-discovery and prevents disconnected work.
