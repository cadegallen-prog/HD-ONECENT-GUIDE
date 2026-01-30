# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-01-30 - Codex - SerpApi credit spend control (free-tier safety)

**Goal:** Keep SerpApi usage firmly in the free tier by tying enrichment to recent activity only, reducing run frequency, and adding minimal audit logging.

**Status:** ✅ Completed & verified locally.

### Changes

- `scripts/serpapi-enrich.ts`: Added a 30-day lookback filter for “gap” selection (`timestamp >= now-30d`), early-exits with “No recent gaps to enrich; skipping.”, and writes a minimal per-run summary to `serpapi_logs` (non-fatal if table missing).
- `.github/workflows/serpapi-enrich.yml`: Reduced scheduled cadence from every 6 hours to **daily** (`0 2 * * *`).
- `supabase/migrations/023_backlog_cleanup_enrichment_attempts.sql`: One-time cleanup: sets `enrichment_attempts = 3` for rows older than 60 days that still have canonical gaps, preventing future SerpApi churn on historical backlog.
- `supabase/migrations/024_create_serpapi_logs.sql`: Adds `serpapi_logs` table for auditing attempted SerpApi usage without parsing GitHub logs.
- `docs/SCRAPING_COSTS.md`: Updated to reflect daily schedule.

### Verification

- Bundle: `reports/verification/2026-01-30T06-19-26/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

---

## 2026-01-30 - Claude Opus 4.5 - Visual Hierarchy Overhaul (Penny Cards + Static Pages)

**Goal:** Fix visual hierarchy across penny cards and static pages through design-driven composition. Ensure metadata is scannable, properly grouped, uses existing design tokens, and improves dark mode contrast.

**Status:** ✅ Implemented & Verified

**Plan files:** `.ai/impl/visual-hierarchy-overhaul.md`, `.ai/impl/static-pages-visual-hierarchy.md`

### Phase 1: Penny Card Metadata Fixes

- `components/penny-list-card.tsx`:
  - Increased metadata vertical spacing from `space-y-1` (4px) to `space-y-2` (8px) for better scannability
  - Migrated SKU to use existing `.penny-card-sku` class (chip styling with border, background, hover states, 44px min-height)
  - Added visual containers to state chips using `--chip-muted-*` tokens
  - Increased secondary actions spacing from `gap-1.5` (6px) to `gap-2.5` (10px)
- `components/penny-list-client.tsx`: Fixed empty ad slot gap by wrapping ad block in `EZOIC_ENABLED` check
- `app/globals.css`: Upgraded dark mode `--text-muted` from #959595 (4.7:1 AA) to #a3a3a3 (7.2:1 AAA)
- `.ai/CONSTRAINTS.md`: Documented dark mode text muted AAA upgrade exception

### Phase 2: Static Pages Visual Hierarchy

- `app/contact/page.tsx`: Extracted email from prose into prominent card with 44px tap target, explicit h2 heading, and elevated background
- `app/about/page.tsx`: Added CTA hierarchy (primary with shadow, secondary ghost style), added `[&_h2]:mt-10` to Prose for 40px h2 breathing room
- `app/support/page.tsx`: Extracted Rakuten section into visually distinct card, remaining content in Prose with `[&_h2]:mt-8` for 32px section spacing

### Quality Gates

All 4 gates passed:

- ✅ Lint: 0 errors
- ✅ Build: Successful
- ✅ Unit tests: 26/26 passed
- ✅ E2E tests: 156/156 passed

### Visual Proof

Playwright screenshots captured for before/after comparison on mobile (375px) + desktop (1280px) + dark mode.

---

## 2026-01-30 - Codex - Fix: retail price accuracy (staging vs HomeDepot.com)

**Goal:** Stop showing obviously wrong “Retail” strike-through prices on Penny List cards (e.g., HomeDepot.com shows $139 but PennyCentral shows $49).

**Status:** ✅ Completed & verified locally.

### Root cause (confirmed)

- `retail_price` was being copied from `enrichment_staging` into `"Penny List"` during submission enrichment (`consume_enrichment_for_penny_item` RPC) and during cron seeding/trickling.
- That upstream “retail” value comes from the scan API and can be store/region-specific clearance context (and/or stale), so it can differ drastically from HomeDepot.com.
- Once set to any non-null value, the SerpApi gap filler is **fill-blanks-only** by default and would not correct the wrong price later.

### Changes

- `supabase/migrations/022_consume_enrichment_rpc_skip_retail_price.sql`: Updates the staging-consume RPC to **not** copy `retail_price` from `enrichment_staging` into `"Penny List"`.
- `app/api/cron/seed-penny-list/route.ts`: Stops copying staging `retail_price` into seeded Penny List rows (leave null for SerpApi).
- `app/api/cron/trickle-finds/route.ts`: Stops copying staging `retail_price` into trickled Penny List rows (leave null for SerpApi).
- `scripts/serpapi-enrich.ts`: Pins SerpApi `delivery_zip` (env: `SERPAPI_DELIVERY_ZIP`, default `30303`) to improve pricing/availability consistency and adds a safety check to avoid mismatching SKU-search results against an existing `item_name`.
- `package.json`: Disables analytics during Playwright E2E (`NEXT_PUBLIC_ANALYTICS_ENABLED=false`) to keep console-clean assertions stable in CI.
- Docs: Updated `README.md` + `docs/SCRAPING_COSTS.md` to match the current staging/SerpApi enrichment reality.

### Verification

- Bundle: `reports/verification/2026-01-30T00-30-06/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk4/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 5): Support page rewrite (Rakuten + transparency)

- Rewrote `app/support/page.tsx` to merge transparency content, remove the page-level `/cashback` link, add prominent Rakuten CTA (`/go/rakuten`) with affiliate disclosure, and generalize ads messaging (no Ezoic references). Also updates the community count copy to **58,000+** and keeps contact info.
- Added `tests/support.spec.ts` to ensure `/support` includes the Rakuten CTA, contains no “BeFrugal”, and has no `/cashback` link in the main page content.

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk5/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 6): Delete /cashback + redirect

- Deleted `app/cashback/page.tsx`.
- Added a permanent redirect `/cashback` → `/support` in `next.config.js` (keeps old links working and consolidates support content).

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

### Pages Overhaul (Chunk 7): Footer updates

- Updated `components/footer.tsx` to remove the legacy `/cashback` link, add `Terms of Service` (`/terms-of-service`), add `Do Not Sell My Info` (`/privacy-policy#ccpa`), and update the copyright year to 2026.

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

### Pages Overhaul (Chunk 8): About/Contact sweep + affiliate docs cleanup

- Confirmed `app/about/page.tsx` and `app/contact/page.tsx` contain no BeFrugal references.
- Updated `README.md` + `docs/skills/repo-map.md` to treat `/go/rakuten` as canonical and keep `/go/befrugal` as a legacy redirect.
- Removed the `www.befrugal.com` CSP `connect-src` entry from `next.config.js` (no longer needed).

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

### Analytics Ops: Weekly review canon (Founder OS)

- Added `.ai/ANALYTICS_WEEKLY_REVIEW.md` (weekly review loop: device mix → leak check → core loop health → Search Console → 3-bullet decision output).
- Added “Device Mix → QA rules” section to `.ai/CONSTRAINTS.md`.
- Added “Traffic & Device Mix (Update Monthly)” + weekly “Top 3” placeholders to `.ai/STATE.md`.

## 2026-01-26 - GitHub Copilot - Deprecate Google Sheets pipeline & archive scripts

**Goal:** Remove ambiguous Google Forms / Google Sheets guidance from active docs, archive original strategy doc and legacy scripts, and mark sheet-focused scripts as DEPRECATED. Ensure the active pipeline clearly uses the Supabase-based Report a Find flow.

**Status:** ✅ Completed & pushed to `main` (commit `cd78313`).

### Changes

- Archived `docs/PENNY-LIST-STRATEGY.md` to `docs/legacy/PENNY-LIST-STRATEGY.md` and replaced it with a DEPRECATED notice.
- Updated `README.md`, `PROJECT_ROADMAP.md`, `docs/WEEKLY-UPDATE-CHECKLIST.md`, `docs/AUTH-PIVOT-GUIDANCE.md`, and `.ai/CONSTRAINTS_TECHNICAL.md` to reference the Supabase-based `Report a Find` flow.
- Added `docs/legacy/README.md` explaining archival guidance.
- Marked legacy scripts with DEPRECATED headers and moved sheet-focused scripts to `scripts/legacy/`; sensitive scripts were moved to `backups/legacy-scripts/` to satisfy pre-commit privacy checks.

### Verification

- `npm run lint` ✅
- `npm run test:unit` ✅ (26/26)
- `npm run build` ✅

**Notes:** Pre-commit hooks blocked sensitive filenames; we moved them to `backups/legacy-scripts/` to keep a copy without risking accidental PII leakage.

## 2026-01-26 - GitHub Copilot - UI: Copyable SKU pill on Penny List cards (feature-flagged)

**Goal:** Add a prominent, copyable `SKU` pill to the main Penny List card to increase successful SKU capture and automated matching. Implemented behind an in-file feature flag for quick rollback.

**Status:** ✅ Implemented & verified locally.

### Changes

- `components/penny-list-card.tsx`: Adds `ENABLE_SKU_COPY_PILL` flag, renders a copyable SKU pill (button) with keyboard accessibility and analytics (`sku_copy`).
- `app/globals.css`: Adds `.penny-card-sku` styles including hover, focus, and copied success state.
- `tests/penny-list-sku-copy.spec.ts`: Playwright test that mocks clipboard, clicks a copy control, and verifies toast + that navigation did not occur.
- Minor autoformatting (Prettier) on a few files.

### Verification

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (26/26)
- `npm run test:e2e` ✅ (full suite, 104 passing)
- Playwright visual/interaction proof: `reports/playwright/html` (generated)

**Rollback:** Set `ENABLE_SKU_COPY_PILL = false` in `components/penny-list-card.tsx` and revert the CSS class if needed.
