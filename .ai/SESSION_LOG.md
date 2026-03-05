# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-05 - Codex - Live Console CSP False-Positive Fix (FULL Lane Unblocked)

**Goal:** Clear the remaining `e2e:full` blocker without broadening CSP policy in `next.config.js`.

**Status:** ✅ Completed

### Changes

- `tests/live/console.spec.ts`
  - fixed blocked-domain extraction so CSP parsing uses the actual blocked target before directive text.
  - added safe handling for non-host CSP targets (for example `data:` URIs) so they do not get misclassified as host blockers.
  - preserved fallback parsing for variants like `Fetch API cannot load https://...`.

### Summary

- Root cause was a test-classifier bug, not a runtime CSP allowlist gap.
- The failing messages on `/store-finder` and `/about` were `Connecting to 'data:text/xml...'` entries.
- The prior extractor incorrectly pulled `https://www.google-analytics.com` from the CSP directive allowlist text and marked it as a critical blocked host.
- After the parser fix, critical CSP counts are `0` and FULL passes.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:full` ✅ (first run had one transient local connection flake; immediate rerun passed clean)
- `npm run e2e:smoke` ✅
- console report artifacts with `criticalCspViolations=0`:
  - `reports/playwright/console-report-2026-03-05T06-32-09-456Z.json`
  - `reports/playwright/console-report-2026-03-05T06-33-39-485Z.json`
  - `reports/playwright/console-report-2026-03-05T06-36-04-913Z.json`
  - `reports/playwright/console-report-2026-03-05T06-37-06-266Z.json`
- Writer lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "fix live-console CSP false-positive extraction and verify full lane"` ✅

### Branch Hygiene

- Branch: `dev-recovery-20260305`
- Scope: live-console CSP parser fix only
- Push: not pushed
- Carryover untracked files (unchanged, unrelated):
  - `archive/root-level-orphans/`
  - `emails/monumetric-reengagement-draft.md`
  - `emails/monumetric-reengagement-final.md`

---

## 2026-03-05 - Codex - Dev Branch Recovery + Clean Integration Lane

**Goal:** Recover from mixed `dev` history by preserving all current work in a safety snapshot, then creating a clean integration branch from `main` with only high-value salvage commits.

**Status:** ✅ Completed

### Changes

- Created a non-destructive safety snapshot branch:
  - `backup/dev-snapshot-20260305-pre-recovery`
  - snapshot commit: `7cf09ca` (`chore(snapshot): preserve pre-recovery dev working tree (2026-03-05)`)
- Created a clean recovery integration branch from `origin/main`:
  - `dev-recovery-20260305`
- Salvaged only selected non-redesign work onto the recovery branch:
  - `ad9c2e4` — retail price migration (`supabase/migrations/031_item_cache_include_retail_price.sql`)
  - `a53f42a` — manual fast-track/manual-enrich script fixes (`scripts/manual-cade-fast-track.ts`, `scripts/manual-enrich.ts`, `package.json`)
  - `e781cb3` — Monumetric balanced parent/child plans + `S1` lifecycle runtime/tests/docs
  - `5504ac8` — trimmed `app/layout.tsx` to keep only Monumetric lifecycle wiring (removed unrelated carried-over layout edits from salvage)
- Kept redesign-heavy and Roo-experimental commit history out of this branch on purpose.
- Overnight continuation on the same recovery branch:
  - added `NEXT_PUBLIC_VISUAL_POINTER_ENABLED=true` to `package.json` `e2e:full` so visual-pointer capture tests are enabled in production-mode test builds.
  - added commit-triage artifact: `.ai/impl/dev-branch-recovery-triage-2026-03-05.md`.
  - pushed both branches to origin:
    - `dev-recovery-20260305`
    - `backup/dev-snapshot-20260305-pre-recovery`

### Summary

- Recovery branch now isolates business-critical work from mixed `dev` history without deleting any prior work.
- Snapshot branch preserves full recoverability of the pre-recovery state.
- The recovered branch is now a safer base for future implementation and PR review.
- `e2e:full` no longer fails on visual-pointer toggle absence; remaining full-lane blocker is a live-console CSP gate on `www.google-analytics.com` for `/store-finder` and `/about`.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ⚠️ rerun after script fix:
  - visual-pointer capture specs now pass.
  - full suite still fails due live-console critical CSP finding (`www.google-analytics.com`) on `/store-finder` and `/about`.
- Writer lock:
  - `npm run ai:writer-lock:claim -- codex "record dev-branch recovery branch creation and commit triage"` ✅
  - `npm run ai:writer-lock:status` ✅ (active under `codex` during memory updates)

### Branch Hygiene

- Recovery branch: `dev-recovery-20260305` (ahead `5` from `origin/main`)
- Snapshot branch: `backup/dev-snapshot-20260305-pre-recovery`
- Push: pushed
- Draft PR: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/pull/148`
- Carryover untracked files (not touched by this objective):
  - `archive/root-level-orphans/`
  - `emails/monumetric-reengagement-draft.md`
  - `emails/monumetric-reengagement-final.md`

---

## 2026-03-03 - Codex - Report Find Share + Basket UX Hardening

**Goal:** Finish the founder-requested `/report-find` follow-up slice by making the Facebook copy SKU-only, restoring the basket cap to `10`, safely blocking restored over-limit baskets, and explaining the Back-button workflow.

**Status:** ✅ Completed

### Changes

- `components/report-find/ReportFindFormClient.tsx`
  - moved the Facebook/share text onto a submit-time snapshot so the success-state preview/copy reflects the actual submitted location/date instead of live form edits.
  - replaced the name-based share text with a SKU-only preview/copy flow, renamed the action to `Copy Facebook post`, added the inline `<details>` preview, and added the helper line clarifying that only plain-text SKUs are copied.
  - restored the basket cap to `10`, removed the always-visible basket-limit helper, added the saved-basket over-limit warning/submit disable rule, and shortened the add-time full-basket message.
  - added the explicit Penny List Back-button guidance in the intro box.
  - fixed the prefill hydration race so a saved full basket now blocks extra prefill adds deterministically instead of showing a false success message.
- `lib/constants.ts`
  - changed `REPORT_FIND_BASKET_ITEM_LIMIT` from `30` back to `10` so the client and route share one source of truth again.
- `lib/report-find-share.ts`
  - added a pure share formatter that builds stable SKU-only Facebook text with location/date context and quantity suffixes only when quantity is greater than `1`.
- `tests/report-find-batch.spec.ts`
  - added coverage for the success-state preview/copy text, the restored valid `10`-item submit regression, and the restored over-limit basket warning/disable flow.
- `tests/report-find-prefill.spec.ts`
  - added the `11th` manual add rejection coverage and the prefill-at-cap rejection coverage.
- `tests/report-find-share.test.ts`
  - added exact-string unit coverage for the new share formatter.
- `tests/smoke-critical.spec.ts`
  - added smoke coverage for the Back-button guidance in the report-find explainer.

### Summary

- Facebook/share text on `/report-find` now copies clean plain text with formatted SKUs only, plus the submitted location/date line and PennyCentral CTA.
- The basket is back to a hard `10`-item cap on both client and server, without advertising that cap in normal UI.
- Older saved baskets above `10` are preserved, clearly warned, and blocked until the user trims them into separate batches.

### Verification

- `npm run ai:memory:check` ✅
- `npm run lint:colors` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx playwright test tests/report-find-prefill.spec.ts tests/report-find-batch.spec.ts tests/smoke-critical.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `npx playwright test tests/report-find-prefill.spec.ts tests/report-find-batch.spec.ts tests/smoke-critical.spec.ts --project=chromium-mobile-light --workers=1` ✅
- UI proof captured via one-off local Playwright script:
  - artifacts: `reports/proof/2026-03-03-report-find-share-proof/`
  - desktop proof: `reports/proof/2026-03-03-report-find-share-proof/report-find-success-desktop-light.png`
  - mobile proof: `reports/proof/2026-03-03-report-find-share-proof/report-find-success-mobile-light.png`
  - console: `reports/proof/2026-03-03-report-find-share-proof/console-errors.txt`

### Branch Hygiene

- Branch: `dev`
- Scope: report-find share/cap/preview hardening + targeted regression coverage
- Push: pending at memory-write time

---

## 2026-03-03 - Codex - Report Find Basket Submit Hotfix

**Goal:** Restore the `/report-find` basket flow so multi-item baskets submit again and stop the blank draft `Item Name` field from blocking `Submit all`.

**Status:** ✅ Completed

### Changes

- `lib/constants.ts`
  - added `REPORT_FIND_BASKET_ITEM_LIMIT = 30` as the shared basket-size source of truth.
- `app/api/submit-find/route.ts`
  - aligned the batch submit cap to the shared 30-item basket limit.
  - added a clear oversized-basket error message instead of the generic schema failure text.
- `components/report-find/ReportFindFormClient.tsx`
  - removed the draft `Item Name` field from native submit validation so a filled basket no longer gets blocked by an empty draft row.
  - enforced the same 30-item limit on manual adds and prefilled basket adds.
  - added visible basket-limit copy so the cap is not hidden from users.
- `tests/report-find-batch.spec.ts`
  - kept the mixed-result batch-submit coverage.
  - added a regression test that restores a 16-item basket from session storage and verifies submit still works while the draft item fields are blank.
- `tests/submit-find-route.test.ts`
  - updated the oversized-batch route test to use the shared 30-item limit and assert the new user-facing error message.

### Summary

- Root cause 1: the browser was validating the empty draft `Item Name` input on form submit even when the basket was already populated, so `Submit all` got blocked before the request fired.
- Root cause 2: the API only accepted 10 basket items while the UI allowed more, so a 16-item basket failed with the same generic error for every item.
- The basket submit path now accepts up to 30 items in one request, the draft field no longer blocks batch submit, and oversized baskets now fail with a specific message instead of a misleading required-fields error.

### Verification

- Before fix reproduction:
  - `npx playwright test tests/report-find-batch.spec.ts --project=chromium-desktop-light --workers=1` ❌
  - failure signature: the batch-submit UI test never reached the success summary because `Submit all` was blocked by the empty draft `Item Name` field.
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx tsx --import ./tests/setup.ts --test --test-name-pattern "batch submit rejects more than max allowed items" tests/submit-find-route.test.ts` ✅
- `$env:SUBMIT_FIND_DRY_RUN='false'; npx tsx --import ./tests/setup.ts --test --test-name-pattern "batch submit supports partial success in one request" tests/submit-find-route.test.ts` ✅
- `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; npx playwright test tests/report-find-batch.spec.ts --project=chromium-desktop-light --workers=1` ✅
- Playwright proof screenshots captured via temporary local proof spec (removed after capture):
  - artifacts: `reports/proof/2026-03-03T06-00-57-440Z/`
  - console: `reports/proof/2026-03-03T06-00-57-440Z/console-errors.txt`

### Branch Hygiene

- Branch: `dev`
- Scope: report-find basket submit hotfix + regression coverage
- Push: not pushed

---

## 2026-03-03 - Codex - Site Recovery S1 Hydration Stability

**Goal:** Remove the global hydration mismatch and lock the Penny List text regression before any visual site-recovery slice starts.

**Status:** ✅ Completed

### Changes

- `app/layout.tsx`
  - replaced the Grow DOM-insertion bootstrap with `next/script` `afterInteractive` scripts so the server-rendered head is no longer mutated before hydration.
- `lib/penny-list-utils.ts`
  - added `DIY` to the protected uppercase word set in `normalizeProductName(...)`.
- `tests/visual-smoke.spec.ts`
  - expanded the route sweep to all nine audited recovery routes and made hydration mismatch console output a first-class failure.
- `tests/smoke-critical.spec.ts`
  - added a Penny List rendered-surface assertion that fails if `Diy` appears.
- `tests/penny-list-utils.test.ts`
  - added deterministic helper coverage for mixed-case `DIY` input.
- `.ai/impl/site-recovery-program.md`
  - marked the parent recovery program in progress with `S1` shipped and `S2` next.
- `.ai/impl/site-recovery-s1-hydration-stability.md`
  - marked the slice shipped and recorded the implementation outcome.
- `.ai/plans/INDEX.md`
  - updated the registry status to match the canonical `.ai/impl/` plan.
- `.ai/BACKLOG.md`
  - advanced the immediate next slice from `S1` to `S2 - Homepage Proof Front Door`.
- `.ai/STATE.md`
  - updated current project reality to reflect the shipped hydration fix and next slice.
- `.ai/LEARNINGS.md`
  - documented that direct `node` execution is the wrong lane for repo TypeScript test files.

### Summary

- The audited hydration mismatch is no longer reproducible across `/`, `/guide`, `/penny-list`, `/report-find`, `/faq`, `/what-are-pennies`, `/store-finder`, `/about`, and `/transparency`.
- The Grow integration now loads in a hydration-safe way without mutating head order before React starts.
- The site-recovery program can now move from stabilization into `S2 - Homepage Proof Front Door`.

### Verification

- Before fix reproduction:
  - `$env:PLAYWRIGHT_BASE_URL='http://localhost:3001'; npx playwright test tests/visual-smoke.spec.ts --project=chromium-desktop-light --workers=1` ❌
  - failure signature: `A tree hydrated but some attributes of the server rendered HTML didn't match...`
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `$env:PLAYWRIGHT_BASE_URL='http://localhost:3001'; npx playwright test tests/visual-smoke.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `$env:PLAYWRIGHT_BASE_URL='http://localhost:3001'; npx playwright test tests/smoke-critical.spec.ts --project=chromium-desktop-light --workers=1` ✅
- `npm run ai:proof -- / /guide /penny-list /report-find /faq /what-are-pennies /store-finder /about /transparency` ✅
  - artifacts: `reports/proof/2026-03-03T00-44-54/`
  - console: `reports/proof/2026-03-03T00-44-54/console-errors.txt`

### Branch Hygiene

- Branch: `dev`
- Scope: `S1` hydration fix + regression coverage + continuity updates
- Push: not pushed
