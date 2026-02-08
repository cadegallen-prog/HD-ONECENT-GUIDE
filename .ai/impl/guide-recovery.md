# Guide Recovery — Implementation Plan

**Status:** APPROVED
**Created:** 2026-02-07
**Architect:** Claude Opus 4.6

---

## Goal

Recover guide quality from 4.5/10 to founder standard. Fix AI-documentation voice, redistribute 2026 intel across chapters, fix concept ordering, overhaul FAQ visibility, improve hub triage, restore visual hierarchy, create drift guards, and define a mobile-first monetization layout that maximizes revenue without degrading UX or policy compliance.

## Done Means (Testable)

1. All claim matrix rows resolved (zero red rows)
2. All 5 locked copy strings in `GUIDE_LOCKED_COPY.md` verified unchanged via diff
3. "community-reported" / "many hunters report" max 1x per chapter (currently ~30 in Inside Scoop alone)
4. ICE/$.02/ZMA/Store Pulse present in correct chapters per distribution map
5. Speed-to-Penny defined in Chapter 2 (currently absent from entire guide)
6. No concept referenced before introduced (verified via cross-reference map)
7. Zero `<details>` elements in FAQ (currently 20)
8. All FAQ answers visible without clicking
9. Guide hub has user triage, chapter descriptions, and either (a) 800+ substantive words if monetized or (b) ads excluded if it remains navigation-first
10. H2 bottom border restored in `.guide-article` CSS
11. H2 styling controlled exclusively by `.guide-article h2` CSS rule (no inline Tailwind overrides)
12. Monetized guide chapter pages meet an internal 800+ visible-word quality target (content-first, non-filler)
13. Guide monetization contract exists with route eligibility, slot map, and mobile frequency caps
14. Repetitive guardrails are automated in repo commands/scripts (not chat-memory tasks)
15. All 4 gates pass: lint, build, test:unit, test:e2e
16. Playwright proof for all 8 guide routes
17. `Locked founder copy preserved: YES`

## Constraints & Non-Negotiables

- **Route model unchanged:** `/guide` hub + 7 root routes (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`)
- **No new dependencies**
- **No raw Tailwind colors** — CSS variable tokens only
- **globals.css changes limited to:** restoring H2 border-bottom in `.guide-article h2`, adding `.guide-callout-speculative` variant, and optional H2 spacing tweak (32px/16px)
- **globals.css changes require explicit Cade approval** before implementation
- **Locked copy is immutable** — grammar-only cleanup IF meaning is identical
- **Design system tokens unchanged** (no new colors, no value changes)
- **Store Finder not involved** (no risk to fragile component)
- **Existing ChapterNavigation pattern preserved** — 1 prev/next per chapter, no competing CTAs
- **Existing Prose variant="guide" and PageShell patterns preserved**
- **Content-first monetization:** no ad-only screens, no legal/compliance route monetization, and no ad density that overwhelms primary content
- **Automation-first process:** recurring checks must be encoded in repo scripts/checks; no copy/paste-only operational dependency

---

## Phase 0: Automation + Monetization Guardrails (DO FIRST)

### Step 0.1: Create a guide monetization contract

**File:** `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md` (NEW)

Define monetization rules before content edits begin so ad decisions do not drift later.

Required sections:

1. **Route eligibility**
   - Monetized by default: chapter routes (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`) once content threshold is met
   - Conditional: `/guide` hub monetized only if it reaches substantive longform depth; otherwise excluded
   - Always excluded: legal/compliance pages (`/privacy-policy`, `/terms-of-service`, and similar non-editorial policy pages)
2. **Mobile-first slot map**
   - Define exact insertion locations by route (intro-ad position, in-article cadence, terminal section behavior)
   - First ad appears only after meaningful content begins (never before the opening educational context)
3. **Frequency guardrails**
   - Set max in-article frequency per route for mobile and desktop
   - Explicitly block "ad clusters" (back-to-back ad units with minimal intervening content)
4. **Policy-safe messaging guardrails**
   - In-Store Strategy must remain explanatory and professional (system behavior, not circumvention tactics)

**Risk:** Low. Doc-only, but it prevents monetization drift.

### Step 0.2: Automate recurring guardrail checks

**Intent:** Remove repetitive manual memory burden from the workflow.

Add or extend repo checks so the following are machine-verified:

1. No `<details>` elements in FAQ once Phase 2 is complete
2. No inline Tailwind classes on guide chapter `<h2>` elements
3. Word-count report for guide routes (visible body text)
4. Monetization contract present and updated

Preferred integration:

- Add a single command alias for implementers (example: `npm run ai:guide:guardrails`)
- Include guardrail output path in `reports/` so verification artifacts are persistent

**Risk:** Low-Medium. Small script/update work, high long-term consistency payoff.

---

## Phase 1: Content & Voice Recovery (NO UX changes)

### Step 1.0: Create Locked Copy Document

**File:** `.ai/topics/GUIDE_LOCKED_COPY.md` (NEW)

Create with exact verbatim strings from current chapter files:

| #   | Source File                      | Locked String / Context                                                                                                                                                   |
| --- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `app/digital-pre-hunt/page.tsx`  | "Dusty boxes or items that look untouched for months"                                                                                                                     |
| 2   | `app/in-store-strategy/page.tsx` | UPC not yellow tag detail: scan manufacturer barcode at SCO only; yellow-tag scan triggers "customer needs assistance"; no-barcode exception requiring employee SKU entry |
| 3   | `app/in-store-strategy/page.tsx` | "Don't scan the QR code" — QR triggers "customer needs assistance"                                                                                                        |
| 4   | `app/in-store-strategy/page.tsx` | Self-checkout vs employee verification paragraph (employee may take item, barcode photo/SKU lookup, pushback/questions, safest path = self-checkout)                      |
| 5   | `app/in-store-strategy/page.tsx` | Filler item tip + FIRST/Zebra SCO notification behavior                                                                                                                   |

**Action:** Read the exact current text from each file, copy verbatim into GUIDE_LOCKED_COPY.md. This is the FIRST step — nothing else changes until this exists.

**Risk:** Low. Doc-only change.

---

### Step 1.1: Build Extended Claim Matrix

**File:** `.ai/audits/guide-claim-matrix-2026-02-07.md` (NEW)

**Action:**

1. Start from the existing 22-row matrix (from Codex session in `Guide Remodel/codexdialogue.txt`)
2. Add rows for every 2026 intel claim from `newinfoforguide.html` not already covered
3. Verify each row against current chapter content

**Columns:** `#` | Source section | Current route | Current claim text | Status (accurate/altered/wrong/missing/speculative) | Required correction | Label required | Confidence

**Known issues from prior matrix (8 amber/red rows to resolve):**

| #   | Issue                                               | Severity | Resolution                                                                |
| --- | --------------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| 3   | Cadence A/B: 13w/7w framing dropped                 | Medium   | Restore approximate cycle durations in Ch 2                               |
| 6   | "verify with the app" conflicts with source         | Critical | Replace with "in-store UPC/register scan is the truth" in all instances   |
| 8   | Yellow-tag scan lockout risk under-described        | Medium   | Expand to include intervention/hold/lockout wording (caveated)            |
| 11  | "clearance areas" still leads instead of home bay   | Medium   | Reorder to home-bay/aisle-first wording in Ch 4                           |
| 13  | Zero-Comm mechanism largely absent                  | High     | Add ZMA/Zero-Comm context to Ch 4 explaining WHY checkout friction exists |
| 15  | ZMA disposition data missing                        | High     | Add disposition summary (compactor/RTV/donation) to Ch 4 or Ch 5          |
| 21  | Combined "No Home + late-stage" signal not explicit | Medium   | Add signal stacking rule to Ch 2                                          |
| 22  | MET reset timing underrepresented                   | High     | Add concrete timing signals to Ch 4 + Ch 5                                |

**New rows to add from newinfoforguide.html:**

| Topic                                      | Current state                  | Required                                |
| ------------------------------------------ | ------------------------------ | --------------------------------------- |
| Store Pulse replacing IMS                  | Mentioned in Ch 5 only, hedged | Introduce foundationally in Ch 1        |
| ICE metrics (I/C/E breakdown)              | Mentioned briefly in Ch 5      | Full breakdown in Ch 2                  |
| Speed-to-Penny (14-day compressed cadence) | NOT IN GUIDE AT ALL            | Define in Ch 2                          |
| $.02 buffer as 48hr MET signal             | Brief mention in Ch 2 + Ch 5   | Expand with operational logic           |
| Home Bay replacing endcaps                 | Partial mention                | Strengthen in Ch 3 + Ch 4               |
| Automated Buy-Back/RTV POS locks           | Brief mention in Ch 5          | Add to Ch 4 explaining unsellable items |
| Department Supervisor de-skilling          | Not mentioned                  | Brief mention in Ch 5 as context        |
| Ghost Inventory paradox ($80K+)            | Not mentioned                  | Brief mention in Ch 5                   |

**Risk:** Low. Doc-only analysis step.

---

### Step 1.1b: Normalize H2 Inline Styling Across All Chapters

**WHY THIS STEP EXISTS:** Guide chapter files currently have inline Tailwind classes stamped on every `<h2>` element (e.g., `className="text-2xl font-bold mt-8 mb-6"`). These inline utilities sit in Tailwind's `@layer utilities`, which **always beats** the `.guide-article h2` rule in `@layer components`. This means the master CSS rule in `globals.css` is partially or fully overridden in every chapter. The proposed Phase 2.2 CSS changes (border-bottom, spacing tweak) will NOT render consistently unless the inline overrides are removed first.

**Current state by file:**

| File                           | Current inline H2 classes                | Problem                                                                  |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------ |
| `what-are-pennies/page.tsx`    | `text-2xl font-bold mt-8 mb-6`           | `mb-6` overrides CSS `mb-4`; duplicates size/weight                      |
| `clearance-lifecycle/page.tsx` | Mixed: `mb-6`, `mt-8 mb-6`, `mt-10 mb-6` | **Inconsistent** — different H2s in the SAME file have different spacing |
| `digital-pre-hunt/page.tsx`    | `text-2xl font-bold mb-6`                | No `mt`, so CSS applies for top margin — but `mb-6` overrides bottom     |
| `in-store-strategy/page.tsx`   | `text-2xl font-bold mb-6`                | Same conflict                                                            |
| `inside-scoop/page.tsx`        | Mixed: `mb-6` and `mt-10 mb-6`           | **Inconsistent** within the file                                         |
| `facts-vs-myths/page.tsx`      | `text-2xl font-bold mb-8` or `mt-8 mb-6` | `mb-8` creates unique spacing not seen anywhere else                     |
| `faq/page.tsx`                 | `text-2xl font-bold mt-8 mb-6`           | `mb-6` overrides                                                         |

**Action:** In every chapter file listed above, remove ALL inline Tailwind classes from `<h2>` elements. Change from:

```jsx
<h2 className="text-2xl font-bold mt-8 mb-6">Section title</h2>
```

To:

```jsx
<h2>Section title</h2>
```

The `.guide-article h2` rule in `globals.css` then becomes the **single source of truth** for all guide heading styling: size, weight, spacing, color, border, and text-wrap.

**Exception:** If any H2 has a class that is NOT duplicated by the CSS rule (e.g., a unique `id` or a non-styling class), keep that class. Only strip Tailwind utility classes that the CSS rule already covers.

**IMPORTANT:** This step MUST happen during Phase 1, before Phase 2 CSS changes. Otherwise the CSS changes will appear to work in some chapters and not others, causing confusion.

**Verification:** After stripping, grep all chapter files for `<h2 className=`. The only matches should be in non-guide pages (home, penny-list, etc.) or the exceptions noted above.

**Risk:** Low. This is a mechanical removal that makes the CSS rule authoritative. No visual change if the CSS rule values match the most common inline values.

---

### Step 1.2: Redistribute 2026 Intel

This is the LARGEST content change. Each chapter gets specific additions.

#### Chapter 1: What Are Pennies (`app/what-are-pennies/page.tsx`)

**Current problems:**

- ZMA mentioned once, buried (line 78)
- No Store Pulse context
- No foundational 2026 framing

**Changes:**

1. Add a brief "How the system works (2026)" section after "Why penny items exist" (H2)
   - Introduce Store Pulse as the system that governs clearance (1-2 sentences)
   - Mention it replaced the older IMS system
   - Keep it simple: "The internal system that tracks every clearance item is called Store Pulse. It replaced an older system in 2026 and now uses real-time data to decide when items get marked down and when they get pulled."
2. Introduce ZMA term earlier and more clearly: "When an item hits penny price, the system flags it as ZMA (Zero Margin Adjustment) — that's the internal removal stage."
3. Brief mention of Zero-Comm: "If a penny item sells, the system logs it as a Zero-Comm report — essentially a failure log that says the store didn't pull the item in time. This is why checkout can be complicated."

**Voice rules enforced:** Direct "you" language, no hedging, confident tone.

**Estimated additions:** ~300 words (target: bring Ch 1 to 850+ words — currently ~550 and below monetization depth target)
**Risk:** Low. Adding context to an existing structure.
**AdSense tone note:** Frame these terms as "how the system works," NOT as insider tricks. Example: "The internal system that tracks every clearance item is called Store Pulse" reads as educational. Avoid any framing that implies exploiting employee workflows.

#### Chapter 2: Clearance Lifecycle (`app/clearance-lifecycle/page.tsx`)

**Current problems:**

- $.02 buffer mentioned as community note only (line 258)
- No ICE metrics
- No Speed-to-Penny definition
- "No Home" used at line 328 without being properly introduced or defined (just dropped into a bullet list)
- "Home bay" first appears in the TruthMatrix at line 27 ("Clearance can appear in home bays...") but without endcap phase-out context
- ~10 instances of hedging language

**Changes:**

1. Add "What drives the cadence (2026 context)" section after existing cadence tables
   - ICE metrics: "Stores track three signals for every clearance item: Inactive (no longer restocked), Clearance (in the markdown cycle), and E-velocity (how fast it's moving). When e-velocity drops below a threshold, the system flags the item for faster removal."
   - Speed-to-Penny: "In 2026, some items can move from first markdown to penny in as little as 14 days — compared to the older 9-14 week cycles. The system now skips stages when e-velocity data says the item isn't moving."
2. Strengthen $.02 buffer section from "community note" to actionable guidance:
   - "A $.02 price is a 48-hour signal. It tells the MET team to locate and pull the item. The item is still technically sellable, but the clock is ticking. If you see $.02, you likely have less than 48 hours before it's pulled."
3. Introduce "No Home" concept here (currently used in Ch 2 without definition, then referenced again in Ch 3):
   - "When a planogram update removes an item's shelf location, the system marks it 'No Home.' This is a strong signal — the store has no place for it, which often means it's headed for final markdown or removal."
4. Add combined signal stacking (currently missing — claim matrix row 21):
   - "'No Home' status + late-stage ending (.03/.02) + older tag date = strongest signal stack."
5. Kill hedging: Replace "In many reports this stage lasts about..." with "This stage typically lasts..." (section-level caveat at top instead)

**Estimated additions:** ~300 words, ~200 words of existing hedging language removed/tightened
**Risk:** Medium. This is the most content-heavy chapter change. Must preserve cadence table accuracy.

#### Chapter 3: Digital Pre-Hunt (`app/digital-pre-hunt/page.tsx`)

**Current problems:**

- "No Home" used here (line 50, line 183) without proper definition — should back-reference Ch 2
- ~4 instances of hedging (line 50 "community-reported term", line 142, line 183 "Some hunters also report", line 192)
- No mention of Home Bay replacing endcaps

**Changes:**

1. Change "No Home" references to back-references: "Items marked 'No Home' (introduced in Chapter 2) are..."
2. Add Home Bay context to "Where to look" or "Digital pre-hunt steps":
   - "Clearance endcaps are being phased out in many stores. Items now stay in their home bay — the original shelf location — through the entire markdown cycle. The deepest discounts are hidden in plain sight alongside full-price stock."
3. Verify locked copy #1 preserved: "Dusty boxes or items that look untouched for months"
4. Tighten hedging: Replace "Some hunters also report" with direct statements + section-level caveat

**Estimated additions:** ~100 words
**Risk:** Low. Minor additions, mostly back-referencing.

#### Chapter 4: In-Store Strategy (`app/in-store-strategy/page.tsx`)

**Current problems:**

- ~10 instances of hedging (lines 39-44 in communityReportedTips array, lines 87, 146-148, 192-193)
- "Home bay" mentioned once (line 67) but not in context of endcap phase-out
- No ZMA/Zero-Comm explanation for WHY checkout is hard
- MET timing underrepresented
- Locked copy must be preserved (items 2-5)

**ADSENSE CRITICAL:** This is the highest-risk chapter for AdSense "Encouraging Dishonest Behavior" flags. Every edit must frame actions as understanding the system, not circumventing employees. Example framing: "The register may prompt for assistance because of the Zero-Comm flag. This is a standard inventory procedure." NOT: "Here's how to avoid the employee catching it."

**Changes:**

1. Add "Why checkout can be complicated" section (or integrate into existing "Checkout: keep it simple"):
   - Zero-Comm explanation: "Every penny sale generates an internal report called a Zero-Comm. It's a failure log — it means the store didn't pull the item before someone found it. This is why some associates push back: the sale creates paperwork for them."
   - POS locks: "Some items — especially power tools from brands like Milwaukee and Ryobi — have automated buy-back locks. Even a willing associate can't sell them. The system blocks the sale because the vendor has already arranged to reclaim the inventory."
2. Add $.02 buffer practical guidance (cross-reference from Ch 2):
   - "If you find an item at $.02, move quickly. This price is a 48-hour signal to the MET team to pull it."
3. Strengthen "Where to look" with Home Bay emphasis:
   - Reorder existing content: home bays first, then seasonal areas, then overhead. De-emphasize "clearance areas/endcaps."
4. Add MET timing signal:
   - "MET teams handle bay resets on a scheduled calendar. Penny-outs are often synchronized with these resets. The 48 hours before a scheduled reset is when items are most likely to be pulled."
5. VERIFY all 4 locked copy strings unchanged after edits
6. Kill hedging: Section-level caveat at top of checkout section, remove per-bullet "Community members report" / "Some stores" language

**Estimated additions:** ~250 words
**Risk:** HIGH — This file contains 4 of 5 locked copy strings. Every edit must be verified against GUIDE_LOCKED_COPY.md. Implementer must diff locked strings before and after.

#### Chapter 5: Inside Scoop (`app/inside-scoop/page.tsx`)

**Current problems:**

- ~30 instances of "Community-reported:" prefix across arrays and inline text — reads like a disclaimer database
- ALL 2026 intel dumped here instead of distributed
- Speed-to-Penny not mentioned at all
- Content that belongs elsewhere is cluttering this chapter
- Page metadata (`title` and `description`) won't match content after redistribution

**Changes:**

1. REMOVE content that's been redistributed to other chapters:
   - Store Pulse intro → moved to Ch 1
   - ICE metrics breakdown → moved to Ch 2
   - $.02 buffer → moved to Ch 2 + Ch 4
   - Home Bay / endcap phaseout → moved to Ch 3 + Ch 4
   - ZMA/Zero-Comm basics → moved to Ch 1 (brief) + Ch 4 (detail)
   - MET timing basics → moved to Ch 4

2. KEEP as "deeper context for experienced hunters":
   - Detailed handheld/clearance tool descriptions
   - Department Supervisor de-skilling context
   - Ghost Inventory paradox ($80K+ clearance per store)
   - Detailed ZMA disposition paths (compactor 40-60% / RTV 40% / donation)
   - Pro liquidation bundle speculation (labeled)
   - Buy-Back/RTV vendor lock details
   - Policy vs. practice nuance
   - 2026 workflow signals (deeper detail)

3. REFRAME chapter intro:
   - FROM: "Community-reported internal terms" (reads like a glossary dump)
   - TO: "This chapter covers deeper operational context for experienced hunters. The basics — Store Pulse, ZMA, and the $.02 signal — are introduced in earlier chapters. Here you'll find the operational logic behind what you see in-store."

4. KILL hedging:
   - Remove "Community-reported:" prefix from every bullet (~30 instances across `communitySignals`, `handheldNotes`, `managementFocus`, `policyPracticeNotes`, `reported2026Signals` arrays, plus inline bullets and H2 headings)
   - Add ONE section-level caveat at the top: "Note: This section draws on community reports and public sources. Specifics vary by store and region."
   - Max 1x "community-reported" in the entire chapter (the section-level caveat counts)

5. UPDATE METADATA to match new chapter scope:
   - `title`: "Inside Scoop: Operational Context for Experienced Hunters | Penny Central"
   - `description`: "Deeper operational context: disposition paths, handheld tools, policy vs. practice, and advanced 2026 workflow signals for experienced penny hunters."
   - `subtitle` (PageHeader): "Deeper operational context — the systems and workflows behind what you see in-store."

**Estimated changes:** ~500 words removed (redistributed), ~200 words rewritten, hedging reduction from ~30 instances to 1 section-level caveat
**WORD COUNT CHECK:** After removing ~500 words and adding ~200, this chapter drops from ~1100 to ~800 words. Still above 600 minimum. If it drops below 800 after edits, expand the "KEEP" sections with additional operational detail (e.g., Ghost Inventory specifics, detailed ZMA disposition breakdowns).
**Risk:** HIGH — Largest volume of changes. Must ensure redistributed content actually landed in destination chapters.

#### Chapter 6: Facts vs. Myths (`app/facts-vs-myths/page.tsx`)

**Current problems:**

- ~2-3 soft hedging instances (minimal — this chapter is already relatively direct)
- No 2026-specific content needed here
- Reality Comparison table (4 rows) overlaps with Ch 2 but serves a different purpose (myth-busting vs. cadence reference)

**Changes:**

1. Reality Comparison table (4 rows): KEEP as-is — it's a claim/reality format for myth-busting, not a cadence duplicate. Add a cross-reference note: "For detailed cadence breakdown, see Chapter 2."
2. Tighten the 2-3 hedging instances where found
3. Ensure myth #9 ("Only the clearance endcap has penny items") explicitly references home-bay-first reality from Ch 3/Ch 4

**Estimated additions:** ~50 words of adjustments
**Risk:** Low. Minor changes.

#### Chapter 7: FAQ (`app/faq/page.tsx`)

**Current problems:**

- 20 `<details>` elements hiding every answer
- 6 instances of hedging

**Changes:** (deferred to Phase 2 — FAQ overhaul is a UX change)

---

### Step 1.3: Apply Voice Rules to All Edits

**Rules (applied during Steps 1.2 above, verified as a separate pass):**

| Rule                  | Before (example)                                     | After (example)                                                                                         |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Lead with action      | "Many hunters report scanning a filler item first"   | "Scan a filler item first"                                                                              |
| Use "you"             | "Here's what hunters typically observe"              | "Here's what you'll see"                                                                                |
| Section-level caveats | Per-bullet "Community-reported:" (~30 times in Ch 5) | One caveat at section top, max 1x "community-reported" per chapter                                      |
| Confident tone        | "In many reports this stage lasts about 1-4 weeks"   | "This stage typically lasts 1-4 weeks"                                                                  |
| WHY→WHAT              | "ZMA is a removal stage"                             | "ZMA means the system has flagged this item for removal — most are destroyed or returned to the vendor" |

**Verification:** After all content edits, grep for:

- `community-reported` — max 1 per chapter file
- `many hunters` — should be 0
- `hunters report` — should be 0
- `some reports` — should be 0

---

### Step 1.4: Fix Concept Ordering

**Cross-reference map (verified against chapter order):**

| Concept        | First INTRODUCED in                                                   | First REFERENCED in (current)                 | Fix                                                                                   |
| -------------- | --------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Store Pulse    | Ch 5 (inside-scoop)                                                   | Ch 5                                          | Move introduction to Ch 1                                                             |
| ICE metrics    | Ch 5 (inside-scoop)                                                   | Ch 5                                          | Move introduction to Ch 2                                                             |
| Speed-to-Penny | NOWHERE                                                               | NOWHERE                                       | Add to Ch 2                                                                           |
| ZMA            | Ch 1 (what-are-pennies, line 78)                                      | Ch 1                                          | OK (already introduced first) — strengthen                                            |
| Zero-Comm      | Ch 5 (inside-scoop)                                                   | Ch 5                                          | Add brief intro in Ch 1, detail in Ch 4                                               |
| No Home        | Ch 2 (clearance-lifecycle, line 328) — used in bullet but NOT defined | Ch 2 (line 328), Ch 3 (lines 50, 183)         | Properly define in Ch 2 before first use; Ch 3 back-references                        |
| $.02 buffer    | Ch 2 (clearance-lifecycle, line 258)                                  | Ch 2                                          | OK but labeled "community note" — strengthen to confident statement                   |
| MET team       | Ch 2 (clearance-lifecycle, line 322)                                  | Ch 2                                          | OK — add practical timing in Ch 4                                                     |
| Home Bay       | Ch 2 (clearance-lifecycle, TruthMatrix line 27: "home bays")          | Ch 2 (line 27), Ch 3 (absent), Ch 4 (line 67) | Already mentioned in Ch 2 — add endcap phase-out context in Ch 3 + strengthen in Ch 4 |
| BOLT           | Ch 5 (inside-scoop)                                                   | Ch 5                                          | Keep in Ch 5 only (advanced context)                                                  |

**Post-implementation verification:** Read chapters 1-7 in order and confirm no concept is used before it's defined.

---

## Phase 2: Visual & UX Recovery

### Step 2.0: FAQ Overhaul (`app/faq/page.tsx`)

**Current state:** 20 `<details>` elements with custom accordion styling. Every answer hidden behind a click.

**Target state:** Visible Q&A format grouped by topic. All answers visible without clicking.

**Changes:**

1. Remove all `<details>` / `<summary>` elements
2. Group existing 20 questions into 4 categories:
   - **Basics** (Q1, Q2, Q3, Q6, Q10, Q20): What are pennies, how to find them, why they exist, price endings, legality, availability
   - **Verification** (Q5, Q11, Q13, Q14, Q16): App accuracy, verifying price, shelf tags, kiosks, stock discrepancies
   - **Checkout & Policy** (Q4, Q7, Q8, Q9, Q12, Q15, Q17): Store discretion, timing, refusals, locks, employees, multiples, returns
   - **Etiquette & Community** (Q18, Q19): Reporting finds, hiding items
3. Each category gets an H2 heading
4. Each Q&A rendered as:
   ```
   <h3>Question text</h3>
   <p>Answer text</p>
   ```
5. Remove accordion CSS (`[&_summary::-webkit-details-marker]:hidden`, rotation animation)
6. Preserve JSON-LD FAQ schema (currently at lines 127-138 — built from `faqs` array, independent of DOM structure so it survives the `<details>` removal)
7. Expand concise answers where needed to reach monetization-depth target without filler (target: 850+ visible words on `/faq`)

**Pre-implementation check:** Before modifying, grep `__tests__/` and `e2e/` directories for `details`, `summary`, `faq`, and FAQ-specific selectors. If any e2e tests check for `<details>` elements on the FAQ page, those tests must be updated simultaneously.

**ADSENSE NOTE:** Making all 20 answers visible dramatically increases indexable content. Pair visibility with concise answer expansion so `/faq` lands above the internal monetization-depth threshold (850+ visible words) without adding fluff.

**Risk:** Medium. Must preserve SEO-critical JSON-LD schema. Must verify e2e tests still pass.

### Step 2.1: Guide Hub Redesign (`app/guide/page.tsx`)

**Current state:** Header + "How to use this guide" + TableOfContents grid + 4 quick links. Sparse, no user triage.

**Changes:**

1. Add user triage section above TableOfContents:
   ```
   ## Where should you start?
   - **New to penny hunting?** Start with Chapter 1 — it explains what penny items are and why they exist.
   - **Know the basics?** Jump to Chapter 3 — it covers how to find deals before you go to the store.
   - **Heading to a store today?** Chapter 4 is your field guide — verification, checkout, and what to expect.
   - **Want the inside story?** Chapter 5 covers the operational systems behind the scenes.
   ```
2. Add 1-line descriptions to TableOfContents chapter cards (currently cards have titles + generic description). Update `components/guide/TableOfContents.tsx` chapter data:
   - Ch 1: "What penny items are, why they exist, and how the system works"
   - Ch 2: "How clearance pricing moves, cadence patterns, and the signals that matter"
   - Ch 3: "Using online tools, reading labels, and scouting before you go"
   - Ch 4: "Verifying prices, checkout strategy, and what to do when things get complicated"
   - Ch 5: "The operational systems behind clearance — Store Pulse, ZMA, and 2026 changes"
   - Ch 6: "Common misconceptions debunked with evidence"
   - Ch 7: "Quick answers to the most common questions"
3. Tighten spacing — reduce dead space between sections
4. **WORD COUNT + MONETIZATION CONCERN:** The guide hub is currently ~200-300 words. Even with the triage section added (~100 words), it will be ~300-400 — below the internal 800+ monetization-quality target. Options:
   - Add a substantive intro paragraph (~150 words) explaining what makes this guide different: community-verified, 2026-updated, field-tested
   - Expand the "How to use this guide" section into a proper "What this guide covers" with 1-2 sentences per chapter
   - Add a "What makes this guide different" callout explaining the community-reporting methodology, verification standards, and 2026 operational context
   - Combined target: 800+ words of visible body text on the hub page IF hub ads are enabled
   - If hub remains navigation-first, keep ads OFF for `/guide` and monetize chapter routes only

**Risk:** Low-Medium. TableOfContents component is static data — safe to update descriptions. Hub content expansion is additive only.

### Step 2.2: Visual Tuning

#### 2.2a: Restore H2 Bottom Border (`app/globals.css`)

**Current state:** DESIGN-SYSTEM-AAA.md documents H2 border-bottom but it's NOT in CSS. The Feb 6 cleanup removed it.

**Change:**

```css
.guide-article h2 {
  @apply text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)];
  text-wrap: pretty;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-default);
}
```

Note: Also proposing `mt-10` (40px) → `mt-8` (32px) to tighten spacing. This reduces the 40px/16px asymmetry to 32px/16px.

**PREREQUISITE:** Step 1.1b (H2 normalization) MUST be completed first. After that step strips all inline Tailwind classes from H2 elements, this CSS rule becomes the single source of truth for guide heading styling. Without the normalization step, these values will be partially overridden by inline classes in individual chapters.

**REQUIRES CADE APPROVAL** — this is a globals.css change.

#### 2.2b: Add Speculative Content Callout Variant (`app/globals.css`)

**Change:** Add `.guide-callout-speculative` variant for community-reported sections:

```css
.guide-callout-speculative {
  border-left-color: var(--text-muted);
}
```

This gives a neutral gray left-border to distinguish "community-reported context" from factual content (default navy) or warnings (amber).

**Usage:** Wrap any remaining community-reported sections in `<div className="guide-callout guide-callout-speculative">` so readers can visually identify speculation.

**REQUIRES CADE APPROVAL** — this is a globals.css change.

#### 2.2c: Add Subtle Shadow to Callout Boxes

**Change:** In `.guide-callout`, add:

```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```

Only in light mode. Dark mode already has sufficient contrast between card and page backgrounds.

**REQUIRES CADE APPROVAL** — this is a globals.css change.

#### 2.2d: Table Deduplication

**Current state:** Cadence table data appears in 3 places:

- Ch 2 (clearance-lifecycle): Full cadence table + price ending cheat sheet (definitive)
- Ch 3 (digital-pre-hunt): Label signals table (6 rows — similar to price ending cheat sheet)
- Ch 6 (facts-vs-myths): Reality comparison table (4 rows — different format, not a duplicate)

**Change:**

- Keep Ch 2 as the definitive source for cadence/pricing tables
- Ch 3 label signals table: Keep but add cross-reference: "For the complete cadence breakdown, see Chapter 2."
- Ch 6 reality comparison table: Keep as-is (different purpose — myth debunking, not cadence reference)

**Risk:** Low. Adding cross-references, not removing content.

### Step 2.3: Monetization Layout Integration (Mobile-First)

**Objective:** Maximize ad revenue on guide content without harming readability, trust, or policy compliance.

**Changes:**

1. Implement route-level monetization eligibility from `GUIDE_MONETIZATION_CONTRACT.md`.
   - Chapter routes: monetization on (after content threshold checks)
   - `/guide` hub: monetization conditional on substantive depth; default off if navigation-first
   - Legal/compliance routes: monetization off
2. Define in-article ad placement map for guide chapters.
   - First ad after the opening educational block (not before useful content)
   - Subsequent ads inserted between substantive sections, not stacked back-to-back
   - Avoid placements that split tightly coupled instructional steps
3. Add mobile-first ad frequency caps.
   - One sticky unit max on mobile
   - Explicit cap for inline units per chapter to prevent "more ads than content" risk
4. Add experiment design for monetization lift.
   - Baseline configuration and higher-load variant
   - Promote higher-load variant only if UX guardrails stay healthy

**UX guardrails (must hold before raising ad load):**

- No material drop in scroll depth or session duration
- No meaningful regression in Core Web Vitals (especially CLS)
- No increase in "thin/non-content" page risk from policy perspective

**Risk:** Medium. Revenue upside is high, but over-aggressive placements can hurt trust, retention, and monetization eligibility.

---

## Phase 3: Drift Guard

### Step 3.0: Create Guide Format Contract

**File:** `.ai/topics/GUIDE_FORMAT_CONTRACT.md` (NEW)

**Contents:**

1. Canonical chapter template (PageShell + Prose variant="guide" + EditorialBlock + ChapterNavigation)
2. Voice rules (copied from this plan — lead with action, use "you", section-level caveats, max 1x community-reported per chapter)
3. Locked copy reference (pointer to GUIDE_LOCKED_COPY.md)
4. 2026 intel distribution map (which concept belongs in which chapter)
5. Concept introduction order (Store Pulse→Ch1, ICE→Ch2, etc.)

**Forbidden reintroductions:**

- `<details>` dropdowns in FAQ
- "Sources" blocks in chapter body
- Dual/conflicting nav cues at chapter bottom
- Dead-space gaps >80px between content blocks
- Per-bullet "community-reported" labeling
- Ad-hoc per-page styling that breaks template symmetry
- "Many hunters report" / "hunters report" / "some reports describe" hedging patterns

**Risk:** Low. Doc-only.

---

## Files to Create

| File                                          | Phase | Purpose                                            |
| --------------------------------------------- | ----- | -------------------------------------------------- |
| `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md`   | 0.1   | Route eligibility + ad layout/frequency guardrails |
| `.ai/topics/GUIDE_LOCKED_COPY.md`             | 1.0   | Immutable founder-crafted strings                  |
| `.ai/audits/guide-claim-matrix-2026-02-07.md` | 1.1   | Claim verification matrix                          |
| `.ai/topics/GUIDE_FORMAT_CONTRACT.md`         | 3.0   | Drift prevention rules                             |

## Files to Modify

| File                                                   | Phase      | What Changes                                                                                                                            | Risk                                       |
| ------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `app/what-are-pennies/page.tsx`                        | 1.1b + 1.2 | Strip H2 inline classes; +Store Pulse intro, +ZMA strengthening, +Zero-Comm brief                                                       | Low                                        |
| `app/clearance-lifecycle/page.tsx`                     | 1.1b + 1.2 | Strip H2 inline classes; +ICE metrics, +Speed-to-Penny, +$.02 strengthening, +No Home definition, hedging reduction                     | Medium                                     |
| `app/digital-pre-hunt/page.tsx`                        | 1.1b + 1.2 | Strip H2 inline classes; No Home back-ref, +Home Bay context, hedging reduction                                                         | Low                                        |
| `app/in-store-strategy/page.tsx`                       | 1.1b + 1.2 | Strip H2 inline classes; +Zero-Comm/ZMA detail, +$.02 practical, +Home Bay emphasis, +MET timing, hedging reduction, AdSense tone check | **HIGH** (4 locked strings + AdSense tone) |
| `app/inside-scoop/page.tsx`                            | 1.1b + 1.2 | Strip H2 inline classes; redistribute out, reframe intro, kill ~30 hedges, keep advanced context, update metadata                       | **HIGH** (largest change volume)           |
| `app/facts-vs-myths/page.tsx`                          | 1.1b + 1.2 | Strip H2 inline classes; minor hedging fixes, endcap myth update, cross-reference to Ch 2                                               | Low                                        |
| `app/faq/page.tsx`                                     | 2.0        | Remove 20 `<details>`, group by topic (4 groups), visible Q&A, verify e2e tests first                                                   | Medium                                     |
| `app/guide/page.tsx`                                   | 2.1        | +User triage section, tighter layout, expand to 800+ if monetized (otherwise keep hub non-monetized)                                    | Low-Medium                                 |
| `components/guide/TableOfContents.tsx`                 | 2.1        | Update chapter descriptions                                                                                                             | Low                                        |
| `app/globals.css`                                      | 2.2        | +H2 border-bottom, +speculative callout, +shadow, H2 spacing tweak (AFTER Step 1.1b)                                                    | **REQUIRES APPROVAL**                      |
| `scripts/ai-verify.ts` + optional new guardrail script | 0.2        | Encode repetitive guide guardrail checks into one repeatable command                                                                    | Medium                                     |

## Files NOT Modified

- `components/page-templates.tsx` — no changes to PageShell/Prose
- `components/guide/ChapterNavigation.tsx` — current nav pattern is good
- `components/guide/EditorialBlock.tsx` — no changes needed
- `components/guide/sections/*` — old section components, not used by current chapter routes
- `next.config.js` — no route/redirect changes
- `app/sitemap.ts` — no route changes

---

## Change Sequencing (Implementation Order)

```
Phase 0 (Guardrails — DO FIRST)
│
├─ Step 0.1: Create GUIDE_MONETIZATION_CONTRACT.md
│  (define ad eligibility + mobile slot/frequency caps before edits)
│
├─ Step 0.2: Automate recurring guide guardrail checks
│  (no manual-memory dependency for repetitive checks)
│
Phase 1 (Content — after Phase 0, no UX/CSS)
│
├─ Step 1.0: Create GUIDE_LOCKED_COPY.md
│  (MUST be first — nothing else changes until this exists)
│
├─ Step 1.1: Build claim matrix
│  (Read-only analysis — informs all subsequent edits)
│
├─ Step 1.1b: Normalize H2 inline styling
│  (Strip inline Tailwind from all guide chapter H2s — prerequisite for Phase 2 CSS)
│
├─ Step 1.2: Chapter edits (in this order):
│  ├─ Ch 1 (what-are-pennies) — add foundations (+Store Pulse, +ZMA, +Zero-Comm)
│  ├─ Ch 2 (clearance-lifecycle) — add ICE/Speed-to-Penny/No Home definition
│  ├─ Ch 3 (digital-pre-hunt) — back-references + Home Bay endcap context
│  ├─ Ch 4 (in-store-strategy) — Zero-Comm/MET + verify locked copy + AdSense tone
│  ├─ Ch 5 (inside-scoop) — major rewrite: redistribute out, kill hedging, update metadata
│  └─ Ch 6 (facts-vs-myths) — minor fixes + cross-reference
│
├─ Step 1.3: Voice verification pass
│  (grep all chapters for banned phrases)
│
├─ Step 1.4: Concept ordering verification
│  (read Ch 1-7 in order, confirm no forward-references)
│
├─ Step 1.5: Word count verification
│  (monetized chapter pages target 800+ visible words, non-filler)
│
├─ CHECKPOINT: lint + build + test:unit + test:e2e
│  (must pass before Phase 2)
│
Phase 2 (Visual/UX — AFTER Phase 1 content is solid)
│
├─ Step 2.0: FAQ overhaul (remove <details>, group by topic, check e2e tests first)
├─ Step 2.1: Guide hub (add triage, update descriptions, expand to 800+ if monetized)
├─ Step 2.2: CSS changes (H2 border, speculative callout, shadow)
│  (REQUIRES CADE APPROVAL on globals.css changes)
│  (PREREQUISITE: Step 1.1b H2 normalization must be done)
├─ Step 2.3: Monetization layout integration (mobile-first slot map + frequency caps)
│
├─ CHECKPOINT: lint + build + test:unit + test:e2e
│
Phase 3 (Drift Guard — AFTER Phase 2)
│
├─ Step 3.0: Create GUIDE_FORMAT_CONTRACT.md
│
└─ FINAL: Full verification + proof bundle (incl. monetization/word-count gate + AdSense tone check)
```

---

## Risk Assessment

| Risk                                                       | Likelihood | Impact   | Mitigation                                                                                           |
| ---------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| Locked copy accidentally modified                          | Medium     | Critical | GUIDE_LOCKED_COPY.md created FIRST; diff check after every chapter edit; automated grep verification |
| Inside Scoop rewrite breaks content flow                   | Medium     | High     | Edit Ch 5 LAST in Phase 1 so all destination chapters already have redistributed content             |
| Inside Scoop word count drops too low after redistribution | Low        | Medium   | Post-edit word count check; expand KEEP sections if below 800 words                                  |
| FAQ JSON-LD schema breaks when removing `<details>`        | Low        | Medium   | Verify schema output in build; FAQ schema is separate from DOM elements                              |
| FAQ e2e tests check for `<details>` elements               | Low        | Medium   | Grep test files for `details`/`summary`/FAQ selectors BEFORE modifying                               |
| globals.css changes cascade unpredictably                  | Low        | High     | Changes are additive only; Step 1.1b strips inline overrides first so CSS is authoritative           |
| H2 inline class removal causes visual regression           | Low        | Low      | CSS rule already matches most common inline values; visual diff via Playwright proof                 |
| Hedging removal makes content sound too authoritative      | Low        | Medium   | Section-level caveats preserved; voice rules require WHY→WHAT connection, not unsupported claims     |
| Ch 4 triggers AdSense "Dishonest Behavior" flag            | Low        | Critical | All checkout guidance frames system behavior, not exploitation; implementer reviews tone             |
| Guide hub stays below monetization depth target            | Medium     | Medium   | Either expand to 800+ substantive words or keep hub non-monetized                                    |
| Over-aggressive ad density hurts UX/retention              | Medium     | High     | Mobile slot caps + ad spacing rules + rollout only when UX metrics remain stable                     |
| Monetization policy risk from ad-heavy low-content screens | Low        | Critical | Exclude legal/navigation-only screens; ensure editorial content leads each page                      |
| Repetitive manual checks are skipped in future sessions    | Medium     | High     | Encode checks in `ai:verify`/guide guardrail scripts and require artifact output                     |
| e2e tests fail after content changes                       | Low        | Medium   | Content changes don't affect page structure; run tests after Phase 1 before Phase 2                  |

---

## Rollback Plan

1. **Phase 1 (content):** `git stash` or `git checkout -- app/what-are-pennies/page.tsx app/clearance-lifecycle/page.tsx ...` for each modified chapter file
2. **Phase 2 (visual):** FAQ rollback: restore `<details>` elements. CSS rollback: remove added rules from globals.css
3. **Phase 3 (docs):** Delete new files

All phases are independently rollback-safe because:

- Phase 1 only modifies chapter content (no structural changes)
- Phase 2 CSS changes are additive (no existing values modified)
- Phase 3 is docs-only

---

## Verification Plan

### After Phase 1:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

Plus manual verification:

- Grep for banned phrases: `community-reported` (max 1 per chapter), `many hunters` (0), `hunters report` (0)
- Diff GUIDE_LOCKED_COPY.md strings against chapter files
- Read Ch 1-7 in order for concept ordering
- Generate per-route visible word-count report and confirm monetized chapter routes meet 800+ threshold
- Confirm `GUIDE_MONETIZATION_CONTRACT.md` route eligibility matches intended ad behavior

### After Phase 2:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
npm run ai:guide:guardrails (or equivalent consolidated guardrail command)
npm run ai:proof -- /guide /what-are-pennies /clearance-lifecycle /digital-pre-hunt /in-store-strategy /inside-scoop /facts-vs-myths /faq
```

### Final Acceptance (All Must Pass):

| Check                   | Pass condition                                                                      | Verification method                                           |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Factual accuracy        | Claim matrix: zero red rows                                                         | Manual review of matrix                                       |
| Locked copy             | All 5 strings unchanged                                                             | `diff` against GUIDE_LOCKED_COPY.md                           |
| Voice                   | Banned phrases at 0; "community-reported" max 1x/chapter                            | `grep -c` across all chapter files                            |
| 2026 intel distribution | ICE/$.02/ZMA/Store Pulse/Speed-to-Penny in correct chapters                         | Manual read-through                                           |
| FAQ                     | Zero `<details>` elements; all answers visible                                      | `grep -c "details" app/faq/page.tsx` = 0                      |
| Concept ordering        | No forward-references                                                               | Sequential read-through with cross-reference map              |
| H2 normalization        | Zero inline Tailwind classes on guide chapter H2s                                   | `grep -c 'h2 className' app/*/page.tsx` for guide routes only |
| Word count              | Monetized chapter pages meet 800+ visible-word internal threshold                   | Word count report per route (artifact in `reports/`)          |
| AdSense tone            | Ch 4 frames system behavior, not exploitation                                       | Manual read of Ch 4 checkout section                          |
| Monetization layout     | Route eligibility + mobile slot map + frequency caps are documented and implemented | Validate against `GUIDE_MONETIZATION_CONTRACT.md`             |
| Hub monetization gate   | `/guide` is either 800+ substantive words or explicitly excluded from ads           | Route-level ad eligibility check                              |
| Guardrail automation    | Single repo command validates recurring guide checks                                | Run command and attach artifact path                          |
| Visual consistency      | Consistent heading hierarchy, no gaps >80px                                         | Playwright proof screenshots                                  |
| Navigation              | 1 prev/next per chapter                                                             | Visual inspection of proof screenshots                        |
| Gates                   | lint, build, test:unit, test:e2e all pass                                           | Command output                                                |
| Proof                   | Screenshots for all 8 guide routes                                                  | `npm run ai:proof` output                                     |

---

## Monetization / E-E-A-T Requirements (Updated 2026-02-08)

**Policy reality:** Google does not publish a fixed minimum word count for ranking or monetization approval. The practical policy focus is content quality, publisher value, and avoiding ad-heavy or low-content screens.

**Internal strategy for PennyCentral guide monetization:**

1. **Content-depth target (internal):** 800+ visible words for monetized guide chapter pages (quality floor, not filler)
2. **E-E-A-T signals:** Experience (real operational observations), Expertise (specific system terminology like Store Pulse, ICE, ZMA), Authoritativeness (consistent voice), Trustworthiness (clear verified vs community-reported labeling)
3. **Policy-safe framing:** Ch 4 (In-Store Strategy) must explain system behavior, not encourage circumvention of employees/policies
4. **Indexable FAQ content:** All FAQ answers visible in-page (no hidden accordion dependency)
5. **Metadata accuracy:** Titles/descriptions aligned to actual page scope after redistribution
6. **Monetization eligibility by page type:** legal/compliance routes excluded; navigation-first pages (like `/guide` hub) monetized only if they meet substantive depth
7. **Mobile-first ad cadence controls:** ad placement map + frequency caps + no ad clusters

**Current word count estimates and post-plan monetization targets:**

| Page                       | Current ~Words    | Post-Plan ~Words                     | Status                                                          |
| -------------------------- | ----------------- | ------------------------------------ | --------------------------------------------------------------- |
| Ch 1 (What Are Pennies)    | ~550              | ~850+                                | Needs expanded foundational context to meet monetization target |
| Ch 2 (Clearance Lifecycle) | ~900              | ~1000                                | Passes                                                          |
| Ch 3 (Digital Pre-Hunt)    | ~750              | ~850                                 | Passes                                                          |
| Ch 4 (In-Store Strategy)   | ~800              | ~1050                                | Passes                                                          |
| Ch 5 (Inside Scoop)        | ~1100             | ~850+                                | Passes if redistribution does not drop below 800                |
| Ch 6 (Facts vs Myths)      | ~850              | ~900                                 | Passes                                                          |
| Ch 7 (FAQ)                 | ~700 (but hidden) | ~850+ (visible + expanded answers)   | Needs answer expansion in visible layout                        |
| Hub (/guide)               | ~200              | ~800+ if monetized, otherwise ad-off | Must pass gate before hub ads are enabled                       |

---

## Drift Checks (2026-02-08)

Heuristic repo scan before finalizing this plan:

- **Naming collisions ("My List" vs "My Lists"):** both strings exist in list-related features; this guide plan does not change list naming, so no direct collision introduced here.
- **Risky active-route includes pattern (`includes('/lists')`):** no matches found in `app/` or `components/`.
- **Touch-target regressions (<44px):** one `min-h-[36px]` usage found in `components/list-item-card.tsx`; out of scope for guide recovery, but should be tracked as separate UX debt.

No blocker for this guide plan. Documented here to prevent accidental scope creep during implementation.

---

## Resolved Questions / Decisions (Updated through 2026-02-08)

1. **globals.css H2 border:** APPROVED — restore bottom border on guide H2s
2. **H2 top spacing:** APPROVED — tighten from 40px (mt-10) to 32px (mt-8)
3. **Speculative callout variant:** APPROVED — add `.guide-callout-speculative` with gray left-border
4. **Callout shadow:** APPROVED — add subtle box-shadow to callout boxes in light mode
5. **Inside Scoop chapter title:** APPROVED — keep "Inside Scoop (2026 Context)"

6. **Visual palette investigation:** DEFERRED to a separate session. The existing color system in `globals.css` is already WCAG AAA compliant with documented contrast ratios. No color/palette/hue changes are in scope for this implementation. If the implementer identifies a specific contrast issue during work, flag it in `SESSION_LOG.md` for a follow-up session rather than making unplanned color changes.
7. **Automation-first operations:** APPROVED — recurring guide checks must be scriptable and part of normal verification flow (no memory-dependent copy/paste workflow).
8. **Monetization strategy:** APPROVED — maximize revenue on guide pages with mobile-first placement, while preserving UX quality and policy safety.
9. **Word-count policy:** UPDATED — use internal monetization-depth targets (800+ for monetized chapter pages) rather than claiming a fixed Google word-count requirement.
