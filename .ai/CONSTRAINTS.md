# Technical Constraints

**Purpose:** Hard boundaries that must NOT be crossed. These exist because they've caused problems before or pose unacceptable risk.

**⚠️ CRITICAL: Read [VERIFICATION_REQUIRED.md](VERIFICATION_REQUIRED.md) before claiming any work is "done".**

---

## 🔴 MOST VIOLATED RULES (READ FIRST)

### ⛔ Rule #1: NEVER Kill Port 3001

**Problem:** Agents keep killing the dev server on port 3001 even though the user is intentionally running it.

**What happens:**

1. Agent notices port 3001 is in use
2. Agent kills the process
3. Agent starts `npm run dev` fresh
4. **User's time wasted** - they were already previewing changes

**CORRECT behavior:**

```bash
# Check if port 3001 is in use
lsof -i :3001  # (or netstat on Windows)

# IF PORT IS IN USE:
# ✅ USE IT - navigate to http://localhost:3001 in Playwright
# ✅ DO NOT kill the process
# ✅ DO NOT restart npm run dev

# IF PORT IS FREE:
# ✅ NOW you can run: npm run dev
```

**Exception:** Only kill port 3001 if:

- User explicitly asks you to restart it
- Process is hung/broken (not responding)
- You've asked user permission first

**Default assumption:** If port 3001 is occupied = **user is running server intentionally. Use it.**

---

### ⛔ Rule #2: NEVER Use Generic Tailwind Colors

**Problem:** Agents keep using boring, generic Tailwind colors that look cheap and unprofessional.

**FORBIDDEN (DO NOT USE):**

- ❌ `blue-500`, `blue-600`, `blue-700`
- ❌ `gray-500`, `gray-600`, `gray-700`
- ❌ `green-500`, `red-500`, `indigo-600`
- ❌ ANY raw Tailwind color names

**These look generic and lazy.**

**REQUIRED APPROACH:**

**Option 1: Use existing design tokens ONLY**

```css
/* ONLY use these from globals.css */
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--cta-primary, --cta-secondary
--border-default, --border-elevated
```

**Option 2: Get approval FIRST before adding new colors**

```
"This button needs a distinct color.

Current option: Use existing --cta-primary
Alternative: Introduce new accent color (requires approval)

Which would you prefer?"
```

**Rule:** NEVER add colors without either:

1. Using existing tokens from globals.css, OR
2. Getting user approval with before/after screenshots

---

### ⛔ Rule #3: NEVER Claim "Done" Without Proof

**Problem:** Agents claim "tests pass" or "bug fixed" without actually verifying.

**What happens:**

1. Agent: "All tests pass now!"
2. User checks: Tests are failing
3. **Trust broken, time wasted**

**REQUIRED:** Read [VERIFICATION_REQUIRED.md](VERIFICATION_REQUIRED.md) for complete requirements.

**Minimum proof for "done":**

- ✅ Test output (lint, build, test:unit, test:e2e - ALL 4)
- ✅ Screenshots (for UI changes - use Playwright)
- ✅ GitHub Actions status (if applicable - paste URL)
- ✅ Before/after comparison (show problem was actually fixed)

**No proof = not done.**

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

### 6. Penny List CSV Fetching

**Location:** `/lib/fetch-penny-data.ts`

**Why It's Delicate:**

- Parses Google Sheets CSV with flexible column aliases
- Privacy-sensitive (must not expose emails/timestamps)
- Server-side only (can't run in browser)

**Before Modifying:**

- Verify email addresses stay server-side
- Test with actual Google Sheet data
- Ensure hourly revalidation works
- If wiring the internet-SKU → product URL map, keep it backend-only, stored privately (env/Blob/Drive), never expose internet SKU in UI, and always fall back to regular SKU-based links when no mapping exists.

---

### 7. Environment Variables

**Current Vars:**

- `GOOGLE_SHEET_URL` (set in Vercel)

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

## Quality Gates (ALWAYS Required)

### Before Considering Any Task Complete:

1. **Build Check**

   ```bash
   npm run build
   ```

   - Must complete without errors
   - Warnings should be explained (and ideally fixed)

2. **Lint Check**

   ```bash
   npm run lint
   ```

   - Must pass with 0 errors
   - Fix all linting issues

3. **Mobile Test**
   - If user-facing: test on mobile viewport
   - Check touch targets, text size, scrolling

4. **Functionality Verification**
   - Does the feature work as intended?
   - Does existing functionality still work?

5. **Documentation Update**
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

- No database (Google Sheets as backend is intentional)
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

- **v1.0 (Dec 7, 2025):** Initial constraints document
