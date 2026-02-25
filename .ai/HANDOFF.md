# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Feb 22, 2026 by Claude Opus 4.6

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude / Codex / Copilot).

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10). Live at pennycentral.com.

### Current Reality (2026-02-22)

- ✅ **Core product working:** Submissions, enrichment, Penny List, Store Finder, 6-chapter guide + hub + FAQ
- ✅ **Penny list scroll restoration fixed (Feb 22, `836c738`):** Pages 2+ now correctly restore both page number and scroll position after back-navigation from detail pages.
- ✅ **Report Find Participation Lift v1 shipped (Feb 22):** Basket UX, measurement integrity fixes, event taxonomy expansion, anti-mega-plan governance — all completed by Codex
- ✅ **Store Finder mobile UX fixed (Feb 21, uncommitted):** Replaced broken 3-detent bottom sheet with fixed-height overlay panel + restored minimal mobile popup. All gates passed (lint, typecheck, unit, build, e2e:full 198/198).
- ✅ **Design system solid:** WCAG AAA compliant, custom CSS variable tokens, guide-article CSS class
- 🔄 **Monetization blocked:** AdSense policy violations, Monumetric Ascend approved, Ezoic GAM pending
- 🔄 **Anti-spam needed:** Submit-find form has no duplicate SKU throttling. A Feb 21 spam incident produced 10 duplicate generator submissions in 2 minutes from "PA". Cleaned manually but protections needed.
- 🔄 **Visual pointing tool requested:** Cade wants a way to click/tap elements on the live site and have the selection translate to an unambiguous element reference the agent can act on. NOT yet designed or implemented — see "Open Design Work" below.
- 📊 **Metrics:** ~680 daily users, 26% conversion (HD clicks), 100% Facebook dependency, 70K+ community members

### Immediate Next Move

1. **Anti-spam protections for submit-find form** — duplicate SKU throttling, submission cooldowns, client-side debounce (identified as next priority this session)
2. **Commit Store Finder mobile UX fix** (changes are verified but uncommitted — stage only the 4 store-finder files, not the Codex batch report files)
3. **Design + implement the Visual Pointing Tool** (see "Open Design Work" below)

---

## What Just Happened (This Session, Feb 21)

### Store Finder Mobile UX Fix — VERIFIED, NOT COMMITTED

**Problem:** The 3-detent bottom sheet (peek/half/expanded) from commits `27fe7b4`/`6540d3c` was broken on mobile:

- Content clipped in peek/half states (sticky header consumed most of the 168px)
- "Expanded" state crushed the map to ~168px (unusable)
- No popup on mobile — tapping a marker gave zero feedback on the map
- Three detent states were redundant with the existing Map View / List View toggle
- Detent buttons labeled "peek"/"half"/"expanded" (dev jargon)

**What was done:**

| File                               | Change                                                                                                                                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/store-finder/page.tsx`        | Removed entire detent system (type, state, height classes, buttons, drag handle). Converted mobile layout from push (flex-col) to overlay (sheet is `absolute bottom-0 h-[200px] z-10`, map fills full container behind it). Desktop side-panel unchanged. |
| `components/store-map.tsx`         | Restored minimal popup on mobile (store name + Directions link). Updated effect to open popups on both mobile and desktop.                                                                                                                                 |
| `components/store-map.css`         | Added `.store-popup-card--minimal` compact style + hid popup tip arrow on mobile.                                                                                                                                                                          |
| `tests/store-finder-popup.spec.ts` | Removed detent button references. Updated mobile popup assertion from "expect 0" to "expect 1 minimal popup".                                                                                                                                              |

**Verification:** All gates green:

- `npm run verify:fast` ✅ (lint + typecheck + unit + build)
- `npm run e2e:smoke` ✅ (5/5)
- `npm run e2e:full` ✅ (198 passed, 2 skipped)

**⚠️ NOT COMMITTED YET.** The work tree also has uncommitted changes from a Codex session (Report Find Participation Lift v1). When committing, stage ONLY the store-finder files for this commit:

- `app/store-finder/page.tsx`
- `components/store-map.tsx`
- `components/store-map.css`
- `tests/store-finder-popup.spec.ts`

### Visual Pointing Tool — CONCEPT ONLY, NOT IMPLEMENTED

**Cade's request:** He wants a way to precisely communicate which element on the site he's talking about when giving UX feedback. Currently he describes things vaguely ("the thing at the bottom that clips") and agents have to guess.

**What he wants:** Click/tap an element on the live site → the system identifies it (CSS selector, component name, file/line number) → agent knows exactly what "this" refers to. The purpose is exclusively for non-technical UX/UI feedback from a layperson's perspective.

**Status:** Concept understood and confirmed with Cade. No design or implementation work has been done yet. This needs an architect pass to determine the right approach (browser extension? dev-mode overlay? bookmarklet?).

---

## Uncommitted Changes (Work Tree Status)

The `dev` branch has uncommitted changes from TWO sessions:

**Session 1 (Codex, Feb 22):** Report Find Participation Lift v1

- ~20 files across governance docs, analytics, report-find components, tests

**Session 2 (Claude, Feb 21):** Store Finder mobile UX fix

- 4 files (listed above)

**Recommendation:** Commit these as two separate commits. The Codex changes should be committed first (or separately) since they're a distinct feature.

---

## Quick-start Read Order

### Always First (5 min)

1. `.ai/START_HERE.md`
2. `.ai/CRITICAL_RULES.md`
3. `.ai/STATE.md`

### Always Second (2 min)

4. **This file** (`.ai/HANDOFF.md`)

### Contextual (Choose One)

- **For general:** `.ai/BACKLOG.md` + `.ai/GROWTH_STRATEGY.md`
- **For guide work:** `.ai/impl/guide-recovery.md` (approved plan)
- **For monetization:** `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- **For topic work:** `.ai/topics/INDEX.md` then `.ai/topics/<TOPIC>.md`

### Before Implementation

- `.ai/CONTRACT.md`
- `.ai/DECISION_RIGHTS.md`
- `.ai/CONSTRAINTS.md`

---

## Tool Capability Notes

### Claude Code (VSCode Extension)

- ✅ **MCP Support:** Filesystem, GitHub, Playwright, Supabase
- ✅ **Agent System:** 14+ skills (plan, architect, implement, test, review, debug, etc.)
- ✅ **Ideal for:** Full feature development (design, code, test, verify)

### Codex (ChatGPT, GPT-5.2)

- ✅ **MCP Support:** Same (if `~/.codex/config.toml` is synced)
- ✅ **Ideal for:** Full feature development, alternative to Claude

### Copilot Chat (GitHub Copilot)

- ❌ **MCP Support:** None
- ✅ **Ideal for:** Q&A only, not full development

---

## Key Files by Purpose

| Goal                           | File to Read                                       |
| ------------------------------ | -------------------------------------------------- |
| Understand project & business  | `.ai/GROWTH_STRATEGY.md` + `.ai/BACKLOG.md`        |
| See what's broken/planned      | `.ai/STATE.md` + `.ai/BACKLOG.md`                  |
| See what changed recently      | `.ai/SESSION_LOG.md`                               |
| Check design system            | `.ai/CONSTRAINTS.md` + `docs/DESIGN-SYSTEM-AAA.md` |
| See approved plans             | `.ai/impl/` directory                              |
| Check past mistakes            | `.ai/LEARNINGS.md`                                 |
| Understand collaboration rules | `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md`       |

---

## Emergency Checklist (If Stuck)

| Situation                         | What to Do                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------- |
| "I'm out of context"              | Stop. Summarize to SESSION_LOG.md. Ask Cade to start fresh.                  |
| "Dev server on port 3001 is down" | State clearly. Options: A) Restart, B) Use production, C) You restart. Wait. |
| "Tests are failing"               | Paste error. Ask: "Debug or revert?"                                         |
| "Locked copy seems wrong"         | STOP. Ask founder. Do NOT modify.                                            |
| "Feature scope is unclear"        | Stop. Ask Cade: GOAL / WHY / DONE MEANS?                                     |

---

**Last updated:** Feb 21, 2026
