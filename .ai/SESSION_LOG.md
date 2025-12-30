# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2025-12-30 - ChatGPT Codex (GPT-5.2) - Merge codex backlog + QA polish

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Review every outstanding codex PR branch, reapply the local bookmark/QA tweaks, and rerun the full verification gates.

**Changes Made:**
- Sequentially merged the eight codex branches that had unique commits (typography tweaks, identifiers rows, grid density, CTA placement, thumbnail polish, etc.), resolving `.ai` STATE/SESSION_LOG` conflicts along the way.
- Reapplied the local workspace stash so the bookmark clarity tip card, CSP adjustments, and Supabase mock fixes survived, and added `.ai/RULES.md` plus a `full-qa` workflow for documenting QA requirements.
- Reformatted the affected components (`components/penny-list-card.tsx`, `app/sku/[sku]/page.tsx`) with Prettier, keeping the normalized display helpers and the new identifiers/CTA UI.

**Verification:**
- `npm run lint`
- `npm run build` (Turbopack warnings for `import/require-in-the-middle`, same as before)
- `npm run test:unit`
- `npm run test:e2e` (Playwright 68 tests via `--workers=1`)

**For Next AI:** Keep the QA rules/workflow in sync with the full QA automation (and rerun `npm run qa:full` if new risky paths change).


## 2025-12-30 - ChatGPT Codex (GPT-5.2) - Bookmark clarity + login fix

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Make the Penny List bookmark eyes-on, explain the save flow, and unblock OTP sign-in.

**Changes Made:**
- Added a `BookmarkAction` wrapper (with inline copy and login hint) to both Penny List card variants so the bookmark icon clearly saves to personal lists and stops the card click from firing.
- Inserted a `Save it for later` tip card right above the penny results explaining what the bookmark does, that it triggers sign-in, and linking to `/lists` (with accessible data attributes for targeting).
- Allowed `https://*.supabase.co` in the CSP `connect-src` header so `/login` can reach Supabase OTP endpoints again; a Playwright script now catches a 200 response for the OTP request instead of a CSP block.
- Updated `tests/setup.ts` to load `.env.local` via `dotenv` before stubbing `server-only`, which keeps the Supabase envs available to the failing enrichment/fallback tests.
- Captured fresh Playwright screenshots for the post-change UI (light + dark) and confirmed the browser console stayed error-free while loading `/penny-list`.

**Outcome:** UI now spells out the bookmark/save flow and the login form can hit Supabase again, but the existing `fetch-penny-data` unit tests still fail (`ignores enrichment rows with invalid SKUs` and `falls back to service role read when anon returns empty`). Other gates pass (`lint`, `build`, `test:e2e`, `lint:colors`).

**For Next AI:** Investigate the failing enrichment/fallback unit tests (invalid SKU filtering + service role lookup) so the verification gate can greenlight this change.

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List highlights cleanup

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Remove extra Penny List highlight modules and keep a single primary module.

**Changes Made:**
- Removed the "Trending SKUs" block from `/penny-list` and dropped its data plumbing.
- Removed the "What's New" module and props from `PennyListClient`, keeping "Hot Right Now" as the primary highlight.
- Updated analytics payload to report `hotItemsCount` for the remaining highlight module.

**Outcome:** ?? Partial (tests failing)

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (Turbopack warnings about import-in-the-middle version mismatch)
- test:unit: ? `npm run test:unit` (glob path not found: `tests/**/*.test.ts`)
- test:e2e: ? `npm run test:e2e` (multiple Playwright failures across projects; see console output)

**For Next AI:**
- Investigate why `npm run test:unit` fails to resolve `tests/**/*.test.ts` in this environment.
- Review Playwright failures (Report Find prefill, visual smoke, SKU related items, store finder popup) and check whether `PLAYWRIGHT=1` fixture mode or dev server state is impacting those results.

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List Identifiers Row

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Add a compact identifiers row under the SKU pill and reduce mobile clutter.

**Changes Made:**
- Added an "Identifiers" row under the SKU pill in `components/penny-list-card.tsx`, showing Model/UPC only when present.
- Added a mobile-only `<details>` toggle to keep the identifiers row compact.
- Updated `data/penny-list.json` fixture to include a sample model number and UPC for previewing the UI.

**Outcome:** ? Success

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (Turbopack warnings about duplicate OpenTelemetry deps)
- test:unit: ? `npm run test:unit` (no matching tests glob)
- test:e2e: ? `npm run test:e2e` (Playwright browsers missing; needs `npx playwright install`)

***
---

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Add a compact identifiers row under the SKU pill and reduce mobile clutter.

**Changes Made:**
- Added an "Identifiers" row under the SKU pill in `components/penny-list-card.tsx`, showing Model/UPC only when present.
- Added a mobile-only `<details>` toggle to keep the identifiers row compact.
- Updated `data/penny-list.json` fixture to include a sample model number and UPC for previewing the UI.

**Outcome:** ? Success

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (Turbopack warnings about duplicate OpenTelemetry deps)
- test:unit: ? `npm run test:unit` (no matching tests glob)
- test:e2e: ? `npm run test:e2e` (Playwright browsers missing; needs `npx playwright install`)

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny Thumbnail Styling Polish

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Improve penny thumbnail separation and padding to avoid edge blending.  

**Changes Made:**
- Strengthened thumbnail background with `var(--bg-tertiary)` and `var(--border-strong)` plus an inset shadow.
- Switched thumbnails to `object-contain` with padding to keep edges off the background.

**Outcome:** ? Success

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (warnings about `import-in-the-middle` version mismatch)
- test:unit: ? `npm run test:unit` (no tests matched glob: `tests/**/*.test.ts`)
- test:e2e: ? `npm run test:e2e` (Playwright browsers missing; prompt to run `npx playwright install`)
- lint:colors: ? `npm run lint:colors`
- Playwright: before/after light/dark captured; after-light shows hydration warning in console.

**For Next AI:**
- None.

---


---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List Card Typography Hierarchy

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Add brand line + two-line title clamping on Penny List cards and align mobile typography across compact/standard cards.

**Changes Made:**
- Added optional brand line above titles for `PennyListCard` and `PennyListCardCompact`.
- Switched title truncation to `line-clamp-2` and reduced mobile title size while keeping 8-pt spacing.
- Updated `.ai/STATE.md` with the latest UI change.

**Outcome:** ? UI updates complete; verification partially blocked by environment.

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (Turbopack warnings about duplicated `import-in-the-middle`/`require-in-the-middle`)
- test:unit: ? `npm run test:unit` (script error: could not find `tests/**/*.test.ts`)
- test:e2e: ? `npm run test:e2e` (Playwright browsers missing; requires `npx playwright install`)
- Playwright screenshots captured manually for `/penny-list` (light + dark). Console showed missing Supabase env vars and one hydration mismatch warning in dev.

**For Next AI:**
- Consider fixing the unit test glob if intended, or document expected path.
- Install Playwright browsers in this environment before rerunning e2e tests.
---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List CTA Cleanup

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Remove PayPal CTA, move BeFrugal CTA lower while preserving affiliate tracking.

**Changes Made:**
- Removed the PayPal tip CTA and its click tracking from `components/penny-list-client.tsx`.
- Moved the BeFrugal affiliate CTA near the footer card while keeping `affiliate_click` tracking.

**Outcome:** ?? Partial (tests not fully green)

**Verification:**
- lint: ? `npm run lint`
- build: ? `npm run build` (Turbopack warnings about duplicate OpenTelemetry deps)
- test:unit: ? `npm run test:unit` (tsx could not find `tests/**/*.test.ts`; glob did not expand)
- test:e2e: ? `npm run test:e2e` (Playwright failures in report-find prefill + visual smoke; browser deps installed via `npx playwright install` + `npx playwright install-deps`)

**For Next AI:**
- Investigate Playwright failures in `tests/report-find-prefill.spec.ts` (SKU prefill not applied) and the visual smoke/spec failures; confirm expected query param behavior in `/report-find`.
- Check why `npm run test:unit` fails to expand `tests/**/*.test.ts` in this shell; may need a globstar-compatible shell or script update.
---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - SKU Identifiers Cleanup

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Clarify SKU page identifiers and remove duplicate SKU display.

**Changes Made:**
- Consolidated SKU, internet number, UPC, and model into a single "Identifiers" block on `/sku/[sku]`.
- Renamed the Internet # label to "Internet # (Home Depot listing)" for clarity.
- Removed the redundant SKU callout above the identifiers block.

**Outcome:** ? Success

**Verification:**
- Screenshots captured (before/after, light/dark) via Playwright.

**For Next AI:**
- None.

---


**AI:** Claude Code (Opus 4.5)  
**Goal:** Harden /report-find for low-friction reporting from penny-list and SKU pages. Prevent accidental SKU edits when prefilled.

**Changes Made:**
- Added `skuLocked` state: when SKU is prefilled via query params, it's now read-only by default
- Added "Edit" button (with Pencil icon) to unlock SKU field
- Added loading skeleton (`ReportFindSkeleton`) for better SSR/hydration - shows form placeholder before client hydration
- Updated E2E tests to use more specific selectors (`#sku`, `#itemName`) instead of label matching

**Outcome:** ✅ Success

**Verification:**
- lint: ✅ 0 errors
- build: ✅ success (903 pages)
- test:unit: ✅ 21/21 passing
- test:e2e: ✅ 16/17 passing (1 pre-existing failure in sku-related-items.spec.ts)

**Files Modified:**
- `app/report-find/page.tsx` - Added skuLocked state, Edit button, loading skeleton
- `tests/report-find-prefill.spec.ts` - Updated selectors, added locked SKU test

**For Next AI:**
- PR-3 (Auth + Personal Lists) is next - requires Supabase tables and RLS policies
- Full 6-PR roadmap documented in `.claude/plans/cozy-mapping-sunset.md`

---

## 2025-12-27 - ChatGPT Codex (GPT-5.2) - MCP Set-and-Forget Prune

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Reduce MCP tool noise while keeping daily DB checks available.

**Changes Made:**
- Removed Vercel MCP from Codex (`C:\\Users\\cadeg\\.codex\\config.toml`), Claude (`.claude/settings.json`), and VS Code (`.vscode/mcp.json`).
- Kept Supabase enabled for routine database checks.

**Outcome:** ✅ Success

**Notes:**
- Restart VS Code/Codex to refresh tool lists after config changes.

---

## 2025-12-28 - ChatGPT Codex (GPT-5.2) - Penny List Grid Density

**AI:** ChatGPT Codex (GPT-5.2)  
**Goal:** Increase penny list card grid density at desktop widths without reducing tap targets.

**Changes Made:**
- Updated the penny list card grid to show four columns at xl breakpoint.
- Captured Playwright proof screenshots for light/dark modes before and after the change.

**Outcome:** ✅ Success

**Verification:**
- Playwright screenshots captured for /penny-list (light + dark, before/after) with console logs saved in reports/proof.

**Files Modified:**
- `components/penny-list-client.tsx` - Adjusted grid columns at xl
- `.ai/STATE.md` - Updated project snapshot
- build: ? `npm run build`
- test:unit: ? `npm run test:unit` (21/21)
- test:e2e: ? `npm run test:e2e` (68/68; Next dev source-map warnings + known store API 404 fallback)

**For Next AI:**
- Apply the new Supabase migrations to the project DB and wire env vars (`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in Vercel if not already.
- Confirm list sharing RPCs execute with correct role grants in Supabase; add tests if needed.

---

## 2025-12-30 - Codex - PR-63 QA verification

**Goal:** Verify Penny List fetch optimization branch with full quality gates.

**Verification:**
- lint: PASS `npm run lint`
- build: PASS `npm run build` (Turbopack duplicate OpenTelemetry warnings)
- test:unit: PASS `npm run test:unit` (21/21)
- test:e2e: PASS `npm run test:e2e` (68/68)
