# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-05 - Codex - Monumetric Production Recovery Deployment (S1-S4)

**Goal:** Execute founder-approved emergency monetization recovery plan by promoting S1-S3 to production, auditing live behavior, then hardening S4 CSP when residual under-serving remained.

**Status:** ✅ Completed

### Changes

- Promotion to production:
  - merged PR `#148` (`f00c246`) into `main` to ship Monumetric S1-S3 runtime/placement recovery.
  - merged PR `#149` (`de6bd28`) into `main` to ship S4 CSP compatibility hardening.
- Code change scope for S4:
  - `next.config.js` only:
    - `script-src` + `https://script.4dex.io`
    - `connect-src` + `https://mp.4dex.io`
    - `connect-src` + `https://apex.go.sonobi.com`
- Live production audit artifacts:
  - pre-S1/S3 baseline: `reports/monumetric-audit/2026-03-05T16-47-41-pre-s1s3/`
  - post-S1/S3: `reports/monumetric-audit/2026-03-05T16-51-44-post-s1s3/`
  - post-S4: `reports/monumetric-audit/2026-03-05T17-06-22-post-s4/`

### Summary

- S1-S3 is now live on production `main`.
- In sampled mobile/desktop audits, in-content opportunities now render on `/penny-list` and guide surfaces where pre-S1/S3 had missing route coverage.
- S4 removed previously observed `mp.4dex.io` / `apex.go.sonobi.com` CSP blocker signatures from the sampled window; remaining noise shifted to different third-party frame/script hosts.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅
- `npm run ai:proof -- /guide /penny-list` ⚠️ first attempt blocked by unhealthy occupied port 3001; follow-up capture succeeded:
  - artifacts: `reports/proof/2026-03-05T22-03-16/`
- FULL live-console artifacts from this session:
  - `reports/playwright/console-report-2026-03-05T21-54-41-027Z.json`
  - `reports/playwright/console-report-2026-03-05T21-56-28-919Z.json`
  - `reports/playwright/console-report-2026-03-05T21-59-13-802Z.json`
  - `reports/playwright/console-report-2026-03-05T22-00-15-603Z.json`

### Branch Hygiene

- Merge PRs:
  - `#148` -> `main` at `f00c246`
  - `#149` -> `main` at `de6bd28`
- Working branch for S4 implementation: `dev-s4-csp-20260305` (remote auto-deleted after merge)
- Carryover untracked files (unchanged, unrelated):
  - `archive/root-level-orphans/`
  - `emails/monumetric-reengagement-draft.md`
  - `emails/monumetric-reengagement-final.md`

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
