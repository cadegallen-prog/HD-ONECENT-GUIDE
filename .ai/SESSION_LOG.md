# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-07 - Codex - Monumetric Baseline Canon + Main Branch Hygiene Reset

**Goal:** Canonicalize the March Monumetric fixes so future agents stop rediscovering ad ownership/routing mistakes, then clean and ship `main`, and create a fresh branch cloned from updated `main`.

**Status:** 🔄 In progress (docs/memory updates complete; verification + commit/push + branch clone pending)

### Changes

- Added canonical Monumetric implementation baseline topic:
  - `.ai/topics/MONUMETRIC_IMPLEMENTATION_BASELINE.md`
  - captures ownership boundaries, stabilized behavior, anti-drift rules, and commit lineage.
- Added operational ads runbook:
  - `docs/ads/monumetric-ops-baseline.md`
  - documents excluded-route policy, provider-managed vs app-managed responsibilities, and post-deploy validation checks.
- Updated discovery/canon references:
  - `.ai/topics/INDEX.md` (registered new Monumetric baseline topic)
  - `.ai/topics/SITE_MONETIZATION_CURRENT.md` (points to baseline + aligned exclusions wording)
  - `README.md` (AI docs table includes Monumetric ops baseline)
- Updated live state snapshot:
  - `.ai/STATE.md`
  - Monumetric section now reflects route-gated script behavior instead of outdated global-head-script assumptions.
- Included founder-confirmed tooling preference:
  - `.vscode/settings.json` includes `workbench.browser.enableChatTools=true`.

### Summary

- Future agents now have one canonical baseline for Monumetric implementation truth and anti-regression guardrails.
- Current baseline explicitly states what app code controls versus what Monumetric controls.
- Branch cleanup and shipping steps are being completed in this same session.

### Verification

- Pending:
  - `npm run ai:memory:check`
  - `npm run ai:checkpoint`

### Branch Hygiene

- Branch: `main`
- Commit SHA(s): pending
- Push status: pending
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅
  - `npm run ai:writer-lock:claim -- codex "monumetric canonical docs + branch cleanup"` ✅

---

## 2026-03-06 - Codex - Monumetric Mobile Re-Enable Email Archived

**Goal:** Preserve the Monumetric mobile re-enable email that the founder sent, remove the obsolete draft, and record deferred follow-up asks without reopening strategy drift.

**Status:** ✅ Completed (docs-only archive update)

### Changes

- Added sent-email archive:
  - `emails/monumetric-mobile-activation-final.md`
  - captures the exact softer ask sent to Samantha on `2026-03-06`, focused on re-enabling existing mobile-capable placements and keeping Mobile Header In-screen off.
- Added deferred follow-up note:
  - `emails/monumetric-mobile-followup-notes.md`
  - preserves later asks for desktop refinement, possible future mobile-header retest, and ad-ops best-practice questions.
- Removed obsolete draft:
  - `emails/monumetric-mobile-activation-draft.md`

### Summary

- The correspondence archive now reflects what was actually sent, not the superseded draft chain.
- Deferred Monumetric asks are preserved separately so future follow-up emails can stay focused.

### Verification

- Docs-only change; runtime test lanes not run.
- `npm run ai:memory:check` pending after memory updates
- `npm run ai:checkpoint` pending after memory updates

### Branch Hygiene

- Branch: unknown in this session snapshot (no branch mutation performed)
- Commit SHA(s): none
- Push status: not pushed
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "document sent monumetric mobile re-enable email and archive draft"` ✅

---

## 2026-03-06 - GitHub Copilot - Analytics Engagement Drop Investigation

**Goal:** Root-cause the engagement time drop observed starting ~Feb 25, 2026.

**Status:** ✅ Complete — three causes confirmed, no code broken, post-mortem filed.

### Findings

- **Feb 25 inflection confirmed by data.** Returning user engagement crashed from ~120s → 72s on the exact day 5 CSP commits landed (`89313e0` `045f0d7` `bafdd59` `fc2e22c` `70c3db6`). Sitewide every channel (Direct, Organic Search, Organic Social) crashed simultaneously — ruling out a traffic mix change.
- **Ads off Feb 26:** Founder confirmed Monumetric was turned off Feb 26 and only re-enabled ~Mar 4 (desktop only, mobile ads not displaying). Feb 25 CSP explains that day only; Feb 26+ sustained drop is NOT ad-caused.
- **Primary sustained cause: list shrank.** Penny list went from ~170 items (3.4 pages) → ~127 items (2.5 pages). One fewer page of browsable content removes 30–70s of power-user engagement per session. Self-correcting as items accumulate.
- **Google discovery surge is healthy growth.** Non-branded organic clicks grew 6× (4.6 → 28/day) starting Feb 21. New discovery traffic dilutes averages but individual engagement per user type is unchanged. Analytics code last changed Feb 8 — nothing broken.

### Artifacts

- `.ai/topics/TRAFFIC_ENGAGEMENT_ANOMALY_FEB25.md` — full post-mortem with all data tables, channel breakdown, and daily returning-user series.
- `.ai/topics/INDEX.md` — updated to register the post-mortem.

### Branch / Verification

- Read-only investigation — no code changes made this session.
- Working tree dirty (carryover from prior sessions): `.ai/STATE.md`, `docs/skills/google-ga4-gsc-local-archive.md`, `lib/ads/monumetric-slot-shell.tsx`

---

## 2026-03-06 - Codex - Monumetric Route/Viewport Refresh Stabilization (Penny List)

**Goal:** Fix founder-reported Monumetric behavior regressions where ad state failed to refresh across SPA route transitions and desktop/mobile breakpoint switches, causing stale rendering behavior (including inconsistent desktop footer ad composition).

**Status:** ✅ Completed (code + verification complete; live production confirmation pending deploy)

### Changes

- Hardened Monumetric lifecycle coordinator in:
  - `lib/ads/monumetric-runtime.ts`
  - added viewport-band detection (`mobile` / `tablet` / `desktop`) and resize-driven lifecycle handling.
  - route transitions now trigger both slot requeue and guarded runtime refresh attempts.
  - added refresh cooldown + retry window to avoid runaway refresh loops.
  - added stale-runtime fallback: when breakpoint flips but runtime remains mismatched and `refreshOnce` is unavailable after retries, force one guarded page reload to reinitialize runtime state.
  - skipped refresh/reload behavior on ad-excluded routes.
- Extended runtime typings in:
  - `types/ads-runtime.d.ts`
  - added optional Monumetric runtime members used by lifecycle guardrails (`refreshOnce`, `setNumMonuAdUnits`, `startRefresh`, `stopRefresh`, `insertAds`, `ready`, `deviceType`, SPA metadata fields).
- Added regression coverage in:
  - `tests/ads-monumetric-runtime.test.ts`
  - validates viewport-band mapping and fail-closed runtime refresh behavior (no-window, runtime bootstrap, successful refresh path, thrown refresh path).
- Captured diagnostic evidence for the reported mobile->desktop stale-runtime path:
  - `reports/ad-runtime-diagnostics/2026-03-06T15-17-46-732Z-mobile-desktop-route-transition.json`
  - documents `deviceType=mobile` persisting immediately after desktop resize in the reproduction flow before subsequent route transitions.

### Summary

- Runtime refresh behavior is now coordinated across both route changes and breakpoint transitions.
- Safety guardrails were added to avoid infinite-refresh behavior while still recovering from stale mobile/desktop runtime state.
- Local verification lanes are green; production behavior needs post-deploy validation because local port `3001` currently runs with Monumetric disabled.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- /penny-list /guide` ✅
  - `reports/proof/2026-03-06T15-22-16/`
  - no console errors in proof run

### Branch Hygiene

- Branch: `main`
- Head SHA: `18ac687`
- Commit SHA(s): none (not committed in this session)
- Push status: not pushed
- Session-end `git status --short`: dirty (scope files + pre-existing carryover files)
  - scope files:
    - `lib/ads/monumetric-runtime.ts`
    - `types/ads-runtime.d.ts`
    - `tests/ads-monumetric-runtime.test.ts`
  - pre-existing carryover (unchanged in this session):
    - `.ai/STATE.md`
    - `docs/skills/google-ga4-gsc-local-archive.md`
    - `lib/ads/monumetric-slot-shell.tsx`
    - `.github/agents/`
    - `Monumetric_Ads_information/`
    - `archive/root-level-orphans/`
    - `emails/monumetric-reengagement-draft.md`
    - `emails/monumetric-reengagement-final.md`
    - `monumental/Monumetric.json`
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "monumetric route+viewport refresh stabilization memory updates"` ✅

---

## 2026-03-06 - Codex - Mobile Safe-Area Navbar Clipping Fix (Prompt 0)

**Goal:** Re-apply the known safe-area/navbar fix from `f4912a0` onto the current `main` state (without cherry-pick), verify no conflicts with newer layout/Monumetric changes, and run mobile+desktop proof checks for clipping.

**Status:** ✅ Completed

### Changes

- Re-applied safe-area foundation lines from `f4912a0` to current `main`:
  - `app/globals.css`
    - added safe-area CSS custom properties:
      - `--safe-area-top`
      - `--safe-area-bottom`
      - `--safe-area-left`
      - `--safe-area-right`
  - `app/layout.tsx`
    - updated import to `Metadata, Viewport`
    - added `export const viewport: Viewport` with:
      - `width: "device-width"`
      - `initialScale: 1`
      - `maximumScale: 5`
      - `userScalable: true`
      - `viewportFit: "cover"`
  - `components/navbar.tsx`
    - added navbar top safe-area padding:
      - `pt-[env(safe-area-inset-top)]`
- Kept scope strict to the 3-file patch and preserved current Monumetric/CSP/runtime logic in `app/layout.tsx`.
- Added proof capture bundle for requested spot-check routes and viewports:
  - `/`, `/guide`, `/faq`, `/penny-list`
  - iPhone SE (WebKit), iPhone 14 Pro (WebKit), Android Pixel 5 (Chromium), Desktop Chrome (Chromium), Desktop Firefox.

### Summary

- The exact `f4912a0` safe-area fix is now present on current `main` without cherry-pick conflicts.
- Verification lanes passed (`ai:memory:check`, `verify:fast`, `e2e:smoke`).
- Cross-viewport proof artifacts were generated under `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/`.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Playwright/device proof bundle ✅
  - `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/summary.md`
  - `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/summary.json`
  - screenshots in the same folder (`*.png`)

### Branch Hygiene

- Branch: `main` (founder-requested direct patch target)
- Commit SHA(s): none (not committed in this session)
- Push status: not pushed (local working tree update only)
- Session-end status: dirty by scope + pre-existing carryover files
  - scope files:
    - `app/globals.css`
    - `app/layout.tsx`
    - `components/navbar.tsx`
  - carryover (pre-existing, unchanged):
    - `.github/agents/`
    - `Monumetric_Ads_information/`
    - `archive/root-level-orphans/`
    - `emails/monumetric-reengagement-draft.md`
    - `emails/monumetric-reengagement-final.md`
    - `monumental/Monumetric.json`
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "mobile safe-area navbar clipping fix memory updates"` ✅

---
