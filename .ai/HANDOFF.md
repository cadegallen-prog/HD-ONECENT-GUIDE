# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Feb 18, 2026 by Claude Sonnet 4.6

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude / Codex / Copilot).

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10). Live at pennycentral.com.

### Current Reality (2026-02-18)

- ✅ **Core product working:** Submissions, enrichment, Penny List, Store Finder, 6-chapter guide + hub + FAQ
- ✅ **Guide hub overhauled:** Removed 4 AI-voiced sections, added personal intro in Cade's voice, removed hero CTAs, updated chapter grid subtitle
- ✅ **About page restored:** Scavenger Hunt Philosophy, honest sign-off, growth story with 70K+ members, CTA reordered (Guide primary)
- ✅ **Nav glitch fixed:** Guide split-button animation flash resolved (transition-all to transition-colors)
- ✅ **Homepage guide-first flow:** Primary CTA now routes to /guide, secondary text link to Penny List
- ✅ **Navigation reordered:** Guide > Penny List > My List > Report a Find > Store Finder > FAQ
- ✅ **Design system solid:** WCAG AAA compliant, custom CSS variable tokens, guide-article CSS class
- ✅ **Ad readiness audited:** Privacy/compliance checks hardened, monetization docs refreshed
- 🔄 **Monetization blocked:** AdSense third review (policy violations), Ezoic GAM review pending, Monumetric Ascend approved but GAM confirmation unclear
- 🔄 **Guide content quality:** Hub is clean now, but chapter content still needs voice/intel recovery pass (was 4.5/10, approved recovery plan exists)
- 📊 **Metrics:** ~680 daily users, 26% conversion (HD clicks), 100% Facebook dependency, 70K+ community members

### Immediate Next Move

1. **Guide Chapter 1 content improvements** (from the briefing conversation: ZMA explanation gap, Store Pulse specificity, Zero-Comm report context, "the app" unnamed, timing gap)
2. **Guide Recovery Phase 1** (content & voice) from `.ai/impl/guide-recovery.md` if doing full pass
3. **Monetization follow-up** per incident register timelines

---

## What Just Happened (This Session, Feb 18)

### Guide Hub (/guide) -- SHIPPED to main

- **Removed:** "Execution Standards Before You Hunt" section (AI ops checklist voice)
- **Removed:** "Essential Tools" section (redundant with header/footer nav)
- **Removed:** "How to Use This Guide" box (over-explained friction)
- **Removed:** "Why This Guide Format Works" box (AI explaining its own architecture)
- **Removed:** Both hero CTA buttons ("Start Chapter 1" + "Browse Penny List")
- **Removed:** `quickStart`, `utilityLinks`, `workflowGuardrails` arrays + unused imports
- **Added:** Personal intro block ("Before you start.") with confrontational/filtering tone in Cade's voice
- **Updated:** Chapter grid subtitle to "Read in order. Each chapter builds on the one before it."
- **Updated:** `dateModified` in JSON-LD to 2026-02-18

### About Page (/about) -- SHIPPED to main

- **Changed:** Subtitle to "A free, community-driven guide for finding $0.01 clearance items at Home Depot."
- **Updated:** Growth story with `COMMUNITY_MEMBER_COUNT_DISPLAY` (70,000+), no time reference (evergreen)
- **Added:** "The Scavenger Hunt Philosophy" section (storage unit line, scavenger hunt framing)
- **Added:** Honest sign-off ("I make mistakes. I break things.")
- **Reordered:** "Where to Start" CTAs (Guide = primary, Penny List = secondary, Facebook = tertiary)
- **Removed:** `LegalBackLink` import and usage

### Navbar (components/navbar.tsx) -- SHIPPED to main

- **Fixed:** `transition-all` to `transition-colors` on both halves of the desktop Guide split button, preventing SVG rotate-180 from triggering background color flash

### Also shipped (from earlier Codex sessions same day)

- Homepage guide-first conversion flow + header/footer nav reorder
- "Back to Penny List" removed from all trust/legal pages
- Ad approval readiness audit + monetization memory refresh
- Retired referral/disclosure cleanup + legacy go-route neutralization

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

## Pending Work Context

### Guide Chapter 1 Improvements (discussed but not implemented)

Cade reviewed /what-are-pennies with another AI and identified these gaps:

- ZMA mentioned but never connected to actionable takeaways for hunters
- Store Pulse lacks specificity (when did it replace IMS? what changed?)
- Zero-Comm report is vague (who sees it? does it affect the employee?)
- "The app" mentioned but never named (should say "the Home Depot app")
- No mention of timing (when do items penny out?)
- "Can you buy penny items?" answer is unsatisfying (needs concrete guidance)
- Intro paragraph buries the lede (should hook with validation first)

### Guide Recovery Plan (broader, from Feb 7)

3-phase approved plan exists at `.ai/impl/guide-recovery.md`:

- Phase 1: Content & voice (redistribute 2026 intel, kill hedging, fix concept ordering)
- Phase 2: Visual & UX (FAQ overhaul, hub redesign done, CSS tuning)
- Phase 3: Drift guard (format contract)

### Voice Rules (for all guide copy)

- No em dashes
- Short sentences
- First person where reflecting Cade's experience
- No: "field operations," "signal interpretation," "execution standards," "rumor loops"
- Use contractions ("isn't," "you're," "I'll")
- Write like a person talking to a person, not documentation
- Reader should feel a specific human behind the words

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

**Last updated:** Feb 18, 2026
