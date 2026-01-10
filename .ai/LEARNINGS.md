# Accumulated Learnings (Anti-Patterns + Top 10)

**Purpose:** Things we learned the hard way, so we don't repeat mistakes. This is the "institutional knowledge" of the project.

**Format:** Problem → What We Tried → What We Learned → What to Do Instead

**Auto-archive:** Full learning history preserved in `archive/learnings-history/`

---

## Quick Anti-Patterns (NEVER DO THESE)

Scan this FIRST before suggesting anything. If your idea matches an anti-pattern, STOP.

| Anti-Pattern | Why It Fails | What to Do Instead |
|--------------|--------------|---------------------|
| ❌ Home Depot links with SKU | HD uses internet numbers, not SKUs | Use `getHomeDepotProductUrl()` helper |
| ❌ Kill port 3001 if occupied | Server is intentionally kept running | Check if it responds, reuse it |
| ❌ Remove "use client" directives | Breaks production builds | Keep them; add if you get hydration errors |
| ❌ Modify globals.css without approval | Cascades unpredictably, breaks dark mode | Use existing tokens or get explicit approval |
| ❌ Reduce timeouts to "fix" failures | Masks the real problem | Investigate root cause; keep balanced timeouts |
| ❌ Dynamic OG images for main pages | Facebook crawler timeouts | Use static PNGs, generate with Playwright |
| ❌ Trust dev mode as final test | Dev mode is more forgiving | ALWAYS run `npm run build` before done |
| ❌ Skip reading LEARNINGS.md | You'll repeat documented failures | Read this file at session start |
| ❌ Ask Cade for every tactical decision | Creates friction, wastes time | Auto-chain: Implement → Test → Review → Doc |
| ❌ Suggest without conversation first | Builds wrong thing, hours wasted | Ask 1-2 questions before implementing |

---

## Top 10 Learnings (Most Important)

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

**For full learning history:** See `archive/learnings-history/LEARNINGS_full_2024-2025.md`
