# Sitewide Monetization Readiness Plan (Living)

**Created:** 2026-02-08  
**Last updated:** 2026-02-11  
**Status:** Planning (Superseded for launch execution)  
**Owner:** Cade (founder)

> Superseded for launch decisions by `.ai/impl/monumetric-launch-spec.md`. Keep this file as historical planning context.

## 0) GOAL / WHY / DONE MEANS

**GOAL:**
Create one sitewide monetization-readiness architecture that maximizes revenue per session while preserving trust, usability (mobile-first), and approval safety.

**WHY:**
The current workstream is guide-heavy, but monetization risk/reward is sitewide (especially `/penny-list` and deal surfaces). Without one canonical system, decisions drift across sessions and agents.

**DONE MEANS:**

- A canonical route eligibility matrix exists for the whole site (not guide-only).
- Active valid inventory is never deleted for thinness; thinness is handled via lifecycle policy.
- Homepage and first-layer navigation prioritize strong, indexable, monetizable pages.
- Monetized page types have depth/quality gates and ad-density guardrails.
- A Monumetric handoff packet exists (slot map + route policy + exclusions).
- Sitewide plan is implementation-ready with exact file targets and phased rollout.

## 1) Hard Constraints (Non-Negotiable)

- Reuse existing infrastructure by default (no new tables/routes unless explicitly approved).
- No new dependencies unless explicitly approved.
- Design tokens only (no raw Tailwind palette colors).
- Verification required for implementation phases (lint/build/unit/e2e + Playwright for UI).
- **Do not delete or 410 active valid penny inventory solely due to thinness.**
- Canonical tags only for true duplicates/near-duplicates (not blanket thin-page consolidation).
- Legal/compliance pages are non-monetized surfaces.
- Monumetric script controls runtime ad serving/placement; Auto Ads assumptions are out of scope.

## 2) Current State (What exists today)

- Audit doc: `.ai/topics/SITE_MONETIZATION_CURRENT.md`
- Existing plan in flight: `.ai/impl/guide-recovery.md` (Phase 0/1 execution in progress via Opus).
- Existing monetization context: `.ai/topics/MONETIZATION.md`, `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`
- Existing guide contract: `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md`

Current pain points:

- Strategy is partially documented across multiple files and chat context.
- Guide has an implementation plan, but sitewide surfaces are not yet organized under one eligibility map.
- Approval readiness depends on route quality and structure, not only ad tag placement.

## 3) Decisions (Prevent Drift)

### 3.1 Canonical policy decisions (locked)

- **Canonical plan source:** this file + `/.ai/impl/guide-recovery.md` for guide-specific execution.
- **Active valid inventory policy:** keep URL live.
- **Thin active page policy:** temporary `noindex,follow` + ad-ineligible until enriched.
- **Historical valid inventory:** keep as historical context page, not invalid.
- **Invalid deal definition:** wrong SKU/UPC mapping, duplicate URL, wrong retailer identity, fabricated/unverifiable report after checks, or broken slug/non-existent record.
- **Invalid remediation:** redirect/410 only for invalid/duplicate/broken records (not active valid inventory).

### 3.2 Homepage + navigation mandate (locked)

- Homepage and main navigation must expose strong pages in first-layer IA.
- Utility feeds can remain prominent for repeat users, but strong content surfaces cannot be buried.

### 3.3 Route-level eligibility baseline (locked)

- **Monetize by default after quality gates:** longform guide chapters, rich educational pages, mature hub pages.
- **Conditional monetization:** utility-heavy pages that pass content-quality + UX guardrails.
- **Non-monetized:** legal/compliance/support-only pages where ads harm trust/compliance value.

## 4) Phase Plan (Implementation Specs)

### Phase 1 - Governance + Route Inventory (lowest risk)

- **Goal:** Turn all current chat-level rules into enforceable, discoverable repo policy.
- **Exact files to modify:**
  - `.ai/topics/SITE_MONETIZATION_CURRENT.md`
  - `.ai/topics/MONETIZATION.md`
  - `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (only if facts changed)
  - `.ai/HANDOFF_PROTOCOL.md` (only if schema additions are needed)
- **Exact UI/copy changes:** none (docs-only phase).
- **Mobile/a11y requirements:** codify in contract (44x44 touch targets, no ad clusters, content-first above-the-fold).
- **Risks / edge cases:** policy drift between agent sessions; stale approvals timeline.
- **Metrics:**
  - Route matrix completed (100% of indexable routes classified).
  - Thin URL lifecycle rules documented and accepted.
  - Handoff template includes monetization route policy evidence.

### Phase 2 - High-Value Surface Architecture (home + guide hub + penny list)

- **Goal:** Ensure first-layer site structure signals quality and supports ad integration without UX regression.
- **Exact files to modify:**
  - `app/page.tsx`
  - `components/navbar.tsx`
  - `components/command-palette.tsx`
  - `app/penny-list/page.tsx`
  - `app/guide/page.tsx`
  - `components/guide/TableOfContents.tsx`
- **Exact UI/copy changes:**
  - Homepage: strengthen above-the-fold links to strong pages/hubs.
  - Penny List: keep utility-first flow, add compact high-value context modules (not a giant blocker prelude).
  - Guide hub: maintain substantive value if monetized; otherwise keep ad-excluded.
- **Auth / intent persistence / idempotency:** preserve existing list scrolling/filter behavior; no forced friction before utility interaction.
- **Risks / edge cases:** over-adding prelude content can hurt repeat-user velocity.
- **Metrics:**
  - Scroll depth and bounce on `/penny-list` and `/`.
  - Session duration and return rate on key routes.
  - Revenue per session after ad activation (later, with Monumetric).

### Phase 3 - Thin URL Lifecycle + Enrichment Promotion

- **Goal:** Keep inventory utility while improving approval-readiness quality signals.
- **Exact files to modify:**
  - `app/sku/[sku]/page.tsx`
  - `app/pennies/[state]/page.tsx`
  - `app/sitemap.ts`
  - `lib/fetch-penny-data.ts`
  - enrichment scripts/routes as needed (reuse only; no new infra by default)
- **Deterministic ops:**
  - Define state transitions: `active_valid_thin` -> `active_valid_enriched`.
  - Promotion rules from temporary `noindex` to `index` based on enrichment threshold.
- **Default entities (check-and-create/upsert):** reuse existing Penny List + enrichment tables/views.
- **Performance plan (batching/caching):** enrich in batches; avoid blocking page render for added context fields.
- **Risks / edge cases:** stale enrichment or false-invalid classifications.
- **Metrics:**
  - % active pages meeting enrichment threshold.
  - % active pages index-eligible under policy.
  - Index coverage trend in Search Console over time.

### Phase 4 - Partner Handoff + Revenue Experiments (post-approval)

- **Goal:** Give Monumetric a stable, policy-safe slot architecture and run controlled revenue-vs-UX experiments.
- **Exact files to modify:**
  - `.ai/topics/SITE_MONETIZATION_CURRENT.md` (handoff packet section)
  - Route-level components where slots are approved
  - Analytics/event instrumentation files (reuse existing stack)
- **Experiment model:**
  - Start conservative, then increase placement density only if UX guardrails hold.
  - Evaluate by template/page type, not one global average.
- **Risks / edge cases:** short-term RPM gains causing retention loss.
- **Metrics:** RPM, session revenue, bounce, depth, return rate, and complaint signals.

## 5) Open Questions (Plan is incomplete until resolved)

- Should `/guide` hub be monetized after expansion, or remain ad-excluded as a navigation page?
- What is the exact enrichment threshold for promoting thin active pages from `noindex` to `index`?
- Which page types are hard-excluded from ads besides legal/compliance routes?
- What is the initial mobile ad frequency cap by template (guide, penny-list, sku detail)?
- Which metrics trigger an automatic rollback of ad density increases?

## 6) Rollback Plan

- Docs rollback: revert this plan and topic updates in one commit.
- Implementation rollback (future):
  - Disable new ad slots by route flag/contract.
  - Revert homepage/nav prominence changes if retention drops.
  - Revert indexing promotions if quality thresholds were misapplied.
- Preserve active valid inventory URLs during rollback.

## Appendix: Drift Checks (run before implementation)

### Drift check output (2026-02-08)

- Naming collisions (`My List` / `My Lists`): none found.
- Risky active-route matching (`includes(...)`): none found in heuristic scan.
- Touch-target regressions (<44px hints): none found in heuristic scan.
- Icon-language confusion: references still exist in docs/history around bookmark vs heart; confirm canonical wording in active docs before rollout.

### Infra reuse confirmation

- Plan assumes reuse of existing routes, data sources, enrichment flow, and analytics stack.
- No new dependencies required by this planning spec.
