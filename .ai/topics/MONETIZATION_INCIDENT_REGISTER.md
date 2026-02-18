# MONETIZATION_INCIDENT_REGISTER

**Last updated:** 2026-02-18
**Owner:** Cade (founder)  
**Purpose:** Single source of truth for unresolved monetization incidents across ad networks.

---

## 1) Hard Rules (Non-Negotiable)

1. **No silent closure:** An incident cannot be closed without evidence and objective `close_criteria` met.
2. **Session open rule:** Read this file after `.ai/STATE.md` and `.ai/BACKLOG.md` for monetization work.
3. **Session close rule:** Update `status`, `next_action`, and `deadline` for every touched open incident.
4. **No blind re-review:** AdSense re-review is blocked until the policy matrix gate is passed.

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

| incident_id          | opened_date | last_update | status                                         | evidence_path                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | known_facts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | unknowns                                                                                                                                                                                                | holdover_hypothesis                                                                             | review_request_submitted_at                         | earliest_re_eval_date                       | next_action                                                                                                                                                                      | deadline   | close_criteria                                                                                                                            |
| -------------------- | ----------- | ----------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `INC-ADSENSE-001`    | 2026-02-02  | 2026-02-16  | `OPEN-REMEDIATION-DEPLOYED`                    | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf` (OCR evidence), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-12-needs-attention-policy-violations.md`, `tests/adsense-readiness.spec.ts`, `reports/proof/adsense-readiness/*`, https://support.google.com/adsense/answer/10502938?hl=en | First denial: Low Value Content (`2026-02-02`). Re-applied (`2026-02-03`). Second denial state (`2026-02-12`): "We found some policy violations." Remediation bundle was deployed to production on `2026-02-16`: admin API bearer auth, noindex on auth-gated routes, privacy-policy provider disclosures plus Ezoic embed anchor, Consent Mode v2 region scoping, footer/copy consistency, `/support` permanent redirect to `/transparency`, and retirement of `/internal-systems` via permanent redirect to `/guide`. Verification passed locally (`verify:fast`, `e2e:smoke`, `e2e:full`) and CI lanes (FAST/SMOKE/FULL) are green for merge commit `e9b7552`. Production checks confirm sitemap=18 and expected route directives. | Exact policy subsection(s) triggering denial not specified in AdSense UI.                                                                                                                               | `OPEN-CONDITIONAL` (evaluate holdover only after a newly logged review request and wait window) | `2026-02-03` (historical cycle)                     | `2026-02-10` (elapsed for historical cycle) | Founder submits refreshed sitemap to Search Console and initiates AdSense re-review once crawl refresh is requested; set `ADMIN_SECRET` in Vercel production in next ops window. | 2026-02-19 | AdSense site status moves to ready/approved, or explicit written policy subtype is resolved and verified by successful re-review.         |
| `INC-MONUMETRIC-001` | 2026-02-10  | 2026-02-17  | `OPEN-ASCEND-APPROVED-AWAITING-IMPLEMENTATION` | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf`, `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, https://www.monumetric.com/propel/                                                                                                                                                                                                                                                                                                                                                                 | Criteria changed in-thread from session pageviews (Feb 10) to active users (Feb 11) vs published monthly pageviews; founder pushback sent Feb 12. Sales Lead reviewed and approved Ascend tier on Feb 17. Monumetric reported "approved by our ad providers" on Feb 11 (restated Feb 17). Ad strategy submitted to technical team for code configuration. Founder confirmed ad strategy and green-lit implementation on Feb 17. Asked Samantha to clarify whether "approved by ad providers" includes GAM domain approval through Monumetric's MCM. Dashboard still shows onboarding status.                                                                                                                                          | Whether "approved by ad providers" includes GAM domain approval through Monumetric's MCM. GAM status through Monumetric pathway is not visible to founder (unlike Ezoic dashboard).                     | `N/A`                                                                                           | `N/A`                                               | `N/A`                                       | Await Samantha's response re: GAM domain approval clarification. Monitor dashboard for status change from onboarding to active. Escalate to supervisor on Feb 19 if no response. | 2026-02-19 | Ad code configured and ads serving live on site, or explicit blocker identified and documented.                                           |
| `INC-ADMANAGER-001`  | 2026-02-06  | 2026-02-13  | `OPEN-STATUS-SPLIT`                            | `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (founder-reported), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`                                                                                                                                                                                                                                                                                                                                                                                                            | Founder reports Ad Manager decline occurred last week, then resubmitted via Ezoic on `2026-02-09`. Monumetric side reported provider approval on `2026-02-11`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Exact decline date/time, exact Google policy category, and artifact for the decline are still missing. Unified GAM status across Ezoic vs Monumetric pathways is not directly visible in one dashboard. | `N/A`                                                                                           | `2026-02-09` (Ezoic resubmission, founder-reported) | `2026-02-16`                                | Keep this incident in status-split mode until decline artifact is found or one pathway provides explicit final approval/decline reason.                                          | 2026-02-20 | Exact decline evidence is pinned OR explicit final disposition is captured from active pathway with date/reason and recorded in register. |
| `INC-JOURNEY-001`    | 2026-01-12  | 2026-02-13  | `OPEN-PENDING-REVIEW`                          | `.ai/STATE.md` (Grow installed + pending review context)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Grow is already implemented; Journey review is pending.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Exact reviewer ETA and decision status cadence.                                                                                                                                                         | `N/A`                                                                                           | `N/A`                                               | `N/A`                                       | Check Journey status every 3 business days and log updates in this register.                                                                                                     | 2026-02-27 | Journey approved + onboarding activated, or declined and replacement primary path selected/documented.                                    |

---

## 4) 14-Day Parallel-Hardening Window (Locked)

- Keep Monumetric escalation active (do not wait idly).
- Run AdSense/Ad Manager policy remediation before any new re-review request.
- Keep Journey pending path ready for continuity activation.
- Treat Ezoic reactivation as fallback only, not default.

---

## 5) Re-Review Gate (AdSense / Ad Manager)

All must be true before re-review:

1. No unresolved `Critical` or `High` findings in policy matrix (`.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md`).
2. Policy-sensitive pages explicitly frame educational/safety guidance, not circumvention.
3. Technical checks are complete (crawlability, mobile usability, CWV sanity, policy page accessibility).
4. Evidence links for each resolved finding are recorded in this register.
5. Time-lag rule: once a review request is submitted, wait `7-14 days` before re-pivoting unless a new explicit policy subtype artifact appears.

---

## 6) Next Scheduled Actions

1. ~~`2026-02-16`: attempt artifact recovery for `INC-ADMANAGER-001`.~~ Kept in `OPEN-STATUS-SPLIT`.
2. ~~`2026-02-17`: Monumetric follow-up message (Round 2).~~ **DONE** — founder sent follow-up Feb 17. Confirmed ad strategy, green-lit implementation, asked about GAM domain approval status.
3. `2026-02-19`: Monumetric supervisor escalation if no response to Feb 17 email.
4. ~~`2026-02-16`: route/crawler remediation deployed to production.~~ Done.
5. `2026-02-17` to `2026-02-19`: founder submits sitemap + re-review request and executes AdSense go/no-go decision based on matrix gate.

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
