# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2025-12-29 - ChatGPT Codex (GPT-5) - Auto-Enrich Reliability + Negative Cache

**AI:** ChatGPT Codex (GPT-5)  
**Goal:** Improve `scripts/auto-enrich.ts` accuracy and reduce wasted attempts.

**Changes Made:**
- Reused `lib/sku.ts` validation/normalization, deduped inputs, and skipped invalid SKUs.
- Added local status cache at `.local/enrichment-status.json` to skip not-found/mismatch/error/invalid SKUs unless `--force` is used.
- Added one immediate retry for transient errors, then marks as `error` to avoid repeat attempts.
- Updated flow to resolve a product link from search results, then extract from the product page using JSON-LD + fallbacks.
- Added SKU mismatch detection, enforced name + internet SKU before saving, and added summary counters.

**Outcome:** ✅ Success (code changes applied)

**Verification:** Not run (no tests executed).

**For Next AI:**
- If results still vary, consider adding a fixed store/zip context to stabilize search results.

**Probe (SerpApi search):**
- Sample SKUs: 1009926663, 1009926843, 1009964275
- Zips tested: 10001, 30301, 90001
- Result: 9/9 found, consistent product_id across zips
- Estimated credits used: 9

**Probe (SerpApi search, failed SKUs):**
- Sample SKUs: 1009923959, 1009923970, 1009923974, 1009956798
- Zips tested: 10001, 30301, 60601, 73301, 80202, 90001, 94105, 33101
- Results:
  - 1009923959: found only in 33101 (product_id 325718942), not found in other 7 zips
  - 1009923970: found in 10001/60601/73301/90001/33101 (product_id 325718939), not found in 30301/80202/94105
  - 1009923974: not found in all 8 zips
  - 1009956798: not found in all 8 zips
- Estimated credits used: 32

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

## 2025-12-27 - Claude Code (Opus 4.5) - PR-2: Report Find Prefill + Validation Hardening

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
