# Human-AI Collaboration Contract

**Version:** 1.0
**Date:** December 7, 2025
**Project:** PennyCentral.com
**Human:** Cade (solo founder; cannot code; uses VS Code)
**AI Partners:** Claude Code, ChatGPT Codex, GitHub Copilot

---

## Purpose of This Contract

This document defines the working relationship between Cade and any AI assistant working on PennyCentral.com. It ensures:

- Consistent quality across different AI tools and sessions
- Clear expectations for both parties
- Persistent memory through documentation
- Stellar outcomes through structured collaboration

### Operating Rules (must follow)

- Read files in the order listed in `.ai/README.md` before making changes.
- End every task by updating `SESSION_LOG.md`; refresh `STATE.md` (and `BACKLOG.md` if priorities moved).
- Default to **no new dependencies**; if one is unavoidable, propose first and keep it to a single addition with rationale logged.
- No new one-off files: if you add a helper/data/doc, delete or merge an obsolete one and record it.
- Run `npm run lint`, `npm run build`, `npm run test:unit`, and `npm run test:e2e` before calling a task done.

---

## Objective Collaborative Engineering (OCE) Protocol (Default)

This is the "how we work together" layer on top of `.ai/DECISION_RIGHTS.md`, `.ai/CONSTRAINTS.md`, and `.ai/VERIFICATION_REQUIRED.md`.

### 1) Reality First (No Ghost-Chasing)

- Start with what is observably wrong (error, screenshot, user report, metric, failing test).
- If there is no evidence, say so explicitly and propose the smallest safe experiment (or stop).

### 2) Options A/B/C (When Approval Is Needed)

For anything that needs Cade's approval (see `.ai/DECISION_RIGHTS.md`), provide:

- Option A: fastest/safest
- Option B: balanced default (usually recommended)
- Option C: more ambitious (higher risk or higher upside)

Each option includes: scope, risks, rollback plan, and what proof we'll use to verify.

### 3) Alignment Checkpoint

- Say: "My understanding is X. If that's wrong, correct me."
- For approval-needed changes: wait for explicit "approve" before implementing.

### 4) Truthfulness About Tooling & Evidence

- Never imply real-time browsing, production inspection, tests, screenshots, or builds unless they were actually run.
- When you do run them, include the exact command and where artifacts live (example: `reports/proof/...`).

### 5) Language & Respect

- Cade is one person. Refer to him as "you (Cade)" / "the founder" (singular), not "non-coders" (plural).

---

## What Cade Provides

### 1. Clear Goal Lines

- ✅ Specific, measurable goals (not vague requests)
- ✅ Context about WHY the goal matters (who benefits, what problem it solves)
- ✅ Success criteria ("done" means X, Y, Z)

**Example:**

- ❌ "Make the penny list better"
- ✅ "Add a filter so users can see only 'Rare' finds. Done means: filter works on mobile, builds without errors, I've tested it."

### 2. Decision Rights & Approval

- ✅ Approve or reject proposals before implementation
- ✅ Test user-facing changes and provide feedback
- ✅ Provide final "ship it" or "needs changes" call

### 3. Context About the Community

- ✅ Share feedback from Facebook group members
- ✅ Explain what users care about vs. what they ignore
- ✅ Flag potential concerns before they become problems

### 4. Honest Feedback

- ✅ Say when something doesn't make sense
- ✅ Ask questions when goals are unclear
- ✅ Push back if a suggestion seems wrong

---

## What AI Provides

### 1. VERIFY Before Claiming "Done"

**⚠️ CRITICAL:** Read [VERIFICATION_REQUIRED.md](VERIFICATION_REQUIRED.md) - this is NON-NEGOTIABLE.

**You CANNOT claim work is complete without PROOF:**

- ✅ Screenshots (UI changes - use Playwright MCP)
- ✅ Test output (lint, build, test:unit, test:e2e - ALL 4)
- ✅ GitHub Actions status (paste URL if applicable)
- ✅ Before/after comparison (show problem was actually fixed)

**Common lies that break trust:**

- ❌ "Tests pass" (without running them)
- ❌ "Bug fixed" (without verifying)
- ❌ "GitHub Actions green" (without checking)
- ❌ "Looks professional" (using generic Tailwind colors)

**If you claim done without proof → User wastes time verifying → Trust breaks → You redo work.**

**Better:** Use the tools (Playwright, test commands, GitHub MCP) to verify FIRST.

### 2. Explain BEFORE Implementing

- ✅ Describe the approach in plain English
- ✅ Explain tradeoffs (simple vs. fancy, fast vs. maintainable)
- ✅ Wait for approval on anything user-facing or structural

**Example:**
"I'm going to add a filter dropdown to the penny list. This will:

- Add ~50 lines of code in the penny-list component
- Use existing Tailwind styling (no new dependencies)
- Work on mobile and desktop
- Take about 30 minutes

Tradeoff: Simple dropdown vs. fancy multi-select. I recommend simple for now. Approve?"

### 2. Plain English Summaries

- ✅ Explain technical decisions in plain English
- ✅ Describe what changed and why
- ✅ Translate errors into actionable guidance ("The build broke because X. Here's how to fix it.")

### 3. Update SESSION_LOG.md After Each Task

- ✅ Document what was done
- ✅ Note any learnings or surprises
- ✅ Flag anything the next AI session should know

### 3b. Update STATE.md and BACKLOG.md

- ✅ Refresh `.ai/STATE.md` with the new current snapshot
- ✅ Mark completed items / add next tasks in `.ai/BACKLOG.md`
- ✅ Keep continuity so Cade never has to re-explain history

### 4. Proactive Risk Flagging

- ✅ Warn about fragile areas before touching them
- ✅ Flag potential security issues (XSS, injection, exposed secrets)
- ✅ Highlight when a change might break mobile/accessibility

### 5. Test Thoroughly

- ✅ Run `npm run build` before marking anything complete
- ✅ Run `npm run lint` and fix all errors
- ✅ Test on mobile viewport when relevant

---

## Communication Protocol

### When AI Should Ask Questions

- 🤔 Goal is ambiguous or could be interpreted multiple ways
- 🤔 Multiple valid approaches exist (need human judgment call)
- 🤔 Change will affect users in a significant way
- 🤔 Stuck or blocked and can't proceed without more info

### When AI Should Just Decide

- ✅ Variable names, code structure, optimization approaches
- ✅ Minor styling tweaks that follow existing design system
- ✅ Bug fixes with obvious solutions
- ✅ Documentation updates

### When AI Must Get Approval

- 🛑 Adding new dependencies
- 🛑 Changing user-facing UI/UX
- 🛑 Modifying globals.css or design system
- 🛑 Touching fragile areas (React-Leaflet, store-map.tsx)
- 🛑 Anything that costs money (APIs, services)
- 🛑 Changes to data privacy (what gets sent to browser)

---

## Quality Standards

### "Done" Means:

**⚠️ See [VERIFICATION_REQUIRED.md](VERIFICATION_REQUIRED.md) for complete requirements.**

1. ✅ All 4 tests pass WITH OUTPUT PASTED:
   - `npm run lint` - 0 errors
   - `npm run build` - successful compilation
   - `npm run test:unit` - all passing
   - `npm run test:e2e` - all passing
2. ✅ Playwright verification (for UI changes):
   - Screenshots showing before/after
   - Browser console errors checked
   - Light and dark mode tested
3. ✅ GitHub Actions verified (if applicable):
   - Status is ✅ green (not yellow, not red)
   - URL pasted as proof
4. ✅ Problem actually fixed (not just code compiles):
   - Reproduce original problem
   - Show problem is gone
   - Demonstrate with screenshots or output
5. ✅ SESSION_LOG.md updated with summary
6. ✅ Any new learnings added to LEARNINGS.md

**No proof = not done. If you claim "done" without verification, user will waste time checking and trust will break.**

### "Blocked" Means:

- 🚧 Can't proceed without more context from Cade
- 🚧 Encountered unexpected technical issue that needs human decision
- 🚧 Found a bigger problem that changes the scope

**When blocked:** Document in SESSION_LOG.md, explain the blocker in plain English, suggest next steps.

---

## Success Metrics

This collaboration is working well when:

- ✅ Cade can clearly articulate goals without needing to know code
- ✅ AI delivers solutions that work the first time (or explains why they didn't)
- ✅ Handoffs between AI sessions are smooth (no context loss)
- ✅ Cade feels confident shipping changes without fear of breaking things
- ✅ The project stays stable and maintainable over time

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial contract established
