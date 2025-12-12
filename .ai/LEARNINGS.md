# Accumulated Learnings

**Purpose:** Things we learned the hard way, so we don't repeat mistakes. This is the "institutional knowledge" of the project.

**Format:** Problem → What We Tried → What We Learned → What to Do Instead

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
const StoreMap = dynamic(() => import('@/components/store-map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
})
```

**Files:** `/app/store-finder/page.tsx`, `/components/store-map.tsx`

**Never:** Remove "use client" directive or change import method

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
