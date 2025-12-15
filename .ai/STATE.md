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
- `/store-finder` map hydrates cleanly; uses standard OpenStreetMap tiles (no filters) for a familiar look in light/dark; popups are compact/readable and marker pins include rank numbers for list-to-map matching.
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

---

## 7. Last Session Summary

- **MCP Stack Simplification (Dec 14, 2025):**
  - Evaluated 9-MCP setup with "MANDATORY" usage rules
  - Found: agents ignored mandatory rules; quality stayed high without them
  - Root cause: Compliance theater - trying to solve process problems with tools
  - Solution: Simplified from 9 MCPs to 4 pragmatic MCPs
  - Removed: sequential-thinking, memory, memory-keeper, next-devtools, context7, github_copilot
  - Kept: filesystem, git, github, **playwright** (agents use these naturally)
  - **Playwright refinement:** Re-enabled after user identified gap - it reduces non-technical user's testing burden by giving agents autonomous browser verification
  - Documentation: 75% reduction (740 lines → 200 lines)
  - Philosophy change: from "process compliance" to "outcome verification"
  - Impact: Dramatically lower cognitive load; same quality (gates verify)
  - Files: `~/.codex/config.toml`, `.ai/MCP_SERVERS.md`, `.ai/USAGE.md`, `.ai/LEARNINGS.md`
  - Key learning: Trust agents to self-regulate; some MCPs (like Playwright) provide unique value by reducing user burden
