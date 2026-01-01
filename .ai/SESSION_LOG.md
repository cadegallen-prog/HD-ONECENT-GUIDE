# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-01 - ChatGPT Codex (GPT-5) - Penny List card density pass

**Goal:** Deliver a denser, scan-first Penny List card on mobile without breaking Save/Report/Share/HD actions.

**Changes Made:**
- Tightened card spacing/padding, reduced thumbnail size, and removed the mobile `<details>` identifiers toggle.
- Added an always-visible UPC block (monospace numeric), kept model visible, and condensed state pills with a “+N more” tail.
- Simplified the action row while preserving Save, Report, Share, and Home Depot links; increased share button to 44px touch target.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e`
- `npm run check-contrast`
- `npm run check-axe`

**Notes:** Playwright reused the existing dev server on port 3001; no server restarts.

## 2026-01-01 - ChatGPT Codex (GPT-5) - Auto-enrich guardrails + scrape tooling

**Goal:** Prevent null-name auto-enrich rows, keep scrape normalization consistent, and upload the latest partial scrape.

**Changes Made:**
- Added auto-enrich guardrails: normalize brand/name, use canonical HD URL, and skip upserts when `item_name` is missing.
- Added scrape tooling: `scripts/transform-scrape.ts` and `scripts/analyze-scrape-coverage.ts` (with name normalization fixes).
- Ignored local scrape artifacts in `.gitignore` to prevent accidental commits.
- Ran transform + bulk enrich for `penny_scrape_1767297939418.json` (23 SKUs) into Supabase; scrape file kept local and uncommitted.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e`
- `npm run check-contrast`
- `npm run check-axe`

**Notes:** Playwright reused the existing dev server on port 3001 (no server restart).


## 2025-12-31 - ChatGPT Codex (GPT-5.2) - Proxy migration, OTel pin, guide timeline, state pages, analytics check

**Goal:** Remove noisy build warnings, finish backlog items #3-4, keep tests green while avoiding port 3001 collisions.

**Changes Made:**
- Renamed `middleware.ts` → `proxy.ts` and exported `proxy` (Next 16 deprecation fixed).
- Added npm `overrides` for `import-in-the-middle@2.0.1` and `require-in-the-middle@8.0.1`, silencing Turbopack OTel version skew warnings.
- Added clearance cadence timeline + tag examples to `components/GuideContent.tsx`.
- Added state landing pages `app/pennies/[state]/page.tsx` + `lib/states.ts`; sitemap now includes state pages.
- Playwright now uses port 3002 by default (`PLAYWRIGHT_BASE_URL` + `--port 3002`) to avoid clashing with user's 3001 server.
- Analytics audit: kept provider fully env-gated (`NEXT_PUBLIC_ANALYTICS_PROVIDER` = plausible/vercel/none), confirmed key events already wired (page views, penny-list filters/search, HD clicks, report submissions, store searches). README already documents envs; no new deps added.

**Verification:**
- `npm run lint`
- `npm run build` (clean; only standard edge runtime note)
- `npm run test:unit`
- `npm run test:e2e` (68/68 on port 3002; Next dev emits source-map warnings; store API fell back to local data with 404 in tests)

**Notes:** Port 3001 left untouched for user. Analytics remains env-gated; no Plausible creds required. Remaining backlog: analytics pass (already env-gated, events largely wired) if still desired.


## 2025-12-31 - ChatGPT Codex (GPT-5.2) - Backlog refactor: scrape/export pipeline + promptable tasks

**Goal:** Turn the current open-tab artifacts (homepage, Today's Finds, scrape JSON, missing export JSON, empty count script) into a methodical backlog of small, verifiable tasks so nothing is "one-shot".

**Outcome:**
- Replaced `.ai/BACKLOG.md` with an updated, ≤10-item ordered list focused on (1) restoring a canonical PennyCentral export artifact, (2) validating/normalizing scrape JSON, (3) converting scrape → enrichment CSV with fill-blanks-only policy, (4) producing a diff report before uploads, (5) implementing the empty `scripts/print-penny-list-count.ts`, and (6-9) scoped Penny List UX improvements and homepage support CTA consistency.
- Noted that `C:\Users\cadeg\Downloads\pennycentral_export_2025-12-31.json` could not be found in common directories; the new top P0 item makes restoring/standardizing this artifact explicit.

**Verification:** (run below in this session)
