# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-05 - Codex - Monumetric `S1` Lifecycle Guardrails

**Goal:** Execute `S1` of the balanced Monumetric stabilization plan by adding a safe, reversible route-lifecycle requeue path without using undocumented SPA callback hooks.

**Status:** ✅ Completed

### Changes

- Runtime lifecycle coordinator + wiring:
  - `lib/ads/monumetric-runtime.ts` (new) adds a client-side route coordinator that observes pathname changes and re-queues known Monumetric slots idempotently per route transition.
  - `app/layout.tsx` now mounts `MonumetricRouteLifecycleCoordinator`.
- Route/launch plan contract updates:
  - `lib/ads/launch-config.ts` adds:
    - `NEXT_PUBLIC_MONU_ROUTE_REQUEUE` gate (`routeRequeue.enabled`, default on unless set to `0`),
    - `experimentalSpa.enabled` lock (`NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA`, default off),
    - route-to-slot helpers for guide/chapter surfaces only.
  - `lib/ads/slot-plan.ts` now includes `requeueSlotIds` in active plans.
  - `components/ads/route-ad-slots.tsx` now emits lifecycle metadata (`routeRequeueEnabled`, `requeueSlotIds`, `experimentalSpaEnabled`) in the route-plan payload.
- Typing + tests:
  - `types/ads-runtime.d.ts` (new) adds explicit `window.$MMT` typing.
  - `tests/ads-launch-config.test.ts` and `tests/ads-slot-plan.test.ts` now cover route-requeue contracts and slot-id helpers.

### Summary

- `S1` is now implemented with a first-party lifecycle guard that does not call `$MMT.spa.setCallback(...)`.
- Requeue behavior is reversible by env flag (`NEXT_PUBLIC_MONU_ROUTE_REQUEUE=0`) and still protected by the global Monumetric kill switch.
- The monetization incident lane advances from `S1` to `S2 - placeholder stability`.

### Verification

- `npm run ai:writer-lock:status` ✅
- `python C:\\Users\\cadeg\\.codex\\skills\\pc-scope-guard\\scripts\\scope_guard.py` ✅ (no issues)
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Local route-transition proof (desktop + mobile + console):
  - `reports/proof/monumetric-s1-route-transition-2026-03-05T04-17-26-919Z/`
- Playwright console audits (desktop + mobile):
  - `reports/playwright/console-report-2026-03-05T04-18-43-048Z.json`
  - `reports/playwright/console-report-2026-03-05T04-19-45-141Z.json`
- Callback-crash signature check:
  - `rg -n \"updateConfig is not a function|\\$MMT\\.spa\\.setCallback|setCallback|updateConfig\" ...` returned no matches in the new console artifacts.

### Branch Hygiene

- Branch: `dev`
- Scope: runtime ad lifecycle guardrails + related tests + continuity updates
- Push: not pushed

## 2026-03-05 - Codex - Monumetric Balanced Stabilization Plan Canonization

**Goal:** Convert founder-selected balanced monetization strategy into canonical parent + child implementation slices before any new runtime edits.

**Status:** ✅ Completed

### Changes

- Added canonical parent plan:
  - `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`
- Added five child slice plans:
  - `.ai/impl/monumetric-balanced-s1-lifecycle-guardrails.md`
  - `.ai/impl/monumetric-balanced-s2-placeholder-stability.md`
  - `.ai/impl/monumetric-balanced-s3-placement-coverage-recovery.md`
  - `.ai/impl/monumetric-balanced-s4-csp-compat-hardening.md`
  - `.ai/impl/monumetric-balanced-s5-controlled-rollout.md`
- Updated canon pointers and historical docs:
  - `.ai/impl/monumetric-launch-spec.md`
  - `.ai/plans/INDEX.md`
  - `.ai/topics/INDEX.md`
  - `.ai/topics/SITE_MONETIZATION_CURRENT.md`
  - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- Updated continuity memory:
  - `.ai/THREAD.md`
  - `.ai/STATE.md`

### Summary

- Monumetric work now has a single canonical parent + child execution spine with stop/go checkpoints.
- The risky SPA callback path is explicitly blocked until canary evidence exists.
- `S1` lifecycle guardrails is now the first implementation slice for monetization stabilization.

### Verification

- `npm run ai:writer-lock:status` ✅
- `npm run ai:writer-lock:claim -- codex "monumetric balanced stabilization planning memory updates"` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-05T02-11-21/`

### Branch Hygiene

- Branch: `dev`
- Scope: planning/docs + continuity updates only
- Push: not pushed

## 2026-03-04 - Codex - Monumetric Production Reactivation + Live Audit

**Goal:** Re-enable Monumetric ads in production immediately, wait for propagation, and verify live desktop/mobile behavior with screenshot proof while founder was AFK.

**Status:** ✅ Completed

### Changes

- Production operations (no app-code mutation):
  - Upserted Vercel production env `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` via API.
  - Triggered production redeploy from latest deployment; new deployment ID: `dpl_Hitjoq1jMnMsad8srtb5FXCBD5Dw`.
  - Confirmed live HTML on `https://www.pennycentral.com` contains Monumetric runtime script + `monu.delivery` preconnect.
- Delayed validation window:
  - Waited 3 minutes post-READY before running production checks.
- Playwright production verification (desktop + mobile):
  - Audited `/`, `/penny-list`, `/guide`, and `/report-find` with full-page screenshots and summary JSON.
  - Ran live console audit suite on desktop and mobile projects.
- Memory/incident updates:
  - Updated `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` to reflect reactivation status and new evidence.
  - Added a verification-lane collision lesson in `.ai/LEARNINGS.md` after an initial parallel-run lock failure.

### Summary

- Monumetric is live again in production as of this session.
- This verification pass did not detect header-point obstruction, top-fixed header-zone overlap, or vignette markers on audited routes.
- Console output remains third-party noisy but live console audit reported no critical CSP blockers.

### Verification

- Production env + deploy via Vercel API:
  - env upsert: `NEXT_PUBLIC_MONUMETRIC_ENABLED=true`
  - production redeploy: `dpl_Hitjoq1jMnMsad8srtb5FXCBD5Dw` (READY)
- Live runtime presence checks:
  - `Invoke-WebRequest https://www.pennycentral.com` (200)
  - source contains Monumetric runtime script + preconnect
- Playwright production proof:
  - `reports/proof/monumetric-live-2026-03-04T23-14-08-233Z/summary.json`
  - route screenshots for desktop/mobile and menu-open captures in the same folder
- Live console audits:
  - `npx cross-env PLAYWRIGHT_BASE_URL=https://www.pennycentral.com playwright test tests/live/console.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
  - artifacts:
    - `reports/playwright/console-report-2026-03-04T23-15-49-487Z.json`
    - `reports/playwright/console-report-2026-03-04T23-16-35-879Z.json`
- Repo verification lanes:
  - `npm run ai:memory:check` ✅
  - `npm run verify:fast` ✅ (after sequential rerun)
  - `npm run e2e:smoke` ✅

### Branch Hygiene

- Branch: `dev`
- Scope: production ops validation + `.ai` memory/log updates only
- Push: not pushed

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
