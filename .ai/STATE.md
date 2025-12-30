# Project State (Living Snapshot)

**Last updated:** Dec 28, 2025 (Penny thumbnail styling polish)
This file is the **single living snapshot** of where the project is right now.
Every AI session must update this after meaningful work.

---

## 1. Where We Are

- **Recent focus (Dec 28): Penny List identifiers row**
  - Added a compact “Identifiers” row under the SKU pill in `components/penny-list-card.tsx`.
  - Mobile now uses a `<details>` toggle to keep identifiers from cluttering the card.
  - Updated `data/penny-list.json` with a sample model/UPC for previewing the UI.
- **Site:** live at https://www.pennycentral.com (Preferred canonical domain)
- **Current policy (Dec 19):** The Verified Pennies feature was removed.
  - `/verified-pennies` permanently redirects to `/penny-list`
  - No repo-stored verified datasets/scripts (privacy)
  - SKU pages + sitemap derive from the Penny List only
- **Recent focus (Dec 28): Penny List highlights cleanup**
  - Removed the "Trending SKUs" block and the "What's New" module, keeping "Hot Right Now" as the single highlight on `/penny-list`.
  - Analytics now reports `hotItemsCount` with the Penny List view event.
  - Verification status: lint/build passed; unit + e2e tests failed in this environment (see SESSION_LOG).
- **Recent focus (Dec 28): SKU identifiers clarity**
  - Grouped SKU, internet number, UPC, and model into a single Identifiers cluster on SKU pages
  - Renamed Internet # label to clarify it is the Home Depot listing identifier
  - Removed duplicate SKU display so it appears only once in the identifiers block
- **Recent focus (Dec 28): Penny list grid density tweak**
  - Penny list card grid now expands to four columns at xl to improve desktop density while keeping spacing and touch targets consistent.
- **Recent focus (Dec 28): Penny thumbnail styling polish**
  - Strengthened thumbnail background to `var(--bg-tertiary)` with a stronger border token and inset shadow for better separation.
  - Switched thumbnails to `object-contain` with padding so item edges stop over the background.
- **Recent focus (Dec 28): PR-3 Auth + Personal Lists + Sharing**
  - Magic-link login flow at `/login` (Supabase OTP) with callback at `/auth/callback`; middleware refreshes sessions and gates `/lists`.
  - Penny List cards now include “Save to list” via `AddToListButton` (smart add + picker). Personal lists live at `/lists`; list detail `/lists/[id]` supports priority/found status toggles, in-store mode, search/filter, and share links.
  - Public shared list view at `/s/[token]` with “Save a copy” fork CTA. Analytics events added for add-to-list, sharing, and in-store mode toggles.
  - Supabase migrations added: `001_create_lists_tables.sql`, `002_create_list_shares.sql`, `003_security_search_path.sql` (RLS, share RPCs, search_path hardening). New Supabase browser/server clients in `lib/supabase/`.
- **Recent focus (Dec 28): Penny list card typography hierarchy**
  - Added optional brand line above item titles, shifted titles to 2-line clamps, and tuned mobile sizing for `PennyListCard` + `PennyListCardCompact` to keep 8-pt spacing consistent.
- **Recent focus (Dec 28): SKU page identifiers polish**
  - Removed the duplicate SKU line and rebuilt the identifiers section into a clean, aligned grid with a helper note clarifying the Internet #.
- **Recent focus (Dec 28): Penny List CTA cleanup**
  - Removed the PayPal tip CTA from the Penny List.
  - Moved the BeFrugal affiliate CTA lower on the page (near the footer card) while keeping `affiliate_click` tracking.
- **Recent focus (Dec 28): Scraping auto-enrich workflow**
  - Added `scripts/auto-enrich.ts` + `SCRAPING_IMPROVEMENT_PLAN.md`; reads `data/skus-to-enrich.txt`, runs headed Playwright scrape, writes `.local/enrichment-upload.csv`. New npm script `npm run enrich:auto`; input/output paths ignored by git.
  - Added shared `formatSkuForDisplay` utility and upgraded SKU copy UX (toasts, consistent formatting) across cards, tables, SKU page, and report form; ensured new UI uses CSS variables (no raw Tailwind colors).
- **Recent focus (Dec 27): PR-2: Report Find Prefill + Validation Hardening**
  - When SKU is prefilled via query params, it's now read-only by default with an "Edit" button to unlock
  - Added loading skeleton for better SSR/hydration (no blank page before client hydration)
  - Updated E2E tests for new locked SKU behavior
  - PR-1 and PR-2 of 6-PR roadmap complete
- **Recent focus (Dec 28): Penny thumbnail styling polish**
  - Strengthened thumbnail background to `var(--bg-tertiary)` with stronger border token and inset shadow for better separation
  - Switched images to `object-contain` with padding to prevent edges blending into the background
- **Recent focus (Dec 27): MCP availability + env wiring**
  - User-level env vars set for `SUPABASE_URL`, `SUPABASE_ACCESS_TOKEN`, `VERCEL_API_KEY`.
  - `.claude/settings.json` wired for Supabase env vars.
  - Vercel MCP disabled across Codex/Claude/VS Code to reduce tool noise; re-enable only when needed.
  - Restart VS Code/Codex after env changes so MCPs can see the user-level vars.
- **Recent focus (Dec 27): PR-1: Penny List Cards + Copy UX**
  - SKU pill is now tappable for one-tap copy to clipboard (no separate button needed)
  - Toast notifications show "Copied SKU XXX-XXX" on success using Sonner
  - `copyToClipboard` utility handles iOS Safari + Android with fallback to `execCommand('copy')`
  - 44px minimum touch targets for mobile accessibility
  - `stopPropagation()` prevents accidental navigation when tapping SKU to copy
  - 6-PR roadmap planned: Copy UX → Report Find hardening → Auth + Personal Lists → Sharing → In-Store Mode → Analytics
- **Recent focus (Dec 26): Penny List UI polish (filters + cards)**
  - Sticky filter bar no longer clips under the navbar while scrolling
  - Items-per-page dropdown chevron no longer overlaps the value
  - Removed tier/commonness UI and redundant "Community lead" label for cleaner cards/table
  - Enhanced `scripts/ai-proof.ts` to capture both full-page and scrolled UI screenshots (light + dark)
- **Recent focus (Dec 26):** Documentation cleanup
  - Deleted 11 deprecated files (old playbooks, Google Form docs, outdated MCP docs)
  - Updated all docs to reflect Supabase as data source (was Google Sheets)
  - Unified MCP configuration across Claude Code, Copilot, and Codex
  - Created agent system (AGENT_POOL.md, ORCHESTRATION.md, AGENT_QUICKREF.md)
  - Pre-commit hooks via Husky (security:scan + lint:colors)
- **Recent focus (Dec 26):** Session 2: Screenshot Automation + Commands complete
  - Implemented `scripts/ai-proof.ts` (automated screenshot capture for light/dark mode UI verification)
  - Created `.claude/commands/` directory with slash commands: doctor, verify, proof
  - Added npm script `ai:proof` to package.json
  - Tested successfully on Windows with MSYS_NO_PATHCONV=1 workaround for Git bash path conversion
  - Updated `.ai/AI_AUTOMATION_SPECS.md` to mark Session 2 complete
- **Recent focus (Dec 26):** Session 1: Core Automation Scripts complete
  - Implemented `scripts/ai-doctor.ts` (pre-flight health check: port 3001, env vars, Playwright, Node version)
  - Implemented `scripts/ai-verify.ts` (one-command verification bundle: runs all 4 quality gates, saves proof to `reports/verification/`)
  - Added npm scripts `ai:doctor` and `ai:verify` to package.json
  - All 4 quality gates passing (lint, build, unit:21/21, e2e:64/64)
  - Updated `.ai/AI_AUTOMATION_SPECS.md` to mark Session 1 complete
- **Recent focus (Dec 26):** AI enablement blueprint + cross-agent entrypoint wiring
  - Added `.ai/AI_ENABLEMENT_BLUEPRINT.md` and linked it from `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `README.md`.
  - Updated `.ai/AI-TOOLS-SETUP.md` to point to the canonical read order (root README) and reference the blueprint for workflow/tooling sessions.
- **Recent focus (Dec 26):** Enablement prompt pack for multi-session execution
  - Added `.ai/enablement-prompts/README.md` plus prompt files for tooling inventory, doc alignment, proof workflow, automation scripts, Playwright harness, skills/commands, doc hygiene, cleanup audit, and idea pipeline.
  - Linked the prompt pack from `.ai/AI_ENABLEMENT_BLUEPRINT.md` for discoverability.
- **Recent focus (Dec 26):** Penny List SSR now respects URL params (reload/bookmark correctness)
  - `app/penny-list/page.tsx` now computes the initial page slice from URL params (`state`, `photo`, `q`, `sort`, `days`, `page`, `perPage`).
  - Proof: `reports/verification/2025-12-26-proof.txt` (lint/build/unit/e2e).
- **Recent focus (Dec 21, session 11):** OG images switched to static for Facebook reliability
  - **Problem:** Dynamic OG generation via Edge runtime kept failing on Facebook after 5-10 iterations (timeouts, font issues, zero-byte responses)
  - **Solution:** Hybrid static + dynamic approach - main pages use static PNGs, SKU pages keep dynamic with caching enabled
  - **Implementation:** Created Playwright script (`scripts/generate-og-images-playwright.ts`) that screenshots the current OG endpoint to generate 5 static PNGs (homepage, penny-list, report-find, store-finder, guide)
  - **Static images:** Saved in `public/og/*.png` (48-52KB each, well under 300KB recommendation)
  - **Code changes:** Modified `lib/og.ts` to return static paths for main pages (`/og/{page}.png`), fall back to dynamic API for other pages
  - **Caching enabled:** Updated `app/api/og/route.tsx` to enable 24hr caching (`revalidate=86400`) for SKU page OG images
  - **Reliability:** Static files are bulletproof - no generation time, no font issues, no Edge runtime failures, instant CDN caching
  - All 4 quality gates passing (lint, build [885 pages], test:unit [9/9], test:e2e [32/32])
- **Recent focus (Dec 23):** OG images rebuilt to match explicit left-aligned UI layout
  - **Goal:** Replace centered poster layout with a top-left, content-first hierarchy and page-specific copy
  - **Change:** Reworked `app/api/og/route.tsx` to use a left-aligned column, favicon + brand row, thin separator, headline/subhead, URL bottom-right
  - **Variants:** Added per-page headline/subhead mapping in `lib/og.ts` and wired the Playwright generator to pass page + subhead
  - **Output:** Regenerated static OG images in `public/og/*.png` via `scripts/generate-og-images-playwright.ts`
  - All 4 quality gates passing (lint, build, test:unit, test:e2e)
- **Recent focus (Dec 23):** OG polish pass (coin quality + one-line headline)
  - **Goal:** Improve perceived authority without overpromising and keep homepage headline on one line by default
  - **Change:** Replaced the zoomed favicon with a cleaner inlined coin SVG (no micro-text) and added “shrink-to-fit” headline sizing before wrapping
  - **Output:** Regenerated static OG images in `public/og/*.png`
  - All 4 quality gates passing (lint, build, test:unit, test:e2e)
- **Recent focus (Dec 23):** OG image design refreshed + static PNGs regenerated
  - **Goal:** Improve OG CTR and brand match (bold PennyCentral, underline in correct place, centered layout)
  - **Change:** Updated OG template (`app/api/og/route.tsx`) to match the new centered design and added a subtle penny watermark
  - **Output:** Regenerated static OG images in `public/og/*.png` via `scripts/generate-og-images-playwright.ts`
  - All 4 quality gates passing (lint, build, test:unit, test:e2e)
- **Recent focus (Dec 24):** Keep `api/og` under Vercel’s 1 MB edge-function cap
  - **Problem:** Vercel deployment logs showed `api/og` was 1.05 MB due to the embedded Inter font + background base64 data.
  - **Solution:** Removed the inline base64 helpers, now fetch Inter 400/500/700 at runtime (`lib/og-fonts.ts`) and load the background from `/og/pennycentral-og-fixed-1200x630-balanced.jpg`. Updated the OG route and generation script to match the new flow.
  - **Verification:** `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.
  - **Artifacts:** Tracked the actual `public/og/pennycentral-og-fixed-1200x630-balanced.{jpg,png}` assets so the background URL resolves on Vercel and kept the `.vscode/tasks.json` dev task synced; the `test-results/og/` folder stays untracked for screenshot proofing.
- **Recent focus (Dec 25):** Supabase RLS hardening plan + fallback guardrails
  - Documented RLS policy set for `Penny List` (anon SELECT via `penny_list_public` view only; anon INSERT with SKU/state/quantity checks; explicit deny on UPDATE/DELETE) at `docs/supabase-rls.md` including rollback-able verification steps.
  - Added `SUPABASE_ALLOW_SERVICE_ROLE_FALLBACK` env toggle (default allow) and logging around anon→service-role retries for both penny list reads and report-find writes; TODOs left in code to remove fallback once RLS is live.
  - Next action: apply the SQL in Supabase, run the verification block, then flip the fallback flag off.
- **Recent focus (Dec 25):** Admin enrichment overlay for accurate SKU metadata
  - Added `penny_item_enrichment` Supabase merge so authoritative fields (name/brand/model/UPC/image/link) override crowd rows.
  - Enrichment is optional until the table exists; missing-table errors are handled without build spam.
  - Added enrichment merge tests (override + invalid SKU ignored).
  - Documented enrichment table + RLS policy in `docs/supabase-rls.md`.
- **Recent focus (Dec 25):** Supabase migration for Penny List + Report Find
  - **Data source:** `Penny List` Supabase table (anon key currently RLS-blocked; server fetch falls back to service_role key until policies are applied).
  - **Aggregation:** Groups by `home_depot_sku_6_or_10_digits`, rolls up state counts, latest timestamp, and enrichment fields (`home_depot_url`, `internet_sku`, `image_url`). Home Depot links prefer `home_depot_url` → `internet_sku` → SKU search.
  - **Submission:** `/api/submit-find` inserts with the anon key and retries with the service role client when RLS is blocking writes; honeypot + rate limiting intact; enrichment fields stay server-controlled. Added tests for allowed fields + fallback.
  - **Security:** `lib/supabase/client.ts` is server-only (prevents accidental client-side imports of server credentials).
  - **Testing:** `npm run lint`, `npm run build` (900 pages), `npm run test:unit` (20/20), `npm run test:e2e` (64/64). Playwright screenshots: `reports/verification/sku-related-items-chromium-desktop-light.png` (and variants).
- **Recent focus (Dec 25):** Server-side pagination for Penny List
  - Moved filtering/sorting from client to server via new `/api/penny-list` endpoint.
  - Client no longer loads full dataset - fetches only the current page slice.
  - Created shared query helper (`lib/penny-list-query.ts`) for filter/sort/date-range logic.
  - API returns `{ items, total, pageCount, page, perPage }` with 60s edge caching.
  - Pagination UI (items per page dropdown, prev/next) wired to API fetches.
  - Server still computes metrics (trending, what's new, freshness stats) from full data.
  - Added unit tests for query helper (tests/penny-list-query.test.ts).
  - All 4 quality gates passing (lint, build [902 pages], test:unit [21/21], test:e2e [64/64]).
- **Previous (Dec 25):** Paginated Penny List with per-page controls
  - Added client-side pagination plus a selectable items-per-page dropdown (25/50/100, default 50) so we load only the slice the user is viewing, and filters reset to page 1 while the URL stays in sync.
  - Introduced an info bar that states "Showing X-Y of Z results" and provides accessible Previous/Next controls that guard against outdated page indexes plus the per-page selector.
- **Recent focus (Dec 24):** Report Find deep-link prefill hardening + SKU receipt copy fix
  - **Problem:** Prefill could re-apply after the user cleared fields; SKU helper text incorrectly told users to use a receipt SKU (receipt is typically UPC).
  - **Fix:** Prefill now normalizes SKU to digits-only/max-10 and only handles a given query once; SKU helper text updated and a non-blocking warning added for suspicious 10-digit IDs.
  - **Verification:** `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.
- **Recent focus (Dec 24):** 10-digit SKU prefix enforcement
  - **Rule:** 10-digit SKUs must start with `"10"` (format: `10xx-xxx-xxx`) to avoid receipt UPC confusion like “84…”.
  - **Fix:** Added to `lib/sku.ts` (single source of truth) so client + server validations stay consistent.
  - **Verification:** `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.
- **Recent focus (Dec 21, session 10):** Homepage re-prioritized for habitual engagement
  - **Data-driven decision:** Penny List gets 5-10x more traffic than Guide (analytics-confirmed)
  - **Hero buttons swapped:** "Browse Penny List" is now primary CTA (was secondary), "Report a Find" elevated from tertiary link to secondary button (PlusCircle icon)
  - **Tertiary link removed:** Eliminated "Report a Find →" link below buttons (now prominent secondary button)
  - **Tools section updated:** Replaced "Community Penny List" card with "Read the Guide" card (BookOpen icon) - removes duplicate, keeps Guide accessible
  - **Nav reordered:** Penny List | Report a Find | Guide | Store Finder | About (aligns with usage priority)
  - **Strategic rationale:** Optimize for recurring traffic (Penny List = habit loop) vs one-time reads (Guide = learn once); elevate Report to boost submissions from ~1/day to 10+/day goal
  - **Icon changes:** List icon for Penny List, PlusCircle for Report a Find (clear, intuitive)
  - **Accessibility:** Added aria-labels to hero buttons ("Browse the community penny list", "Report a new penny find")
  - All 4 quality gates passing (lint, build [882 pages], test:unit [9/9], test:e2e [32/32])
- **Recent focus (Dec 21, session 9):** OG images fixed + messaging tightened
  - Fixed broken dynamic OG generator with Google Fonts CDN + fallback to system fonts
  - Improved OG layout for crop survival across Facebook/Discord/X (vertical safe zone, larger fonts)
  - Added "Home Depot" trust anchor to all OG headlines for clarity and legitimacy
  - Tightened homepage H1 from "Find Home Depot Penny Items ($0.01)" → "Find Home Depot Penny Items" (removed redundant parenthetical)
  - Simplified subhead from "The ultimate penny guide + live lists to help you hunt smarter." → "Guide + community finds. 40,000 hunters strong." (social proof + brevity)
  - Replaced redundant "Already hunting?" link with "Report a Find →" in hero (reduced friction)
  - Bumped OG version to v6 to force scraper cache refresh
  - All 4 quality gates passing (lint, build [882 pages], test:unit [9/9], test:e2e [32/32])
- **Recent focus (Dec 20, session 8):** Dev server resilience + naming consistency
  - Fixed dev server infinite loop caused by expired Google Sheet URL + missing fallback
  - Added smart fallback logic to `lib/fetch-penny-data.ts` - falls back to local fixture when Google Sheet unavailable
  - Adjusted Playwright timeouts to balanced middle ground (60s server startup, 30s actions/navigation)
  - Added `data/penny-list.json` test fixture for deterministic Playwright E2E tests
  - Standardized all documentation: "Community Penny List" → "Penny List" (cleaner, less wordy)
  - Republished Google Sheet with fresh CSV URL (old URL had expired)
  - All 4 quality gates passing (lint, build [882 pages], test:unit [9/9], test:e2e [32/32])
- **Recent focus (Dec 20, session 7):** OG image font embedding for brand consistency
  - Embedded Inter variable WOFF2 font in `/api/og` ImageResponse to match site hero logo typography.
  - Updated OG layout to prioritize Inter in font stack, centered "PennyCentral" brand and headline.
  - Bumped OG version to v=5 to force social media cache refresh.
  - All 4 quality gates passing (lint, build, test:unit, test:e2e - 32/32 tests); local OG endpoint generates images successfully.
  - Canonicalized sheet headers to `IMAGE URL` and `INTERNET SKU` (legacy photo/upload headers removed).
  - Parser maps those headers, reuses the first non-empty image per SKU, and optionally overlays a dedicated enrichment tab via `GOOGLE_SHEET_ENRICHMENT_URL` without overwriting community rows.
  - Submit API strips tampered enrichment fields and forces blank IMAGE/INTERNET columns on community submissions.
  - Penny list thumbnails now render the placeholder asset when IMAGE URL is missing; Home Depot links prefer INTERNET SKU and fall back to SKU search.
  - Added `scripts/enrichment-json-to-csv.ts` plus docs for Cade’s bookmark JSON → Sheet import flow.
  - Privacy cleanup: removed tracked local-path artifacts and removed committed Google Form short-links.
- **Recent focus (Dec 18 PM):** Massive SEO Expansion (500+ Dynamic SKU Pages)
  - Transformed `/sku/[sku]` from a stub into a robust, SEO-optimized product detail page.
  - Implemented `generateStaticParams` to pre-render 533 unique SKU pages (SSG).
  - Added `Product` JSON-LD structured data and dynamic metadata for every SKU to capture long-tail search traffic.
  - Updated `app/sitemap.ts` to dynamically include all 500+ SKU pages.
  - Refactored Penny List cards to link internally to SKU pages instead of externally to Home Depot.
  - All 4 quality gates passing (lint, build, test:unit, test:e2e - 40/40 tests).
- **Recent focus (Dec 18 late):** Post-SKU uplift (internal recirculation + trust)
  - Added related SKUs on SKU pages (brand/overall fallbacks) to keep users on-site.
  - Added trending SKUs block to `/penny-list` (community reports).
  - Surfaced trust signals on SKU pages (freshness badge).
  - All 4 quality gates passing after changes (lint, build, test:unit, test:e2e - 40/40).
- **Recent focus (Dec 18 late):** Community-first refinement (less noise, more digestible)
  - Penny List time window filter is now month-based (1/3/6/12 months) with default = 6 months.
  - Freshness badge remains a trust signal on SKU pages.
  - All 4 quality gates passing after changes (lint, build, test:unit, test:e2e - 40/40).
- **Recent focus (Dec 19, session 2):** Internet SKU integration
  - Added `internetNumber` field to `PennyItem` type in `lib/fetch-penny-data.ts`
  - Added field aliases for parsing `internetSku` column from Google Sheet CSV
  - Updated SKU page (`app/sku/[sku]/page.tsx`) to pass `internetNumber` to `getHomeDepotProductUrl()`
  - Updated penny-list-table to use `internetNumber` for HD links
  - Flow: when Internet SKU exists, HD links go to `/p/{internetNumber}` (direct product page); otherwise falls back to `/s/{sku}` (search)
  - All 4 quality gates passing (lint, build, test:unit, test:e2e - 32/32 tests)
- **Recent focus (Dec 19, session 3):** Verified backup merge tooling
  - Added `scripts/merge-verified-backup.py` to upsert verified backup into consolidated CSV with dedupe `(sku + contributor_id)` and fill-blanks-only enrichment (photos, internetSku, brand/model).
  - Added optional GA purchase-date enrichment via `--purchase-history` (fills blank `Purchase Date` for `Cade (GA)` using latest purchase per SKU from the processed purchase-history CSV).
  - Notes now store `Brand=...; Model=...` (no public "Verified" label); verification kept backend-only for possible future use.
  - Regenerated `.local/merged-sheet-import.csv` plus headerless import for Sheets (898 rows) and audit log; all gates passing post-merge (lint, build, test:unit, test:e2e 32/32).
- **Recent focus (Dec 19, session 4):** Sheet image URL aggregation hardening
  - Updated `lib/fetch-penny-data.ts` to fill `imageUrl` from any row for a SKU (not only the first row), so product thumbnails still show when a later row contains the image URL.
- **Recent focus (Dec 20):** Sheet header + import alignment hardening
  - Hardened `lib/fetch-penny-data.ts` field aliases so thumbnails and `internetSku` still parse when header cells include clarifying suffixes like `(photo URL)` and `(optional, for better HD links)`.
  - Clarified which `.local/merged-sheet-import*.noheader.csv` file to paste depending on whether the Sheet still has an `Email Address` column (even if hidden).
- **Recent focus (Dec 20, session 5):** Stock photo reuse + submission hardening
  - Ensured the parser matches clarified photo/internetSku headers via normalized prefix matching and added tests proving duplicate SKUs reuse the first non-empty photo URL.
  - Locked the submit-find API to `.strict()` schema parsing, strips extra fields (photo URLs/uploads), and writes a blank `Upload Photo(s) of Item / Shelf Tag / Receipt` column so only owner-managed entries contain URLs.
  - Documented the import sanity check (SKU column should stay numeric) and added `docs/HOW-CADE-ADDS-STOCK-PHOTOS.md` to detail how the owner injects stock photos once per SKU.
- **Recent focus (Dec 19, session 1):** Purchase-history import hardening (privacy-first)
  - Added a repeatable purchase-history → Google Sheet import script (no store identifiers / no buyer-identifying fields).
  - Added `.gitignore` rules to prevent committing purchase-history exports or generated import artifacts.
  - Added `--force-state` option for purchase-history exports whose filenames do not encode the state (e.g., Home Depot “Purchase*History*...” downloads).
  - Internet SKU map policy: backend-only for outbound Home Depot links, never displayed; store privately (env/Blob/Drive); always fall back to regular SKU links when a mapping is missing.
  - Upcoming: Cade will gather product image URLs via bookmarklet for newly added items; keep using private inputs only.
- **Recent focus (Dec 18 PM):** Purchase dates + freshness filtering (historical)
  - Freshness utilities remain in use for SKU trust signals.
  - Verified-purchase-date pipeline and related scripts were removed alongside the Verified Pennies feature.
- **Phase:** Stabilization + SEO Optimization
- **SEO Status:** Resolved "Redirect errors" in Google Search Console and implemented Rich Snippets.
  - **Canonical Domain:** Standardized on `www.pennycentral.com` across metadata and sitemap.
  - **Sitemap:** Cleaned to only include 10 "Real" content pages; removed 8 shortcut redirects.
  - **Redirects:** Moved shortcut logic (e.g., `/faq` -> `/guide#faq`) to `next.config.js` as permanent 301 redirects.
  - **Noindex:** Added `noindex` to `/trip-tracker` to gracefully remove defunct tool from search results.
  - **Rich Snippets:** Implemented `HowTo`, `FAQ`, and `Breadcrumb` structured data to maximize CTR and visibility.
  - **Keyword Optimization:** Refined meta titles for high-intent keywords ("Home Depot Penny List").
- **Traffic reality:** early launch volatility is normal; focus on retention loop first.
- **Recent focus (Dec 18):** Finalized tool naming and clarity.
  - Standardized labels across nav + homepage CTAs/cards.
  - Updated Penny List metadata/headings for SEO clarity; adjusted visual smoke headings and README docs.
  - CTA palette softened to reduce halation (desaturated slate blue); dark mode CTA now uses dark text on a lighter CTA surface for comfort + AAA contrast.
  - Fixed CI axe `color-contrast` failures in dark mode by removing a global “force white text on CTA” override; CTA elements now inherit `var(--cta-text)` as intended.
  - Removed redundant "Read the full guide" link on desktop (kept mobile-only).
  - Store Finder popup test wait increased to 20s for marker visibility; `npm run test:e2e` now runs serial (`--workers=1`) to avoid Windows connection-reset flake; full gates green.
- **Recent focus (Dec 18 PM):** Social sharing + quantity cleanup
  - Added social sharing buttons to penny list cards (Facebook + Copy Link)
  - Share button uses dropdown menu pattern with analytics tracking
  - Quantity field made optional in submission form (was required, now optional)
  - API updated to accept empty quantity values
  - Documentation updated to reflect actual implementation state
  - Sprint 1 visual engagement tasks marked as COMPLETED
- **Earlier (Dec 18 PM):** Merged bookmarklet data - added 21 new penny entries with images.
  - Bookmarklet extracted product data from Home Depot pages (sku, internetNumber, name, brand, model, imageUrl)
  - Merge script safely combined data with backup creation
  - Verified Pennies page shows images for 21 additional entries
  - Added an E2E test to confirm a known newly-merged SKU image loads
- **Previous focus (Dec 17):** Landing page restructured for clarity—eliminated decision fatigue by reordering sections and consolidating CTAs.
  - **Hero:** Guide-first (primary CTA), Verified Pennies (secondary), Penny List link (tertiary small link)
  - **Section order:** Hero → How It Works (moved up) → Tools → Community → Support
  - **How It Works:** Tightened copy for beginner clarity
  - **Tools:** 3 equal cards (Verified, Penny List, Store Finder); removed "(secondary tool)" label; all redundant "→" link text removed
  - **Navigation:** Guide | Verified Pennies | Penny List | Store Finder | About (Report moved to footer)
  - **Logo:** Simplified to wordmark only (removed 1¢ icon)
  - **Tests:** All 36 e2e + unit tests passing; updated navbar test to verify Guide link
- **Previous (Dec 16):** Launched Verified Pennies + refreshed homepage/nav:
- **New (Dec 16 PM):** Verified + community penny lists now use single-line ellipsis titles, Home Depot row click-through with keyboard/ARIA, quantity hidden from public views, muted badges/headers for faster scan; hero badge contrast fixed to satisfy axe.
- New curated route: `/verified-pennies` (search + brand filter + image-first grid)
- Nav prioritizes **Verified** and **Penny List**; shortened labels (**Report**, **Stores**)
- Homepage hero/tools now point first to Verified Items and the Penny List; Store Finder remains available as a secondary link
- Clarified what “Verified” means on `/verified-pennies` to set expectations (store-by-store variance, timing, proof sources)
- Restored token-only color usage across UI surfaces (removed remaining raw Tailwind palette classes and `text-white` usage)
- Enabled `next/image` external images for Home Depot CDN (`images.thdstatic.com`) via `next.config.js`

- **Current add-ons (Dec 16):** Added `docs/COLOR-SYSTEM-IMPLEMENTATION.md`, `.github/pull_request_template.md`, `lib/home-depot.ts`, and the CLI-friendly `scripts/convert-verified-data.ts`, then ignored `reports/playwright/proof/` so the screenshot proof artifacts stay local.

- **Dev stability (Dec 17):** Default dev command now uses **Webpack** to avoid Turbopack HMR flakiness with some packages (notably `lucide-react`). Use `npm run dev:turbo` only when you explicitly want to try Turbopack.
- **Test stability (Dec 17):** Fixed flaky store finder e2e test timing by waiting for stores to load before checking markers; all 36 tests now pass consistently.
- **Code Quality (Dec 17):** Resolved 14 false-positive validation problems in VS Code (CSS inline styles and ARIA attributes) using the spread operator trick; `lint` and `get_errors` are now fully green.

- **Recent focus (Dec 15 2:45 PM):** Fixed critical Store Finder UX bugs:
  - **Re-ranking bug eliminated:** Clicking a store on the map no longer re-sorts the list; ranking is now decoupled from map panning via `rankingCenterRef`
  - **Marker readability improved:** Pin numbers increased from font-size 11/12 to 13/15 with heavier stroke (4px) for better visibility
  - **ARIA compliance verified:** All 6 `aria-pressed` attributes in penny-list-filters.tsx correctly use string literals ("true"/"false")
  - **Store 106 coordinates:** Verified source data (34.007751688179, -84.56504430913) - coordinates are from upstream store directory and match JSON
- **Command reliability (Dec 15 12:30 PM):** Eliminated repeated "command hangs / loops" by removing `npx` from execution paths and hardening scripts with timeouts + process cleanup.
- Foundation Contract added at `.ai/FOUNDATION_CONTRACT.md` (tokens/Tailwind/layout/nav/gates) and `ROUTE-TREE.txt` refreshed (includes framework 404).
- Color drift ratchet in place: `npm run lint:colors` compares against `checks/lint-colors.baseline.json` (8 warnings after recent cleanup) and fails if count rises; refresh the reference only with `npm run lint:colors:update-baseline` after an intentional color change.
- Verification sweep (Dec 16): ran full quality gates and contrast audit. Results: `lint` ✅, `build` ✅, `test:unit` ✅, `test:e2e` ✅ (36/36), `check-contrast` ✅. Tailwind palette scan found raw tokens only in docs; production components use CSS variables.
- Canonical entrypoint: root `README.md` now holds the AI canon + read order; `.ai/README.md` is a stub pointing back. Read order: STATE → BACKLOG → CONTRACT + DECISION_RIGHTS → CONSTRAINTS + FOUNDATION_CONTRACT + GUARDRAILS → latest SESSION_LOG → CONTEXT (for product calls).
- Palette refresh permission: allowed later if WCAG AA minimum (target AAA) with before/after screenshots (light/dark, key routes) and lint:colors baseline refresh when intentional.
- Lighthouse policy: re-run only when visual/token/layout or performance-impacting changes ship, or during scheduled reviews; record outputs in `LIGHTHOUSE_RESULTS.md` and JSON artifacts in `test-results/` (mobile currently `lighthouse-mobile.json`).

---

## 2. What’s Working

- `/guide` and supporting strategy pages are stable and mobile‑friendly.
- `/store-finder` map hydrates cleanly; uses standard OpenStreetMap tiles (no filters) for a familiar look in light/dark; popups are compact/readable and marker pins include rank numbers for list-to-map matching.
- **Crowd Reports system is live:**
  - `/report-find` posts directly to Supabase
  - `/penny-list` fetches from Supabase, aggregates by SKU, counts by state, auto‑tiers
- **Verified Pennies removed:** `/verified-pennies` permanently redirects to `/penny-list`.
- **OpenGraph previews are solid:** `GET /api/og?headline=...&v=7` generates shareable OG images; key routes set clear, route-specific headlines. `/api/og` is now `force-dynamic` + `no-store` and no longer embeds a custom font (fixes the \"200 OK but zero-byte body\" failures seen in production).
- **Command reliability (Dec 15, 12:30 PM):**
  - All local scripts (`lint:colors`, `test:unit`, `check-axe`, `check-contrast`) now exit cleanly without hanging
  - Removed `npx` from execution paths (only in CI Playwright install and docs)
  - Hard timeouts (120s global, 30s per-page) prevent network-idle hangs on map pages
  - Created `reports/hang-audit.md` for full audit trail

---

## 2.1 CI / Quality Checks Notes

- **CI Playwright console failures fixed:** Vercel Analytics + Speed Insights scripts were being injected in `next start` (CI) but 404'ing off-Vercel, producing generic console errors that Playwright treated as failures. These scripts now only load on Vercel and never during Playwright.
- **CI `npm ci` dependency resolution fixed:** The repo no longer pins a Next canary prerelease (which broke `@vercel/analytics` peer resolution under npm); Next + `eslint-config-next` are pinned to stable `16.0.10`.
- **Store Finder coordinate "autocorrection" is dev-only:** production no longer auto-geocodes and applies coordinate corrections (can shift pins inaccurately and adds flaky network calls).
- **Verification (Dec 16 03:36):** `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`, and `npm run lint:colors` all succeeded; refreshed `reports/axe-report.json` and `reports/contrast-computed.json` to capture the latest runs.

---

## 3. Critical Integrations / Env Vars

These must be set in Vercel for the loop to work:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (for client reads)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server writes)

Testing-only flag:

- `PLAYWRIGHT=1` - enables stable local fixtures for E2E visual tests.

---

## 4. Known Risks / Watch Items

- **Cold start:** Penny List looks empty until seeded + habit forms.
- **Data quality:** duplicates and junk will rise only after volume; solve later with simple moderation if needed.
- **Hydration drift:** any shared UI change requires Playwright smoke; Store Finder popup screenshots now have a dedicated Playwright spec to capture desktop/mobile × light/dark in one run.

---

## 5. Metrics to Watch (GA Events)

Weekly check:

- `find_submit` — reports submitted.
- `penny_list_view` — list views.
- `return_visit` — repeat sessions (proxy for habit).
- `sku_copy` — hunters using SKUs in store.
- `affiliate_click`, `coffee_click` — monetization foundation health.

---

## 6. Next 1–2 High‑Leverage Moves

See `.ai/BACKLOG.md` for the ordered list.
Default rule: **AI should pull the top P0 item and propose it unless Cade gives a different GOAL.**

**Current Focus:** Sprint 1 COMPLETED. Moving to Sprint 2 (Fresh Content & Verification) - Today's Finds, verification badges, bulk import

---

## 7. Last Session Summary

- **Strategic Planning Session (Dec 15, 2025):**
  - **Goal:** Plan approach to drive habitual/recurring traffic to Penny Central
  - **Context:** User wants to incentivize daily visits, build habitual engagement, leverage crowdsourced data
  - **Outcome:** Comprehensive 3-sprint implementation plan created
  - **Key Decisions:**
    - Product images via Home Depot web scraping (not API)
    - Quantity field: keep in database, hide from display (future analytics potential)
    - Verification system: badges on unified list (NOT separate verified list)
    - Image hosting: Vercel Blob Storage (free tier, no extra cost)
    - Implementation: Claude does 95% of coding work
  - **Strategic Insights:**
    - Visual engagement (Pinterest-style) is #1 priority - text-only browsing is boring
    - Don't create separate verified list - enriches existing data, prevents fragmentation
    - Individual SKU pages = massive SEO opportunity (every SKU becomes a landing page)
    - Quantity field is unverifiable noise - real value is "found in X states on Y dates"
  - **Plan Structure:**
    - **Sprint 1 (Current):** HD image scraper, hide quantity, display images
    - **Sprint 2:** Today's Finds homepage, verification badges, import 1000+ SKU history
    - **Sprint 3:** Individual SKU pages, state landing pages (long-term SEO)
  - **Files:** Plan at `~/.claude/plans/sprightly-mixing-anchor.md`, updated `.ai/BACKLOG.md`
  - **Key learning:** Visual discovery + daily freshness = habit loop. Lean into images, fresh content, verified data.
