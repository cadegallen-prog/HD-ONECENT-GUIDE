# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-03 - Claude Code (Sonnet 4.6) - Branch Cleanup & Consolidation

**Goal:** Clean up git branch/worktree mess on dev — commit 38 uncommitted files, remove orphaned worktrees, delete 14 stale local branches, 4 stale remote branches, close PR #143.

**Status:** ✅ Implemented

### Changes

- Removed 2 orphaned worktrees (s2-homepage-proof, release-main) — git records pruned; s2-homepage-proof folder has a few locked log files (harmless, git-unaware)
- Committed 38 uncommitted files as 4 logical commits on dev
- Resolved rebase conflicts: test heading strings (kept remote's correct headings), BACKLOG.md (kept local newer version), added `/guide` route to visual-smoke
- Pushed rebased dev to origin (dev advanced `fdbc857` → `3a3a11b`)
- Synced local main with origin/main (fast-forward, 3 new commits)
- Deleted 14 stale local branches (pr-76 through pr-92, dead features, rescues)
- Deleted 4 stale remote branches (rescue, pr-84, ci-tiered-verification, claude/affiliate-program-analysis)
- Closed PR #143 as superseded with explanatory comment
- Added `archive/root-level-orphans/experimental_scraper/` and `archive/root-level-orphans/backups-legacy-scripts/` to `.gitignore` (37MB + PII patterns)

**Deviations from plan:**

- `backups-legacy-scripts/` scripts blocked by security scanner (PII patterns in content/filename) — gitignored entire directory instead of committing
- `s2-homepage-proof` folder has 3 locked log files remaining (a process holds them) — git has no record of it; cleanup is harmless deferred work

### Next Steps

- Dependabot PR triage (see plan file Follow-Up section) — merge low-risk PRs first, review zod 3→4 separately

---

## 2026-03-03 - Codex - Site Recovery S2 Homepage Proof Front Door

**Goal:** Ship the homepage recovery slice from a clean worktree so the site front door leads with proof, a clear focal point, and two obvious next paths instead of generic guide-first copy.

**Status:** ✅ Completed

### Changes

- `app/page.tsx`
  - replaced the centered guide-first homepage with a proof-first composition built around the new hero, path split, proof strip, and a compact closing explainer.
  - removed the old `TodaysFinds`, tools, community CTA, and transparency/contact homepage sections that were diluting the first screen.
- `components/home/HomeProofHero.tsx`
  - added a split hero with live-data stat cards, the locked two-CTA hierarchy, a proof card that can show real recent finds, and a fallback proof state when recent data is unavailable.
- `components/home/HomePathSplit.tsx`
  - added the beginner-vs-returning-user route split, while keeping `/report-find` and `/store-finder` demoted to supporting links.
- `components/home/HomeProofStrip.tsx`
  - added a recent-find proof grid sourced from homepage data and avoided duplicating the hero item when enough proof cards are available.
- `tests/smoke-critical.spec.ts`
  - updated the homepage heading assertions for the new front door.
  - repaired the stale `/guide` smoke check so it now matches the current Part 1 intro + chapter list that actually renders on the guide hub.
- `tests/visual-smoke.spec.ts`
  - updated the homepage heading and added homepage CTA/path-split assertions across desktop/mobile light/dark runs.
- `.ai/impl/site-recovery-program.md`
  - synced the canonical site-recovery parent plan into this clean worktree because shared memory already referenced it but `origin/dev` did not contain it.
- `.ai/impl/site-recovery-s1-hydration-stability.md`
  - synced the prerequisite slice doc into this clean worktree for continuity.
- `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`
  - synced the homepage slice plan into this clean worktree so the implemented slice has its canonical repo path.
- `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
  - synced the next planned slice doc into this clean worktree so the next step is durable.
- `.ai/topics/SITE_RECOVERY_CURRENT.md`
  - synced the current-state audit into this clean worktree so the recovery context survives past chat history.
- `.ai/plans/INDEX.md`
  - synced the planning registry bridge so the copied `.ai/impl` recovery docs are discoverable from the plan index again.

### Summary

- The homepage now opens with a proof-first split layout that tells visitors what Penny Central is and gives them two clear choices: learn the system or open the live Penny List.
- Real recent-find proof cards now sit near the top of the page when recent data is available, while the fallback state still keeps the front door specific and useful when recent data is sparse.
- The clean worktree now also contains the canonical site-recovery docs that the shared memory layer already referenced, so future agents can continue from repo files instead of chat-only context.

### Verification

- `python C:\Users\cadeg\.codex\skills\pc-scope-guard\scripts\scope_guard.py` ✅
- `npm run lint:colors` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:3002'; npx playwright test tests/visual-smoke.spec.ts --project=chromium-desktop-light --project=chromium-desktop-dark --project=chromium-mobile-light --project=chromium-mobile-dark --workers=1` ✅
- `npx tsx scripts/ai-proof.ts /` ✅
  - artifacts: `reports/proof/2026-03-03T10-15-22/`
- `npx tsx scripts/ai-proof.ts --mode=test /` ✅
  - artifacts: `reports/proof/2026-03-03T10-16-48/`

### Branch Hygiene

- Branch: `codex/s2-homepage-proof-front-door-20260303`
- Scope: homepage recovery slice + smoke maintenance + canonical site-recovery doc sync
- Push: not pushed

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

