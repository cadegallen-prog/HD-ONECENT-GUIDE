# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-14 - Codex - Disclosure Truth Hardening (Rakuten/Amazon Claim Accuracy)

**Goal:** Remove false partner-program claims, align disclosure language to actual Rakuten referral compensation, and add regression guards so this does not reappear.

**Status:** ✅ Completed.

### Changes

- Corrected legal/trust copy to remove false Amazon-partner wording:
  - `app/privacy-policy/page.tsx`
  - `app/terms-of-service/page.tsx`
  - `app/transparency/page.tsx`
- Kept FTC-relevant material-connection disclosure for Rakuten:
  - retained explicit referral compensation disclosure language (no "not affiliated with Rakuten" contradiction).
- Added regression guard:
  - `tests/disclosure-claims-accuracy.test.ts` now fails if legal/transparency pages reintroduce Amazon Associate claim text or deny Rakuten relationship while promoting referral links.
- Synced monetization constant comment to neutral wording:
  - `lib/constants.ts`
- Session learning added:
  - `.ai/LEARNINGS.md` new entry `0c` documenting the anti-pattern and prevention rule.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run check:docs-governance` ✅
- `npm run ai:proof -- dev /privacy-policy /terms-of-service /transparency` ⚠️ screenshots captured at `reports/proof/2026-02-14T04-28-38/`; console file reported pre-existing dev hydration mismatch noise from global layout script ordering.

---

## 2026-02-13 - Codex - Canonical Transparency Hardening (Approval-Risk Reduction)

**Goal:** Strengthen legitimate Google-policy readiness by removing trust-route canonical drift and adding regression coverage around legacy `/support` behavior.

**Status:** ✅ Completed.

### Changes

- Updated sitemap canonical trust route:
  - `app/sitemap.ts` now lists `/transparency` instead of legacy `/support`.
- Increased regression coverage for critical route behavior:
  - `tests/smoke-critical.spec.ts` now asserts `/support` resolves to `/transparency` and loads the expected transparency heading.
- Locked ad-policy exclusion behavior in tests:
  - `tests/ads-route-eligibility.test.ts` now explicitly asserts both `/support` and `/transparency` are ad-excluded.
- Synced top-level docs with current IA:
  - `README.md` now references Transparency/Funding on `/transparency` (instead of support/cashback wording).

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅ (4/4 after smoke coverage expansion)
- `npm run check:docs-governance` ✅

---

## 2026-02-13 - Codex - AdSense Compliance Refactor (Support/Legal + Retailer Link Hardening)

**Goal:** Execute a high-confidence compliance pass to remove solicitation-policy risk signals and harden legal/trust surfaces for monetization review.

**Status:** ✅ Completed.

### Changes

- **Support-page solicitation purge + disclosure replacement:**
  - Removed PayPal/donation solicitation logic and `paypal.me/cadegallen` fallback from `app/support/page.tsx`.
  - Added the requested formal funding/editorial disclosure section (`monetization-transparency`) with exact required copy structure.
- **Legal/privacy compliance updates:**
  - Updated `app/privacy-policy/page.tsx`:
    - renamed cookies section to `Cookies and Data Collection`
    - injected 2026 Privacy Sandbox/Topics API + GPC opt-out text
    - added Amazon Associate disclosure
  - Updated `app/terms-of-service/page.tsx` with:
    - Amazon Associate disclosure
    - `Cookies and Data Collection` compliance section (same required text)
- **Footer legal IA refactor:**
  - Updated `components/footer.tsx` Legal area to a single-row link set:
    - `Privacy Policy | Terms of Service | Contact`
  - Removed standalone footer link to `California Privacy (CCPA)` while keeping CCPA content in privacy policy.
- **About + Support schema and copy updates:**
  - Injected requested `WebPage` JSON-LD block into:
    - `app/about/page.tsx`
    - `app/support/page.tsx`
  - Replaced About member-count phrasing with `tens of thousands of members` to avoid stale-count review flags.
- **Retailer outbound link rel hardening:**
  - Applied `rel="nofollow sponsored noopener noreferrer"` on audited retailer outbound links:
    - `/go/rakuten` links
    - Home Depot product links (`penny-list cards/action row`, `/sku/[sku]`, shared lists)
    - Home Depot store-page links (`/store-finder`, `components/store-map.tsx`)
- **Donation-token cleanup:**
  - Removed legacy `donation_click` event from `lib/analytics.ts`.
  - Replaced non-monetization `donation` wording in `app/inside-scoop/page.tsx` to satisfy zero-token scan requirement.
  - Removed deprecated `DONATION_URL` from `lib/constants.ts`.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Playwright proof bundle ✅
  - `npm run ai:proof -- test /about /support /privacy-policy /terms-of-service`
  - `reports/proof/2026-02-13T20-27-13/`
  - `reports/proof/2026-02-13T20-27-13/console-errors.txt` (`No console errors detected`)
- Compliance scans ✅
  - `rg -ni --hidden --glob '!archive/**' 'donation' app components lib` (no matches)
  - `rg -ni --hidden --glob '!archive/**' 'paypal|support the creator|buy me a coffee|fund the site' app components lib` (no matches)
  - `rg -n --hidden --glob '!archive/**' '[A-Za-z0-9._%+-]+@pennycentral\\.com' app components` (contact-only on site surfaces)
  - `rg -ni --no-messages 'donation' .next/server/app/support .next/server/app/privacy-policy .next/server/app/about .next/server/app/terms-of-service .next/server/app/inside-scoop .next/server/chunks` (no matches)

---
