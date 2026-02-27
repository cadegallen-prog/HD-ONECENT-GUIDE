# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-02-27 - Codex - Monumetric Emergency Production Rollback Reactivated

**Goal:** Shut Monumetric back off in production after founder-reported header obstruction and nonstop refresh behavior.

**Status:** ✅ Completed

### Changes

- Vercel production operations
  - removed the production `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` setting and re-added it as `false`.
  - redeployed the current production deployment instead of shipping local app code.
- Live verification
  - confirmed `www.pennycentral.com` no longer serves the Monumetric runtime script or `monu.delivery` preconnect.
- `.ai/STATE.md`
  - updated current reality to show the rollback is active again.
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - moved `INC-MONUMETRIC-001` back from live validation to active rollback.
- `.ai/SESSION_LOG.md`
  - added this closeout entry and trimmed the log back to 5 sessions.

### Summary

- Founder-reported live behavior still crossed the kill-switch line.
- Monumetric is off again in production.
- This rollback was operational only; no new site code was deployed.

### Verification

- `npx --yes vercel@latest env ls production --scope allens-projects-6bce9cc6` ✅
- `npx --yes vercel@latest redeploy https://hd-onecent-guide-jize3ocv7-allens-projects-6bce9cc6.vercel.app --target production --scope allens-projects-6bce9cc6` ✅
- `curl -s https://www.pennycentral.com | rg "monu.delivery/site|https://monu.delivery"` ✅
  - result: no Monumetric runtime script or `monu.delivery` preconnect present in live HTML
- Runtime verification lanes: N/A (operational env rollback only; no local runtime code-path change)

### Branch Hygiene

- Branch: `dev`
- Scope: memory/docs update only; production rollback was executed operationally in Vercel

---

## 2026-02-27 - Codex - Baseline Export + Monumetric Production Reactivation

**Goal:** Lock the clean pre-ad baseline, reactivate Monumetric in production, and verify the live site truthfully.

**Status:** ✅ Completed

### Changes

- `analytics/baselines/Baseline_Stable_PreAds.json`
  - saved the stable GA4 baseline using `2026-02-18` through `2026-02-24`.
  - included engagement, bounce, pages/session, session totals, and device split fields for later guardrail comparisons.
- Vercel production operations
  - set `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` in production.
  - redeployed the current production deployment and confirmed `www.pennycentral.com` is serving Monumetric again.
- `tests/live/console.spec.ts`
  - fixed CSP blocked-target extraction so the live console audit no longer mislabels `data:` CSP failures as `www.google-analytics.com`.
- `.ai/STATE.md`
  - updated current reality to reflect that Monumetric is live again in production and the 7-day validation window is active.
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - advanced `INC-MONUMETRIC-001` from reactivation-pending to live validation.
- `.ai/SESSION_LOG.md`
  - added this closeout entry.

### Summary

- Stable pre-ad reference window locked: `2026-02-18` to `2026-02-24`.
- Monumetric is live again on production as of `2026-02-27`.
- Immediate post-reactivation live audit passed on desktop and mobile.
- Remaining console findings are non-critical third-party ad/tracking noise, not a PennyCentral production blocker.

### Verification

- `curl -s https://www.pennycentral.com | rg "monu.delivery/site"` ✅
- `npm run verify:fast` ✅
- `$env:PLAYWRIGHT_BASE_URL='https://www.pennycentral.com'; npx playwright test tests/live/console.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
  - artifacts:
    - `reports/playwright/console-report-2026-02-27T22-58-09-641Z.json`
    - `reports/playwright/console-report-2026-02-27T22-58-54-314Z.json`
- Runtime smoke lane: N/A (no app route/UI code changed in this closeout lane; live production verification was run directly against the deployed site)

### Branch Hygiene

- Branch: `dev`
- Scope: baseline artifact + verification-tool hardening + memory updates

---

## 2026-02-27 - Codex - Monumetric Response Received - Controlled Reactivation Strategy Initiated

**Goal:** Persist the new founder-approved posture after Samantha's response so future agents stop treating Monumetric as a passive wait-state.

**Status:** ✅ Completed (memory/docs update only)

### Changes

- `.ai/STATE.md`
  - changed the active Monumetric posture from "awaiting Samantha confirmation" to "response received / partial confirmation / transitioning to controlled reactivation test".
  - recorded the 7-day validation window, `Baseline_Stable_PreAds` reference, and kill-switch rule (`>40%` engagement drop or structural interference).
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - appended a post-response session note documenting the strategy shift from external dependency to internally governed risk thresholds.
- `.ai/SESSION_LOG.md`
  - added this entry so the new posture is the most recent session truth while preserving the earlier wait-state entry as history.

### Summary

- Samantha replied with partial confirmations:
  - interstitial disabled
  - video disabled
  - `/report-find` excluded
  - mobile header adjusted to avoid covering navigation
  - dashboard access enabled
- Missing explicit confirmations remain:
  - refresh cap
  - stacking limits
  - anchor removal
  - propagation/ETA detail
- Decision: move to a controlled test model rather than wait indefinitely for deeper technical precision from an onboarding-oriented contact.
- This is not blind trust.
- This is calculated risk under defined monitoring thresholds.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
- Runtime verification lanes: N/A (docs-only memory update; no runtime code-path changes)

### Branch Hygiene

- Branch: `dev`
- Scope: docs/memory only (no ad toggle, no monetization code change)

---

## 2026-02-27 - Codex - Monumetric Wait-State Memory Lock (Ads Still Disabled)

**Goal:** Persist the founder-confirmed operational state so future agents do not drift: ads are still disabled, and re-enable is blocked until Samantha confirms final Monumetric settings/ETA.

**Status:** ✅ Completed (memory/docs update only)

### Changes

- `.ai/STATE.md`
  - updated current-state summary and sprint notes to explicitly reflect the current wait-state.
  - recorded that runtime remains disabled while waiting for Samantha's written confirmation.
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - appended a session note documenting the exact founder posture: follow-up email already sent; no re-enable yet.
- `.ai/SESSION_LOG.md`
  - added this entry to persist the wait-state in the recent-session timeline.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
- Runtime verification lanes: N/A (docs-only memory update; no runtime code-path changes)

### Branch Hygiene

- Branch: `dev`
- Scope: docs/memory only (no runtime ad-policy mutation)

---

## 2026-02-27 - Codex - Monumetric In-Content Rollout + Emergency Runtime Disable (Reversible)

**Goal:** Deploy in-content Monumetric tags, then immediately protect UX by disabling Monumetric runtime globally with a one-flag reversible switch.

**Status:** ✅ Completed (runtime + deploy + CI confirmation)

### Changes

- Initial in-content rollout:
  - added repeatable in-content slot component: `components/ads/monumetric-in-content-slot.tsx`
  - mounted slot on guide hub + chapter pages only (`/guide`, `/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`)
  - kept video/interstitial deferred in launch config:
    - `lib/ads/launch-config.ts` -> `interstitial.enabled=false`, `volt.enabled=false`
    - test lock added in `tests/ads-launch-config.test.ts`
- Emergency UX hotfix (reversible):
  - added env kill switch: `NEXT_PUBLIC_MONUMETRIC_ENABLED` (default `false`) in `.env.example`
  - gated Monumetric runtime script + preconnect in `app/layout.tsx`
  - gated in-content slot render in `components/ads/monumetric-in-content-slot.tsx`
  - behavior now: when flag is `false`, Monumetric script and in-content slots are both off.

### Verification

- Local gates:
  - `npm run ai:memory:check` ✅
  - `npm run verify:fast` ✅
  - `npm run e2e:smoke` ✅
- UI proof:
  - rollout proof: `reports/proof/2026-02-26T19-56-28/`
  - hotfix proof: `reports/proof/2026-02-26T22-24-47/`
- Runtime checks:
  - before hotfix: in-content slot present on guide surfaces
  - after hotfix (`flag=false`): `monu.delivery/site` script absent + in-content slot absent on `/`, `/guide`, `/faq`
- Main CI (`defb7694fbf2ba5f27b301e44c8ee1ed0d79e462`):
  - FAST: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22463864816` ✅
  - SMOKE: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22463864837` ✅
  - FULL: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22463864821` ✅

### Branch Hygiene

- Branch: `dev`
- Commit SHAs:
  - rollout commit on `dev`: `ee9a332`
  - rollout merge on `main`: `a82855d`
  - emergency kill-switch hotfix on `dev`: `7a681ee`
  - emergency hotfix merge on `main`: `defb769`
- Push status: pushed to `origin/dev` and `origin/main`
- Local carryover remains (outside this scoped objective): `.ai/SESSION_LOG.md`, `.ai/STATE.md`, `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`, `scripts/archive-google-analytics.ts`

---
