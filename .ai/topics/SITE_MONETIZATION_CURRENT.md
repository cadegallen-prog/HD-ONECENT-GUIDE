# SITE_MONETIZATION_CURRENT

**Last updated:** 2026-02-08  
**Owner:** Cade (founder)  
**Status:** Planning baseline (sitewide architecture not yet implemented)

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

### Planning/execution state

- Guide has a detailed implementation plan: `.ai/impl/guide-recovery.md`.
- Guide implementation is currently split into phases; Phase 0/1 execution is in progress externally.
- Sitewide monetization architecture was not yet consolidated into one canonical plan before this topic.

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

These pages must preserve fast utility and require stricter ad-density and content-quality controls.

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
- Under-specifying route eligibility could create ad placement inconsistency for Monumetric onboarding.

---

## 6) Immediate Next Moves

1. Use `.ai/plans/sitewide-monetization-readiness.md` as canonical roadmap for non-guide surfaces.
2. Complete guide Phase 0/1 execution and audit outputs before Phase 2/3 guide rollout.
3. Build route-level eligibility matrix and mobile slot policy before any broad ad enablement.
4. Prepare a Monumetric handoff packet from finalized route policy + slot map.

---

## 7) Related Canonical Docs

- Sitewide plan: `.ai/plans/sitewide-monetization-readiness.md`
- Guide execution plan: `.ai/impl/guide-recovery.md`
- Monetization context: `.ai/topics/MONETIZATION.md`
- Approval context: `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`
- Plan registry: `.ai/plans/INDEX.md`
