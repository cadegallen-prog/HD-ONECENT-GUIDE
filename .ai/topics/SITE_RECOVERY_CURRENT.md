# Site Recovery - Current State Audit

**Date:** 2026-03-02  
**Status:** Baseline audit for the canonical site recovery program  
**Scope:** `/`, `/guide`, `/penny-list`, `/report-find`, `/faq`, `/what-are-pennies`, `/store-finder`, `/about`, `/transparency`

## 1) Audit Basis

- Audited against the existing local dev server on port `3001` while it was already running and healthy.
- Routes were reviewed in-browser on desktop and mobile, with console inspection for hydration/runtime noise.
- Supporting source review covered the route files plus shared layout, typography/template surfaces, Penny List rendering helpers, and Store Finder behavior.
- This document is the factual baseline. Design choices and execution order live in `.ai/impl/site-recovery-program.md`.

## 2) Executive Read

- The site already has real product value. `/penny-list` and `/report-find` prove that.
- The front door is weak. The homepage does not create urgency, confidence, or visual focus fast enough for first-time visitors.
- The educational system is fragmented. `/guide`, `/faq`, and `/what-are-pennies` all carry overlapping beginner load, so none of them feels fully definitive.
- The site voice is mostly coherent, but the visual and structural hierarchy is not. It often feels like a content site and a utility product stitched together instead of one intentional product.
- Mobile is serviceable, not sharp. The core pages can be used on mobile, but the page length, section stacking, and inconsistent typography make the experience feel heavier than it should.
- The repeated hydration mismatch is global in dev until proven otherwise. The root cause sits in the root layout head/script behavior, not in one isolated page.

## 3) Founder-Calibrated Quality Read

These points are intentionally persisted because they came from founder feedback in chat and should not be lost between context windows.

- Homepage assessment: generic, bland, not eye-catching, no clear focal point, weak copy polish, weak emphasis, no proof imagery, and nothing visually memorable.
- Guide assessment: current chapter/hub model is not acceptable as the primary educational experience. The older long-form single-page guide felt more cohesive because it had a stronger editorial spine.
- Penny List assessment: this is the most important surface on the site and remains the clearest expression of real product value.
- Report Find assessment: acceptable as a utility, but still word-heavy before action.
- Store Finder assessment: currently does not earn core-product importance and feels weak even after load.
- Recovery-program requirement: improvements must compound across many small, durable slices. One isolated "good change" is not enough.

## 4) Route-by-Route Audit

### `/`

**What it currently does**

- Introduces the concept of Home Depot penny items.
- Pushes users toward the guide first, with the Penny List demoted to a text link.
- Pulls recent finds into the page via `getRecentFinds(48)` and renders `TodaysFinds`.
- Explains the system using text-heavy sections such as "How Penny Hunting Works" and "Why this site is structured this way."

**What feels strong**

- It is honest about the product being both utility and education.
- It already has access to live proof data through `getRecentFinds(48)`.
- It avoids hype language.

**What feels weak / confusing / outdated**

- It looks too generic for a founder-led niche product with real community data.
- The hero is centered, text-first, and visually passive.
- The most important proof is below the fold instead of leading the page.
- The copy explains structure before the page proves value.
- The current page asks a new user to believe first and verify second.

**Mobile-specific issues**

- The hero does not create a strong visual stop.
- Text blocks and step cards stack into a long, low-tension scroll.
- The page feels informative, not compelling.

### `/guide`

**What it currently does**

- Acts as a guide hub and introductory chapter.
- Uses `TableOfContents`, `EditorialBlock`, and `EthicalDisclosure`.
- Presents structured data for collection, FAQ, and HowTo content.

**What feels strong**

- The page is organized and clean.
- It already behaves better than a thin link directory.
- There is a visible attempt to explain what penny items are before the chapter grid.

**What feels weak / confusing / outdated**

- It still feels like a hub for a fragmented system, not the canonical guide.
- The beginner story is split across `/guide`, `/faq`, and `/what-are-pennies`.
- The current structure reads as AI-assembled chapters, not one authored teaching flow.
- The chapter grid competes with the page's own explanatory role.

**Mobile-specific issues**

- The page is readable on mobile, but the chapter-card stack is tall and repetitive.
- It feels like navigation, not a definitive learning path.

### `/penny-list`

**What it currently does**

- Serves the main live utility: searchable, filterable community-reported penny finds.
- Supports hot items, current metrics, list/grid views, and downstream reporting loops.
- Anchors the product's strongest real-time value.

**What feels strong**

- This is the clearest product-value page on the site.
- It already feels useful to returning visitors.
- The data density is a strength when hierarchy is controlled.

**What feels weak / confusing / outdated**

- The page is too dense on mobile.
- Too many supporting sections compete with the list itself.
- Visual emphasis is not disciplined enough; the list is valuable, but not always visually protected.
- The page currently participates in the dev hydration noise because of the global layout issue and the separate `DIY`/`Diy` text mismatch.

**Mobile-specific issues**

- The page becomes long and cognitively heavy.
- Supporting sections below or around the list make the route feel more exhausting than powerful.
- Typography and spacing drift make some sections feel stitched together.

### `/report-find`

**What it currently does**

- Frames report submission as a trust-first, low-friction workflow.
- Renders meaningful server content above the client form.
- Supports bulk reporting and emphasizes fast publication.

**What feels strong**

- The route is clearer and more trustworthy than earlier versions.
- The form is tied to the core loop and not isolated from the product.
- Bulk reporting meaningfully improves usefulness for real finders.

**What feels weak / confusing / outdated**

- The route still front-loads more explanation than necessary.
- The educational copy above the form is better than before, but still heavier than a returning user needs.
- It is a good utility page, not yet a sharp one.

**Mobile-specific issues**

- The top section still takes more vertical space than ideal before the first real action.
- It is usable, but not especially fast-feeling.

### `/faq`

**What it currently does**

- Answers beginner questions and routes users into the Guide, Penny List, and Report Find flow.
- Functions more like a routing/decision layer than a dead-end reference page.

**What feels strong**

- It is useful as a tactical support page.
- The route now feeds the core loop rather than trapping the user.

**What feels weak / confusing / outdated**

- It overlaps too much with the guide system.
- It risks becoming a second guide instead of a question layer.
- It currently benefits from structure, but not from a clearly reduced role.

**Mobile-specific issues**

- Mostly fine, but still long once the question stack accumulates.

### `/what-are-pennies`

**What it currently does**

- Explains the basic concept, why penny items exist, and some 2026 context.
- Serves as an approachable entry point for true beginners.

**What feels strong**

- It is one of the strongest educational pages in isolation.
- It does a better job than the homepage at making the concept understandable.

**What feels weak / confusing / outdated**

- Its role is unclear next to `/guide`.
- It mixes evergreen explanation with time-specific framing, which makes aging risk higher.
- It could either stay a narrow explainer or be absorbed into a rebuilt canonical guide.

**Mobile-specific issues**

- Readable, but long-form without stronger navigational relief.

### `/store-finder`

**What it currently does**

- Loads a client-heavy map/list experience for Home Depot stores.
- Attempts geolocation and supports search by ZIP, city, or address.
- Shows map-centered results and store list rankings.

**What feels strong**

- There is real utility once the route fully loads.
- The map/list model is understandable.

**What feels weak / confusing / outdated**

- It does not currently justify strong placement in the main product loop.
- The route feels like a supporting utility that is being treated too prominently.
- First-use behavior is rough, especially when location is denied or slow.
- The page has a large amount of client logic for a route that is not yet core to conversion.

**Mobile-specific issues**

- Geolocation denial creates an intrusive experience.
- The first rendered state is not calm or confidence-building.
- The route does not feel worth the effort it asks from the user.

### `/about`

**What it currently does**

- Tells the founder/community story.
- Explains the origin of the site and the philosophy behind it.
- Offers clear follow-on actions.

**What feels strong**

- It is human and authentic.
- It improves trust more than a generic company-style About page would.

**What feels weak / confusing / outdated**

- It is story-rich but not especially product-reinforcing.
- It could do more to connect founder credibility to site standards and current product value.

**Mobile-specific issues**

- No major usability blocker, but it shares the broader typography/spacing inconsistency issue.

### `/transparency`

**What it currently does**

- States that the site is funded through advertising.
- Declares editorial independence.
- Provides a contact path.

**What feels strong**

- The route exists, which is directionally correct for trust.

**What feels weak / confusing / outdated**

- It is too thin for the trust load it is supposed to carry.
- It reads more like a placeholder disclosure than a real transparency page.
- It does not yet feel specific to the current monetization reality or the site's operating standards.

**Mobile-specific issues**

- No specific mobile bug, but the thinness is even more obvious on mobile because the page ends quickly without earning trust.

## 5) Cross-Route Findings

### Strongest Existing Assets

- `/penny-list` is the clearest product proof.
- `/report-find` is already connected to the core loop.
- `/about` gives the brand a human center.
- `/what-are-pennies` is the best current beginner explainer.

### Weakest Current Patterns

- The homepage does not visually or structurally prove value fast enough.
- The guide system lacks one canonical narrative spine.
- Store Finder is over-exposed relative to its current value.
- Typography and section hierarchy drift across page templates.
- Supporting routes sometimes compete with the product instead of serving it.

### Mobile-Specific Issues

- Important routes stack too many sections vertically before or after the core action.
- Some routes feel more like long documents than sharp product surfaces.
- Typography and spacing inconsistency make pages feel tacky or uneven.
- The store-finder first-run experience is especially poor on mobile.

### Does the site feel like one product?

- Voice: mostly yes.
- Brand tone: mostly yes.
- Information hierarchy: no.
- Product hierarchy: no.

Current read: Penny Central feels like a real niche product with real utility, but it does not yet feel like one intentionally structured system. The strongest pages prove value; the surrounding pages do not consistently reinforce that value in the same hierarchy.

## 6) Highest-ROI Improvements Before New Feature Work

1. Fix the global hydration mismatch and the known Penny List text mismatch.
2. Redesign the homepage into a proof-first front door with two clear paths: learn or check live finds.
3. Rebuild the guide into one canonical long-form experience and demote overlapping support pages into supporting roles.

## 7) Hydration Mismatch - Root Cause Assessment

### Summary

- The repeated hydration mismatch is global in dev across multiple audited routes.
- The root cause is the Grow bootstrapping pattern in `app/layout.tsx`, not the JSON-LD itself.
- A second, route-specific mismatch exists on `/penny-list` because `normalizeProductName(...)` can convert `DIY` to `Diy`.

### Global Cause

In `app/layout.tsx`, the current Grow initializer is rendered in the server HTML and then immediately inserts a new external script before the first existing `<script>` tag:

- JSON-LD scripts are rendered first in the server HTML.
- The inline Grow initializer then executes `insertBefore(e, t)` against `document.getElementsByTagName("script")[0]`.
- That mutates head script order before React finishes hydration.
- React then compares the server-rendered head against a browser head whose first script has changed, producing a route-wide hydration mismatch.

### Secondary Penny List Cause

In `lib/penny-list-utils.ts`, `normalizeProductName(...)` lowercases text, title-cases it, and then restores acronyms from a whitelist plus captured all-caps words.

- The hardcoded uppercase safety list currently includes values such as `BTU`, `CFM`, `PSI`, and `HVAC`.
- `DIY` is not protected there.
- Result: a server/client render can disagree on visible product text, producing a separate `DIY` -> `Diy` mismatch on `/penny-list`.

### Exact Code Touchpoints

- `app/layout.tsx`
  - server-rendered JSON-LD blocks
  - Grow initializer block that injects `https://faves.grow.me/main.js`
  - GA scripts that follow the Grow block
- `lib/penny-list-utils.ts`
  - `normalizeProductName(...)`
  - uppercase word safety list
- Read-only consumers of the normalization helper:
  - `components/penny-list-card.tsx`
  - `components/penny-list-table.tsx`

### Recovery-Program Implication

- `S1` must happen before any redesign slice.
- There is no value in polishing the homepage or guide while the site still emits cross-route hydration noise.

## 8) Planning Implications

- `S1` should be executed first and stay narrowly scoped to hydration safety and deterministic text rendering.
- `S2` should treat the homepage as a product proof problem, not a copy-polish problem.
- `S3` should treat the guide as an editorial architecture rebuild, not a chapter cleanup pass.
- `S4` should protect the Penny List's utility on mobile rather than adding more supporting content.
- `S7` should demote Store Finder to a supporting role unless later evidence proves it deserves elevation.
