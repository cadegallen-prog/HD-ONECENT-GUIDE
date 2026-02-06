# AdSense Approval Hardening Plan (Living)

**Created:** 2026-02-05  
**Last updated:** 2026-02-05  
**Status:** Planning  
**Owner:** Cade (founder)

## 0) GOAL / WHY / DONE MEANS

**GOAL:**  
Recover **AdSense + Monumetric** approval while preserving long-term monetization upside (Journey now, higher-RPM networks later) without sacrificing content trust.

**WHY:**  
Current rejection risk is likely quality/canonical/index hygiene, not traffic volume. Repeated review requests during unstable content or metadata increase delay and confusion for **both** AdSense and Monumetric.

**DONE MEANS:**

- All indexed pillar URLs have self-canonical metadata (no accidental homepage canonical collapse).
- Sitemap remains intentional (pillar-only), consistent with canonical host `www`.
- Thin/programmatic pages remain `noindex,follow` until enriched.
- Guide content is factually reliable (single-source truth restored if split chapters are inaccurate).
- Third-party script noise is either intentionally allowed or intentionally blocked with a documented reason.
- A single, stable evidence bundle exists before the next review cycle.

## 1) Hard Constraints (Non-Negotiable)

- Reuse existing infrastructure; no new dependencies for this initiative.
- Keep canonical host `https://www.pennycentral.com`.
- Do not reintroduce bulk thin URLs into sitemap during hardening.
- Preserve Journey/Grow signal collection unless a verified blocker appears.
- Preserve Monumetric onboarding assets (privacy policy disclosure + ads.txt) during review window.
- Maintain factual integrity: incorrect guide claims are higher risk than page-count changes.
- Verification must be explicit and reproducible (commands + artifacts).

## 2) Current State (What exists today)

Audit doc: `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`

- Sitemap is pillar-only at 19 URLs (`app/sitemap.ts`).
- SKU pages are `noindex,follow` (`app/sku/[sku]/page.tsx`).
- `www` is canonical target; apex redirects to `www`.
- GSC still shows large historical discovered-not-indexed inventory in all-known/non-www slices.
- Blocking issue: many indexed pages currently emit homepage canonical from layout fallback.
- Rendering issue is mostly adtech noise (UID2/SODAR CSP), not core content/images.

## 3) Decisions (Prevent Drift)

- **Canonical policy:** Every indexable page must self-canonicalize; layout-level homepage canonical is not a substitute.
- **Sitemap policy:** Include only pages that are both high-quality and intended for index.
- **SKU policy:** Keep SKU pages noindexed until enriched with materially unique value.
- **Guide policy:** Accuracy first. Prefer one reliable guide page over six inaccurate ones.
- **Adtech policy:** Keep Journey (`faves.grow.me`) active and keep Monumetric-required disclosures/assets intact; treat UID2/SODAR handling as explicit configuration, not accidental behavior.

## 4) Phase Plan (Implementation Specs)

### Phase 1 - Canonical Integrity Repair (highest priority)

- **Goal:** Remove conflicting canonical signals that dilute index quality.
- **Exact files to modify:**
  - `app/layout.tsx`
  - Indexable route metadata files (for all sitemap URLs), including:
    - `app/guide/page.tsx`
    - `app/store-finder/page.tsx`
    - `app/clearance-lifecycle/page.tsx`
    - `app/facts-vs-myths/page.tsx`
    - `app/what-are-pennies/page.tsx`
    - `app/digital-pre-hunt/page.tsx`
    - `app/in-store-strategy/page.tsx`
    - `app/inside-scoop/page.tsx`
    - `app/faq/page.tsx`
    - `app/resources/page.tsx`
    - `app/report-find/page.tsx`
    - `app/trip-tracker/page.tsx`
    - `app/about/page.tsx`
    - `app/contact/page.tsx`
    - `app/support/page.tsx`
    - `app/privacy-policy/page.tsx`
    - `app/terms-of-service/page.tsx`
- **Exact changes:**
  - Remove homepage-wide canonical fallback from root metadata.
  - Add explicit `alternates.canonical` per indexable route via `getCanonicalUrl(...)`.
- **Risks / edge cases:**
  - Missing metadata exports on some pages.
  - Inconsistent title/description quality after metadata touch-ups.
- **Metrics:**
  - 19/19 sitemap URLs return self-canonical.
  - GSC canonical mismatches trend down over next recrawl window.

### Phase 2 - Sitemap + Host Hygiene Stabilization

- **Goal:** Keep crawl scope clean and unambiguous.
- **Exact files to modify:**
  - `app/sitemap.ts` (only if page list/priority needs correction)
  - `app/robots.ts` (only if host/sitemap pointer drifts)
- **Exact changes:**
  - Keep sitemap at high-quality pillar URLs only.
  - Confirm sitemap pointer remains `https://www.pennycentral.com/sitemap.xml`.
  - Keep apex redirect behavior as-is unless one-hop optimization is explicitly prioritized.
- **Risks / edge cases:**
  - Domain property will still show historical discovered URLs; avoid overreacting.
- **Metrics:**
  - Live sitemap remains 19 (or intentional revised number) valid URLs.
  - No accidental inclusion of thin/noindex routes.

### Phase 3 - Guide Trust Recovery (content correctness gate)

- **Goal:** Restore authority and reduce low-value perception from inaccurate content.
- **Exact files to modify (decision-dependent):**
  - If restoring single-page guide: `app/guide/page.tsx`
  - If keeping chapter split: chapter pages and shared guide components
- **Exact changes:**
  - Remove incorrect claims.
  - Add source-backed, current operational guidance only.
  - Ensure each indexed guide page carries distinct, substantive value.
- **Risks / edge cases:**
  - AI-authored drift introducing unverified claims.
  - Duplicate/near-duplicate text across split chapters.
- **Metrics:**
  - Manual content QA pass completed (accuracy checklist).
  - Reduced contradiction reports and lower bounce on guide surfaces.

### Phase 4 - Thin Page Strategy (controlled expansion only)

- **Goal:** Keep noindex thin pages from harming site-level quality until enrichment exists.
- **Exact files to modify:**
  - `app/sku/[sku]/page.tsx` (policy remains noindex until criteria met)
  - future enrichment components/data surfaces (to be defined)
- **Exact changes:**
  - Maintain `noindex,follow` on SKU templates.
  - Define objective enrichment threshold for any future indexable SKU subset.
- **Risks / edge cases:**
  - Premature indexing of templated pages reintroduces low-value signal.
- **Metrics:**
  - SKU indexation remains controlled and intentional.

### Phase 5 - Adtech Signal Strategy (Journey + Monumetric readiness)

- **Goal:** Preserve Journey data collection while minimizing crawl/debug noise.
- **Exact files to review/modify:**
  - `app/layout.tsx`
  - `next.config.js` CSP directives
- **Exact changes (choose one):**
  - Option A: allow UID2/SODAR domains in CSP to reduce console noise.
  - Option B: keep blocked intentionally; document rationale and ignore as non-critical.
- **Risks / edge cases:**
  - Over-broad CSP expansion.
  - Confusing “failed resources” diagnostics in GSC live tests.
- **Metrics:**
  - Known non-critical errors are stable and documented.
  - No core render/image failures for bot UA tests.
  - Monumetric-required disclosures/assets remain present during review.

### Phase 6 - Proof Bundle + Review Cadence Discipline

- **Goal:** Stop reactive churn and enforce one stable evidence pass.
- **Artifacts required before next review request:**
  - Canonical self-check result for all sitemap URLs.
  - GSC export snapshots (pages/sitemaps/crawl/performance).
  - Bot-render check for key pages (home, penny-list, guide, policy, sample SKU).
  - Content QA checklist sign-off for guide accuracy.
- **Cadence rule:**
  - Avoid repeated review requests while major changes are still rolling out.

## 5) Open Questions (Plan is incomplete until resolved)

1. Should guide be temporarily consolidated into one authoritative page until chapter accuracy is stable?
2. Which CSP posture is preferred for UID2/SODAR during the approval window (allow vs intentionally blocked)?
3. What exact enrichment threshold should govern any future SKU indexing pilot?

## 6) Rollback Plan

- Canonical metadata changes can be reverted by restoring previous metadata exports per page.
- If guide split remains unstable, revert to last known-good single-page guide content.
- If adtech changes increase risk/noise, revert CSP/script toggles and keep minimal stable setup.

## Appendix A: Implementation Checklist

- [ ] Canonical repair complete on all indexable pages
- [ ] Sitemap integrity validated (URL count + intended pages)
- [ ] Guide accuracy validated by manual checklist
- [ ] Bot render check complete (core content/images healthy)
- [ ] Decision on UID2/SODAR documented
- [ ] Evidence bundle archived for next review cycle

## Appendix B: Drift Checks (run before implementation)

- **Naming collisions:** ensure canonical host/docs consistently use `www.pennycentral.com`.
- **Route matching safety:** avoid broad matching that tags thin routes as indexable.
- **Infra reuse confirmation:** no new tables/routes/dependencies required for this plan.
