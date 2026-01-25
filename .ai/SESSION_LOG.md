# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

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

---

## 2026-01-24 - Claude Code - AdSense compliance deployment to production

**Goal:** Deploy PR #108 (AdSense compliance baseline) to production after fixing merge conflicts and CSP blockers.

**Status:** ✅ Complete (deployed to production, Google can now verify site)

### Problem identified

PR #108 had been sitting unmerged for weeks, blocking Google AdSense approval because:

1. Merge conflicts in `.ai/STATE.md` and `.ai/SESSION_LOG.md` (PR branch behind main)
2. CSP in `next.config.js` would block AdSense script from loading (missing domains in allowlist)
3. No QA verification had run on the PR branch
4. `app/robots.ts` was overriding `public/robots.txt`, missing Mediapartners-Google

### Changes

**PR #108 updates:**

- Merged `main` into PR branch `codex/verify-google-adsense-compliance`
- Resolved merge conflicts in `.ai/*` by keeping main's timeline
- Updated CSP in `next.config.js`:
  - Added `https://pagead2.googlesyndication.com` to `script-src` and `connect-src`
  - Added `https://googleads.g.doubleclick.net` and `https://tpc.googlesyndication.com` to `frame-src`
- Ran full verification suite: lint ✅, build ✅, unit tests 26/26 ✅, e2e 100/100 ✅
- Pushed to GitHub: all CI checks passed (Quality Fast, CodeQL, SonarCloud, Vercel)
- Merged to `main` via squash merge (commit `f337e5f`)

**Post-merge fix:**

- Updated `app/robots.ts` to explicitly allow `Mediapartners-Google` (commit `6ccf197`)
  - Dynamic `robots.ts` was overriding static `public/robots.txt`

### Production verification

✅ **AdSense script live on all pages:**

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5302589080375312"
  crossorigin="anonymous"
></script>
```

✅ **All compliance pages live:**

- `/contact` with contact@pennycentral.com
- `/privacy-policy` with Google AdSense disclosures (DART cookie, opt-out links)
- `/about` expanded with mission statement (>200 words)
- `/sitemap.xml` includes contact page
- Footer includes "Contact Us" link
- `robots.txt` allows Mediapartners-Google

### Verification

- Lint: ✅ Passed
- Build: ✅ Passed
- Unit tests: ✅ 26/26 passed
- E2E tests: ✅ 100/100 passed
- GitHub Actions: ✅ All checks passed
- Production deployment: ✅ Verified via curl (AdSense script in HTML)
