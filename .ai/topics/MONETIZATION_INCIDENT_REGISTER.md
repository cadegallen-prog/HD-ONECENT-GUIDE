# MONETIZATION_INCIDENT_REGISTER

**Last updated:** 2026-03-06
**Owner:** Cade (founder)  
**Purpose:** Single source of truth for unresolved monetization incidents across ad networks.

---

## 1) Hard Rules (Non-Negotiable)

1. **No silent closure:** An incident cannot be closed without evidence and objective `close_criteria` met.
2. **Session open rule:** Read this file after `.ai/STATE.md` and `.ai/BACKLOG.md` for monetization work.
3. **Session close rule:** Update `status`, `next_action`, and `deadline` for every touched open incident.
4. **No blind re-review:** Any ad network re-application requires documented evidence of readiness.

---

## 2) Incident Schema (Required Fields)

- `incident_id`
- `opened_date`
- `last_update`
- `status`
- `evidence_path`
- `known_facts`
- `unknowns`
- `holdover_hypothesis`
- `review_request_submitted_at`
- `earliest_re_eval_date`
- `next_action`
- `deadline`
- `close_criteria`

---

## 3) Active Incident Register

| incident_id          | opened_date | last_update | status                           | evidence_path                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | known_facts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | unknowns                                                                                                                                                                                                | holdover_hypothesis                                                                             | review_request_submitted_at                         | earliest_re_eval_date                       | next_action                                                                                                                                                                                                                                                        | deadline   | close_criteria                                                                                                                                     |
| -------------------- | ----------- | ----------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INC-ADSENSE-001`    | 2026-02-02  | 2026-03-07  | `CLOSED-WITHDRAWN`               | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf` (OCR evidence), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-12-needs-attention-policy-violations.md`, `tests/adsense-readiness.spec.ts`, `reports/proof/adsense-readiness/*`, https://support.google.com/adsense/answer/10502938?hl=en                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | First denial: Low Value Content (`2026-02-02`). Re-applied (`2026-02-03`). Second denial state (`2026-02-12`): "We found some policy violations." Remediation bundle was deployed to production on `2026-02-16`: admin API bearer auth, noindex on auth-gated routes, privacy-policy provider disclosures plus Ezoic embed anchor, Consent Mode v2 region scoping, footer/copy consistency, `/support` permanent redirect to `/transparency`, and retirement of `/internal-systems` via permanent redirect to `/guide`. Verification passed locally (`verify:fast`, `e2e:smoke`, `e2e:full`) and CI lanes (FAST/SMOKE/FULL) are green for merge commit `e9b7552`. Production checks confirm sitemap=18 and expected route directives.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Exact policy subsection(s) triggering denial not specified in AdSense UI.                                                                                                                               | `OPEN-CONDITIONAL` (evaluate holdover only after a newly logged review request and wait window) | `2026-02-03` (historical cycle)                     | `2026-02-10` (elapsed for historical cycle) | Founder submits refreshed sitemap to Search Console and initiates AdSense re-review once crawl refresh is requested; set `ADMIN_SECRET` in Vercel production in next ops window.                                                                                   | 2026-02-19 | AdSense site status moves to ready/approved, or explicit written policy subtype is resolved and verified by successful re-review.                  |
| `INC-MONUMETRIC-001` | 2026-02-10  | 2026-03-05  | `OPEN-S4-CSP-HARDENING-VERIFIED` | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf`, `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, `reports/playwright/csp-scan-production-final-2026-02-25T20-19-58-251Z.json`, `reports/monumetric-audit/2026-02-26T17-36-26-640Z/summary.md`, `reports/monumetric-audit/2026-02-26T17-38-49-063Z-mobile-stress/summary.md`, `reports/monumetric-audit/2026-02-26T17-56-57-948Z-menu-block-proof/summary.md`, `reports/analytics-verification/2026-02-26T17-52-51-293Z/summary.md`, `reports/proof/2026-02-26T19-56-28/`, `reports/proof/2026-02-26T22-24-47/`, `analytics/baselines/Baseline_Stable_PreAds.json`, `reports/playwright/console-report-2026-02-27T22-58-09-641Z.json`, `reports/playwright/console-report-2026-02-27T22-58-54-314Z.json`, `reports/proof/monumetric-live-2026-03-04T23-14-08-233Z/summary.json`, `reports/playwright/console-report-2026-03-04T23-15-49-487Z.json`, `reports/playwright/console-report-2026-03-04T23-16-35-879Z.json`, `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`, `.ai/impl/monumetric-balanced-s2-placeholder-stability.md`, `.ai/impl/monumetric-balanced-s3-placement-coverage-recovery.md`, `reports/proof/2026-03-05T07-08-05/`, `reports/proof/2026-03-05T07-45-48/`, `reports/playwright/console-report-2026-03-05T07-09-31-176Z.json`, `reports/playwright/console-report-2026-03-05T07-39-17-156Z.json`, https://www.monumetric.com/propel/ | Criteria changed in-thread from session pageviews (Feb 10) to active users (Feb 11) vs published monthly pageviews; founder pushback sent Feb 12. Sales Lead reviewed and approved Ascend tier on Feb 17. Monumetric reported "approved by our ad providers" on Feb 11 (restated Feb 17). Ad strategy submitted to technical team for code configuration. Founder confirmed ad strategy and green-lit implementation on Feb 17. Asked Samantha to clarify whether "approved by ad providers" includes GAM domain approval through Monumetric's MCM. On Feb 25, CSP rollout was promoted to production with iterative follow-up domains from live scans; final `/` + `/guide` production scan shows `target13StillBlocked: []` and `newBlockedHosts: []`. On Feb 26, founder sent neutral UX-first rollback request after reported engagement drop from ~1:50-2:00 to ~0:22 and reproducible mobile nav interference from top sticky/interstitial behavior. On Feb 27, in-content rollout was deployed and then immediately guarded by a reversible runtime kill switch promoted to `main`; `NEXT_PUBLIC_MONUMETRIC_ENABLED=false` now disables Monumetric runtime script and in-content slots in production. Samantha then replied with partial confirmations: interstitial disabled, video disabled, `/report-find` excluded, mobile header adjusted to avoid blocking navigation, dashboard access enabled, and ads expected live on reactivation. On Feb 27, the clean pre-ad baseline was exported (`2026-02-18` through `2026-02-24`), Vercel production was updated to `NEXT_PUBLIC_MONUMETRIC_ENABLED=true`, the current production deployment was redeployed, and live HTML again confirmed the Monumetric runtime script. Founder then reported the live site was still blocking the header and refreshing nonstop, so the production kill switch was re-applied operationally: `NEXT_PUBLIC_MONUMETRIC_ENABLED=false`, production redeployed, and live HTML confirmed the Monumetric runtime script was removed again. On Mar 4, 2026, founder explicitly requested immediate reactivation testing; production env was set back to `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` via Vercel API, deployment `dpl_Hitjoq1jMnMsad8srtb5FXCBD5Dw` reached READY, and delayed desktop/mobile Playwright validation was rerun with route screenshots and console audits. On Mar 5, 2026, the balanced stabilization/density-recovery parent + child implementation plan was added to lock defensive execution sequence before additional runtime changes. On Mar 5, 2026, `S2` placeholder reserve + controlled empty-slot collapse was implemented and verified locally (`verify:fast`, `e2e:smoke`, `e2e:full`, and Playwright proof). On Mar 5, 2026, `S3` balanced placement coverage recovery was implemented with profile-gated in-content opportunities on `/guide` and `/penny-list`, verified via `verify:fast`, `e2e:smoke`, `e2e:full`, and fresh Playwright proof. | Root cause for the nonstop refresh loop is still unresolved. Explicit confirmation is still missing on refresh cap, stacking limits, anchor removal, and propagation timing.                            | `N/A`                                                                                           | `N/A`                                               | `N/A`                                       | Run `S5` controlled rollout/partner confirmation pass: confirm intended mobile and desktop placement map, verify refresh behavior on SPA transitions, and collect explicit Monumetric host requirements for remaining CSP noise before any broader policy changes. | 2026-03-12 | Controlled validation closes only after live audits confirm no header obstruction/nonstop refresh and founder accepts observed behavior as stable. |
| `INC-ADMANAGER-001`  | 2026-02-06  | 2026-03-07  | `CLOSED-WITHDRAWN`               | `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (founder-reported), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Founder reports Ad Manager decline occurred last week, then resubmitted via Ezoic on `2026-02-09`. Monumetric side reported provider approval on `2026-02-11`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Exact decline date/time, exact Google policy category, and artifact for the decline are still missing. Unified GAM status across Ezoic vs Monumetric pathways is not directly visible in one dashboard. | `N/A`                                                                                           | `2026-02-09` (Ezoic resubmission, founder-reported) | `2026-02-16`                                | Keep this incident in status-split mode until decline artifact is found or one pathway provides explicit final approval/decline reason.                                                                                                                            | 2026-02-20 | Exact decline evidence is pinned OR explicit final disposition is captured from active pathway with date/reason and recorded in register.          |
| `INC-JOURNEY-001`    | 2026-01-12  | 2026-03-07  | `OPEN-PENDING-DOMAIN-AGE-GATE`   | `.ai/STATE.md` (Grow installed + pending review context)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Grow is installed and tracking traffic. 30-day traffic requirement met. Application submitted. Domain must be 4 months old per Journey by Mediavine policy — gate not met until ~2026-03-19. Requirement: 10k monthly sessions. Once in Journey, upgrade to Mediavine triggers at $5k annual ad revenue. If applying to Mediavine directly (not through Journey), 50k monthly sessions required. AdSense and Ezoic dropped 2026-03-07 — Journey by Mediavine is the sole planned upgrade path from Monumetric.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Whether domain age gate is strict or has exceptions. Exact date Journey considers domain age sufficient.                                                                                                | `N/A`                                                                                           | `N/A`                                               | `2026-03-19`                                | Wait for domain age gate (~2026-03-19). Monitor for approval/denial notification from Journey by Mediavine. If denied, evaluate alternative mid-tier networks.                                                                                                     | 2026-03-26 | Journey approved + onboarding activated, or denied and next steps documented.                                                                      |

---

## 4) Active Network Strategy (Updated 2026-03-07)

- **Monumetric (Ascend Tier):** Active primary ad network. Post-stabilization lifecycle in progress.
- **Journey by Mediavine:** Pending. Grow installed and tracking. Domain age gate ~2026-03-19. 10k monthly sessions required.
- **AdSense:** WITHDRAWN 2026-03-07. No longer pursuing.
- **Ad Manager (standalone/Ezoic pathway):** WITHDRAWN 2026-03-07. GAM remains active only through Monumetric MCM.
- **Ezoic:** Fully dropped 2026-03-07. Removed from privacy policy and ads.txt.

---

## 5) Next Scheduled Actions

1. `2026-03-19`: Journey by Mediavine domain age gate expected. Check for approval/denial notification.
2. Ongoing: Monumetric stabilization (`INC-MONUMETRIC-001` S5 rollout pass by 2026-03-12).

---

## 7) Session Notes (2026-02-16)

- `INC-ADSENSE-001`:
  - Policy-sensitive clarity updates were restored on `/inside-scoop` and `/guide` after local reset recovery.
  - Header Guide submenu behavior was also restored (dismiss-on-selection and chronological ordering).
  - Incident status remains unchanged: `OPEN-REMEDIATION-DEPLOYED`.
  - Evidence paths:
    - `app/inside-scoop/page.tsx`
    - `app/guide/page.tsx`
    - `components/navbar.tsx`
    - `tests/basic.spec.ts`
    - `reports/proof/2026-02-16T23-03-18/`

## 8) Session Notes (2026-02-17)

- `INC-MONUMETRIC-001`:
  - Monumetric (Samantha) emailed Feb 17: Sales Lead approved Ascend tier. "Approved by our ad providers" restated (originally said Feb 11). Ad strategy re-sent for confirmation.
  - Founder sent follow-up Feb 17: confirmed ad strategy, green-lit implementation ("go ahead and submit to your team now"), asked whether "approved by ad providers" includes GAM domain approval through Monumetric's MCM.
  - Key insight: Monumetric's MCM pathway is completely independent from Ezoic's MCM pathway. Ezoic GAM domain denial (resubmitted Feb 9) has no bearing on Monumetric's submission. Monumetric does not expose GAM domain status to publishers the way Ezoic does — founder is reliant on Samantha for this info.
  - Status changed from `OPEN-ESCALATION-R1-SENT` to `OPEN-ASCEND-APPROVED-AWAITING-IMPLEMENTATION`.
  - Next: await Samantha's response. Escalate to supervisor Feb 19 if silent.

## 9) Session Notes (2026-02-18)

- `INC-ADSENSE-001`:
  - Founder reported a third AdSense review cycle is currently in progress (after prior low-value and policy-violation denials, and post-remediation deployment on Feb 16).
  - No explicit new policy subtype has been provided yet by Google; status remains unresolved until review returns.
- `INC-ADMANAGER-001`:
  - Founder reported Ezoic pathway is in a second GAM domain review cycle and still pending.
  - Status remains split because Ezoic and Monumetric pathways do not expose one shared final disposition.
- `INC-MONUMETRIC-001`:
  - Founder reported Monumetric confirmed advertiser approval but did not clearly confirm whether that includes final GAM domain approval in Monumetric's MCM pathway.
  - Technical implementation is still pending Monumetric handoff.
- Compliance audit evidence captured on 2026-02-18:
  - `npx tsx scripts/ads-readiness-check.ts --production` -> 7/7 passed.
  - `npx cross-env PLAYWRIGHT_BASE_URL=https://www.pennycentral.com playwright test tests/adsense-readiness.spec.ts --project=chromium-desktop-light --workers=1` -> 4/4 passed.
  - Live route check confirmed required trust/legal + crawler endpoints return `200`.

## 10) Session Notes (2026-02-25)

- `INC-MONUMETRIC-001`:
  - Monumetric implementation email requirement was mapped to code and implemented on `dev`:
    - added `https://securepubads.g.doubleclick.net` to CSP `script-src`
    - added `https://cdn.confiant-integrations.net` to CSP `script-src`
    - file: `next.config.js` (server header policy, no meta CSP added)
  - Verification evidence captured:
    - `npx tsx scripts/ads-readiness-check.ts --production` -> 7/7 passed
    - live checks confirm Monumetric head script present, `/ads.txt` redirect intact (`308`), `/sitemap.xml` intact (18 URLs).
  - Incident status remains `OPEN-ASCEND-APPROVED-AWAITING-IMPLEMENTATION` until this `dev` change is promoted to production and Monumetric confirms blocker resolution.
  - Updated next action: promote CSP update to production and notify Samantha with header confirmation request.
  - Updated deadline: 2026-02-26.

## 11) Session Notes (2026-02-25, follow-up closeout)

- `INC-MONUMETRIC-001`:
  - Promoted iterative CSP updates from `dev` to `main` and verified production header now includes requested + follow-up ad-chain domains.
  - Production evidence:
    - `curl -I https://www.pennycentral.com` confirms updated CSP header.
    - `curl -s https://www.pennycentral.com | rg "monu.delivery/site"` confirms Monumetric script present.
    - `curl -I https://www.pennycentral.com/ads.txt` confirms `308` redirect to Monumetric-hosted ads.txt.
    - `reports/playwright/csp-scan-production-final-2026-02-25T20-19-58-251Z.json` shows `totalCspViolations: 0` on `/` + `/guide`.
  - Status advanced to `OPEN-CSP-UNBLOCKED-AWAITING-MONUMETRIC-CONFIRMATION`.

## 12) Session Notes (2026-02-26, founder escalation sent)

- `INC-MONUMETRIC-001`:
  - Founder (Cade) sent a neutral UX-first implementation email to Monumetric requesting immediate conservative controls.
  - Reported business impact captured: average engagement per session dropped from roughly `1:50-2:00` to about `0:22` starting the evening of `2026-02-25`.
  - Reproduced UX blockers and evidence are now attached in register context:
    - mobile sticky/header interference (`mmt-sticky-header-div`, `MJM03M-DMH.A` path),
    - takeover/interstitial scenario (`#google_vignette`, `MJM03M-DMW.A` path),
    - ads present on `/report-find` despite conversion-page requirement.
  - Requested Monumetric actions in the founder email:
    - remove/disable mobile top sticky header ad now,
    - disable vignette/interstitial/takeover formats,
    - hard-exclude `/report-find` from ads,
    - pause video rollout.
  - Incident status advanced to `OPEN-UX-ROLLBACK-REQUESTED-AWAITING-MONUMETRIC-APPLY`.

## 13) Session Notes (2026-02-27, reversible runtime guard deployed)

- `INC-MONUMETRIC-001`:
  - Requested in-content rollout was implemented and promoted, then an emergency UX-first hotfix was shipped immediately after to keep the implementation reversible without leaving intrusive behavior live.
  - Deployment chain:
    - rollout on `dev`: `ee9a332`
    - rollout merge on `main`: `a82855d`
    - runtime kill-switch hotfix on `dev`: `7a681ee`
    - hotfix merge on `main`: `defb769`
  - Runtime guard behavior:
    - `NEXT_PUBLIC_MONUMETRIC_ENABLED=false` now gates Monumetric runtime script loading in `app/layout.tsx`
    - in-content slot rendering is gated in `components/ads/monumetric-in-content-slot.tsx`
    - result: Monumetric script + in-content placements are currently off in production by design.
  - Verification + evidence:
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - proof artifacts: `reports/proof/2026-02-26T19-56-28/`, `reports/proof/2026-02-26T22-24-47/`
    - CI on `main` SHA `defb7694fbf2ba5f27b301e44c8ee1ed0d79e462`: FAST/SMOKE/FULL all green.
  - Incident status changed to `OPEN-LOCAL-RUNTIME-DISABLED-AWAITING-MONUMETRIC-CONFIRMATION` (partner fix still pending; local protective guard active).

## 14) Session Notes (2026-02-27, founder wait-state confirmation)

- `INC-MONUMETRIC-001`:
  - Founder confirmed the follow-up email to Samantha has already been sent with concrete weekend configuration requirements.
  - Founder expectation is Monumetric will follow those requirements; no additional negotiation step is active right now.
  - Current operating posture remains unchanged: ads are still disabled locally and will stay disabled until Samantha replies confirming what is live vs pending (with ETA for pending items).
  - This note is a memory lock to prevent future agents from assuming ads were re-enabled before partner confirmation.

## 15) Session Notes (2026-02-27, Samantha response received and strategy shifted)

- `INC-MONUMETRIC-001`:
  - Samantha has now replied with partial confirmation of requested changes.
  - Confirmed in response: interstitial disabled, video disabled, `/report-find` excluded, mobile header updated to avoid covering navigation, dashboard access enabled, and ads expected live on reactivation.
  - Missing explicit technical precision: refresh cap, stacking limits, anchor removal, and propagation timing.
  - Post-response assessment: communication limits appear role-based/onboarding-oriented rather than malicious.
  - Strategic pivot: move from external dependency to internally governed risk thresholds.
  - Monetization decisions should now be driven by objective thresholds and the `Baseline_Stable_PreAds` reference, not partner reassurance.
  - This is not blind trust; it is calculated risk under defined monitoring thresholds.

## 16) Session Notes (2026-02-27, controlled reactivation launched)

- `INC-MONUMETRIC-001`:
  - Exported the clean pre-ad GA4 baseline to `analytics/baselines/Baseline_Stable_PreAds.json` using `2026-02-18` through `2026-02-24`.
  - Production Monumetric runtime was re-enabled operationally in Vercel by setting `NEXT_PUBLIC_MONUMETRIC_ENABLED=true`, then redeploying the current production deployment.
  - `www.pennycentral.com` now serves the Monumetric runtime again.
  - Immediate live verification passed on both desktop and mobile after correcting a false-positive CSP classifier in `tests/live/console.spec.ts`.
  - Remaining console findings are non-critical third-party ad/tracking noise only.
  - Incident status advanced to `OPEN-CONTROLLED-REACTIVATION-LIVE-VALIDATION`.

## 17) Session Notes (2026-02-27, emergency rollback reactivated)

- `INC-MONUMETRIC-001`:
  - Founder reported the live site was still blocking the header and refreshing nonstop after reactivation.
  - Production Monumetric runtime was turned back off operationally in Vercel by setting `NEXT_PUBLIC_MONUMETRIC_ENABLED=false`, then redeploying the current production deployment.
  - Live HTML verification confirmed the Monumetric runtime script and `monu.delivery` preconnect were removed again from `www.pennycentral.com`.
  - Incident status moved back to `OPEN-EMERGENCY-ROLLBACK-ACTIVE`.

## 18) Session Notes (2026-03-04, founder-directed reactivation + delayed live verification)

- `INC-MONUMETRIC-001`:
  - Founder explicitly requested immediate production reactivation and autonomous validation while AFK.
  - `NEXT_PUBLIC_MONUMETRIC_ENABLED` was upserted to `true` in Vercel production via API and a new production redeploy was triggered (`dpl_Hitjoq1jMnMsad8srtb5FXCBD5Dw`).
  - Verified post-deploy HTML on `https://www.pennycentral.com` includes both:
    - Monumetric runtime script (`https://monu.delivery/site/...js`)
    - Monumetric preconnect (`https://monu.delivery`)
  - Waited an additional 3 minutes post-READY before verification, then ran desktop/mobile production audits with route screenshots for `/`, `/penny-list`, `/guide`, and `/report-find`.
  - Current observed state in this run:
    - Monumetric runtime script present on all audited routes.
    - No header-point obstruction detected on desktop or mobile checks.
    - No top-fixed ad candidate overlap detected in the header zone.
    - No vignette/interstitial marker detected in audited sessions.
    - Console audits report non-critical third-party ad/tracking noise only; no critical CSP blockers.
  - Evidence:
    - `reports/proof/monumetric-live-2026-03-04T23-14-08-233Z/summary.json`
    - `reports/playwright/console-report-2026-03-04T23-15-49-487Z.json`
    - `reports/playwright/console-report-2026-03-04T23-16-35-879Z.json`

## 19) Session Notes (2026-03-05, balanced stabilization plan lock)

- `INC-MONUMETRIC-001`:
  - Added canonical parent + child implementation plans for defensive post-reactivation execution:
    - `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`
    - `.ai/impl/monumetric-balanced-s1-lifecycle-guardrails.md`
    - `.ai/impl/monumetric-balanced-s2-placeholder-stability.md`
    - `.ai/impl/monumetric-balanced-s3-placement-coverage-recovery.md`
    - `.ai/impl/monumetric-balanced-s4-csp-compat-hardening.md`
    - `.ai/impl/monumetric-balanced-s5-controlled-rollout.md`
  - Locked caveat for execution: do not enable undocumented SPA callback hooks in production until canary evidence proves safety.
  - Updated incident next action to begin `S1` lifecycle guardrails before density or CSP expansion.

## 20) Session Notes (2026-03-05, `S1` lifecycle guardrails implemented)

- `INC-MONUMETRIC-001`:
  - Implemented `S1` runtime lifecycle guardrails in app code:
    - new client route coordinator: `lib/ads/monumetric-runtime.ts`
    - layout wiring: `app/layout.tsx`
    - route-plan lifecycle metadata: `components/ads/route-ad-slots.tsx`, `lib/ads/slot-plan.ts`, `lib/ads/launch-config.ts`
    - runtime typings: `types/ads-runtime.d.ts`
  - Explicit safety lock held:
    - no `$MMT.spa.setCallback(...)` usage,
    - `NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA` remains default-off.
  - Verification/evidence:
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - desktop/mobile route-transition screenshots + console captures:
      - `reports/proof/monumetric-s1-route-transition-2026-03-05T04-17-26-919Z/`
    - desktop/mobile console audits:
      - `reports/playwright/console-report-2026-03-05T04-18-43-048Z.json`
      - `reports/playwright/console-report-2026-03-05T04-19-45-141Z.json`
    - callback crash signature scan (`updateConfig is not a function` / `setCallback`) returned no matches in the above console artifacts.
  - Incident progression:
    - status advanced to `OPEN-S1-LIFECYCLE-GUARDRAILS-VERIFIED`
    - next action advanced to `S2 - placeholder stability`.

## 21) Session Notes (2026-03-05, `S2` placeholder stability implemented)

- `INC-MONUMETRIC-001`:
  - Implemented `S2` placeholder reserve + controlled empty-slot collapse in app code:
    - new shared shell/hook: `lib/ads/monumetric-slot-shell.tsx`
    - slot policy + env gate wiring: `lib/ads/launch-config.ts`, `lib/ads/slot-plan.ts`
    - component integration: `components/ads/monumetric-in-content-slot.tsx`, `components/ads/mobile-sticky-anchor.tsx`, `components/ads/route-ad-slots.tsx`
    - regression coverage updates: `tests/ads-launch-config.test.ts`, `tests/ads-slot-plan.test.ts`
  - Explicit safety lock held:
    - no route-eligibility expansion,
    - no CSP policy expansion,
    - no experimental SPA callback enablement.
  - Verification/evidence:
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - `npm run e2e:full` ✅
    - proof capture: `reports/proof/2026-03-05T07-08-05/`
    - full-lane console artifacts:
      - `reports/playwright/console-report-2026-03-05T07-09-31-176Z.json`
      - `reports/playwright/console-report-2026-03-05T07-11-01-217Z.json`
      - `reports/playwright/console-report-2026-03-05T07-13-42-460Z.json`
      - `reports/playwright/console-report-2026-03-05T07-14-43-973Z.json`
  - Incident progression:
    - status advanced to `OPEN-S2-PLACEHOLDER-STABILITY-VERIFIED`
    - next action advanced to `S3 - placement coverage recovery`.

## 22) Session Notes (2026-03-05, `S3` placement coverage recovery implemented)

- `INC-MONUMETRIC-001`:
  - Implemented `S3` balanced placement coverage recovery in app code:
    - density-profile + route slot mapping: `lib/ads/launch-config.ts`
    - route plan payload extensions (`inContentSlotIds`, `densityProfile`): `lib/ads/slot-plan.ts`, `components/ads/route-ad-slots.tsx`
    - reusable per-slot shell wiring: `components/ads/monumetric-in-content-slot.tsx`
    - guide placement cadence (lead + follow-up): `app/guide/page.tsx`
    - penny-list in-feed opportunity wiring: `app/penny-list/page.tsx`, `components/penny-list-client.tsx`
    - regression coverage updates: `tests/ads-launch-config.test.ts`, `tests/ads-slot-plan.test.ts`
  - Explicit safety lock held:
    - `/report-find` exclusion unchanged,
    - no CSP expansion in this slice,
    - no experimental SPA callback enablement.
  - Verification/evidence:
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - `npm run e2e:full` ✅
    - proof capture: `reports/proof/2026-03-05T07-45-48/`
    - full-lane console artifacts:
      - `reports/playwright/console-report-2026-03-05T07-39-17-156Z.json`
      - `reports/playwright/console-report-2026-03-05T07-40-55-632Z.json`
      - `reports/playwright/console-report-2026-03-05T07-43-38-289Z.json`
      - `reports/playwright/console-report-2026-03-05T07-44-39-703Z.json`
  - Incident progression:
    - status advanced to `OPEN-S3-PLACEMENT-COVERAGE-VERIFIED`
    - next action advanced to `S4 - CSP compatibility hardening`.

## 23) Session Notes (2026-03-05, founder-approved production promotion + `S4` CSP hardening)

- `INC-MONUMETRIC-001`:
  - Founder approved immediate production promotion of S1-S3, then conditional S4 execution if under-serving remained.
  - PR `#148` was merged to `main` (`f00c246`) to promote S1-S3 lifecycle + placement recovery.
  - Production audits were captured before and after S1-S3 rollout:
    - `reports/monumetric-audit/2026-03-05T16-47-41-pre-s1s3/`
    - `reports/monumetric-audit/2026-03-05T16-51-44-post-s1s3/`
  - S1-S3 result was `PARTIAL`: route coverage and in-content opportunities improved, but repeated CSP blocker signatures remained for `script.4dex.io`, `mp.4dex.io`, and `apex.go.sonobi.com`.
  - PR `#149` was then merged to `main` (`de6bd28`) with minimal evidence-backed S4 host deltas in `next.config.js`:
    - `script-src`: `https://script.4dex.io`
    - `connect-src`: `https://mp.4dex.io`
    - `connect-src`: `https://apex.go.sonobi.com`
  - Post-S4 production audit:
    - `reports/monumetric-audit/2026-03-05T17-06-22-post-s4/`
  - Observed outcome:
    - S1-S3 coverage behavior remained stable (mobile/desktop in-content opportunities persisted on `/guide` and `/penny-list`).
    - sampled CSP noise removed `mp.4dex.io` and `apex.go.sonobi.com` blocker signatures; remaining CSP noise shifted to other third-party frame/script domains.
  - Incident progression:
    - status advanced to `OPEN-S4-CSP-HARDENING-VERIFIED`
    - next action advanced to `S5 - controlled rollout and partner confirmation pass`.

## 24) Session Notes (2026-03-05, post-S4 Rubicon CSP hotfix + verification)

- `INC-MONUMETRIC-001`:
  - Full CI on `main` after `#149` surfaced one remaining critical CSP blocker:
    - `secure-assets.rubiconproject.com`.
  - PR `#151` was merged to `main` (`ad72f3a`) with one minimal evidence-backed host delta in `next.config.js`:
    - `frame-src`: `https://secure-assets.rubiconproject.com`
  - Production header verification confirmed the host is now present in live CSP.
  - Post-hotfix production audit:
    - `reports/monumetric-audit/2026-03-05T22-38-27-814-post-rubicon-hotfix/`
  - Observed outcome:
    - no `secure-assets.rubiconproject.com` CSP block signatures in post-hotfix console audit buckets,
    - mobile `/guide -> /what-are-pennies -> /penny-list` SPA transition path preserved in-content wrappers with `blankActiveWrappers=0`,
    - `/report-find` remained ad-excluded (no ad wrappers / no route-plan payload).
  - Incident progression:
    - status remains `OPEN-S4-CSP-HARDENING-VERIFIED` (no downgrade).
    - next action remains `S5 - controlled rollout and partner confirmation pass`.
    - deadline remains `2026-03-12`.

## 25) Session Notes (2026-03-06, founder mobile re-enable request archived)

- `INC-MONUMETRIC-001`:
  - Founder sent a softer mobile-focused follow-up email to Samantha on `2026-03-06` asking for existing mobile-capable placements to be re-enabled before the weekend, while explicitly keeping `Mobile Header In-screen` off.
  - Canonical correspondence artifact:
    - `emails/monumetric-mobile-activation-final.md`
  - Deferred asks were split out so future follow-up stays focused:
    - `emails/monumetric-mobile-followup-notes.md`
  - Current posture:
    - wait for Samantha / ad ops response before making new asks about desktop refinement, mobile header reinstatement, or additional UUID provisioning.
  - Incident progression:
    - status remains `OPEN-S4-CSP-HARDENING-VERIFIED`.
    - next action is unchanged in substance: await partner response, then continue `S5 - controlled rollout and partner confirmation pass` with the new email context.
    - deadline remains `2026-03-12`.
