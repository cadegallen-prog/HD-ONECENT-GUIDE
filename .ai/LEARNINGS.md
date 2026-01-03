# Accumulated Learnings

**Purpose:** Things we learned the hard way, so we don't repeat mistakes. This is the "institutional knowledge" of the project.

**Format:** Problem → What We Tried → What We Learned → What to Do Instead

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

## Playwright E2E + Next Dev Lock (Port 3001)

### Problem

Playwright E2E failed with:
- `Unable to acquire lock at .next/dev/lock, is another instance of next dev running?`

### What We Tried

- Ran `npm run test:e2e` while a dev server was already running on port 3001.

### What We Learned

- Next.js dev uses a project-wide `.next/dev/lock` → you can't run a second `next dev`, even on a different port.
- When port 3001 is already running, Playwright should reuse it by setting `PLAYWRIGHT_BASE_URL=http://localhost:3001`.
- Reusing an already-running dev server may not have `PLAYWRIGHT=1`, which can make `/penny-list` empty and break specs that expect fixture data.
- Safer default: run Playwright against `next start` on port 3002 (no `.next/dev/lock` conflict) with `PLAYWRIGHT=1` enabled for deterministic fixtures.

### What to Do Instead

- Default local flow (recommended):
  - `npm run build`
  - `npm run test:e2e` (Playwright runs against `next start` on port 3002 with `PLAYWRIGHT=1`)
- If port 3001 is running:
  - PowerShell: `$env:PLAYWRIGHT_BASE_URL='http://localhost:3001'; npm run test:e2e`
  - Bash: `PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e`
- Prefer `npm run ai:verify` (it auto-detects port 3001 and sets `PLAYWRIGHT_BASE_URL` for E2E).

**Files:** `playwright.config.ts`, `scripts/ai-verify.ts`

**Date:** Jan 03, 2026

---

## Dynamic OG Image Generation for Social Media

### Problem

Open Graph images kept failing on Facebook despite 5-10 iterations. Dynamic OG generation via Edge runtime (`/api/og` with `ImageResponse`) was unreliable, causing:
- Facebook crawler timeouts
- "200 OK but zero-byte body" errors
- Font rendering failures on Edge runtime
- Inconsistent preview failures across different social platforms

### What We Tried

- Switched from dynamic to static OG images, then back to dynamic
- Removed Google Fonts CDN and switched to system fonts
- Disabled caching completely (`no-store, max-age=0`)
- Bumped version querystring to force cache refresh (v1 → v7)
- Multiple font embedding approaches (WOFF2, system fonts)

### What We Learned

- **Dynamic OG generation on Edge runtime is inherently fragile for social crawlers**
  - Facebook's crawler has strict timeout limits (~1-2 seconds)
  - Edge function cold starts can exceed this timeout
  - Font handling in `ImageResponse` API is unreliable (WOFF2 issues, system font inconsistencies)
  - Disabling caching makes it worse - every scrape regenerates from scratch
- **Static images are bulletproof**
  - No generation time = no timeout risk
  - Automatic CDN caching
  - Consistent rendering (no font issues)
  - Facebook debugger always succeeds
- **Hybrid approach is optimal**
  - Main pages (homepage, penny-list, etc.) get frequent shares → use static PNGs
  - SKU detail pages rarely shared individually → dynamic with caching is acceptable
  - Static files are ~50KB each (well under 300KB recommendation)

### What to Do Instead

1. **Use static OG images for frequently-shared pages** - Generate PNGs once, commit to repo
2. **Create generation script** - Use Playwright to screenshot the OG endpoint (`scripts/generate-og-images-playwright.ts`)
   - Captures exact design without dealing with fonts/rendering
   - Run when design changes, commit the new PNGs
3. **Enable caching for dynamic OG** - If keeping dynamic for some pages, enable 24hr caching (`revalidate=86400`)
4. **Test with Facebook Sharing Debugger** - https://developers.facebook.com/tools/debug/ before considering it "done"
5. **Monitor file sizes** - Keep static OGs under 300KB for fast loading

---

## External Data Dependencies & Fallback Logic

### Problem

Dev server entered infinite loop and wouldn't serve content after Google Sheet URL expired.

### What We Tried

- Previous agent attempted fixes for 7-8 hours, getting stuck in the same loop
- Making incremental changes without understanding root cause
- Reducing timeouts to "fix" the issue (made it worse)

### What We Learned

- External data dependencies (Google Sheets, APIs) MUST have fallback mechanisms
- When data fetching fails during server initialization (SSG/`generateStaticParams`), empty results can cause infinite retry loops
- Aggressive timeout reductions mask problems instead of fixing them
- Test fixtures are essential for offline development and deterministic E2E tests
- Plan mode investigation prevents wasted time on trial-and-error approaches

### What to Do Instead

**Always implement smart fallbacks:**

```typescript
async function fetchData() {
  try {
    // Try primary data source
    const res = await fetch(PRIMARY_URL)
    if (!res.ok) throw new Error(`Failed: ${res.statusText}`)
    return await res.json()
  } catch (error) {
    console.error("Primary source failed:", error)
    console.warn("Falling back to local fixture")
    // Fall back to local fixture
    return tryLocalFallback()
  }
}
```

**Keep balanced timeouts:**
- Don't reduce timeouts below 30s for network operations
- 60s minimum for server startup in E2E tests
- Timeout errors should trigger investigation, not timeout reduction

**Always include test fixtures:**
- Add local JSON fixtures for Playwright tests (`data/penny-list.json`)
- Prevents flaky tests due to external dependencies
- Enables offline development

**Files:** `lib/fetch-penny-data.ts`, `playwright.config.ts`, `data/penny-list.json`

**Date:** Dec 20, 2025

---

## React-Leaflet & Hydration

### Problem

Map component broke on production builds (worked fine in dev)

### What We Tried

- Standard component import
- Server-side rendering the map

### What We Learned

- React-Leaflet requires client-side rendering only
- Hydration errors don't always show in dev mode
- Must use dynamic imports with `ssr: false`

### What to Do Instead

```tsx
const StoreMap = dynamic(() => import("@/components/store-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})
```

**Files:** `/app/store-finder/page.tsx`, `/components/store-map.tsx`

**Never:** Remove "use client" directive or change import method

---

## SEO & Indexing Strategy

### Problem

Google only indexing 3/17 pages and reporting "Redirect errors".

### What We Tried

- Using non-www domain in metadata while Google preferred www.
- Including "shortcut" pages (redirects to homepage sections) in sitemap.

### What We Learned

- Google prefers consistency between metadata, sitemap, and the actual crawled domain (www vs non-www).
- Including redirecting URLs in the sitemap confuses Google and leads to "Redirect errors".
- Pages that only redirect to homepage sections should be handled via 301 redirects in `next.config.js` and excluded from the sitemap.

### What to Do Instead

- Use `https://www.pennycentral.com` as the canonical domain in all metadata and sitemaps.
- Only include "Real" content pages in `sitemap.ts`.
- Use `robots: { index: false }` for defunct or private tools like `trip-tracker`.
- Define permanent redirects in `next.config.js` for legacy or shortcut paths.

**Files:** `app/layout.tsx`, `app/sitemap.ts`, `next.config.js`, `app/trip-tracker/layout.tsx`

---

## Google Sheets as Backend

### Problem

Needed community submissions without building database/auth system

### What We Tried

- Google Forms → Google Sheets → Publish as CSV

### What We Learned

- Google Sheets CSV export is a free, zero-maintenance API
- Published sheets are public (don't expose sensitive data)
- Can use field aliases to handle column name variations
- ISR (hourly revalidation) keeps data fresh without polling

### What to Do Instead

- Use Google Forms for data collection
- Publish Sheet as CSV (File → Share → Publish to web)
- Set Next.js revalidation to control update frequency
- Keep emails/timestamps server-side only

**Files:** `/lib/fetch-penny-data.ts`, `/app/penny-list/page.tsx`

**Pro:** Zero infrastructure, no database costs, Cade can moderate in spreadsheet
**Con:** Not suitable for real-time needs or >10k rows

---

## Design System & globals.css

### Problem

Inconsistent colors and dark mode issues

### What We Tried

- Hardcoding colors in components
- Multiple color definitions
- Inline styles

### What We Learned

- CSS variables in globals.css control everything
- Changes cascade unpredictably
- Dark mode relies on these variables
- Easier to break than to fix

### What to Do Instead

- Use existing design tokens (don't add new ones)
- Reference variables with Tailwind classes (`text-foreground`, `bg-card`)
- Test light + dark mode if touching globals.css

**Files:** `/app/globals.css`

**Rule:** Don't modify globals.css without explicit approval

---

## Store Finder Search Logic

### Problem

Users search by ZIP, city name, or state name (inconsistent input)

### What We Tried

- Zippopotam.us API for ZIP → coordinates
- Manual geocoding for cities/states

### What We Learned

- Zippopotam is free but can be slow/unreliable
- Need fallback for when API fails
- State name search requires fuzzy matching
- Mobile users expect instant results

### What to Do Instead

- Support all three input types (ZIP, city, state)
- Show clear loading states
- Gracefully handle API failures
- Cache results when possible

**Files:** `/app/store-finder/page.tsx`

**Trade-off:** Free API vs. paid (Google Maps). Free is acceptable for this use case.

---

## "use client" Directives

### Problem

Not clear when to use "use client" vs server components

### What We Tried

- Trial and error (broke things frequently)

### What We Learned

- Next.js App Router defaults to server components
- "use client" needed for:
  - React hooks (useState, useEffect, useContext)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Third-party components that use hooks
- Server components are better for:
  - Static content
  - Data fetching (can be async)
  - SEO-critical pages

### What to Do Instead

- Start with server component (default)
- Add "use client" only when you get errors
- Don't remove existing "use client" directives

**Rule:** If it has hooks or interactivity, it needs "use client"

---

## Build vs Dev Mode Differences

### Problem

Features work in dev (`npm run dev`) but break in production build

### What We Tried

- Assuming dev mode = production behavior

### What We Learned

- Dev mode is more forgiving (shows warnings, not errors)
- Build mode catches:
  - Hydration mismatches
  - Missing dependencies
  - Type errors in unused code paths
  - SSR issues (like the map component)

### What to Do Instead

- ALWAYS run `npm run build` before considering task complete
- Test build locally before pushing to production
- Don't trust dev mode for final validation

**Command:** `npm run build` (required before "done")

---

## Community Moderation Strategy

### Problem

Worried about spam/junk submissions on penny list

### What We Tried

- Crowd-sourced quality control (no pre-approval)

### What We Learned

- Community self-moderates surprisingly well
- Bad actors are rare (< 5% of submissions)
- Manual deletion from Sheet is fast enough
- Pre-approval kills participation (adds friction)

### What to Do Instead

- Launch with no moderation
- Monitor first 10-20 submissions
- Delete spam directly in Google Sheet if needed
- Add approval column only if quality drops below 90%

**Philosophy:** Trust the community, intervene minimally

---

## Home Depot Product URLs

### Problem

Agents keep linking users to `https://www.homedepot.com/p/<SKU>` and it does not work.

### What We Tried

- Building Home Depot links with the retail SKU

### What We Learned

- Home Depot product pages use an **internet number / product id**, not the SKU.
- `https://www.homedepot.com/p/<SKU>` is generally invalid.
- Correct direct pattern is `https://www.homedepot.com/p/<internetNumber>`.
- If internet number is missing, fall back to search: `https://www.homedepot.com/s/<SKU>?NCNI-5`.

### What to Do Instead

- Use the shared helper `getHomeDepotProductUrl()`.

**Files:** `/lib/home-depot.ts`

---

## Cross-AI Collaboration

### Problem

Losing context between AI sessions and tools (Claude Code, ChatGPT, Copilot)

### What We Tried

- Relying on CLAUDE.md alone (not enough context)
- Repeating instructions every session (inefficient)

### What We Learned

- Markdown docs are tool-agnostic (work everywhere)
- Decision rights reduce rework (AI knows what needs approval)
- Session logs create continuity
- Context files help AI understand WHY, not just WHAT

### What to Do Instead

- Structure collaboration with CONTRACT, DECISION_RIGHTS, CONTEXT, CONSTRAINTS
- Update SESSION_LOG after each task
- Document learnings in this file
- New AI reads `.ai/` directory first

**Files:** All files in `/.ai/` directory

**Benefit:** Consistent quality across AI tools and sessions

---

## Playwright: reuseExistingServer + Date Mocking

### Problem

Playwright E2E runs failed with hydration mismatch console errors (server-rendered relative dates didn’t match client) when a dev server was already running.

### What We Tried

- Mocked `window.Date` in the browser for deterministic tests.

### What We Learned

- If Playwright reuses an already-running `next dev` process, it may _not_ have `PLAYWRIGHT=1` set.
- Mocking Date only in the browser can create real hydration mismatches if the server HTML was rendered with real time.

### What to Do Instead

- Avoid browser-only Date mocking in smoke tests that assert “no console errors.”
- Prefer deterministic fixtures/time on the server (via `PLAYWRIGHT=1`) only when Playwright starts the server itself.

---

## Playwright MCP install on Windows

### Problem

The Playwright MCP server install can fail on Windows due to permissions (global npm install trying to write under `C:\Program Files\Git\home`).

### What We Learned

`@playwright/test` via `npx playwright ...` is sufficient for browser verification and is more reliable in this environment.

---

## Dev Server Port Handling

### Problem

Agents restart or kill the dev server on port 3001 even when it is already running.

### What We Tried

- Running `npm run dev` blindly without checking whether another process already owns port 3001.

### What We Learned

- The server is intentionally kept running so future sessions can reuse it, and restarting or killing it disrupts that flow.

### What to Do Instead

- Always check if port 3001 is occupied (e.g., `lsof -i :3001` or `netstat`). If it is, access http://localhost:3001 directly for testing; do not kill processes or restart unless explicitly instructed.

**Files:** /ai/MCP_SERVERS.md, /ai/USAGE.md

**Rule:** Prioritize accessing running servers over starting new ones.

## MCP Stack Simplification (Dec 14, 2025)

### Problem

Had 9 MCP servers configured with strict "MANDATORY" usage rules that agents were supposed to follow without exception.

### What We Tried

- Prescriptive "YOU MUST USE" documentation (740 lines)
- "NO EXCEPTIONS. NO SHORTCUTS." enforcement language
- Anti-pattern sections to prevent "lazy" agents
- Mandatory session start/end MCP checklist (check memory, use sequential thinking, etc.)
- Three separate memory systems (Memory MCP, Memory-Keeper MCP, .ai/ docs)

### What We Learned

**The "mandatory" rules didn't work:**

- Session logs showed agents ignored these rules consistently
- Quality remained high despite not using "mandatory" MCPs
- No evidence of Sequential Thinking, Memory MCP, or Context7 usage in recent sessions
- Agents self-regulated naturally and still produced good work

**Why it failed:**

1. **Compliance theater** - Created guilt/confusion without improving outcomes
2. **Wrong problem** - MCPs are tools, not processes. The problems (testing, context loss, outdated knowledge) needed process solutions (quality gates, documentation), not more tools
3. **Duplicate systems** - Three memory systems (Memory MCP + Memory-Keeper + .ai/ docs) created confusion instead of clarity
4. **Cognitive load** - 9 MCPs with mandatory usage rules = too much to track, especially for non-technical user
5. **Unverifiable** - User couldn't tell if agents followed rules, creating anxiety without benefit

**What actually works:**

- Quality gates (`npm run build`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`)
- File-based memory (.ai/ docs: SESSION_LOG.md, LEARNINGS.md, STATE.md)
- Clear decision rights (DECISION_RIGHTS.md)
- Trust agents to self-regulate

### What to Do Instead

**Keep 4 pragmatic MCPs:**

- Filesystem (file operations)
- Git (version control)
- GitHub (PR/issue management)
- **Playwright (autonomous browser verification)** - special case, reduces non-technical user's testing burden

**Remove overhead MCPs:**

- ❌ Sequential Thinking (agents already think)
- ❌ Memory + Memory-Keeper (duplicate of .ai/ docs)
- ❌ Next-Devtools (duplicate of `npm run build`)
- ❌ Context7 (modern AI training data is current enough)

**Why Playwright is different:**

- Unlike the removed MCPs, Playwright solves a real user pain point
- Non-technical user struggled to test browser behavior and describe technical issues
- Playwright gives agents "eyes on the browser" - they can autonomously verify UI/JavaScript works
- Reduces communication gap: agent sees same thing user sees, fixes issues before user tests
- **Position:** Pragmatic tool (use when valuable), NOT mandatory compliance (use every time)

**Focus on outcomes, not process:**

- Does the build pass? (quality gate)
- Are docs updated? (session log)
- Does it work for users? (testing)

**Don't:**

- Create "MANDATORY" tool usage rules
- Build duplicate systems for the same problem
- Add compliance overhead without clear ROI
- Mistrust agents without evidence

**Files:** `~/.codex/config.toml`, `.ai/MCP_SERVERS.md`, `.ai/USAGE.md`

**Rule:** Trust but verify - agents self-regulate; quality gates verify outcomes

**Impact:** Reduced MCP documentation from 740 lines to 180 lines; cognitive load dramatically lower

---

## Dev Server Crashes and Agent Loops (Dec 26, 2025)

### Problem

The Next.js dev server crashes with "Jest worker encountered child process exceptions" and agents don't realize it. They keep running tests that timeout, creating infinite loops of retries.

### What We Tried

- Checking if port 3001 is "in use" (insufficient - crashed server still holds the port)
- Adding "graceful skip" to tests (hides the problem, doesn't fix it)

### What We Learned

- A crashed server still occupies the port, so `netstat` shows it as "in use"
- The `ai:doctor` must actually **HTTP request** the server to verify it responds
- Tests timing out is usually a sign of crashed server, not bad tests
- "Graceful skip" in tests hides real problems - tests should fail loudly

### What to Do Instead

1. **`ai:verify` now checks server health FIRST** - If server is crashed, it fails fast with a clear message instead of running tests that will timeout
2. **`ai:doctor` checks if server responds** - Not just if the port is occupied
3. **If server is crashed:** Run `npx kill-port 3001` then `npm run dev`
4. **Don't add skips to tests** - if a test fails, fix the cause
5. **Restart dev server periodically** - long-running servers accumulate memory issues

**Files:** `scripts/ai-doctor.ts`, `scripts/ai-verify.ts`

**Rule:** If `ai:verify` says "SERVER HEALTH CHECK FAILED", restart the server. Do NOT retry tests until server is fixed.

---

## Template for New Learnings

When you discover something new, add it here:

```markdown
## [Topic/Feature Name]

### Problem

[What challenge did we face?]

### What We Tried

[What approaches did we attempt?]

### What We Learned

[What did we discover? What surprised us?]

### What to Do Instead

[Recommended approach going forward]

**Files:** [Relevant file paths]

**Rule/Pro/Con:** [Key takeaway or constraint]
```

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial learnings document with 7 key lessons
