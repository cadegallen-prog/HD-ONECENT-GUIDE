# Project State (Living Snapshot)

**Last updated:** Jan 06, 2026 (Homepage ISR for Today's Finds + barcode/audit work)

This file is the **single living snapshot** of where the project is right now.
Every AI session must update this after meaningful work.

**Auto-archive:** Entries older than 30 days move to `archive/state-history/`

---

## Current Sprint (Last 7 Days)

- **Homepage freshness (Jan 06):** `/` now revalidates every 5 minutes so "Today's Finds" reflects Supabase enrichment fixes without redeploys.
- **Image variant performance test (Jan 06):** Thumbnails now prefer Home Depot `-64_300` image URLs for Today's Finds + Hot Right Now (where available).
- **Penny List thumbnail fallback (Jan 06):** If a THD `-64_300` image variant doesn’t exist, Penny List thumbnails fall back to `-64_1000` automatically so cards don’t show blank images.
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
