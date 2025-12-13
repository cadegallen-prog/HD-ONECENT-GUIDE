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

- Store-finder: implemented coordinate override for store #0106 (lat 34.009693, lng -84.564690), switched tiles to CARTO voyager mid-contrast for both themes, unified popup styling in CSS for consistency and readability.
- Layout: removed unused Suspense import in layout.tsx.
- Gates: `npm run lint`, `npm run build`, `npm run test:unit`, and `npm run test:e2e` all pass.
