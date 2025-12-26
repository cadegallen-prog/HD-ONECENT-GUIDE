# Backlog (AI‑Driven, Ordered)

**Last updated:** Dec 26, 2025 (Session 2: Screenshot Automation + Commands complete)
Keep this list short and ruthless (≤10 items).
Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Propose approach in plain English
4. Implement + test
5. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## Completed Recently

- **Dec 26, 2025:** Implemented Session 2: Screenshot Automation + Commands. Added `scripts/ai-proof.ts` (automated screenshot capture for light/dark mode), `.claude/commands/` (doctor, verify, proof slash commands), and npm script `ai:proof`. Tested successfully with Windows workaround (MSYS_NO_PATHCONV=1).

- **Dec 26, 2025:** Implemented Session 1: Core Automation Scripts. Added `scripts/ai-doctor.ts` (pre-flight health check) and `scripts/ai-verify.ts` (one-command verification bundle). Added npm scripts `ai:doctor` and `ai:verify`. All 4 quality gates passing (lint, build, unit:21/21, e2e:64/64).

- **Dec 25, 2025:** Created `.ai/AI_AUTOMATION_SPECS.md` with full implementation specifications for ai:doctor, ai:verify, ai:proof scripts, slash commands, pre-commit hooks, parallel agent patterns, and session skills. Updated BACKLOG.md with 4 implementation sessions. (Session 0 complete)

- **Dec 26, 2025:** Added `.ai/AI_ENABLEMENT_BLUEPRINT.md` and wired it into Codex/Claude/Copilot entrypoints; fixed Penny List SSR to compute the initial page slice from URL params; updated Penny List plan doc.

- **Dec 25, 2025:** Hardened Supabase read/write fallbacks (anon → service role when RLS blocks) and improved SKU pages with better “Related penny items” ranking + Playwright screenshot coverage.
- **Dec 19, 2025 (session 2):** Internet SKU integration - Added `internetNumber` field parsing from Google Sheet; SKU pages and penny-list-table now use Internet SKU for better HD product links when available.
- **Dec 19, 2025 (session 1):** Removed `/verified-pennies` and repo-stored verified data/scripts; `/verified-pennies` now permanently redirects to `/penny-list`.
- **Dec 18, 2025 AM:** Social sharing buttons added to penny list cards (Facebook + Copy Link). Quantity field made optional in submission form. Documentation updated to reflect actual implementation state.
- **Dec 17, 2025:** Landing page restructured for clarity-eliminated decision fatigue by reordering sections (How It Works moved to #2), consolidating redundant CTAs, simplifying Tools section (3 equal cards), reordering navigation (Guide first), and simplifying logo (wordmark only). All 36 e2e + unit tests passing.
- **Dec 15, 2025:** Strategic plan created for driving habitual traffic (visual engagement, verification system, SEO expansion)
- **Dec 12, 2025:** Updated `.ai/PENNY_LIST_PLAN.md` to reflect Phase 1 shipped.
- **Dec 12, 2025:** CI (`.github/workflows/quality.yml`) now runs lint + Playwright smoke with fixtures.
- **Dec 16, 2025:** (Historical) Verified Pennies was launched; feature has since been removed in favor of a single Penny List workflow.
- **Dec 16, 2025:** SEO improvements - Added metadata to 11 missing pages, created dynamic sitemap, created OG image template. All pages now Google-discoverable.

---

## P0 - Do Next (AI Enablement Infrastructure)

**Reference:** `.ai/AI_AUTOMATION_SPECS.md` for full implementation details.

1. **Session 1: Core Automation Scripts** `[✓]` **COMPLETE**
   - ✅ Created `scripts/ai-doctor.ts` (health check)
   - ✅ Created `scripts/ai-verify.ts` (verification bundle)
   - ✅ Added npm scripts to package.json
   - ✅ Tested both scripts work correctly

2. **Session 2: Screenshot Automation + Commands** `[✓]` **COMPLETE**
   - ✅ Created `scripts/ai-proof.ts` (screenshot capture)
   - ✅ Created `.claude/commands/doctor.md`
   - ✅ Created `.claude/commands/verify.md`
   - ✅ Created `.claude/commands/proof.md`

3. **Session 3: Enforcement + Manifest** `[ ]`
   - Install husky for pre-commit hooks
   - Create `.husky/pre-commit` hook
   - Create `.ai/TOOLING_MANIFEST.md`

4. **Session 4: Documentation Cleanup** `[ ]`
   - Archive unused playbooks to `.ai/archive/`
   - Create `.ai/APPROVAL_MATRIX.md`
   - Update stale docs (AI-TOOLS-SETUP.md)

---

## P1 - After AI Enablement (Product Features)

5. **Penny List performance: windowed Supabase reads**

- Stop fetching the entire `Penny List` table when the user is viewing a finite date window (e.g., 1m/6m/12m). Filter Supabase reads to the selected window *before* aggregating by SKU.
- Acceptance: still returns correct totals/tiers for the selected window; API pagination unchanged; no regressions in unit/e2e; no new dependencies.

6. **Guide Visual Upgrade (Clearance Cadence)**

- Add visual timeline and captioned tag examples in the existing Guide section; store assets in `/public`, reuse current layout.
- Acceptance: responsive, alt text present, no new routes.

7. **Bookmarklet image harvest (support)**

- Support Cade's plan to collect image URLs via the bookmarklet for newly added items.
- Acceptance: ingestion stays private (no exports committed), instructions updated if tooling changes, and new images flow into Penny List/SKU pages without exposing private inputs.

---

## By Goal (Growth-Focused)

> **Note:** See `.ai/GROWTH_STRATEGY.md` for complete context on Cade's business goals and constraints.

### SEO (Organic Growth) - HIGH PRIORITY

- [x] Add metadata to /what-are-pennies
- [x] Add metadata to /clearance-lifecycle
- [x] Add metadata to /digital-pre-hunt
- [x] Add metadata to /in-store-strategy
- [x] Add metadata to /checkout-strategy
- [x] Add metadata to /internal-systems
- [x] Add metadata to /responsible-hunting
- [x] Add metadata to /facts-vs-myths
- [x] Add metadata to /report-find
- [x] Add metadata to /trip-tracker
- [x] Add metadata to /faq
- [x] Create default OG image (SVG created, needs PNG conversion)
- [x] Dynamic sitemap (auto-updates)
- [ ] Convert OG image SVG to PNG (1200x630px)
- [ ] Individual SKU pages (/sku/[id]) - Could 10x traffic
- [ ] State landing pages (/pennies/[state]) - Geographic targeting
- [ ] Add Article schema to guide pages
- [ ] Add BreadcrumbList schema to navigation

### Engagement (Time on Site) - MEDIUM PRIORITY

- [ ] Social sharing buttons (drives traffic TO Facebook group AND lets users share site with friends)
- [ ] Related items suggestions on penny cards
- [ ] Cross-link guides ("You might also like")
- [ ] "Today's Finds" homepage section (already in P1 below)

**Shelved:**

- Trip Tracker gamification - Requires user accounts to work properly; localStorage-only is too fragile
- Trip Tracker page - Currently accessible but not prominently linked; keep for power users who find it

### Revenue (Passive Income) - LOW PRIORITY, BE TASTEFUL

- [ ] Penny hunting gear page (genuine recommendations only)
- [ ] Amazon Associates integration
- [ ] Rakuten as BeFrugal alternative
- [ ] Expand BeFrugal visibility to more pages

### Email Newsletter - DEFERRED

- [ ] Make ConvertKit signup visible
- **Why deferred:** No value prop yet. Revisit when fresh daily content exists (e.g., "Get notified of new verified pennies")

---

## P0 — Do Next (Sprint 1: Visual Engagement)

**NOTE:** Sprint 1 items are now COMPLETED. See "Completed Recently" section above.

### Former P0 Items (Now Complete):

- ✅ **Enrich Community Reports with Verified Images** - Already implemented in `lib/fetch-penny-data.ts`
- ✅ **Hide Quantity from Display** - Quantity was never displayed; now optional in submission form
- ✅ **Display Product Images in Penny List** - Already implemented with PennyThumbnail component
- ✅ **Social Sharing Buttons** - Added Facebook + Copy Link sharing to penny cards (Dec 18, 2025)

---

## P2 — Optional / If Needed (Higher Risk)

### **Home Depot Product Image Scraper (Deferred)**

- **Why:** Only worth it if curated + user-provided images aren’t enough.
- **What:** Fetch images by SKU and cache them (rate-limited, stable, non-flaky).
- **Note:** Scraping is higher risk (flaky, ToS-sensitive, maintenance); prefer curated datasets first.

---

## P1 — Sprint 2 (Fresh Content & Verification)

### 4. **"Today's Penny Finds" Homepage Section**

- **Why:** Daily fresh content = daily visits. Homepage should show what's new immediately.
- **What:** Prominent section showing items added in last 24-48 hours
- **Done means:**
  - Homepage has "Today's Finds" section after hero
  - Horizontal carousel (mobile) / grid (desktop)
  - Shows: image, item name, state badges, "X hours ago"
  - CTA: "See all penny finds →"
- **Files:** NEW: `components/todays-finds.tsx` | MODIFY: `app/page.tsx`, `lib/fetch-penny-data.ts`

### 5. **Verification Badge System**

- **Why:** Add credibility without fragmenting data
- **What:** Admin-controlled "Verified by Penny Central" badges on items Cade personally confirms
- **Done means:**
  - PennyItem type has `verified`, `verifiedDate`, `verifiedSource` fields
  - Verified badge UI in cards
  - "Verified only" filter option
  - `data/verified-skus.json` file for Cade to populate
  - Verification enriches existing crowdsourced list (not separate list)
- **Files:** NEW: `data/verified-skus.json` | MODIFY: `lib/fetch-penny-data.ts`, `components/penny-list-card.tsx`, `components/penny-list-filters.tsx`

### 6. **Bulk Import Verified SKU History**

- **Why:** Leverage Cade's 1000+ SKU purchase history for instant credibility
- **What:** Import script to load Cade's historical data
- **Done means:**
  - `scripts/import-verified-skus.ts` script created
  - Cade can provide CSV/JSON of SKU, date, item name
  - Script formats and writes to `data/verified-skus.json`
  - Items automatically get verified badge
- **Files:** NEW: `scripts/import-verified-skus.ts`

---

## P2 — Sprint 3 (SEO Expansion - Long-term Traffic)

### 7. **Individual SKU Pages**

- **Why:** Every SKU = unique page = massive SEO surface area (could 10x organic traffic)
- **What:** `/sku/[id]` dynamic pages
- **Done means:**
  - Dynamic route: `/sku/1234567890`
  - Page shows: product image, item name, all reports, state map, tier, verified badge
  - SEO optimized title/description
  - "Report this SKU" CTA
  - Related items section
- **Files:** NEW: `app/sku/[id]/page.tsx`, `app/sku/[id]/layout.tsx`

### 8. **State Landing Pages**

- **Why:** Geographic SEO targeting ("florida home depot penny items")
- **What:** `/pennies/[state]` pages
- **Done means:**
  - State-specific pages (e.g., `/pennies/florida`)
  - Auto-filtered to show only that state's items
  - State map with HD locations
  - "X items found in Florida this week" stat
  - SEO optimized
- **Files:** NEW: `app/pennies/[state]/page.tsx`

---

## P3 — Later / Only If Metrics Justify

### 9. **"Last Updated" Timestamp**

- **Why:** Builds trust, shows freshness
- **What:** Display when penny list data was last refreshed
- **Files:** MODIFY: `app/penny-list/page.tsx`, `lib/fetch-penny-data.ts`

### 10. **Image Upload to Submission Form**

- **Why:** User-generated images = authenticity + social proof
- **What:** Optional photo upload for receipts/products
- **Done means:** Cloudinary/Uploadthing integration, moderation before public display
- **Files:** MODIFY: `app/report-find/page.tsx`, NEW: image upload API

### 11. **Optional moderation gate**

- Add "Approved" column in Sheet and filter server‑side.
- Only do this if spam/junk exceeds ~10%.

---

## Full Implementation Plan

**See:** `~/.claude/plans/sprightly-mixing-anchor.md` for complete technical details

**Strategic Goal:** Convert one-time visitors into daily habitual users

**Key Metrics to Track:**

- Returning visitors % (Goal: 30%+ in 6 months)
- Pages per session (Goal: 5+)
- Community submissions (Goal: 10+ per day)
- Organic search traffic (Goal: 2x in 6 months)
