# MONETIZATION_INCIDENT_REGISTER

**Last updated:** 2026-02-16  
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

| incident_id          | opened_date | last_update | status                               | evidence_path                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | known_facts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | unknowns                                                                                                                                                                                                | holdover_hypothesis                                                                             | review_request_submitted_at                         | earliest_re_eval_date                       | next_action                                                                                                                                                                              | deadline   | close_criteria                                                                                                                            |
| -------------------- | ----------- | ----------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `INC-ADSENSE-001`    | 2026-02-02  | 2026-02-16  | `OPEN-REMEDIATION-IMPLEMENTED-LOCAL` | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf` (OCR evidence), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`, `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-12-needs-attention-policy-violations.md`, `tests/adsense-readiness.spec.ts`, `reports/proof/adsense-readiness/*`, https://support.google.com/adsense/answer/10502938?hl=en | First denial: Low Value Content (`2026-02-02`). Re-applied (`2026-02-03`). Second denial state (`2026-02-12`): "We found some policy violations." Local remediation bundle implemented on `2026-02-16`: admin API bearer auth, noindex on auth-gated routes, privacy-policy provider disclosures plus Ezoic embed anchor, Consent Mode v2 region scoping, and footer disclaimer consistency update. Local verification passed (`npm run verify:fast`, `npm run e2e:smoke`, targeted Playwright readiness spec). Awaiting dev->main promotion and production verification artifacts. | Exact policy subsection(s) triggering denial not specified in AdSense UI.                                                                                                                               | `OPEN-CONDITIONAL` (evaluate holdover only after a newly logged review request and wait window) | `2026-02-03` (historical cycle)                     | `2026-02-10` (elapsed for historical cycle) | Promote verified remediation from `dev` to `main`, set `ADMIN_SECRET` in Vercel production, confirm live privacy-policy disclosures, and run re-review go/no-go from the updated matrix. | 2026-02-19 | AdSense site status moves to ready/approved, or explicit written policy subtype is resolved and verified by successful re-review.         |
| `INC-MONUMETRIC-001` | 2026-02-10  | 2026-02-13  | `OPEN-ESCALATION-R1-SENT`            | `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf`, `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`, https://www.monumetric.com/propel/                                                                                                                                                                                                                                                                                                                                                                 | Criteria changed in-thread from session pageviews (Feb 10) to active users (Feb 11) vs published monthly pageviews; founder pushback sent Feb 12. Monumetric also reported "approved by our ad providers" on Feb 11, which indicates partner-network eligibility and does not by itself guarantee direct AdSense account approval.                                                                                                                                                                                                                                                  | Written final qualification metric, lookback window, demotion logic, and remedy path still pending.                                                                                                     | `N/A`                                                                                           | `N/A`                                               | `N/A`                                       | Send follow-up on Feb 17; escalate to supervisor on Feb 19 if no concrete written resolution.                                                                                            | 2026-02-19 | Written criteria + acceptable tier/remedy agreement, or explicit decision to de-prioritize Monumetric as primary path.                    |
| `INC-ADMANAGER-001`  | 2026-02-06  | 2026-02-13  | `OPEN-STATUS-SPLIT`                  | `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (founder-reported), `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`                                                                                                                                                                                                                                                                                                                                                                                                            | Founder reports Ad Manager decline occurred last week, then resubmitted via Ezoic on `2026-02-09`. Monumetric side reported provider approval on `2026-02-11`.                                                                                                                                                                                                                                                                                                                                                                                                                      | Exact decline date/time, exact Google policy category, and artifact for the decline are still missing. Unified GAM status across Ezoic vs Monumetric pathways is not directly visible in one dashboard. | `N/A`                                                                                           | `2026-02-09` (Ezoic resubmission, founder-reported) | `2026-02-16`                                | Keep this incident in status-split mode until decline artifact is found or one pathway provides explicit final approval/decline reason.                                                  | 2026-02-20 | Exact decline evidence is pinned OR explicit final disposition is captured from active pathway with date/reason and recorded in register. |
| `INC-JOURNEY-001`    | 2026-01-12  | 2026-02-13  | `OPEN-PENDING-REVIEW`                | `.ai/STATE.md` (Grow installed + pending review context)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Grow is already implemented; Journey review is pending.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Exact reviewer ETA and decision status cadence.                                                                                                                                                         | `N/A`                                                                                           | `N/A`                                               | `N/A`                                       | Check Journey status every 3 business days and log updates in this register.                                                                                                             | 2026-02-27 | Journey approved + onboarding activated, or declined and replacement primary path selected/documented.                                    |

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

1. `2026-02-16`: attempt artifact recovery for `INC-ADMANAGER-001`; if unavailable, keep `OPEN-STATUS-SPLIT` with founder-reported timeline and pathway-specific status notes.
2. `2026-02-17`: Monumetric follow-up message (Round 2).
3. `2026-02-19`: Monumetric supervisor escalation if unresolved.
4. `2026-02-18`: deploy rewritten route copy and refresh evidence snapshots.
5. `2026-02-19`: AdSense re-review go/no-go decision based on matrix gate.
