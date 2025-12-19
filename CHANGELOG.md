# CHANGELOG

Brief log of completed work. Most recent at top.

Dates are recorded in America/New_York time.

---

## 2025-12-19 - Remove Verified Pennies + Internet SKU Integration

- Removed the `/verified-pennies` feature and all repo-stored verified datasets/scripts.
- Added a permanent redirect from `/verified-pennies` to `/penny-list`.
- SKU pages and sitemap now derive from the Community Penny List only.
- **Internet SKU Integration:** Added `internetNumber` field parsing from Google Sheet; SKU pages and penny-list-table now use Internet SKU for better HD product links when available (falls back to SKU search when missing).

## 2025-12-15 - Store Finder Popup/Map Normalization + Screenshot Verification

- Switched Store Finder to standard OpenStreetMap tiles (normal, familiar map look in both themes).
- Cleaned popup header (removed “Store” label and redundant location line) while keeping separators, hour boxes, and click-to-call phone.
- Fixed CTA/link color clashes caused by Leaflet default anchor styling.
- Added rank numbers on map pins for quick list-to-map matching.
- Kept the coordinate override system available for future user-reported issues; currently empty because upstream store data is now corrected.
- Simplified `site.webmanifest` to remove missing-asset references and validator issues.
- Added a Playwright screenshot spec for Store Finder popup and hardened visual smoke tests; all gates passing (lint/build/unit/e2e).

## 2025-12-16 - Verified Pennies Launch + Homepage/Nav Refresh

- Added a new verified route `/verified-pennies` for browsing confirmed penny items with images, search, and brand filtering.
- Updated primary navigation to emphasize Verified + Penny List and shortened labels for clarity (Report, Stores).
- Updated homepage hero + tools section to prioritize Verified Items and the Penny List; restored Store Finder as a secondary link.
- Clarified what “Verified” means on `/verified-pennies` to reduce user-risk and set expectations about store-by-store variance.
- Restored design-token compliance by removing raw Tailwind palette colors across UI surfaces (including modal backdrops and status treatments).
- Enabled `next/image` support for Home Depot CDN images via `images.remotePatterns` (`images.thdstatic.com`).

## 2025-12-13 - Store Finder Visual Enhancements and Data Accuracy

- Implemented coordinate override support for user-reported store data issues (later cleared once upstream store data was corrected).
- Switched map tiles to CARTO voyager for improved mid-contrast in both light and dark themes.
- Unified popup styling in CSS for better readability, consistency, and theme support.
- Removed unused Suspense import in layout.tsx to resolve lint error.
- All gates passing: lint, build, unit tests, e2e tests.

## 2025-12-13 - Layout primitives rollout (partial)

Objective: Make every route feel like the same website by standardizing structure, spacing, and CTA placement, without redesigning copy.

Prompt summary:

- Fix or replace `components/page-templates.tsx` to match the token contract.
- Implement primitives: PageShell, PageHeader, Section, Prose.
- Apply primitives incrementally across routes with full gates after each chunk.

What changed:

- Rebuilt `components/page-templates.tsx` with server-friendly primitives:
  - PageShell, PageHeader, Section, Prose
  - Uses design tokens consistently and sets consistent max widths, rhythm, and CTA handling.
- Migrated the first set of content routes onto the new primitives without changing copy:
  - `app/about/page.tsx`
  - `app/cashback/page.tsx`
  - `app/resources/page.tsx`
  - `app/clearance-lifecycle/page.tsx`
  - `app/guide/page.tsx`
- Normalized typography and colors to `var(--*)` tokens; aligned header and CTA placement.
- Added consistent sections and long-form list/prose styling; standardized card treatments for support/download areas.
- Color lint improved (warnings dropped to 13 vs baseline 47; no new violations introduced).

Testing:

- `npm run lint` ✅
- `npm run test:unit` ✅
- `npm run lint:colors` ✅
- `npm run build` ✅
- `npm run test:e2e` ❌ (visual snapshot diffs expected from layout updates; baselines not updated)

Notes:

- Next step is to review diffs and update Playwright baselines for affected routes, or adjust layouts if the diffs reveal unintended changes.

---

## 2025-12-13 - Token alignment + shadcn variable bridging (visual baselines pending)

Objective: Move toward one token system used everywhere, align with DESIGN-SYSTEM-AAA, and reduce raw Tailwind palette usage in global utilities.

Prompt summary:

- Map token usage vs docs and identify conflicts.
- Bridge shadcn semantic variables (background, foreground, border, ring, etc) to project tokens.
- Replace raw Tailwind palette usage in `globals.css` utilities and Leaflet styling with token-based values.
- Add a token usage guide to `.ai/FOUNDATION_CONTRACT.md`.
- Run contrast and axe audits against BASE_URL.

What changed:

- Rebased `app/globals.css` tokens to match `docs/DESIGN-SYSTEM-AAA.md`:
  - Added tokens like `--bg-recessed`, `--bg-focus`, `--text-placeholder`, `--link-*`
  - Refreshed light/dark text, border, CTA, status, and live indicator values.
- Bridged shadcn variables to the token system so shadcn semantic classes inherit PennyCentral palette automatically:
  - `background`, `foreground`, `card`, `popover`, `muted`, `secondary`, `border`, `ring`, `destructive`, `accent`.
- Replaced raw Tailwind palette usage in global utilities (badges, callouts, tooltips, tables, chips, Leaflet popups, selection colors) with token-based colors.
- Updated footer to use tokenized backgrounds/text/links and consistent underline treatment.
- Added “Token Usage Guide” to `.ai/FOUNDATION_CONTRACT.md`:
  - Allowed: token utilities (`bg-[var(--token)]`, `text-[var(--token)]`, `border-[var(--token)]`) and shadcn semantics (after aliasing).
  - Disallowed: raw palette classes (`bg-slate-*`, `text-zinc-*`, etc).

Testing:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run check-contrast` ✅ (writes `reports/contrast-computed.json`)
- `npm run check-axe` ✅ (writes `reports/axe-report.json`)
- `npm run test:e2e` ❌ (10 visual snapshot diffs after palette/token changes)

Open items / risks:

- Many pages and components still use raw palette classes and should be migrated to tokens for full consistency and stable contrast.
- Legacy aliases (example: `--bg-primary/--bg-secondary` and `--success|--error|--warning` aliases) remain for compatibility and can be retired after consumers migrate.
- DESIGN-SYSTEM-AAA contains conflicting dark palette blocks; ensure a single source of truth before finalizing the dark palette.

---

## 2025-12-13 - ESLint duplicate bug prevention + color drift ratchet

Objective: Prevent the class of bugs Cade cannot detect (duplicate JSX props, duplicate object keys) and stop raw Tailwind color drift from getting worse.

Prompt summary:

- ESLint hardening: enforce `react/jsx-no-duplicate-props` and `no-dupe-keys` as errors.
- Implement a “color drift ratchet” so new raw Tailwind colors cannot be introduced without intentionally updating a reviewed baseline.
- Confirm BASE_URL consistency and update docs to match reality.

What changed:

- Enforced duplicate-prop and duplicate-key prevention as errors in `eslint.config.mjs`:
  - `react/jsx-no-duplicate-props`
  - `no-dupe-keys`
- Added a color drift ratchet:
  - Baseline file: `checks/lint-colors.baseline.json` (47 warnings baseline)
  - `npm run lint:colors` now fails only if warnings increase compared to baseline.
  - New helper script: `npm run lint:colors:update-baseline` to refresh the baseline intentionally after review.
- Updated `SCRIPTS-AND-GATES.txt` to document the ratchet and confirm BASE_URL resolution path for audits.
- Recorded baseline/reference in `.ai/STATE.md` and logged the session.

Testing:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅

Notes:

- `COMPONENT-TREE.txt` left untouched and untracked in this pass.

---

## 2025-12-13 - Foundation contract + route inventory refresh

Objective: Create a repo-level “foundation contract” so changes remain safe and verifiable for a non-coder workflow, and refresh route scope.

Prompt summary:

- Cover the entire site using `ROUTE-TREE.txt` as scope (regenerate if stale).
- Read AGENTS/CLAUDE/SKILLS/DESIGN-SYSTEM-AAA + globals and inventory docs.
- Write `.ai/FOUNDATION_CONTRACT.md` (tokens, Tailwind rules, layout primitives, nav rules, regression gates).

What changed:

- Added `.ai/FOUNDATION_CONTRACT.md` capturing:
  - token rules
  - allowed Tailwind usage
  - layout primitives expectations
  - nav/IA expectations
  - required regression gates
- Refreshed `ROUTE-TREE.txt` from the latest Next build (includes framework 404 and marks dynamic/API routes).
- Updated `.ai/STATE.md` and `.ai/SESSION_LOG.md` to reflect the new contract and route inventory.
- Commit created on main: “Add foundation contract and refresh route list.”

Testing:

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅

Notes:

- Playwright logs still show Next.js “Invalid source map” warnings and store-finder falling back to local data on remote 404, but no test failures.

---

## 2025-12-12 - Repo truth verification + Windows axe report save fix

Objective: Verify what is actually true in the repo (ports, scripts, docs), remove hardcoded ports, and confirm all gates pass.

Prompt summary:

- Confirm dev port and ensure audits target the same running server via BASE_URL.
- Remove any hardcoded `http://localhost:3000` usage.
- Fix documentation drift in `SCRIPTS-AND-GATES.txt`.
- Run build/lint/unit/e2e and run axe/contrast against BASE_URL.

What changed:

- Confirmed `package.json` dev and start port is 3001 and `check-axe` is `node scripts/check-axe.js` (no hardcoded `http://localhost:3000`).
- Confirmed audits share the same base URL logic:
  - Axe: `scripts/check-axe.js` -> `scripts/get-base-url.js`
  - Contrast: `scripts/check-contrast.js` -> `scripts/get-base-url.js`
  - Lighthouse: `scripts/run-audit.ps1` -> `scripts/print-base-url.js` -> `scripts/get-base-url.js`
- Fixed a real repo bug on Windows:
  - `scripts/check-axe.js` now passes a relative `--save` path so `@axe-core/cli` can write the report reliably.
- Regenerated audit outputs so they reflect `http://localhost:3001`:
  - `reports/axe-report.json`
  - `reports/contrast-computed.json`

Testing:

- `npm run build` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅
- With server running:
  - `$env:BASE_URL='http://localhost:3001'; npm run check-axe` ✅
  - `$env:BASE_URL='http://localhost:3001'; npm run check-contrast` ✅

---

## 2025-12-12 - Baseline audit + gate wiring (BASE_URL) and audit docs

Objective: Stabilize build and quality gates site-wide before any styling or content refactors.

Prompt summary:

- Run baseline build health across all routes.
- Fix gate wiring and hardcoded ports by using a shared BASE_URL for audits.
- Write `.ai/BASELINE_AUDIT.md` and `.ai/FOUNDATION_PLAN.md`.
- Stop after gates are correct and docs are written.

What changed:

- Fixed audit gate wiring to use BASE_URL (no hardcoded ports):
  - `package.json`
  - `scripts/check-axe.js`
  - `scripts/check-contrast.js`
  - `scripts/run-audit.ps1`
  - `scripts/get-base-url.js`
  - `scripts/print-base-url.js`
- Unblocked baseline health by updating Playwright visual snapshots for `/penny-list` so `npm run test:e2e` passes again.
- Wrote the required docs:
  - `.ai/BASELINE_AUDIT.md`
  - `.ai/FOUNDATION_PLAN.md`
- Updated `SCRIPTS-AND-GATES.txt` to reflect the gates and new BASE_URL behavior.

Testing:

- `npm run build` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅

How to run audits (2 terminals):

- Terminal A: `npm run dev`
- Terminal B (PowerShell):
  - `$env:BASE_URL='http://localhost:3001'; npm run check-axe`
  - `$env:BASE_URL='http://localhost:3001'; npm run check-contrast`
  - `pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/run-audit.ps1`

What was explicitly not done:

- No styling/token refactors across pages
- No nav/content changes
- No new dependencies
- No redesign work

---

## 2025-12-12 - SKU validation narrowing

Objective: Align SKU validation with latest business rule (6 or 10 digits only) and document the change.

What changed:

- Updated SKU validation to accept only 6 or 10 digits; removed 9-digit support for consistency across client, server, and form helpers (`lib/sku.ts`, `app/report-find/page.tsx`). Note: existing 9-digit submissions must be normalized/migrated before enforcing this in production.

Testing:

- `npm run lint` ✅
- `npm run build` ✅

---

## 2025-12-11 - Penny List rescue, validation hardening, thumbnails, main-only workflow

Objective: Make Penny List and Report Find a cohesive, trustworthy core product, tighten data quality, refresh visual system, and simplify deployment to main-only.

What changed:

- Phase A: Added shared SKU validation (`lib/sku.ts`) with 6/9/10-digit rules, garbage/repeating-pattern rejection, server honeypot and rate limiting in `app/api/submit-find/route.ts`, improved client inline SKU errors in `app/report-find/page.tsx`, simplified Penny List copy and reduced disclaimers, removed Penny Alerts UI, and improved scan UX.
- Phase B: Refreshed light palette to neutral zinc scale in `app/globals.css`, replaced logo with clean “PennyCentral” wordmark in `components/navbar.tsx`, made Penny List the first nav/home CTA, and updated footer links.
- Phase C: Added thumbnails (existing photo URLs plus consistent placeholder) to Penny List cards/table, added “Has photo” filter, and created SEO-friendly SKU detail pages at `/sku/[sku]` linked from the list.

Testing:

- `npm run lint` ✅
- `npm run build` ✅

---

## 2025-12-11 - CTA polish, hover balance, and accessibility checks

Objective: Reduce visual harshness, balance hover lift across CTAs, tighten copy, and ensure analytics and accessibility remain intact.

What changed:

- Softened hero and card hover states (lighter lift, balanced shadows) across light/dark; adjusted CTA base colors to avoid bright glare.
- Toned down Penny List “Submit a Find” and “Subscribe to Alerts” lift; updated CTA copy (coffee = optional tip; BeFrugal = supports at no extra cost).
- Added data-cta attribute and balanced BeFrugal CTA colors on About page; kept GA tag in `app/layout.tsx` head unchanged.

Testing:

- `npm run lint` ✅
- `npm run build` ✅
- Contrast: `npx cross-env BASE_URL=http://localhost:3001 node scripts/check-contrast.js` ✅
- Axe: `npx @axe-core/cli http://localhost:3001 --save reports/axe-report.json --exit` ✅

---

## 2025-12-10 - Dark Mode Readability Remediation (in progress)

Objective: Reduce eye strain in dark mode and tighten WCAG conformance on the Penny List page.

What changed:

- Updated dark palette to #121212 base with tonal elevations through #3A3A3A.
- Raised border contrast to >=3:1 on base and cards; text remains AAA.
- Enforced minimum font weight 400 in dark mode; body line height increased to 1.7.
- Penny list cards now use elevation tokens and corrected status color binding.
- Design system doc realigned to the new dark palette; elevation guide refreshed.

Evidence (measured):

- Text primary: 13.6:1 on #121212, 12.7:1 on #1A1A1A.
- Borders: 3.5 to 4.7:1 on base, 3.3 to 4.4:1 on cards.
- CTA primary: 7.4:1 on base; status success: 10.8:1 on base.

Testing:

- `npm run build` ✅
- `npm run lint` ✅

---

## 2025-12-10 - MCP documentation and testing infrastructure

Objective: Create comprehensive documentation for MCP servers, auto-loading, testing procedures, and stopping rules to maximize future agent productivity.

What changed:

- New docs created:
  - `.ai/MCP_SERVERS.md` (full MCP reference for filesystem, github, git, chrome-devtools, pylance, sequential-thinking)
  - `.ai/TESTING_CHECKLIST.md` (QA procedures: build/lint/tests, devices, breakpoints, performance, accessibility, cross-browser, SEO, production verification)
  - `.ai/STOPPING_RULES.md` (stop criteria, quality gates, anti-over-optimization guardrails)
- Docs updated:
  - `.ai/AI-TOOLS-SETUP.md` (comprehensive MCP section)
  - `.ai/USAGE.md` (MCP tools section)
  - `.ai/QUICKSTART.md` (Power Tools: MCP Servers)
  - `.ai/README.md` (file structure and AI assistant reference updated)
  - `SKILLS.md` (expanded MCP guidance and anti-patterns)

Status: Complete - MCPs documented, testing procedures established, stopping rules clarified.

---

## 2025-12-10 - Penny List Phase 1: UI polish and testing

Objective: Enhance table and card readability, verify validation logic, and add test coverage.

What changed:

- Table enhancements:
  - Added `.line-clamp-2-table` CSS utility for 2-line wrapping.
  - Rebalanced column widths and improved line-heights for readability.
  - Improved contrast for SKUs, badges, and chips using zinc palette.
  - Added tabular-nums to numeric columns.
  - Added mobile scroll hint banner for horizontal table scrolling.
- Card layout:
  - Increased font-weight on dates/times for scannability.
  - Standardized badge padding and improved line-heights.
  - Updated SKU displays with zinc backgrounds and borders.
- Testing and quality:
  - Added edge case tests for freshness metrics and validation.
  - Fixed CSS syntax and formatting issues.
  - Production build verified.

Files modified:

- `components/penny-list-table.tsx`
- `components/penny-list-card.tsx`
- `app/globals.css`
- `tests/penny-list-utils.test.ts`

Status: Phase 1 complete.

---

## 2025-12-09 - Support CTA messaging refresh

What changed:

- Replaced “Leave a Tip” references with “Buy Me a Coffee” across homepage, About, footer, SupportAndCashbackCard, and global support copy.
- Reworded BeFrugal explanations to clarify user benefit and referral bonus.
- Updated Resources page support blurb and AGENTS instructions to match new terminology.

---

## 2024-12-04 - Design system overhaul: Slate Steel

What changed:

- Color palette change: replaced prior palette with Slate Steel.
  - Accent colors changed to slate-600/700 for a more neutral, professional appearance per user feedback.
  - No orange, copper, brown, or purple colors used.
- Files updated:
  - `globals.css` (CSS variable rewrite)
  - `components/navbar.tsx` (inline SVG penny logo)
  - `app/store-finder/page.tsx` (map layout changes, removed tips section)
  - `components/store-map.tsx` (marker colors updated)
  - `app/page.tsx`, `app/about/page.tsx`, `app/resources/page.tsx`, `app/trip-tracker/page.tsx`, `app/cashback/page.tsx`
  - `components/SupportAndCashbackCard.tsx`
  - `components/ui/button.tsx`
  - `AGENTS.md`, `SKILLS.md`

Result: Clean, neutral, professional design.

---

## 2024-12-03 - Design system refinement: 60-30-10 rule

What changed:

- Implemented 60-30-10 visual hierarchy:
  - 60% neutral backgrounds and text
  - 30% brand accents (gunmetal and copper)
  - 10% CTA blue for primary actions only
- Homepage redesign (hero, how-it-works, support section, tools, community).
- Footer redesign (4-column layout, dark background, prominent support links).
- Component updates across Navbar, SupportAndCashbackCard, About page, buttons, and token config.
- Monetization: tip and affiliate links placed across homepage, footer, and key pages.

Result: Cleaner hierarchy and improved accessibility.

---

## 2024-12-03 - Store Finder map popup dark mode fix

What changed:

- Fixed map popup styling in dark mode via `globals.css` overrides and `store-map.tsx` popup content updates.
- Increased `autoPanPadding` to reduce popup clipping near edges.
- Updated `SKILLS.md` Cashback description for clarity.

Result: Uniform popup appearance in light and dark modes.

---

## 2024-12-02 - Project Brain: SKILLS.md

What changed:

- Created `SKILLS.md` as a compact reference for AI agents:
  - Technical skills table (Next.js, TypeScript, Tailwind, Leaflet, etc.)
  - Domain skills table (penny items, store finder, trip tracker, value guidance)
  - MCP server guidance with best practices and anti-patterns
  - Agent playbook to start sessions efficiently
- Updated `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` to reduce duplication and point to SKILLS.md.

Result: Reduced context bloat and centralized agent guidance.

---

## 2024-12-01 - Repo cleanup and documentation alignment

What changed:

- Deleted empty `mcp-proxy/` folder and removed Windows `nul` artifact file; verified build succeeds.
- Added sections to `AGENTS.md` (skills/tools, handling unclear requests).
- Created `TO_DELETE.md` and an archive directory for legacy experiments.
- Updated `PROJECT_ROADMAP.md` and added `CHANGELOG.md` to documentation structure.
- Created `/cashback` page and integrated BeFrugal support card into multiple pages.
- Improved map popup UX (autopan, contrast, spacing) and added Leaflet popup CSS overrides.
- Configured VS Code developer tooling (format-on-save, Prettier/ESLint integration).

---

## Earlier work

- Initial site launch with Penny Guide, Store Finder, Trip Tracker, Resources, About pages.
- Store data integration with 2000+ Home Depot locations.
- Dark mode support and mobile responsiveness.
