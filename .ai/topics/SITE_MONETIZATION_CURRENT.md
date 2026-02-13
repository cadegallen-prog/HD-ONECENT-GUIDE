# SITE_MONETIZATION_CURRENT

**Last updated:** 2026-02-13  
**Owner:** Cade (founder)  
**Status:** Runtime foundation complete; tier dispute + cross-network incident hardening active (Monumetric + AdSense + Ad Manager + Journey)

---

## 1) Objective (What this topic controls)

This topic is the canonical current-state audit for sitewide monetization readiness across all major route types.

Use it to avoid losing context between guide work, approval-readiness, and future Monumetric integration.

---

## 2) Confirmed Current State (Repo + founder context)

### Monetization/approval context

- Founder goal: maximize revenue without meaningful UX degradation, especially on mobile-heavy traffic.
- Runtime ad control target: Monumetric script (not Auto Ads placement strategy).
- Approval bottleneck is readiness/inventory quality, not ad tag placement alone.
- Related context files:
  - `.ai/topics/MONETIZATION.md`
  - `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`
  - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`

### Monumetric Onboarding Status & Tier Dispute

**Current status (as of 2026-02-12):**

- **Tier status:** DISPUTED — Samantha placed site in Propel (10K-80K pageviews, $99 fee), but site traffic (85K pageviews) qualifies for Ascend (80K-500K, no fee) per published criteria
- **Onboarding stage:** Site approved, awaiting tier resolution before ad tag implementation
- **Blocker:** Metric inconsistency and traffic legitimacy accusation

**Key events:**

- **Jan 23 - Feb 10:** Standard onboarding (MCM setup, framework confirmation, Google approval wait)
- **Feb 11:** Site approved by Monumetric. Samantha sends ad strategy proposal. Cade provides GA4 screenshot (85K pageviews, 25K sessions, 17K users) and asks about Ascend eligibility.
- **Feb 11:** Samantha responds saying they use "active users" (17K doesn't qualify), need "3 months consistency," and accuses Cade of potentially buying traffic due to 97.6% US traffic.
- **Feb 12 AM:** Cade researches Monumetric T&C, discovers Section 12.9 graduation vs. application distinction
- **Feb 12 AM (parallel signal):** AdSense status moved to "We found some policy violations" (Needs Attention), replacing prior low-value-only denial state.
- **Feb 12 PM:** Cade sends comprehensive pushback email with Facebook group proof (63.7K members, admin status), Section 12.9 legal argument, and request for written criteria clarification

**The tier dispute (documented arguments):**

| What Samantha Said                     | What Published Documentation Says                          | Evidence                                                                                 |
| -------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| "We look at active users" (Feb 11)     | "Monthly pageviews"                                        | Join page, application form, Propel page, T&C Section 12.9, all third-party sources      |
| "We look at session pageviews" (Feb 4) | "Monthly pageviews" or "page views"                        | Same as above                                                                            |
| "Need 3 months consistency"            | "Two consecutive months" (for Propel graduation)           | T&C Section 12.9                                                                         |
| Two-month rule applies to Cade         | Rule applies to "Propel sites" qualifying for "graduation" | T&C Section 12.9 (Cade is not a Propel site yet — hasn't paid, gone live, or served ads) |

**CRITICAL DISTINCTION (Nuclear Argument):**

There are TWO pathways to Ascend:

1. **Propel Graduation (Section 12.9):** Existing Propel sites need 80K+ pageviews for TWO consecutive months to graduate
2. **Direct Ascend Application (Join Page):** NEW applicants apply with current traffic in Ascend range (80K-500K) - no consecutive month requirement documented

Cade is pathway #2 (new applicant, not Propel site). Samantha is applying pathway #1 rules (graduation) to pathway #2 (new application), which is a category error. **If Cade accepts Propel now, he locks himself into the graduation pathway. If he's evaluated as a direct Ascend applicant, he bypasses the two-month requirement entirely.**

**Traffic legitimacy proof provided:**

- Link to "Home Depot One Cent Items" Facebook group: https://www.facebook.com/groups/homedepotonecent (63.7K members)
- Screenshot showing: group size, Cade's admin status (matching email/name), website in featured section
- Traffic breakdown: 57% Direct, 22% Organic Social, 13% Organic Search, 1% Referral (all organic)
- Engagement metrics: 18-28% bounce rate, 1-2+ min engagement, 1.54 pages/session, 53% scroll (disproves bots)
- Context: Home Depot is US retailer, penny deals are US phenomenon, 97.6% US traffic is natural for this niche

**Awaiting response scenarios:**

1. **Best case (40% probability):** Samantha escalates internally, Ascend approved based on pageviews
2. **Likely case (40% probability):** Samantha doubles down on Propel, may offer waived $99 fee or upgrade commitment
3. **Ideal case (15% probability):** Samantha accepts Ascend after reviewing Section 12.9 argument
4. **Silent case (5% probability):** No response for 5+ days, requires follow-up/escalation

**Decision framework if Propel offered:**

- ✅ **Accept:** Fee waived OR written upgrade commitment after 2 months at 80K+
- ⚠️ **Maybe:** Fee waived but vague upgrade promise (request written criteria first)
- ⚠️ **Maybe:** Full $99 fee but written upgrade commitment (will recoup in ~1 week)
- ❌ **Escalate/walk:** Full $99 fee AND no upgrade commitment

**Alternative ad networks (backup):**

- **Ezoic:** No traffic requirement, $0 fee, MCM already set up (can reactivate immediately)
- **Mediavine:** 50K sessions/month required (currently at 25K — need ~2-3 months growth)
- **Raptive:** 100K pageviews/month required (currently at 85K — need ~1-2 months growth)
- **AdSense:** State changed on Feb 12, 2026 from low-value history to "We found some policy violations"; re-review is blocked until incident gate passes.

**Next follow-up:** Wait 3-5 business days (until Feb 17-19), then send check-in if no response. Escalate past Samantha if response is unsatisfactory and no compromise offered.

### Cross-network incident posture (locked Feb 13, 2026)

- Monumetric remains in escalation mode (Round 1 already sent on Feb 12).
- AdSense is in policy-remediation mode (no blind re-review).
- Current policy matrix gate result is `CONDITIONAL-GO` after deployment + refreshed evidence snapshots.
- Ad Manager is currently in **status-split** mode:
  - founder reports decline occurred before Ezoic re-submission on Feb 9
  - Monumetric reported "approved by our ad providers" on Feb 11 (partner-network eligibility signal, not universal AdSense/GAM account approval)
  - unified GAM disposition is not visible in a single console view across pathways.
- Journey remains pending; if approved first, use as continuity-primary while unresolved incidents stay tracked.
- Canonical tracker for all four incidents: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`.
- AdSense/Ad Manager re-review gate matrix: `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md`.

**Reference documentation:**

- Canonical incident timeline + deadlines: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- Primary evidence bundle: `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf`
- OCR evidence extract: `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`
- Route-level policy audit evidence: `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`
- Technical launch spec (ready to implement once tier resolved): `.ai/impl/monumetric-launch-spec.md`

---

### Planning/execution state

- Canonical launch roadmap: `.ai/impl/monumetric-launch-spec.md`.
- **Completed runtime work (2026-02-11):** Phases 1-4 implementation:
  - `lib/analytics.ts`: reserved-key sanitizer + attribution normalization (`ui_source`).
  - `lib/ads/route-eligibility.ts`: runtime hard-exclusion enforcement for trust/safety/system routes.
  - `lib/ads/launch-config.ts`: provider-managed placement mode + sticky reserve as opt-in.
  - `lib/ads/slot-plan.ts`: provider-managed route planning (no matrix-driven inventory forcing).
  - `components/ads/route-ad-slots.tsx`: metadata payload only (no forced route unit markers).
  - `components/penny-list-mobile-utility-bar.tsx`: top auto-hide mobile utility with sheet-lock visibility behavior.
  - `components/ads/mobile-sticky-anchor.tsx`: sticky reserve slot scaffold with safe-area handling.
  - `components/penny-list-client.tsx`: mobile utility swap, sticky reserve padding/anchor wiring, and prompt-stack pause gating (currently dormant while sticky reserve is disabled by default).
  - Route wiring complete on: `/`, `/penny-list`, `/guide`, canonical guide chapters, `/sku/[sku]`, `/pennies/[state]`.
  - `lib/ads/guardrail-report.ts`: baseline guardrail evaluator (hard/soft/no-lift rollback decisions).
  - `scripts/monumetric-guardrail-report.ts`: operational report generator + artifact output in `reports/monumetric-guardrails/`.
  - `package.json`: added `npm run monumetric:guardrails`.
  - Unit coverage: `tests/analytics.test.ts`, `tests/ads-route-eligibility.test.ts`, `tests/ads-launch-config.test.ts`, `tests/ads-slot-plan.test.ts`, `tests/ads-guardrail-report.test.ts`.
- **Policy update (2026-02-12):** Founder approved Option B to avoid partner-placement conflicts:
  - provider-managed by default on non-excluded routes
  - hard exclusions enforced for `/report-find`, legal/support/auth/internal/API/redirect routes
  - no strict route inventory forcing
  - sticky reserve disabled until explicitly re-enabled after Monumetric guidance
- Next implementation target is partner integration operations (Monumetric tag/ID wiring + final placement guidance) after guardrail report inputs are flowing.

### Indexing baseline

- Sitemap is currently pillar-focused in `app/sitemap.ts`.
- Dynamic utility-heavy routes are handled with metadata controls in route files (`/sku/[sku]`, `/pennies/[state]`), per prior recovery strategy.

---

## 3) Route Surface Inventory (Current practical classes)

### A) Strong editorial pages (candidate monetized after quality gates)

- Guide chapter routes (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`)
- Supporting educational/trust pages as appropriate (`/about`, `/support`, selected help pages)

### B) Utility-heavy pages (conditional monetization)

- `/penny-list`
- `/sku/[sku]`
- `/pennies/[state]`
- `/report-find`

These pages must preserve fast utility; runtime policy enforces hard route exclusions while allowing provider-managed optimization on non-excluded surfaces.

### C) Structural/trust/legal pages (typically non-monetized)

- `/privacy-policy`
- `/terms-of-service`
- `/contact` (context-dependent; default conservative)

---

## 4) Locked Policy Decisions (from current strategy alignment)

- Keep active valid deal URLs live for users.
- Active-but-thin pages are temporary `noindex,follow` and ad-ineligible until enriched.
- Never delete/410 active valid inventory solely due to thinness.
- Redirect/410 only data-invalid, duplicate, broken, or truly non-viable records.
- Historical valid inventory is not invalid; keep as historical where useful.
- Canonical tags are for true duplicates/near-duplicates only.
- Homepage/main navigation must prioritize strong pages in first-layer IA.

---

## 5) Current Risks

- Strategy drift across agents if policies remain only in chat memory.
- Guide improvements could land while sitewide utility routes stay under-specified for monetization.
- Over-correcting for approval by adding heavy prelude content on utility routes could hurt repeat-user UX.
- Over-constraining route-level inventory in-app could conflict with Monumetric optimization and reduce fill/revenue.

---

## 6) Immediate Next Moves

1. Run Window B and Window C guardrail checks with `npm run monumetric:guardrails -- --input <window-metrics.json>` and archive each artifact path.
2. Keep `/report-find`, legal/support/auth/internal surfaces ad-excluded by policy module enforcement.
3. Keep route-level proof coverage refreshed whenever monetization surface templates are touched.
4. Keep analytics readouts blocked unless Phase 1 key hygiene (`ui_source` + reserved-key remap) and hard-exclusion enforcement remain intact under provider-managed mode.

---

## 7) Related Canonical Docs

- Sitewide plan (historical): `.ai/plans/sitewide-monetization-readiness.md`
- Launch spec (canonical): `.ai/impl/monumetric-launch-spec.md`
- Guide execution plan: `.ai/impl/guide-recovery.md`
- Monetization context: `.ai/topics/MONETIZATION.md`
- Approval context: `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`
- Incident command center: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- Plan registry: `.ai/plans/INDEX.md`
