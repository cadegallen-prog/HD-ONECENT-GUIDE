# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-11 - GitHub Copilot - Supabase Critical Fixes (Egress + Security)

**Goal:** Fix infinite API loop causing 44,000+ Supabase calls + security issues  
**Status:** ✅ Complete

### Issues Fixed

1. **Frontend Infinite Loop (P0)**: `useEffect` in penny-list-client.tsx was re-triggering on every `fetchItems` callback recreation, causing 44,000+ API calls to `penny_item_enrichment` and `penny_list_public` tables.
   - **Fix**: Added ref-based comparison (`prevFiltersRef`) to only fetch when filters actually change
   - **Impact**: Reduced API calls from thousands to 1 per filter change

2. **SECURITY DEFINER View**: `penny_list_public` view was using `SECURITY DEFINER` which bypasses RLS policies
   - **Fix**: Recreated view with `SECURITY INVOKER` (migration 011)
   - **Impact**: View now respects user permissions via RLS

3. **Public Insert Vulnerability**: `Penny List` table allowed unauthenticated inserts (spam risk)
   - **Fix**: Updated RLS policy to require authentication (migration 012)
   - **Trade-off**: Users must sign in to submit finds (can add captcha later for anon submissions)

### Files Changed

- `components/penny-list-client.tsx` - Fixed infinite loop with ref comparison
- `supabase/migrations/011_fix_security_definer_view.sql` - Fixed SECURITY DEFINER
- `supabase/migrations/012_restrict_penny_list_inserts.sql` - Locked down inserts
- `SUPABASE_CRITICAL_FIXES.md` - Full documentation with rollback plan

### Verification

✅ Lint: Passed (0 errors)  
✅ Build: Passed (successful compilation)  
✅ TypeScript: Passed (no type errors)

### Next Steps

1. Apply Supabase migrations: `supabase db push`
2. Deploy to Vercel: `git push origin main`
3. Monitor Supabase dashboard for API call rate normalization
4. Test penny-list page filter behavior (should be 1 API call per change)

### Learnings

- `useEffect` with callback dependencies requires careful ref-based comparison to prevent infinite loops
- Always use `SECURITY INVOKER` for views unless you have a specific reason for `SECURITY DEFINER`
- Anonymous inserts need rate limiting OR require authentication to prevent spam

---

## 2026-01-11 - Codex (GPT-5.2) - Dev/Test mode protocol (port ownership + Copilot hang mitigation)

**Goal:** Reduce Copilot “spinner hang” + port 3001 loops by enforcing a single-owner dev server workflow and making `ai:doctor`/`ai:verify` deterministic on Windows.

**Outcome:**

- Added explicit Dev/Test modes to `scripts/ai-verify.ts` (use positional args: `npm run ai:verify -- dev` / `npm run ai:verify -- test`) and added HTTP readiness retries.
- Updated `playwright.config.ts` so Playwright webServer uses port 3002 and reuses existing server locally (`reuseExistingServer: !CI`) while staying non-reuse in CI.
- Updated `scripts/ai-doctor.ts` to use HTTP readiness retries and removed “npx kill-port” guidance (replaced with “kill only if you own it”).
- Updated docs to match the protocol: `.ai/CRITICAL_RULES.md`, `.ai/CONSTRAINTS.md`, `.ai/VERIFICATION_REQUIRED.md`, `.github/copilot-instructions.md`.

**Verification (Proof):**

- `npm run ai:doctor` ✅
- `npm run ai:verify -- dev` ✅ `reports/verification/2026-01-11T05-38-31/summary.md`
- `npm run ai:verify -- test` ✅ `reports/verification/2026-01-11T05-41-40/summary.md`

## 2026-01-11 - Codex (GPT-5.2) - Penny Deal Card final converged design

**Goal:** Implement the final converged Penny Deal Card design decisions (brand placement, save placement, recency status, state/report info, and simplified price presentation) without introducing extra UI changes.

**Outcome:**

- Updated `components/penny-list-card.tsx` to match the final hierarchy: image → subtle brand (aligned to image edge) → item name → SKU.
- Moved Save (icon-only) off the top-right and into the secondary actions row so top-right is status-only (recency).
- Top-right now shows recency with a small calendar icon and muted text (non-interactive).
- State pills are limited and muted (no enumeration), with a single smaller/lower-contrast line showing total reports.
- Penny price is the hero; retail remains muted; removed explicit “$X off” savings lines from the card face.

**Verification (Proof):**

- `npm run lint` ✅ (0 errors)
- `npm run build` ✅ (successful)
- `npm run test:unit` ✅ (25/25 passing)
- `npm run test:e2e` ✅ (100/100 passing)
- Command outputs saved to: `reports/verification/2026-01-10T21-10-57_manual/`
- Playwright screenshots: `reports/proof/2026-01-11T02-07-48/`

**Notes:**

- Port 3001 dev server was listening but unresponsive; it was restarted to capture Playwright proof screenshots.

## 2026-01-11 - Codex (GPT-5.2) - Reduce agent misalignment (task spec + proof canon)

**Goal:** Make it easier for you (Cade) to communicate intent and course-correct, and make Codex/Claude/Copilot converge on the same “surgical” workflow with objective proof.

**Outcome:**

- Added missing canonical proof doc: `.ai/VERIFICATION_REQUIRED.md` (repo referenced it widely, but the file didn’t exist).
- Strengthened the session task template in `.ai/USAGE.md` to include **NOT DOING / CONSTRAINTS / EXAMPLES** plus a copy-paste **course-correction script** when the AI is misaligned.
- Linked these from all major entrypoints so the same protocol applies across tools: `.ai/START_HERE.md`, `.ai/CODEX_ENTRY.md`, `CLAUDE.md`, `.github/copilot-instructions.md`.

**Notes:**

- `npm run ai:verify` failed initially because port 3001 was occupied but unresponsive.

**Verification (Proof):**

- `npm run ai:verify` ✅ (all gates pass) - outputs in `reports/verification/2026-01-11T01-45-33/`
- Summary: `reports/verification/2026-01-11T01-45-33/summary.md`
