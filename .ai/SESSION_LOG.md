# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

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

---

## 2026-03-02 - Codex - Site Recovery Planning Spine (S0)

**Goal:** Convert the site-recovery intent into durable repo memory so future agents can execute a coherent multi-slice recovery program without re-deriving it from chat.

**Status:** ✅ Completed

### Changes

- `.ai/topics/SITE_RECOVERY_CURRENT.md`
  - added the current-state audit for `/`, `/guide`, `/penny-list`, `/report-find`, `/faq`, `/what-are-pennies`, `/store-finder`, `/about`, and `/transparency`.
  - persisted founder-calibrated quality feedback so it does not die with the context window.
  - documented mobile issues, coherence issues, top 3 ROI improvements, and the hydration root-cause assessment.
- `.ai/impl/site-recovery-program.md`
  - created the authoritative parent recovery plan in `.ai/impl/`.
  - locked the program decisions, dependency order, stop/go rules, and immediate next task.
- `.ai/impl/site-recovery-s1-hydration-stability.md`
  - created the implementation-ready plan for the global hydration mismatch and Penny List text determinism fix.
- `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`
  - created the implementation-ready plan for the homepage redesign.
- `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
  - created the implementation-ready plan for rebuilding `/guide` into the canonical long-form guide and demoting supporting routes.
- `.ai/impl/site-recovery-s4-penny-list-mobile-focus.md`
  - created the implementation-ready plan for Penny List mobile hierarchy cleanup.
- `.ai/impl/site-recovery-s5-report-find-compression.md`
  - created the implementation-ready plan for reducing pre-form friction on `/report-find`.
- `.ai/impl/site-recovery-s6-typography-template-consistency.md`
  - created the implementation-ready plan for type/spacing/template normalization.
- `.ai/impl/site-recovery-s7-store-finder-supporting-role.md`
  - created the implementation-ready plan for calming Store Finder and demoting it to a supporting role.
- `.ai/impl/site-recovery-s8-trust-pages-hardening.md`
  - created the implementation-ready plan for `/about` and `/transparency`.
- `.ai/plans/INDEX.md`
  - registered the new parent plan and explicitly documented the `.ai/plans/` vs `.ai/impl/` authority split.
- `.ai/BACKLOG.md`
  - persisted the site-recovery program as the active product-priority sequence.
- `.ai/STATE.md`
  - updated current project reality so fresh agents can identify the new canonical program and next slice.
- `.ai/LEARNINGS.md`
  - documented the fail-closed rule that `.ai/SESSION_LOG.md` must stay at 5 live entries before rerunning `ai:checkpoint`.

### Summary

- Penny Central now has one repo-canonical site recovery program instead of chat-only intent.
- The planning spine is complete and the next implementation slice is unambiguous: `S1 - Hydration Stability`.
- Future agents now have a route-by-route audit, a parent plan, and eight child plans to execute in order.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts:
    - `reports/context-packs/2026-03-02T04-41-00/context-pack.md`
    - `reports/context-packs/2026-03-02T04-41-00/resume-prompt.txt`
- Runtime verification lanes: N/A (docs-only planning/memory work; no route/form/API/runtime code paths changed)

### Branch Hygiene

- Branch: `dev`
- Scope: planning docs + registry + shared memory
- Push: not pushed

---
