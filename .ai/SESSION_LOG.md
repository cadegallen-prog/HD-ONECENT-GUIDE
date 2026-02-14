# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-14 - Codex - PR Conflict Resolution + Merge Completion (Trust UX)

**Goal:** Resolve unmerged PR conflicts tied to trust/legal UX updates and complete merge-ready verification for `main`.

**Status:** ✅ Completed.

### Changes

- Resolved all unresolved conflict files:
  - `.ai/STATE.md`
  - `app/faq/page.tsx`
  - `components/footer.tsx`
  - `components/navbar.tsx`
- Restored and retained trust-UX PR artifacts that were staged but missing from the working tree:
  - `app/do-not-sell-or-share/page.tsx`
  - `components/legal-back-link.tsx`
  - `docs/sitemap-legal-masterpiece.md`
  - `docs/skills/legal-sitemap-trust-pages.md`
  - `docs/skills/solo-dev-ads-approval-triage.md`
- Preserved current `main` navigation behavior (Guide dropdown + FAQ/Contact in header) while keeping trust-UX legal changes.
- Added `Do Not Sell or Share` link in `components/footer.tsx` legal section.
- Restored explicit Rakuten referral disclosure wording required by regression tests in:
  - `app/privacy-policy/page.tsx`
  - `app/terms-of-service/page.tsx`
  - `app/transparency/page.tsx`
- Added `id="ccpa"` anchor to privacy rights section for stable deep-link behavior.
- Updated full-lane Playwright specs to match current legal/trust copy:
  - `tests/privacy-policy.spec.ts`
  - `tests/support.spec.ts`
  - `tests/terms-of-service.spec.ts`

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅ (172 passed)
- Console audit artifacts from full lane:
  - `reports/playwright/console-report-2026-02-14T10-00-21-006Z.json`
  - `reports/playwright/console-report-2026-02-14T10-01-10-751Z.json`
  - `reports/playwright/console-report-2026-02-14T10-02-01-752Z.json`
  - `reports/playwright/console-report-2026-02-14T10-02-48-600Z.json`
- Note: console audit reports include pre-existing geolocation/CSP/third-party noise on live-site checks.

---

## 2026-02-14 - Codex - Transparency Tone Cleanup + Email-Only Privacy Request Flow

**Goal:** Address founder feedback by removing form-style privacy submission UX, reducing aggressive referral tone on transparency, and adding a low-stress solo-dev ads approval skill.

**Status:** ✅ Completed.

### Changes

- Updated `/do-not-sell-or-share` to remove the fill-in form and switch to an email-first request flow (`contact@pennycentral.com`, subject: `Privacy Request`).
- Rewrote `/transparency` to remove promotional pressure and explicit referral push language; kept concise factual disclosure model (funding sources + editorial independence + contact path).
- Added new skill: `docs/skills/solo-dev-ads-approval-triage.md` and registered it in `docs/skills/README.md` for repeatable, lower-stress approval triage.

### Verification

- `npm run lint` ✅
- `npm run typecheck` ✅
- `npx tsx --import ./tests/setup.ts --test tests/ads-route-eligibility.test.ts tests/sitemap-canonical.test.ts` ✅
- `npm run verify:fast` ⚠️ fails on known environment blocker (`SUPABASE_SERVICE_ROLE_KEY` missing; submit-find route tests return 500).
- `npm run e2e:smoke` ⚠️ fails in this runtime due missing Playwright browser binary (`chromium_headless_shell` not installed in local cache).
- Playwright screenshot proof via MCP browser tool:
  - `browser:/tmp/codex_browser_invocations/d9945ed9d5eba48c/artifacts/artifacts/transparency-updated.png`
  - `browser:/tmp/codex_browser_invocations/d9945ed9d5eba48c/artifacts/artifacts/do-not-sell-updated.png`

---

## 2026-02-14 - Codex - Implemented Legal/IA Revamp from Founder Feedback

**Goal:** Replace the prior docs-only sitemap/legal draft with real in-app implementation: upgraded trust pages, first-party privacy choices route, cleaner navigation, and ad-exclusion alignment.

**Status:** ✅ Completed.

### Changes

- Implemented rewritten, production route content for:
  - `/privacy-policy`
  - `/terms-of-service`
  - `/about`
  - `/faq`
  - `/contact`
- Added new first-party privacy route: `/do-not-sell-or-share` (`app/do-not-sell-or-share/page.tsx`).
- Added reusable legal-page utility component: `components/legal-back-link.tsx` and applied it to trust/legal pages for a subtle return path (`← Back to Penny List`).
- Updated navigation IA:
  - `components/navbar.tsx` now includes FAQ + Contact directly in top nav.
  - `components/footer.tsx` now includes FAQ and `Do Not Sell or Share` in legal/navigation surfaces.
- Updated indexing + ad-policy plumbing:
  - Added `/do-not-sell-or-share` to `app/sitemap.ts`.
  - Added `/do-not-sell-or-share` to hard ad-excluded routes in `lib/ads/route-eligibility.ts`.
  - Expanded `tests/ads-route-eligibility.test.ts` assertion coverage for the new excluded route.

### Verification

- `npm run lint` ✅
- `npm run typecheck` ✅
- `npx tsx --import ./tests/setup.ts --test tests/ads-route-eligibility.test.ts tests/sitemap-canonical.test.ts` ✅
- `npm run e2e:smoke` ⚠️ failed in this environment because local Playwright browser binaries are missing (`chromium_headless_shell` not installed in cache).
- `npm run verify:fast` not re-run in this environment due known missing `SUPABASE_SERVICE_ROLE_KEY` unit-test blocker on submit-find route.
- Playwright screenshots captured:
  - `browser:/tmp/codex_browser_invocations/7f650742349a4794/artifacts/artifacts/do-not-sell-page.png`
  - `browser:/tmp/codex_browser_invocations/7f650742349a4794/artifacts/artifacts/privacy-policy-page.png`

---

## 2026-02-14 - Codex - Sitemap + Legal Trust "Masterpiece" Package

**Goal:** Convert unstructured competitor critique into a founder-ready, implementation-grade sitemap/legal/trust package with stronger IA and cleaner compliance posture.

**Status:** ✅ Completed.

### Changes

- Added `docs/sitemap-legal-masterpiece.md` containing:
  - path-based URL architecture (replacing query-param legal URL patterns),
  - non-redundant header/footer navigation map,
  - drop-in `app/sitemap.ts` blueprint,
  - complete draft copy for Privacy Policy, Terms of Service, About, FAQ, Contact, and first-party `/do-not-sell-or-share` flow.
- Added reusable skill `docs/skills/legal-sitemap-trust-pages.md`.
- Registered the skill in `docs/skills/README.md`.

### Verification

- Docs/memory-only deliverable; no application runtime code changed.

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
