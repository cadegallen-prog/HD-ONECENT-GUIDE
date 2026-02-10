# Accumulated Learnings (Anti-Patterns + Top 10)

**Purpose:** Things we learned the hard way, so we don't repeat mistakes. This is the "institutional knowledge" of the project.

**Format:** Problem → What We Tried → What We Learned → What to Do Instead

**Auto-archive:** Full learning history preserved in `archive/learnings-history/`

---

## Quick Anti-Patterns (NEVER DO THESE)

Scan this FIRST before suggesting anything. If your idea matches an anti-pattern, STOP.

| Anti-Pattern                            | Why It Fails                             | What to Do Instead                             |
| --------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| ❌ Home Depot links with SKU            | HD uses internet numbers, not SKUs       | Use `getHomeDepotProductUrl()` helper          |
| ❌ Kill port 3001 if occupied           | Server is intentionally kept running     | Check if it responds, reuse it                 |
| ❌ Remove "use client" directives       | Breaks production builds                 | Keep them; add if you get hydration errors     |
| ❌ Modify globals.css without approval  | Cascades unpredictably, breaks dark mode | Use existing tokens or get explicit approval   |
| ❌ Reduce timeouts to "fix" failures    | Masks the real problem                   | Investigate root cause; keep balanced timeouts |
| ❌ Dynamic OG images for main pages     | Facebook crawler timeouts                | Use static PNGs, generate with Playwright      |
| ❌ Trust dev mode as final test         | Dev mode is more forgiving               | ALWAYS run `npm run build` before done         |
| ❌ Skip reading LEARNINGS.md            | You'll repeat documented failures        | Read this file at session start                |
| ❌ Ask Cade for every tactical decision | Creates friction, wastes time            | Auto-chain: Implement → Test → Review → Doc    |
| ❌ Suggest without conversation first   | Builds wrong thing, hours wasted         | Ask 1-2 questions before implementing          |
| ❌ Sitemap with 100s of thin pages      | AdSense rejects as "low value content"   | Pillar-only sitemap + noindex thin pages       |

---

## Top 10 Learnings (Most Important)

### 0a. `npm ci` can fail on Windows when native binaries are locked

**Problem:** `npm ci` failed with `EPERM: operation not permitted, unlink ... esbuild.exe`, leaving the repo in a partially installed state (`eslint` missing on next run).

**What We Tried:**

- Ran `npm ci` directly during CI forensics on branch `ci-tiered-verification`
- Confirmed lock contention from running Node/esbuild processes

**What We Learned:**

- On Windows, native binaries (`esbuild`, `next-swc`, `rollup` addons) can be file-locked by active processes.
- A failed `npm ci` can remove enough modules to break local verification scripts.

**What to Do Instead:**

- Prefer clean shells with minimal active Node/esbuild processes before `npm ci`.
- If `npm ci` fails with `EPERM`, run `npm install` once to restore dependencies, then continue verification.
- Record both attempts in forensic evidence so “local pass” claims stay truthful.

**Date:** Feb 9, 2026

---

### 0. Route deletion + stale Next type artifacts

**Problem:** After deleting a route page, `npm run build` failed with type errors from stale generated files under `.next-playwright/types` and `.next/dev/types/app/...`.

**What We Tried:**

- Re-ran `npm run build` directly (still failed)
- Cleared stale generated route type folders (`.next-playwright`, stale deleted-route type folder under `.next/dev/types/app/`)

**What We Learned:**

- Next-generated type artifacts can keep references to deleted routes when dev/test build caches already exist.
- This is a cache artifact problem, not a source-code problem.

**What to Do Instead:**

- If a deleted route still appears in type errors, clear stale generated type folders and rebuild.
- Keep port 3001 process running; do not kill the dev server to fix this.

**Date:** Feb 7, 2026

---

### 1. Playwright E2E + Next Dev Lock (Port 3001)

**Problem:** Playwright E2E failed with `Unable to acquire lock at .next/dev/lock, is another instance of next dev running?`

**What We Learned:**

- Next.js dev uses a project-wide `.next/dev/lock` → you can't run a second `next dev`, even on a different port
- When port 3001 is already running, Playwright should reuse it by setting `PLAYWRIGHT_BASE_URL=http://localhost:3001`
- Reusing an already-running dev server may not have `PLAYWRIGHT=1`, which can make `/penny-list` empty and break specs
- Safer default: run Playwright against `next start` on port 3002 (no `.next/dev/lock` conflict) with `PLAYWRIGHT=1` enabled
- If a Playwright-run `next start` gets stuck, it can leave `.next/lock` behind and block subsequent runs; the fix is to stop the stuck server process (typically listening on 3002) and delete `.next/lock`.

**What to Do Instead:**

- Default: `npm run build` then `npm run test:e2e` (Playwright runs against `next start` on port 3002)
- If port 3001 running: PowerShell: `$env:PLAYWRIGHT_BASE_URL='http://localhost:3001'; npm run test:e2e`
- Prefer `npm run ai:verify` (auto-detects port 3001 and sets `PLAYWRIGHT_BASE_URL`)
- If you hit `.next/lock` (not `.next/dev/lock`): stop the stuck `next start` process (check `netstat -ano | findstr :3002`) and then delete `.next/lock`.

**Files:** `playwright.config.ts`, `scripts/ai-verify.ts`
**Date:** Jan 03, 2026

---

### 2. Dynamic OG Image Generation for Social Media

**Problem:** Open Graph images kept failing on Facebook despite 5-10 iterations. Dynamic OG generation via Edge runtime was unreliable.

**What We Learned:**

- Dynamic OG generation on Edge runtime is inherently fragile for social crawlers (Facebook timeout ~1-2 seconds)
- Edge function cold starts can exceed timeout
- Font handling in `ImageResponse` API is unreliable
- Static images are bulletproof: no generation time = no timeout risk

**What to Do Instead:**

1. Use static OG images for frequently-shared pages (generate PNGs once, commit to repo)
2. Create generation script using Playwright to screenshot OG endpoint (`scripts/generate-og-images-playwright.ts`)
3. Enable 24hr caching for dynamic OG if keeping for some pages (`revalidate=86400`)
4. Test with Facebook Sharing Debugger before considering it "done"

---

### 3. External Data Dependencies & Fallback Logic

**Problem:** Dev server entered infinite loop after Google Sheet URL expired. Previous agent spent 7-8 hours stuck.

**What We Learned:**

- External data dependencies MUST have fallback mechanisms
- When data fetching fails during SSG/`generateStaticParams`, empty results can cause infinite retry loops
- Aggressive timeout reductions mask problems instead of fixing them
- Test fixtures are essential for offline development

**What to Do Instead:**

```typescript
async function fetchData() {
  try {
    const res = await fetch(PRIMARY_URL)
    if (!res.ok) throw new Error(`Failed: ${res.statusText}`)
    return await res.json()
  } catch (error) {
    console.error("Primary source failed:", error)
    return tryLocalFallback() // Always have fallback
  }
}
```

- Keep balanced timeouts (30s+ for network, 60s+ for server startup)
- Include test fixtures (`data/penny-list.json`)

**Date:** Dec 20, 2025

---

### 4. React-Leaflet & Hydration

**Problem:** Map component broke on production builds (worked fine in dev).

**What We Learned:**

- React-Leaflet requires client-side rendering only
- Hydration errors don't always show in dev mode
- Must use dynamic imports with `ssr: false`

**What to Do Instead:**

```tsx
const StoreMap = dynamic(() => import("@/components/store-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})
```

---

### 5. Git Commits: Partial Staging + Secret Leakage

**Problem:** A commit/push happened with only a subset of local changes staged, and a tool config file accidentally included a hard-coded access token.

**What We Learned:**

- Always review `git status -sb` and `git diff --cached --name-only` before committing.
- Never commit tokens/keys (especially in editor/agent config files); prefer `${ENV_VAR}` placeholders.
- If a bad commit was pushed to `main`, fix it with `git revert` (no force-push / no history rewrite), then recommit cleanly.

**What to Do Instead:**

- Before commit: `git status -sb` then `git diff --cached --name-only`
- Security scan: `rg "sbp_|SUPABASE_SERVICE_ROLE_KEY\\\": \\\"" -S .` (and fix before staging)
- If pushed mistake: `git revert <sha>` and push a follow-up commit (no force-push)

**Never:** Remove "use client" directive or change import method

**Files:** `/app/store-finder/page.tsx`, `/components/store-map.tsx`

---

### 5. Design System & globals.css

**Problem:** Inconsistent colors and dark mode issues.

**What We Learned:**

- CSS variables in globals.css control everything
- Changes cascade unpredictably
- Dark mode relies on these variables
- Easier to break than to fix

**What to Do Instead:**

- Use existing design tokens (don't add new ones)
- Reference variables with Tailwind classes (`text-foreground`, `bg-card`)
- Test light + dark mode if touching globals.css

**Rule:** Don't modify globals.css without explicit approval

**Files:** `/app/globals.css`

---

### 6. "use client" Directives

**Problem:** Not clear when to use "use client" vs server components.

**What We Learned:**

- Next.js App Router defaults to server components
- "use client" needed for: React hooks (useState, useEffect), event handlers (onClick), browser APIs (localStorage, window)
- Server components better for: static content, data fetching, SEO-critical pages

**What to Do Instead:**

- Start with server component (default)
- Add "use client" only when you get errors
- Don't remove existing "use client" directives

**Rule:** If it has hooks or interactivity, it needs "use client"

---

### 7. Build vs Dev Mode Differences

**Problem:** Features work in dev (`npm run dev`) but break in production build.

**What We Learned:**

- Dev mode is more forgiving (shows warnings, not errors)
- Build mode catches: hydration mismatches, missing dependencies, type errors in unused paths, SSR issues

**What to Do Instead:**

- ALWAYS run `npm run build` before considering task complete
- Test build locally before pushing to production
- Don't trust dev mode for final validation

**Command:** `npm run build` (required before "done")

---

### 8. Home Depot Product URLs

**Problem:** Agents keep linking users to `https://www.homedepot.com/p/<SKU>` and it does not work.

**What We Learned:**

- Home Depot product pages use an **internet number / product id**, not the SKU
- `https://www.homedepot.com/p/<SKU>` is generally invalid
- Correct direct pattern is `https://www.homedepot.com/p/<internetNumber>`
- If internet number missing, fallback to search: `https://www.homedepot.com/s/<SKU>?NCNI-5`

**What to Do Instead:**

- Use the shared helper `getHomeDepotProductUrl()`

**Files:** `/lib/home-depot.ts`

---

### 9. Cross-AI Collaboration

**Problem:** Losing context between AI sessions and tools (Claude Code, ChatGPT, Copilot).

**What We Learned:**

- Markdown docs are tool-agnostic (work everywhere)
- Decision rights reduce rework (AI knows what needs approval)
- Session logs create continuity
- Context files help AI understand WHY, not just WHAT

**What to Do Instead:**

- Structure collaboration with CONTRACT, DECISION_RIGHTS, CONTEXT, CONSTRAINTS
- Update SESSION_LOG after each task
- Document learnings in this file
- New AI reads `.ai/` directory first

**Files:** All files in `/.ai/` directory

**Benefit:** Consistent quality across AI tools and sessions

---

### 10. SEO & Indexing Strategy

**Problem:** Google only indexing 3/17 pages and reporting "Redirect errors".

**What We Learned:**

- Google prefers consistency between metadata, sitemap, and actual crawled domain (www vs non-www)
- Including redirecting URLs in sitemap confuses Google
- Pages that only redirect to homepage sections should be handled via 301 redirects in `next.config.js` and excluded from sitemap

**What to Do Instead:**

- Use `https://www.pennycentral.com` as canonical domain in all metadata and sitemaps
- Only include "real" content pages in `sitemap.ts`
- Use `robots: { index: false }` for defunct or private tools
- Define permanent redirects in `next.config.js` for legacy paths

**Files:** `app/layout.tsx`, `app/sitemap.ts`, `next.config.js`

---

### 11. AdSense "Low Value Content" & Sitemap Bloat

**Problem:** Google AdSense rejected site for "Low Value Content" despite strong engagement metrics (17k users, 70k PVs, 70s avg session, 40% bounce).

**What We Learned:**

- AdSense uses same quality signals as Google Search
- Sitemap with 900+ URLs where Google won't crawl 787 of them = "low value" signal
- "Discovered - currently not indexed" with N/A for "last crawled" means Google looked at the URL and decided it wasn't worth fetching
- Thin programmatic pages (SKU pages with just SKU/image/location count) hurt domain-wide quality perception
- Filtered list pages (state pages) are seen as duplicate/doorway content
- The **ratio** of good:bad pages matters more than absolute numbers

**What to Do Instead:**

- Keep sitemap lean: only include pages Google should actually index
- Add `robots: { index: false, follow: true }` to thin/programmatic pages
- Check GSC for "Discovered - currently not indexed" ratio before applying to ad networks
- If traffic is social/direct (not organic), noindexing thin pages has zero downside
- Fix the root cause before reapplying (don't just hope for different result)

**Pattern (Pillar-Only Indexing):**

```typescript
// sitemap.ts - only pillar pages
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com/", priority: 1.0 },
    { url: "https://example.com/guide", priority: 0.9 },
    // Only editorial/content-rich pages
  ]
}

// Thin pages get noindex
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}
```

**Files:** `app/sitemap.ts`, `app/sku/[sku]/page.tsx`, `app/pennies/[state]/page.tsx`
**Date:** Feb 02, 2026

---

### 12. Playwright E2E Timeout (Local)

**Problem:** `npm run test:e2e` timed out at the default 240s during this session.

**What We Tried:**

- Ran `npm run test:e2e` after successful `lint`, `build`, and `test:unit`.

**What We Learned:**

- The Playwright run can exceed the default timeout in this environment, even when the build is clean.

**What to Do Instead:**

- Re-run `npm run test:e2e` with a longer timeout (e.g., 6–8 minutes) when it times out.
- If it still fails, capture the first failing spec by running a targeted Playwright command and log artifacts before retrying the full suite.

**Date:** Feb 05, 2026

---

### 13. Build Fails After Route Removal (Stale `.next` Types)

**Problem:** `npm run build` failed after removing `/trip-tracker`, with type errors in `.next-playwright` and `.next/dev/types`.

**What We Tried:**

- Re-ran `npm run build` directly.

**What We Learned:**

- Next.js can keep stale route types in `.next` and `.next-playwright` after a route is deleted.

**What to Do Instead:**

- Delete `.next` and `.next-playwright` before rebuilding when removing routes:
  - `cmd /c rmdir /s /q .next`
  - `cmd /c rmdir /s /q .next-playwright`

**Date:** Feb 05, 2026

---

### 14. Playwright MCP Blocks `file://` URLs

**Problem:** Playwright MCP refused to open a local HTML file for before/after screenshots.

**What We Tried:**

- Navigated to a `file:///` URL in the Playwright MCP browser.

**What We Learned:**

- The Playwright MCP tool blocks `file://` URLs.

**What to Do Instead:**

- Serve the file over a local HTTP server (example: `python -m http.server 4173` from the folder).
- Navigate to `http://localhost:4173/<file>.html` and capture the screenshot.

**Date:** Feb 05, 2026

---

### 15. Prettier CRLF Warnings After Python Edits

**Problem:** `npm run lint` reported hundreds of Prettier warnings (`Insert ␍`) after editing TSX files with Python.

**What We Tried:**

- Ran lint immediately after Python rewrites.

**What We Learned:**

- The repo expects CRLF line endings; Python writes LF by default.
- Running `eslint --fix` or rewriting with CRLF resolves the warnings.

**What to Do Instead:**

- Normalize line endings to CRLF after Python edits, or run:
  - `npx eslint <files> --fix`

**Date:** Feb 05, 2026

---

### 16. One-off SKU Fix Scripts

**Problem:** One-off scripts were created to fix incorrect SKUs and then left in `scripts/`.

**What We Tried:** Created `scripts/fix-sku-1006609478.ts` and `scripts/fix-sku-527385.ts`, executed them to correct data, and removed them from the repo.

**What We Learned:** One-off scripts are useful for immediate fixes but should be archived or deleted after use to avoid clutter and accidental reuse. Prefer parameterized, tested tools for repeated tasks.

**What to Do Instead:** For single fixes: apply and then archive under `archive/scripts-pruned/` or delete after recording the action in `.ai/SESSION_LOG.md` and `.ai/LEARNINGS.md`. For recurring needs: build a safe, parameterized `scripts/fix-sku.ts` with dry-run default and tests.

**Date:** Feb 09, 2026

---

### 17. E2E Reuse on Port 3002 Can Produce False Failures

**Problem:** `npm run test:e2e` failed with dozens of unrelated Playwright failures (MIME type/script chunk errors) after trying to reuse an already-running server on port 3002.

**What We Tried:** Set `PLAYWRIGHT_REUSE_EXISTING_SERVER=1` and reran e2e.

**What We Learned:** Reusing a stale Next server on port 3002 can serve mismatched chunk artifacts and trigger broad false negatives across many specs.

**What to Do Instead:** If e2e reports port 3002 in use, stop the stale 3002 listener and run a clean `npm run test:e2e` so Playwright owns the server lifecycle for that run.

**Date:** Feb 09, 2026

---

### 18. GitHub Actions API Can Throttle Repeated `gh run list` Calls

**Problem:** `gh run list` started failing with HTTP 429 while collecting workflow-run evidence artifacts.

**What We Tried:** Re-ran `gh run list` with different limits immediately after prior calls.

**What We Learned:** GitHub Actions endpoints can temporarily throttle repeated requests, even for authenticated clients.

**What to Do Instead:** Treat already-captured successful outputs as evidence, pause before retrying, and avoid repeated immediate calls to the same workflow list endpoint in one session.

**Date:** Feb 09, 2026

---

### 19. Running Heavy Verification Lanes in Parallel Can Produce False Build Failures

**Problem:** A combined run of `verify:fast` and `e2e:smoke` executed in parallel produced unstable build failures (`JavaScript heap out of memory` / Next build worker exit `3221226505`) despite clean reruns.

**What We Tried:**

- Ran both commands concurrently in one session.
- Re-ran each lane sequentially.
- Increased Node heap for reruns (`NODE_OPTIONS=--max-old-space-size=8192`).

**What We Learned:**

- Parallel heavy Next.js builds can contend for memory/worker resources and create non-deterministic false negatives.

**What to Do Instead:**

- Run heavy verification lanes sequentially (`verify:fast` then `e2e:smoke`).
- If build instability appears, rerun lane in isolation with higher Node heap and keep the isolated log as canonical evidence.

**Date:** Feb 09, 2026

---

**For full learning history:** See `archive/learnings-history/LEARNINGS_full_2024-2025.md`
