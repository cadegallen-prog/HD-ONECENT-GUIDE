# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-01-28 - Codex - Enablement: safe Vercel env parity (no prod writes)

**Goal:** Make local dev + local perf debugging reliable without risking production data. Reduce “limp local” by giving a one-command Vercel → `.env.local` sync, plus a guardrail that prevents accidentally targeting prod Supabase.

**Status:** ✅ Completed & verified locally.

### Changes

- `package.json`: Added `env:pull`, `env:safety`, and `start:prodlike` scripts.
- `scripts/env-safety-check.ts`: Fails if local `NEXT_PUBLIC_SUPABASE_URL` appears to target the known production Supabase project (override available for intentional one-offs).
- `scripts/ai-doctor.ts`: Improves env guidance and fails fast on unsafe prod-target local env.
- `scripts/run-local-staging-warmer.mjs` + `docs/skills/run-local-staging-warmer.md`: Updated guidance to use `npm run env:pull` (works even when `vercel` isn’t globally installed).
- `.ai/ENVIRONMENT_VARIABLES.md` + `docs/skills/local-dev-faststart.md`: Documented the safe “staging-first” local workflow and the new scripts.

### Verification

- Bundle: `reports/verification/2026-01-28T21-05-36/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 1–2): Rakuten affiliate redirect + backward compatibility

- Added `RAKUTEN_REFERRAL_URL` to `lib/constants.ts`.
- Added `/go/rakuten` route (`app/go/rakuten/route.ts`) that redirects to Rakuten.
- Added `/go/befrugal` route (`app/go/befrugal/route.ts`) that redirects to `/go/rakuten` (keeps old links working).

**Quick check:** `curl -I http://localhost:3001/go/rakuten` shows a `307` with `Location: https://www.rakuten.com/r/CADEGA16?eeid=28187`.

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk1-2/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 3): Privacy Policy rewrite (Monumetric-ready)

- Rewrote `app/privacy-policy/page.tsx` to remove all Ezoic references and add: GA4 disclosure, generalized advertising partners + `/ads.txt` reference, Rakuten affiliate disclosure, and a CCPA section with `id="ccpa"` (effective date: Jan 28, 2026).
- Added `tests/privacy-policy.spec.ts` (ensures `/privacy-policy` contains required disclosures, contains no “Ezoic”, and `/privacy-policy#ccpa` anchor works).

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk3/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 4): Terms of Service page (new)

- Added `app/terms-of-service/page.tsx` with the planned TOS content (effective date: Jan 28, 2026).
- Added `tests/terms-of-service.spec.ts` to ensure `/terms-of-service` loads and displays the effective date.

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk4/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 5): Support page rewrite (Rakuten + transparency)

- Rewrote `app/support/page.tsx` to merge transparency content, remove the page-level `/cashback` link, add prominent Rakuten CTA (`/go/rakuten`) with affiliate disclosure, and generalize ads messaging (no Ezoic references). Also updates the community count copy to **58,000+** and keeps contact info.
- Added `tests/support.spec.ts` to ensure `/support` includes the Rakuten CTA, contains no “BeFrugal”, and has no `/cashback` link in the main page content.

**Verification bundle:** `reports/verification/2026-01-28-pages-overhaul-chunk5/` (lint ✅, build ✅, unit ✅, e2e ✅)

### Pages Overhaul (Chunk 6): Delete /cashback + redirect

- Deleted `app/cashback/page.tsx`.
- Added a permanent redirect `/cashback` → `/support` in `next.config.js` (keeps old links working and consolidates support content).

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

### Pages Overhaul (Chunk 7): Footer updates

- Updated `components/footer.tsx` to remove the legacy `/cashback` link, add `Terms of Service` (`/terms-of-service`), add `Do Not Sell My Info` (`/privacy-policy#ccpa`), and update the copyright year to 2026.

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

### Pages Overhaul (Chunk 8): About/Contact sweep + affiliate docs cleanup

- Confirmed `app/about/page.tsx` and `app/contact/page.tsx` contain no BeFrugal references.
- Updated `README.md` + `docs/skills/repo-map.md` to treat `/go/rakuten` as canonical and keep `/go/befrugal` as a legacy redirect.
- Removed the `www.befrugal.com` CSP `connect-src` entry from `next.config.js` (no longer needed).

**Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅, `npm run test:e2e` ✅

## 2026-01-26 - GitHub Copilot - Deprecate Google Sheets pipeline & archive scripts

**Goal:** Remove ambiguous Google Forms / Google Sheets guidance from active docs, archive original strategy doc and legacy scripts, and mark sheet-focused scripts as DEPRECATED. Ensure the active pipeline clearly uses the Supabase-based Report a Find flow.

**Status:** ✅ Completed & pushed to `main` (commit `cd78313`).

### Changes

- Archived `docs/PENNY-LIST-STRATEGY.md` to `docs/legacy/PENNY-LIST-STRATEGY.md` and replaced it with a DEPRECATED notice.
- Updated `README.md`, `PROJECT_ROADMAP.md`, `docs/WEEKLY-UPDATE-CHECKLIST.md`, `docs/AUTH-PIVOT-GUIDANCE.md`, and `.ai/CONSTRAINTS_TECHNICAL.md` to reference the Supabase-based `Report a Find` flow.
- Added `docs/legacy/README.md` explaining archival guidance.
- Marked legacy scripts with DEPRECATED headers and moved sheet-focused scripts to `scripts/legacy/`; sensitive scripts were moved to `backups/legacy-scripts/` to satisfy pre-commit privacy checks.

### Verification

- `npm run lint` ✅
- `npm run test:unit` ✅ (26/26)
- `npm run build` ✅

**Notes:** Pre-commit hooks blocked sensitive filenames; we moved them to `backups/legacy-scripts/` to keep a copy without risking accidental PII leakage.

## 2026-01-26 - GitHub Copilot - UI: Copyable SKU pill on Penny List cards (feature-flagged)

**Goal:** Add a prominent, copyable `SKU` pill to the main Penny List card to increase successful SKU capture and automated matching. Implemented behind an in-file feature flag for quick rollback.

**Status:** ✅ Implemented & verified locally.

### Changes

- `components/penny-list-card.tsx`: Adds `ENABLE_SKU_COPY_PILL` flag, renders a copyable SKU pill (button) with keyboard accessibility and analytics (`sku_copy`).
- `app/globals.css`: Adds `.penny-card-sku` styles including hover, focus, and copied success state.
- `tests/penny-list-sku-copy.spec.ts`: Playwright test that mocks clipboard, clicks a copy control, and verifies toast + that navigation did not occur.
- Minor autoformatting (Prettier) on a few files.

### Verification

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅ (26/26)
- `npm run test:e2e` ✅ (full suite, 104 passing)
- Playwright visual/interaction proof: `reports/playwright/html` (generated)

**Rollback:** Set `ENABLE_SKU_COPY_PILL = false` in `components/penny-list-card.tsx` and revert the CSS class if needed.
