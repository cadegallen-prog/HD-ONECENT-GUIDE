# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here (trim only when entries exceed 7). Git history preserves everything.

---

## 2026-02-24 - Codex - Carryover Closure (Visual Pointer Hardening + SKU Name Normalization Reuse)

**Goal:** Finish and ship the existing dirty carryover scope on `dev` after founder approval to continue implementation with carryover as active scope.

**Status:** ✅ Completed

### Changes

- `app/sku/[sku]/page.tsx`
  - Replaced inline H1 brand-prefix stripping logic with shared `normalizeProductName(...)` utility usage.
- `lib/penny-list-utils.ts`
  - Preserved detected all-caps acronyms while still normalizing product names to title case.
- `lib/visual-pointer/source-registry.ts`
  - Filled pilot anchors with concrete source metadata (`component`, `file`, `line`) and corrected ownership mappings.
- `playwright.config.ts`
  - Added explicit `chromium-mobile-light-390x844` viewport project.
- `scripts/visual-pointer-proof.ts`
  - Added positional artifact-path fallback in addition to `--artifact` flag parsing.
- `tests/source-registry.test.ts`
  - Updated expected anchor ownership and added `line > 0` assertions.
- `tests/visual-pointer-capture.spec.ts`
  - Expanded coverage for anchored `/penny-list` and `/store-finder` packets plus unanchored fallback.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/source-registry.test.ts` ✅
- `npx tsx --import ./tests/setup.ts --test tests/penny-list-utils.test.ts` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --project=chromium-mobile-light-390x844 --workers=1` ✅
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅

---

## 2026-02-24 - Codex - Submit-Find Name Priority Hardening + Unit Mismatch Resolution

**Goal:** Complete both requested tasks: fix the outstanding unit mismatch and enforce stricter `item_name` source priority in submit-find.

**Status:** ✅ Completed

### Changes

- `app/api/submit-find/route.ts`
  - Added trusted item-name source guards for self-enrichment (`staging`, `serpapi`, `manual`).
  - Insert-time `item_name` now follows strict order: trusted self-enriched name first, otherwise user fallback.
  - Carried trusted `item_name` provenance forward on insert when self-enrichment supplies the chosen name.
  - Realtime SerpApi now only updates `item_name` when current name source is untrusted.
- `tests/submit-find-route.test.ts`
  - Updated self-enrichment tests for trusted-source behavior.
  - Added regression coverage that untrusted historical names are not reused.
  - Updated expectation to reflect strict trusted-self precedence over user-typed text.
- `tests/penny-list-utils.test.ts`
  - Resolved casing mismatch by aligning expectation with current normalization behavior (`M18 FUEL`).

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/submit-find-route.test.ts` ✅ (14/14)
- `npx tsx --import ./tests/setup.ts --test tests/penny-list-utils.test.ts` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅ (5/5)

---

## 2026-02-23 - Codex - Visual Pointer v1 Hardening (Source Precision + Anchored Capture + 390x844)

**Goal:** Complete the highest-impact remaining Visual Pointer v1 hardening gaps so live behavior matches the approved two-route pilot plan.

**Status:** ✅ Completed (with one unrelated pre-existing verify blocker)

### Changes

- `lib/visual-pointer/source-registry.ts`
  - replaced all placeholder `line: 0` values with concrete source lines,
  - corrected ownership for filter and card anchors (`PennyListFilters`, `PennyListCard`).
- `tests/source-registry.test.ts`
  - updated expected penny-list search-input owner to `PennyListFilters`,
  - added `line > 0` assertions for known anchor metadata.
- `tests/visual-pointer-capture.spec.ts`
  - refactored capture helpers,
  - added anchored capture assertion on `/penny-list` (`penny-list.report-cta`),
  - retained unanchored heading assertion (`source_unavailable`),
  - added anchored capture assertion on `/store-finder` (`store-finder.search-input`).
- `playwright.config.ts`
  - added explicit `chromium-mobile-light-390x844` project (iPhone 12 viewport) to satisfy dual mobile-size validation.
- `scripts/visual-pointer-proof.ts`
  - argument parser now accepts either `--artifact <path>` or positional `<path>` for npm/shell compatibility.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/source-registry.test.ts` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-mobile-light --workers=1` ✅
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-mobile-light-390x844 --workers=1` ✅
- `npm run visual-pointer:proof -- --artifact <artifact-path>` ✅ (script succeeds; npm still warns about `--artifact` forwarding but positional fallback handles execution)
- `npm run e2e:smoke` ✅
- `npm run verify:fast` ⚠️ fails due unrelated carryover unit assertion in `tests/penny-list-utils.test.ts` from dirty local file `lib/penny-list-utils.ts` (not part of this slice)

---

## 2026-02-22 - Codex - Visual Pointing Tool v1 Canonical Plan (Two-Route Pilot)

**Goal:** Convert founder-provided Visual Pointing Tool v1 specification into a repo-canonical, implementation-ready plan artifact with explicit slices, contracts, and verification lanes.

**Status:** ✅ Completed (planning-only docs scope)

### Changes

- Added canonical implementation plan:
  - `.ai/impl/visual-pointing-tool.md`
- Plan includes:
  - locked product decisions (dev-only overlay, two-route pilot, mobile-first weighting),
  - complete interface contracts (`VisualPointerCapture`, selector/source types),
  - API contract + guardrails for `POST /api/dev/visual-pointer/report`,
  - pilot anchor inventory for `/penny-list` and `/store-finder`,
  - six implementation slices with explicit dependency, acceptance, rollback, and verification lane per slice,
  - replay/proof architecture using Playwright as validation layer (not primary capture UI).
- Updated continuity snapshot:
  - `.ai/STATE.md` updated to reflect the new canonical plan.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - Context pack: `reports/context-packs/2026-02-22T22-38-13/context-pack.md`
- `npm run verify:fast` N/A (docs-only planning change; no runtime code-path mutation)
- `npm run e2e:smoke` N/A (docs-only; no route/form/API/navigation/UI-flow mutation)
- `npm run e2e:full` N/A (docs-only; FULL triggers not applicable)

---

## 2026-02-22 - Claude Code - Anti-Spam Protections for Report a Find

**Goal:** Purge remaining spam Ryobi generator entries from Supabase and build three-layer anti-spam protections to prevent future button-mashing spam.

**Status:** ✅ Completed

### Changes

- Deleted 5 remaining PA spam entries from Supabase (Feb 21 spam session). Preserved 2 organic WV/TX reports.
- `app/api/submit-find/route.ts`:
  - Duplicate SKU throttle (10-min window per IP+SKU)
  - Rapid-fire cooldown (5-second minimum between submissions per IP)
  - Both in-memory Maps with automatic pruning (same pattern as existing rate limiter)
- `components/report-find/ReportFindFormClient.tsx`:
  - 3-second post-submit cooldown on the submit button
- `.ai/STATE.md` and `.ai/SESSION_LOG.md` updated

### Verification

- `npm run verify:fast` ✅ (lint + typecheck + unit 71/71 + build)
- `npm run e2e:smoke` ✅ (5/5 including report-find basket flow)

---

## 2026-02-22 - Codex - Weekly Memory Integrity Trend Reporting (Phase 3 Hardening Slice)

**Goal:** Complete the remaining founder-autonomy hardening slice by shipping weekly checkpoint pass-rate and integrity-score trend reporting with durable artifacts and fail-closed SLO signaling.

**Status:** ✅ Completed (tooling + docs)

### Changes

- Extended `scripts/ai-memory.ts` with:
  - new command: `trend` (`--days=<n>` support),
  - checkpoint run-history ledger write path on each `ai:checkpoint` run:
    - `reports/memory-integrity/checkpoint-history.jsonl`,
  - context-pack backfill ingestion so existing context packs seed baseline trend history,
  - weekly artifact generation:
    - `reports/memory-integrity-weekly/<YYYY-MM-DD>/summary.md`
    - `reports/memory-integrity-weekly/<YYYY-MM-DD>/metrics.json`,
  - strict fail-closed behavior for trend SLO breaches (pass-rate/integrity) and empty history windows.
- Added npm wrappers in `package.json`:
  - `ai:memory:trend`
  - `ai:memory:trend:30`
- Updated canonical autonomy docs:
  - `.ai/impl/founder-autonomy-memory-hardening.md`
  - `.ai/topics/FOUNDER_AUTONOMY_CURRENT.md`
  - `.ai/BACKLOG.md`

### Verification

- `npm run ai:memory:trend` ✅
  - Artifact: `reports/memory-integrity-weekly/2026-02-22/summary.md`
  - Artifact: `reports/memory-integrity-weekly/2026-02-22/metrics.json`
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - Context pack: `reports/context-packs/2026-02-22T21-31-09/context-pack.md`
- `npm run ai:memory:drill` ✅
- `npm run ai:memory:drill:heading` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` N/A (no route/form/API/navigation/UI-flow change)
- `npm run e2e:full` N/A (FULL triggers not applicable)

---
