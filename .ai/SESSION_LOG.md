# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here (trim only when entries exceed 7). Git history preserves everything.

---

## 2026-02-18 - Codex - Remove "Back to Penny List" Across Trust/Legal Pages

**Goal:** Remove the shared "Back to Penny List" UI from About/Contact/Privacy/Terms/Do-Not-Sell pages.

**Status:** ✅ Completed

### Changes

- Updated `components/legal-back-link.tsx` to return `null`.
- Because this component is shared, the backlink was removed everywhere it was rendered:
  - `/about`
  - `/contact`
  - `/privacy-policy`
  - `/terms-of-service`
  - `/do-not-sell-or-share`
- Confirmed no remaining `"Back to Penny List"` string in app/components.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run lint:colors` ✅
- `npm run ai:proof -- /about /contact /privacy-policy /terms-of-service /do-not-sell-or-share` ✅
  - Proof bundle: `reports/proof/2026-02-18T08-46-35/`
  - Includes light/dark route screenshots + console report.
  - Note: console report contains existing dev-mode hydration mismatch noise tied to global script injection order.

---

## 2026-02-18 - Codex - Homepage Guide-First Flow + Navigation/Footer Consistency Cleanup

**Goal:** Shift first-time user flow to Guide-first while preserving a fast Penny List path for returning users.

**Status:** ✅ Completed

### Changes

- Updated homepage hero in `app/page.tsx`:
  - New H1 and explanatory subtext focused on first-visit clarity/trust.
  - Primary CTA switched to `Start with the Guide` (`/guide`).
  - Secondary text link set to `Already read the guide? Browse Penny List`.
  - Added trust row beneath hero CTAs using community/source framing.
- Updated navigation in `components/navbar.tsx`:
  - Header order is now `Guide`, `Penny List`, `My List`, `Report a Find`, `Store Finder`, `FAQ`.
  - Guide default action now routes directly to `/guide` hub on desktop and mobile.
  - Guide chapter jump menu remains available via a dedicated chevron toggle on desktop and mobile.
- Updated footer and supporting labels for IA consistency:
  - `components/footer.tsx` Navigate links now match the same priority order as the header.
  - Removed external `Community` quick-link from footer Navigate list.
  - Consolidated footer disclaimer placement so copyright + non-affiliation read as one line.
- Removed user-facing "Support" wording from homepage UI:
  - `app/page.tsx` section heading changed from `Transparency & Support` to `Transparency & Contact`.
  - `app/page.tsx` CTA label changed from `Contact Support` to `Contact`.
- Normalized command palette label in `components/command-palette.tsx`:
  - `Community Penny List` -> `Penny List`.
- Updated smoke assertion in `tests/smoke-critical.spec.ts` for the new homepage H1 copy.
- Updated guide-nav Playwright coverage in `tests/basic.spec.ts` so mobile assertions target the menu container and the new guide-toggle behavior.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run lint:colors` ✅
- `npx playwright test tests/basic.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
- `npm run ai:proof -- / /guide /penny-list /transparency` ✅
  - Proof bundle: `reports/proof/2026-02-18T08-26-14/`
  - Includes light/dark route screenshots and console report.
  - Note: console report contains existing dev-mode hydration mismatch noise tied to external script injection order.

---

## 2026-02-18 - Codex - Ad Approval Readiness Audit + Monetization Memory Refresh

**Goal:** Produce a concrete pass/fail audit for privacy/compliance/ad-readiness (AdSense + GAM domain pathways), tighten readiness checks, and persist founder context so status does not need to be re-explained in future sessions.

**Status:** ✅ Completed (audit delivered, checks hardened, monetization docs refreshed to current review state).

### Changes

- Hardened readiness checks/tests:
  - `scripts/ads-readiness-check.ts` now enforces `/do-not-sell-or-share` in required sitemap routes.
  - `tests/adsense-readiness.spec.ts` now asserts `/do-not-sell-or-share` is present in sitemap output.
  - `tests/privacy-policy.spec.ts` now scopes assertions to `main#main-content` to avoid false positives from global footer copy (`Not affiliated ...`).
- Updated canonical monetization docs to current founder-reported state:
  - `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md` rewritten to a requirement-by-requirement pass/at-risk matrix using current Google source criteria and live evidence.
  - `.ai/topics/MONETIZATION.md` updated with Feb 18 status (AdSense third review in progress, Ezoic second GAM review pending, Monumetric Ascend approved but GAM clarity still pending).
  - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` updated with 2026-02-18 session notes and verification artifacts.
  - `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` refreshed (`Last updated`, sitemap count corrected to 18, current review state).
  - `.ai/topics/SITE_MONETIZATION_CURRENT.md` annotated with Feb 18 Ascend approval update note.

### Verification

- `npx tsx scripts/ads-readiness-check.ts --production` ✅ (7/7 passed)
- `npx cross-env PLAYWRIGHT_BASE_URL=https://www.pennycentral.com playwright test tests/adsense-readiness.spec.ts --project=chromium-desktop-light --workers=1` ✅ (4/4 passed)
- `npx cross-env PLAYWRIGHT_BASE_URL=https://www.pennycentral.com playwright test tests/privacy-policy.spec.ts --project=chromium-desktop-light --workers=1` ✅ (2/2 passed)
- `npx tsx --import ./tests/setup.ts --test tests/disclosure-claims-accuracy.test.ts tests/sitemap-canonical.test.ts` ✅ (5/5 passed)

---

## 2026-02-18 - Codex - Remove Retired Rakuten/Donation Disclosures + Disable Legacy Go Routes

**Goal:** Remove stale affiliate/referral/donation references from the live website and align legal/transparency copy to the current monetization setup.

**Status:** ✅ Completed (runtime copy cleaned, outdated referral routes neutralized, tests updated).

### Changes

- Removed outdated referral/disclosure language from user-facing trust pages:
  - `app/transparency/page.tsx`
  - `app/privacy-policy/page.tsx`
  - `app/terms-of-service/page.tsx`
- Updated legal wording from affiliate/referral framing to advertising-only framing.
- Removed stale Rakuten constant from `lib/constants.ts`.
- Neutralized legacy referral route behavior:
  - `app/go/rakuten/route.ts` now redirects to `/transparency`
  - `app/go/befrugal/route.ts` now redirects to `/transparency`
- Updated assertions to match current product reality:
  - `tests/disclosure-claims-accuracy.test.ts`
  - `tests/privacy-policy.spec.ts`
  - `tests/support.spec.ts`
- Added a dedicated repeatable skill for future drift prevention:
  - `docs/skills/legal-monetization-copy-guard.md`
  - registered in `docs/skills/README.md`
  - linked from `docs/skills/privacy-compliance-ad-readiness.md`
- Added a founder-facing command bank + decision tree so skill selection is automatic from Cade's perspective:
  - `docs/FOUNDER-COMMAND-CENTER.md`
  - updated `docs/skills/README.md` to explicitly remove skill-name memory burden
  - linked command center in `README.md`
  - corrected stale affiliate section in `README.md` to match retired referral routes

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- /transparency /privacy-policy /terms-of-service` ✅
  - `reports/proof/2026-02-18T03-38-02/transparency-light.png`
  - `reports/proof/2026-02-18T03-38-02/transparency-dark.png`
  - `reports/proof/2026-02-18T03-38-02/privacy-policy-light.png`
  - `reports/proof/2026-02-18T03-38-02/privacy-policy-dark.png`
  - `reports/proof/2026-02-18T03-38-02/terms-of-service-light.png`
  - `reports/proof/2026-02-18T03-38-02/terms-of-service-dark.png`
  - `reports/proof/2026-02-18T03-38-02/console-errors.txt`
- `npm run ai:memory:check` ✅
- `npm run check:docs-governance` ✅
- `npm run ai:checkpoint` ✅
  - Context pack artifact: `reports/context-packs/2026-02-18T05-27-52/context-pack.md`

---

## 2026-02-18 - Codex - About/Contact Trust Restoration (Founder Story + Email-Only Contact)

**Goal:** Resolve founder-reported trust regressions by restoring the About page's real-person narrative and simplifying Contact to a clean email-first workflow.

**Status:** ✅ Completed (about narrative restored, contact form removed, privacy routing clarified).

### Changes

- Root-cause audit completed:
  - Confirmed the major rewrite happened in `39b140e` (Resolve PR conflicts: trust UX privacy + transparency).
  - Confirmed `d522bff` added the contact-page deletion panel referencing Supabase/Resend.
- About page restored to founder-authentic direction in `app/about/page.tsx`:
  - Reintroduced founder story and build origin context.
  - Reintroduced explicit human identity and byline (`Cade Allen`).
  - Reintroduced community leadership/admin mentions and hunting philosophy.
  - Added `Organization` + `AboutPage` JSON-LD with founder as `Person` (`Cade Allen`) for stronger real-person trust signals.
  - Kept canonical metadata and token-safe styling.
- Contact page simplified in `app/contact/page.tsx`:
  - Removed the insecure `mailto` form block entirely.
  - Removed repetitive same-email-per-row list and replaced with one clear primary email path.
  - Removed the standalone Data Deletion panel from Contact.
  - Added explicit links to `/privacy-policy` and `/do-not-sell-or-share` for rights/deletion flows.
  - Kept response-window guidance concise.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - Context pack artifact: `reports/context-packs/2026-02-18T03-31-08/context-pack.md`
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:proof -- /about /contact` ✅
  - `reports/proof/2026-02-18T03-28-16/about-light.png`
  - `reports/proof/2026-02-18T03-28-16/about-dark.png`
  - `reports/proof/2026-02-18T03-28-16/contact-light.png`
  - `reports/proof/2026-02-18T03-28-16/contact-dark.png`
  - `reports/proof/2026-02-18T03-28-16/console-errors.txt`
- Note: proof bundle includes known dev-mode hydration mismatch noise from global script injection order; no new route-specific runtime failures were observed.
