# legal-sitemap-trust-pages

## When to use

Use this skill when Cade asks for a sitemap/legal/trust-page strategy upgrade (especially for ad-network readiness and competitor comparison).

## What to produce

1. Clean URL architecture (path-based, no query-param policy pages)
2. Header/footer navigation map with no redundant labels
3. `app/sitemap.ts` blueprint with priorities + frequencies
4. Full copy drafts for:
   - Privacy Policy
   - Terms of Service
   - About
   - FAQ
   - Contact
   - Do Not Sell or Share (CCPA/CPRA)
5. Explicit recommendation to keep ads off legal pages
6. Retention pattern for legal pages (subtle "Back to Penny List")

## Repo touchpoints

- `app/sitemap.ts`
- `components/navbar.tsx`
- `components/footer.tsx`
- `app/privacy-policy/page.tsx`
- `app/terms-of-service/page.tsx`
- `app/about/page.tsx`
- `app/faq/page.tsx`
- `app/contact/page.tsx`
- Optional new route: `app/do-not-sell-or-share/page.tsx`

## Guardrails

- Keep language plain and founder-readable.
- Use canonical absolute domain: `https://www.pennycentral.com`.
- Do not claim legal certainty or "guaranteed" approvals.
- Treat generated legal text as draft requiring founder/legal review.
