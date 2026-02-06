# Project State (Living Snapshot)

**Last updated:** Feb 6, 2026 (Guide AAA polish + contrast guardrail hardening)

This file is the **single living snapshot** of where the project is right now.

Every AI session must update this after meaningful work.

**Auto-archive:** Entries older than 30 days move to `archive/state-history/`

---

## Current Sprint (Last 7 Days)

- **2026-02-06 (Guide AAA polish + guardrail hardening):** Completed a one-shot UX/readability pass to normalize guide layout alignment and harden automated contrast enforcement.
  - **Guide presentation fixes:**
    - Aligned guide header, editorial strip, prose column, and chapter navigation to one centered 68ch reading column on all chapter routes.
    - Added `className` support to `components/guide/EditorialBlock.tsx` and applied consistent width constraints on all guide chapter pages.
  - **Token tuning for strict thresholds:**
    - Light placeholder: `--text-placeholder` `#55504a` → `#544f49` (now above 7:1 on recessed surfaces).
    - Dark borders: `--border-default` `#455a64` → `#546e7a`; `--border-strong` `#546e7a` → `#607d8b`; `--border-dark` `#607d8b` → `#78909c` (keeps non-text boundaries above 3:1 on page/card surfaces).
  - **Contrast tooling hardening:**
    - Expanded route coverage (`checks/routes.json`) to include guide chapters and core routes.
    - Expanded selector coverage (`checks/selectors.json`) with guide-aware selectors and optional handling to reduce false negatives.
    - Updated `scripts/check-contrast.js` to enforce token-level checks and required-selector behavior, including border checks on both `--bg-page` and `--bg-card`.
  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), `npm run check-contrast` ✅, proof bundle: `reports/proof/2026-02-06T08-30-41/`.

- **2026-02-06 (WCAG AAA Readability Overhaul - Guide Visual System):** Fixed the guide visual system and readability foundation for light/dark modes.
  - **Token changes (globals.css):**
    - Light `--text-secondary`: `#36312e` → `#44403c` (body copy — wider gap from headlines, AAA)
    - Light `--text-muted`: `#44403c` → `#504a45` (metadata — clearly lighter than body, AAA)
    - Light `--text-placeholder`: `#36312e` → `#544f49` (placeholder now AAA on recessed surfaces)
    - Dark `--text-secondary`: `#b0b0b0` → `#bdbdbd` (AAA on card surfaces)
    - Dark `--text-muted`: `#a3a3a3` → `#adadad` (AAA on card surfaces)
    - Added `--bg-subtle` token (light: `#f8f8f7`, dark: `#181818`)
  - **Guide enhancements:**
    - Added `.guide-article` CSS class with enhanced readability (1.75 line-height, 68ch max-width, h2 border separators, styled tables)
    - Added `.guide-callout` / `.guide-callout-warning` / `.guide-callout-success` classes
    - Added `variant="guide"` prop to `Prose` component; applied to all 7 guide chapters
  - **Docs updated:** `docs/DESIGN-SYSTEM-AAA.md` (full rewrite to match actual tokens), `.ai/CRITICAL_RULES.md`, `.ai/CONSTRAINTS.md`, `.ai/CONSTRAINTS_TECHNICAL.md`, `AGENTS.md`
  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06-aaa-readability/` (16 screenshots: 8 pages × light/dark).

- **2026-02-06 (AdSense reapplication status - docs only):** Added founder clarification that AdSense was re-applied about one day after rejection and is currently active/in-review.
  - **Topic updated:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`.
  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-06 (Monetization status context - docs only):** Recorded founder-reported AdSense/Ad Manager/Monumetric timeline so future sessions stop re-asking for the same approval history.
  - **Topic updated:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` now includes:
    - AdSense low-value denial timing (Feb 2-3, 2026, founder-reported)
    - concurrent Ezoic/Ad Manager evaluation and later denial context
    - Monumetric outreach + reported escalation to Google approvals
    - founder preference to de-prioritize Ezoic and prioritize Monumetric
  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-06 (Guide spacing cleanup - remove deadspace after editorial block):** Reduced vertical gaps across guide chapters by removing extra margins and tightening layout spacing.
  - **Layout changes:** Removed redundant margins around the editorial block and prose blocks; set guide pages to tighter `PageShell` spacing; removed `my-8` from `EditorialBlock`.

  - **Scope:** `/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`, and `components/guide/EditorialBlock.tsx`.

  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T05-18-53/`.

- **2026-02-06 (Guide Finish Touches - TOC, Links, Sources):** Applied final UI compliance fixes for the guide hub + chapters without changing core content.
  - **TOC badge sizing:** Raised Part badge to 12px minimum for readability.

  - **Quick links:** Default underlines applied on /guide quick links to match link rules.

  - **Inside Scoop sources:** Converted Home Depot corporate links into action buttons.

  - **Pre-hunt caveat:** Softened ladder color note with "varies by store" language.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T03-30-08/`.

- **2026-02-06 (Guide Content Alignment - Source-of-Truth Sync):** Applied a diff-based content pass across the guide hub + chapters to align with the pre-split HTML and newinfo notes without adding unverified claims.
  - **Content restored:** timeline durations + tag-date example (clearance lifecycle), penny-prone categories + community-reported verification tips (in-store), No Home + ladder notes (pre-hunt), internal-ops context + community-reported signals (inside scoop), and a real-vs-rumor mini table (facts vs myths).

  - **Tone policy:** Added short inline caveats for community-reported items; removed boilerplate EthicalDisclosure blocks from subpages (primary disclosure remains on `/guide`).

  - **FAQ updates:** Added/normalized pre-split questions with softened policy language.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T00-00-51/`.

- **2026-02-05 (Guide Rebuild - AdSense Content Recovery):** Rebuilt the guide from the pre-split HTML baseline, restored accuracy, and expanded word count for AdSense quality.
  - **Scope:** `/guide` hub + seven chapters (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`).

  - **Content approach:** Preserved original logic, removed false claims, labeled speculative items, and kept internal terms as community-reported context.

  - **UX:** Updated `components/guide/TableOfContents.tsx`, added expanded checklists/FAQs, and captured before/after UI proof.

  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-05T21-59-41/`.

- **2026-02-05 (Analytics Tidy Up - GA4/Monumetric Hygiene):** Tidied up the analytics implementation to improve data accuracy and restore Monumetric/GA4 trust.
  - **SPA Tracking:** Refactored client-side page views to use a native Next.js `AnalyticsTracker` component; removed brittle `history.pushState` patch in `layout.tsx`.

  - **Consent Mode v2:** Added explicit default consent signals for GA4 behavioral modeling (recovering data from blocked/unconsented users).

  - **Redundancy Reduction:** Removed redundant `home_page_view` and `penny_list_view` events; merged metadata (device/theme) into standard `page_view` config.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (Trip Tracker removal + plan archival):** Removed Trip Tracker from the product surface and archived the route per founder request.
  - **Code changes:** Removed `/trip-tracker` from sitemap and navigation surfaces; updated console audit test pages list.

  - **Archive:** `app/trip-tracker` moved to `archive/pages-pruned/2026-02-05-pass1/app/trip-tracker/` with restore manifest.

  - **Plan archive:** `adsense-approval-hardening` plan archived to `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` per founder request; indexes updated.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (AdSense hardening - canonical fix + Monumetric context):** Implemented canonical metadata repair and updated monetization plan context to include Monumetric review.
  - **Canonical fix:** Removed homepage-wide canonical fallback in `app/layout.tsx`; added explicit `alternates.canonical` across indexable routes (including `/guide`, `/store-finder`, `/clearance-lifecycle`, `/faq`, `/privacy-policy`, and other pillar pages).

  - **Docs updated:** `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` + `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` now reference Monumetric requirements and review status.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (AdSense context retention + plan hardening, docs-only):** Added canonical context docs so monetization/indexing strategy survives context-window resets.
  - **New topic capsule:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (evidence-backed current state, risks, handoff checklist).

  - **New plan:** `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` (multi-phase strategy covering canonical repair, sitemap/index hygiene, guide trust recovery, and review cadence).

  - **Indexes updated:** `.ai/plans/INDEX.md`, `.ai/topics/INDEX.md`.

  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-04 (Guide Content & Layout Repair):** Addressed user feedback regarding barren guide pages, missing navigation, and incorrect clearance info.
  - **Scope:** Overhauled `/guide` and `/clearance-lifecycle`; added `ChapterNavigation` and `TruthMatrix`.

  - **Content delivered:** 2026 Rules (MET/ZMA), Truth matrix (Old vs New), Chapter navigation flow.

  - **Files updated:** `app/clearance-lifecycle/page.tsx`, `app/guide/page.tsx`, `components/guide/TruthMatrix.tsx`, `components/guide/ChapterNavigation.tsx`.

  - **Verification:** `npm run ai:verify` ✅ (All gates passed), Design System compliant.

- **2026-02-04 (Guide Refresh - 2026 Research Integration):** Integrated 2026 operational research into the public guide pages and enforced token-only styling for a professional look.
  - **Scope:** Implemented `.ai/plans/2026-research-integration.md`.

  - **Content delivered (high-signal additions):**
    - ICE metrics tables + explanation

    - $.02 “buffer” explanation (what it signals and why it matters)

    - MET team schedule/ownership and why resets matter

    - ZMA disposition data table + implications

    - Legacy vs 2026 behavior comparison (explicitly labeled; no promises)

  - **Files updated:**
    - `app/clearance-lifecycle/page.tsx`

    - `app/inside-scoop/page.tsx`

    - `app/in-store-strategy/page.tsx`

    - `app/facts-vs-myths/page.tsx`

    - `components/guide/TableOfContents.tsx`

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), `npm run lint:colors` ✅ (0 errors / 0 warnings).

- **2026-02-04 (Guide Content Credibility Restoration - Critical):** Fixed content accuracy regression in clearance-lifecycle page introduced by commit 1c04eb7 (Feb 3, 2026).
  - **Root Cause:** Guide atomization commit included unapproved content rewrites that introduced false claims ("nearly 100% chance in 3 weeks"), removed detailed Cadence A & B information, reintroduced deprecated Trip Tracker CTA, and degraded mobile UX.

  - **Audit Completed:** Full analysis at `.ai/audits/guide-atomization-content-audit-2026-02-04.md` documenting what was removed vs. replaced with user impact analysis.

  - **Fixes Applied:**
    - ✅ Deleted Trip Tracker CTA block entirely (unapproved + conflicts with MY LIST)

    - ✅ Removed false "nearly 100% chance in 3 weeks" claim

    - ✅ Restored accurate Cadence A (13-week: .00→.06→.03→.01) and Cadence B (7-week: .00→.04→.02→.01) historical data with specific stage durations

    - ✅ Added "How It Used To Work" section explaining historical patterns

    - ✅ Added "What Changed" section explaining penny pricing shift (Home Depot inventory evolution)

    - ✅ Added "Current Reality" section with honest assessment of 2026 uncertainty

    - ✅ Added "Why We Show This History" bridge section to manage expectations

    - ✅ Fixed mobile UX (professional table sizing, responsive padding, removed oversized "childish" font)

  - **Verification:** `npm run qa:fast` (lint ✅, unit ✅, build ✅); commit `09a0670`.

  - **Impact:** Credibility restored through honesty about pattern shifts; users won't be blindsided when old advice doesn't work.

- **2026-02-04 (Bloat reduction - pass 5):** Implemented an evidence-based, repeatable bloat workflow and removed large sources of repo noise.
  - **Audit:** Added `npm run prune:audit` to measure repo surface area and detect bloat hotspots.

  - **Media quarantine:** Created `archive/media-pruned/` and moved large non-production media (and legacy proof images) into `archive/media-pruned/2026-02-04-pass1/` while preserving restore-path parity.

  - **Generated report cleanup:** Removed tracked generated artifacts (Playwright console reports + axe/contrast outputs) and added `.gitignore` coverage so they don’t reappear.

  - **Verification:** `npm run ai:verify -- test` (`reports/verification/2026-02-04T12-13-27/summary.md`).

- **2026-02-04 (Bloat reduction - pass 6):** Archived export artifacts, legacy Playwright snapshot baselines, and tracked screenshots into cold storage; added per-snapshot `INDEX.md` manifests and `.gitignore` patterns to prevent reintroduction. Hardened `ai:verify` so build uses `.next-playwright` when a dev server is running on 3001 (avoids `.next` clobber / flaky Windows Turbopack chunk errors).
  - **Verification:** `npm run ai:verify -- test` (`reports/verification/2026-02-04T13-31-17/summary.md`).

- **2026-02-04 (WCAG AAA Contrast Compliance - 0 Violations):** Achieved complete WCAG AAA accessibility compliance by fixing color contrast issues across all backgrounds.
  - **Root Cause Analysis:** Previous agent only tested colors against white (#ffffff) but ignored off-white backgrounds (#fafaf9, #f0f0ef) where text/borders actually appear.

  - **Fixes Applied:**
    - **Borders:** Changed from #a8a8a8 (2.38:1 - failed) to #757575 (4.61:1 on white, 4.04:1 on #f0f0ef) - now meets 3:1 UI component requirement

    - **Info/Live Indicator:** Changed from #8a6b2c (4.36:1 - failed AAA) to #53401e (8.69:1 on #f0f0ef) - now AAA compliant

    - **Text Hierarchy Restored:** Changed --text-muted from #36312e to #44403c (both AAA, but now visually distinct from --text-secondary)

    - **Placeholder Text:** Changed from #44403c to #36312e (same as secondary for consistency and AAA compliance)

  - **Verification:** axe-core accessibility scan shows **0 violations** (was 36), all 156 E2E tests passing, build successful.

  - **Mathematical Verification:** Created contrast calculation scripts that verified all colors meet 7:1 (text) or 3:1 (borders) on worst-case background (#f0f0ef).

- **2026-02-04 (AdSense/MCM Compliance Hardening):** Completed "Zero-Defect" compliance audit for Ad networks.
  - **Technical SEO:** Deleted conflicting `public/robots.txt`, verified `/sku/[sku]` and `/pennies/[state]` are explicitly `noindex` (solving "Valueless Content").

  - **Ad Integration:** Refactored AdSense script into `components/google-adsense.tsx` using `next/script` (afterInteractive) + hardcoded backup ID found in layout.

  - **Verification:** Created `scripts/verify-compliance.ts` which mathematically confirmed AdSense script presence + Noindex headers on live build.

- **2026-02-04 (Post-Mortem & SEO Remediation):** Fixed detected SEO failure where legacy `/guide/*` paths used 307 redirects. Implemented 301 permanent redirects in `next.config.js` and deleted legacy codebase folders to resolve duplicate content risks. Verified integrity with `scripts/verify-redirects.ts` (all 308) and full `npm run ai:verify` suite (lint/unit/e2e passed).

- **2026-02-03 (Docs/scripts bloat reduction - pass 4):** Archived low-signal AI prompt-pack docs to `archive/docs-pruned/2026-02-03-pass4/` and a low-reference helper script to `archive/scripts-pruned/2026-02-03-pass3/`, preserving restore-path parity. Added new snapshot manifests, updated `.ai/AI_ENABLEMENT_BLUEPRINT.md` to the archived prompt-pack path, and added `.gitignore` coverage for generated Playwright console report artifacts. Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T23-28-59/summary.md`).

- **2026-02-03 (Docs/scripts bloat reduction - pass 3):** Archived additional legacy docs and one-off scripts while preserving deterministic restore paths: docs moved to `archive/docs-pruned/2026-02-03-pass3/`, scripts moved to `archive/scripts-pruned/2026-02-03-pass2/`. Added snapshot indexes and updated in-repo references (`.ai/CONTEXT.md`, `.ai/topics/UI_DESIGN.md`, `docs/legacy/README.md`). Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T23-09-46/summary.md`).

- **2026-02-03 (AdSense Compliance: SEO Pillars & Content Consolidation):** Restored 6 high-quality root pillar pages (e.g., `/what-are-pennies`, `/clearance-lifecycle`, `/inside-scoop`) and redirected legacy `/guide/xxx` sub-paths to them to resolve Duplicate Content issues. Implemented a feature-rich `/faq` page with Schema.org JSON-LD. Hardened `sitemap.ts` to include 20 high-value pillar URLs only. Pushed all changes after successful `npm run build` and `npm run test:e2e` (82+ tests passing).

- **2026-02-03 (Docs/scripts bloat reduction - pass 2):** Archived an additional low-signal set into cold storage: 7 docs moved to `archive/docs-pruned/2026-02-03-pass2/` and 28 unreferenced/single-use scripts moved to `archive/scripts-pruned/2026-02-03/` (preserving exact restore paths). Added manifest files for both snapshots and updated startup guardrails so agents ignore both `archive/docs-pruned/**` and `archive/scripts-pruned/**` unless explicitly requested. Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T22-49-40/summary.md`).

- **2026-02-03 (Enablement: Agent Autonomy Hardening plan scaffold):** Added canonical planning docs for agent reliability and context retention: `.ai/plans/agent-autonomy-hardening.md` + `.ai/topics/AGENT_AUTONOMY_CURRENT.md`; registered in `.ai/plans/INDEX.md` and moved port-3001 reliability/access matrix into a phased, decision-complete plan. Docs-only change; quality gates not run.

- **2026-02-03 (Security & Cron Pause):** Paused weekly digest cron (`/api/cron/send-weekly-digest`) and removed from Vercel schedule to address Supabase usage warnings. Fixed critical vulnerability in `@isaacs/brace-expansion`. Verified with `npm run build`.

- **2026-02-01 (Fix: pre-enrichment retail_price missing + manual Penny List refresh):** Fixed staging warmer + scraper normalization so `enrichment_staging` no longer drops retail prices when upstream returns `store_retail_price` (and `retail_price` is `"N/A"`). Added staging status coverage stats and optional zip breadth sampling (`--zip-pool/--zip-sample/--zip-seed`, `PENNY_ZIP_POOL`). Added `scripts/apply-hd-enrichment-json.ts` to refresh Penny List enrichment fields from a manual HomeDepot.com scrape JSON (Option A). Hardened the HD bookmarklet price extraction to avoid exporting `price: ""` on some PDP variants, and kept it as an inline bookmarklet (Home Depot can block external script injection). Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-02-02T19-24-43/summary.md`).

- **2026-01-30 (Visual hierarchy overhaul: penny cards + static pages):** Fixed visual hierarchy across penny cards (metadata spacing, SKU chip styling, state chip containers, dark mode AAA contrast, empty ad slot gap) and static pages (Contact email card, About CTA hierarchy + h2 spacing, Support Rakuten card). Verified with all 4 quality gates + Playwright screenshots (mobile/desktop/dark). Plan files: `.ai/impl/visual-hierarchy-overhaul.md`, `.ai/impl/static-pages-visual-hierarchy.md`.

- **2026-01-30 (Fix: SerpApi spend control):** Scoped SerpApi gap-filler to the last 30 days only (prevents churn on historical backlog), reduced SerpApi workflow cadence to daily, added one-time backlog attempt capping migration, and added minimal `serpapi_logs` run summary table for auditability. Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-01-30T06-19-26/summary.md`).

- **2026-01-30 (Fix: retail price accuracy):** Stopped copying `retail_price` from `enrichment_staging` into `Penny List` during submission/cron seeding (prevents wrong retail strike-through values). SerpApi gap filler now pins `delivery_zip` (env: `SERPAPI_DELIVERY_ZIP`, default `30303`) to improve pricing/availability consistency. Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-01-30T00-30-06/summary.md`).

- **2026-01-28 (Enablement: safe local env parity):** Added `npm run env:pull` (Vercel → `.env.local`) and `npm run env:safety` (blocks accidental local targeting of prod Supabase by default), plus `npm run start:prodlike` for perf debugging. Updated `ai:doctor` and local warmer docs to reduce “limp local” from missing env vars. Verified with `npm run ai:verify` (lint/build/unit/e2e all passed).

- **2026-01-28 (Pages overhaul: Rakuten redirects):** Added `/go/rakuten` (redirects to Rakuten) and `/go/befrugal` (redirects to `/go/rakuten` for backward compatibility), plus `RAKUTEN_REFERRAL_URL` constant. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk1-2/`).

- **2026-01-28 (Pages overhaul: Privacy Policy rewrite):** Rewrote `/privacy-policy` to remove all Ezoic references, add GA4 disclosure, generalize advertising to “advertising partners” with `/ads.txt` reference, add Rakuten affiliate disclosure, and add a CCPA section anchored at `/privacy-policy#ccpa`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk3/`).

- **2026-01-28 (Pages overhaul: Terms of Service page):** Added `/terms-of-service` with a new Terms of Service page (effective date: Jan 28, 2026). Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk4/`).

- **2026-01-28 (Pages overhaul: Support page rewrite):** Rewrote `/support` to include a prominent Rakuten section (CTA links to `/go/rakuten` + affiliate disclosure), merge transparency content, remove the page-level `/cashback` link, and keep generalized ads + contact info. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk5/`).

- **2026-01-28 (Pages overhaul: /cashback redirect):** Deleted `/cashback` page and added a permanent redirect `/cashback` → `/support` in `next.config.js`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-28 (Pages overhaul: Footer links):** Updated the footer to remove the `/cashback` link, add `/terms-of-service`, add `/privacy-policy#ccpa` (“Do Not Sell My Info”), and update the copyright year to 2026. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-28 (Pages overhaul: Affiliate docs cleanup):** Updated docs to treat `/go/rakuten` as canonical (keeping `/go/befrugal` as legacy redirect) and removed the BeFrugal CSP `connect-src` entry from `next.config.js`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-26 (Deprecate Google Sheets pipeline):** Archived legacy Google Forms/Sheets strategy doc (`docs/legacy/PENNY-LIST-STRATEGY.md`), updated docs to Supabase flow (`README.md`, `PROJECT_ROADMAP.md`, `docs/WEEKLY-UPDATE-CHECKLIST.md`, `docs/AUTH-PIVOT-GUIDANCE.md`), added DEPRECATED headers to sheet-related scripts, and moved sensitive scripts to `backups/legacy-scripts/` to satisfy privacy pre-commit checks. Verified with `npm run qa:fast` (lint/build/test:unit all passed). Commit: `cd78313`.

---

## Traffic & Device Mix (Update Monthly)

**Source:** GA4 → Reports → Tech → Tech details → Device category

**Window:** last 28 days (consistent monthly window)

- **Mobile:** TBD%

- **Desktop:** TBD%

- **Tablet:** TBD%

### Weekly “Top 3” (Decision Output)

From `.ai/ANALYTICS_WEEKLY_REVIEW.md`:

- **Top leak:** TBD

- **Top opportunity:** TBD

- **Top guardrail:** TBD

- **2026-01-26 (SKU pill copy):** Added a reversible, feature-flagged copyable SKU pill on Penny List cards; styles + Playwright test added and verified (lint/build/unit/e2e).

- **2026-01-25 (Email Subscribers: Security & UX Hardening - LIVE):** Fixed 3 issues with email signup form: (1) **UX Bug:** Form was disappearing without success feedback because localStorage write triggered immediate re-render. Moved `safeSetItem(SUBSCRIBED_KEY)` inside the 3-second timeout so success message displays before hiding. (2) **Security:** Switched `/api/subscribe` and `/api/unsubscribe` to use `getSupabaseServiceRoleClient()` instead of anon key. Created migration 021 to drop overly permissive anon INSERT/UPDATE policies and fix trigger function search_path (`SET search_path = public, pg_catalog`). All writes now validated via API before database. (3) **Rate Limiting:** Added per-email rate limiting (3/hour, normalized to strip +aliases and lowercase) alongside existing IP rate limiting (5/hour). Prevents bypass via `test+spam@gmail.com` or domain variants. Commits: 5ce7bed (migration + initial fixes), b2caad9 (reapply after agent revert). **Note:** Migration 021 still needs to run in Supabase (will apply automatically on next Vercel deploy, or run manually in SQL editor).

- **2026-01-25 (Pipeline: local-first staging warmer + GH probe-only):** Updated the `Enrichment Staging Warmer` workflow to run in **probe-only** mode on schedule (no Supabase writes; no hard dependency on secrets) and to open/update an issue when blocked. Added a `PROBE_ONLY` path to `scripts/staging-warmer.py` so scheduled runs stay green while still emitting `FETCH_DIAGNOSTICS` + `cloudflare_block=true/false`. Also improved “freshness” tracking by stamping `created_at` on upserts, and fixed `scripts/print-enrichment-staging-status.ts` to use `created_at` (added `npm run staging:status`). Local warmer remains the primary data freshness path: `npm run warm:staging`.

- **2026-01-25 (SEO: delete thin pages):** Intentionally deleted `app/checkout-strategy/page.tsx` and `app/responsible-hunting/page.tsx` (commit `b7ca7bd`) to remove thin/low-value pages. These pages no longer serve `200` and should no longer be considered part of the sitemap strategy.

- **2026-01-24 (AdSense compliance deployment - LIVE):** Merged PR #108 to production after fixing merge conflicts and CSP blockers that had prevented deployment for weeks. Updated PR branch from main (resolved .ai/\* conflicts by keeping main's timeline), added Google AdSense domains to CSP allowlist in next.config.js (script-src: pagead2.googlesyndication.com, connect-src: pagead2.googlesyndication.com, frame-src: googleads.g.doubleclick.net + tpc.googlesyndication.com), ran full verification suite (lint/build/unit/e2e: all passed), pushed to GitHub (all CI checks passed: Quality Fast, CodeQL, SonarCloud, Vercel), merged to main via squash merge. Production now has: (1) AdSense script in `<head>` on all pages (`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5302589080375312">`), (2) Privacy policy with Google AdSense disclosures (DART cookie, third-party ads, opt-out links), (3) Contact page at /contact with contact@pennycentral.com, (4) About page expanded with mission statement (>200 words), (5) Sitemap includes /contact, (6) Footer includes "Contact Us" link. Fixed app/robots.ts to explicitly allow Mediapartners-Google (was missing because dynamic robots.ts was overriding public/robots.txt). Google AdSense can now verify the site for approval. Commits: f337e5f (PR #108 merge), 6ccf197 (robots.txt fix).

- **2026-01-24 (AdSense readiness + professional email checklist):** Added a README checklist covering domain/DNS, Cloudflare Email Routing, deliverability basics, and AdSense reviewer expectations. Added a reusable skill doc for future sessions: `docs/skills/adsense-domain-email-setup.md`.

- **2026-01-24 (SEO: stop redirect-only pages + sitemap canonical):** Removed redirects for `/checkout-strategy` and `/responsible-hunting` so those pages serve content and return `200` (not `308`). Added both pages to the live sitemap (`app/sitemap.ts`) and canonicalized `public/sitemap.xml` to `https://www.pennycentral.com/...` for consistency. Also hardened Playwright verification so e2e runs don’t clobber `.next` by using an isolated `NEXT_DIST_DIR=.next-playwright` output dir. Verification bundle: `reports/verification/2026-01-24T23-01-47/summary.md`. Production verified (Jan 24, 2026): both pages return `200` and appear in `/sitemap.xml`.

- **2026-01-23 (Ads.txt canonicalization):** Shipped Vercel config so `/ads.txt` resolves to `https://www.pennycentral.com/ads.txt` and is served with `Cache-Control: no-store, max-age=0` (static file at `public/ads.txt`; no middleware/API). Production verification (Jan 24, 2026): HTTPS apex and HTTP www are ≤1 hop; **HTTP apex is still 2 hops** due to Vercel’s automatic HTTP→HTTPS redirect happening before host canonicalization. Verification bundles: `reports/verification/2026-01-24T17-52-21/summary.md`, `reports/verification/2026-01-24T17-57-47/summary.md`.

- **2026-01-23 (SEO: State pages 500 fix):** Fixed `/pennies/[state]` pages returning 500 in production (blocking crawl/indexing) by updating the route params to match Next 16 (`params: Promise<...>`). Also stabilized Playwright verification by building in test mode with `NEXT_PUBLIC_EZOIC_ENABLED=false` and using `127.0.0.1` for the Playwright base URL to avoid flaky `localhost` IPv6 connection issues. Verification bundle: `reports/verification/2026-01-23T17-39-46/summary.md`.

- **2026-01-23 (Pipeline: Enrichment Staging Warmer diagnostics + Cloudflare blocker):** Fixed the GitHub Actions `Enrichment Staging Warmer` workflow so failures aren’t silent: added per-zip HTTP diagnostics (`FETCH_DIAGNOSTICS`), clearer failure hints, and auto-created/updated a GitHub issue on failure (includes `cloudflare_block: true/false`). Reality check: the upstream `pro.scouterdev.io/api/penny-items` endpoint is returning **403 + Cloudflare “Just a moment...” HTML** from GitHub-hosted runners, so scheduled runs are a low-aggression probe until we change runtime/IP. Added a local manual override that runs the _same_ pipeline from your home IP: `npm run warm:staging`. Also updated Vercel cron endpoints `seed-penny-list` and `trickle-finds` to read from `enrichment_staging` because production Supabase does **not** have `penny_item_enrichment` (PostgREST `PGRST205`). Verification bundle: `reports/verification/2026-01-23T10-51-52/summary.md`. Failure tracking issue: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/issues/106. Note: Cade updated Vercel apex redirect `pennycentral.com → www.pennycentral.com` from **307** to **301** for SEO/canonicalization.

- **2026-01-22 (Ezoic Ads: Option B Placeholders):** Implemented a trust-first Ezoic ad rollout with **5 total slots**: 3 on homepage (`HOME_TOP`, `HOME_MID`, `HOME_BOTTOM`), 1 on Penny List after item #10 (`LIST_AFTER_N`), and 1 on Guide after Section II (`CONTENT_AFTER_P1`). Added CLS-protected placeholder component + centralized ad config with `NEXT_PUBLIC_EZOIC_ENABLED` kill switch (requires Vercel redeploy for env var changes). Playwright E2E runs now force-disable Ezoic via `NEXT_PUBLIC_EZOIC_ENABLED=false` to prevent hydration mismatches and keep console clean. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T10-39-19/summary.md`. Ad placement screenshots: `reports/proof/2026-01-22T10-29-18-ezoic-b/`.

- **2026-01-22 (Tooling: Codex MCP Enablement):** Upgraded Codex CLI to a version that supports `codex mcp list/add/login`, normalized MCP config docs to `mcp_servers` (snake_case), and documented setup in `docs/skills/codex-mcp-setup.md`. (Local machine changes are outside repo; see `~/.codex/config.toml`.)

- **2026-01-22 (Penny List Bottom Pagination):** Fixed mobile UX issue where users had to scroll all the way back to the top to navigate to the next page. Added bottom pagination controls after the results (card grid or table) that only show when there are multiple pages. Features: "Showing X to Y of Z items" summary, Previous/Next buttons with arrows, prominent "Page X of Y" indicator, auto-scroll to top on page change, 44px mobile tap targets. Bottom pagination makes it immediately obvious there are more pages and provides one-tap navigation. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T07-33-39/summary.md`.

- **2026-01-22 (SEO: Global Canonical Tags):** Implemented self-referencing canonical tags across the entire site to fix Google Search Console issue where `/penny-list` was "Crawled - currently not indexed". Created `lib/canonical.ts` with `CANONICAL_BASE` constant and helper functions. Updated root `app/layout.tsx` metadata to include `alternates.canonical` field (Next.js automatically renders as `<link rel="canonical" ... />` in `<head>`). Updated `app/penny-list/page.tsx` and `app/sku/[sku]/page.tsx` metadata to include their own dynamic canonical tags. Result: every page now declares itself as the canonical version (homepage, penny list, SKU pages, etc.), consolidating Google's ranking authority on the new URLs and away from old redirects. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T06-53-56/summary.md`.

- **2026-01-21 (My List Phase 2):** Implemented Phase 2 of the My List elevation plan: removed the guest redirect wall on `/lists` and added locked preview UI (hero with benefit bullets + 6 sample items from `/api/penny-list`), updated guest save clicks to redirect with intent params (`/login?redirect=/lists?pc_intent=save_to_my_list&pc_sku=${sku}&pc_intent_id=${uuid}`), implemented intent resume logic on `/lists` that auto-saves after login using sessionStorage idempotency guard and cleans URL via `router.replace("/lists")`, and ensured all new copy uses "My List" (singular) branding. Files modified: add-to-list-button.tsx (guest redirect), app/lists/page.tsx (preview UI + intent resume). Ready for testing (guest save flow, idempotency, URL cleaning).

- **2026-01-21 (My List Phase 1):** Implemented Phase 1 of the My List elevation plan: swapped Bookmark icons to Heart (with fill="currentColor" for saved state), updated all UI labels to "My List" (singular), enforced 44px mobile tap targets on secondary action buttons (Home Depot, Barcode, Save) with desktop overrides (sm:min-h-[36px]), added "My List" to navbar and command palette with Heart icon, and implemented prefix-safe active state logic (pathname === "/lists" || pathname.startsWith("/lists/")). Files modified: add-to-list-button.tsx, penny-list-client.tsx, penny-list-card.tsx, navbar.tsx, command-palette.tsx. Ready for UI verification (mobile + desktop).

- **2026-01-21 (Process):** Standardized planning docs so all agentic coders (Codex/Claude/Copilot) follow the same pipeline: canonical registry at `.ai/plans/INDEX.md`, plan template at `.ai/plans/_TEMPLATE.md`, and a planning pointer in `.ai/START_HERE.md` + `.ai/USAGE.md`. The "My List" roadmap is now anchored via `.ai/plans/my-list-elevation.md` and `.ai/topics/MY_LIST_FEATURE_CURRENT.md`.

- **2026-01-18:** SKU detail page now places the "Report this find" CTA directly under the hero image with explicit "tap this to report" guidance; the button deep-links to `/report-find` with SKU/name prefilled (via `buildReportFindUrl`) and tracks via `TrackableLink`. Playwright tests filter known Ezoic/ID5 CSP console noise so e2e only fails on real app errors. Ezoic scripts are now gated to Vercel production only (disabled in CI/Playwright) so Full QA Suite `check-axe` stays green.

- **2026-01-21:** SKU detail page (mobile-first) now prioritizes community intel and contributions: moved “Where it was found” above “Related penny items”, added inline state chips under “Community Reports” for immediate payoff, made “Report this find” the primary CTA, demoted “View on Home Depot” styling to secondary, and restored “New to Penny Hunting?” to a boxed card. Verified via `reports/verification/2026-01-21T22-17-23/summary.md` + Playwright screenshots under `reports/verification/sku-related-items-chromium-mobile-*.png`.

- **2026-01-21:** Fixed a layout regression where the "Report this find" CTA could appear to the right of the hero image on larger viewports; changed the image container to a column layout so the CTA stacks under the image consistently. Also simplified the `Internet #` identifier to `Internet #:` and removed the extra explanatory subtext so the identifier reads inline (e.g., `Internet #: 1234567890`).

- **2026-01-21:** Fixed a Vercel/local build failure on `/lists` caused by importing a non-existent `@/lib/types` and missing `<Suspense>` boundary for `useSearchParams()`. Verified with `npm run ai:verify -- test` (`reports/verification/2026-01-21T12-24-30/summary.md`).

- **2026-01-18:** Replaced the fake `data/penny-list.json` fixture with a one-time Supabase snapshot of real SKUs (sanitized + timestamp-rebased for deterministic Playwright runs) and removed placeholder SKUs from tests/examples; regenerate manually via `npm run fixture:snapshot` (no cron).

- **2026-01-18:** Evaluated "old SKU" impact and decided **not** to add any historical tagging or "active only" UX at this time; documented a narrow, approval-gated plan to harden SKU page performance without user-visible changes (`.ai/impl/sku-page-performance-hardening-plan.md`).

- **Weekly Email Digest (Jan 17):** Implemented P0-4c weekly email cron that sends penny list updates to all active subscribers every Sunday 8 AM UTC. Created `emails/weekly-digest.tsx` (React Email template with product cards, summary stats, responsive design for email clients), `lib/email-sender.ts` (Resend API wrapper with error handling, 100ms rate limiting), and `app/api/cron/send-weekly-digest/route.ts` (cron endpoint that queries active subscribers + penny items from last 7 days, processes/aggregates by SKU, renders template, sends via Resend with unsubscribe links). Added cron schedule to `vercel.json` (Sunday 8 AM UTC: `0 8 * * 0`). Installed `resend`, `@react-email/components`, `react-email` (136 packages, 0 vulnerabilities). All 4 gates passing (lint/build/unit/e2e).

- **Email Signup Form (Jan 16):** Implemented P0-4b email signup form on `/penny-list` to capture users for weekly updates. Created `email_subscribers` table (migration 015) with RLS policies and indexes, `app/api/subscribe/route.ts` (POST endpoint with Zod validation, rate limiting 5/hour per IP, honeypot protection, crypto-secure token generation), `app/api/unsubscribe/route.ts` (GET endpoint with token-based unsubscribe), `components/email-signup-form.tsx` (dismissible form that appears after 25s OR 600px scroll, localStorage persistence, GA4 tracking), and `app/unsubscribed/page.tsx` (confirmation page). Wired into penny-list-client. All 4 gates passing (lint/build/unit/e2e).

- **PWA Install Prompt (Jan 16):** Implemented "Add to Home Screen" prompt on `/penny-list` to improve Day 7 retention (currently ~0%). Created app icons (192px, 512px) from existing SVG using Playwright, updated `site.webmanifest` with proper PWA metadata (name: "Penny Central", start_url: "/penny-list"), added dismissible prompt component with localStorage persistence and GA4 tracking (pwa_prompt_shown, pwa_install_started, pwa_prompt_dismissed), and wired into penny-list-client. Prompt appears after scroll (200px) or 20s delay, respects prefers-reduced-motion, and detects existing installations. All 4 gates passing (lint/build/unit/e2e).

- **Skimlinks env vars cleaned up (Jan 16):** Removed SKIMLINKS_DISABLED env vars from CI workflow since Skimlinks script is fully removed. Verified with all 4 gates passing.

- **Penny List freshness + missing items fixed (Jan 13):** Public updates now target ~5 minutes (`/api/penny-list` CDN caching `s-maxage=300` + `/penny-list` `revalidate=300`), submitter flow can bypass once via `?fresh=1` (no-store) without global polling, and the enrichment overlay no longer hides SKUs that lack `penny_item_enrichment` rows (root cause of “some items missing”). Proof: `reports/verification/2026-01-13T08-16-40/summary.md` and `reports/proof/2026-01-13T08-22-19/console-errors.txt`.

- **Full QA Suite stabilized (Jan 13):** Fixed CI E2E hydration crash when `NEXT_PUBLIC_SUPABASE_*` is missing by making `AuthProvider` skip Supabase initialization when not configured. Ensured `/sku/[sku]` pages exist in Full QA builds by setting `USE_FIXTURE_FALLBACK=1` during the build step (CI has no Supabase creds). Reduced Sentry email noise by suppressing reporting on localhost and Vercel previews.

- **Canonical global analytics setup (Jan 12):** Made `app/layout.tsx` the single source of truth for global scripts. Grow now ships as a real `<script src="https://faves.grow.me/main.js" ...>` in `<head>` (crawler-detectable), GA4 fires on SPA route changes (history hooks), Vercel Analytics + SpeedInsights render only on Vercel production, removed invalid wildcard `preconnect` links, and updated CSP to allow `faves.grow.me` / `*.grow.me` without console errors. Verified with `reports/verification/2026-01-12T22-29-04/summary.md`.

- **Grow connectivity checker hardening (Jan 13):** Updated the Grow install in `app/layout.tsx` to match the Grow portal's canonical single-tag initializer snippet (injects `https://faves.grow.me/main.js` + sets `data-grow-faves-site-id`) to reduce false-negative "Check Grow Connectivity" failures. Local gates green; production re-check pending.

- **Privacy Policy page for Monumetric (Jan 14):** Added `/privacy-policy` (linked in global footer + sitemap) containing Monumetric's required advertising disclosure and a stable link for Monumetric onboarding. Verified locally via `reports/verification/2026-01-14T20-23-25/summary.md`.

- **Monumetric ads.txt (Jan 14):** Added `public/ads.txt` so `https://www.pennycentral.com/ads.txt` serves Monumetric's required `ads.txt` lines for interim ads onboarding. Verified locally via `reports/verification/2026-01-14T20-40-02/summary.md`.

- **Autonomous automation (Jan 15):** Implemented Dependabot weekly updates and scheduled Snyk daily scans. (Supabase backup cron was later disabled per Cade’s preference; use one-time/manual snapshots only.) Enforced Python tooling via `ruff` + `.pre-commit-config.yaml` and updated VS Code Python settings; added `.ai/SENTRY_ALERTS_MANUAL.md` with steps to tune Sentry. Verified via `reports/verification/2026-01-15T11-11-41/summary.md`.

- **Mediavine Journey (Grow) installation (Jan 12):** Integrated Mediavine's Grow script for first-party data and monetization readiness. Added `preconnect` and initializer to `app/layout.tsx`. Verified with production build and zero-warning lint.

- **Report Find submissions restored (Jan 12):** Root cause was Supabase RLS/privileges now blocking direct `anon` INSERTs into `public."Penny List"` while `/api/submit-find` was still using the anon key. Fixed by inserting via the Supabase service role key in `app/api/submit-find/route.ts` (keeps DB locked down from direct anon inserts), and rate limiting now counts only successful submissions (so a transient server error doesn't lock out users). Updated `docs/supabase-rls.md` to match current reality. Verified with `reports/verification/2026-01-12T05-37-14/summary.md`.

- **Supabase egress optimization (Jan 11):** Reduced payload per query by excluding notes from list queries (include only on detail pages). Made `notes_optional` optional in `SupabasePennyRow`, removed unused `source` column from enrichment type, added `includeNotes` flag to `getPennyListFiltered()`, updated list queries to use lightweight fetch. Expected impact: 6.30 GB → ~3.30 GB (stays under 5 GB limit). Also leverages Supabase Cache layer (currently 0.00 GB) via existing Cache-Control headers + ISR page caching (30 min). Tests pending verification.

- **Decision frame documented (Jan 11):** Added a stable "Decision Frame" (steelman/strawman for submissions vs retention vs SEO, plus stability + pipeline) to `.ai/CONTEXT.md` so agents keep perspective on what matters.

- **Agent alignment + proof canon (Jan 11):** Added missing `.ai/VERIFICATION_REQUIRED.md` (paste-ready proof format) and expanded `.ai/USAGE.md` (Goldilocks task spec + course-correction script). Linked from `.ai/START_HERE.md`, `.ai/CODEX_ENTRY.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` so Codex/Claude/Copilot follow the same protocol.

- **Dev/Test mode protocol (Jan 11):** Standardized dev-server ownership to reduce Copilot hang/port loops: `ai:verify` supports `dev`/`test` modes with HTTP readiness retries, Playwright uses a Playwright-owned `next start` server on port 3002 by default (no reuse unless `PLAYWRIGHT_REUSE_EXISTING_SERVER=1`), and port 3001 guidance is now "kill only if proven unhealthy + you own it".

- **Penny Deal Card final converged design (Jan 11):** Updated Penny List cards so brand is attached to the image edge and subordinate, recency is the only top-right element (calendar + muted text), Save is icon-only and moved into secondary actions, state pills are muted (max 4) with a single smaller "X reports total" line, and explicit "$X off" savings lines are removed while $0.01 remains the hero price.

- **Data pipeline P0 bootstrap (Jan 10):** Added `scripts/validate-scrape-json.ts` to normalize and validate raw scrape JSON (SKU validation, field presence stats, cleaned output to `.local/`), and wired npm scripts for `export:pennycentral` (existing export script runner) and `validate:scrape`.

- **Data pipeline P0 continue (Jan 10):** Added `scripts/scrape-to-enrichment-csv.ts` (fill-blanks-only CSV from cleaned scrape + current enrichment) and `scripts/enrichment-diff.ts` (Markdown diff summary). Wired npm scripts: `convert:scrape`, `diff:enrichment`.

- **Penny List card tightening + trust soften (Jan 10):** Reduced card padding, image size to 64px, smaller SKU chip, inline info-style trust row, compressed primary/secondary action heights; submit-find enrichment lookup now skips when mocks are minimal and only attaches enrichment fields when present (no null payload clutter).

- **Penny List CTA tuned to moderate blue (Jan 10):** Kept brass/gold accents for small badges and green for success only, but moved the primary CTA to a moderate blue (light + dark) so it no longer competes with gold/brass; Penny List card hierarchy updated (72x72 image, SKU pill, reduced $0.01 dominance, trust row prominence, savings not green) and green glow removed from list cards.

- **Penny List thumbnail image parity fix (Jan 10):** Fixed an image resolution divergence where list cards could show a generic/placeholder thumbnail while SKU pages showed the correct product image; list cards now use a reliable THD `-64_400` thumbnail variant helper instead of generating `-64_300` URLs.

- **Penny List HD link fix (Jan 10):** Fixed a UI parity bug where the Penny List "Hot Right Now" cards were missing the Home Depot link even though SKU pages had it; Hot cards now render a Home Depot link using the same fallback URL builder as SKU pages, and a Playwright assertion covers it.

- **Guide visual upgrade (Jan 09):** Rewrote `/guide` meta description to match actual search queries ("Find Home Depot penny items in 5 minutes..."); added Section II-B (Visual Label Recognition) with 6 real label photos + full clearance cycle example; added Section II-C (Overhead Hunting) with wide/close overhead photos + Zebra scan risk warning; added Section III-A (How to Verify Penny Status) with step-by-step "Right Way" vs. "Wrong Way" + self-checkout tactics; updated Section IV to note clearance endcaps being phased out; added strong conversion CTA section linking to `/penny-list` and `/report-find`. Expected impact: CTR from 0.39% → 2-3% within 2-3 weeks.

- **Returning users nudge (Jan 08):** Added a small, dismissible “Bookmark this page” banner on `/penny-list` (shows after scroll or ~20s, then stays dismissed) to increase repeat visits; updated `scripts/ai-proof.ts` to be more resilient when capturing Playwright screenshots.

- **Image URL normalization (Jan 08):** Standardized all product image URLs to -64_600.jpg in database (canonical source). Components downconvert at display time: SKU pages use 600px (full-size, ~60-80 KB), related items cards use 400px (~40-60 KB), Penny List thumbnails use 300px (~20-30 KB). Strategy balances quality with bandwidth efficiency. Script `normalize-image-urls.ts` normalizes DB; removed brand duplication from SKU page titles; enlarged SKU page image area; moved related items higher on page.

- **SEO intent landing pages (Jan 08):** Added `/home-depot-penny-items`, `/home-depot-penny-list`, and `/how-to-find-penny-items` and included them in the sitemap to target high-intent keyword phrases and funnel to `/guide` + `/penny-list`.

- **Homepage freshness (Jan 06):** `/` now revalidates every 5 minutes so "Today's Finds" reflects Supabase enrichment fixes without redeploys.

- **Thumbnail reliability (Jan 08):** Standardized thumbnails to the more reliable Home Depot `-64_400` variant (the `-64_300` variant is not consistently available and can cause 404s/blank images).

- **Penny List thumbnail fallback (Jan 06):** If a THD image request fails, Penny List thumbnails fall back to `-64_1000` automatically so cards don't show blank images.

- **Vercel analytics fail-safe (Jan 06):** Vercel Web Analytics now enables automatically on Vercel production unless explicitly disabled (`NEXT_PUBLIC_ANALYTICS_ENABLED=false`), avoiding silent drops when `NEXT_PUBLIC_ANALYTICS_PROVIDER` is unset/mismatched.

- **Barcode modal reliability (Jan 06):** Barcode rendering now validates UPC-A/EAN-13 check digits and falls back to `CODE128` when invalid, preventing blank barcode boxes.

- **Penny List audit counts (Jan 06):** Added `npm run penny:count` (`scripts/print-penny-list-count.ts`) to print report vs. SKU counts and explain "imported history looks recent" (timestamp) vs. true last-seen (purchase_date).

- **Card view parity + shared UI (Jan 05):** Extracted shared `StateBreakdownSheet` and `PennyListActionRow`, centralized Line A/B formatting helpers, and updated card/table to use the shared components with lastSeenAt + state spread.

- **Purchase date parsing resilience (Jan 05):** Added a `parsePurchaseDateValue` helper so both `pickBestDate` and `pickLastSeenDate` treat timestamp-like `purchase_date` strings as valid dates instead of falling back to the submission `timestamp`.

- **Barcode modal stability (Jan 05):** Barcode modal now picks `UPC`, `EAN13`, or `CODE128` based on the UPC length so `JsBarcode` can draw bars for every SKU rather than silently failing on 13-digit values.

- **Penny List "Last seen" precedence (Jan 05):** Added server-side `lastSeenAt` (purchase_date when valid and not future, else report timestamp) and table Line A now uses it (fallback to `dateAdded`).

- **Penny List date/sort consistency (Jan 05):** Aligned SSR/API/client defaults to 30d, standardized window label to `(30d)`, made Newest/Oldest sort follow `lastSeenAt`, and tightened date-window filtering to “last seen” semantics (purchase_date when present, else timestamp).

- **Penny List card redesign spec alignment (Jan 05):** Updated `.ai/PENNY-LIST-REDESIGN.md` to require SKU on card face, Home Depot action button, report counts in Line B with window label, and window consistency across card + state sheet. Guardrails updated to allow dense metadata text and card padding exceptions.

- **Unified green brand (Jan 03):** Light mode CTAs updated from slate blue to forest green (#15803d), matching dark mode's Technical Grid emerald green (#43A047). Both modes now use consistent "savings green" psychology (research: 33% higher trust in savings contexts). All contrast ratios meet WCAG AAA. Documentation synced.

- **Reduced editor hint noise (Jan 03):** Disabled VS Code webhint diagnostics in `.vscode/settings.json` to avoid TSX false-positives; rely on repo verification (`check-axe`/Playwright) for real accessibility regressions.

- **Supabase enrichment import (Jan 03):** Imported `scripts/GHETTO_SCRAPER/penny_scrape_2026-01-03T11-15-29-344Z.json` into `penny_item_enrichment` (processed 100; skipped 7 `$0.00` rows).

- **Bulk enrichment safety (Jan 03):** `scripts/bulk-enrich.ts` now accepts Tampermonkey scrape JSON directly, defaults to fill-blanks-only merge, and hard-skips explicit `$0.00` retail prices.

- **SerpApi fill-blanks enrichment (Jan 03):** `scripts/serpapi-enrich.ts` now enriches when any core fields are missing (not "image-only"), upserts fill-blanks-only by default (`--force` to overwrite), and avoids wiping fields on `not_found`.

- **SerpApi Actions budget (Jan 03):** `.github/workflows/serpapi-enrich.yml` runs every 6 hours with default `--limit 1` (includes `--retry`) to stay within the 250 searches/mo free tier.

- **Docs alignment (Jan 03):** `README.md`, `docs/CROWDSOURCE-SYSTEM.md`, and `docs/SCRAPING_COSTS.md` now reflect the current Supabase-based system (Google Sheets is legacy/deprecated).

- **Playwright e2e reliability (Jan 03):** `playwright.config.ts` runs Playwright against `next start` (avoids `.next/dev/lock` conflicts when `next dev` is already running on port 3001).

- **Scraper controller price-aware skipping (Jan 03):** `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` now only skips items that already have a valid `retailPrice`, and upgrades existing entries when a new scrape finally yields a price.

- **Scraper controller pause/stop + exports (Jan 03):** Added Pause/Resume + Stop Session controls, kept main JSON export + failures JSON export, and ensured saved entries include a canonical Home Depot URL.

- **Tampermonkey retries restored + failure export (Jan 03):** Userscript now redirects `/s/` searches to PDPs, retries when data is missing, reports bot/region blocks, and the controller gained a single "Export Failures JSON" button.

- **Scraper controller HTML hint cleanup (Jan 03):** Added `lang`/`charset`/`viewport`, labeled form controls, and removed inline button styles in `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` to reduce VS Code Edge Tools noise.

- **OCE protocol + proof workflow (Jan 02):** Embedded an "Objective Collaborative Engineering" protocol into `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md` + `.ai/USAGE.md`, added VS Code tasks for `ai:*`, and fixed `npm run ai:verify` to reuse the running dev server on port 3001 (avoids `.next/dev/lock` conflicts).

- **Penny List card density (Jan 01):** Tightened mobile card layout, kept identifiers always visible, added UPC block, compacted state pills, and simplified actions while preserving Save/Report/Share/HD links.

- **Penny List mobile action bar (Jan 02):** Added a mobile-only bottom action bar on `/penny-list` with filter + sort bottom sheets, safe-area padding, and extra results padding so cards stay visible; desktop filters remain unchanged.

- **Penny List hydration mismatch (Jan 02):** Suppressed a search-input hydration warning on `/penny-list`, eliminating Playwright console errors in dev.

- **Auto-enrich guardrails (Jan 01):** Cron normalizes brand/name, uses canonical HD URL, and skips upserts when `item_name` is missing; added scrape tooling (`scripts/transform-scrape.ts`, `scripts/analyze-scrape-coverage.ts`) and ignore rules for local scrape artifacts.

- **Proxy migration (Dec 31):** `middleware.ts` renamed to `proxy.ts` with `proxy` export (Next 16 deprecation resolved).

- **OTel warning fix (Dec 31):** npm `overrides` pin `import-in-the-middle@2.0.1` and `require-in-the-middle@8.0.1`, silencing Turbopack warnings.

- **State pages (Dec 31):** Added `app/pennies/[state]/page.tsx` + `lib/states.ts`; sitemap includes all state slugs; pages filter 6m penny finds by state.

- **Guide timeline (Dec 31):** Added clearance cadence timeline + tag examples to `components/GuideContent.tsx`.

- **Penny list API (Dec 31):** Date-window filtering at DB level across `timestamp`/`purchase_date` for 1m-24m windows; response shape unchanged.

- **Homepage (Dec 31):** "Today's Finds" module below hero using 48h `getRecentFinds`; mobile horizontal scroll, desktop grid, state badges, relative time, CTA to `/penny-list`.

---

## Recent History (Last 30 Days)

**Dec 30:** RLS Migration - Applied `008_apply_penny_list_rls.sql`, created `penny_list_public` view, enabled RLS on tables. Performance + SEO + RLS PRs merged (#63, #64, #65).

**Dec 28-29:** Penny List polish - identifiers row, grid density, thumbnail styling, card typography hierarchy, SKU page polish. Auth + Personal Lists + Sharing (PR-3): magic-link login, save to list, list detail with toggles, public sharing.

**Dec 27:** PR-1 and PR-2 complete - SKU copy UX with tap-to-copy, Report Find prefill + validation. MCP availability + env wiring. 6-PR roadmap established.

**Dec 26:** Documentation cleanup (deleted 11 deprecated files), agent system created (AGENT_POOL.md, ORCHESTRATION.md), AI automation scripts complete (`ai:doctor`, `ai:verify`, `ai:proof`), screenshot automation, pre-commit hooks (security:scan, lint:colors).

**Dec 25:** Supabase migration complete - `Penny List` table with server-side pagination, enrichment overlay (`penny_item_enrichment`), RLS hardening plan. All 4 quality gates passing.

**Dec 23-24:** OG image redesign - switched to static PNGs for Facebook reliability, left-aligned layout, coin quality improvements, kept under 1 MB Vercel edge function cap.

**Dec 21:** Dynamic OG generation switched to hybrid static + dynamic approach (Playwright screenshots for main pages, dynamic for SKU pages with 24hr caching).

**Dec 19:** Verified Pennies feature removed (privacy) - `/verified-pennies` redirects to `/penny-list`, SKU pages derive from Penny List only.

---

## Key Metrics

- **Live:** https://www.pennycentral.com

- **Supabase:** Project `supabase-red-river` (ref: `djtejotbcnzzjfsogzlc`)

- **Tech:** Next.js 16 + TypeScript, Tailwind (custom tokens), React-Leaflet, Vercel

- **Quality:** All gates green (lint/build/unit/e2e)

---

**For full history:** See `archive/state-history/STATE_2024-12-01_to_2025-01-03.md`
