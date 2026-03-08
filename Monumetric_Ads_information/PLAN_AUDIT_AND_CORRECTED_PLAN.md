# Monumetric Ad Optimization Plan: Audit & Corrected Plan

> **Status:** Planning/docs only. No code changes without explicit founder approval.
> **Branch:** `main` (production lane -- incident-response state after PR #151/#152 Rubicon CSP hotfix).
> **Production truth:** S1-S4 Monumetric recovery is on prod. CSP blocker fixed. `/report-find` remains ad-excluded. Experimental SPA callback off.

---

## Part 1: Claim-by-Claim Truth Table

This audit cross-references every major claim from the original agent dialogue against three authoritative sources:

1. **The Monumetric email exchange** (`monumental/Monumetric.json`, especially the March 4, 2026 response from their implementation team)
2. **The deep research reports** (`deep-research-report (1).md` and `(2).md`)
3. **The actual codebase** (verified by reading files at exact paths and line numbers)

### Section A: Ad Configuration Claims (from email analysis)

| #   | Claim                                                                      | Verdict        | Evidence                                                                                                                                                                                                                                                                                   | Impact if Wrong                                                                             |
| --- | -------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| A1  | In-Content Flight ACTIVE on D/T/M, inside `.py-8`, BEFORE every 3rd `<h2>` | PARTIALLY TRUE | March 4 email confirms targeting rules. **But `.py-8` does not exist as a dedicated container on any ad-receiving page** (see Critical Finding #1 below).                                                                                                                                  | Monumetric's in-content auto-insertion may silently fail or insert in unexpected positions. |
| A2  | Header Inscreen ACTIVE on Desktop & Tablet, REMOVED from Mobile            | TRUE           | March 4 email: "I removed the header inscreen on Mobile." D&T: "Inserting AFTER nav.sticky."                                                                                                                                                                                               | N/A                                                                                         |
| A3  | Left Pillar ACTIVE on Desktop, inserting AFTER body                        | TRUE           | March 4 email confirms. "AFTER body" means fixed/absolute in viewport gutters -- does NOT require sidebar DOM.                                                                                                                                                                             | N/A                                                                                         |
| A4  | Footer Inscreen ACTIVE on D&T, REMOVED from Mobile                         | TRUE           | March 4 email: "I removed the Footer inscreen on Mobile."                                                                                                                                                                                                                                  | N/A                                                                                         |
| A5  | Sidebar (top/middle/sticky) NOT INSERTED                                   | TRUE           | March 4 email: all three "Not being inserted."                                                                                                                                                                                                                                             | N/A                                                                                         |
| A6  | Interstitial OFF, Video (VOLT) OFF                                         | TRUE           | March 4 email: both "Not being inserted."                                                                                                                                                                                                                                                  | N/A                                                                                         |
| A7  | Routes receiving ads: `/`, `/penny-list`, `/guide`                         | PARTIALLY TRUE | Monumetric was told these routes. But runtime loads globally via `app/layout.tsx:129-135` head script -- DOM-based injection fires on ANY route with matching selectors. Monumetric has no route-based exclusion system; they have CSS selector rules + explicit `/report-find` exclusion. | Ads may appear on unintended routes if DOM patterns match.                                  |
| A8  | Refresh interval never confirmed                                           | TRUE           | March 4 email: "turned off Allow Overrides" but never states actual interval. Cade asked for 60s min; number never confirmed.                                                                                                                                                              | Could be faster than 60s, harming viewability/CPMs.                                         |
| A9  | 30-day ramp-up clock wasted                                                | TRUE           | Ads live Feb 27, disabled within hours, re-enabled briefly, disabled again. March 4 response came after most of that window.                                                                                                                                                               | Revenue learning period lost.                                                               |
| A10 | "Running 3 of 7 proposed ad types"                                         | TRUE           | Only in-content, header inscreen (D/T), footer inscreen (D/T), and pillar (D) are active. Sidebar/interstitial/video all off.                                                                                                                                                              | Correct framing of revenue gap.                                                             |

### Section B: Codebase Claims

| #   | Claim                                                      | Verdict                       | Evidence                                                                                                                                                                                                                                                               | Impact if Wrong                                                  |
| --- | ---------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| B1  | Monumetric currently DISABLED                              | TRUE (default) / CONTRADICTED | `.env.example:40` shows `NEXT_PUBLIC_MONUMETRIC_ENABLED=false`. But the live observation dialogue shows ads filling -- suggesting production may have `true`. **The original plan contradicts itself**: first version says disabled, second says "live on production." | Critical confusion about what's actually running.                |
| B2  | MonumetricInContentSlot at TOP of article, not distributed | TRUE                          | All 7 guide chapters verified. Each has exactly 1 `<MonumetricInContentSlot />` placed BEFORE `<Prose variant="guide">`. Example: `app/what-are-pennies/page.tsx:113`.                                                                                                 | Correct identification of placement limitation.                  |
| B3  | 1 slot per guide chapter                                   | TRUE (chapters)               | All 7 chapters have 1 slot. **Exception:** `/guide` hub has 2 slots (`page.tsx:222` and `:234`) with different keys.                                                                                                                                                   | Minor -- hub is correctly noted elsewhere.                       |
| B4  | MobileStickyAnchor built but DISABLED                      | TRUE                          | `launch-config.ts:82`: `sticky: { enabled: false }`.                                                                                                                                                                                                                   | N/A                                                              |
| B5  | No sidebar DOM structure exists                            | TRUE                          | `components/page-templates.tsx` renders single-column centered layout. No `<aside>` element on any page.                                                                                                                                                               | N/A                                                              |
| B6  | SKU pages have zero ad integration                         | PARTIALLY TRUE                | `app/sku/[sku]/page.tsx:19` imports `RouteAdSlots` (metadata), but has NO `MonumetricInContentSlot`. So: has metadata but no explicit placement.                                                                                                                       | Overstates the gap slightly.                                     |
| B7  | Homepage has no explicit ad slots                          | TRUE                          | `app/page.tsx` has zero Monumetric imports. Only `RouteAdSlots pathname="/"` at line 79.                                                                                                                                                                               | N/A                                                              |
| B8  | /penny-list has no MonumetricInContentSlot                 | PARTIALLY TRUE                | No direct `MonumetricInContentSlot` component. **But** `app/penny-list/page.tsx:311` passes `monumetricInContentSlotIds` to `PennyListClient` via `getRouteInContentSlotIds("/penny-list")`. So there IS integration -- it's inside the client component.              | Original plan missed existing penny-list ad wiring.              |
| B9  | Slot shell has tacky card wrapper                          | TRUE                          | `lib/ads/monumetric-slot-shell.tsx:149`: `rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3`                                                                                                                                                    | N/A                                                              |
| B10 | Navbar is `nav.sticky`                                     | TRUE (functionally)           | `components/navbar.tsx:135`: `<nav className="sticky top-0 z-50 ...">`. CSS selector `nav.sticky` matches this element.                                                                                                                                                | N/A                                                              |
| B11 | SKU pages have "2-7% bounce rates"                         | UNVERIFIED                    | No analytics data cited. Suspiciously specific number with no source.                                                                                                                                                                                                  | Should not be used for decision-making without GA4 verification. |

---

## Part 2: Critical Findings (Structural Flaws in Original Plan)

### Critical Finding #1: `.py-8` Targeting Discrepancy

**What Monumetric told us:** In-content ads target `Container = .py-8`, inserting BEFORE every 3rd `<h2>`.

**What the codebase shows:**

- `.py-8` as a standalone class only exists on `app/admin/dashboard/page.tsx` and `app/lists/page.tsx` -- both ad-excluded routes.
- Ad-receiving pages use `PageShell` with `padding="sm"` which compiles to Tailwind's `py-8 sm:py-12`. The class `py-8` IS in the compiled output but as part of a responsive class string on the PageShell wrapper, not a dedicated content container.
- Homepage uses `section-padding` / `section-padding-sm` custom CSS classes (defined in `globals.css:906-911`), not `.py-8`.

**Impact:** Monumetric's auto-insertion may be:

- Matching the PageShell wrapper (works but inserts at wrapper level, not distributed through content)
- Matching compiled Tailwind output inconsistently across responsive breakpoints
- Not matching at all on some pages (homepage uses custom classes)

**Status:** UNVERIFIED -- requires either Playwright DOM inspection or Monumetric confirmation.

### Critical Finding #2: Duplicate HTML ID Danger (Blocks Original Plan's Core Strategy)

**What the original plan proposes:** "Increase `maxPerRoute` from 1 to 3 for guide chapters; add slot IDs" and "distribute 2-3 MonumetricInContentSlot components between h2 sections."

**Why this is structurally broken:**

- We have exactly ONE valid Monumetric in-content slot ID: `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` (from `pennycentral.com_config.txt` and `launch-config.ts:20`).
- Each `MonumetricInContentSlot` generates a div with `id="mmt-{slotId}"`. Placing the same slot 3 times = 3 divs with `id="mmt-39b97adf-dc3e-4795-b4a4-39f0da3c68dd"`.
- **HTML IDs must be unique per document.** Deep research report (2) warns: "duplicating the same mmt-<UUID> container tends to be 'DOM-invalid + ad-stack-undefined behavior,' not '50 ads.'" Deep research report (1) cites MDN: "if an element's id is not the empty string, it must be unique in a document."
- The `MONUMETRIC_GUIDE_SECONDARY_SLOT_ID` and `MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID` in `launch-config.ts:21-24` fall back to PLACEHOLDER strings (`pc-guide-secondary-in-content`, `pc-penny-list-in-content`) -- these are NOT Monumetric-recognized UUIDs. They only become real if `NEXT_PUBLIC_MONU_GUIDE_SECONDARY_SLOT_ID` / `NEXT_PUBLIC_MONU_PENNY_LIST_SLOT_ID` env vars are set with actual Monumetric-provisioned IDs.

**Impact:** The original plan's central strategy (distribute multiple slots per page) CANNOT work without Monumetric provisioning additional unique slot IDs. This is a Monumetric-side request, not a code change.

### Critical Finding #3: MobileStickyAnchor is an Empty Shell

**What the original plan proposes:** "Re-enable mobile sticky anchor -- set `sticky.enabled: true`"

**Why this doesn't work:**

- `components/ads/mobile-sticky-anchor.tsx` uses `id="pc-mobile-sticky-anchor"` -- NOT a Monumetric UUID.
- The component has **zero** `$MMT.display.slots.push()` or `$MMT.cmd.push()` calls.
- It renders a positioned div that waits for an ad to magically appear. No ad will appear because Monumetric doesn't know about this div.
- Monumetric's own anchor/sticky formats were disabled (they broke mobile nav). Our component is independent but non-functional without a Monumetric slot ID.

**Impact:** Toggling `sticky.enabled: true` renders an empty 50px bar at the bottom of mobile screens. No ad revenue, just wasted screen space.

### Critical Finding #4: Sidebar Ads Don't Need a Sidebar DOM

**What the original plan proposes:** "Add Desktop Sidebar Layout (Ad Rail)" as a prerequisite for sidebar ads.

**Why this is a false prerequisite:**

- Deep research report (1): "some ad networks place a position: fixed or position: absolute ad that floats on the left side of the screen regardless of your layout. This is sometimes called a Rail Ad or Skin Ad."
- Monumetric's pillar ad (which IS active on desktop) inserts "AFTER body" -- it floats in viewport gutters without any sidebar element.
- The sidebar slots being "Not being inserted" is a **Monumetric-side configuration decision**, not a DOM structure problem. `pennycentral.com_config.txt` shows these slots were provisioned (UUIDs exist) but Monumetric chose not to insert them.

**Impact:** Building a sidebar layout is a valid UX choice but will NOT cause Monumetric to enable sidebar ads. That requires an email request.

---

## Part 3: Contradiction Register

| #   | Contradiction                                                                                                  | Where                                                 | Replacement Conclusion                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| C1  | Plan says Monumetric "disabled" then says "currently live on production"                                       | Plan v1 context vs. Plan v2 context                   | Status is environment-dependent. `.env.example` defaults to `false`. Production status requires Vercel env var check. Both states may have been true at different times. |
| C2  | Plan says "add 2-3 slots per guide chapter" but we only have 1 real Monumetric slot ID                         | Phase 1 of plan vs. `launch-config.ts:20`             | Cannot add multiple instances of the same slot ID. Need Monumetric to provision additional IDs.                                                                          |
| C3  | Plan says "re-enable mobile sticky" but component has no Monumetric wiring                                     | Phase 3 vs. `mobile-sticky-anchor.tsx` source         | Component is a UI shell with no ad integration. Needs Monumetric slot ID + `$MMT.cmd.push()` integration.                                                                |
| C4  | Plan says sidebar layout enables sidebar ads; deep research says ads float independently                       | Phase 2 vs. deep-research-report (1)                  | Sidebar layout is a UX decision, not an ad prerequisite. Sidebar ads require Monumetric config change.                                                                   |
| C5  | Plan says penny-list has "no MonumetricInContentSlot"; penny-list actually passes slot IDs to client component | Phase 4 observation vs. `app/penny-list/page.tsx:311` | Penny-list has slot wiring inside `PennyListClient` via `getRouteInContentSlotIds("/penny-list")`. Not zero integration.                                                 |
| C6  | Plan says "Monumetric inserts in .py-8 containers"; ad-receiving pages don't use .py-8                         | Email analysis vs. codebase search                    | `.py-8` exists only as part of compiled Tailwind responsive classes, not as a dedicated container. Auto-insertion behavior is unverified.                                |
| C7  | RPM estimates presented as ranges with dollar signs                                                            | Dialogue section                                      | These are unverifiable industry guesses. Remove from any decision-making context.                                                                                        |
| C8  | "We handle mobile anchor ourselves"                                                                            | Email draft Phase                                     | `MobileStickyAnchor` has no Monumetric slot registration. We don't "handle" anything -- it's an empty shell.                                                             |

---

## Part 4: Control Boundary Matrix

### What We Control (Publisher-Side, Codebase)

| Control                                | File(s)                                                           | Notes                                                         |
| -------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Whether Monumetric runtime loads       | `app/layout.tsx:129-135`, `.env` `NEXT_PUBLIC_MONUMETRIC_ENABLED` | Kill switch. Runtime only loads when `true`.                  |
| DOM structure / containers             | All page files, `components/page-templates.tsx`                   | Determines what selectors Monumetric can match.               |
| CSS sizing / spacing / CLS prevention  | `app/globals.css`, `lib/ads/monumetric-slot-shell.tsx`            | `min-height` reservation, centering, collapse behavior.       |
| CSP allowlist for ad domains           | `next.config.js:175-188`                                          | Blocking a domain silently kills that ad partner.             |
| Explicit slot placements               | `components/ads/monumetric-in-content-slot.tsx`, page files       | Creates `$MMT.display.slots.push()` calls for specific UUIDs. |
| Route ad eligibility (hard exclusions) | `lib/ads/route-eligibility.ts:12-28`                              | `/report-find`, `/admin/*`, `/api/*`, etc. excluded.          |
| SPA route lifecycle coordination       | `lib/ads/monumetric-runtime.ts`                                   | Re-queues slots on client-side navigation.                    |
| Slot shell visual presentation         | `lib/ads/monumetric-slot-shell.tsx`                               | Card wrapper, label, collapse animation.                      |

### What Monumetric Controls (Their Side)

| Control                                    | Evidence                                                                            | Notes                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------- |
| Which ads serve / creative selection       | Deep research (1): "auction behavior"                                               | We cannot influence which advertiser wins.  |
| Fill rate / demand                         | Deep research (2): "fill rate and market conditions"                                | Unfilled = empty or collapsed slot.         |
| Refresh interval                           | March 4 email: "turned off Allow Overrides"                                         | Actual number still unconfirmed.            |
| Which placements are enabled per device    | March 4 email (full placement list)                                                 | They removed mobile header/footer.          |
| DOM injection rules (selectors, frequency) | March 4 email: "Container = .py-8, BEFORE every 3rd <h2>"                           | We don't control their traversal logic.     |
| Interstitial / video / anchor toggling     | March 4 email: all "Not being inserted"                                             | Must request via email to change.           |
| SmartZones / multi-unit optimization       | Deep research (1): "Ad SmartZones where multiple ad units can function in one zone" | Opaque to us.                               |
| Unfilled behavior (collapse vs shadowbox)  | Deep research (1): DemandFusion feature                                             | May be exposed in Ascend console partially. |

### Shared / Ambiguous (Requires Monumetric Confirmation)

| Item                     | Our Side                          | Their Side                          | Question to Ask                                       |
| ------------------------ | --------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| In-content ad density    | We provide DOM with h2 headings   | They decide "every Nth h2"          | Is their rule actually firing on our pages?           |
| Sidebar/pillar placement | We could add `<aside>` element    | They choose whether to inject there | Is sidebar off because of layout or config?           |
| Additional slot IDs      | We can place divs + push commands | They provision UUIDs                | Can we get IDs for penny-list, homepage, SKU, sticky? |
| Mobile sticky anchor     | We built the component            | They disabled their own anchor      | Can they provision a slot ID for our component?       |
| `.py-8` selector match   | Our pages compile `py-8 sm:py-12` | Their rule targets `.py-8`          | Is their selector matching our compiled classes?      |

---

## Part 5: "Ask Monumetric" Packet

These are unanswered questions that block implementation decisions. No speculative assumptions -- each needs a confirmed answer.

### Blocking Questions (Must Answer Before Code Changes)

| #   | Question                                                                                                                                                                                                                                                           | Why It Blocks                                                                                                                                                               | Reference                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| M1  | What is the actual refresh interval currently applied?                                                                                                                                                                                                             | Cade requested 60s min; March 4 email confirms "overrides off" but not the number. If faster than 60s, it harms viewability.                                                | March 4 email                                                        |
| M2  | Is the in-content insertion rule (`Container = .py-8, BEFORE every 3rd <h2>`) currently firing on our pages? If not, why?                                                                                                                                          | If auto-insertion isn't working, we need to understand whether it's a selector mismatch or intentional. Our pages use `py-8 sm:py-12` via Tailwind, not standalone `.py-8`. | March 4 email + codebase audit                                       |
| M3  | Can you provision additional unique in-content slot IDs for explicit placement? We're a Next.js SPA and need unique UUIDs per placement to avoid duplicate HTML IDs. Specifically: one for `/penny-list`, one for homepage, and 1-2 additional for guide chapters. | We cannot distribute multiple explicit slots without unique IDs. The original plan's core strategy is blocked on this.                                                      | `launch-config.ts:20-24`, deep research report (2) re: duplicate IDs |
| M4  | Can you provision a slot ID for a mobile sticky/anchor placement that we manage on our side? We've built a safe-area-aware sticky component and want to control the DOM placement ourselves.                                                                       | `MobileStickyAnchor` exists but has no Monumetric slot ID.                                                                                                                  | `components/ads/mobile-sticky-anchor.tsx`                            |
| M5  | Are the sidebar slots (Top/Middle/Sticky) disabled because of our single-column layout, or is it a configuration choice? Would adding an `<aside>` element change anything?                                                                                        | Determines whether sidebar layout work is worth doing for ad purposes.                                                                                                      | March 4 email: all three "Not being inserted"                        |
| M6  | Can you add `/sku/*` pages to your targeting? These are product detail pages with high purchase intent.                                                                                                                                                            | Hundreds of product pages with zero ad injection currently.                                                                                                                 | `app/sku/[sku]/page.tsx`                                             |

### Non-Blocking Questions (Future Planning)

| #   | Question                                                                                                                                        | Timeline                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| M7  | When ramp-up stabilizes, what's the process to re-enable interstitials with frequency cap (1/visitor/hour)?                                     | After baseline metrics stable (~30 days of consistent serving) |
| M8  | What's the process to enable VOLT video on guide chapters? The video tag uses `$MMT.video.slots.push()` -- do we need a specific DOM container? | After interstitials are stable                                 |
| M9  | Can we get access to viewability and fill-rate reporting in the dashboard?                                                                      | Anytime                                                        |

---

## Part 6: Corrected Execution Plan (Surgical Prompts)

### Key Principles

1. **Monumetric controls ad serving behavior.** Our code controls DOM structure and whether the runtime loads.
2. **Placement tags create opportunities, not guarantees.** Adding more divs doesn't mean more ads.
3. **Duplicate HTML IDs are dangerous.** Never reuse the same `mmt-*` div ID on a page. (Deep research report (2), MDN HTML ID spec.)
4. **CLS prevention is the #1 CSS priority.** Reserve space with `min-height`. (Deep research reports (1) and (2), web.dev CLS guidance.)
5. **SPA navigation is a known friction point.** `MonumetricRouteLifecycleCoordinator` handles re-queuing.
6. **Ramp-up is real.** Don't make drastic changes during the 30-day learning period.
7. **Mobile-first monetization.** 80-90% of traffic is mobile. Every decision should prioritize mobile UX.

---

### Prompt 0: Fix Mobile Content Clipping Under Navbar (Pre-Requisite)

**Objective:** Fix the bug where page content (specifically the penny list's amber status pill and likely other pages' top elements) is visually clipped or hidden under the sticky navbar on mobile.

**Why this is Prompt 0:** This is a layout foundation bug that affects both UX and ad placement. Monumetric's header inscreen inserts AFTER `nav.sticky` -- if content is already clipping under the nav, injecting an ad there will make it worse. This must be fixed before any ad work.

**Root cause investigation:**

- Navbar: `components/navbar.tsx:135` renders `<nav className="sticky top-0 z-50 ...">` with `h-16` (64px height).
- Main content: `app/layout.tsx:310` renders `<main id="main-content" className="min-h-screen">` with NO top padding or margin.
- `sticky` positioning means the nav occupies space in flow, so content should start below it. However, on notched iOS devices (iPhone X+), `env(safe-area-inset-top)` is non-zero and the navbar doesn't account for it, causing content to clip.
- **THE FIX ALREADY EXISTS on `dev` branch** -- commit `f4912a0` ("fix(mobile): add viewport safe-area config for notched devices") but was NEVER merged to `main`. It was made on 2026-03-04 by a prior agent session.

**The existing fix (commit `f4912a0`) does three things:**

1. `app/globals.css`: Adds CSS custom properties for safe-area insets (`--safe-area-top`, etc.) using `env()`.
2. `app/layout.tsx`: Exports a `viewport: Viewport` config with `viewportFit: "cover"` (Next.js metadata API).
3. `components/navbar.tsx`: Adds `pt-[env(safe-area-inset-top)]` to the `<nav>` element so the navbar expands to accommodate notch space.

**Files to modify:**

- `components/navbar.tsx` (line 135 -- add `pt-[env(safe-area-inset-top)]`)
- `app/layout.tsx` (add `export const viewport: Viewport` with `viewportFit: "cover"`)
- `app/globals.css` (add safe-area CSS custom properties to `:root`)

**Task:**

1. Cherry-pick or manually re-apply the fix from commit `f4912a0` on `dev`. The exact diff is known (3 files, 16 lines added, 2 changed). Do NOT `git cherry-pick` blindly -- the `dev` branch has diverged. Instead, manually apply the same changes to the current `main` state.
2. Verify the fix doesn't conflict with current `main` versions of those files (check for merge conflicts in layout.tsx especially, since it's had Monumetric/CSP changes since).
3. Spot-check on other pages too -- homepage, guide, FAQ -- to see if they also clip.
4. Test across: iPhone SE (small), iPhone 14 Pro (notch), Android Chrome, desktop Chrome/Firefox via Playwright or devtools emulation.
5. Verify no pages have excessive top padding on non-notched devices (the `env()` fallback is `0px`).

**Acceptance criteria:**

- Amber status pill on `/penny-list` fully visible on all mobile viewports.
- No content clipped under navbar on any page (spot-check homepage, guide, penny-list, FAQ).
- Navbar doesn't gain excessive whitespace on desktop.
- Monumetric's header inscreen injection point (`AFTER nav.sticky`) remains viable on desktop/tablet.

**Rollback:** `git checkout components/navbar.tsx app/layout.tsx app/globals.css`

**Verification:** `npm run verify:fast` + `npm run e2e:smoke` (layout change affects all pages). Visual check on mobile emulation for `/penny-list`, `/`, `/guide`.

**Dependencies:** None. Must complete BEFORE Prompts 4 and 5 (ad container styling and CSS audit).

---

### Prompt 1: Verify Monumetric Production Status

**Objective:** Establish ground truth about whether ads are currently live in production.

**Files touched:** `.env.example` (read-only), `.ai/STATE.md` (update)

**Task:**

1. Read `.env.example` for `NEXT_PUBLIC_MONUMETRIC_ENABLED` value (confirmed: `false` at line 40).
2. Check Vercel environment variables via `vercel env ls` or dashboard for the production value.
3. Check if `app/layout.tsx:129-135` head script would load given the current production env.
4. Document findings in `.ai/STATE.md` under "Monumetric Status" section.

**Acceptance criteria:** Clear statement: "Monumetric is [enabled/disabled] in production as of [date], confirmed via [method]."

**Rollback:** N/A (read-only + documentation).

**Verification:** None required (documentation task).

**Dependencies:** None.

---

### Prompt 2: Audit DOM Targets for Monumetric's Injection Rules

**Objective:** Determine whether Monumetric's in-content auto-insertion rule (`Container = .py-8`, `BEFORE every 3rd <h2>`) can actually fire on ad-receiving pages.

**Files touched:** None modified. Read-only audit of:

- `app/page.tsx` (homepage)
- `app/penny-list/page.tsx` + `components/penny-list-client.tsx`
- `app/guide/page.tsx` (guide hub)
- All 7 guide chapter pages
- `components/page-templates.tsx` (PageShell padding classes)
- `app/globals.css` (section-padding definitions)

**Task:**

1. For each ad-receiving route, trace the rendered DOM to answer:
   - Is `.py-8` present as a class? (Note: `PageShell padding="sm"` compiles to `py-8 sm:py-12`)
   - How many `<h2>` elements exist inside that ancestor?
   - Would "BEFORE every 3rd `<h2>`" produce reasonable ad placements?
2. For homepage: it uses `<Section>` components (render `<h2>` via `title` prop) and `section-padding`/`section-padding-sm` custom classes. Does `.py-8` exist at all?
3. For `/penny-list`: dynamic client component with `<h2>` elements. Document DOM structure.
4. Produce a route-by-route table.

**Acceptance criteria:** Table showing each route, whether `.py-8` matches, h2 count, and expected auto-insertion behavior.

**Rollback:** N/A (read-only).

**Verification:** None required (documentation task).

**Dependencies:** None. Can run parallel with Prompt 1.

**Output:** `Monumetric_Ads_information/dom-target-audit.md`

---

### Prompt 3: Build Control Boundary Matrix

**Objective:** Create the definitive reference for what's publisher-actionable vs. Monumetric-controlled, grounded in the deep research reports.

**Files touched:** None modified. References:

- `deep-research-report (1).md` Section "Control mapping table"
- `deep-research-report (2).md` Section "What you can reasonably tell your agentic coder"
- This document's Part 4

**Task:**

1. Read both deep research reports' control sections.
2. Produce `Monumetric_Ads_information/control-matrix.md` with the three-column structure from Part 4 above, expanded with direct quotes from the research reports as evidence.
3. For each phase in the original plan, annotate: "Publisher-actionable," "Monumetric-required," or "Both."

**Acceptance criteria:** Every entry has a citation to either a research report section, email quote, or file path.

**Rollback:** N/A (documentation).

**Verification:** None required.

**Dependencies:** None. Can run parallel with Prompts 1-2.

**Output:** `Monumetric_Ads_information/control-matrix.md`

---

### Prompt 4: Fix Ad Container Styling

**Objective:** Remove the visible dark card wrapper from ad slots so ads render cleanly regardless of served size.

**Files touched:** `lib/ads/monumetric-slot-shell.tsx` ONLY.

**Task:**

1. Read `lib/ads/monumetric-slot-shell.tsx`.
2. Modify the `<section>` wrapper (line 149):
   - **Remove:** `rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3 sm:p-4`
   - **Add:** `flex flex-col items-center`
   - **Keep:** `my-8 overflow-hidden transition-all duration-200`
3. Make the label subtler (line 167):
   - Change label text to "Ad" (shorter, still policy-compliant)
   - Change classes to: `mb-1 text-center text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] opacity-40`
4. **PRESERVE:** `min-height` reservation on inner div (line 173-175) -- critical for CLS prevention.
5. **PRESERVE:** Collapse behavior (`data-ad-slot-collapsed`, inline style override).
6. **PRESERVE:** The `overflow-hidden` on the inner `containerClassName` div.

**Acceptance criteria:**

- No visible card/border/background around ad slots.
- Ads center within their container regardless of size (300x250, 728x90, etc.).
- `min-height` still reserves space to prevent CLS.
- Collapse animation still works when slot is empty.
- Label is visible but minimal.

**Rollback:** `git checkout lib/ads/monumetric-slot-shell.tsx`

**Verification:** `npm run verify:fast` (lint + typecheck + unit + build). Visual check in dev with Monumetric enabled locally.

**Dependencies:** None. Can run parallel with Prompts 1-3.

---

### Prompt 5: CSS Audit for Ad Container CLS Prevention

**Objective:** Verify that ad containers aren't clipped, hidden, or z-index-conflicted by parent CSS.

**Files touched:** `app/globals.css` (if fixes needed), `lib/ads/monumetric-slot-shell.tsx` (read-only audit).

**Task:**

1. Confirm `min-height` reservation is working in `monumetric-slot-shell.tsx`.
2. Search `app/globals.css` for any `overflow: hidden` on containers that wrap ad slots.
3. Check z-index stacking: navbar is `z-50` (`navbar.tsx:135`). Header inscreen ads insert AFTER `nav.sticky`. Verify no z-index conflict on desktop/tablet.
4. Check if `contain: layout` on ad containers would help or break anything.
5. Verify Monumetric's injected iframes aren't affected by global CSS resets.

**Acceptance criteria:** Either "CSS is adequate, no changes needed" or a specific fix with before/after.

**Rollback:** `git checkout app/globals.css`

**Verification:** `npm run verify:fast`. Visual check on desktop and mobile emulation.

**Dependencies:** After Prompt 4 (slot shell may have changed).

---

### Prompt 6: Identify Missing Slot IDs (Gap Analysis, No Code)

**Objective:** Produce the complete list of Monumetric slot IDs we need to request, based on codebase gaps.

**Files touched:** None modified. Read-only:

- `launch-config.ts:20-24` (existing slot IDs and placeholders)
- `pennycentral.com_config.txt` (provisioned UUIDs from Monumetric)
- `components/ads/mobile-sticky-anchor.tsx` (non-functional shell)

**Task:**

1. List all provisioned Monumetric slot IDs from `pennycentral.com_config.txt`:
   - Video: `fd66fcce-8429-428b-b22d-8bac5706a731` (uses `$MMT.video.slots.push`)
   - Sticky Sidebar: `5f725bea-07f8-4fed-b9dd-bb609c80609e`
   - Middle Sidebar Flex: `c243b456-5b7f-4065-8c5e-dac26a8978c4`
   - Top Sidebar Flex: `b3dc56d1-75b2-4f5b-be74-9a19a17434c1`
   - Pillar Left: `785d6c5a-f971-4fa0-887e-fe0db38eadfd`
   - Footer In-screen: `45ff9f95-5cad-4e88-bac8-d55780b1049f`
   - In-content Repeatable: `39b97adf-dc3e-4795-b4a4-39f0da3c68dd`
   - Header In-screen: `8c9623fb-51f8-48ac-b124-550e1f0b3888`
2. Map which are used in our code vs. which are unused.
3. Identify gaps where we need NEW IDs:
   - Additional in-content IDs for multi-slot pages (penny-list, homepage, distributed guide chapters)
   - Mobile sticky anchor ID
   - SKU page in-content ID (or confirmation the repeatable ID works on SKU pages)
4. Note: The sidebar UUIDs above EXIST but are "Not being inserted" by Monumetric. They could potentially be used if Monumetric enables them.

**Acceptance criteria:** Complete inventory of provisioned vs. used vs. needed slot IDs.

**Rollback:** N/A (documentation).

**Verification:** None required.

**Dependencies:** Prompt 2 (DOM audit informs which pages need slots).

---

### Prompt 7: Evaluate Mobile Sticky Anchor Feasibility

**Objective:** Determine the two paths to a working mobile sticky ad and recommend one.

**Files touched:** None modified. Read-only:

- `components/ads/mobile-sticky-anchor.tsx`
- `components/ads/monumetric-in-content-slot.tsx` (for `buildMonumetricInContentScript` pattern)

**Task:**

1. Confirm `MobileStickyAnchor` has no `$MMT` integration (verified: it doesn't).
2. Document Path A: We request a sticky slot UUID from Monumetric, add `$MMT.display.slots.push()` to the component, and control positioning ourselves. Pros: safe-area handling, z-index control, collapse logic already built.
3. Document Path B: Monumetric re-enables their managed anchor. Pros: zero code work. Cons: they broke mobile nav last time with their anchor.
4. Recommend Path A with justification.

**Acceptance criteria:** Two-path comparison document with clear recommendation.

**Rollback:** N/A (documentation).

**Verification:** None required.

**Dependencies:** None.

---

### Prompt 8: Evaluate Sidebar Layout (Design Decision)

**Objective:** Determine whether a sidebar layout is worth building -- as a UX improvement, NOT as an ad prerequisite.

**Files touched:** None modified.

**Task:**

1. Note that sidebar ads don't require a sidebar DOM element (Critical Finding #4).
2. Assess whether guide chapters benefit from a right-rail sidebar (TOC, related chapters, affiliate links?).
3. Assess desktop viewport utilization -- how much whitespace exists on `lg:` breakpoints?
4. If sidebar UX is compelling, design the `PageShell` modification. If not, skip.
5. This is a DESIGN DECISION requiring Cade's approval.

**Acceptance criteria:** Options presented with pros/cons. No implementation without founder sign-off.

**Rollback:** N/A (analysis only).

**Verification:** None required.

**Dependencies:** None.

---

### Prompt 9: Draft Monumetric Email

**Objective:** Compile all "Ask Monumetric" items into a single professional email.

**Files touched:** None modified. Creates `Monumetric_Ads_information/email-draft-to-monumetric.md`.

**Task:**

1. Incorporate all items from Part 5 "Ask Monumetric" Packet (M1-M9).
2. Structure: confirm current state -> DOM selector question -> slot ID requests -> future items.
3. Reference March 4 email as last known configuration.
4. Tone: professional, technical, collaborative. Not adversarial.
5. Include specific technical details (Tailwind class compilation, SPA routing, duplicate ID constraint) so their implementation team understands why we need unique IDs.

**Acceptance criteria:** Email covers all blocking questions (M1-M6). Non-blocking items (M7-M9) clearly separated.

**Rollback:** N/A (documentation).

**Verification:** Cade reviews before sending.

**Dependencies:** Prompts 2, 3, 6, 7, 8 (all feed information into the email).

---

### Prompt 10: Update Project Documentation

**Objective:** Bring `.ai/` docs current with Monumetric status and pending items.

**Files touched:** `.ai/STATE.md`, `.ai/BACKLOG.md`

**Task:**

1. Update `.ai/STATE.md` with:
   - Monumetric production status (from Prompt 1)
   - March 4 configuration summary
   - List of items pending Monumetric response
2. Update `.ai/BACKLOG.md` with:
   - Monumetric email items as BLOCKED tasks
   - Sidebar evaluation as design decision (needs Cade approval)
   - SKU page ads as BLOCKED on slot provisioning
   - Mobile sticky as BLOCKED on slot provisioning
   - Multi-slot guide chapters as BLOCKED on slot provisioning

**Acceptance criteria:** Both files updated. No code files modified.

**Rollback:** `git checkout .ai/STATE.md .ai/BACKLOG.md`

**Verification:** None required (documentation).

**Dependencies:** All other prompts complete.

---

## Execution Order

| Order | Prompt                          | Can Parallel With | Dependencies   | Risk             |
| ----- | ------------------------------- | ----------------- | -------------- | ---------------- |
| 0     | P0: Fix mobile content clipping | --                | None           | Low-Med (layout) |
| 1     | P1: Verify production status    | P2, P3            | None           | None             |
| 1     | P2: DOM target audit            | P1, P3            | None           | None             |
| 1     | P3: Control matrix              | P1, P2            | None           | None             |
| 2     | P4: Fix slot shell styling      | --                | P0             | Low (cosmetic)   |
| 2     | P5: CSS CLS audit               | --                | P0, P4         | Low              |
| 2     | P6: Slot ID gap analysis        | P7, P8            | P2             | None             |
| 2     | P7: Mobile sticky assessment    | P6, P8            | None           | None             |
| 2     | P8: Sidebar evaluation          | P6, P7            | None           | None             |
| 3     | P9: Draft Monumetric email      | --                | P2,P3,P6,P7,P8 | None             |
| 4     | P10: Update docs                | --                | All above      | None             |

---

## Summary: What the Original Plan Got Right vs. Wrong

### Right

- Slot shell styling fix (tacky card wrapper) -- valid, well-identified
- Mobile is underserved (only in-content flight on mobile) -- correct
- SKU pages lack explicit ad placement -- correct
- CLS prevention emphasis -- correct
- Refresh interval unconfirmed -- correct
- Separating "our changes" from "Monumetric email" -- correct structure

### Wrong

1. **Core strategy broken:** "Add more slots per page" requires unique Monumetric IDs we don't have. Duplicate IDs cause undefined behavior.
2. **Sidebar = false prerequisite:** Pillar/sidebar ads float in viewport gutters. Sidebar DOM is UX, not ad infra.
3. **Mobile sticky = empty shell:** No Monumetric slot registration. `enabled: true` renders nothing useful.
4. **`.py-8` targeting never verified:** Monumetric's selector may not match our compiled Tailwind classes.
5. **Control boundaries conflated:** Many "code changes" actually require Monumetric configuration.
6. **Deep research reports ignored:** Both reports were available with critical insights; original plan never referenced them.
7. **RPM estimates presented as fact:** Unverifiable industry guesses. Not decision-grade data.
8. **Interstitial re-enable premature:** Rocky rollout history; wait for baseline stability.
9. **Internal contradictions:** Disabled vs. live, penny-list "zero integration" vs. existing wiring.
