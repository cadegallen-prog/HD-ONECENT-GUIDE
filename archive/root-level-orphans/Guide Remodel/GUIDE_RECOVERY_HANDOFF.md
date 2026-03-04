# Guide Recovery Handoff — Fresh Agent Prompt

Copy everything below this line into a fresh context window.

---

Follow repo session-start protocol. Read `.ai/START_HERE.md` read order first.

## MODE: Spec-first execution. Phase 0 guardrails before Phase 1 content before Phase 2 UX.

## GOAL

Recover guide quality from 4.5/10 to founder standard. Two parallel problems: (1) content voice is AI-documentation instead of expert penny-hunter tone, and (2) visual presentation/hierarchy/density needs significant work.

## WHY IT'S 4.5/10 (VERIFIED PROBLEMS)

### Content problems:

1. **Voice is wrong.** "Community-reported:" prefix appears ~30 times in Inside Scoop alone, with additional hedging ("Many hunters report...", "Some stores...") scattered across all chapters. Reads like Wikipedia, not an expert teaching you. Pre-split guide was direct and confident.
2. **2026 operational intel dumped in Inside Scoop (chapter 5) only.** ICE metrics, $.02 buffer, Store Pulse, ZMA/Zero-Comm, Speed-to-Penny — all crammed into one chapter instead of woven throughout the guide. Reader hits chapters 1-4 without understanding why patterns changed, then gets a wall of retroactive context.
3. **Concepts referenced before introduced.** "No Home" mentioned in Clearance Lifecycle before defined. "Store Pulse" and "ICE" introduced in chapter 5 but referenced earlier. "Speed-to-Penny" implied but never defined.
4. **No WHY→WHAT connection.** Guide states facts without explaining operational logic. Why do stores refuse? Zero-Comm report. Why do tag dates matter? Store Pulse tracks age.
5. **FAQ uses `<details>` dropdowns.** Every answer hidden behind clicks. Founder calls this "grotesque."

### Visual problems:

6. Guide hub is empty TOC — no user triage, no guidance on where to start
7. Dead space throughout — sparse content in wide viewports
8. H2 bottom border documented in DESIGN-SYSTEM-AAA.md but missing from CSS (removed during Feb 6 cleanup)
9. Tables redundant across chapters (cadence table in 3 places)
10. Flat visual layering — no depth distinction between content types
11. No visual distinction between verified fact and community speculation

## SOURCE OF TRUTH FILES

- `Guide Remodel/single_page_guide_pre_update.html` (15.8MB) — canonical voice/flow baseline (minified single-line HTML, use text extraction)
- `Guide Remodel/newinfoforguide.html` (72KB) — 2026 operational intel delta (minified single-line HTML)
- `Guide Remodel/Operational Analysis of Home Depot 2026 Clearance Architecture.docx` (31KB) — same as newinfoforguide in Word format, may be easier to read

## LOCKED COPY (NON-NEGOTIABLE — DO NOT CHANGE)

Read or create `.ai/topics/GUIDE_LOCKED_COPY.md` first. These founder-crafted strings are immutable:

1. `app/digital-pre-hunt/page.tsx`: "Dusty boxes or items that look untouched for months"
2. `app/in-store-strategy/page.tsx`: "Use the UPC, not the yellow tag" — detail must include: scan manufacturer barcode at SCO only; yellow-tag scan triggers "customer needs assistance"; no-barcode exception requiring employee SKU entry and likely refusal
3. `app/in-store-strategy/page.tsx`: "Don't scan the QR code" — QR code triggers "customer needs assistance"
4. `app/in-store-strategy/page.tsx`: Self-checkout vs employee verification paragraph (employee may take item, barcode photo/SKU lookup, pushback/questions, safest path = self-checkout)
5. `app/in-store-strategy/page.tsx`: Filler item before penny scan tip + FIRST/Zebra SCO notification behavior

Grammar-only cleanup allowed IF meaning/context identical. If any locked text seems wrong, STOP and ask founder.

## VOICE RULES (MANDATORY FOR ALL TEXT EDITS)

- Lead with action: "Scan a filler item first" NOT "Many hunters report scanning a filler item first"
- Use "you": "Here's what you'll see" NOT "Here's what hunters typically observe"
- Section-level caveats only: One "Note: based on community reports" at section top, NOT per-bullet
- Max 1x "community-reported" per chapter
- Confident tone. The pre-split guide didn't hedge every sentence.
- Connect WHY to WHAT: explain the operational logic, not just the facts

## PHASE 0: AUTOMATION + MONETIZATION GUARDRAILS (do first)

### 0A. Create `GUIDE_MONETIZATION_CONTRACT.md`

- File: `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md`
- Define route eligibility, mobile slot map, frequency caps, and exclusions
- Chapters can be monetized once content-depth threshold is met
- `/guide` hub is conditional (monetize only if substantive; otherwise keep ads off)
- Legal/compliance pages remain non-monetized

### 0B. Automate repetitive checks

- Add a consolidated guardrail command (for example `npm run ai:guide:guardrails`)
- Checks must include:
  - FAQ has no `<details>` elements post-overhaul
  - Guide chapter `<h2>` elements have no inline Tailwind classes
  - Route-level visible word-count report
  - Monetization contract exists and is current

## PHASE 1: CONTENT & VOICE (do this first, no UX changes)

### 1A. Create `GUIDE_LOCKED_COPY.md` with the 5 locked strings above

### 1B. Build/extend claim matrix

- Prior 22-row matrix exists from Feb 6 Codex session (see `Guide Remodel/codexdialogue.txt` lines 1-78)
- Diff source HTML files against current chapter content
- Output to `.ai/audits/guide-claim-matrix-<date>.md`
- Columns: Source section | Current route | Current claim | Status | Required correction | Label | Confidence

### 1C. Redistribute 2026 intel across chapters (currently all in Inside Scoop)

| Content                    | Move TO                                | Reason                       |
| -------------------------- | -------------------------------------- | ---------------------------- |
| Store Pulse replacing IMS  | Ch 1 (What Are Pennies)                | Foundational 2026 context    |
| ICE metrics                | Ch 2 (Clearance Lifecycle)             | WHY cadence changed          |
| Speed-to-Penny compression | Ch 2 (Clearance Lifecycle)             | WHY some items drop faster   |
| $.02 buffer                | Ch 2 (signals) + Ch 4 (what to do)     | Practical: "you have ~48hrs" |
| Home Bay Only              | Ch 3 (Pre-Hunt) + Ch 4 (where to look) | Corrects old endcap advice   |
| ZMA/Zero-Comm              | Ch 4 (In-Store Strategy)               | WHY checkout is hard         |
| MET team timing            | Ch 4 (when to go) + Ch 5 (deeper)      | Practical timing signal      |

Inside Scoop = deeper operational context for experienced hunters, NOT a dump of 2026 content.

### 1D. Fix concept ordering

- "No Home" → properly define in Ch 2 before later references
- "Store Pulse" → introduce in Ch 1
- "Speed-to-Penny" → define in Ch 2
- "ZMA" → define briefly in Ch 1, explain in Ch 4

### 1E. Apply voice rules to all text edits. Kill hedging.

## PHASE 2: VISUAL & UX (after Phase 1 content is solid)

### 2A. FAQ overhaul

- Replace all `<details>` dropdowns with visible Q&A (no clicking required)
- Group by topic: Basics, Verification, Checkout & Policy, Etiquette & Community
- Expand concise answers so `/faq` reaches monetization depth target without filler

### 2B. Guide hub redesign

- Add user triage: "New? → Ch 1. Know basics? → Ch 3. Hunting today? → Ch 4"
- Reduce dead space, tighter layout
- Add 1-line descriptions to chapter cards
- Hub monetization gate: either expand to 800+ substantive words or keep `/guide` ad-free

### 2C. Visual tuning

- Restore H2 bottom border (documented but missing from CSS)
- Use `.guide-callout` left-border accent for community-reported sections (visual fact/speculation distinction)
- Add subtle shadow to callout boxes in light mode
- Deduplicate cadence table (keep in Ch 2, cross-link from others)
- Consider tightening H2 top margin from 40px to 32px

### 2D. Monetization layout integration (mobile-first)

- Implement route-level ad eligibility from `GUIDE_MONETIZATION_CONTRACT.md`
- Place first ad after meaningful content starts (not before educational context)
- Use section-spaced inline ads (no back-to-back ad clusters)
- Cap mobile ad frequency and sticky behavior to protect UX
- Run baseline vs higher-load experiments only when UX metrics remain stable

## PHASE 3: DRIFT GUARD (after Phase 2)

Create `GUIDE_FORMAT_CONTRACT.md` documenting forbidden reintroductions:

- Sources blocks in chapter body
- Dual/conflicting nav cues
- Dead-space gaps >80px between content blocks
- `<details>` dropdowns in FAQ
- Per-bullet "community-reported" labeling

## TARGET FILES

- `app/guide/page.tsx` (hub)
- `app/what-are-pennies/page.tsx` (Ch 1)
- `app/clearance-lifecycle/page.tsx` (Ch 2)
- `app/digital-pre-hunt/page.tsx` (Ch 3)
- `app/in-store-strategy/page.tsx` (Ch 4)
- `app/inside-scoop/page.tsx` (Ch 5)
- `app/facts-vs-myths/page.tsx` (Ch 6)
- `app/faq/page.tsx` (Ch 7)
- `app/globals.css` (guide-specific selectors)
- `components/guide/TableOfContents.tsx` (chapter descriptions)

**NOT modified:** `components/page-templates.tsx`, `components/guide/ChapterNavigation.tsx`, `components/guide/EditorialBlock.tsx`

## ADSENSE / E-E-A-T REQUIREMENTS

- Use internal content-depth target: 800+ visible words for monetized chapter pages
- Google does not publish a fixed required word minimum; quality/publisher-value is the core policy signal
- Ch 4 (In-Store Strategy) must frame guidance as understanding the system, NOT circumventing employees
- All FAQ answers must be visible text (not behind accordions) for Google indexing
- Inside Scoop metadata must be updated to match post-redistribution content
- Guide hub currently ~200 words — expand to 800+ if monetized, otherwise keep hub ads off
- Legal/compliance pages should remain non-monetized

## PREREQUISITE: H2 NORMALIZATION

Before any CSS changes in Phase 2, strip ALL inline Tailwind classes from `<h2>` elements in chapter files. Currently, inline classes (e.g., `className="text-2xl font-bold mt-8 mb-6"`) override the `.guide-article h2` CSS rule. After stripping, the CSS rule becomes the single source of truth for guide heading styling. See `.ai/impl/guide-recovery.md` Step 1.1b for full details.

## PASS/FAIL ACCEPTANCE (ALL MUST PASS)

| Check                   | Pass condition                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Factual accuracy        | Claim matrix: zero ❌ rows                                                                                                                  |
| Locked copy             | All GUIDE_LOCKED_COPY.md strings unchanged                                                                                                  |
| Voice                   | "community-reported"/"many hunters report" max 1x per chapter                                                                               |
| 2026 intel distribution | ICE/$.02/ZMA/Store Pulse in correct chapters per map above                                                                                  |
| FAQ                     | No `<details>` elements. All answers visible.                                                                                               |
| Concept ordering        | No concept referenced before introduced                                                                                                     |
| H2 normalization        | Zero inline Tailwind classes on guide chapter H2s                                                                                           |
| Word count              | Monetized chapter pages meet 800+ visible-word internal threshold                                                                           |
| AdSense tone            | Ch 4 frames system behavior, not exploitation                                                                                               |
| Monetization layout     | Route eligibility + mobile slot map + frequency caps implemented                                                                            |
| Hub monetization gate   | `/guide` is either 800+ substantive words or ad-off                                                                                         |
| Guardrail automation    | Consolidated repo command validates recurring guide checks                                                                                  |
| Visual consistency      | Screenshots: consistent heading hierarchy, no gaps >80px                                                                                    |
| Navigation              | 1 prev/next signal per chapter, no competing CTAs                                                                                           |
| Gates                   | `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅                                                        |
| Proof                   | `npm run ai:proof -- /guide /what-are-pennies /clearance-lifecycle /digital-pre-hunt /in-store-strategy /inside-scoop /facts-vs-myths /faq` |

## DONE MEANS

- All acceptance checks pass
- `.ai/SESSION_LOG.md` and `.ai/STATE.md` updated
- Proof paths archived
- Final line: `Locked founder copy preserved: YES`
- Next-agent handoff block included

## ROUTE MODEL (DO NOT CHANGE)

- `/guide` = hub/index only
- Chapters on root routes: `/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`
- Keep existing `/guide/*` legacy redirects as-is
