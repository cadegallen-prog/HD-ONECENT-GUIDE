# MONETIZATION_POLICY_VIOLATION_MATRIX

**Last updated:** 2026-02-13  
**Owner:** Cade (founder)  
**Linked incident:** `INC-ADSENSE-001` and `INC-ADMANAGER-001` in `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`

---

## 1) Gate Definition (Before Any AdSense Re-Review)

Re-review is blocked until all are true:

1. No unresolved `Critical` or `High` items in section 2.
2. Required page set in section 3 has a current audit status.
3. Evidence links for resolved items are recorded.

---

## 2) Policy Risk Matrix (Fixed Dimensions)

| Dimension                                                             | Current risk | Evidence / rationale                                                                                                                                                                                                    | Immediate action                                                                                                                         | Owner                   | Status                            |
| --------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------------------------- |
| Content policy framing (dishonesty/circumvention interpretation risk) | `Medium`     | Prior blocking language was rewritten in source to compliance-first wording. Evidence: `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`.                                                                         | Deploy updated copy and refresh evidence snapshots before review submission.                                                             | Cade + next implementer | `RESOLVED-IN-CODE-PENDING-DEPLOY` |
| Low-value/templated content risk                                      | `Medium`     | Prior low-value denial history plus large dynamic SKU/state surface; representative SKU routes are currently `noindex, follow` and self-canonical. Evidence: `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`. | Keep thin URLs noindex until enriched; continue SKU quality sampling before any index expansion.                                         | Next implementer        | `OPEN-MANAGED`                    |
| Misleading UX/presentation risk                                       | `Low`        | Trust/policy pages are present and indexable with self-canonical signals. Evidence: `.ai/evidence/adsense/2026-02-13-route-snapshot.json` and route audit.                                                              | Maintain disclosure consistency and update dates when legal text changes.                                                                | Next implementer        | `OPEN-MONITOR`                    |
| Traffic quality risk                                                  | `Medium`     | US-heavy niche traffic is expected, but broad policy state requires explicit quality checks.                                                                                                                            | Document traffic provenance and flag any suspicious source anomalies before re-review.                                                   | Cade + next implementer | `OPEN`                            |
| Account/config risk (cross-network domain status mismatch)            | `Medium`     | AdSense + Ad Manager signals overlap; founder reports Ezoic re-submission on 2026-02-09 while Monumetric reports provider approval on 2026-02-11. Exact Ad Manager decline artifact/date is still missing.              | Keep `INC-ADMANAGER-001` in status-split mode, backfill decline evidence when available, and map reason to this matrix before re-review. | Cade + next implementer | `OPEN-STATUS-SPLIT`               |

---

## 3) Required Page-Level Audit Set (Locked)

| Route                             | Risk focus                                           | Current status             | Evidence path                                                                                                      | Notes                                                                                         |
| --------------------------------- | ---------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `/guide`                          | Overall policy framing + quality                     | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`     | Trust/compliance framing present.                                                             |
| `/in-store-strategy`              | Highest dishonesty/circumvention interpretation risk | `AUDITED-MEDIUM-REWRITTEN` | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`                                                            | Blocking phrasing removed; pending deployment evidence refresh.                               |
| `/inside-scoop`                   | Insider-language interpretation risk                 | `AUDITED-LOW-REWRITTEN`    | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`                                                            | Prior high-risk wording replaced with neutral policy-handling language.                       |
| `/facts-vs-myths`                 | Accuracy/trust framing                               | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`                                                            | Generally anti-myth and policy-safe.                                                          |
| `/faq`                            | Behavioral guidance framing                          | `AUDITED-LOW-REWRITTEN`    | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`                                                            | Verification answer now uses normal checkout + final store decision wording.                  |
| `/privacy-policy`                 | Disclosure completeness                              | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`     | Disclosure baseline acceptable.                                                               |
| `/terms` (`/terms-of-service`)    | Policy/legal clarity                                 | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`     | Legal framing present and accessible.                                                         |
| `/contact`                        | Trust/ownership clarity                              | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`     | Strong trust/contact signals.                                                                 |
| `/about`                          | E-E-A-T/trust narrative                              | `AUDITED-LOW`              | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-route-snapshot.json`     | Ownership and transparency signals present.                                                   |
| Representative `/sku/[sku]` pages | Thin/templated content risk                          | `AUDITED-LOW-MANAGED`      | `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`, `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json` | 5 representative SKU routes sampled; `noindex, follow` currently managing index-quality risk. |

---

## 4) Current Findings Summary (from completed route audit)

1. **Resolved in code:** `/in-store-strategy` evasion-like phrasing was replaced with compliance-first wording.
2. **Resolved in code:** `/inside-scoop` log-avoidance phrasing was replaced with neutral policy-handling wording.
3. **Resolved in code:** `/faq` wording now references normal checkout flow and final store decision.
4. **Non-blocking:** trust/legal routes are present and technically healthy.
5. **Non-blocking-managed:** representative SKU routes remain noindex/self-canonical and technically healthy.
6. **Operational pending:** deploy + fresh evidence snapshot before requesting new review.

Primary evidence: `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`.

---

## 5) Exit Criteria

Mark this matrix `READY` only when:

1. Every route in section 3 is audited and has evidence.
2. All section 2 `High`/`Critical` items are resolved or explicitly risk-accepted by Cade.
3. Incident register entries for `INC-ADSENSE-001` and `INC-ADMANAGER-001` reflect the final go/no-go decision.
