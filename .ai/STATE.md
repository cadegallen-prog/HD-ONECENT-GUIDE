# Project State (Living Snapshot)

**Last updated:** Dec 16, 2025 (Verified Pennies + Homepage/Nav refresh)  
This file is the **single living snapshot** of where the project is right now.  
Every AI session must update this after meaningful work.

---

## 1. Where We Are

- **Site:** live at https://pennycentral.com
- **Phase:** Stabilization + Community Intake + Command Reliability + Store Finder UX
- **Traffic reality:** early launch volatility is normal; focus on retention loop first.
- **Recent focus (Dec 16):** Launched Verified Pennies + refreshed homepage/nav:
  - New curated route: `/verified-pennies` (search + brand filter + image-first grid)
  - Nav prioritizes **Verified** and **Penny List**; shortened labels (**Report**, **Stores**)
  - Homepage hero/tools now point first to Verified Items and the Penny List; Store Finder remains available as a secondary link
  - Clarified what “Verified” means on `/verified-pennies` to set expectations (store-by-store variance, timing, proof sources)
  - Restored token-only color usage across UI surfaces (removed remaining raw Tailwind palette classes and `text-white` usage)
  - Enabled `next/image` external images for Home Depot CDN (`images.thdstatic.com`) via `next.config.js`

- **Recent focus (Dec 15 2:45 PM):** Fixed critical Store Finder UX bugs:
  - **Re-ranking bug eliminated:** Clicking a store on the map no longer re-sorts the list; ranking is now decoupled from map panning via `rankingCenterRef`
  - **Marker readability improved:** Pin numbers increased from font-size 11/12 to 13/15 with heavier stroke (4px) for better visibility
  - **ARIA compliance verified:** All 6 `aria-pressed` attributes in penny-list-filters.tsx correctly use string literals ("true"/"false")
  - **Store #106 coordinates:** Verified source data (34.007751688179, -84.56504430913) - coordinates are from upstream store directory and match JSON
- **Command reliability (Dec 15 12:30 PM):** Eliminated repeated "command hangs / loops" by removing `npx` from execution paths and hardening scripts with timeouts + process cleanup.
- Foundation Contract added at `.ai/FOUNDATION_CONTRACT.md` (tokens/Tailwind/layout/nav/gates) and `ROUTE-TREE.txt` refreshed (includes framework 404).
- Color drift ratchet in place: `npm run lint:colors` compares against `checks/lint-colors.baseline.json` (8 warnings after recent cleanup) and fails if count rises; refresh the reference only with `npm run lint:colors:update-baseline` after an intentional color change.
- Canonical entrypoint: root `README.md` now holds the AI canon + read order; `.ai/README.md` is a stub pointing back. Read order: STATE → BACKLOG → CONTRACT + DECISION_RIGHTS → CONSTRAINTS + FOUNDATION_CONTRACT + GUARDRAILS → latest SESSION_LOG → CONTEXT (for product calls).
- Palette refresh permission: allowed later if WCAG AA minimum (target AAA) with before/after screenshots (light/dark, key routes) and lint:colors baseline refresh when intentional.
- Lighthouse policy: re-run only when visual/token/layout or performance-impacting changes ship, or during scheduled reviews; record outputs in `LIGHTHOUSE_RESULTS.md` and JSON artifacts in `test-results/` (mobile currently `lighthouse-mobile.json`).

---

## 2. What’s Working

- `/guide` and supporting strategy pages are stable and mobile‑friendly.
- `/store-finder` map hydrates cleanly; uses standard OpenStreetMap tiles (no filters) for a familiar look in light/dark; popups are compact/readable and marker pins include rank numbers for list-to-map matching.
- **Crowd Reports system is live:**
  - `/report-find` posts to Google Sheet via Apps Script.
  - `/penny-list` pulls hourly, aggregates by SKU, counts by state, auto‑tiers.
- **Verified Pennies database is live (curated):**
  - `/verified-pennies` serves a curated catalog of confirmed penny items with product images.
  - This is additive to Community Reports (does not replace the crowdsourced loop).
- **Command reliability (Dec 15, 12:30 PM):**
  - All local scripts (`lint:colors`, `test:unit`, `check-axe`, `check-contrast`) now exit cleanly without hanging
  - Removed `npx` from execution paths (only in CI Playwright install and docs)
  - Hard timeouts (120s global, 30s per-page) prevent network-idle hangs on map pages
  - Created `reports/hang-audit.md` for full audit trail

---

## 2.1 CI / Quality Checks Notes

- **CI Playwright console failures fixed:** Vercel Analytics + Speed Insights scripts were being injected in `next start` (CI) but 404’ing off-Vercel, producing generic console errors that Playwright treated as failures. These scripts now only load on Vercel and never during Playwright.
- **Store Finder coordinate “autocorrection” is dev-only:** production no longer auto-geocodes and applies coordinate corrections (can shift pins inaccurately and adds flaky network calls).

---

## 3. Critical Integrations / Env Vars

These must be set in Vercel for the loop to work:

- `GOOGLE_APPS_SCRIPT_URL` — webhook that writes Report Find submissions into the Sheet.
- `GOOGLE_SHEET_URL` — published CSV feed for the Penny List.

Testing‑only flag:

- `PLAYWRIGHT=1` — enables stable local fixtures for E2E visual tests.

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

**Current Focus (Sprint 1):** Visual Engagement - Product images, hide quantity, image display in penny list

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
