# Technical Constraints

**Purpose:** Hard boundaries that must NOT be crossed. These exist because they've caused problems before or pose unacceptable risk.

**⚠️ CRITICAL: Read [VERIFICATION_REQUIRED.md](VERIFICATION_REQUIRED.md) before claiming any work is "done".**

---

## 🔴 MOST VIOLATED RULES (CANONICAL REFERENCES)

To reduce policy drift, detailed definitions for the most-violated rules are canonical in `.ai/CRITICAL_RULES.md`.

Use this file for technical boundaries and fragile-area constraints; use `CRITICAL_RULES.md` for non-negotiable behavior details.

- Rule #1 (Port 3001 ownership and restart policy): `.ai/CRITICAL_RULES.md` -> `Rule #1`
- Rule #2 (No raw Tailwind color palette usage): `.ai/CRITICAL_RULES.md` -> `Rule #2`
- Rule #3 (Verification proof requirements + docs-only exception): `.ai/CRITICAL_RULES.md` -> `Rule #3` and `.ai/VERIFICATION_REQUIRED.md`

---

## 🔴 NEVER Touch (Without Explicit Permission)

### 1. globals.css

**Location:** `/app/globals.css`

**Why It's Fragile:**

- Controls site-wide styling via CSS variables
- Changes cascade unpredictably
- Hard to debug if broken
- Dark mode relies on these variables

**What You CAN'T Do:**

- ❌ Add new color variables
- ❌ Modify existing variable values
- ❌ Change typography scale
- ❌ Alter spacing tokens
- ❌ Modify dark mode selectors

**What You CAN Do:**

- ✅ Reference existing variables in component styles
- ✅ Propose changes (with clear rationale)

**If You Must Modify:**

1. Explain WHY existing approach doesn't work
2. Show minimal change needed
3. Test light + dark mode thoroughly
4. Get explicit approval

### EXCEPTION: Penny List Card Typography (Jan 2026)

**Authorized by:** Cade (2026-01-08)
**Context:** Typography constraints were too restrictive for penny list cards

The following globals.css utilities were added with explicit owner approval:

- `.penny-card-name` (14px)
- `.penny-card-brand` (11px)
- `.penny-card-sku` (11px mono)
- `.penny-card-price` (28px)

These are **card-specific optimizations** and do NOT change the global typography scale.
Future agents: Do NOT remove these utilities or revert to the old 16-18px item name sizing.

### EXCEPTION: Dark Mode Text Muted AAA Upgrade (Jan 2026)

**Authorized by:** Cade (2026-01-29)
**Context:** Dark mode `--text-muted` was AA (4.7:1), upgraded to AAA (7.2:1)

Change: `--text-muted: #959595` → `--text-muted: #a3a3a3`

This improves readability for all muted text in dark mode. Future agents: Do NOT revert this change.

### EXCEPTION: WCAG AAA Readability Overhaul (Feb 2026)

**Authorized by:** Cade (2026-02-06)
**Context:** Light mode text hierarchy was too compressed; dark mode secondary was AA-only on card surfaces.

Changes:

- Light `--text-secondary`: `#36312e` → `#44403c` (body copy — wider gap from headlines)
- Light `--text-muted`: `#44403c` → `#504a45` (metadata — clearly lighter than body)
- Light `--text-placeholder`: `#36312e` → `#544f49` (placeholder now AAA on recessed surfaces)
- Dark `--text-secondary`: `#b0b0b0` → `#bdbdbd` (AAA on card surfaces)
- Dark `--text-muted`: `#a3a3a3` → `#adadad` (AAA on card surfaces)
- Added `--bg-subtle` token (light: `#f8f8f7`, dark: `#181818`)
- Added `.guide-article`, `.guide-callout` classes for guide readability

All text tokens remain WCAG AAA on intended worst-case backgrounds. See `docs/DESIGN-SYSTEM-AAA.md` for full contrast evidence.

Future agents: Do NOT revert these changes or compress the text hierarchy.

---

### 2. React-Leaflet Map Component

**Location:** `/components/store-map.tsx`

**Why It's Fragile:**

- Hydration issues (SSR vs client-side rendering)
- Must use dynamic imports with `ssr: false`
- 51 store markers must all render correctly
- Easy to break on build without seeing errors in dev

**What You CAN'T Do:**

- ❌ Remove "use client" directive
- ❌ Change how the component is imported
- ❌ Modify marker rendering logic
- ❌ Change map initialization

**What You CAN Do:**

- ✅ Update store data (in `/lib/stores.ts`)
- ✅ Adjust popup content/styling
- ✅ Propose UX improvements (with testing plan)

**If You Must Modify:**

1. Test with `npm run build` (not just dev mode)
2. Verify all 51 markers render
3. Test on mobile
4. Get explicit approval

---

### 3. "use client" Directives

**Why They Exist:**

- Next.js App Router requires explicit client component marking
- Removing them breaks interactivity or causes hydration errors
- They're there for a reason (often learned the hard way)

**What You CAN'T Do:**

- ❌ Remove "use client" without understanding why it's there
- ❌ Add "use client" to every file (defeats server components)

**What You CAN Do:**

- ✅ Keep them where they are
- ✅ Add them when necessary for interactivity (useState, useEffect, event handlers)

**Rule of Thumb:**

- If component uses React hooks → needs "use client"
- If component is purely display (no state/effects) → can be server component
- When in doubt → leave existing directives alone

---

### 4. Build Configuration

**Files:**

- `next.config.js`
- `tsconfig.json`
- `tailwind.config.ts`

**Why They're Fragile:**

- Opaque errors if misconfigured
- Hard to debug without deep Next.js knowledge
- Can break builds in production (not just dev)

**What You CAN'T Do:**

- ❌ Change experimental Next.js flags
- ❌ Modify TypeScript strict mode settings
- ❌ Alter Tailwind purge/content settings
- ❌ Add plugins without discussing impact

**What You CAN Do:**

- ✅ Propose optimizations (with clear benefit)
- ✅ Add comments explaining existing config

---

## ⚠️ Fragile Areas (Proceed with Caution)

### 5. Store Finder Search Logic

**Location:** `/app/store-finder/page.tsx`

**Why It's Delicate:**

- Relies on free Zippopotam API for ZIP geocoding
- API can be slow or fail (need fallback handling)
- Search supports city, state, ZIP (complex parsing)

**Before Modifying:**

- Test all search types (ZIP, city, state name)
- Verify API fallback behavior
- Check mobile UX

---

### 6. Penny List Data Fetching (Supabase-first)

**Location:** `/lib/fetch-penny-data.ts`

**Why It's Delicate:**

- Reads from Supabase (`penny_list_public` + enrichment overlays)
- Privacy-sensitive (must not expose emails/timestamps)
- Server-side only (can't run in browser)

**Before Modifying:**

- Verify email addresses stay server-side
- Prefer fixture-based test mode for deterministic verification
- Keep legacy Google Sheet import logic strictly one-off/manual (not primary runtime path)
- If wiring the internet-SKU → product URL map, keep it backend-only, stored privately (env/Blob/Drive), never expose internet SKU in UI, and always fall back to regular SKU-based links when no mapping exists.

---

### 7. Environment Variables

**Current Vars:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SHEET_URL` (legacy one-off import only; not primary runtime dependency)

**Why It's Sensitive:**

- Changes require Vercel dashboard access
- Cade must update manually
- Mistakes can break production silently

**Before Adding New Env Vars:**

- Propose to Cade (explain what it's for)
- Document where it needs to be set
- Provide clear setup instructions

---

## 🟢 Safe to Modify

### Component Styles

- Tailwind classes in JSX
- Component-specific CSS modules
- Existing design tokens (colors, spacing)

### Content

- Page text and copy
- Component labels
- Alt text and ARIA labels

### Data Files

- `/lib/stores.ts` (store locations)
- Static JSON/data files

### Documentation

- Markdown files (README, docs/, etc.)
- Code comments
- Type definitions

---

## Quality Gates (Always Required, Lane Model)

### Before Considering Any Task Complete:

1. **FAST lane (always)**

   ```bash
   npm run verify:fast
   ```

2. **SMOKE lane (for route/form/API/navigation/UI-flow changes)**

   ```bash
   npm run e2e:smoke
   ```

3. **FULL lane (only when trigger policy applies)**

   ```bash
   npm run e2e:full
   ```

4. **Mobile Test**
   - If user-facing: test on mobile viewport
   - Check touch targets, text size, scrolling

5. **Functionality Verification**
   - Does the feature work as intended?

---

## Analytics & QA Focus (Operational Policy)

Analytics must actively drive priorities (not just be installed).

### Device Mix → QA Rules

- Maintain current device mix in `.ai/STATE.md` (update monthly from GA4).
- If **mobile ≥ 60%**, every UI change must be checked on **375×667** and **390×844** viewports.
- If **tablet ≥ 8%**, add one tablet viewport check (iPad-ish) for any UI change.
- If device mix shifts by **±10 points** week-over-week, treat that as a priority signal and adjust QA focus.
  - Does existing functionality still work?

6. **Documentation Update**
   - Update SESSION_LOG.md
   - Add to LEARNINGS.md if relevant

---

## Dependencies Policy

### Current Stack (Don't Remove)

- Next.js 16
- TypeScript
- Tailwind CSS
- React-Leaflet
- papaparse (for CSV parsing)
- shadcn/ui components

### Before Adding New Dependencies:

**Ask:**

1. Can we solve this with existing dependencies?
2. Is this dependency well-maintained?
3. What's the bundle size impact?
4. Will Cade need to maintain/update this?

**Propose:**

- What problem it solves
- Why existing tools aren't sufficient
- Maintenance implications
- Alternative approaches considered

---

## Known Technical Debt

### Current Acceptable Compromises

- Supabase-first backend (legacy Google Sheets flow is archival/manual only)
- No user auth (not needed for current features)
- No real-time updates (hourly revalidation is sufficient)
- No comprehensive testing suite (manual testing is acceptable)

**Why These Are Okay:**

- Keep maintenance burden minimal
- Match Cade's skillset and availability
- Solve the actual user need without over-engineering

**Don't "Fix" These Unless:**

- Cade explicitly asks
- They're causing actual user problems
- Clear benefit outweighs added complexity

---

## Version History

- **v1.1 (Feb 11, 2026):** Updated architecture truth to Supabase-first and aligned quality gates to FAST/SMOKE/FULL lanes.
- **v1.0 (Dec 7, 2025):** Initial constraints document
