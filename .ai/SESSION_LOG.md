# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-01-23 - Codex - Ads.txt one-hop canonicalization (Vercel)

**Goal:** Force all `/ads.txt` requests to resolve to `https://www.pennycentral.com/ads.txt` with ≤1 redirect hop.

**Status:** ✅ Code complete + verified locally (deployment still required)

### Changes

- `vercel.json`: Added an `/ads.txt` redirect for host `pennycentral.com → https://www.pennycentral.com/ads.txt` and set `Cache-Control: no-store, max-age=0` header for `/ads.txt` responses. (Kept existing `crons`.)
- Confirmed `public/ads.txt` exists (static file served from `/public`).

### Deployment + acceptance verification (must be done after redeploy)

After a full redeploy, verify with:

```bash
curl -I -L --max-redirs 1 http://pennycentral.com/ads.txt
curl -I -L --max-redirs 1 https://pennycentral.com/ads.txt
curl -I -L --max-redirs 1 http://www.pennycentral.com/ads.txt
curl -I -L --max-redirs 1 https://www.pennycentral.com/ads.txt
```

### Verification

- Bundle: `reports/verification/2026-01-23T17-47-26/summary.md`

---

## 2026-01-23 - Codex - SEO: fix state pages (indexing blocker)

**Goal:** Fix `/pennies/[state]` pages returning 500 (prevents crawling/indexing) and stabilize local verification.

**Status:** ✅ Complete + verified (all 4 gates: lint/build/unit/e2e)

### Changes

- `app/pennies/[state]/page.tsx`: Updated to Next 16 route params shape (`params: Promise<...>`) to prevent production 500s on state pages.
- `scripts/ai-verify.ts`: In `-- test` mode, runs `npm run build` with `PLAYWRIGHT=1` + `NEXT_PUBLIC_EZOIC_ENABLED=false` so Playwright runs against the correct client bundle (prevents hydration/console errors).
- `playwright.config.ts`: Switched base URL to `http://127.0.0.1:3002` to avoid intermittent IPv6 `localhost` connection issues; webServer starts `next start` (no duplicate build step).

### Evidence (production before fix)

- `curl -i https://www.pennycentral.com/pennies/alabama` → `500 Internal Server Error` (Jan 23, 2026)

### Verification

- Bundle: `reports/verification/2026-01-23T17-39-46/summary.md`

---

## 2026-01-23 - Codex - Pipeline: staging warmer diagnostics + Cloudflare blocker

**Goal:** Get the Tue–Fri pre-scrape pipeline working reliably and make failures impossible to miss.

**Status:** ⚠️ Blocked (Cloudflare 403 from upstream API) — not a silent failure anymore.

### Changes

- `.github/workflows/enrichment-staging-warmer.yml`: Added failure auto-issue creation/update + clearer schedule notes.
- `extracted/scraper_core.py`: Added per-zip diagnostics (HTTP status, HTML detection, timing) and better failure hints.
- `scripts/staging-warmer.py`: Prints `FETCH_DIAGNOSTICS` lines + GitHub Actions `::error` annotation on failure.
- `scripts/run-local-staging-warmer.mjs` + `npm run warm:staging`: Local manual override runner (same code path as Actions, but from your home IP).
- `app/api/cron/seed-penny-list/route.ts`: Switched data source to `enrichment_staging` (prod does not have `penny_item_enrichment`).
- `app/api/cron/trickle-finds/route.ts`: Switched data source to `enrichment_staging` (same reason).

### Findings (Root Cause)

- Upstream `https://pro.scouterdev.io/api/penny-items` returns **HTTP 403 + Cloudflare “Just a moment...” HTML** from GitHub Actions runners.
- This is likely IP / bot protection; refreshing `PENNY_RAW_COOKIE` alone may not fix it.
- `enrichment_staging` exists and currently has **1343** rows (as of Jan 23, 2026).
- `penny_item_enrichment` does **not** exist in production Supabase (PostgREST `PGRST205`).

### Manual Override (Current Best Path)

- Run from your machine/network (home IP): `npm run warm:staging`
- The GitHub Action remains a low-aggression probe and will auto-update issue #106 with `cloudflare_block: true/false`.

### Evidence

- Latest failed run: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21283542371
- Auto-created failure issue: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/issues/106

### Verification

- Bundle: `reports/verification/2026-01-23T10-51-52/summary.md`

---
