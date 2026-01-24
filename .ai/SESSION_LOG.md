# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

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

---

## 2026-01-24 - Codex - AdSense readiness + professional email checklist

**Goal:** Document a clear checklist for AdSense review readiness and professional domain email setup.

**Status:** ✅ Complete

### Changes

- `README.md`: Added an AdSense readiness + professional email checklist (domain/DNS, Cloudflare routing, Gmail send-as, SPF/DMARC, reviewer basics).
- `docs/skills/adsense-domain-email-setup.md`: New reusable skill with the same checklist for future sessions.
- `docs/skills/README.md`: Added the new skill to the index.

---

## 2026-01-23 - Codex - Ads.txt one-hop canonicalization (Vercel)

**Goal:** Force all `/ads.txt` requests to resolve to `https://www.pennycentral.com/ads.txt` with ≤1 redirect hop.

**Status:** ✅ Shipped (pushed to `main`) + verified on production (note: HTTP apex still 2 hops)

### Changes

- `vercel.json`: Added an `/ads.txt` redirect for host `pennycentral.com → https://www.pennycentral.com/ads.txt` and set `Cache-Control: no-store, max-age=0` header for `/ads.txt` responses. (Kept existing `crons`.)
- Confirmed `public/ads.txt` exists (static file served from `/public`).
  - Added an additional redirect attempt matching `x-forwarded-proto: http` for the apex host to try to collapse HTTP→HTTPS+www into a single hop (Vercel still serves a 308 first, see notes below).

### Acceptance verification (production)

Results observed (Jan 24, 2026):

- `https://www.pennycentral.com/ads.txt` → `200` ✅ (`Cache-Control: no-store, max-age=0`)
- `http://www.pennycentral.com/ads.txt` → `308` → `200` ✅ (1 redirect, ends at https+www)
- `https://pennycentral.com/ads.txt` → `301` → `200` ✅ (1 redirect, ends at https+www)
- `http://pennycentral.com/ads.txt` → `308` → `301` → `200` ⚠️ (2 redirects; Vercel forces HTTP→HTTPS before host redirect)

### Verification

- Bundle (pre-ship): `reports/verification/2026-01-23T17-47-26/summary.md`
- Bundle (ship): `reports/verification/2026-01-24T17-52-21/summary.md`
- Bundle (after redirect tweak): `reports/verification/2026-01-24T17-57-47/summary.md`

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
