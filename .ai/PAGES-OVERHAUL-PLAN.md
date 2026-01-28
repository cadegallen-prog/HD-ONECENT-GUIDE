# Pages Overhaul Plan

**Created:** Jan 28, 2026
**Status:** Ready for implementation
**Chunks:** 8 discrete tasks (execute in order)

---

## Overview

Update legal/support pages with new content, replace BeFrugal with Rakuten, consolidate /cashback into /support.

**Goal:** Monumetric-ready, Rakuten affiliate, no Ezoic references, professional presentation.

---

## Chunk 1: Rakuten Affiliate Setup

**Files:**

- `lib/constants.ts` - add constant
- `app/go/rakuten/route.ts` - create new redirect

**Task:**

1. Add to `lib/constants.ts`:

   ```ts
   export const RAKUTEN_REFERRAL_URL = "https://www.rakuten.com/r/CADEGA16?eeid=28187"
   ```

2. Create `app/go/rakuten/route.ts`:

   ```ts
   import { redirect } from "next/navigation"
   import { RAKUTEN_REFERRAL_URL } from "@/lib/constants"

   export function GET() {
     redirect(RAKUTEN_REFERRAL_URL)
   }
   ```

**Verify:** Visit `/go/rakuten` → redirects to Rakuten

---

## Chunk 2: BeFrugal → Rakuten Migration

**Files:**

- `app/go/befrugal/route.ts` - change to redirect to /go/rakuten
- `components/SupportAndCashbackCard.tsx` - update copy and link
- `app/page.tsx` - update any BeFrugal references

**Task:**

1. Update `app/go/befrugal/route.ts` to redirect to `/go/rakuten` (keeps old URLs working)

2. In `SupportAndCashbackCard.tsx`:
   - Change "BeFrugal" → "Rakuten"
   - Change href `/go/befrugal` → `/go/rakuten`
   - Update copy: "Get Cash Back with Rakuten - Earn cash back on Home Depot purchases and thousands of other stores. Get a $30 welcome bonus after your first qualifying purchase."

3. Search `app/page.tsx` for any BeFrugal text and update to Rakuten

**Verify:** All BeFrugal links now go to Rakuten

---

## Chunk 3: Privacy Policy Rewrite

**Files:**

- `app/privacy-policy/page.tsx` - full rewrite

**Content requirements:**

- Remove ALL Ezoic references
- Add CCPA section with `id="ccpa"` anchor
- Generalize ads to "advertising partners" + ads.txt reference
- Add GA4 disclosure (basic)
- Add Rakuten affiliate disclosure
- Effective date: January 28, 2026
- Contact: contact@pennycentral.com

**Sections:**

1. Introduction
2. Information We Collect (automatic, user-submitted, contact)
3. How We Use Information
4. Analytics (GA4)
5. Advertising (general partners, ads.txt)
6. Affiliate Programs (Rakuten)
7. Data Sharing
8. Cookies
9. Your Privacy Rights
10. California Residents (CCPA) - with id="ccpa"
11. Changes
12. Contact

**Visual:** Keep existing PageShell/Section/Prose structure. Visual upgrade is optional/later.

**Verify:** Page loads, no Ezoic text, CCPA anchor works (`/privacy-policy#ccpa`)

---

## Chunk 4: Terms of Service (New Page)

**Files:**

- `app/terms-of-service/page.tsx` - create new

**Content:**

```
Effective Date: January 28, 2026

By using the site, you agree:

### Site Use
Informational only—finds community-sourced, not guaranteed. Verify in-store.
No scraping or misuse.

### Submissions
You grant license to display your finds.

### Advertising & Affiliates
Third-party ads/affiliates (e.g., Rakuten)—not endorsed by us.

### Disclaimers
No Home Depot affiliation. Use at own risk. Liability limited.

### Changes
Terms may update.

Governing Law: US (Georgia).

Contact: contact@pennycentral.com

Last updated: January 28, 2026
```

**Visual:** Use same PageShell/Section/Prose as privacy policy.

**Verify:** Page loads at `/terms-of-service`

---

## Chunk 5: Support Page Rewrite

**Files:**

- `app/support/page.tsx` - rewrite

**Content requirements:**

- Merge transparency content from /cashback
- Remove link to /cashback
- Add Rakuten section prominently:
  - Benefits-first copy
  - $30 welcome bonus mention
  - Link to `/go/rakuten`
  - Affiliate disclosure
- Keep ads explanation (generalized, no Ezoic)
- Community count: 58,000+
- Contact: contact@pennycentral.com

**Rakuten copy:**

```
### Save Money & Support the Site with Rakuten

Get cash back on purchases (including Home Depot!) while helping fund PennyCentral—at no cost to you.

Rakuten is a trusted cash back service used by millions:
- Earn up to 10%+ back at thousands of stores
- $30 welcome bonus after a small qualifying spend

[Button: Sign Up for Rakuten →] (links to /go/rakuten)

We earn a commission on qualifying referrals (affiliate disclosure).
```

**Verify:** Page loads, Rakuten link works, no /cashback link, no BeFrugal text

---

## Chunk 6: Delete /cashback + Redirect

**Files:**

- `app/cashback/page.tsx` - DELETE
- `next.config.js` - add redirect

**Task:**

1. Delete `app/cashback/page.tsx`

2. Add redirect to `next.config.js` in the redirects array:
   ```js
   {
     source: '/cashback',
     destination: '/support',
     permanent: true,
   }
   ```

**Verify:** `/cashback` returns 301 redirect to `/support`

---

## Chunk 7: Footer Updates

**Files:**

- `components/footer.tsx`

**Changes:**

1. Remove "Support & Transparency" link (was /cashback)
2. Add "Terms of Service" link → `/terms-of-service`
3. Add "Do Not Sell My Info" link → `/privacy-policy#ccpa`
4. Update copyright year: 2025 → 2026
5. Remove any BeFrugal references if present

**Verify:** Footer shows new links, year is 2026, no /cashback link

---

## Chunk 8: About & Contact Minor Updates

**Files:**

- `app/about/page.tsx` - minor updates
- `app/contact/page.tsx` - verify/minor updates

**About page:**

- Remove any BeFrugal references
- Keep schema.org structured data (important for SEO)
- Content is fine as-is (visual upgrade is separate task later)

**Contact page:**

- Content is already good
- No changes needed unless BeFrugal is mentioned

**Verify:** No BeFrugal text on either page

---

## Final Verification Checklist

After all chunks complete:

- [ ] `npm run build` passes
- [ ] `/go/rakuten` → redirects to Rakuten
- [ ] `/go/befrugal` → redirects to `/go/rakuten`
- [ ] `/cashback` → 301 redirects to `/support`
- [ ] `/privacy-policy` has no Ezoic text
- [ ] `/privacy-policy#ccpa` scrolls to CCPA section
- [ ] `/terms-of-service` loads
- [ ] `/support` has Rakuten CTA, no BeFrugal
- [ ] Footer has TOS link, CCPA link, year 2026
- [ ] No "BeFrugal" text anywhere on site (search codebase)

---

## Out of Scope (Deferred)

- Visual/design overhaul of these pages (separate task)
- Color palette changes (separate task)
- About page content simplification (optional later)

---

## Notes

- Rakuten link: `https://www.rakuten.com/r/CADEGA16?eeid=28187`
- Keep `/go/befrugal` working (redirects to rakuten) for any old links
- Schema.org on About page is valuable - don't remove
