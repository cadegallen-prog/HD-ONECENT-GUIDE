# Monumetric Slot ID Gap Analysis

> **Date:** 2026-03-06
> **Status:** READ-ONLY analysis. No code changes.
> **Sources:** `pennycentral.com_config.txt`, `monumental/Monumetric.json` (March 4 email), `lib/ads/launch-config.ts`, deep research reports, codebase grep.

---

## Section 1: Provisioned Slots (from Monumetric)

These 8 slot UUIDs were provisioned by Monumetric and appear in `Monumetric_Ads_information/pennycentral.com_config.txt`. Status reflects the March 4, 2026 email from their implementation team (`monumental/Monumetric.json`, email #3, from Samantha Melaney).

| UUID                                   | Placement Name        | Ad Sizes                                                                                               | Device                         | March 4 Status                                           | Push Method                                        |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ | -------------------------------------------------------- | -------------------------------------------------- |
| `fd66fcce-8429-428b-b22d-8bac5706a731` | Video Ad              | D:640x480,400x300,1x1 M:640x480,400x300,1x1 T:640x480,400x300,1x1                                      | All                            | **Not being inserted**                                   | `$MMT.video.slots.push` (note: video, not display) |
| `5f725bea-07f8-4fed-b9dd-bb609c80609e` | Sticky Sidebar        | D:300x250,160x600,300x600 M:300x250,320x50,320x100 T:300x250,160x600,300x600                           | All                            | **Not being inserted**                                   | `$MMT.display.slots.push`                          |
| `c243b456-5b7f-4065-8c5e-dac26a8978c4` | Middle Sidebar Flex   | D:300x250,160x600,300x600 M:300x250,320x50,320x100 T:300x250,160x600,300x600                           | All                            | **Not being inserted**                                   | `$MMT.display.slots.push`                          |
| `b3dc56d1-75b2-4f5b-be74-9a19a17434c1` | Top Sidebar Flex      | D:300x250,160x600,300x600 M:300x250,320x50,320x100 T:300x250,160x600,300x600                           | All                            | **Not being inserted**                                   | `$MMT.display.slots.push`                          |
| `785d6c5a-f971-4fa0-887e-fe0db38eadfd` | Pillar - Left         | D:300x250,160x600,300x600                                                                              | Desktop only                   | **ACTIVE** -- inserting AFTER body                       | `$MMT.display.slots.push`                          |
| `45ff9f95-5cad-4e88-bac8-d55780b1049f` | Footer In-screen      | D:728x90 M:320x50,320x100 T:728x90                                                                     | D&T only (removed from Mobile) | **ACTIVE** -- inserting AFTER body                       | `$MMT.display.slots.push`                          |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | In-content Repeatable | D:300x250,320x50,728x90,320x100,468x60 M:300x250,320x50,320x100 T:300x250,320x50,728x90,320x100,468x60 | All                            | **ACTIVE** -- Container=`.py-8`, BEFORE every 3rd `<h2>` | `$MMT.display.slots.push`                          |
| `8c9623fb-51f8-48ac-b124-550e1f0b3888` | Header In-screen      | D:728x90 M:320x50,320x100 T:728x90                                                                     | D&T only (removed from Mobile) | **ACTIVE** -- inserting AFTER `nav.sticky`               | `$MMT.display.slots.push`                          |

**Source citations:**

- Config file: `Monumetric_Ads_information/pennycentral.com_config.txt` (lines 12-65)
- March 4 email: `monumental/Monumetric.json`, email index [2], body section "Which placements are currently live..."
- Initial onboarding email (Feb 26): `monumental/Monumetric.json`, email index [1], provides the in-content and video tags explicitly

---

## Section 2: Slots Referenced in Code

### 2A: Real Monumetric UUIDs in Code

| UUID                                   | File:Line                                          | Context                                                                                            |
| -------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | `lib/ads/launch-config.ts:20`                      | Exported as `MONUMETRIC_IN_CONTENT_SLOT_ID` -- the ONLY real Monumetric UUID hard-coded in the app |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | `components/ads/monumetric-in-content-slot.tsx:42` | Default `slotId` prop for `MonumetricInContentSlot` component                                      |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | `lib/ads/monumetric-runtime.ts:39`                 | Queued via `$MMT.display.slots.push([slotId])` during SPA route transitions                        |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | `tests/ads-launch-config.test.ts:105`              | Test assertion: `mmt-${MONUMETRIC_IN_CONTENT_SLOT_ID}`                                             |

### 2B: Placeholder Slot IDs in Code (NOT Real Monumetric UUIDs)

| Placeholder Value               | File:Line                     | Context                                                                      | Would Become Real If...                                                               |
| ------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `pc-guide-secondary-in-content` | `lib/ads/launch-config.ts:22` | `MONUMETRIC_GUIDE_SECONDARY_SLOT_ID` fallback                                | Env var `NEXT_PUBLIC_MONU_GUIDE_SECONDARY_SLOT_ID` is set with a real Monumetric UUID |
| `pc-penny-list-in-content`      | `lib/ads/launch-config.ts:24` | `MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID` fallback                          | Env var `NEXT_PUBLIC_MONU_PENNY_LIST_SLOT_ID` is set with a real Monumetric UUID      |
| `pc-mobile-sticky-anchor`       | `lib/ads/launch-config.ts:25` | `MONUMETRIC_MOBILE_STICKY_SLOT_ID` -- used in `MobileStickyAnchor` component | Monumetric provisions a sticky/anchor slot UUID                                       |

### 2C: Pages with `MonumetricInContentSlot` Component

| Route                  | File:Line                              | Slot ID Used                                  | Notes                                                                                      |
| ---------------------- | -------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/what-are-pennies`    | `app/what-are-pennies/page.tsx:113`    | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/clearance-lifecycle` | `app/clearance-lifecycle/page.tsx:200` | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/digital-pre-hunt`    | `app/digital-pre-hunt/page.tsx:181`    | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/in-store-strategy`   | `app/in-store-strategy/page.tsx:167`   | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/inside-scoop`        | `app/inside-scoop/page.tsx:116`        | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/facts-vs-myths`      | `app/facts-vs-myths/page.tsx:156`      | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/faq`                 | `app/faq/page.tsx:253`                 | `39b97adf...` (default)                       | 1 slot, before Prose                                                                       |
| `/guide` (hub)         | `app/guide/page.tsx:222`               | `39b97adf...` (lead slot)                     | Slot 1 of 2, key="guide-lead"                                                              |
| `/guide` (hub)         | `app/guide/page.tsx:234`               | `pc-guide-secondary-in-content` (PLACEHOLDER) | Slot 2 of 2, key="guide-followup". **Will not fill** without real UUID.                    |
| `/penny-list`          | `components/penny-list-client.tsx:976` | `pc-penny-list-in-content` (PLACEHOLDER)      | Passed via `getRouteInContentSlotIds("/penny-list")`. **Will not fill** without real UUID. |

### 2D: Pages with `RouteAdSlots` Metadata (but NO explicit `MonumetricInContentSlot`)

| Route              | File:Line                         | Has MonumetricInContentSlot? |
| ------------------ | --------------------------------- | ---------------------------- |
| `/` (homepage)     | `app/page.tsx:79`                 | NO                           |
| `/sku/[sku]`       | `app/sku/[sku]/page.tsx:338`      | NO                           |
| `/pennies/[state]` | `app/pennies/[state]/page.tsx:52` | NO                           |

### 2E: Pages with NO Ad Integration At All

| Route                        | File                                     | Notes                                       |
| ---------------------------- | ---------------------------------------- | ------------------------------------------- |
| `/about`                     | `app/about/page.tsx`                     | No RouteAdSlots, no MonumetricInContentSlot |
| `/guide/clearance-lifecycle` | `app/guide/clearance-lifecycle/page.tsx` | Redirect route (old URL structure)          |
| `/guide/digital-pre-hunt`    | `app/guide/digital-pre-hunt/page.tsx`    | Redirect route                              |
| `/guide/in-store-strategy`   | `app/guide/in-store-strategy/page.tsx`   | Redirect route                              |
| `/guide/inside-scoop`        | `app/guide/inside-scoop/page.tsx`        | Redirect route                              |
| `/guide/fact-vs-fiction`     | `app/guide/fact-vs-fiction/page.tsx`     | Redirect route                              |
| `/guide/responsible-hunting` | `app/guide/responsible-hunting/page.tsx` | Redirect route                              |

### 2F: Hard-Excluded Routes (No ads by policy)

Source: `lib/ads/route-eligibility.ts:12-28`

`/report-find`, `/store-finder`, `/support`, `/transparency`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/do-not-sell-or-share`, `/unsubscribed`, `/go/rakuten`, `/go/befrugal`, `/login`, `/auth/callback`, `/robots.txt`, `/sitemap.xml`, `/lists/*`, `/s/*`, `/api/*`, `/admin/*`

---

## Section 3: Gap Analysis

### 3A: Slots Provisioned by Monumetric but NOT Used in Code

These UUIDs exist in `pennycentral.com_config.txt` but are never referenced in any `.ts`/`.tsx` source file:

| UUID                                   | Placement Name      | Why Not Used                                                                                                                                                            | Revenue Impact                                                     |
| -------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `fd66fcce-8429-428b-b22d-8bac5706a731` | Video Ad (VOLT)     | Video disabled by Monumetric ("Not being inserted") AND in launch config (`volt.enabled: false` at `launch-config.ts:92`). Uses special `$MMT.video.slots.push` method. | Zero until Monumetric enables + we integrate                       |
| `5f725bea-07f8-4fed-b9dd-bb609c80609e` | Sticky Sidebar      | Disabled by Monumetric ("Not being inserted"). No sidebar DOM exists.                                                                                                   | Zero                                                               |
| `c243b456-5b7f-4065-8c5e-dac26a8978c4` | Middle Sidebar Flex | Disabled by Monumetric ("Not being inserted"). No sidebar DOM exists.                                                                                                   | Zero                                                               |
| `b3dc56d1-75b2-4f5b-be74-9a19a17434c1` | Top Sidebar Flex    | Disabled by Monumetric ("Not being inserted"). No sidebar DOM exists.                                                                                                   | Zero                                                               |
| `785d6c5a-f971-4fa0-887e-fe0db38eadfd` | Pillar - Left       | **ACTIVE on Monumetric's side** (Desktop, AFTER body). Managed entirely by Monumetric's auto-injection; no publisher-side code needed.                                  | Currently generating revenue on desktop without any code reference |
| `45ff9f95-5cad-4e88-bac8-d55780b1049f` | Footer In-screen    | **ACTIVE on Monumetric's side** (D&T, AFTER body). Managed entirely by Monumetric's auto-injection; no publisher-side code needed.                                      | Currently generating revenue on D&T without any code reference     |
| `8c9623fb-51f8-48ac-b124-550e1f0b3888` | Header In-screen    | **ACTIVE on Monumetric's side** (D&T, AFTER `nav.sticky`). Managed entirely by Monumetric's auto-injection; no publisher-side code needed.                              | Currently generating revenue on D&T without any code reference     |

**Key insight:** 3 of the 8 provisioned slots (Pillar, Footer In-screen, Header In-screen) are ACTIVE and managed entirely by Monumetric's server-side auto-injection. They do NOT require `$MMT.display.slots.push()` calls in our code -- Monumetric handles DOM insertion based on CSS selector rules. (Source: March 4 email placement details; Deep Research Report (1), Section "Control mapping table")

### 3B: Slots in Code but NOT Provisioned by Monumetric (Will Never Fill)

| Code Constant                              | Current Value                                 | File:Line                     | Problem                                                                                                                                                                         |
| ------------------------------------------ | --------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONUMETRIC_GUIDE_SECONDARY_SLOT_ID`       | `pc-guide-secondary-in-content` (placeholder) | `lib/ads/launch-config.ts:22` | Not a Monumetric UUID. Div `id="mmt-pc-guide-secondary-in-content"` renders on `/guide` but Monumetric will never fill it.                                                      |
| `MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID` | `pc-penny-list-in-content` (placeholder)      | `lib/ads/launch-config.ts:24` | Not a Monumetric UUID. Div renders on `/penny-list` but Monumetric will never fill it.                                                                                          |
| `MONUMETRIC_MOBILE_STICKY_SLOT_ID`         | `pc-mobile-sticky-anchor` (placeholder)       | `lib/ads/launch-config.ts:25` | Not a Monumetric UUID. `MobileStickyAnchor` component has zero `$MMT` integration (`components/ads/mobile-sticky-anchor.tsx`). Sticky is also disabled (`launch-config.ts:82`). |

**Impact:** These 3 placeholders create empty DOM elements that will never display ads. On `/guide`, the second slot (key="guide-followup") renders an empty 250px-tall reserved space that collapses after 7 seconds. On `/penny-list`, the slot does the same. The `MobileStickyAnchor` is disabled so it doesn't render at all currently.

### 3C: Route Coverage Analysis

| Route                            | Traffic Importance | `RouteAdSlots` Metadata?                | Explicit `MonumetricInContentSlot`? | Monumetric Auto-Injection?                                                                                                                                  | Max Concurrent Explicit Slots    | Gap                                                                        |
| -------------------------------- | ------------------ | --------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `/` (homepage)                   | HIGH               | Yes (`app/page.tsx:79`)                 | NO                                  | Uncertain -- uses `section-padding` CSS classes, NOT `.py-8`. Auto-insertion may not fire. (Source: `PLAN_AUDIT_AND_CORRECTED_PLAN.md` Critical Finding #1) | 0                                | **No explicit in-content slot. Auto-injection unverified.**                |
| `/penny-list`                    | HIGHEST            | Yes (`app/penny-list/page.tsx:227`)     | Yes, 1 (placeholder UUID)           | Uncertain -- dynamic client component. (Source: `PLAN_AUDIT_AND_CORRECTED_PLAN.md` B8)                                                                      | 1 (but placeholder = unfillable) | **Slot exists but uses placeholder UUID. Will never fill.**                |
| `/guide` (hub)                   | MEDIUM             | Yes (`app/guide/page.tsx:175`)          | Yes, 2 (1 real + 1 placeholder)     | Likely yes -- has `py-8` via PageShell + multiple `<h2>` headings                                                                                           | 1 real + 1 unfillable            | **Second slot is placeholder. Only 1 real slot.**                          |
| `/what-are-pennies`              | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes -- guide chapter with h2s                                                                                                                        | 1                                | Working as designed                                                        |
| `/clearance-lifecycle`           | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes                                                                                                                                                  | 1                                | Working as designed                                                        |
| `/digital-pre-hunt`              | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes                                                                                                                                                  | 1                                | Working as designed                                                        |
| `/in-store-strategy`             | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes                                                                                                                                                  | 1                                | Working as designed                                                        |
| `/inside-scoop`                  | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes                                                                                                                                                  | 1                                | Working as designed                                                        |
| `/facts-vs-myths`                | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes                                                                                                                                                  | 1                                | Working as designed                                                        |
| `/faq`                           | MEDIUM             | Yes                                     | Yes, 1 (real UUID)                  | Likely yes -- many h2s (FAQ items)                                                                                                                          | 1                                | Working as designed                                                        |
| `/sku/[sku]` (hundreds of pages) | MEDIUM-HIGH        | Yes (`app/sku/[sku]/page.tsx:338`)      | NO                                  | Unknown -- product detail pages                                                                                                                             | 0                                | **No explicit slot. High purchase-intent pages with zero in-content ads.** |
| `/pennies/[state]` (50 pages)    | LOW-MEDIUM         | Yes (`app/pennies/[state]/page.tsx:52`) | NO                                  | Unknown                                                                                                                                                     | 0                                | **No explicit slot on state pages.**                                       |
| `/about`                         | LOW                | NO                                      | NO                                  | Unknown                                                                                                                                                     | 0                                | No ad integration. Low priority.                                           |
| `/store-finder`                  | MEDIUM             | N/A (hard-excluded)                     | N/A                                 | N/A                                                                                                                                                         | 0                                | Excluded by policy (correct)                                               |
| `/report-find`                   | HIGH               | N/A (hard-excluded)                     | N/A                                 | N/A                                                                                                                                                         | 0                                | Excluded by policy (correct -- trust page)                                 |

### 3D: The Duplicate ID Problem

All 7 guide chapters + the guide hub's lead slot use the SAME real UUID: `39b97adf-dc3e-4795-b4a4-39f0da3c68dd`. This is safe because each chapter is a separate page (separate DOM document). However, placing multiple instances of this UUID on the SAME page would create duplicate HTML IDs, which is invalid and causes undefined ad behavior.

Source: Deep Research Report (2): "duplicating the same mmt-<UUID> container tends to be 'DOM-invalid + ad-stack-undefined behavior,' not '50 ads.'" Deep Research Report (1) cites MDN: "if an element's id is not the empty string, it must be unique in a document."

**Current risk:** NONE on current code. Each page has at most 1 instance of the real UUID. The placeholder UUIDs on `/guide` and `/penny-list` have different IDs (they just don't work).

---

## Section 4: Recommendations for Monumetric Email

### Priority 1: Request New Slot IDs (BLOCKS Revenue Recovery)

These are needed to activate the existing placeholder infrastructure already built in the codebase.

| Request                                                 | Why                                                                                                                                                                                                                                  | Code Ready?                                               | Expected Impact                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------- |
| **1 in-content slot UUID for `/penny-list`**            | Highest-traffic page. Placeholder `pc-penny-list-in-content` exists at `launch-config.ts:24`. Just needs a real UUID in env var `NEXT_PUBLIC_MONU_PENNY_LIST_SLOT_ID`. Component wiring already done in `penny-list-client.tsx:976`. | YES -- code and component exist, just needs UUID          | HIGH -- immediate revenue on top page |
| **1 in-content slot UUID for `/guide` hub (secondary)** | Second slot on guide hub. Placeholder `pc-guide-secondary-in-content` exists at `launch-config.ts:22`. Needs real UUID in env var `NEXT_PUBLIC_MONU_GUIDE_SECONDARY_SLOT_ID`. Component at `guide/page.tsx:234`.                     | YES -- code and component exist, just needs UUID          | MEDIUM                                |
| **1 mobile sticky/anchor slot UUID**                    | `MobileStickyAnchor` component built at `components/ads/mobile-sticky-anchor.tsx` but has no `$MMT` integration. Needs both a UUID AND code changes to add `$MMT.display.slots.push()`. Placeholder is `pc-mobile-sticky-anchor`.    | PARTIAL -- component exists but needs `$MMT` wiring added | HIGH -- 80-90% traffic is mobile      |

### Priority 2: Clarify Existing Active Slots

| Question                                                                                                   | Why                                                                                                                                                                                                               | Source                                                                 |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Is the in-content auto-insertion (`.py-8`, BEFORE every 3rd `<h2>`) actually firing?**                   | Homepage uses `section-padding` CSS, not `.py-8`. Penny-list is a dynamic client component. If auto-insertion isn't working, the only in-content ads come from our explicit `MonumetricInContentSlot` components. | March 4 email + `PLAN_AUDIT_AND_CORRECTED_PLAN.md` Critical Finding #1 |
| **Can the repeatable in-content UUID (`39b97adf...`) be used on multiple different pages simultaneously?** | We use it on 7 guide chapters + guide hub. Each page has 1 instance (unique per document). Confirm this is supported.                                                                                             | `launch-config.ts:47` maps this UUID to all guide routes               |
| **What is the actual refresh interval?**                                                                   | March 4 email says "turned off Allow Overrides" but never states the number. Cade requested 60s minimum.                                                                                                          | March 4 email                                                          |
| **Can `/sku/*` pages receive auto-injected in-content ads?**                                               | Hundreds of product pages with `RouteAdSlots` metadata but no explicit slot. These are high purchase-intent pages.                                                                                                | `app/sku/[sku]/page.tsx:338`                                           |

### Priority 3: Discuss Future Slot Activation

| Item                                                                           | Current Status                                                                                                                                                                             | When to Activate                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Sidebar slots** (3 UUIDs exist: `5f725bea...`, `c243b456...`, `b3dc56d1...`) | "Not being inserted" per March 4 email. No sidebar DOM exists in our layout. Deep Research Report (1) confirms pillar/sidebar ads can float independently of layout via `position: fixed`. | After baseline revenue stabilizes. Ask: is sidebar off because of our layout or their config? |
| **Video/VOLT** (UUID `fd66fcce...` exists)                                     | "Not being inserted" per March 4 email. Uses special `$MMT.video.slots.push` method. Config: `volt.enabled: false`.                                                                        | After interstitials stable (~30 days). Need to understand DOM container requirements.         |
| **Interstitial**                                                               | "Not being inserted" per March 4 email. Config: `interstitial.enabled: false`.                                                                                                             | After 30-day ramp-up. Request 1/visitor/hour frequency cap.                                   |

### Priority 4: Comprehensive Slot Request Summary

If requesting all at once in a single email:

| #   | Slot Type            | Purpose                                                                         | Route(s)                                          | Priority                              |
| --- | -------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| 1   | In-content display   | Penny list ad                                                                   | `/penny-list`                                     | P1 - Immediate                        |
| 2   | In-content display   | Guide hub secondary                                                             | `/guide`                                          | P1 - Immediate                        |
| 3   | Mobile sticky/anchor | Mobile bottom sticky                                                            | All non-excluded routes                           | P1 - Immediate                        |
| 4   | In-content display   | Homepage ad                                                                     | `/`                                               | P2 - After P1 slots verified          |
| 5   | In-content display   | SKU page ad                                                                     | `/sku/*`                                          | P2 - After P1 slots verified          |
| 6   | In-content display   | Additional guide chapter slots (for distributed placement within long articles) | `/what-are-pennies`, `/clearance-lifecycle`, etc. | P3 - After density strategy confirmed |

**Technical note for the email:** Explain that PennyCentral is a Next.js SPA where each route renders a separate DOM document. Each unique slot placement requires a unique UUID to avoid duplicate HTML IDs (per MDN spec and Monumetric's own ad stack behavior). The existing repeatable UUID (`39b97adf...`) works across pages because each page is a separate document, but multiple placements within the same page each need their own UUID.

---

## Appendix: File Reference Index

| File                                                          | Role                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `Monumetric_Ads_information/pennycentral.com_config.txt`      | All 8 provisioned Monumetric slot tags (head script + body widgets)        |
| `monumental/Monumetric.json`                                  | Complete email thread (Jan 24 - Mar 4, 2026)                               |
| `lib/ads/launch-config.ts`                                    | Slot ID constants, route-to-slot mapping, density profiles, feature flags  |
| `lib/ads/monumetric-runtime.ts`                               | SPA route lifecycle coordinator, `$MMT.display.slots.push()` runtime calls |
| `lib/ads/slot-plan.ts`                                        | Route plan builder, combines slot IDs with policies                        |
| `lib/ads/route-eligibility.ts`                                | Hard exclusion list, route policy engine                                   |
| `lib/ads/monumetric-slot-shell.tsx`                           | Slot container UI (CLS reservation, collapse animation, label)             |
| `lib/ads/guardrail-report.ts`                                 | Guardrail metrics evaluation (find-submit drop, engagement floor, etc.)    |
| `components/ads/monumetric-in-content-slot.tsx`               | In-content slot component (renders div + inline `$MMT` script)             |
| `components/ads/mobile-sticky-anchor.tsx`                     | Mobile sticky component (NO `$MMT` integration -- empty shell)             |
| `components/ads/route-ad-slots.tsx`                           | Route metadata component (JSON plan, no ad rendering)                      |
| `Monumetric_Ads_information/PLAN_AUDIT_AND_CORRECTED_PLAN.md` | Audit of original ad optimization plan                                     |
| `Monumetric_Ads_information/deep-research-report (1).md`      | Deep research: Monumetric architecture, CSP, duplicate IDs                 |
| `Monumetric_Ads_information/deep-research-report (2).md`      | Deep research: SPA behavior, DOM requirements, troubleshooting             |
| `types/ads-runtime.d.ts`                                      | TypeScript declarations for `window.$MMT`                                  |
