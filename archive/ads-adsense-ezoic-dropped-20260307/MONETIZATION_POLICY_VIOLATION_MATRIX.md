# MONETIZATION_POLICY_VIOLATION_MATRIX

**Last updated:** 2026-02-18  
**Owner:** Cade (founder)  
**Linked incidents:** `INC-ADSENSE-001`, `INC-ADMANAGER-001`, `INC-MONUMETRIC-001`

---

## 1) Re-Review Gate (Current)

Re-review is blocked unless all are true:

1. No unresolved `Critical` findings.
2. No unresolved `High` findings without explicit founder risk-acceptance.
3. Trust/legal routes are live and linked.
4. Sitemap/robots/crawl posture is verified and evidence is current.

Current gate result: `CONDITIONAL-GO` (no Critical/High technical blockers found; content-quality risk remains open).

---

## 2) Requirement Matrix (Google Source -> Current Pass/Fail)

| Requirement (Google source)                                                                                                                                           | AdSense status | GAM/MCM child-site status | Evidence (repo/live)                                                                                                                                                                                               | Remaining risk                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Site is publicly available and not under construction (`support.google.com/admanager/answer/10983851`)                                                                | `PASS`         | `PASS`                    | Live checks on 2026-02-18: `/`, `/penny-list`, `/guide`, `/privacy-policy`, `/terms-of-service`, `/contact`, `/transparency`, `/do-not-sell-or-share`, `/sitemap.xml`, `/robots.txt`, `/ads.txt` all return `200`. | None.                                                                    |
| Crawler access is not blocked (`support.google.com/admanager/answer/10983851`)                                                                                        | `PASS`         | `PASS`                    | `app/robots.ts` allows `/` and includes canonical sitemap; targeted readiness spec confirms expected robots directives on gated routes.                                                                            | None.                                                                    |
| Required trust/legal surfaces are present and easy to reach                                                                                                           | `PASS`         | `PASS`                    | `components/footer.tsx` links to `/about`, `/contact`, `/transparency`, `/privacy-policy`, `/terms-of-service`, `/do-not-sell-or-share`.                                                                           | Keep footer links stable.                                                |
| Privacy + ad-tech disclosure is present and specific                                                                                                                  | `PASS`         | `PASS`                    | `app/privacy-policy/page.tsx` includes Google, GA4, Monumetric, Ezoic, Resend, Supabase, Vercel, Sentry disclosures + `#ezoic-privacy-policy-embed`.                                                               | Keep provider list synced to runtime changes.                            |
| No stale retired monetization claims (Rakuten/PayPal/donations/affiliate claims)                                                                                      | `PASS`         | `PASS`                    | `tests/disclosure-claims-accuracy.test.ts` passes against source files; retired go routes redirect to `/transparency`.                                                                                             | Keep anti-drift tests active.                                            |
| Sitemap quality and canonical host consistency                                                                                                                        | `PASS`         | `PASS`                    | `app/sitemap.ts` pillar-only with 18 URLs (includes trust pages); `app/robots.ts` points to `https://www.pennycentral.com/sitemap.xml`; `npx tsx scripts/ads-readiness-check.ts --production` passed (7/7).        | Keep dynamic thin routes out of sitemap until enriched.                  |
| Auth/tokenized surfaces are not presented as index targets                                                                                                            | `PASS`         | `PASS`                    | Readiness Playwright suite asserts `noindex,nofollow` on `/lists` and `/login`; `noindex,follow` on `/s/[token]`.                                                                                                  | None.                                                                    |
| Content quality/value requirement (policy + site review quality judgment) (`support.google.com/adsense/answer/48182`, `support.google.com/admanager/answer/10983851`) | `AT-RISK`      | `AT-RISK`                 | Prior AdSense denials include low-value and policy-violation states; dynamic thin surfaces are currently mitigated by noindex strategy.                                                                            | Reviewer quality judgment is subjective and still the top residual risk. |
| Cross-network approval-state clarity (AdSense vs Ezoic GAM vs Monumetric MCM)                                                                                         | `AT-RISK`      | `AT-RISK`                 | Incident register shows status split: AdSense review in progress, Ezoic GAM review pending, Monumetric provider-approved but GAM confirmation not explicit.                                                        | Need explicit written disposition from each active pathway.              |

---

## 3) 2026-02-18 Audit Conclusion

- **AdSense:** `CONDITIONAL PASS` on technical/privacy/trust infrastructure. Still `AT-RISK` on subjective quality evaluation until current review returns.
- **Google Ad Manager domain approval (via partners):** `AT-RISK` because final status is pathway-split and not visible in one dashboard.
- **If declined again:** treat decline reason as authoritative and map it directly into this matrix before next re-review.

---

## 4) Immediate Actions (Owner: Founder)

1. Keep current review windows open (do not submit new overlapping requests).
2. Ask Monumetric for explicit wording: "Is PennyCentral domain GAM-approved in your MCM pathway, yes/no, and on what date?"
3. If AdSense returns a denial, capture exact Policy Center subtype and attach it to `INC-ADSENSE-001` before any further edits.

---

## 5) Source Links (Primary)

- AdSense Program Policies: `https://support.google.com/adsense/answer/48182`
- AdSense policy violations state: `https://support.google.com/adsense/answer/10502938`
- Ad Manager child-site review requirements: `https://support.google.com/admanager/answer/10983851`
- Ad Manager child account status: `https://support.google.com/admanager/answer/10983868`
- AdSense "Site not ready" troubleshooting: `https://support.google.com/adsense/answer/10015918`
