# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-04 - Codex - Roo Research Carryover Rule

**Goal:** Stop future agents from overreacting to Roo Code research files by documenting that `.roo/**` is optional carryover unless a task actually needs it.

**Status:** ✅ Completed

### Changes

- `AGENTS.md`
  - added an explicit location-map note that `.roo/research/**` and `.roo/mcp.json` are optional external-tool research inputs, not canonical memory.
  - added a dirty-worktree note that `.roo/**` usually counts as unrelated carryover unless the current task overlaps it.
- `.ai/CRITICAL_RULES.md`
  - added the same overlap-first clarification so future agents do not treat Roo research as a blocker by default.
- `.ai/THREAD.md`, `.ai/STATE.md`
  - recorded the founder intent: Roo/GLM research is a low-cost exploration lane that can produce useful ideas or disposable noise, and either outcome is acceptable.

### Summary

- `.roo/**` is now explicitly documented as optional research carryover, not canon and not a blocker by default.
- Future agents may use Roo research when it helps, ignore it when it does not, and avoid turning it into workflow drama.
- This patch exists to protect founder time while still making use of free research credits.

### Verification

- `npm run ai:writer-lock:claim -- codex "record Roo research carryover rule in canon and memory"` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-04T09-13-54/`

### Branch Hygiene

- Branch: `dev`
- Scope: docs-only workflow/memory clarification
- Push: not pushed

## 2026-03-04 - Codex - `/guide` Long-Form Rebuild (`S3B`)

**Goal:** Turn `/guide` into the canonical one-page beginner guide so users can learn the full flow without bouncing across a hub and multiple chapter routes.

**Status:** ✅ Completed

### Changes

- `app/guide/page.tsx`
  - replaced the old guide hub/chapter-grid posture with a seven-section long-form narrative that follows `.ai/topics/GUIDE_CORE_CONTENT_MAP.md`.
  - kept the page SSR-first, retained the editorial/disclosure/ad infrastructure, and shifted supporting-route links into secondary deep-dive handoffs instead of primary route cards.
  - updated the route metadata/structured-data posture so `/guide` now behaves like a canonical editorial guide instead of a collection hub.
- `components/guide/GuideJumpNav.tsx`
  - added the reusable jump-navigation card grid for the seven guide sections.
- `tests/smoke-critical.spec.ts`
  - replaced the stale guide-hub smoke assertions with canonical long-form guide assertions (H1, jump nav, and long-form section headings).
- `.ai/LEARNINGS.md`
  - added the shell-specific learning that standalone visual-smoke retries should use `npx cross-env ...` in this PowerShell/Codex environment.
- `.ai/BACKLOG.md`, `.ai/STATE.md`, `.ai/THREAD.md`, `.ai/impl/site-recovery-program.md`, `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
  - updated continuity so future agents start at `S3C1` instead of trying to reopen `/guide` as the next slice.

### Summary

- `/guide` is now the canonical long-form beginner route instead of a chapter hub.
- Supporting routes still exist, but they are now secondary references rather than the main teaching spine.
- The next recovery slice is `S3C1 - supporting chapter-route demotion` for `/what-are-pennies`, `/clearance-lifecycle`, and `/digital-pre-hunt`.

### Verification

- `netstat -ano | findstr :3001` ✅
- `Invoke-WebRequest http://localhost:3001/guide` ✅ (`200`)
- `npm run lint:colors` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx cross-env NEXT_DIST_DIR=.next-playwright PLAYWRIGHT=1 NEXT_PUBLIC_EZOIC_ENABLED=false NEXT_PUBLIC_ANALYTICS_ENABLED=false npm run build` ✅
- `npx playwright test tests/visual-smoke.spec.ts --project=chromium-desktop-light --project=chromium-desktop-dark --project=chromium-mobile-light --project=chromium-mobile-dark --workers=1` ✅
- Screenshot evidence: `guide-before-s3b.png`, `guide-after-s3b-desktop.png`, `guide-after-s3b-mobile.png`

### Branch Hygiene

- Branch: `dev`
- Scope: `/guide` long-form rebuild + smoke update + continuity updates
- Push: not pushed

## 2026-03-04 - Codex - Guide IA Lock (`S3A`)

**Goal:** Freeze guide content ownership before runtime edits so the `/guide` rebuild can remove overlap instead of recreating it.

**Status:** ✅ Completed

### Changes

- `.ai/topics/GUIDE_CORE_CONTENT_MAP.md`
  - created the canonical seven-section `/guide` outline for the rebuilt long-form guide.
  - mapped current route material into keep/merge/drop decisions for `/guide`, `/faq`, `/what-are-pennies`, and the supporting chapter routes.
  - locked the route-role decisions that `S3B`, `S3C`, and `S3D` must follow.
- `.ai/impl/site-recovery-program.md`
  - corrected stale parent-plan status so `S2` is marked shipped, `S3A` is complete, and `S3B` is the immediate next runtime slice.
- `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
  - marked `S3A` complete, linked the new content-map artifact, and recorded the drift-check note.
- `.ai/BACKLOG.md`, `.ai/STATE.md`, `.ai/THREAD.md`
  - updated continuity so future agents start at `S3B - /guide long-form implementation` instead of rediscovering the guide overlap problem.

### Summary

- Guide recovery now has a locked ownership map before any route code changes start.
- `/guide` owns the full beginner narrative, `/faq` is tactical, and `/what-are-pennies` becomes the narrower supporting explainer.
- The next runtime slice is `S3B - /guide long-form implementation`.

### Verification

- `npm run ai:writer-lock:status` ✅
- `npm run ai:writer-lock:claim -- codex "complete S3A guide IA lock and update continuity memory"` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-04T08-12-52/`

### Branch Hygiene

- Branch: `dev`
- Scope: guide-planning docs + shared-memory updates only
- Push: not pushed

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
- Commit: `2d5f10a`
- Push: pushed to `origin/dev`

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
