# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-10 - Codex (GPT-5.2) - Repair partial commit + ship full local changes

**Goal:** Undo the bad/partial pushed commit *without rewriting history*, then stage/commit/push the entire remaining local work safely (no secrets, no junk artifacts).

**Outcome:**

- Created a safe revert commit for the previously pushed checkpoint (`9770fd4`), then recombined everything into a single clean commit (no force-push).
- Removed a hard-coded Supabase access token from `.claude/settings.json` (now uses `${SUPABASE_ACCESS_TOKEN}` placeholder).
- Committed the remaining work that was left unstaged: submit-find enrichment cascade merge, Save/My Lists helpers, command palette tweaks, Sentry client instrumentation rename, Supabase migration + tooling scripts, and cleanup of old Lighthouse JSON artifacts.
- Updated `.gitignore` so analytics screenshots + Lighthouse artifacts stay local-only.

**Verification (Proof):**

- `npm run lint` ✅ (0 errors)
- `npm run lint:colors` ✅ (0 errors, 0 warnings)
- `npm run build` ✅
- `npm run test:unit` ✅ (22/22)
- `npm run test:e2e` ✅ (100/100)

**Artifacts:**

- Playwright screenshots: `reports/playwright/results/`

---

## 2026-01-10 - Codex (GPT-5.2) - Penny List card hierarchy + moderate blue CTA

**Goal:** Tune the primary CTA so it doesn't visually "bleed" into the gold/brass accents, while keeping the Penny List card hierarchy improvements and not revisiting locked Phase 1/2 fixes.

**Outcome:**

- Updated `app/globals.css` tokens: CTA moved to a moderate blue in both light/dark, green reserved for success only, brass/gold reserved for small badges/pills only, added a dedicated `--price-strike` token for retail strike-through.
- Removed the previous green glow styling from `.glass-card` so list cards no longer have a green-tinted border/hover.
- Updated `components/penny-list-card.tsx` hierarchy: 72x72 image, SKU pill, reduced $0.01 dominance, muted-red retail strike-through, savings not green, trust row promoted, Report remains primary action; HD + Barcode remain secondary and neutral.

**Verification (Proof):**

- `npm run lint` ✅
- `npm run lint:colors` ✅ (0 errors, 0 warnings)
- `npm run build` ✅
- `npm run test:unit` ✅ (22/22)
- `npm run test:e2e` ✅ (100/100)

---

## 2026-01-10 - Codex (GPT-5.2) - Fix Penny List "Home Depot" link missing on Hot Right Now cards

**Goal:** Fix the enrichment display bug where the SKU detail page shows the Home Depot link, but the Penny List "Hot Right Now" cards did not.

**Root cause:** `PennyListCardCompact` (used for "Hot Right Now") did not render any Home Depot link/action, even though the list item data includes the enrichment fields needed to build it.

**Outcome:**

- Added a Home Depot action link to `PennyListCardCompact` using `getHomeDepotProductUrl({ sku, internetNumber, homeDepotUrl })` (same fallback behavior as the SKU page).
- Added a Playwright regression assertion to ensure the Hot Right Now card includes a Home Depot link.

**Verification (Proof):**

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (22/22)
- `npm run test:e2e` ✅ (100/100)
