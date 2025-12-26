# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2025-12-26 - ChatGPT Codex (GPT-5.2) - Penny List UI Polish (Sticky Filters + Cleaner Cards)

**AI:** ChatGPT Codex (GPT-5.2)
**Goal:** Fix Penny List filter bar clipping while scrolling, fix the items-per-page dropdown arrow overlap, and reduce card clutter (remove tier/commonness + redundant "Community lead" label).

**Changes Made:**
- `components/penny-list-filters.tsx`: Sticky filter bar now uses `top-16` so it doesn't hide behind the navbar.
- `components/penny-list-client.tsx`: Items-per-page `<select>` now uses a custom chevron + padding; drops legacy `tier` param from URL syncing.
- `components/penny-list-card.tsx`: Removed tier/commonness pill; removed redundant "Community lead" footer label.
- `components/penny-list-table.tsx`: Removed Tier column.
- `app/penny-list/page.tsx` + `app/api/penny-list/route.ts`: Tier param ignored (no hidden behavior).
- `scripts/ai-proof.ts`: Added scrolled "UI" screenshots and ensured dark mode reload.

**Outcome:** ✅ Success

**Verification:**
- Quality gates bundle: `reports/verification/2025-12-26T08-36-49/` (lint/build/unit/e2e all pass)
- Color linter: `npm run lint:colors` ✅ 0 errors, 0 warnings
- Playwright screenshots (before/after, light/dark, console):
  - Before: `reports/proof/2025-12-26T08-31-04/` (1 hydration-mismatch console error captured)
  - After: `reports/proof/2025-12-26T08-31-51/` (no console errors)

**Notes:**
- The "before" run captured a Next.js dev hydration-mismatch console error on the Penny List; it did not reproduce after the UI changes.

---

## 2025-12-26 - ChatGPT Codex (GPT-5.2) - AI Enablement Blueprint + Penny List SSR Param Fix

**AI:** ChatGPT Codex (GPT-5.2)
**Goal:** Make workflow/tooling planning repo-native + consistent across Codex/Claude/Copilot, and ensure Penny List pagination renders correctly on reload/bookmarks (URL params).

**Changes Made:**
- Added `.ai/AI_ENABLEMENT_BLUEPRINT.md` and wired it into the 3 instruction entrypoints (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) plus the root `README.md`.
- Updated `.ai/AI-TOOLS-SETUP.md` so it points to the canonical read order (root README) and references the enablement blueprint for workflow sessions.
- Updated `.ai/PENNY_LIST_PLAN.md` to reflect the shipped server-side pagination approach and the page-size decision (25/50/100 across all date windows).
- Fixed `app/penny-list/page.tsx` SSR to compute the initial page slice from URL params (so `/penny-list?...` reloads match the URL).
- Removed the accidental/unrequested `docs/ANALYTICS_PRIVACY_COMPLIANCE.md` file.

**Outcome:** ✅ Success

**Verification:**
- Full raw outputs saved at `reports/verification/2025-12-26-proof.txt`.
- Summary: `npm run lint` ✅, `npm run build` ✅ (902 pages), `npm run test:unit` ✅ (21/21), `npm run test:e2e` ✅ (64/64).

**Notes:**
- Playwright output still includes known noisy logs (Next.js invalid source maps and `/api/stores` remote 404 fallback); tests pass.

**For Next AI:**
- If Penny List becomes slow server-side, prioritize date-windowed Supabase reads (fetch fewer rows before aggregating by SKU).
- Consider implementing `npm run ai:doctor` and `npm run ai:verify` from `.ai/AI_ENABLEMENT_BLUEPRINT.md`.

---

## 2025-12-25 - Claude Code (Opus 4.5) - Server-Side Pagination for Penny List

**AI:** Claude Code (Opus 4.5)
**Goal:** Implement true server-side pagination so the client no longer loads the entire dataset. Wire pagination controls to fetch from a new API endpoint.

**Changes Made:**
- Created `lib/penny-list-query.ts` - shared filter/sort/date-range logic used by both API and page.
- Created `app/api/penny-list/route.ts` - paginated API endpoint returning `{ items, total, pageCount, page, perPage }` with 60s edge caching.
- Updated `app/penny-list/page.tsx` to compute initial slice + pass to client along with server-computed metrics (trending, what's new).
- Refactored `components/penny-list-client.tsx` to fetch from API on filter/page changes instead of filtering full dataset client-side.
- Added `tests/penny-list-query.test.ts` with comprehensive unit tests for all filter/sort scenarios.

**Outcome:** ✅ Success — Penny List now fetches only the current page slice from the server. Pagination UI works as before but triggers API calls. All quality gates passing:
- `npm run lint`: 0 errors
- `npm run build`: 902 pages generated
- `npm run test:unit`: 21/21 passing
- `npm run test:e2e`: 64/64 passing

**Files Created:**
- `lib/penny-list-query.ts`
- `app/api/penny-list/route.ts`
- `tests/penny-list-query.test.ts`

**Files Modified:**
- `app/penny-list/page.tsx`
- `components/penny-list-client.tsx`

**Learnings:**
- Initial render uses server-provided data to avoid double-fetch on page load.
- Hot items and What's New sections stay server-rendered (computed from full data, not paginated).
- API includes `includeHot` param to optionally return hot items on initial-like requests.

**For Next AI:**
- Consider API caching strategy (e.g., stale-while-revalidate, ISR) for high-traffic scenarios.
- Add loading skeleton/spinner for better perceived performance during page transitions.
- SSR initial slice based on URL params (fixed on 2025-12-26; see latest entry).
