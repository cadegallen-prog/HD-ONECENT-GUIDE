# legal-monetization-copy-guard

## When to use

Use this when monetization channels are added, paused, or retired and legal/disclosure copy must be updated across public routes.

## Goal

Keep public legal/trust copy factually aligned with live monetization behavior so reviewers and users see accurate disclosures.

## Source-of-truth check (run first)

1. Confirm active/pending/retired status in:
   - `.ai/topics/MONETIZATION.md`
   - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
2. Confirm runtime reality in:
   - `public/ads.txt`
   - `app/layout.tsx` (ad/analytics scripts)
   - `app/go/*` routes and `lib/constants.ts` for legacy referral links

## Drift-prevention workflow

1. Build a quick truth table:
   - Active channels
   - Pending channels
   - Retired channels
2. Scan public routes for stale terms before editing:
   - `rakuten`
   - `befrugal`
   - `paypal`
   - `donation`
   - `affiliate`
   - `referral`
3. Update legal/trust pages that mention monetization:
   - `app/transparency/page.tsx`
   - `app/privacy-policy/page.tsx`
   - `app/terms-of-service/page.tsx`
   - `app/contact/page.tsx` (if privacy/deletion routing copy changed)
4. Neutralize stale referral surfaces:
   - Remove retired constants/links.
   - Update `app/go/*` route behavior for retired programs.
5. Update anti-regression tests:
   - `tests/disclosure-claims-accuracy.test.ts`
   - `tests/privacy-policy.spec.ts`
   - `tests/support.spec.ts`

## Copy guardrails

- Keep statements factual and non-promotional.
- Do not imply active partnerships that are retired.
- Do not duplicate channels in repetitive ways that look unfinished.
- Keep privacy/deletion process details on privacy pages; contact page should route there cleanly.

## Verification lane

- Runtime copy/route edits:
  - `npm run verify:fast`
  - `npm run e2e:smoke`
  - `npm run ai:proof -- /transparency /privacy-policy /terms-of-service`
- Docs-only skill updates:
  - `npm run ai:memory:check`
  - `npm run ai:checkpoint`

## Founder-safe output format

- Current monetization truth table (active/pending/retired)
- Exactly which files were changed and why
- Verification commands + artifact paths
- What Cade should do next (or `No action needed`)
