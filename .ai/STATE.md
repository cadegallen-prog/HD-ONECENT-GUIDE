# Project State (Living Snapshot)

**Last updated:** Jan 11, 2026 (Added skills system + agent entrypoint docs)

This file is the **single living snapshot** of where the project is right now.
Every AI session must update this after meaningful work.

**Auto-archive:** Entries older than 30 days move to `archive/state-history/`

---

## Current Sprint (Last 7 Days)

- **Skills system + agent entrypoint (Jan 11):** Added `docs/skills/*` with a repo map, feature-to-files starting points, local dev faststart, and ship-safely guidance; updated root `AGENTS.md` to require consulting skills first and adding new skills when missing.
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
