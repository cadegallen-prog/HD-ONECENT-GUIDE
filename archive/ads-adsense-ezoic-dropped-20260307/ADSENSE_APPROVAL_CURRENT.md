# ADSENSE_APPROVAL_CURRENT

**Last updated:** 2026-02-18  
**Owner:** Cade (founder)  
**Status:** Active (remediation deployed; founder-reported third AdSense review in progress; awaiting Google decision)

---

## 1) Objective (What this topic controls)

This topic is the canonical context for AdSense + Monumetric low-value-content recovery, crawl/index hygiene, and host/canonical consistency.

Use this file to avoid re-learning the same facts in new context windows.

Primary incident tracker: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` (`INC-ADSENSE-001`, `INC-ADMANAGER-001`).

---

## 2) Confirmed Current State (Evidence-backed)

### Host + sitemap

- Canonical host target is `https://www.pennycentral.com`.
- Redirect chain observed:
  - `http://pennycentral.com` → `https://pennycentral.com` (308)
  - `https://pennycentral.com` → `https://www.pennycentral.com` (301)
  - `https://www.pennycentral.com` → `200`
- `https://pennycentral.com/sitemap.xml` redirects to `https://www.pennycentral.com/sitemap.xml` (301).
- Live sitemap currently contains **18 URLs** (pillar-only).

### Indexing/crawl signals from provided exports

Source folder: `data/Google Search Console Stats`

- All known pages:
  - `Discovered - currently not indexed`: **742**
  - `Crawled - currently not indexed`: **10**
  - `Excluded by noindex`: **5**
  - `Redirect error`: **11**
  - File: `data/Google Search Console Stats/GSC Pages/Critical issues.csv`
- `www` sitemap slice:
  - `Discovered - currently not indexed`: **3**
  - File: `data/Google Search Console Stats/GSC sitemap www/Critical issues.csv`
- `non-www` sitemap slice:
  - `Discovered - currently not indexed`: **742** (historical noise)
  - File: `data/Google Search Console Stats/GSC sitemap non www/Critical issues.csv`

## 3) Root Pillar Strategy (Implemented Feb 2026)

We have consolidated the site's URL structure to a flat "Root Pillar" model to comply with AdSense "Replicated Content" policies and improve SEO signals.

### Core Changes

1.  **Removed Nested Guide Paths:**
    - Previously, content existed at both `/guide/[slug]` and `/[slug]`, or split across `/guide/part[1-7]`.
    - Now, ALL guide content lives at the root level (e.g., `/clearance-lifecycle`).
    - **Reason:** Prevents potential duplicate content flags where the same article appears under multiple URLs.

2.  **Explicit Redirects:**
    - Legacy paths (`/guide/*`, `/guide/part*`) are permanently redirected (308/301) to their root equivalents.
    - This preserves link equity from external backlinks while enforcing a single canonical URL for users and crawlers.

### Canonical URL List

These are the primary, indexable URLs for the site's core content:

- `/what-are-pennies`
- `/clearance-lifecycle`
- `/digital-pre-hunt`
- `/in-store-strategy`
- `/inside-scoop`
- `/facts-vs-myths` (Renamed from `fact-vs-fiction` for clarity)
- `/faq` (Consolidated from `responsible-hunting`)
- `/penny-list`
- `/store-finder`
- `/about`
- `/report-find`

### Legacy Redirects (Do Not Index)

These patterns are handled via `next.config.js` or page-level redirects and should not be used in internal links:

- `/guide/clearance-lifecycle` -> `/clearance-lifecycle`
- `/guide/part2` -> `/clearance-lifecycle`
- `/guide/digital-pre-hunt` -> `/digital-pre-hunt`
- `/guide/part3` -> `/digital-pre-hunt`
- ...and so on for all parts.

## 4) Verification

- **Analytics:** The `ai-analytics-verify.ts` script now only tests CANONICAL_ROUTES to ensure they fire correct GA4 page_view events. Legacy routes are excluded from this strict check to avoid 308 redirect noise, though they remain functionally tested via integration patterns.
- **AdSense:** The `ads.txt` and `script` injection remain global, but by consolidating URLs, we ensure the crawler sees a high-value, unique page inventory.

## 5) Next Steps

- Monitor Google Search Console for "Duplicate, Google chose different canonical than user" warnings.
- Ensure all internal links in `app/` point to the new root URLs.
- Console/resource errors are present (roughly `4/34` to `5/91` resources unavailable; 7 console messages).
- Re-checks indicate blocked resources are third-party adtech scripts (UID2/SODAR), not core page HTML.
- Home Depot image-block theory is currently weak:
  - sampled `thdstatic` images return `200` for bot UAs with referer.
  - product images on sampled SKU pages render with non-zero `naturalWidth`.

### Monetization context (approval in progress)

- **Monumetric:** review/approval in progress; required disclosures + `ads.txt` must remain intact.
- **AdSense:** founder-reported third review cycle is in progress as of 2026-02-18.

### Approval timeline (evidence-locked, updated Feb 13, 2026)

- **Feb 2, 2026 (10:33 PM):** Founder reported first AdSense denial ("Low Value Content") in Monumetric thread.
  - Evidence: `.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md` (source PDF: `monumental/email-samanthaMelaney_publisher_sucesss_associate.pdf`).
- **Feb 3, 2026:** Founder re-applied to AdSense (intentional immediate reapply).
- **Feb 12, 2026 (morning):** AdSense status changed to "We found some policy violations" (Needs Attention UI).
  - Evidence: `.ai/evidence/adsense/2026-02-12-needs-attention-policy-violations.md` and AdSense policy help page link:
    `https://support.google.com/adsense/answer/10502938?hl=en`.
- **Same period:** Ezoic/Google Ad Manager domain decline also occurred (exact decline artifact still missing).
- **Feb 9, 2026 (founder-reported):** Re-submitted through Ezoic for GAM pathway.
- **Feb 11, 2026:** Monumetric reported "approved by our ad providers" (pathway-specific approval signal; does not by itself clear AdSense policy state).
  - Interpretation lock: this indicates Monumetric-side partner network eligibility, not a universal Google account approval state.
  - Reference context: Monumetric program pages list "approved by major ad providers" as a partner requirement:
    - `https://www.monumetric.com/propel/`
    - `https://www.monumetric.com/ascend/`
- **Operational preference (founder):** Ezoic remains de-prioritized; Monumetric + Journey are preferred, but AdSense policy remediation is required before new re-review requests.

> Canonical source for status/deadlines/closure criteria: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`.

### Route snapshot (live, updated Feb 13, 2026)

- Live production snapshot for core audit routes now shows:
  - `status=200`
  - `canonical=self`
  - `noindex=false`
- Coverage routes:
  - Guide canonical set (hub + chapters):
    - `/guide`
    - `/what-are-pennies`
    - `/clearance-lifecycle`
    - `/digital-pre-hunt`
    - `/in-store-strategy`
    - `/inside-scoop`
    - `/facts-vs-myths`
    - `/faq`
  - Trust/utility set:
    - `/privacy-policy`, `/terms-of-service`, `/contact`, `/about`, `/penny-list`
- Evidence artifact:
  - `.ai/evidence/adsense/2026-02-13-route-snapshot.json`
- Representative SKU route snapshot (5 samples):
  - `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`
  - Current sampled state: `status=200`, `canonical=self`, `robots=noindex,follow`

> Prior homepage-canonical risk notes are now considered historical and not the current primary blocker.

> Route model lock: `/guide/*` chapter URLs are legacy aliases only; canonical chapter URLs are root-level.

### Policy gate status (updated Feb 13, 2026)

- Route-level policy audit completed:
  - `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`
- Current gate result: `CONDITIONAL-GO` after deployment and refreshed evidence snapshots.
- Prior route blockers were rewritten in source:
  - `/in-store-strategy` (now medium risk, rewritten)
  - `/inside-scoop` (now low risk, rewritten)
  - `/faq` (now low risk, rewritten)
- Operational next step:
  - deploy updated copy and refresh evidence artifacts before any review submission.

---

## 3) Non-Negotiables (Until approval is stable)

1. Keep sitemap **small and intentional** (pillar-only).
2. Keep thin programmatic pages `noindex,follow` unless they are enriched.
3. Do not add bulk thin URLs back into sitemap to chase volume.
4. Do not request AdSense re-review until the policy matrix gate passes (no unresolved Critical/High items).
5. Maintain factual accuracy on guide content; revert inaccurate splits if needed.
6. Keep Ezoic as non-priority unless founder explicitly requests reactivation.

---

## 4) Decision Log (Frozen assumptions)

- **Accepted:** `www` as canonical host.
- **Accepted:** Domain property can show both `www` and apex sitemap submissions; this alone is not a blocker.
- **Accepted:** Journey/Grow (`faves.grow.me`) can remain active for data buildup.
- **Accepted:** Monumetric-required disclosures/assets must remain present during review.
- **Not accepted:** Re-expanding sitemap with hundreds of thin URLs before quality hardening.
- **Pending:** Whether to allow UID2/SODAR scripts via CSP or keep blocked during approval window.

---

## 5) Open Questions

1. Which exact AdSense policy subcategory is driving the Feb 12 "policy violations" state (if surfaced in Policy Center detail)?
2. What exact artifact/date corresponds to the Ad Manager decline through Ezoic (`INC-ADMANAGER-001`)?
   - Current founder-reported anchor: decline happened before 2026-02-09 re-submission.
3. Should UID2/SODAR be allowed via CSP for cleaner crawl diagnostics, or intentionally blocked to reduce script surface?
4. Which SKU subset, if any, should eventually move from `noindex` to indexable after enrichment?

---

## 6) Fast Handoff Checklist (new context window)

Read in this order:

1. `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
2. `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md`
3. `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (this file)
4. `app/sitemap.ts`
5. `app/sku/[sku]/page.tsx`
6. `app/layout.tsx` + page-level metadata on indexed routes
7. `data/Google Search Console Stats/**` exports (already checked)

Quick verification commands:

```powershell
curl.exe -I https://pennycentral.com
curl.exe -I https://www.pennycentral.com/sitemap.xml
```

```powershell
[xml]$doc=(Invoke-WebRequest -Uri https://www.pennycentral.com/sitemap.xml -UseBasicParsing).Content
$doc.urlset.url.loc.Count
```

---

## 7) Related Docs

- Plan (archived): `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md`
- Existing monetization context: `.ai/topics/MONETIZATION.md`
- Incident command center: `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- Policy matrix (re-review gate): `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md`
- Evidence folder: `.ai/evidence/adsense/`
- Audit skill: `docs/skills/adsense-low-value-content-audit.md`
