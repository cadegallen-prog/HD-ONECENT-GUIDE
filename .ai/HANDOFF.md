# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Feb 10, 2026 by Claude Sonnet 4.5

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude → Codex → Copilot).

**Process contract:** This file is a context capsule. The mandatory end-of-task completion workflow (verification + memory updates + next-agent handoff schema) is defined in `.ai/HANDOFF_PROTOCOL.md`.

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10).

### Current Reality (Feb 10, 2026)

- ✅ **Core product working:** Submissions, enrichment, Penny List page, Store Finder
- ✅ **900+ Home Depot product page links** already live in production
- 📊 **CRITICAL METRIC CORRECTION:** 15,000 monthly users (not 680 daily estimate from Feb 7)
- 🔴 **HOME DEPOT AFFILIATE ANALYSIS COMPLETED** — Full strategic report at `/root/.claude/plans/agile-gliding-kay.md`
- ⚠️ **PREVIOUS ANALYSIS HAD FATAL FLAW:** Assumed penny hunters never buy retail (wrong - most users NEVER find pennies, still buy HD items)
- ✅ **Revised recommendation:** Apply to Home Depot Affiliate Program (Impact) with 70-80% approval probability
- 💰 **Revenue potential:** $500-1,500/month passive income with current traffic
- 🔄 **AdSense status:** Rejected Feb 2-3 for "low value content", Monumetric escalation in progress
- ✅ **Design system solid:** WCAG AAA compliant, custom tokens, guide-article CSS class

### Immediate Next Move

1. **Review Home Depot affiliate analysis** at `/root/.claude/plans/agile-gliding-kay.md`
2. **Validate traffic assumptions** (check GA4 for actual 28-day user count)
3. **Decide on affiliate strategy:** Option A (Amazon Associates only) vs Option B (HD affiliate application)

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

## Home Depot Affiliate Analysis Context (Current Priority - Feb 10, 2026)

### What Was Researched

A comprehensive forensic analysis of PennyCentral's feasibility for The Home Depot Affiliate Program (via Impact.com), including:
- Site audit (brand positioning, content tone, link architecture, audience intent)
- Affiliate program rule analysis (approval requirements, commission structure, restrictions)
- Three strategic options (Conservative, Balanced, Aggressive)
- Decision matrix with weighted scoring
- Application execution playbook
- Implementation feasibility assessment

**Full Report Location:** `/root/.claude/plans/agile-gliding-kay.md` (18,000+ words)

### Critical Discovery: Fundamental Business Model Misunderstanding

**Initial Analysis Assumption (WRONG):**
> "Penny hunters won't buy at retail because they're looking for $0.01 items"

**Actual Reality (Confirmed by Owner):**
> "Penny hunting is HARD. Most people never find a single penny item. They still need to buy Home Depot items because that's life."

**User Journey Reality:**
1. User searches for penny item on PennyCentral
2. Clicks Home Depot link to verify availability (affiliate cookie set ✅)
3. Item is NOT $0.01 (most common outcome - pennies are rare)
4. User either:
   - Buys it at clearance price ($5-$20)
   - Buys a similar item
   - Browses and buys other needed items
   - Returns within 30 days and makes purchase (cookie still valid)

**Implication:** PennyCentral users ARE Home Depot shoppers. Affiliate program is a strong fit.

### Corrected Traffic Data

| Metric | Initial Estimate | Actual (Owner Confirmed) | Impact |
|--------|------------------|--------------------------|--------|
| **Monthly Users** | ~1,000 | **15,000** | 15x higher |
| **Home Depot Links** | Unknown | **900+** | Massive existing inventory |
| **Click-through Rate** | Estimated 15% | Unknown (GA4 needed) | High engagement observed |

### Revised Strategic Recommendation

**PREVIOUS (with 1k users):** Option A - Amazon Associates only, avoid HD affiliate (87/100 score)

**REVISED (with 15k users):** Option B - Apply to HD Affiliate (Balanced Approach)

**Approval Probability:** 70-80% (was 40-55%)

**Revenue Potential:** $500-1,500/month (was $25-75/month estimate)

**Why the Change:**
- ✅ 15,000 users clears traffic threshold easily
- ✅ 900 HD links demonstrates established content
- ✅ Users are actual Home Depot shoppers (not just bargain hunters)
- ✅ 30-day cookie captures post-verification purchases
- ✅ Home improvement niche strongly established

### Three Strategic Options (from Report)

**Option A - Conservative (Amazon Associates Only):**
- No manual review, 95% approval probability
- Revenue: $50-150/month
- No risk of rejection
- BUT: Not related to core penny hunting content

**Option B - Balanced (Apply to HD Affiliate with Content Expansion):**
- 70-80% approval probability (revised from 40-55%)
- Revenue: $500-1,500/month
- Requires minimal content additions (not major refactor)
- Aligns with existing 900 HD links

**Option C - Aggressive (Apply Immediately, Penny-Focused):**
- 15-25% approval probability
- High rejection risk
- Likely $0/month (approval unlikely)

### Next Steps for Opus 4.6

**IMMEDIATE:**
1. **Validate Traffic** - Check GA4 for actual 28-day user count (owner says 15k/month)
2. **Review Full Analysis** - Read `/root/.claude/plans/agile-gliding-kay.md` completely
3. **Assess Options** - Consider whether to:
   - Proceed with Option B (HD affiliate application)
   - Implement Option A first (Amazon Associates as safety net)
   - Hybrid approach (both simultaneously)

**RESEARCH QUESTIONS:**
- What is actual click-through rate on HD links? (GA4: `home_depot_click` event)
- What is actual conversion behavior? (Do users return to HD after clicking?)
- What is current AdSense/Monumetric status? (Affects "low value content" risk)
- How much time can owner commit to application process? (Option B requires ~5-10 hours)

**KEY FILES:**
- `/root/.claude/plans/agile-gliding-kay.md` - Full strategic analysis report
- `.ai/GROWTH_STRATEGY.md` - Owner context and monetization philosophy
- `.ai/STATE.md` - Current AdSense/Monumetric status
- `/lib/home-depot.ts` - Existing HD link generation function
- `/components/penny-list-card.tsx` - HD link placements

**OWNER CONSTRAINTS:**
- ✅ Must be "tasteful, not cash-grabby" (growth strategy mandate)
- ✅ Cannot compete with Facebook group (promised group admin)
- ✅ Wants hands-off operation (non-technical owner)
- ⚠️ Already experienced AdSense rejection (morale consideration)

---

## Guide Recovery Context (Archive - Deprioritized)

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

Current reality (Feb 10, 2026):
- Home Depot Affiliate Program strategic analysis COMPLETED
- Full 18,000-word forensic report at: /root/.claude/plans/agile-gliding-kay.md
- CRITICAL CORRECTION: Site has 15,000 monthly users (not 1,000 estimated)
- 900+ Home Depot product page links already live
- Previous analysis had fatal flaw: assumed penny hunters never buy retail (WRONG)
- Actual reality: Most users NEVER find pennies, still buy HD items regularly
- Revised recommendation: Apply to HD Affiliate (Option B) - 70-80% approval probability
- Revenue potential: $500-1,500/month with current traffic
- AdSense status: Rejected Feb 2-3 for "low value content"
- Monumetric: Escalation in progress

GOAL: Finalize Home Depot affiliate strategy
WHY: Monetize existing 900 HD product links, diversify revenue beyond ads
DONE MEANS: Strategy decision made (A/B/C), traffic validated via GA4, implementation path clear

Next steps:
1. Read full analysis: /root/.claude/plans/agile-gliding-kay.md
2. Validate actual traffic (GA4: last 28 days user count)
3. Check HD link click-through rate (GA4: home_depot_click event)
4. Decide: Option A (Amazon only), Option B (HD affiliate), or Hybrid
5. If Option B chosen: prepare Impact.com application using wording from Section 6

What should I focus on first?
```

---

## ARCHITECT Stub

```
I'm ready to architect the Home Depot affiliate implementation for Penny Central.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- .ai/GROWTH_STRATEGY.md (monetization philosophy: "tasteful, not cash-grabby")
- /root/.claude/plans/agile-gliding-kay.md (full strategic analysis)

Context:
- Owner confirmed: 15,000 monthly users, 900+ HD product links
- Strategic analysis recommends Option B (HD Affiliate via Impact.com)
- Approval probability: 70-80%
- Revenue potential: $500-1,500/month
- Key constraint: Must preserve authenticity, cannot feel like coupon blog

Task:
Design the implementation plan for: Home Depot Affiliate Integration (Option B)

Deliverable:
Write the plan to: .ai/impl/home-depot-affiliate.md

Plan must include:
1) Goal + Done Means (testable: affiliate approved, links wrapped, commission tracking)
2) Constraints (authenticity preservation, FTC compliance, no content drift)
3) Files to touch:
   - lib/home-depot-affiliate.ts (new: affiliate link wrapper)
   - components/* (update HD link calls)
   - app/privacy-policy/page.tsx (add HD affiliate disclosure)
   - app/affiliate-disclosure/page.tsx (new: dedicated disclosure page)
4) Step sequence:
   - Phase 1: Application preparation (content review, wording draft)
   - Phase 2: Impact.com application submission
   - Phase 3: Post-approval implementation (link wrapper, disclosures)
5) Risks + mitigations (rejection handling, performance impact, user trust)
6) Verification plan (link tracking works, disclosures visible, no UX degradation)
7) Rollback plan (env var toggle to disable affiliate wrapping)
8) Open questions:
   - Exact traffic numbers (GA4 validation)
   - Click-through rate on HD links
   - Time available for application process
   - Preference: Option B vs Hybrid (B + Amazon)

Stop and ask for approval to implement.
```

---

## IMPLEMENT Stub

```
I'm ready to implement Home Depot affiliate integration from an approved plan.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- Plan: .ai/impl/home-depot-affiliate.md
- Strategic Analysis: /root/.claude/plans/agile-gliding-kay.md (Section 6: Application Playbook)

Task:
Implement exactly what the plan specifies for Option B (Balanced HD Affiliate).

Phase 1 - Pre-Application:
- Validate traffic via GA4 (confirm 15k monthly users)
- Check HD link CTR (home_depot_click event)
- Review existing HD link placements (lib/home-depot.ts, components/*)

Phase 2 - Application:
- Use wording from strategic analysis Section 6
- Submit Impact.com application
- Wait for approval (2-3 business days)

Phase 3 - Post-Approval Implementation:
- Create affiliate link wrapper (lib/home-depot-affiliate.ts)
- Update components to use wrapper
- Add affiliate disclosures (privacy policy, dedicated page)
- Deploy with env var toggle (NEXT_PUBLIC_HD_AFFILIATE_ENABLED)

Guardrails:
- Authenticity MUST be preserved (no coupon-blog content)
- FTC compliance required (clear disclosures)
- No scope creep beyond affiliate link wrapping
- If rejected, pivot to Option A (Amazon Associates)

Verification:
- npm run ai:verify (all 4 gates must pass)
- Test affiliate link wrapping (manual click-through)
- Verify disclosures visible (privacy policy + dedicated page)
- Proof screenshots if UI changes (disclosure pages)

After:
- Update .ai/SESSION_LOG.md with application status + results
- Document approval/rejection in .ai/LEARNINGS.md
- Run /capsule MONETIZATION to update monetization topic
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

**Last updated:** Feb 10, 2026 by Claude Sonnet 4.5 (Home Depot Affiliate Analysis Handoff for Opus 4.6)
