# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-04 - Codex - Overlap-First Multi-Agent Workflow Patch

**Goal:** Stop false freezes in multi-agent sessions by changing the repo workflow from "any dirty worktree blocks work" to "inspect overlap first," while keeping shared-memory locking strict.

**Status:** ✅ Completed

### Changes

- `AGENTS.md`
  - changed the branch-hygiene workflow so dirty files trigger an overlap check instead of an automatic stop.
  - codified that separate worktrees are optional, not default, and must not be created silently.
- `README.md`
  - aligned the branch-strategy workflow to the same overlap-first rule for dirty files and clarified that clean status is preferred, not mandatory, when unrelated carryover is disclosed.
- `.ai/CRITICAL_RULES.md`
  - replaced the hard-stop clean-worktree rule with an overlap-first dirty-worktree rule.
  - clarified that separate worktrees are optional isolation tools and the main repo folder on `dev` is the default workflow.
- `.ai/HANDOFF_PROTOCOL.md`
  - updated handoff branch-hygiene wording so dirty session-end state must include overlap status, not just a generic blocker label.
- `.ai/VERIFICATION_REQUIRED.md`
  - aligned branch-hygiene proof wording to require carryover file list + overlap status + reason when a worktree is dirty.
- `.ai/AI_ENABLEMENT_BLUEPRINT.md`
  - updated the enablement non-negotiable from a hard clean-worktree gate to an overlap-first worktree gate.
- `docs/skills/ship-safely.md`
  - updated the skill to continue when dirty files are unrelated and only stop on true file overlap.
- `docs/skills/single-writer-lock.md`
  - updated the multi-agent workflow to default to the main repo folder on `dev` and treat separate worktrees as optional.
- `PENNYCENTRAL_MASTER_CONTEXT.md`
  - added the founder preference that multi-agent workflow must favor simplicity, overlap-first dirty-file checks, and no silent worktree creation.
- `.ai/THREAD.md`, `.ai/STATE.md`
  - updated continuity so future agents inherit the new workflow rule instead of rediscovering the frustration from chat.

### Summary

- Agents should now stop only for true file overlap, unclear ownership, or missing shared-memory lock.
- Unrelated dirty files are no longer supposed to freeze the whole session.
- Separate worktrees are still allowed, but they are now documented as optional isolation tools rather than the default answer.

### Verification

- `npm run ai:writer-lock:status` ✅
- `npm run ai:writer-lock:claim -- codex "patch dirty-worktree policy for overlap-first multi-agent flow"` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-04T07-48-59/`

### Branch Hygiene

- Branch: `dev`
- Scope: workflow-policy docs + shared-memory updates only

## 2026-03-04 - Codex - Branch/Worktree Canon Clarification

**Goal:** Remove current repo-continuity confusion by restoring the missing root founder-context file, correcting stale shared-memory references, and documenting the verified branch/worktree topology in plain English.

**Status:** ✅ Completed

### Changes

- `PENNYCENTRAL_MASTER_CONTEXT.md`
  - restored the missing canonical root file from the archived orphan content so the repo read order points at a real founder-context document again.
- `.ai/BACKLOG.md`
  - corrected the founder-override note so the next recovery slice is `S3 - Guide Core Rebuild`, not the already-completed `S2 - Homepage Proof Front Door`.
  - added an explicit continuity note that `dev` remains the canonical integration branch and `develop` should be treated as legacy/stale unless Cade changes policy.
- `.ai/THREAD.md`
  - rewrote the active continuity thread to include the verified branch/worktree reality and the rule that branch-topology cleanup must be its own explicit git objective.
- `.ai/STATE.md`
  - recorded the verified topology facts for both worktrees and why the continuity patch was needed.

### Summary

- The repo canon no longer points at a missing founder-context file.
- Shared memory now matches reality: `S3` is next, `dev` is the active integration branch, and the separate Sentry worktree is real but should not silently redefine branch policy.
- This was a docs-only clarity pass; no code paths changed.

### Verification

- `npm run ai:writer-lock:status` ✅ (`Writer lock: UNLOCKED` before claim)
- `npm run ai:writer-lock:claim -- codex "clarify branch-worktree canon and shared memory"` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-04T07-33-56/`

### Branch Hygiene

- Branch: `dev`
- Scope: root context restore + shared-memory clarification only

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

## 2026-03-03 - Claude Code (Sonnet 4.6) - Branch Cleanup & Consolidation

**Goal:** Clean up git branch/worktree mess on dev — commit 38 uncommitted files, remove orphaned worktrees, delete 14 stale local branches, 4 stale remote branches, close PR #143.

**Status:** ✅ Implemented

### Changes

- Removed 2 orphaned worktrees (s2-homepage-proof, release-main) — git records pruned; s2-homepage-proof folder has a few locked log files (harmless, git-unaware)
- Committed 38 uncommitted files as 4 logical commits on dev
- Resolved rebase conflicts: test heading strings (kept remote's correct headings), BACKLOG.md (kept local newer version), added `/guide` route to visual-smoke
- Pushed rebased dev to origin (dev advanced `fdbc857` -> `3a3a11b`)
- Synced local main with origin/main (fast-forward, 3 new commits)
- Deleted 14 stale local branches (pr-76 through pr-92, dead features, rescues)
- Deleted 4 stale remote branches (rescue, pr-84, ci-tiered-verification, claude/affiliate-program-analysis)
- Closed PR #143 as superseded with explanatory comment
- Added `archive/root-level-orphans/experimental_scraper/` and `archive/root-level-orphans/backups-legacy-scripts/` to `.gitignore` (37MB + PII patterns)

**Deviations from plan:**

- `backups-legacy-scripts/` scripts blocked by security scanner (PII patterns in content/filename) — gitignored entire directory instead of committing
- `s2-homepage-proof` folder has 3 locked log files remaining (a process holds them) — git has no record of it; cleanup is harmless deferred work

### Next Steps

- Dependabot PR triage (see plan file Follow-Up section) — merge low-risk PRs first, review zod 3->4 separately
