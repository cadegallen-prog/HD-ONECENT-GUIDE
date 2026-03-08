# Control Boundary Matrix: Publisher vs. Monumetric

> **Purpose:** Definitive reference for what PennyCentral can change in code vs. what requires Monumetric action.
> **Sources:** Deep Research Report 1 (DR1), Deep Research Report 2 (DR2), March 4 2026 Monumetric email, codebase audit.
> **Created:** 2026-03-06

---

## Section 1: Publisher-Controlled (Site Code / CSS / Deployment)

| Control                                    | Evidence / Citation                                                                                                                                                                                                                                                                      | File(s)                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Whether the Monumetric runtime loads**   | DR1 Control Table: "you control whether the head script exists on the page" / "your script insertion is the physical 'on switch.'"                                                                                                                                                       | `app/layout.tsx:129-135`, `.env` `NEXT_PUBLIC_MONUMETRIC_ENABLED` |
| **DOM structure and containers**           | DR2: "Things that are 'site-code controllable' are mostly about: whether the placeholders exist, where placeholders sit in layout."                                                                                                                                                      | All page files, `components/page-templates.tsx`                   |
| **CSS sizing / CLS prevention**            | DR1: "web.dev explicitly recommends reserving space for late-loading content such as ads using `min-height` and/or `aspect-ratio`." DR2: "Reserve space to reduce flicker and CLS... publishers often choose a stable, fixed-height container."                                          | `app/globals.css`, `lib/ads/monumetric-slot-shell.tsx`            |
| **CSP allowlist for ad domains**           | DR1: "CSP commonly blocks inline scripts by default unless you allow them." "The inline slot scripts are blocked by CSP. Result: the runtime never sees your `$MMT.display.slots.push(...)` calls."                                                                                      | `next.config.js:175-188`                                          |
| **Explicit slot placements (div + push)**  | DR1: "Each body placement tag pushes a function onto the queue." DR2: "Body placeholders = explicit 'allowed placements' where ads are allowed to render."                                                                                                                               | `components/ads/monumetric-in-content-slot.tsx`, page files       |
| **Route ad eligibility (hard exclusions)** | March 4 email: `/report-find` exclusion was honored via both Monumetric config and our code.                                                                                                                                                                                             | `lib/ads/route-eligibility.ts:12-28`                              |
| **SPA route lifecycle coordination**       | DR1: "Next.js App Router docs explicitly say layouts 'preserve state, remain interactive, and do not re-render' on navigation." DR2: "if the ad system expects a 'new page' signal for in-content units, you can get exactly what you described: stale, blank, or non-refreshing units." | `lib/ads/monumetric-runtime.ts`                                   |
| **Slot shell visual presentation**         | DR1 Example CSS: "Generic wrapper around any Monumetric slot container... min-height: 50px; width: 100%; display: flex; justify-content: center."                                                                                                                                        | `lib/ads/monumetric-slot-shell.tsx`                               |
| **Cloudflare script handling**             | DR1: "`data-cfasync='false'` attribute is a Cloudflare Rocket Loader escape hatch." DR2: "Cloudflare documents that this attribute tells Rocket Loader to ignore a script."                                                                                                              | Head script tag in `app/layout.tsx`                               |
| **Safe-area padding (mobile sticky)**      | DR1: "MDN documents CSS `env()` and specifically notes `safe-area-inset-bottom` can prevent fixed toolbars/buttons from being obscured." DR2: "iOS devices with home indicator/notches can cover content unless you account for safe areas."                                             | `components/navbar.tsx`, `app/globals.css`                        |

---

## Section 2: Monumetric-Controlled (Account Config / Managed Ad Ops)

| Control                                        | Evidence / Citation                                                                                                                                                                                                                              | Notes                                                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Which ads serve / creative selection**       | DR1 Control Table: "Auction / demand selection" is in their flowchart after slot registration. DR2: "Things that are 'typically Monumetric-controlled' are closer to: auction behavior, what creative shows."                                    | We cannot influence which advertiser wins the auction.                                                                         |
| **Fill rate / demand**                         | DR2: "whether there is enough demand to fill them (fill rate and market conditions)." DR1: "a placement tag creates an opportunity, not a guarantee."                                                                                            | Unfilled = empty or collapsed slot per our config.                                                                             |
| **Refresh interval**                           | DR1 Control Table: "Generally strong control in managed ad ops; DemandFusion product markets refresh caps/triggers/floors." March 4 email: "turned off Allow Overrides" but actual interval never stated.                                        | Cade requested 60s minimum; number remains unconfirmed (see M1 in Ask Monumetric packet).                                      |
| **Which placements enabled per device**        | March 4 email: "I removed the header inscreen on Mobile." "I removed the Footer inscreen on Mobile." All sidebar slots: "Not being inserted."                                                                                                    | Must request changes via email.                                                                                                |
| **DOM injection rules (selectors, frequency)** | March 4 email: "Container = .py-8, BEFORE every 3rd `<h2>`." DR1 Control Table: "they can configure insertion rules like 'before every 3rd h2' or rely on provided tags."                                                                        | We don't control their traversal logic. Whether `.py-8` matches our compiled Tailwind is unverified (see Critical Finding #1). |
| **Interstitial / video / anchor toggling**     | March 4 email: Video (VOLT) "Not being inserted." Interstitial "Not being inserted."                                                                                                                                                             | Must request via email to re-enable.                                                                                           |
| **SmartZones / multi-unit optimization**       | DR1: "DemandFusion also describes 'Ad SmartZones' where multiple ad units can function in one zone under constraints, which strongly implies that 'number of DOM anchors' is not the only determinant of 'number of ads shown.'"                 | Opaque to publisher.                                                                                                           |
| **Unfilled behavior (collapse vs shadowbox)**  | DR1: "DemandFusion (as marketed) includes 'custom unfilled ad zone solutions' like collapsing the DIV or keeping a shadowbox." DR2: "Unfilled behavior like 'collapse DIV' vs 'shadowbox' is explicitly called out as a configurable dimension." | May be partially exposed in Ascend console.                                                                                    |
| **Provisioning new slot UUIDs**                | DR1: "a placement tag creates an opportunity, not a guarantee. Whether it becomes an ad depends on (a) DOM validity, (b) whether the runtime recognizes/configures that slot." DR2: "Only configured placements fill reliably."                  | We have 8 provisioned UUIDs; need more for multi-slot pages (see M3 in Ask Monumetric packet).                                 |

---

## Section 3: Shared / Requires Coordination

| Item                         | Publisher Side                                                    | Monumetric Side                                                                        | Key Question                                                           | Citation                                                                                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **In-content ad density**    | We provide DOM with `<h2>` headings inside containers             | They decide "every Nth h2" insertion rule                                              | Is their rule actually firing on our pages given the `.py-8` selector? | March 4 email (selector config), DR1: "Where 'in-content' ads can appear -- Yes (you control your content structure, headings, containers, spacing) / Yes (they can configure insertion rules)" |
| **Sidebar/pillar placement** | We could add `<aside>` element; currently single-column           | They choose whether to inject; pillar already inserts "AFTER body" without sidebar DOM | Is sidebar off because of our layout or their config?                  | DR1: "some ad networks place a position: fixed or position: absolute ad that floats... regardless of your layout." March 4 email: sidebar slots "Not being inserted."                           |
| **Additional slot IDs**      | We can place divs + `$MMT.cmd.push()` calls                       | They provision unique UUIDs                                                            | Can we get IDs for penny-list, homepage, SKU, sticky?                  | DR1: "duplicating the same mmt-<UUID> container tends to be 'DOM-invalid + ad-stack-undefined behavior.'" DR2: "HTML `id` values are supposed to be unique within a document."                  |
| **Mobile sticky anchor**     | We built a safe-area-aware component (`mobile-sticky-anchor.tsx`) | They disabled their own anchor (broke mobile nav); could provision a slot ID for ours  | Can they provision a slot ID for our self-managed component?           | March 4 email: header inscreen "does not really work for your site" and was removed on mobile.                                                                                                  |
| **`.py-8` selector match**   | Our pages compile `py-8 sm:py-12` via Tailwind                    | Their rule targets `.py-8` as the container                                            | Is their selector matching our compiled responsive classes?            | March 4 email: "Container = .py-8." Codebase: `PageShell padding="sm"` outputs `py-8 sm:py-12`.                                                                                                 |
| **Route targeting**          | We control which routes load the runtime                          | They have no route-based system; they use CSS selectors                                | Ads may appear on unintended routes if DOM patterns match.             | DR2: "Monumetric was told these routes. But runtime loads globally... DOM-based injection fires on ANY route with matching selectors."                                                          |

---

## Section 4: Phase-by-Phase Control Annotations

Each phase from the original corrected plan, annotated with who must act.

| Phase                               | Description                              | Control                                                                | Rationale                                                                                                                                                                            |
| ----------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **P0: Fix mobile content clipping** | Safe-area padding on navbar              | **Publisher-actionable**                                               | Pure CSS/layout fix. DR1: "Handle notches and home indicators for sticky footers on iOS." DR2: "iOS safe area for sticky footer."                                                    |
| **P1: Verify production status**    | Check Vercel env vars                    | **Publisher-actionable**                                               | DR1 Control Table: "you control whether the head script exists on the page."                                                                                                         |
| **P2: DOM target audit**            | Inspect whether `.py-8` selector matches | **Both**                                                               | Publisher reads own DOM; answer determines whether Monumetric's rule fires. March 4 email provides their selector; codebase shows our compiled classes.                              |
| **P3: Control matrix**              | This document                            | **Publisher-actionable**                                               | Documentation task referencing both research reports.                                                                                                                                |
| **P4: Fix slot shell styling**      | Remove card wrapper CSS                  | **Publisher-actionable**                                               | DR1 example CSS: cosmetic wrapper around slot containers. No Monumetric involvement needed.                                                                                          |
| **P5: CSS CLS audit**               | Verify min-height, z-index, overflow     | **Publisher-actionable**                                               | DR1: "web.dev explicitly recommends reserving space for late-loading content such as ads." DR2: "Reserve space to reduce flicker and CLS."                                           |
| **P6: Slot ID gap analysis**        | Inventory provisioned vs. needed UUIDs   | **Both**                                                               | Publisher identifies gaps; Monumetric must provision new IDs. DR1: "a placement tag creates an opportunity, not a guarantee... whether the runtime recognizes/configures that slot." |
| **P7: Mobile sticky assessment**    | Evaluate two paths for sticky ad         | **Both**                                                               | Publisher built the component; Monumetric must either provision a slot ID (Path A) or re-enable their anchor (Path B).                                                               |
| **P8: Sidebar evaluation**          | Design decision for desktop layout       | **Publisher-actionable** (UX), **Monumetric-required** (ad enablement) | DR1: pillar ads "insert AFTER body -- floats in viewport gutters without any sidebar element." Sidebar DOM is UX choice, not ad prerequisite.                                        |
| **P9: Draft Monumetric email**      | Compile all questions for Monumetric     | **Publisher-actionable** (drafting), **Monumetric-required** (answers) | Covers M1-M9 from Ask Monumetric packet. All blocking questions require their response.                                                                                              |
| **P10: Update project docs**        | Bring `.ai/` current                     | **Publisher-actionable**                                               | Documentation task.                                                                                                                                                                  |

---

## Section 5: Key Principles (Grounded in Research)

1. **"A placement tag creates an opportunity, not a guarantee."**
   -- DR1, "Repeatable slots" section. Whether it becomes an ad depends on DOM validity, runtime recognition, and demand/fill rules.

2. **"Duplicating the same mmt-<UUID> container tends to be 'DOM-invalid + ad-stack-undefined behavior,' not '50 ads.'"**
   -- DR1, "Case: pasting the same slot 50 times." HTML `id` must be unique per MDN spec.

3. **"Adding more unique placements increases potential serving, but actual serving tends to be constrained by Monumetric configuration, fill/demand, and any guardrails."**
   -- DR1, "Case: 50 unique slots on one page."

4. **"Things that are 'site-code controllable' are mostly about: whether the Monumetric runtime is present, whether the placeholders exist, where placeholders sit in layout, CSS sizing/reserved space, and whether something in your stack breaks their scripts."**
   -- DR2, "What you can reasonably tell your agentic coder" section.

5. **"Things that are 'typically Monumetric-controlled' are closer to: auction behavior, what creative shows, fill rate, and any deep refresh logic beyond what your console actually exposes."**
   -- DR2, "What you can reasonably tell your agentic coder" section.

6. **"Treat any fix confirmation as provisional until Playwright evidence confirms it on real routes/devices."**
   -- DR1, closing recommendation from email correspondence assessment.

---

## Abbreviations

- **DR1** = `Monumetric_Ads_information/deep-research-report (1).md`
- **DR2** = `Monumetric_Ads_information/deep-research-report (2).md`
- **March 4 email** = Monumetric implementation team response, 2026-03-04 (referenced in `PLAN_AUDIT_AND_CORRECTED_PLAN.md` Part 1)
- **M1-M9** = Questions from "Ask Monumetric" packet (`PLAN_AUDIT_AND_CORRECTED_PLAN.md` Part 5)
