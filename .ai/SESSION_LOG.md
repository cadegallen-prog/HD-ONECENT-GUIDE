# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

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

---

## 2026-01-25 - Codex - Pipeline: local-first warmer + GH probe-only

**Goal:** Stop relying on GitHub Actions for full pre-scrape (Cloudflare 403 reality) and make the local warmer the primary freshness path, while keeping scheduled Actions as a non-failing probe with strong diagnostics.

**Status:** ✅ Verified locally (ready to push)

### Changes

- `.github/workflows/enrichment-staging-warmer.yml`: Scheduled runs now execute in **probe-only** mode (no Supabase writes; no hard dependency on secrets) and open/update an issue when blocked; manual runs still attempt the full warmer when secrets are present.
- `scripts/staging-warmer.py`: Added `PROBE_ONLY` mode so scheduled runs emit `FETCH_DIAGNOSTICS` + `cloudflare_block=true/false` without failing. Also stamps `created_at` on upserts so freshness reflects the most recent warmer run.
- `scripts/print-enrichment-staging-status.ts`: Fixed to use `created_at` and added an easy freshness check command.
- `package.json`: Added `npm run staging:status`.
- `docs/skills/run-local-staging-warmer.md`: Updated success criteria + added the quick status check.

### Verification (local)

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅ (100/100)

---

## 2026-01-24 - Codex - SEO: stop redirect-only pages + sitemap canonical (www)

**Goal:** Remove redirects for `/checkout-strategy` and `/responsible-hunting` so those pages return `200` (not `308`), and ensure sitemap URLs match canonical `www` domain.

**Status:** ✅ Shipped (pushed to `main`) + verified locally + verified on production

### Changes

- `next.config.js`: Removed redirects for `/checkout-strategy` and `/responsible-hunting` (these now serve real pages).
- `app/sitemap.ts`: Added `/checkout-strategy` and `/responsible-hunting` to the live sitemap output.
- `public/sitemap.xml`: Canonicalized all `<loc>` URLs from `https://pennycentral.com/...` → `https://www.pennycentral.com/...` (note: production uses `app/sitemap.ts`).
- Playwright stability (verification hygiene):
  - `playwright.config.ts`: Avoids deleting `.next` and starts `next start -p 3002` using `NEXT_DIST_DIR=.next-playwright`.
  - `package.json`: `test:e2e` builds with `NEXT_DIST_DIR=.next-playwright` then runs Playwright.
  - `scripts/ai-verify.ts`: Fails fast if port 3002 is already serving HTTP (prevents “port already used” flake).

### Verification (local)

- Bundle: `reports/verification/2026-01-24T23-01-47/summary.md` (lint ✅, build ✅, unit ✅, e2e ✅)

### Production verification (after deploy)

- `https://www.pennycentral.com/checkout-strategy` → `200` (observed 2026-01-24)
- `https://www.pennycentral.com/responsible-hunting` → `200` (observed 2026-01-24)
- `https://www.pennycentral.com/sitemap.xml` includes both URLs (observed 2026-01-24)
