# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**

- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI
- **Self-regulating:** If this file has more than 5 entries, trim to keep only the 3 most recent. Git history preserves everything.

---

## 2026-01-05 - ChatGPT Codex (GPT-5.2) - Penny List Option A: date/sort consistency + window label clarity

**Goal:** Fix Penny List “wrong dates” perception + broken “Newest First” behavior by aligning defaults and making recency/window labeling consistent.

**Outcome:**

- Fixed root-cause mismatch: client defaulted to `1m` but treated `6m` as the “default” in URL sync + fetch logic, so the UI could imply one window while showing another.
- Standardized the window label shown on cards/table to **(30d)** instead of ambiguous `(1m)`.
- Made "Newest/Oldest" sorting use `lastSeenAt` (purchase date when present/valid, else report timestamp) for consistency with "Last seen".
- Tightened date window filtering to use "last seen" semantics (purchase date when present, else timestamp) so 30d/3m/etc filters match what the user sees.
- Added visible desktop labels for action icons (Save/Barcode/Home Depot) while keeping 44×44px minimum tap targets.
- Prevented Vercel analytics scripts from loading during Playwright/CI, eliminating local `/_vercel/insights` 404 console noise.

**Changes Made:**

- `components/penny-list-client.tsx`
- `components/penny-list-filters.tsx`
- `components/penny-list-card.tsx`
- `components/penny-list-table.tsx`
- `app/penny-list/page.tsx`
- `app/api/penny-list/route.ts`
- `app/layout.tsx`
- `lib/fetch-penny-data.ts`
- `lib/penny-list-query.ts`
- `lib/penny-list-utils.ts`
- `tests/penny-list-redesign-proof.spec.ts`
- `tests/sku-related-items.spec.ts`

**Verification (Proof):**

- `npm run lint` ✅ (0 errors)
- `npm run build` ✅ (success)
- `npm run test:unit` ✅ (20/20 passing)
- `npm run test:e2e` ✅ (92/92 passing)
- Playwright screenshots created:
  - `reports/proof/penny-list-mobile-light-redesign.png`
  - `reports/proof/penny-list-mobile-dark-redesign.png`
  - `reports/proof/penny-list-desktop-table-light-redesign.png`
  - `reports/proof/penny-list-desktop-table-dark-redesign.png`
  - `reports/proof/penny-list-state-breakdown-sheet-open.png`
  - `reports/verification/sku-related-items-chromium-desktop-light.png`
  - `reports/verification/sku-related-items-chromium-desktop-dark.png`
  - `reports/verification/sku-related-items-chromium-mobile-light.png`
  - `reports/verification/sku-related-items-chromium-mobile-dark.png`

---

## 2026-01-05 - Claude Code (Haiku 4.5) - Card redesign verification & window label fix

**Goal:** Review completed card redesign implementation, fix critical window label mismatch (6m vs 30d), and verify spec compliance.

**Outcome:**

- ✅ **Critical fix:** Changed default `dateRange` from `6m` to `1m` (30 days) to align with spec.
- ✅ **Visual verification:** Baseline penny-list screenshots (mobile/desktop × light/dark).

---

## 2026-01-05 - ChatGPT Codex (GPT-5) - Shared state sheet + action row; card parity pass

**Goal:** Extract shared UI pieces and bring the default card view up to the redesign spec.

**Outcome:**

- Added shared `StateBreakdownSheet` and `PennyListActionRow` components.
- Centralized Line A/Line B formatting helpers in `lib/penny-list-utils.ts`.
- Card view and table view use shared pieces.
