# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-06 - Codex - Mobile Safe-Area Navbar Clipping Fix (Prompt 0)

**Goal:** Re-apply the known safe-area/navbar fix from `f4912a0` onto the current `main` state (without cherry-pick), verify no conflicts with newer layout/Monumetric changes, and run mobile+desktop proof checks for clipping.

**Status:** ✅ Completed

### Changes

- Re-applied safe-area foundation lines from `f4912a0` to current `main`:
  - `app/globals.css`
    - added safe-area CSS custom properties:
      - `--safe-area-top`
      - `--safe-area-bottom`
      - `--safe-area-left`
      - `--safe-area-right`
  - `app/layout.tsx`
    - updated import to `Metadata, Viewport`
    - added `export const viewport: Viewport` with:
      - `width: "device-width"`
      - `initialScale: 1`
      - `maximumScale: 5`
      - `userScalable: true`
      - `viewportFit: "cover"`
  - `components/navbar.tsx`
    - added navbar top safe-area padding:
      - `pt-[env(safe-area-inset-top)]`
- Kept scope strict to the 3-file patch and preserved current Monumetric/CSP/runtime logic in `app/layout.tsx`.
- Added proof capture bundle for requested spot-check routes and viewports:
  - `/`, `/guide`, `/faq`, `/penny-list`
  - iPhone SE (WebKit), iPhone 14 Pro (WebKit), Android Pixel 5 (Chromium), Desktop Chrome (Chromium), Desktop Firefox.

### Summary

- The exact `f4912a0` safe-area fix is now present on current `main` without cherry-pick conflicts.
- Verification lanes passed (`ai:memory:check`, `verify:fast`, `e2e:smoke`).
- Cross-viewport proof artifacts were generated under `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/`.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Playwright/device proof bundle ✅
  - `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/summary.md`
  - `reports/proof/2026-03-06T07-40-48-762Z-navbar-safe-area/summary.json`
  - screenshots in the same folder (`*.png`)

### Branch Hygiene

- Branch: `main` (founder-requested direct patch target)
- Commit SHA(s): none (not committed in this session)
- Push status: not pushed (local working tree update only)
- Session-end status: dirty by scope + pre-existing carryover files
  - scope files:
    - `app/globals.css`
    - `app/layout.tsx`
    - `components/navbar.tsx`
  - carryover (pre-existing, unchanged):
    - `.github/agents/`
    - `Monumetric_Ads_information/`
    - `archive/root-level-orphans/`
    - `emails/monumetric-reengagement-draft.md`
    - `emails/monumetric-reengagement-final.md`
    - `monumental/Monumetric.json`
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "mobile safe-area navbar clipping fix memory updates"` ✅

---

## 2026-03-06 - Codex - SerpAPI Runner Limit + Workflow Variable Hotfix

**Goal:** Fix the post-review issues in the pending SerpAPI budget-policy work before pushing it live: keep manual/test limits authoritative, make workflow budget knobs actually configurable, and make stale-row prioritization query the right rows.

**Status:** ✅ Completed

### Changes

- Added focused gap-selection helper:
  - `lib/enrichment/serpapi-gap-selection.ts`
  - keeps processing limits separate from fetch-pool sizing,
  - provides deterministic stale-first prioritization without increasing the number of rows a run is allowed to process.
- Updated runner behavior:
  - `scripts/serpapi-enrich.ts`
  - restored `--limit` / `--test` as the hard cap on processed items,
  - replaced the single recent-only query slice with separate stale + recent candidate queries,
  - now widens the candidate pool for ranking without silently widening the actual run scope.
- Updated workflow configuration:
  - `.github/workflows/serpapi-enrich.yml`
  - passes SerpAPI budget knobs from GitHub Actions repository variables with safe defaults, so scheduled runs can be tuned without code edits.
- Synced docs:
  - `.ai/ENVIRONMENT_VARIABLES.md`
  - `docs/SCRAPING_COSTS.md`
  - documented the GitHub Actions Variables path for scheduled tuning,
  - corrected the UPC note to reflect that a product lookup can consume an extra SerpAPI credit.
- Added regression coverage:
  - `tests/serpapi-gap-selection.test.ts`
  - covers requested-limit authority, stale-first ranking, and fresh-row ordering.
- Added process learning:
  - `.ai/LEARNINGS.md`
  - recorded that `verify:fast` and `e2e:smoke` must not share `.next-playwright` concurrently.

### Summary

- Manual/test SerpAPI runs are predictable again and will not silently process more rows than requested.
- Scheduled tuning is now real instead of doc-only because the workflow receives the budget variables.
- Stale-row escalation now looks across stale rows explicitly instead of only reordering a recent slice.

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/serpapi-budget-policy.test.ts tests/serpapi-gap-selection.test.ts` ✅
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅

### Branch Hygiene

- Branch: `main` (founder-requested direct hotfix path)
- Head SHA before commit: `c52f7f0`
- Push status: pending at time of memory update
- Shared-memory lock:
  - `npm run ai:writer-lock:status` ✅ (unlocked before claim)
  - `npm run ai:writer-lock:claim -- codex "serpapi production hotfix memory updates"` ✅

---

## 2026-03-06 - Copilot - SerpAPI Billing-Reset-Proximity Backfill Correction

**Goal:** Correct SerpApi backfill activation so it uses billing-reset proximity only (no day-threshold or calendar-month assumptions), fix workflow fallback limit, and align tests/docs/env contracts.

**Status:** ✅ Completed

### Changes

- Refactored policy decision logic in:
  - `lib/enrichment/serpapi-budget-policy.ts`
  - removed active day-threshold/month-end/hour-window backfill activation branches,
  - added billing-cycle reset anchor math (`SERPAPI_BILLING_RESET_ANCHOR_ISO`),
  - added reset-proximity window activation (`SERPAPI_BACKFILL_WINDOW_MINUTES_BEFORE_RESET`, default `360`),
  - switched guard defaults to `SERPAPI_PRE_RESET_GUARD_MINUTES=60` and `SERPAPI_POST_RESET_GUARD_MINUTES=60`,
  - removed `SERPAPI_RUN_INTERVAL_MINUTES` from active policy behavior.
- Aligned usage accounting window in:
  - `scripts/serpapi-enrich.ts`
  - switched monthly-credit range from calendar-month bounds to billing-cycle bounds.
- Replaced policy tests in:
  - `tests/serpapi-budget-policy.test.ts`
  - explicitly covers reset-proximity activation + guard blocks + no dependency on day-threshold/month-end semantics.
- Fixed scheduler fallback mismatch in:
  - `.github/workflows/serpapi-enrich.yml`
  - cron/manual fallback `--limit` now defaults to `30` (not `5`).
- Synced env/docs contracts in:
  - `.env.example`
  - `.ai/ENVIRONMENT_VARIABLES.md`
  - `docs/SCRAPING_COSTS.md`

### Summary

- Backfill now activates only when the account is close to the next billing reset and outside pre/post guard windows.
- Calendar-month boundaries and “last 3 days / last UTC day” logic are no longer part of active backfill decisions.
- Scheduled workflow fallback is aligned with intended default throughput (`30`).

### Verification

- `npx tsx --import ./tests/setup.ts --test tests/serpapi-budget-policy.test.ts` ✅
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-06T06-28-03/`

### Branch Hygiene

- Branch: `main`
- Head SHA: `c52f7f0`
- Push status: not pushed in this session
- Session-end status: dirty worktree with both scope files and pre-existing carryover files still present
- Writer lock: claimed via `npm run ai:writer-lock:claim -- copilot "serpapi billing-reset-proximity backfill correction memory updates"` ✅

---

## 2026-03-06 - Copilot - SerpAPI Freshness + Budget Policy Implementation

**Goal:** Implement the approved freshness-first enrichment policy with practical credit caps, controlled late-month backfill, reset-safe guardrails, and `/ai` documentation updates.

**Status:** ✅ Completed

### Changes

- Added a centralized SerpAPI budget policy module:
  - `lib/enrichment/serpapi-budget-policy.ts` (new)
  - includes UTC month/day helpers and deterministic budget decisions for:
    - normal daily operation,
    - stale-row escalation,
    - late-month controlled backfill,
    - pre/post reset protection windows.
- Updated enrichment runner behavior:
  - `scripts/serpapi-enrich.ts`
  - integrated policy-aware usage reads + run budgeting from recent `serpapi_logs` activity,
  - added stale-priority handling for older unfilled rows,
  - added per-run credit stop conditions,
  - added `--ignore-budget` escape hatch,
  - raised default runner limit to align with micro-run cadence.
- Added regression tests:
  - `tests/serpapi-budget-policy.test.ts` (new)
  - covers reset guards, mid-month behavior, late-month mode, and fail-closed daily exhaustion.
- Updated schedule + ops docs/config:
  - `.github/workflows/serpapi-enrich.yml` now runs every 2 hours,
  - `.env.example` includes SerpAPI budget env knobs,
  - `docs/SCRAPING_COSTS.md` updated for freshness-first + budget-safe behavior,
  - `.ai/ENVIRONMENT_VARIABLES.md` updated for new policy variables.

### Summary

- Enrichment now runs on a frequent cadence for faster fill-in while still enforcing hard budget controls.
- The policy is reset-safe (pre/post reset cool-off windows) and supports controlled late-month burn-down without spilling into next month credits.
- Stale gaps are now promoted in priority so older unfilled submissions are less likely to linger.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
  - artifacts: `reports/context-packs/2026-03-06T01-37-18/`

### Branch Hygiene

- Scope: SerpAPI enrichment budgeting/scheduling + docs only
- Writer lock: claimed via `npm run ai:writer-lock:claim -- copilot "serpapi budget policy + scheduler freshness implementation"` ✅
- Writer lock: released via `npm run ai:writer-lock:release -- copilot` ✅

---

## 2026-03-05 - Codex - Monumetric Production Recovery Deployment (S1-S4 + Rubicon Hotfix)

**Goal:** Execute founder-approved emergency monetization recovery plan by promoting S1-S3 to production, auditing live behavior, hardening S4 CSP, and closing the residual Rubicon CSP blocker observed after merge.

**Status:** ✅ Completed

### Changes

- Promotion to production:
  - merged PR `#148` (`f00c246`) into `main` to ship Monumetric S1-S3 runtime/placement recovery.
  - merged PR `#149` (`de6bd28`) into `main` to ship S4 CSP compatibility hardening.
  - merged PR `#151` (`ad72f3a`) into `main` to patch the remaining critical CSP blocker for `secure-assets.rubiconproject.com`.
- Code change scope for S4:
  - `next.config.js` only:
    - `script-src` + `https://script.4dex.io`
    - `connect-src` + `https://mp.4dex.io`
    - `connect-src` + `https://apex.go.sonobi.com`
- Code change scope for follow-up hotfix:
  - `next.config.js` only:
    - `frame-src` + `https://secure-assets.rubiconproject.com`
- Live production audit artifacts:
  - pre-S1/S3 baseline: `reports/monumetric-audit/2026-03-05T16-47-41-pre-s1s3/`
  - post-S1/S3: `reports/monumetric-audit/2026-03-05T16-51-44-post-s1s3/`
  - post-S4: `reports/monumetric-audit/2026-03-05T17-06-22-post-s4/`
  - post-Rubicon-hotfix: `reports/monumetric-audit/2026-03-05T22-38-27-814-post-rubicon-hotfix/`

### Summary

- S1-S3 is now live on production `main`.
- In sampled mobile/desktop audits, in-content opportunities now render on `/penny-list` and guide surfaces where pre-S1/S3 had missing route coverage.
- S4 removed previously observed `mp.4dex.io` / `apex.go.sonobi.com` CSP blocker signatures from the sampled window; remaining noise shifted to different third-party frame/script hosts.
- Follow-up Rubicon host hotfix removed the critical `secure-assets.rubiconproject.com` CSP block signature from live CI/audit while keeping `/report-find` ad-excluded and SPA callback experimental mode off.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npm run e2e:full` ✅
- follow-up hotfix local lane:
  - `npm run ai:memory:check` ✅
  - `npm run verify:fast` ✅
  - `npm run e2e:smoke` ✅
  - `npm run e2e:full` ⚠️ expected pre-deploy fail while production still served old CSP; rerun on CI passed after merge (`full-e2e (1,2)` + `full-e2e (2,2)`).
- `npm run ai:proof -- /guide /penny-list` ⚠️ first attempt blocked by unhealthy occupied port 3001; follow-up capture succeeded:
  - artifacts: `reports/proof/2026-03-05T22-03-16/`
- FULL live-console artifacts from this session:
  - `reports/playwright/console-report-2026-03-05T21-54-41-027Z.json`
  - `reports/playwright/console-report-2026-03-05T21-56-28-919Z.json`
  - `reports/playwright/console-report-2026-03-05T21-59-13-802Z.json`
  - `reports/playwright/console-report-2026-03-05T22-00-15-603Z.json`
- post-hotfix CI/deploy:
  - `quality-fast` ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22739773584/job/65950070119`
  - `smoke-e2e` ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22739773600/job/65950070177`
  - `full-e2e (1,2)` ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22739773604/job/65950257586`
  - `full-e2e (2,2)` ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22739773604/job/65950257578`
  - Vercel production deploy ✅ `https://vercel.com/allens-projects-6bce9cc6/hd-onecent-guide/2V1R32eEjDyuRvwTkcnsK23pTfZT`

### Branch Hygiene

- Merge PRs:
  - `#148` -> `main` at `f00c246`
  - `#149` -> `main` at `de6bd28`
  - `#151` -> `main` at `ad72f3a`
- Working branch for S4 implementation: `dev-s4-csp-20260305` (remote auto-deleted after merge)
- Working branch for Rubicon hotfix: `hotfix-csp-rubicon-20260305` (merged)
- Carryover untracked files (unchanged, unrelated):
  - `archive/root-level-orphans/`
  - `emails/monumetric-reengagement-draft.md`
  - `emails/monumetric-reengagement-final.md`

---
