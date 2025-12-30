# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2025-12-29 - ChatGPT Codex (GPT-5.2) - PR-06 Analytics Instrumentation

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Add privacy-friendly analytics (Plausible-ready), instrument key events, and document env vars.

**Changes Made:**
- Replaced Google Analytics with optional Plausible script injection (env-driven) and gated Vercel Analytics via `NEXT_PUBLIC_ANALYTICS_PROVIDER`.
- Added event tracking for homepage views, "View on Home Depot" clicks, and Report a Find CTA clicks (hero + nav).
- Documented analytics env vars and local disable path in `README.md` and `.ai/ENVIRONMENT_VARIABLES.md`; updated `.ai/ANALYTICS_MAP.md` and `.ai/STATE.md`.

**Outcome:** ✅ Changes complete (verification pending).

**Verification:**
- lint: ⚠️ not run
- build: ⚠️ not run
- test:unit: ⚠️ not run
- test:e2e: ⚠️ not run

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List Identifiers Row

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Add a compact identifiers row under the SKU pill and reduce mobile clutter.

**Changes Made:**
- Added an “Identifiers” row under the SKU pill in `components/penny-list-card.tsx`, showing Model/UPC only when present.
- Added a mobile-only `<details>` toggle to keep the identifiers row compact.
- Updated `data/penny-list.json` fixture to include a sample model number and UPC for previewing the UI.

**Outcome:** ✅ Success

**Verification:**
- lint: ✅ `npm run lint`
- build: ✅ `npm run build` (Turbopack warnings about duplicate OpenTelemetry deps)
- test:unit: ❌ `npm run test:unit` (no matching tests glob)
- test:e2e: ❌ `npm run test:e2e` (Playwright browsers missing; needs `npx playwright install`)

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Auth + Personal Lists + Sharing

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Ship PR-3 foundations: Supabase auth, personal lists with sharing, and scraping automation.

**Changes Made:**
- Added Supabase auth provider + middleware, magic-link login (`/login`), auth callback (`/auth/callback`), and guarded `/lists` routes. Layout now wraps in `AuthProvider`.
- Implemented personal lists UI: add-to-list buttons on Penny List cards, lists index (`/lists`), list detail (`/lists/[id]`) with priority/found toggles, in-store mode, filtering/search, and share/fork view at `/s/[token]`.
- Added Supabase clients + analytics events, and migrations `001_create_lists_tables.sql`, `002_create_list_shares.sql`, `003_security_search_path.sql` (RLS + RPCs). Added `scripts/auto-enrich.ts` + `SCRAPING_IMPROVEMENT_PLAN.md` and npm script `enrich:auto`; ignored `data/skus-to-enrich.txt` and `supabase/.temp/`.
- Centralized `formatSkuForDisplay`, upgraded SKU copy UX (toasts, formatting) across cards/table/SKU/report-find, and enforced CSS variable colors in new UI.

**Outcome:** ✅ Success

**Verification:**
- lint: ✅ `npm run lint`
- build: ✅ `npm run build`
- test:unit: ✅ `npm run test:unit` (21/21)
- test:e2e: ✅ `npm run test:e2e` (68/68; Next dev source-map warnings + known store API 404 fallback)

**For Next AI:**
- Apply the new Supabase migrations to the project DB and wire env vars (`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in Vercel if not already.
- Confirm list sharing RPCs execute with correct role grants in Supabase; add tests if needed.

---

## 2025-12-30 - Codex - PR-66 fixes + QA verification

**Changes:**
- Allowed Plausible domains in CSP (`next.config.js`).
- Fixed Plausible typing for `trackPageView` (allow `u` in options).

**Verification:**
- lint: PASS `npm run lint`
- build: PASS `npm run build` (Turbopack duplicate OpenTelemetry warnings)
- test:unit: PASS `npm run test:unit` (21/21)
- test:e2e: PASS `npm run test:e2e` (68/68)
