# Guide Core Content Map

**Status:** `S3A` complete (docs-only)  
**Depends on:** `S2` homepage proof front door  
**Last updated:** 2026-03-04  
**Purpose:** Freeze content ownership before runtime guide edits begin.

## 1) Decision Summary

- `/guide` now owns the full beginner story from "what is this?" to "what do I do after a real find?"
- `/faq` becomes a tactical question layer for edge cases and practical friction, not a second beginner guide.
- `/what-are-pennies` stays live as a short supporting explainer for searchers who need the concept first.
- The chapter routes stay live as supporting references with unique detail, but they stop behaving like the main guide spine.
- In this document, `drop` means "remove from a route's primary teaching role," not "delete the URL."

## 2) Canonical `/guide` Section Map

| Section                                  | User job                                          | Primary source routes                                              | What `/guide` must own                                                                                               | What stays on supporting routes                                                                   |
| ---------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1. What penny items are                  | Explain the concept without hype                  | current `/guide`, `/what-are-pennies`                              | Definition, why penny items exist, difference from normal clearance, respectful mindset                              | `/what-are-pennies` keeps the shorter explainer version for search entry                          |
| 2. How the markdown cycle works          | Teach the timing logic that matters               | `/clearance-lifecycle`, `/what-are-pennies`                        | Cadence reality check, price endings that matter, tag-date logic, "No Home" and signal stacking at a summary level   | `/clearance-lifecycle` keeps the deeper tables, examples, and reference detail                    |
| 3. How to scout before a store trip      | Help the reader decide whether a trip is worth it | `/digital-pre-hunt`                                                | Store-first setup, shortlist rule, home-bay-first workflow, online-status caveats, evidence threshold before driving | `/digital-pre-hunt` keeps label tables, overhead clues, status table, and trip/no-trip checklists |
| 4. How to verify in-store                | Show the safest way to confirm the price          | `/in-store-strategy`                                               | UPC-first verification flow, where to look, when to ask for help, low-drama behavior                                 | `/in-store-strategy` keeps the longer tactical lists and scenario detail                          |
| 5. What checkout and pull behavior means | Explain why stores react differently              | `/in-store-strategy`, `/inside-scoop`, `/what-are-pennies`, `/faq` | Store discretion, Zero-Comm basics, buy-back and locked-item reality, why calm behavior matters                      | `/inside-scoop` keeps the advanced operational context and confidence labels                      |
| 6. What myths to ignore                  | Remove the biggest beginner traps                 | `/facts-vs-myths`, `/faq`                                          | The top myths only: guaranteed sale, fixed drop day, app-is-truth, yellow-tag certainty, endcap-only hunting         | `/facts-vs-myths` keeps the full myth catalog and vetting workflows                               |
| 7. What to do after a confirmed find     | Route the reader into the core loop               | `/faq`, current `/guide` FAQ schema, `/report-find` positioning    | Keep receipt, capture SKU/store/date, report the find, use the Penny List and community responsibly                  | `/faq` can keep a short tactical reporting answer; `/report-find` owns form instructions          |

## 3) Source-Route Mapping

### Current `/guide`

- **Keep:** breadcrumb, editorial trust block, ethical disclosure, canonical-guide role.
- **Merge into rebuilt `/guide`:** the current opening explanation of what penny items are and why they matter.
- **Drop from rebuilt `/guide`:** chapter-grid-first posture, "Part 1 / Part 2" framing, and collection-hub behavior.

### `/what-are-pennies`

- **Keep on route after `S3C1`:** short definition, why penny items exist, simple difference from regular clearance, one calm behavioral reminder, CTA back to `/guide`.
- **Merge into rebuilt `/guide`:** fuller concept explanation, can-you-buy-them framing, and the best beginner mindset language.
- **Drop from this route's future role:** the 2026 systems deep dive, advanced tips, and chapter-chain posture.

### `/clearance-lifecycle`

- **Keep on route after `S3C1`:** cadence tables, price-ending cheat sheet, tag-date example, "No Home" explanation, signal-stacking detail, seasonal notes, reset timing.
- **Merge into rebuilt `/guide`:** the beginner-level markdown story, price endings that matter, and "cadence is a range, not a promise."
- **Drop from this route's future role:** carrying the beginner-definition burden.

### `/digital-pre-hunt`

- **Keep on route after `S3C1`:** label table, overhead cues, online-status table, pre-trip evidence checklist, go/skip trip rules.
- **Merge into rebuilt `/guide`:** store selection, SKU-first shortlisting, home-bay-first logic, online-data caveats, and the minimum-evidence rule before driving.
- **Drop from this route's future role:** acting like the main guide's third chapter in isolation.

### `/in-store-strategy`

- **Keep on route after `S3C2`:** detailed verification lists, right-vs-wrong comparison, what-to-bring list, hotspot list, self-checkout flow, "if stopped" flow.
- **Merge into rebuilt `/guide`:** the core verification flow, low-drama checkout posture, and where to look in-store.
- **Drop from this route's future role:** any "this is the primary guide" framing.

### `/inside-scoop`

- **Keep on route after `S3C2`:** advanced terms, handheld notes, management/disposition context, confidence labels, 2026 operational signals, and explicit "context not proof" framing.
- **Merge into rebuilt `/guide`:** only the minimum explanation needed for beginners to understand why pulls, refusals, and inconsistency happen.
- **Drop from this route's future role:** any beginner-critical explanation required to understand penny hunting basics.

### `/facts-vs-myths`

- **Keep on route after `S3C2`:** extended myth catalog, validation workflows, strong-vs-weak report examples, and trip-ROI rules.
- **Merge into rebuilt `/guide`:** only the highest-value myths that every beginner must unlearn early.
- **Drop from this route's future role:** acting as the final required chapter in the main guide flow.

### `/faq`

- **Keep on route after `S3D`:** tactical answers about sale refusal, app limitations, kiosk use, locked/recall/buy-back items, multiple-item checkout, return-after-purchase scenarios, reporting a find, hiding items, and store variation.
- **Merge into rebuilt `/guide`:** the conceptual answers that currently compete with the main guide.
- **Drop from this route's future role:** sequential "read this page in order" posture and concept-first teaching load.

## 4) Overlap Decisions For `/guide`, `/faq`, And `/what-are-pennies`

| Topic                                 | Canonical owner                                                    | `/faq` decision                                                                          | `/what-are-pennies` decision            |
| ------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| What a penny item is                  | `/guide` owns the full explanation                                 | Drop the standalone concept answer and replace with a shorter tactical pointer if needed | Keep a shorter search-entry explanation |
| Why penny items exist                 | `/guide`                                                           | Drop                                                                                     | Keep a short summary only               |
| How to find penny items               | `/guide` owns the ordered workflow                                 | Drop the overview answer; keep only tactical edge-case questions                         | Drop; route readers into `/guide`       |
| Clearance endings and cadence         | `/guide` owns the summary; `/clearance-lifecycle` owns deep detail | Drop conceptual explanation                                                              | Drop                                    |
| Sale guarantee and store discretion   | `/guide` owns the concept; `/faq` can keep the practical question  | Keep as a tactical Q&A                                                                   | Optional one-line mention only          |
| App, kiosk, tag, and UPC verification | `/guide` owns the summary; `/faq` keeps the practical edge cases   | Keep                                                                                     | Drop                                    |
| Legal and behavior baseline           | `/guide` owns the core norm-setting                                | Keep only narrow etiquette questions like hiding items                                   | Keep one calm behavior reminder         |
| What to do after a confirmed find     | `/guide` owns the loop handoff                                     | Keep the short tactical reporting answer                                                 | Drop                                    |

## 5) Execution Notes For `S3B`, `S3C`, And `S3D`

- `S3B` should read like one authored page with jump navigation, not a dressed-up chapter index.
- `S3B` can write connective copy where the current routes do not join cleanly, but it should not invent new product claims or new operational certainty.
- `S3C1` and `S3C2` should add visible "canonical guide" framing at the top of each supporting route before the page's unique detail begins.
- `S3D` should remove sequential-learning language from `/faq` and keep the route in a fast question-and-answer posture.
- Mobile guardrail: each rebuilt `/guide` section should earn its height. Prefer short section intros followed by bullets, tables, or compact callouts.
- Structured-data implication for `S3B`: `/guide` should stop presenting itself primarily as a collection hub. Keep FAQ/HowTo value where useful, but align the page to a canonical long-form guide posture.

## 6) Drift Check Note

- Drift scan run on 2026-03-04 via `python C:\Users\cadeg\.codex\skills\pc-plan-drift-check\scripts\drift_check.py --out .ai\_tmp\drift-check.md`.
- Result: no guide-specific naming collisions, active-route substring hazards, or mobile touch-target regressions surfaced.
- Unrelated My List bookmark references still exist in older planning artifacts and shared-memory history. They are out of scope for `S3`.
