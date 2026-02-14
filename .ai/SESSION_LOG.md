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

## 2026-02-14 - Codex - Header Navigation Upgrade (Guide Dropdown + FAQ/Contact IA Fix)

**Goal:** Make guide navigation faster by adding direct chapter access in the header and promote FAQ out of the guide-only bucket into top-level navigation with About/Contact parity.

**Status:** ✅ Completed.

### Changes

- `components/navbar.tsx`
  - Added a desktop **Guide dropdown** with direct links to all major guide chapters.
  - Added top-level header links for **FAQ** (`/faq`) and **Contact** (`/contact`).
  - Preserved direct `Guide` link behavior while expanding section-level discoverability.
  - Added mobile guide section shortcuts under the Guide item for quick in-menu jumps.
- `components/command-palette.tsx`
  - Moved `FAQ` from `Guide` group to `More` so information architecture matches header intent.
  - Added `Contact` quick-nav entry to align command palette with the updated header.
- `components/guide/TableOfContents.tsx`
  - Removed FAQ from guide chapter cards so FAQ is no longer presented as a guide chapter.
- `app/guide/page.tsx`
  - Removed FAQ from guide chapter JSON-LD item list and adjusted guide copy to treat FAQ as a separate utility page.
  - Added explicit FAQ link in essential tools.
- `app/faq/page.tsx`
  - Updated breadcrumb and schema breadcrumb path to `Home > FAQ` (removed guide hierarchy).
  - Removed chapter-to-chapter footer navigation so FAQ behaves as an independent top-level page.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- test / /guide /faq /contact` ✅
  - Proof bundle: `reports/proof/2026-02-14T09-06-43/`
  - Console report: `reports/proof/2026-02-14T09-06-43/console-errors.txt` (`No console errors detected`)

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
