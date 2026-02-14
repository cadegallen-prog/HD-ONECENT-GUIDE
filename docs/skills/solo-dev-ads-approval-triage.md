# solo-dev-ads-approval-triage

## When to use

Use this when Cade needs a low-stress, repeatable workflow after AdSense/Ad Manager domain-approval rejections.

## Goal

Reduce founder stress by turning ambiguous rejection loops into a short, deterministic checklist.

## 30-minute triage flow

1. Confirm crawler-critical routes return 200:
   - `/`, `/penny-list`, `/guide`, `/privacy-policy`, `/terms-of-service`, `/contact`, `/transparency`, `/sitemap.xml`, `/robots.txt`
2. Confirm legal + trust pages are linked in header/footer and accessible in one click.
3. Confirm sitemap includes trust/legal routes and uses canonical `https://www.pennycentral.com` URLs.
4. Confirm no ad clutter on legal/trust routes.
5. Confirm disclosures are factual, calm, and non-solicitous.
6. Run:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run verify:fast` (or document blocker)
   - `npm run e2e:smoke` (or document blocker)
7. Capture proof screenshots for `/privacy-policy`, `/terms-of-service`, `/transparency`, `/contact`.

## Founder-safe output format

- What changed (plain English)
- Why it matters for approval
- What Cade does next (max 3 bullets)
- Explicit blockers (if any)

## Anti-stress rule

If blocked by environment issues (missing env/browser binaries), do not loop endlessly; log blocker + provide next best proof path.
