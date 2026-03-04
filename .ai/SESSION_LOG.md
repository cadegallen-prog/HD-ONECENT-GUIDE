# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-04 - GitHub Copilot (GPT-5.3-Codex) - Manual Workflow Split + Founder Fast-Track Validation

**Goal:** Separate enrichment-only behavior from founder direct-submit behavior, correct the bad-state DAP row, and validate no-credit founder upload path end-to-end.

**Status:** ✅ Completed

### Changes

- `scripts/manual-cade-fast-track.ts`
  - fixed keyed payload parsing so SKU-keyed JSON maps are processed as item lists.
  - fixed SKU validation handling to match `validateSku(...)` return contract (`error`-based), preventing all-valid payloads from being rejected.
- Supabase (`public."Penny List"`)
  - corrected DAP row (`SKU 1006465750`, id `ffbbf36b-e5d3-4010-b47d-b34712db960c`) `store_city_state` from `Manual Add` to `Georgia`.
- Founder fast-track execution
  - ran `manual:cade-fast-track` on founder-provided payload.
  - result: `cache_upserted=14`, `penny_list_created=14`, `penny_rows_enriched_by_cache=14`, `penny_rows_failed=0`.
  - report: `reports/manual-cade-fast-track/2026-03-04T03-34-04.996Z.json`.
- Documentation updates
  - updated `docs/ENRICHMENT_CANON.md`, `docs/SCRAPING_COSTS.md`, `docs/FOUNDER-COMMAND-CENTER.md`, and added `docs/skills/manual-enrichment-fast-track-split.md`.

### Summary

- `/manual` is now documented as enrich-only for existing rows.
- `/manual:cade` is documented as founder direct submission path with no SerpAPI dependency.
- Founder path now reliably preserves scrape credits when pre-scraped payloads are available.

### Verification

- `npm run typecheck` ✅
- `npm run verify:fast` ✅
- Supabase row checks ✅ (DAP state corrected; 14 created fast-track rows confirmed `Georgia`, `complete`, quantity `0`)

### Branch Hygiene

- Branch: `dev`
- Scope: manual workflow scripts + docs/memory updates + founder data operation
- Push: not pushed

## 2026-03-04 - Codex - Homepage Proof Hardening Follow-Up

**Goal:** Harden the shipped homepage proof slice after review by fixing brittle product-image behavior, correcting misleading proof metadata, and tightening the homepage proof assertions.

**Status:** ✅ Completed

### Changes

- `components/home/HomeProofImage.tsx`
  - added a client-side homepage proof image wrapper that degrades to an intentional fallback state instead of leaving blank media panels when remote product images fail.
  - added a safer canonical-source retry path so smaller homepage proof variants can fall back to the stored original source before showing the explicit fallback state.
- `components/home/HomeProofHero.tsx`
  - replaced the raw homepage hero/supporting proof `<img>` usage with the new guarded proof-image component.
  - stopped requesting brittle `1000px` hero imagery and moved the homepage proof surface onto `600px`/`400px` variants that better match the repo’s image-cache assumptions.
  - changed the misleading hero stat copy from item-count-as-reports to a more precise `Recent items` readout.
  - changed the freshness stat to use the newest `dateAdded` or `lastSeenAt` timestamp across the visible proof set instead of assuming the first item is freshest.
  - replaced the misleading quantity pill (`X reported`) with concrete SKU metadata.
- `components/home/HomeProofStrip.tsx`
  - replaced the raw proof-strip image rendering with the guarded proof-image component and the safer `600px` variant target.
- `lib/home-proof.ts`
  - added a small helper for selecting the freshest homepage proof timestamp deterministically.
- `tests/home-proof.test.ts`
  - added direct coverage for the freshest-proof timestamp helper so the corrected hero stat logic is pinned down in unit tests.
- `tests/smoke-critical.spec.ts`
  - added a homepage assertion that the hero proof media resolves to either `loaded` or `fallback`, so smoke now catches the blank-hero failure mode.
- `tests/visual-smoke.spec.ts`
  - added the same homepage proof-media resolution assertion across desktop/mobile light/dark runs.

### Summary

- The homepage proof surface no longer depends on optimistic remote image loads to look complete.
- The proof-first hero now uses more trustworthy metadata: freshest activity is actually freshest, and quantity no longer implies multiple reports when it only reflects units found in one submission.
- The verification lane now protects the proof panel itself, not just the headline and CTA copy.

### Verification

- `npm run lint:colors` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx playwright test tests/visual-smoke.spec.ts --project=chromium-desktop-light --project=chromium-desktop-dark --project=chromium-mobile-light --project=chromium-mobile-dark --workers=1` ✅
  - HTML report: `reports/playwright/html/index.html`
- `npx tsx scripts/ai-proof.ts --mode=test /` ⚠️ not completed
  - blocker: temporary background server launch for the wrapper command was blocked by the shell policy in this session, so screenshot evidence comes from the saved Playwright HTML report instead.

### Branch Hygiene

- Branch: `dev`
- Scope: homepage proof hardening follow-up only
- Push: not pushed

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
