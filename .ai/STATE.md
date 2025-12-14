# Project State (Living Snapshot)

**Last updated:** Dec 13, 2025  
This file is the **single living snapshot** of where the project is right now.  
Every AI session must update this after meaningful work.

---

## 1. Where We Are

- **Site:** live at https://pennycentral.com
- **Phase:** Stabilization + Community Intake
- **Traffic reality:** early launch volatility is normal; focus on retention loop first.
- Foundation Contract added at `.ai/FOUNDATION_CONTRACT.md` (tokens/Tailwind/layout/nav/gates) and `ROUTE-TREE.txt` refreshed (includes framework 404).
- Color drift ratchet in place: `npm run lint:colors` compares against `checks/lint-colors.baseline.json` (47 warnings baseline) and fails if count rises; refresh the reference only with `npm run lint:colors:update-baseline` after an intentional color change.
- Canonical entrypoint: root `README.md` now holds the AI canon + read order; `.ai/README.md` is a stub pointing back. Read order: STATE → BACKLOG → CONTRACT + DECISION_RIGHTS → CONSTRAINTS + FOUNDATION_CONTRACT + GUARDRAILS → latest SESSION_LOG → CONTEXT (for product calls).
- Palette refresh permission: allowed later if WCAG AA minimum (target AAA) with before/after screenshots (light/dark, key routes) and lint:colors baseline refresh when intentional.
- Lighthouse policy: re-run only when visual/token/layout or performance-impacting changes ship, or during scheduled reviews; record outputs in `LIGHTHOUSE_RESULTS.md` and JSON artifacts in `test-results/` (mobile currently `lighthouse-mobile.json`).

---

## 2. What’s Working

- `/guide` and supporting strategy pages are stable and mobile‑friendly.
- `/store-finder` map hydrates cleanly; tiles now swap per theme and popups are constrained for readability.
- **Crowd Reports system is live:**
  - `/report-find` posts to Google Sheet via Apps Script.
  - `/penny-list` pulls hourly, aggregates by SKU, counts by state, auto‑tiers.

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
- **Hydration drift:** any shared UI change requires Playwright smoke; Playwright visual baselines refreshed on Dec 13 after store-finder/footer fixes (be mindful of intentional visual changes).

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

---

## 7. Last Session Summary

- **Store Finder Root Cause Fix (Dec 13, 2025):**
  - Investigated store #106 coordinate issue - discovered source data was recently corrected from wrong address to correct one
  - Removed erroneous coordinate override that was _causing_ the problem (source data is now accurate at 34.0224, -84.6199)
  - Key learning: "Suddenly broken" after working = check upstream data changes, not just code
  - Gates: `npm run lint`, `npm run build` all pass.
- Canon consolidation: root README is the canon (with AI read order); .ai README is now a stub. DECISION_RIGHTS documents palette refresh permission and Lighthouse cadence; operational rules (no new deps, no orphan files, update SESSION_LOG/STATE) reaffirmed.
- Bloat cleanup (prior pass): removed `temp_line.txt`, `New folder/Commands_for_wizard.txt` (+ deleted folder), and `nul` (unused placeholder files).
- Gates: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` all pass.
