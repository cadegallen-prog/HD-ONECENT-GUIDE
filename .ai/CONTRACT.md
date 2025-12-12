# Human-AI Collaboration Contract

**Version:** 1.0
**Date:** December 7, 2025
**Project:** PennyCentral.com
**Human:** Cade (Non-coder, AI orchestrator with 100+ hours directing AI)
**AI Partners:** Claude Code, ChatGPT Codex, GitHub Copilot

---

## Purpose of This Contract

This document defines the working relationship between Cade and any AI assistant working on PennyCentral.com. It ensures:
- Consistent quality across different AI tools and sessions
- Clear expectations for both parties
- Persistent memory through documentation
- Stellar outcomes through structured collaboration

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

### 1. Explain BEFORE Implementing
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
- ✅ Explain technical decisions in terms a non-coder can understand
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
1. ✅ Code builds without errors (`npm run build` succeeds)
2. ✅ No linting errors (`npm run lint` clean)
3. ✅ Works on mobile (if user-facing)
4. ✅ Tested by Cade (if user-facing feature)
5. ✅ SESSION_LOG.md updated with summary
6. ✅ Any new learnings added to LEARNINGS.md

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
