# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-05 - Codex - Monumetric S3 Placement Coverage Recovery

**Goal:** Implement `S3` from the balanced Monumetric stabilization plan to recover controlled in-content coverage on `/guide` and `/penny-list` without touching exclusions or risky runtime paths.

**Status:** ✅ Completed

### Changes

- `lib/ads/launch-config.ts`
  - added `NEXT_PUBLIC_MONU_DENSITY_PROFILE` gate (`balanced` default, `conservative` rollback).
  - added profile-aware slot mapping via `getRouteInContentSlotIds(...)`.
  - added guide/penny-list in-content slot policies and tightened per-slot `maxPerRoute` caps to `1`.
- `lib/ads/slot-plan.ts`
  - extended active route plan with `inContentSlotIds`.
  - ensured slot policies are emitted for all in-content opportunities.
- `components/ads/route-ad-slots.tsx`
  - added `densityProfile` and `inContentSlotIds` to route payload metadata.
- `components/ads/monumetric-in-content-slot.tsx`
  - made slot component reusable per slot ID (`slotId`, `slotKey`) with stable script IDs.
- `app/guide/page.tsx`
  - added lead + follow-up in-content opportunities for balanced profile.
- `app/penny-list/page.tsx`
  - passed route-mapped penny-list in-content slot IDs into client rendering.
- `components/penny-list-client.tsx`
  - rendered in-feed in-content opportunity above results when available.
- `tests/ads-launch-config.test.ts`
  - added density-profile + in-content-slot mapping assertions.
- `tests/ads-slot-plan.test.ts`
  - added route-plan assertions for `inContentSlotIds` and updated slot policy expectations.

### Summary

- `S3` balanced density recovery is now implemented locally with profile gating and slot-cap protections.
- `/report-find` remains excluded and CSP policy was intentionally unchanged in this slice.
- Next planned slice is `S4` CSP compatibility hardening.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅
- `npm run ai:proof -- /guide /penny-list` ✅
  - artifacts: `reports/proof/2026-03-05T07-45-48/`
- full-lane console artifacts:
  - `reports/playwright/console-report-2026-03-05T07-39-17-156Z.json`
  - `reports/playwright/console-report-2026-03-05T07-40-55-632Z.json`
  - `reports/playwright/console-report-2026-03-05T07-43-38-289Z.json`
  - `reports/playwright/console-report-2026-03-05T07-44-39-703Z.json`

### Branch Hygiene

- Branch: `dev-recovery-20260305`
- Scope: Monumetric `S3` placement coverage only
- Push: pending

---

## 2026-03-05 - Codex - Monumetric S2 Placeholder Stability + Empty-Slot Collapse

**Goal:** Implement `S2` from the balanced Monumetric stabilization plan so ad wrappers reserve space and collapse only when truly empty after a controlled timeout.

**Status:** ✅ Completed

### Changes

- `lib/ads/monumetric-slot-shell.tsx` (new)
  - added shared slot-shell behavior and `useMonumetricSlotCollapse(...)` hook.
  - implemented timeout-gated empty-slot collapse with mutation-observer recovery when creatives appear later.
- `lib/ads/launch-config.ts`
  - added `NEXT_PUBLIC_MONU_COLLAPSE_EMPTY` gate via `MONUMETRIC_LAUNCH_CONFIG.slotShell.collapseEmptyEnabled`.
  - added stable per-slot policy metadata (reserve min height + collapse timeout + max-per-route + viewport enablement) for in-content and mobile sticky slots.
- `lib/ads/slot-plan.ts`
  - extended route plan output with `slotPolicies` so runtime metadata now includes placeholder behavior contracts.
- `components/ads/monumetric-in-content-slot.tsx`
  - migrated wrapper rendering to `MonumetricSlotShell`.
  - preserved existing slot queue script while adding reserve/collapse behavior.
- `components/ads/mobile-sticky-anchor.tsx`
  - added collapse hook integration and policy-driven reserve height.
  - collapse now respects both sheet-open state and empty-slot timeout behavior.
- `components/ads/route-ad-slots.tsx`
  - emitted `slotPolicies` and `collapseEmptyEnabled` into route-plan JSON payload.
- `tests/ads-launch-config.test.ts`
  - added assertions for slot-shell config and policy helper output.
- `tests/ads-slot-plan.test.ts`
  - added assertions for per-route `slotPolicies` output.

### Summary

- `S2` placeholder stability is now implemented on the recovery branch with reversible env-gated collapse behavior.
- Route eligibility and CSP policy were intentionally left unchanged.
- `/report-find` exclusion behavior was not touched.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅
- `npm run ai:proof -- /guide /penny-list` ✅
  - artifacts: `reports/proof/2026-03-05T07-08-05/`
- live console artifacts from full run:
  - `reports/playwright/console-report-2026-03-05T07-09-31-176Z.json`
  - `reports/playwright/console-report-2026-03-05T07-11-01-217Z.json`
  - `reports/playwright/console-report-2026-03-05T07-13-42-460Z.json`
  - `reports/playwright/console-report-2026-03-05T07-14-43-973Z.json`

### Branch Hygiene

- Branch: `dev-recovery-20260305`
- Scope: Monumetric `S2` placeholder stability only
- Push: pending

---

## 2026-03-05 - Codex - Live Console CSP False-Positive Fix (FULL Lane Unblocked)

**Goal:** Clear the remaining `e2e:full` blocker without broadening CSP policy in `next.config.js`.

**Status:** ✅ Completed

### Changes

- `tests/live/console.spec.ts`
  - fixed blocked-domain extraction so CSP parsing uses the actual blocked target before directive text.
  - added safe handling for non-host CSP targets (for example `data:` URIs) so they do not get misclassified as host blockers.
  - preserved fallback parsing for variants like `Fetch API cannot load https://...`.
- follow-up integration readiness steps:
  - committed and pushed parser/memory updates on `dev-recovery-20260305` (`ec4dfbc`).
  - watched PR #148 CI to completion (`Full QA Suite`, `quality-fast`, and `smoke-e2e` all passed).
  - marked PR #148 ready for review (not draft) and posted a CI/status note:
    - `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/pull/148#issuecomment-4002680052`.

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
- CI status after push:
  - required branch-protection checks for `main`: `quality-fast` ✅, `smoke-e2e` ✅
  - `Full QA Suite` ✅
  - `SonarCloud Code Analysis` ❌ (non-required quality gate on this recovery PR)
- Writer lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "fix live-console CSP false-positive extraction and verify full lane"` ✅

### Branch Hygiene

- Branch: `dev-recovery-20260305`
- Scope: live-console CSP parser fix only
- Commit: `ec4dfbc`
- Push: pushed
- PR status: ready for review (not draft)
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
