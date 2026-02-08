# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Feb 7, 2026 by Claude Opus 4.6

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude → Codex → Copilot).

**Process contract:** This file is a context capsule. The mandatory end-of-task completion workflow (verification + memory updates + next-agent handoff schema) is defined in `.ai/HANDOFF_PROTOCOL.md`.

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10).

### Current Reality (Feb 7, 2026)

- ✅ **Core product working:** Submissions, enrichment, Penny List page, Store Finder
- ✅ **Guide exists:** 7 chapters + hub across 8 routes, but quality is 4.5/10
- 🔴 **GUIDE RECOVERY PLAN APPROVED** — `.ai/impl/guide-recovery.md` is the approved implementation plan
- 🔴 **Guide problems (verified):** AI-documentation voice (60+ hedging instances in Ch 5), 2026 intel dumped in one chapter, FAQ hidden behind 20 dropdowns, concepts referenced before introduced, Speed-to-Penny absent from entire guide
- ✅ **Design system solid:** WCAG AAA compliant, custom tokens, guide-article CSS class
- 📊 **Metrics:** 680 daily users, 26% conversion (HD clicks), 100% Facebook dependency

### Immediate Next Move

1. **Implement Guide Recovery Phase 1** (content & voice) from `.ai/impl/guide-recovery.md`
2. Then Phase 2 (visual/UX) — FAQ overhaul, hub redesign, CSS tuning
3. Then Phase 3 (drift guard) — format contract document

---

## Quick-start Read Order

### Always First (5 min)

1. `.ai/START_HERE.md` - Universal entry point + read order
2. `.ai/CRITICAL_RULES.md` - 7 never-violate rules (honesty, port 3001, proof, etc.)
3. `.ai/STATE.md` - Current sprint snapshot (updated weekly)

### Always Second (2 min)

4. **This file** (`.ai/HANDOFF.md`) - Portable context pack

### For Guide Recovery (THE CURRENT TASK)

5. `.ai/impl/guide-recovery.md` — **THE APPROVED PLAN** (read this completely before any edits)
6. `Guide Remodel/GUIDE_RECOVERY_HANDOFF.md` — Source of truth for problems, locked copy, voice rules, redistribution map
7. `Guide Remodel/newinfoforguide.html` — 2026 operational intel (minified HTML, use text extraction)
8. `Guide Remodel/codexdialogue.txt` — Prior 22-row claim matrix (lines 1-78)

### Before Implementation

- `.ai/CONTRACT.md` - Collaboration rules (OCE protocol, decision rights)
- `.ai/DECISION_RIGHTS.md` - What needs approval (🟢 auto vs 🟡 propose)
- `.ai/CONSTRAINTS.md` - Design system + tech boundaries

---

## Guide Recovery Context (Critical for Next Agent)

### What Was Architected

A 3-phase, 10-step plan to recover the guide from 4.5/10 to founder standard:

**Phase 1 — Content & Voice (do first, no UX changes):**

- Step 1.0: Create `GUIDE_LOCKED_COPY.md` with 5 immutable founder strings
- Step 1.1: Build extended claim matrix (extend 22-row Codex matrix)
- Step 1.2: Edit chapters 1-6 in order (redistribute 2026 intel, add missing concepts)
- Step 1.3: Voice verification pass (grep for banned hedging phrases)
- Step 1.4: Concept ordering verification (sequential read-through)
- CHECKPOINT: lint + build + test:unit + test:e2e

**Phase 2 — Visual & UX (after Phase 1 content is solid):**

- Step 2.0: FAQ overhaul (remove 20 `<details>`, group by topic, visible Q&A)
- Step 2.1: Guide hub redesign (user triage, chapter descriptions)
- Step 2.2: CSS tuning (H2 border, speculative callout, shadow, spacing)
- CHECKPOINT: lint + build + test:unit + test:e2e + proof screenshots

**Phase 3 — Drift Guard:**

- Step 3.0: Create `GUIDE_FORMAT_CONTRACT.md`
- FINAL: Full verification + proof bundle for all 8 guide routes

### Approved CSS Changes (globals.css — Cade approved Feb 7)

1. Restore H2 bottom border in `.guide-article h2` (`border-bottom: 1px solid var(--border-default)`)
2. Tighten H2 top spacing from `mt-10` (40px) to `mt-8` (32px)
3. Add `.guide-callout-speculative` variant (gray left-border for community-reported content)
4. Add subtle `box-shadow` to `.guide-callout` in light mode
5. Implementer may also investigate color palette, shadows, contrast, WCAG AAA+ improvements

### 2026 Intel Redistribution Map

| Content                             | Move TO                                | WHY                        |
| ----------------------------------- | -------------------------------------- | -------------------------- |
| Store Pulse replacing IMS           | Ch 1 (What Are Pennies)                | Foundational 2026 context  |
| ICE metrics (I/C/E)                 | Ch 2 (Clearance Lifecycle)             | WHY cadence changed        |
| Speed-to-Penny (14-day compression) | Ch 2 (Clearance Lifecycle)             | WHY some items drop fast   |
| $.02 buffer (48hr signal)           | Ch 2 (signals) + Ch 4 (practical)      | "You have ~48hrs"          |
| Home Bay Only (endcaps phased out)  | Ch 3 (Pre-Hunt) + Ch 4 (where to look) | Corrects old endcap advice |
| ZMA/Zero-Comm reporting             | Ch 4 (In-Store Strategy)               | WHY checkout is hard       |
| MET team timing                     | Ch 4 (when to go) + Ch 5 (deeper)      | Practical timing signal    |

### Voice Rules (Mandatory for All Text Edits)

- Lead with action: "Scan a filler item first" NOT "Many hunters report scanning a filler item first"
- Use "you": "Here's what you'll see" NOT "Here's what hunters typically observe"
- Section-level caveats only: One "Note: based on community reports" at section top, NOT per-bullet
- Max 1x "community-reported" per chapter
- Confident tone. No hedging every sentence.
- Connect WHY to WHAT: explain the operational logic

### Locked Copy (5 Immutable Strings)

1. `app/digital-pre-hunt/page.tsx`: "Dusty boxes or items that look untouched for months"
2. `app/in-store-strategy/page.tsx`: UPC not yellow tag (SCO "customer needs assistance" trigger)
3. `app/in-store-strategy/page.tsx`: "Don't scan the QR code" (triggers "customer needs assistance")
4. `app/in-store-strategy/page.tsx`: Self-checkout vs employee verification paragraph
5. `app/in-store-strategy/page.tsx`: Filler item tip + FIRST/Zebra SCO notification behavior

### HIGH-RISK Files (Extra Care Required)

- `app/in-store-strategy/page.tsx` — contains 4 of 5 locked copy strings. Diff verify after every edit.
- `app/inside-scoop/page.tsx` — largest change volume (60+ hedges to kill, content to redistribute out)
- `app/globals.css` — additive CSS changes only, requires approval (already granted)

### Pass/Fail Acceptance Criteria

| Check                   | Pass condition                                                |
| ----------------------- | ------------------------------------------------------------- |
| Factual accuracy        | Claim matrix: zero red rows                                   |
| Locked copy             | All 5 strings in GUIDE_LOCKED_COPY.md unchanged               |
| Voice                   | "community-reported"/"many hunters report" max 1x per chapter |
| 2026 intel distribution | ICE/$.02/ZMA/Store Pulse/Speed-to-Penny in correct chapters   |
| FAQ                     | No `<details>` elements. All answers visible.                 |
| Concept ordering        | No concept referenced before introduced                       |
| Visual consistency      | Screenshots: consistent heading hierarchy, no gaps >80px      |
| Navigation              | 1 prev/next per chapter, no competing CTAs                    |
| Gates                   | lint ✅, build ✅, test:unit ✅, test:e2e ✅                  |
| Proof                   | ai:proof screenshots for all 8 guide routes                   |

### Target Files

- `app/guide/page.tsx` (hub)
- `app/what-are-pennies/page.tsx` (Ch 1)
- `app/clearance-lifecycle/page.tsx` (Ch 2)
- `app/digital-pre-hunt/page.tsx` (Ch 3)
- `app/in-store-strategy/page.tsx` (Ch 4)
- `app/inside-scoop/page.tsx` (Ch 5)
- `app/facts-vs-myths/page.tsx` (Ch 6)
- `app/faq/page.tsx` (Ch 7)
- `app/globals.css` (guide CSS selectors)
- `components/guide/TableOfContents.tsx` (chapter descriptions)

### Source Files

- `Guide Remodel/single_page_guide_pre_update.html` (15.8MB) — canonical voice/flow baseline
- `Guide Remodel/newinfoforguide.html` (72KB) — 2026 operational intel
- `Guide Remodel/codexdialogue.txt` — Prior claim matrix + Codex session history

---

## Tool Capability Notes

### Claude Code (VSCode Extension)

- ✅ **MCP Support:** Filesystem, GitHub, Playwright, Supabase, Vercel
- ✅ **Agent System:** 14+ skills (plan, architect, implement, test, review, debug, etc.)
- ✅ **Ideal for:** Full feature development (design → code → test → verify)

### Codex (ChatGPT, GPT-5.2)

- ✅ **MCP Support:** Same (if `~/.codex/config.toml` is synced)
- ✅ **Ideal for:** Full feature development, alternative to Claude

### Copilot Chat (GitHub Copilot)

- ❌ **MCP Support:** None
- ✅ **Ideal for:** Q&A only, not full development

---

## New Chat Primer (Copy/Paste into Chat)

**Use this when starting a fresh session:**

```
I'm starting fresh on Penny Central (pennycentral.com).

Read in order:
1. .ai/START_HERE.md
2. .ai/CRITICAL_RULES.md
3. .ai/STATE.md
4. .ai/HANDOFF.md

Then read the APPROVED implementation plan:
5. .ai/impl/guide-recovery.md (THE PLAN — read completely before any work)

Current reality (Feb 7, 2026):
- Guide quality is 4.5/10. Approved 3-phase recovery plan exists.
- Phase 1: Content & voice recovery (redistribute 2026 intel, kill hedging, fix concept ordering)
- Phase 2: Visual & UX (FAQ overhaul, hub redesign, CSS tuning)
- Phase 3: Drift guard (format contract)
- All CSS changes pre-approved by founder
- 5 locked copy strings must NOT be modified (see plan)
- In-store-strategy has 4 locked strings — HIGH RISK file

GOAL: Implement Guide Recovery from .ai/impl/guide-recovery.md
WHY: Guide reads like AI documentation, not expert penny-hunter content. 2026 intel is dumped in one chapter. FAQ hides answers behind dropdowns.
DONE MEANS: All acceptance criteria in the plan pass. All 4 gates green. Proof screenshots for all 8 guide routes. Locked founder copy preserved: YES.

Start with: /implement
Context: Guide recovery — approved 3-phase plan
First: Read .ai/impl/guide-recovery.md completely
```

---

## ARCHITECT Stub

```
I'm ready to architect a feature for Penny Central.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- .ai/BACKLOG.md
- Relevant: .ai/topics/<TOPIC>.md

Task:
Design the implementation plan for: [FEATURE]

Deliverable:
Write the plan to: .ai/impl/<feature-slug>.md

Plan must include:
1) Goal + Done Means (testable)
2) Constraints and non-negotiables
3) Files to touch (create vs modify)
4) Step sequence (small steps)
5) Risks + mitigations
6) Verification plan (lint, build, unit, e2e, proof if UI)
7) Rollback plan
8) Open questions (max 5) with A/B/C when needed

Stop and ask for approval to implement.
```

---

## IMPLEMENT Stub

```
I'm ready to implement from an approved plan.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- Plan: .ai/impl/<feature-slug>.md

Task:
Implement exactly what the plan specifies.

Guardrails:
- No scope creep. No refactors.
- If plan is ambiguous, stop and present A/B/C.
- Provide traceable edits: list each file touched and why.

Verification:
- Run npm run ai:verify and report results.
- If UI changed, run proof workflow and link artifacts.

After:
- Update .ai/SESSION_LOG.md with changes + proof links.
- Run /checkpoint to compress context.
- Run /capsule <TOPIC> if it changed that topic's current reality.
```

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

**Last updated:** Feb 7, 2026
