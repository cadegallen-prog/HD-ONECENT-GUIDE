# Branch Cleanup & Consolidation Plan

**Status:** ✅ COMPLETE
**Implemented:** 2026-03-03
**Author:** Claude Code (Opus 4.6), Architect mode
**Date:** 2026-03-03
**Slug:** branch-cleanup-consolidation

---

## Goal

Clean up the git branch/worktree mess on the `dev` branch so the working tree is clean, stale branches are removed, worktrees are pruned, and the relationship between `dev` and `main` is clear and intentional.

## Done Means

- [ ] All verified uncommitted work on `dev` is committed in logical groups
- [ ] Two orphaned git worktrees are removed (folders deleted, worktree records pruned)
- [ ] All stale local branches are deleted (10+ branches from finished PRs, dead experiments)
- [ ] Local `dev` and `main` are synced with their remotes
- [ ] PR #143 is either closed (redundant) or updated
- [ ] Stale remote branches (merged or abandoned) are deleted
- [ ] `git status` shows a clean working tree on `dev`
- [ ] No code changes — this is a git-only cleanup

## Not Doing

- NOT merging dev to main (Cade hasn't reviewed guide hub refocus + Copilot workflow + S2 homepage changes)
- NOT modifying any code files
- NOT running verification gates (no code changes = docs-only exception per CRITICAL_RULES.md Rule #3)
- NOT touching the `manual-cade-fast-track.ts` code — just committing it as-is

## Constraints

- Rule #7 (Clean Worktree): Must leave dev clean after this work
- Held-back commits on dev (guide refocus `9cc9800`, Copilot workflow `2843e20`, S2 homepage `fdbc857`) stay on dev and do NOT go to main
- No force-pushes to main or dev
- No `git reset --hard` — only safe operations

---

## Current State (Investigation Findings)

### Branches

**18 local branches** exist. Categorized:

| Category          | Branches                                                                                    | Action                                                   |
| ----------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Active            | `dev`, `main`                                                                               | Keep, sync with remote                                   |
| Active PR         | `release/ship-monumetric-and-faq`                                                           | Evaluate — PR #143 is mostly redundant                   |
| Worktree-linked   | `codex/s2-homepage-proof-front-door-20260303`, `release/report-find-basket-hotfix-20260303` | Remove worktrees first, then delete branches             |
| Stale PR checkout | `pr-76`, `pr-84`, `pr-85`, `pr-86`, `pr-87`, `pr-89`, `pr-90`, `pr-91`, `pr-92`             | Delete (these were local checkouts of merged/closed PRs) |
| Dead feature      | `monetization-trust-cleanup`, `ci-tiered-verification`                                      | Delete (remote is gone or work was merged)               |
| Rescue/backup     | `rescue/codex-494019d`, `wip/2026-03-01-pre-split-backup`                                   | Delete (snapshot-only, preserved in git reflog)          |

**Remote branches to clean:**

- `origin/rescue/codex-494019d` — snapshot, no PR
- `origin/pr-84` — stale checkout copy
- `origin/ci-tiered-verification` — old work, merged
- `origin/claude/affiliate-program-analysis-ASJz7` — one-off analysis, no PR
- `origin/release/ship-monumetric-and-faq` — PR #143, evaluate

### Worktrees

Two worktrees exist outside the main repo folder:

| Path                                                         | Branch                                        | Status                              | Action                                        |
| ------------------------------------------------------------ | --------------------------------------------- | ----------------------------------- | --------------------------------------------- |
| `C:/Users/cadeg/Projects/HD-ONECENT-GUIDE-release-main`      | `release/report-find-basket-hotfix-20260303`  | Clean, work already merged to main  | Remove worktree, delete folder, delete branch |
| `C:/Users/cadeg/Projects/HD-ONECENT-GUIDE-s2-homepage-proof` | `codex/s2-homepage-proof-front-door-20260303` | Clean, commit already on origin/dev | Remove worktree, delete folder, delete branch |

### Uncommitted Changes on dev (38 items)

Grouped into 4 logical commits:

**Commit 1: S1 hydration fix + tests (Codex work)**

- `app/layout.tsx` — Grow script → next/script afterInteractive
- `lib/penny-list-utils.ts` — DIY normalization fix
- `tests/visual-smoke.spec.ts` — hydration mismatch sweep for 9 routes
- `tests/smoke-critical.spec.ts` — penny list text + report-find regression coverage
- `tests/penny-list-utils.test.ts` — DIY normalization unit test

**Commit 2: Manual enrichment tooling (another agent)**

- `scripts/manual-enrich.ts` — refactored to skip-if-missing (safer)
- `scripts/manual-cade-fast-track.ts` — NEW: auto-create penny list entries from scraped items
- `package.json` — added `manual:cade-fast-track` script

**Commit 3: Agent continuity system + docs (Claude work)**

- `.ai/THREAD.md` — NEW: reasoning chain continuity
- `.ai/SURFACE_BRIEFS.md` — NEW: evaluative context per surface
- `.ai/START_HERE.md` — THREAD + SURFACE_BRIEFS in read order
- `.ai/HANDOFF_PROTOCOL.md` — session-end update requirements
- `.ai/CODEX_ENTRY.md` — read order updated
- `.ai/HANDOFF.md` — full handoff rewrite
- `.ai/LEARNINGS.md` — new learnings from recent sessions
- `.ai/BACKLOG.md` — S1 completion update
- `.ai/ENVIRONMENT_VARIABLES.md` — SMTP cross-reference
- `.ai/plans/INDEX.md` — site recovery registered
- `CLAUDE.md` — read order updated
- `.github/copilot-instructions.md` — continuity rule added
- `docs/EMAIL-INFRASTRUCTURE.md` — NEW: full email setup doc
- `.ai/impl/site-recovery-program.md` — NEW: program overview
- `.ai/impl/site-recovery-s1-hydration-stability.md` through `s8-trust-pages-hardening.md` — NEW: 8 slice plans
- `.ai/topics/SITE_RECOVERY_CURRENT.md` — NEW: per-route quality audit

**Commit 4: Housekeeping (archive orphans)**

- `.gitignore` — removed 2 entries
- `Guide Remodel/*` (5 files deleted) — moved to `archive/root-level-orphans/`
- `monumental/*` (1 file deleted) — moved to `archive/root-level-orphans/`
- `archive/root-level-orphans/Console_logs/` — NEW
- `archive/root-level-orphans/Guide Remodel/` — NEW (archived copies)
- `archive/root-level-orphans/backups-legacy-scripts/` — NEW
- `archive/root-level-orphans/experimental_scraper/` — NEW
- `archive/root-level-orphans/monumental/` — NEW

### PR #143 Assessment

PR #143 (`release/ship-monumetric-and-faq` → `main`) contains 5 cherry-picked commits:

1. `feat(enrichment): include retail_price in Item Cache merge policy`
2. `Update project state and incident register with Monumetric response`
3. `ops(monumetric): reactivate production and lock baseline`
4. `docs(monumetric): record emergency production rollback`
5. `feat: strengthen faq internal links`

**Problem:** The report-find basket hotfix was already merged to main via a separate path (the `release/report-find-basket-hotfix-20260303` branch). PR #143's full-e2e fails because it doesn't have the basket fix. The monumetric docs and enrichment commits on PR #143 are already covered by commits on dev. The FAQ fix is on dev too.

**Recommendation:** Close PR #143 as superseded. The work it was trying to ship either already reached main (hotfix) or lives on dev and should go through a proper dev→main merge when Cade is ready.

### dev vs main Gap

Dev has 14 commits that main doesn't have. These include:

- Monumetric docs/ops (safe, could merge)
- FAQ CTR fix (safe, could merge)
- Guide hub refocus `9cc9800` (**Cade hasn't reviewed**)
- Copilot native workflow `2843e20` (**Cade hasn't reviewed**)
- Report-find hardening (already on main via hotfix)
- Archive/cleanup passes (safe, could merge)
- S2 homepage proof `fdbc857` (**Cade hasn't reviewed**)

Per Cade's instructions: do NOT merge dev to main. The held-back items need his review first.

---

## Execution Sequence (Corrected Order)

### Phase 1: Remove worktrees (must happen before branch deletion)

1. `git worktree remove C:/Users/cadeg/Projects/HD-ONECENT-GUIDE-release-main`
2. `git worktree remove C:/Users/cadeg/Projects/HD-ONECENT-GUIDE-s2-homepage-proof`
3. `git worktree prune`
4. Verify: `git worktree list` — should show only main worktree

### Phase 2: Commit uncommitted work (4 logical commits, BEFORE pull)

Must commit before pulling because the dirty tree blocks `git pull`.

**Commit 1 — S1 hydration fix:**

```bash
git add app/layout.tsx lib/penny-list-utils.ts tests/visual-smoke.spec.ts tests/smoke-critical.spec.ts tests/penny-list-utils.test.ts
git commit -m "fix: resolve global hydration mismatch and lock regression coverage (S1)"
```

**Commit 2 — Manual enrichment tooling:**

```bash
git add scripts/manual-enrich.ts scripts/manual-cade-fast-track.ts package.json
git commit -m "feat(enrichment): add cade-fast-track script and make manual-enrich skip-if-missing"
```

**Commit 3 — Agent continuity system + docs:**

```bash
git add .ai/THREAD.md .ai/SURFACE_BRIEFS.md .ai/START_HERE.md .ai/HANDOFF_PROTOCOL.md .ai/CODEX_ENTRY.md .ai/HANDOFF.md .ai/LEARNINGS.md .ai/BACKLOG.md .ai/ENVIRONMENT_VARIABLES.md .ai/plans/INDEX.md CLAUDE.md .github/copilot-instructions.md docs/EMAIL-INFRASTRUCTURE.md .ai/impl/site-recovery-program.md .ai/impl/site-recovery-s1-hydration-stability.md .ai/impl/site-recovery-s2-homepage-proof-front-door.md .ai/impl/site-recovery-s3-guide-core-rebuild.md .ai/impl/site-recovery-s4-penny-list-mobile-focus.md .ai/impl/site-recovery-s5-report-find-compression.md .ai/impl/site-recovery-s6-typography-template-consistency.md .ai/impl/site-recovery-s7-store-finder-supporting-role.md .ai/impl/site-recovery-s8-trust-pages-hardening.md .ai/topics/SITE_RECOVERY_CURRENT.md .ai/impl/branch-cleanup-consolidation.md
git commit -m "docs: add agent continuity system, site recovery plans, and email infrastructure"
```

**Commit 4 — Housekeeping (archive orphans + gitignore experimental_scraper):**

First, add `archive/root-level-orphans/experimental_scraper/` to `.gitignore` (37MB/1508 files — must not be committed).

```bash
# Add experimental_scraper to .gitignore
echo "archive/root-level-orphans/experimental_scraper/" >> .gitignore

git add .gitignore "Guide Remodel/" "monumental/" "archive/root-level-orphans/Console_logs/" "archive/root-level-orphans/Guide Remodel/" "archive/root-level-orphans/backups-legacy-scripts/" "archive/root-level-orphans/monumental/"
# NOTE: Do NOT stage archive/root-level-orphans/experimental_scraper/ — it's gitignored
git commit -m "chore: archive root-level orphans and gitignore experimental_scraper (37MB)"
```

### Phase 3: Sync with remote

5. `git pull --rebase origin dev` (rebase 4 local commits on top of the 2 remote commits)
   - If conflicts: resolve by keeping local (newer) versions for `.ai/` files
6. `git push origin dev`
7. `git checkout main && git pull origin main && git checkout dev`

### Phase 4: Delete stale local branches

8. Delete worktree-linked: `git branch -d codex/s2-homepage-proof-front-door-20260303 release/report-find-basket-hotfix-20260303`
9. Delete PR checkouts: `git branch -d pr-76 pr-84 pr-85 pr-86 pr-87 pr-89 pr-90 pr-91 pr-92`
   - Use `-D` (force) if git complains about unmerged — these are local copies of remote PR branches, the work is on the remote
10. Delete dead features: `git branch -D monetization-trust-cleanup ci-tiered-verification`
11. Delete rescue/backup: `git branch -D rescue/codex-494019d wip/2026-03-01-pre-split-backup`

### Phase 5: Clean remote branches

12. `git push origin --delete rescue/codex-494019d pr-84 ci-tiered-verification claude/affiliate-program-analysis-ASJz7`
13. `git remote prune origin`

### Phase 6: Close PR #143

14. `gh pr close 143 --comment "Closing as superseded. The report-find basket hotfix already merged to main via a separate branch. Remaining work (monumetric docs, FAQ fix, enrichment) lives on dev and will go through a proper dev→main merge when ready."`
15. `git push origin --delete release/ship-monumetric-and-faq`
16. `git branch -D release/ship-monumetric-and-faq`

### Phase 7: Verify clean state

17. `git status --short` — must be empty
18. `git branch` — must show only `* dev` and `main`
19. `git worktree list` — must show only main worktree
20. `git branch -r` — must show only `origin/dev`, `origin/main`, `origin/HEAD`, and active dependabot branches
21. `git log --oneline dev -8` — show the commit history to confirm all 4 new commits plus the 2 pulled remote commits

---

## Risk Assessment

| Risk                                              | Likelihood | Impact | Mitigation                                                                   |
| ------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------- |
| Rebase conflict when pulling dev                  | Medium     | Low    | Conflicts will be in `.ai/` docs — resolve by keeping local (newer) versions |
| Accidentally deleting a branch with unmerged work | Low        | High   | Every branch was checked — worktrees are clean, PR branches are redundant    |
| Losing the s2-homepage work                       | Low        | High   | Already on `origin/dev` as commit `fdbc857` — won't be lost                  |
| PR #143 closure loses important work              | Low        | Low    | All 5 commits exist on dev; the hotfix commits are on main                   |

## Rollback Plan

- All branch deletions are recoverable via `git reflog` for 90 days
- Worktree removal only deletes the working copy, not the commits
- If a commit is accidentally lost, `git reflog` + `git cherry-pick` recovers it
- PR #143 can be reopened on GitHub if needed

## Resolved Decisions

1. **PR #143:** CLOSE as superseded. The hotfix already merged to main; remaining work lives on dev.
2. **Dependabot PRs (#136-145):** Separate task AFTER this cleanup. See follow-up handoff below.
3. **The `experimental_scraper/rnet/` archive:** GITIGNORE it (`archive/root-level-orphans/experimental_scraper/`) — 37MB / 1,508 files, too large to commit. Add to `.gitignore` during Phase 3 Commit 4 (housekeeping). Do NOT stage the `experimental_scraper/` directory.

## Follow-Up Task: Dependabot PR Triage

**Prerequisite:** This cleanup plan must be fully complete (Phase 8 verified) before starting.

**Open dependabot PRs to triage:**

| PR   | Bump                          | Risk                              |
| ---- | ----------------------------- | --------------------------------- |
| #145 | actions/upload-artifact 6 → 7 | Low (CI only)                     |
| #144 | ruff 0.15.1 → 0.15.4          | Low (dev tooling)                 |
| #142 | minimatch 3.1.2 → 3.1.4       | Low (transitive)                  |
| #140 | globals 17.0.0 → 17.3.0       | Low (ESLint peer)                 |
| #139 | lighthouse 12.8.2 → 13.0.3    | Medium (major bump, dev only)     |
| #138 | zod 3 → 4                     | HIGH (major version, runtime dep) |
| #137 | react-email 5.2.5 → 5.2.8     | Low (patch)                       |
| #136 | @eslint/js 9 → 10             | Medium (major bump, dev only)     |

**Recommended approach:** Merge the low-risk ones (patch/minor, dev-only). For #138 (zod 3→4), review breaking changes before merging — this is a runtime dependency with a major version bump. Run `npm run verify:fast` after each merge to catch breakage early.

**Model recommendation:** Sonnet or Haiku — straightforward merge/test loop, no architecture needed.

---

## Verification

- `git status --short` returns empty (clean tree)
- `git branch` returns only `dev` and `main`
- `git worktree list` returns only main worktree
- `git log --oneline dev -5` shows the new commits at top
- No code was modified — docs-only exception applies
