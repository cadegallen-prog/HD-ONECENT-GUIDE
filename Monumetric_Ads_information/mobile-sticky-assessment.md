# Mobile Sticky Ad Assessment for PennyCentral

> **Date:** 2026-03-06
> **Status:** READ-ONLY analysis. No code changes.
> **Purpose:** Evaluate options for restoring a mobile sticky/anchor ad after Monumetric disabled theirs.

---

## Section 1: Current State

### What Monumetric Disabled and Why

On March 4, 2026, Monumetric's implementation team (via Samantha Melaney, Publisher Success Associate) responded to Cade's escalation email with specific details about what was removed and why.

**Header Inscreen -- REMOVED on Mobile:**

> "We did see the issue with the header inscreen and this happened because the Main Content container sits underneath the navigation bar, and there is a hidden part of the navigation that does show up on some pages, which the header inscreen did cover up. So the header in-screen does not really work for your site."
>
> "I removed the header inscreen on Mobile."

Source: `monumental/Monumetric.json`, March 4, 2026 21:53 UTC email from Publisher Success.

**Footer Inscreen -- REMOVED on Mobile:**

> "I removed the Footer inscreen on Mobile."

Source: Same email.

**All mobile overlay formats -- DISABLED:**

> "All mobile header, top sticky, anchor, and floating placements are fully disabled."

Source: Same email, confirming Cade's request.

**What remains active on mobile:** Only in-content ads (targeting `.py-8` container, inserting before every 3rd `<h2>`). Header inscreen and footer inscreen remain active on Desktop and Tablet only. Source: `Monumetric_Ads_information/PLAN_AUDIT_AND_CORRECTED_PLAN.md`, claim A2/A4.

**Root cause of the mobile breakage:** Monumetric's header inscreen was injecting after `nav.sticky` on mobile. PennyCentral's navbar (`components/navbar.tsx:135`) is a sticky-positioned top nav with `z-50`. Monumetric's injected ad overlapped the navbar and its hidden mobile menu panel, making navigation unusable. Source: `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Prompt 0 analysis; March 4 email quote above.

### What Safe-Area Support Exists in the Codebase

Safe-area support was added in commit `ff1b875` ("fix(mobile): restore navbar safe-area support on main") and is now deployed across multiple components:

1. **CSS custom properties** (`app/globals.css:18-21`):

   ```css
   --safe-area-top: env(safe-area-inset-top, 0px);
   --safe-area-bottom: env(safe-area-inset-bottom, 0px);
   --safe-area-left: env(safe-area-inset-left, 0px);
   --safe-area-right: env(safe-area-inset-right, 0px);
   ```

2. **Navbar** (`components/navbar.tsx:135`): `pt-[env(safe-area-inset-top)]` on the `<nav>` element.

3. **Mobile sticky anchor** (`components/ads/mobile-sticky-anchor.tsx:58`): `pb-[calc(4px+env(safe-area-inset-bottom))]` on the ad container.

4. **Penny list mobile utility bar** (`components/penny-list-mobile-utility-bar.tsx:122`): `top-[calc(4rem+env(safe-area-inset-top))]` for proper offset below navbar.

5. **Penny list client** (`components/penny-list-client.tsx`):
   - Line 537: Bottom padding when sticky anchor is enabled: `pb-[calc(66px+env(safe-area-inset-bottom))]`
   - Line 650: Filter sheet: `pb-[calc(16px+env(safe-area-inset-bottom))]`
   - Line 804: Sort sheet: `pb-[calc(16px+env(safe-area-inset-bottom))]`

6. **Viewport configuration** (`app/layout.tsx`): `viewportFit: "cover"` is set via Next.js metadata API, which triggers `viewport-fit=cover` in the rendered meta tag. This is required for `env(safe-area-inset-*)` to return non-zero values on iOS.

### What Sticky Components Exist

**`components/ads/mobile-sticky-anchor.tsx`** -- A 71-line React component that is fully built but non-functional for ad serving:

- **Positioning:** `fixed inset-x-0 bottom-0 z-30 sm:hidden` (mobile-only, below navbar z-50 and modals)
- **Safe-area:** Uses `env(safe-area-inset-bottom)` for iOS home indicator clearance
- **Collapse logic:** Uses `useMonumetricSlotCollapse()` hook; collapses after 7000ms if no ad renders
- **Reduced motion:** Respects `prefers-reduced-motion` media query
- **Container size:** `w-[320px]` inner div with `min-height: 50px` (configurable)
- **Kill switch:** Controlled by `MONUMETRIC_LAUNCH_CONFIG.sticky.enabled` in `lib/ads/launch-config.ts:82` (currently `false`)

**Critical gap:** The component uses `id="pc-mobile-sticky-anchor"` (a publisher-invented string, NOT a Monumetric UUID). There are zero `$MMT.cmd.push()` or `$MMT.display.slots.push()` calls. Monumetric's ad runtime has no awareness this div exists. Enabling it would render an empty 50px bar.

Source: `components/ads/mobile-sticky-anchor.tsx` (full file); `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Critical Finding #3.

**Launch config references** (`lib/ads/launch-config.ts`):

- Line 25: `MONUMETRIC_MOBILE_STICKY_SLOT_ID = "pc-mobile-sticky-anchor"` (placeholder, not a UUID)
- Lines 82-86: `sticky: { enabled: false, route: "/penny-list", mobileOnly: true, size: "320x50" }`
- Lines 131-137: Slot policy for the sticky slot: `reserveMinHeightPx: 50, collapseAfterMs: 7000, maxPerRoute: 1, mobileEnabled: true, desktopEnabled: false`

---

## Section 2: Path A -- Self-Managed Sticky

### How It Would Work

The publisher (PennyCentral) controls the sticky ad container entirely. Monumetric provides only a slot UUID. Our component handles positioning, z-index, safe-area, collapse, and kill switch.

**Technical flow:**

1. Request a unique sticky/anchor slot UUID from Monumetric.
2. Replace `MONUMETRIC_MOBILE_STICKY_SLOT_ID` in `lib/ads/launch-config.ts:25` with the real UUID (or wire it via `NEXT_PUBLIC_MONU_MOBILE_STICKY_SLOT_ID` env var).
3. Add `$MMT.cmd.push()` + `$MMT.display.slots.push()` integration to `mobile-sticky-anchor.tsx`, following the same pattern used in `components/ads/monumetric-in-content-slot.tsx`.
4. Set `sticky.enabled: true` in `launch-config.ts:82`.
5. Test on mobile viewports to confirm no nav overlap.

Source: `P3-P8-comprehensive-summary.md`, P7 section; `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Prompt 7 analysis.

### Pros

| Pro                                                                                                                         | Evidence                                                                   |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Full z-index control** -- our component uses `z-30`, well below navbar `z-50` and modals `z-50`. No nav overlap possible. | `mobile-sticky-anchor.tsx:52`: `z-30`; `navbar.tsx:135`: `z-50`            |
| **Safe-area handled** -- already uses `env(safe-area-inset-bottom)` for iOS notch/home indicator                            | `mobile-sticky-anchor.tsx:58`                                              |
| **Instant kill switch** -- toggle `sticky.enabled: false` in config, no Monumetric email needed                             | `launch-config.ts:82`                                                      |
| **Collapse logic built** -- empty slot auto-collapses after 7s, no wasted screen space                                      | `mobile-sticky-anchor.tsx:26-31` using `useMonumetricSlotCollapse()` hook  |
| **Reduced motion support** -- respects `prefers-reduced-motion`                                                             | `mobile-sticky-anchor.tsx:33-43`                                           |
| **Content offset already wired** -- `penny-list-client.tsx:536-537` adds bottom padding when sticky is enabled              | `components/penny-list-client.tsx:536-537`                                 |
| **Known, tested pattern** -- same `$MMT.cmd.push()` integration used for in-content slots                                   | `components/ads/monumetric-in-content-slot.tsx` (existing working pattern) |
| **Fast to implement** -- component is 90% done; ~2-3 hours of code work once UUID arrives                                   | `P3-P8-comprehensive-summary.md`, P7 section                               |

### Cons

| Con                                                                                                                                                         | Evidence                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Requires Monumetric to provision a new UUID** -- cannot launch until they respond                                                                         | `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Part 5, question M4                                                                                                                             |
| **We own the maintenance** -- any future ad size changes or format updates need our code changes                                                            | Inherent to self-managed approach                                                                                                                                                   |
| **Monumetric may not support arbitrary publisher containers for sticky** -- their system may expect their own injection mechanism for sticky/anchor formats | Deep research report (1): "anchor ads do not require you to define a container: the format automatically creates and inserts its own container" (citing Google's anchor ad pattern) |
| **Only serves on `/penny-list` initially** -- config restricts to one route                                                                                 | `launch-config.ts:83`: `route: "/penny-list"`                                                                                                                                       |

### Technical Requirements

1. **From Monumetric:** A unique UUID for a mobile sticky/anchor placement.
2. **Code changes (~2-3h):**
   - Add `$MMT` script injection to `mobile-sticky-anchor.tsx` (following `monumetric-in-content-slot.tsx` pattern).
   - Wire UUID via env var (`NEXT_PUBLIC_MONU_MOBILE_STICKY_SLOT_ID`) with fallback to placeholder.
   - Flip `sticky.enabled: true`.
   - Verify no layout shift (CLS) on mobile viewports.
3. **Testing:** Playwright mobile viewport tests for nav overlap, safe-area clearance, collapse behavior.
4. **CSP:** Verify no new CSP violations from the sticky slot's ad iframe.

### What to Ask Monumetric

> "Can you provision a unique slot UUID for a mobile sticky/anchor ad placement that we manage on our side? We've built a safe-area-aware sticky container positioned at the bottom of the viewport on mobile (below z-index of our navigation). We control the DOM, positioning, and collapse behavior -- we just need a UUID to register with `$MMT.display.slots.push()` so your system fills it. Target size: 320x50."

---

## Section 3: Path B -- Monumetric Re-Enable Their Managed Anchor

### How It Would Work

Ask Monumetric to re-enable their own managed mobile anchor/sticky format, but with constraints: it must inject below our navbar (z-index < 50), not cover the mobile hamburger menu, and respect our bottom navigation patterns.

### Pros

| Pro                                                                           | Evidence                                                                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Zero code changes** -- Monumetric handles everything                        | Inherent to managed approach                                                                                           |
| **They optimize format/sizing** -- can serve best-performing creative sizes   | Deep research report (2): "Monumetric explicitly frames placements as something you decide together during onboarding" |
| **Refresh/fill handled** -- their system manages refresh intervals and demand | Deep research report (1), control mapping table                                                                        |

### Cons

| Con                                                                                                                        | Evidence                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Known failure mode** -- their mobile header inscreen broke navigation twice before being removed                         | March 4 email: "the header in-screen does not really work for your site"; Cade's escalation email: "Despite multiple 'fix' confirmations from your team, the issues persist" |
| **No safe-area handling** -- Monumetric's injected elements are unlikely to use `env(safe-area-inset-bottom)`              | Deep research report (1), P7 assessment: "UNKNOWN -- likely doesn't respect it"                                                                                              |
| **No instant kill switch** -- disabling requires an email to Monumetric with unknown turnaround                            | `P3-P8-comprehensive-summary.md`, P7 table: "Slow -- requires email to Monumetric"                                                                                           |
| **Z-index conflict risk** -- their injected CSS may conflict with navbar (`z-50`) or mobile overlays                       | Root cause of the original breakage; Monumetric injects with their own CSS                                                                                                   |
| **Contradicts reengagement positioning** -- Cade's escalation email explicitly banned sticky/anchor from Monumetric's side | `P3-P8-comprehensive-summary.md`, P7 table: "Contradicts reengagement email that banned sticky ads from Monumetric"                                                          |
| **Slow iteration** -- any positioning fix requires their dev cycle (1-2 weeks historically)                                | Timeline from initial breakage through March 4 resolution                                                                                                                    |

### What Configuration Changes to Request

If Path B were chosen, the email would need to specify:

1. Mobile anchor must inject at `bottom: 0` (not top), below our navigation.
2. Must not exceed `z-index: 30` (our navbar is `z-index: 50`).
3. Must account for iOS safe-area insets (home indicator).
4. Must not cover any part of the site's fixed/sticky navigation elements.
5. Must be limited to specific routes (e.g., `/penny-list` only initially).
6. Must be instantly disableable by Monumetric on request if it breaks UX again.

**Practical problem:** Monumetric's injection system is CSS-selector-based, not z-index-aware. There is no evidence they can enforce z-index constraints on their managed placements. Source: March 4 email shows their injection rules use selectors like "AFTER nav.sticky" and "AFTER body", with no mention of z-index constraints.

---

## Section 4: Recommendation

### Path A (Self-Managed Sticky) is the clear winner.

**Rationale:**

1. **History:** Monumetric's managed mobile placements broke the site twice. Their own implementation team concluded the header inscreen "does not really work for your site." Re-enabling a managed sticky format repeats a known failure pattern. Source: March 4 email.

2. **Infrastructure ready:** The `MobileStickyAnchor` component is 90% complete. Safe-area, collapse, kill switch, reduced motion, z-index layering, and content offset padding are all built and tested. The only missing piece is a Monumetric UUID and `$MMT` integration. Source: `components/ads/mobile-sticky-anchor.tsx`, `lib/ads/launch-config.ts`.

3. **Control:** Path A gives PennyCentral instant on/off control, z-index guarantees, and the ability to iterate without waiting for Monumetric's dev cycle. Given that 85-90% of traffic is mobile (source: deep research report (2), mobile-first section), maintaining control over the mobile ad experience is critical.

4. **Risk profile:** Path A's only blocker is getting a UUID from Monumetric. Path B's blockers include renegotiating terms that were explicitly shut down, trusting Monumetric to solve a problem they already failed to solve twice, and accepting slow iteration cycles.

### What Goes in the Monumetric Email

Include this as one item in the broader email (alongside refresh interval confirmation, `.py-8` selector verification, and additional slot ID requests):

> **Mobile Sticky Ad (Self-Managed):**
>
> We've built a safe-area-aware mobile sticky ad container that positions at the bottom of the viewport, below our navigation's z-index. It includes automatic collapse for unfilled slots and respects iOS safe-area insets. We'd like to manage this placement on our side to avoid the nav-overlap issues we experienced previously.
>
> Could you provision a unique slot UUID for a 320x50 mobile sticky/anchor placement? We will register it using `$MMT.display.slots.push()` in the same pattern as our existing in-content slot. This keeps your ad system in control of demand/fill while we handle the DOM positioning.

### Revenue Impact Estimate

**MEDIUM-HIGH value.**

- Mobile sticky/anchor ads are among the highest-CPM mobile formats because they maintain constant viewport visibility. Source: Deep research report (1): "Sticky footer container pattern" is listed as a standard mobile monetization approach; deep research report (2): common mobile sizes include 320x50 and 320x100.
- PennyCentral's traffic is 85-90% mobile. Currently, mobile has ONLY in-content ads active. Header inscreen and footer inscreen were both removed. Adding a sticky restores one of the two removed mobile revenue streams in a controlled way. Source: March 4 email (both mobile formats removed); `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, claim A10: "Running 3 of 7 proposed ad types."
- The `/penny-list` page (initial sticky target) is the site's highest-traffic page and has the longest session duration, maximizing sticky ad impressions per visit.
- Qualitative estimate: restoring one mobile ad format on the highest-traffic page could recover a meaningful portion of the revenue lost when Monumetric disabled mobile header + footer inscreens. Exact RPM impact is unverifiable without baseline data. Source: `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, claim A9: "30-day ramp-up clock wasted."

---

## Source Index

| Source                   | Path                                                                    | Key Content                                                                           |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| March 4 Monumetric email | `monumental/Monumetric.json` (entry dated Wed, 4 Mar 2026 21:53:26 UTC) | Full placement status, removal quotes                                                 |
| Plan Audit               | `Monumetric_Ads_information/PLAN_AUDIT_AND_CORRECTED_PLAN.md`           | Critical findings #3 (empty shell), #4 (sidebar myth); Part 5 (ask Monumetric packet) |
| Deep Research Report 1   | `Monumetric_Ads_information/deep-research-report (1).md`                | Anchor ad auto-insertion, control mapping, escalation template, safe-area CSS         |
| Deep Research Report 2   | `Monumetric_Ads_information/deep-research-report (2).md`                | Duplicate ID warning, mobile best practices, Ascend vs DemandFusion controls          |
| P3-P8 Summary            | `Monumetric_Ads_information/P3-P8-comprehensive-summary.md`             | P7 two-path comparison table, component state analysis                                |
| Control Matrix           | `Monumetric_Ads_information/control-matrix.md`                          | Shared control boundary for mobile sticky anchor                                      |
| Mobile Sticky Component  | `components/ads/mobile-sticky-anchor.tsx`                               | Full 71-line source                                                                   |
| Launch Config            | `lib/ads/launch-config.ts`                                              | Sticky config (line 82), slot ID (line 25), slot policy (lines 131-137)               |
| Navbar                   | `components/navbar.tsx`                                                 | Line 135: sticky nav with z-50 and safe-area-inset-top                                |
| Globals CSS              | `app/globals.css`                                                       | Lines 18-21: safe-area CSS custom properties                                          |
| Penny List Client        | `components/penny-list-client.tsx`                                      | Lines 536-537: bottom padding for sticky anchor; line 650/804: safe-area on sheets    |
| Layout                   | `app/layout.tsx`                                                        | Lines 137-143: Monumetric runtime conditional; viewport-fit config                    |
