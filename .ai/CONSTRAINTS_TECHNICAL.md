# Technical Constraints

**Purpose:** Hard boundaries and fragile areas that must NOT be crossed without explicit permission.

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

**Authorized Exceptions:**

- **Penny List Card Typography (2026-01-08):** `.penny-card-name`, `.penny-card-brand`, `.penny-card-sku`, `.penny-card-price` utilities were added with Cade's explicit approval. These are card-specific and do NOT modify the global typography scale.

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
- If wiring the internet-SKU → product URL map, keep it backend-only, stored privately (env/Blob/Drive), never expose internet SKU in UI, and always fall back to regular SKU-based links when no mapping exists

---

### 7. Environment Variables

**Current Vars:**

- `GOOGLE_SHEET_URL` (set in Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Analytics vars (optional)

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

## Design System Rules

### Token Rules

**Source of truth:** `app/globals.css` + `docs/DESIGN-SYSTEM-AAA.md`

- Do not add or change tokens without explicit approval
- Use tokenized Tailwind colors (`text-text-primary`, `bg-card`, `bg-elevated`, `border-border`, `text-muted`, `text-secondary`, `text-foreground`, `bg-background`)
- Status/CTA: use `text-success|warning|error|info` or `bg-[var(--status-*)]` sparingly; only one primary CTA per viewport
- Spacing: 8pt grid (`p-2/4/6/8`, `gap-2/4/6`, `section-padding`/`section-padding-sm`); Penny List cards may use 12-14px padding for dense scan layouts
- Minimum body text 16px; Penny List card metadata may be 12-13px; minimum touch target 44x44px; never use text <12px
- Dark mode: rely on existing CSS variables; no hard-coded dark mode colors

### Token Usage Guide

**Allowed:**

- `bg-[var(--token)]`, `text-[var(--token)]`, `border-[var(--token)]`
- shadcn semantic utilities (`bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-muted`, etc.) now aliased to PennyCentral tokens

**Disallowed:**

- Raw Tailwind palette classes (`bg-slate-*`, `text-zinc-*`, `text-blue-*`, etc.) unless a temporary hotfix is documented and replaced with tokens immediately after

### Layout Primitives

- **Containers:** `container-narrow` (max-w-4xl) and `container-wide` (max-w-7xl) for page alignment
- **Sections:** `section-padding` / `section-padding-sm` for vertical rhythm; avoid bespoke padding
- **Cards/Callouts:** reuse `value-explainer`, `callout-*`, `card-interactive`, `btn-*` patterns from `globals.css` before inventing new wrappers
- **Tables:** use `.line-clamp-2-table` for clamping; prefer `table`/`th`/`td` styling patterns from `globals.css`

---

## Guardrails (Non-Negotiable)

### Typography & Touch

- Body text ≥16px, line-height ≥1.6 (Penny List card metadata may be 12-13px)
- Touch targets ≥44×44px
- Never add text <12px

### Contrast & Parity

- Text meets WCAG AAA
- UI elements/focus rings ≥3:1
- Light/dark parity maintained
- CTA blue follows rules (one primary button per viewport; max 3 accent elements visible; links underlined)

### Forbidden Visuals

- No large shadows (>8px blur)
- No bright gradients
- No animations >150ms unless already present

### Affiliate Safety

- `/go/*` links are plain `<a>` with `target="_blank" rel="noopener noreferrer"`
- No `next/link`, no prefetch/fetch of affiliate URLs
- Tracking only on click

### Deployment Hygiene

- Single-branch workflow on `main`
- State the branch you used
- Do not assume local behavior matches production

### Privacy

- No PII in analytics
- Event props limited to documented schemas
- Never log emails/timestamps client-side

---

## Dependencies Policy

### Current Stack (Don't Remove)

- Next.js 16
- TypeScript
- Tailwind CSS
- React-Leaflet
- papaparse (for CSV parsing)
- shadcn/ui components

### Before Adding New Dependencies

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

- ~~No database (Google Sheets as backend is intentional)~~ Now using Supabase
- No user auth (not needed for all features)
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

## Next Step

Now read `TESTING_PROTOCOL.md` to learn how to verify your work.
