# ADSENSE_APPROVAL_CURRENT

**Last updated:** 2026-02-06  
**Owner:** Cade (founder)  
**Status:** Active (AdSense denied; Monumetric escalation in progress)

---

## 1) Objective (What this topic controls)

This topic is the canonical context for AdSense + Monumetric low-value-content recovery, crawl/index hygiene, and host/canonical consistency.

Use this file to avoid re-learning the same facts in new context windows.

---

## 2) Confirmed Current State (Evidence-backed)

### Host + sitemap

- Canonical host target is `https://www.pennycentral.com`.
- Redirect chain observed:
  - `http://pennycentral.com` → `https://pennycentral.com` (308)
  - `https://pennycentral.com` → `https://www.pennycentral.com` (301)
  - `https://www.pennycentral.com` → `200`
- `https://pennycentral.com/sitemap.xml` redirects to `https://www.pennycentral.com/sitemap.xml` (301).
- Live sitemap currently contains **19 URLs** (pillar-only).

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

### Rendering/image assumptions

- Live URL tests provided by Cade show pages are index-eligible and return `200`.
- Console/resource errors are present (roughly `4/34` to `5/91` resources unavailable; 7 console messages).
- Re-checks indicate blocked resources are third-party adtech scripts (UID2/SODAR), not core page HTML.
- Home Depot image-block theory is currently weak:
  - sampled `thdstatic` images return `200` for bot UAs with referer.
  - product images on sampled SKU pages render with non-zero `naturalWidth`.

### Monetization context (approval in progress)

- **Monumetric:** review/approval in progress; required disclosures + `ads.txt` must remain intact.
- **AdSense:** review requested; avoid repeated re-review requests during structural changes.

### Founder-reported approval timeline (recorded Feb 6, 2026)

- **Feb 2-3, 2026:** AdSense rejection received for low-value content (exact date currently remembered as Feb 2 or Feb 3).
- **Same period:** Ezoic/Google Ad Manager evaluation was running concurrently.
- **Feb 6, 2026:** Founder reported Ad Manager was also declined via Ezoic path; interpreted as reinforcing that AdSense rejection likely was not an accidental false denial.
- **Early week of Feb 3, 2026:** Founder contacted Monumetric after AdSense denial while Ad Manager status was still pending.
- **Monumetric response (founder-reported):** Monumetric initially indicated no visible rejection on their side at that time, likely due timing/status mismatch between AdSense vs Ad Manager views.
- **Monumetric escalation:** Founder reports Monumetric has already contacted Google's approvals team.
- **Operational preference (founder):** Ezoic is de-prioritized; primary monetization target is Monumetric approval readiness.

> Note: This timeline is intentionally stored as founder-reported context. Keep it until contradicted by explicit screenshots/emails from the networks.

### Canonical risk (critical)

- Several indexed URLs currently emit homepage canonical:
  - Example affected paths: `/guide`, `/store-finder`, `/clearance-lifecycle`, `/faq`, `/privacy-policy`, etc.
- Root cause appears to be global canonical fallback from layout metadata.
- This is a high-priority SEO quality/crawl signal issue.

---

## 3) Non-Negotiables (Until approval is stable)

1. Keep sitemap **small and intentional** (pillar-only).
2. Keep thin programmatic pages `noindex,follow` unless they are enriched.
3. Do not add bulk thin URLs back into sitemap to chase volume.
4. Do not run repeated AdSense re-review requests during active major structural changes.
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

1. Should UID2/SODAR be allowed via CSP for cleaner crawl diagnostics, or intentionally blocked to reduce script surface?
2. Should guide stay split across chapters or be merged back to one accurate, high-authority page until trust is restored?
3. Which SKU subset, if any, should eventually move from `noindex` to indexable after enrichment?

---

## 6) Fast Handoff Checklist (new context window)

Read in this order:

1. `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (this file)
2. `app/sitemap.ts`
3. `app/sku/[sku]/page.tsx`
4. `app/layout.tsx` + page-level metadata on indexed routes
5. `data/Google Search Console Stats/**` exports (already checked)

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
- Audit skill: `docs/skills/adsense-low-value-content-audit.md`
