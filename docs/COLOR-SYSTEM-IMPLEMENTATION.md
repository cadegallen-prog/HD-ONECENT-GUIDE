# Color System Implementation Guide – Technical Deep Dive

**For:** Developers building components and pages
**Status:** Production-Ready | 0 Violations | AAA Compliant
**Updated:** December 16, 2025

> **TL;DR:** Use `bg-[var(--bg-page)]` not `bg-blue-500`. One variable changes = updates everywhere.

---

## 1. The Problem We Solved

### Before (Generic Tailwind Colors)
```tsx
// ❌ WRONG - Hard to change, inconsistent, looks cheap
<div className="bg-blue-500 text-gray-900 border border-gray-200">
  <p className="text-sm text-gray-600">Subtitle</p>
</div>

// Problems:
// 1. Colors are scattered across many files (find & replace nightmare)
// 2. Light/dark mode not properly handled
// 3. Contrast varies wildly (might not meet WCAG)
// 4. When designer says "make blue darker", you edit 50+ files
```

### After (CSS Variables + Tailwind)
```tsx
// ✅ CORRECT - Change palette once, updates everywhere
<div className="bg-[var(--bg-page)] text-[var(--text-primary)] border border-[var(--border-default)]">
  <p className="text-sm text-[var(--text-muted)]">Subtitle</p>
</div>

// Benefits:
// 1. Single point of control: /app/globals.css
// 2. Light/dark mode automatic (CSS handles it)
// 3. All colors WCAG AAA compliant (verified)
// 4. Change palette: edit globals.css, done in 5 minutes
```

---

## 2. Architecture: CSS Variables + Tailwind

### How It Works (The Flow)

```
globals.css (CSS variables)
    ↓
tailwind.config.ts (Expose to Tailwind)
    ↓
Component TSX (Use via arbitrary value syntax)
    ↓
Enforcement Script (Validates no raw colors)
    ↓
Browser (Switches automatically on .dark class)
```

### File Structure

```
/app
  ├── globals.css              ← 267 lines of CSS variables
  │   ├── :root {}             ← Light mode (lines 6-145)
  │   └── .dark {}             ← Dark mode (lines 147-267)

/tailwind.config.ts            ← 92 lines of Tailwind config
  └── colors: { ... }          ← Maps variables to Tailwind

/scripts
  └── lint-colors.ts           ← Validates compliance

/checks
  └── lint-colors.baseline.json ← Current baseline (0 warnings)
```

---

## 3. Using Colors in Your Components

### Syntax 1: Arbitrary CSS Variables (Most Common)

```tsx
// Pattern: bg-[var(--css-variable-name)]

// Backgrounds
<div className="bg-[var(--bg-page)]">...</div>
<div className="bg-[var(--bg-elevated)]">...</div>
<div className="bg-[var(--bg-recessed)]">...</div>

// Text
<p className="text-[var(--text-primary)]">Main text</p>
<p className="text-[var(--text-secondary)]">Secondary</p>
<p className="text-[var(--text-muted)]">Muted</p>

// Borders
<div className="border border-[var(--border-default)]">...</div>
<div className="border border-[var(--border-strong)]">...</div>

// CTA (interactive)
<button className="bg-[var(--cta-primary)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)]">
  Click me
</button>

// Status colors
<div className="text-[var(--status-success)]">✓ Success</div>
<div className="text-[var(--status-warning)]">⚠ Warning</div>
<div className="text-[var(--status-error)]">✗ Error</div>
```

**Why this syntax?** Tailwind's arbitrary value system allows us to use CSS variables without pre-compiling a color map. Future palette changes don't require Tailwind config updates.

### Syntax 2: Semantic Tailwind Classes (shadcn/ui)

```tsx
// shadcn/ui provides semantic classes based on CSS variables

<Card className="bg-card border border-border">
  <CardContent>
    <p className="text-foreground">Primary text</p>
    <p className="text-muted-foreground">Secondary text</p>
  </CardContent>
</Card>

<Button className="bg-primary text-primary-foreground">Action</Button>

<div className="bg-secondary text-secondary-foreground">Secondary area</div>
```

**Mapping (in tailwind.config.ts):**
```typescript
background: "var(--background)",     // --bg-page
foreground: "var(--foreground)",     // --text-primary
primary: "var(--primary)",           // --cta-primary
primary-foreground: "var(--primary-foreground)",  // white
secondary: "var(--secondary)",       // --bg-recessed
```

### Syntax 3: Design System Names (Direct Tailwind)

```tsx
// For design system tokens mapped directly to Tailwind

// CTA colors
<button className="bg-cta-primary text-cta-text hover:bg-cta-hover">
  Action
</button>

// Brand colors
<div className="text-brand-copper">Brand accent</div>

// Status
<span className="text-status-success">Success</span>

// Configured in tailwind.config.ts:
colors: {
  cta: {
    primary: "var(--cta-primary)",
    hover: "var(--cta-hover)",
    text: "var(--cta-text)",
  },
  brand: {
    copper: "var(--brand-copper)",
  },
  status: {
    success: "var(--status-success)",
  },
}
```

### Syntax 4: Component Helper Classes (globals.css)

```tsx
// Pre-built component classes for common patterns

<div className="pill pill-success">Active status</div>
<div className="badge-penny">Penny item</div>
<div className="callout callout-sky">Info callout</div>

// Defined in globals.css as @layer components
.pill {
  @apply inline-flex items-center gap-1.5 rounded-full text-xs font-semibold;
  padding: 0.5rem 0.75rem;
  background-color: var(--chip-surface);
  color: var(--text-secondary);
  border: 1px solid var(--chip-border);
}

.pill-success {
  background-color: var(--chip-success-surface);
  color: var(--status-success);
  border-color: var(--chip-success-border);
}
```

---

## 4. Common Patterns & Copy-Paste Examples

### Pattern 1: Card with Hover Effect

```tsx
<div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 transition-all hover:border-[var(--border-strong)] hover:shadow-lg cursor-pointer">
  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
    Card Title
  </h3>
  <p className="text-[var(--text-secondary)]">
    Card description goes here
  </p>
</div>
```

### Pattern 2: Button Group (Primary + Secondary)

```tsx
<div className="flex gap-3">
  {/* Primary CTA */}
  <button className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:bg-[var(--cta-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]">
    Primary Action
  </button>

  {/* Secondary */}
  <button className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-primary)] font-medium hover:border-[var(--border-strong)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]">
    Secondary Action
  </button>
</div>
```

### Pattern 3: Status Alert (Success/Warning/Error)

```tsx
{/* Success Alert */}
<div className="rounded-lg border border-l-4 border-l-[var(--status-success)] bg-[var(--bg-elevated)] p-4 flex gap-3">
  <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] flex-shrink-0" />
  <div className="text-sm text-[var(--text-secondary)]">
    <p className="font-semibold mb-1">Success!</p>
    <p>Your action completed successfully.</p>
  </div>
</div>

{/* Warning Alert */}
<div className="rounded-lg border border-l-4 border-l-[var(--status-warning)] bg-[var(--bg-elevated)] p-4 flex gap-3">
  <AlertTriangle className="w-5 h-5 text-[var(--status-warning)] flex-shrink-0" />
  <div className="text-sm text-[var(--text-secondary)]">
    <p className="font-semibold mb-1">Warning</p>
    <p>Please review this before proceeding.</p>
  </div>
</div>

{/* Error Alert */}
<div className="rounded-lg border border-l-4 border-l-[var(--status-error)] bg-[var(--bg-elevated)] p-4 flex gap-3">
  <AlertCircle className="w-5 h-5 text-[var(--status-error)] flex-shrink-0" />
  <div className="text-sm text-[var(--text-secondary)]">
    <p className="font-semibold mb-1">Error</p>
    <p>Something went wrong. Please try again.</p>
  </div>
</div>
```

### Pattern 4: Form Input

```tsx
<div>
  <label htmlFor="input" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
    Input Label
  </label>
  <input
    id="input"
    type="text"
    placeholder="Enter value..."
    className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder-[var(--text-placeholder)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-colors"
  />
  <p className="mt-1 text-xs text-[var(--text-muted)]">Helper text goes here</p>
</div>
```

### Pattern 5: Chip/Badge System

```tsx
{/* Accent chip */}
<span className="pill pill-accent">Featured</span>

{/* Success chip */}
<span className="pill pill-success">Active</span>

{/* Muted chip */}
<span className="pill pill-muted">Archived</span>

{/* Info chip */}
<span className="pill pill-info">Info</span>
```

### Pattern 6: Responsive Text Hierarchy

```tsx
<section>
  {/* H1 - Page title */}
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
    Page Title
  </h1>

  {/* H2 - Section heading */}
  <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border-default)]">
    Section Heading
  </h2>

  {/* H3 - Subsection */}
  <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-2">
    Subsection
  </h3>

  {/* Body text */}
  <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-4">
    Body text goes here. This is the main content that users read.
  </p>

  {/* Secondary text */}
  <p className="text-sm text-[var(--text-muted)]">
    This is secondary information like metadata or timestamps.
  </p>
</section>
```

---

## 5. Enforcing Compliance (The Linter)

### Running the Color Linter

```bash
# Check if all colors comply with design system
npm run lint:colors

# Output:
# 🎨 PennyCentral Color Linter
# ════════════════════════════════════════
# Scanning 60 files...
# ════════════════════════════════════════
# Errors: 0 | Warnings: 0
# ✅ All colors comply with design system!
```

### What the Linter Does

**Forbidden (Errors):**
- ❌ `bg-orange-500`, `text-pink-400` - Off-brand colors
- ❌ `bg-teal-600`, `text-cyan-700` - Conflicting palette
- ❌ Arbitrary hex colors: `bg-[#e0e0e0]` - Non-system colors

**Suspicious (Warnings):**
- ⚠️ `bg-gray-500`, `text-slate-900` - Should use stone palette or CSS variables
- ⚠️ `bg-blue-*`, `text-blue-*` - Should use CTA blue or CSS variables

**Allowed (Safe):**
- ✅ `bg-[var(--bg-page)]` - CSS variables
- ✅ `text-white`, `bg-transparent` - Core utilities
- ✅ `text-muted-foreground`, `bg-card` - Semantic classes
- ✅ `bg-stone-*`, `text-stone-*` - Stone palette (neutral safe)

### Baseline Management

```bash
# Current baseline (0 warnings)
cat checks/lint-colors.baseline.json
# {
#   "errors": 0,
#   "warnings": 0
# }

# After intentional palette changes, update baseline:
npm run lint:colors:update-baseline

# This locks the new state so CI doesn't fail on future runs
```

---

## 6. Light/Dark Mode: How It Works

### Automatic Switching (No Code Needed)

```css
/* globals.css - The CSS Variables System */

:root {
  --bg-page: #ffffff;        /* Light mode */
  --text-primary: #1c1917;
}

.dark {
  --bg-page: #121212;        /* Dark mode */
  --text-primary: #dcdcdc;
}
```

**How components automatically switch:**

```tsx
// Same component code, different output
<div className="bg-[var(--bg-page)] text-[var(--text-primary)]">
  {/* Light mode: white bg with dark text */}
  {/* Dark mode: #121212 bg with light text */}
  {/* No if statements needed! CSS handles it. */}
</div>
```

### Testing Both Modes

```bash
# Playwright automatically tests both light and dark
npm run test:e2e

# Tests run for:
# - Light mode (default)
# - Dark mode (.dark class applied)
# - Mobile viewport
# - Desktop viewport

# Screenshots saved in: reports/playwright/
```

---

## 7. Adding New Color (Step by Step)

### When to Add New Colors

✅ **OKAY TO ADD:**
- Premium/VIP tier badge needs distinct color
- New page type needs unique accent
- Status level we haven't represented (e.g., pending)

❌ **DON'T ADD IF:**
- Existing color works for the purpose
- Just using it in 1 component
- Designer preference without user need

### The 5-Step Process

#### Step 1: Propose

```markdown
**New Color Request: Premium Tier Badge**

**Why:** Distinguish premium items from standard items

**Proposed Name:** `--tier-premium`
**Light Mode:** #7c3aed (purple 600)
**Dark Mode:** #a78bfa (purple 400)

**Usage:**
- Premium badge on cards
- Premium section header
- 2 components affected
```

#### Step 2: Verify Contrast

```bash
# Light mode: purple #7c3aed on white #ffffff
# Contrast: 5.8:1 ✅ Meets AA (4.5:1 needed)

# Dark mode: purple #a78bfa on dark #121212
# Contrast: 5.1:1 ✅ Meets AAA (4.5:1 needed)

# Dark mode: purple #a78bfa on card #1a1a1a
# Contrast: 4.9:1 ✅ Meets AAA

# ✅ APPROVED for production
```

#### Step 3: Add to globals.css

```css
/* In both :root and .dark sections */

:root {
  /* ... existing colors ... */

  /* NEW: Premium tier indicator */
  --tier-premium: #7c3aed;    /* Purple 600 */
  --tier-premium-light: #ede9fe;  /* Purple 100 for backgrounds */
}

.dark {
  /* ... existing colors ... */

  /* NEW: Premium tier indicator */
  --tier-premium: #a78bfa;     /* Purple 400 */
  --tier-premium-light: #5b21b6;  /* Purple 800 for backgrounds */
}
```

#### Step 4: Add to tailwind.config.ts

```typescript
colors: {
  // ... existing ...

  tier: {
    premium: "var(--tier-premium)",
    "premium-light": "var(--tier-premium-light)",
  },
}
```

#### Step 5: Update Component

```tsx
// Use the new color
<div className="px-3 py-1 rounded-full bg-[var(--tier-premium-light)] text-[var(--tier-premium)] text-xs font-semibold">
  Premium
</div>
```

#### Step 6: Verify

```bash
npm run lint:colors           # Must pass
npm run build                 # Must succeed
npm run test:e2e             # 36/36 tests passing
npm run check-contrast       # All routes AAA compliant

# If all pass:
npm run lint:colors:update-baseline  # Lock the baseline
```

---

## 8. Troubleshooting Common Issues

### Issue: Button text is invisible in dark mode

**Symptoms:** Button looks fine in light mode, text disappears in dark mode

**Root Cause:** Using `text-white` instead of `--cta-text` variable

**Fix:**
```tsx
// ❌ WRONG
<button className="bg-[var(--cta-primary)] text-white">
  Click me
</button>

// ✅ CORRECT
<button className="bg-[var(--cta-primary)] text-[var(--cta-text)]">
  Click me
</button>
```

### Issue: Border is too faint to see

**Symptoms:** Card borders barely visible

**Root Cause:** Using `--border-default` on low-contrast background

**Fix:**
```tsx
// ❌ On dark background, might be too faint
<div className="border border-[var(--border-default)] bg-[var(--bg-page)]">

// ✅ Use stronger border or different background
<div className="border border-[var(--border-strong)] bg-[var(--bg-elevated)]">
```

### Issue: Lint fails with color warnings

**Symptoms:** `npm run lint:colors` shows warnings

**Root Cause:** Used raw Tailwind color or arbitrary hex

**Fix:**
```tsx
// ❌ Causes warning
<div className="text-gray-500">Wrong</div>
<div className="bg-[#e0e0e0]">Wrong</div>

// ✅ Use CSS variable
<div className="text-[var(--text-secondary)]">Correct</div>
<div className="bg-[var(--bg-recessed)]">Correct</div>
```

### Issue: Component looks different on page vs Storybook

**Symptoms:** Colors fine in browser, different in screenshots

**Root Cause:** Storybook might not have `.dark` class selector

**Fix:** Ensure Storybook has access to globals.css and prefers-dark settings

---

## 9. Quality Gate: Full Checklist

Before committing color-related changes:

```bash
# 1. Lint colors (must pass)
npm run lint:colors
# Output: Errors: 0 | Warnings: 0 ✅

# 2. Build succeeds (must pass)
npm run build
# Output: Routes created (no errors)

# 3. Linting passes (must pass)
npm run lint
# Output: 0 errors

# 4. Unit tests pass (must pass)
npm run test:unit
# Output: all tests passing

# 5. E2E tests pass (must pass - both light/dark)
npm run test:e2e
# Output: 36/36 tests passing

# 6. Contrast verified (must pass - AAA)
npm run check-contrast
# Output: All routes pass AAA compliance

# All gates must pass before merge
```

---

## 10. Git Workflow for Color Changes

### Making Color Changes

```bash
# 1. Create feature branch
git checkout -b feat/refine-color-palette

# 2. Make changes to globals.css and/or tailwind.config.ts
# (Edit colors in /app/globals.css)

# 3. Run linter
npm run lint:colors
# If warnings: fix them or propose new colors

# 4. Test
npm run build && npm run test:e2e && npm run check-contrast

# 5. Commit (use descriptive message)
git add app/globals.css tailwind.config.ts
git commit -m "refine(colors): increase CTA primary contrast from 8.1:1 to 8.6:1"

# 6. Push
git push origin feat/refine-color-palette

# 7. Create PR with before/after screenshots
```

### Commit Message Convention

```
refine(colors): [what changed]
Increased CTA primary contrast for better visibility.

Light: #1d4ed8 (was #1e40af)
Contrast: 8.6:1 (was 8.1:1)

Verified: ✅ lint-colors ✅ build ✅ e2e ✅ contrast
```

---

## 11. Reference Card (Quick Lookup)

| Need | Use | Example |
|------|-----|---------|
| Page background | `--bg-page` | `bg-[var(--bg-page)]` |
| Card surface | `--bg-elevated` | `bg-[var(--bg-elevated)]` |
| Form field | `--bg-recessed` | `bg-[var(--bg-recessed)]` |
| Main text | `--text-primary` | `text-[var(--text-primary)]` |
| Secondary text | `--text-secondary` | `text-[var(--text-secondary)]` |
| Muted text | `--text-muted` | `text-[var(--text-muted)]` |
| Primary CTA | `--cta-primary` | `bg-[var(--cta-primary)]` |
| CTA text | `--cta-text` | `text-[var(--cta-text)]` |
| Success | `--status-success` | `text-[var(--status-success)]` |
| Warning | `--status-warning` | `text-[var(--status-warning)]` |
| Error | `--status-error` | `text-[var(--status-error)]` |
| Border | `--border-default` | `border-[var(--border-default)]` |
| Badge pill | `pill pill-success` | `<span className="pill pill-success">` |

---

## 12. Advanced: How Tailwind Resolves Variables

### The Arbitrary Value System

```tsx
// Tailwind sees this:
className="bg-[var(--bg-page)]"

// It generates:
.bg-\[var\(--bg-page\)\] {
  background-color: var(--bg-page);
}

// Browser receives:
// (in light mode) background-color: #ffffff
// (in dark mode) background-color: #121212

// This happens automatically! No config needed.
```

### Why Not Pre-Compile Colors?

```typescript
// ❌ WRONG - Pre-compiling into Tailwind config
colors: {
  "light-page": "#ffffff",
  "dark-page": "#121212",
}
// Problem: Need to list every light/dark variant,
// updating Tailwind config on every palette change

// ✅ RIGHT - Using CSS variables
colors: {
  // Empty or use for shadcn/ui only
}
// Benefit: Change palette in one place (globals.css),
// all components update automatically
```

---

## Summary

1. **Use CSS Variables:** `bg-[var(--bg-page)]` not `bg-white`
2. **Semantic Naming:** Token names describe function, not appearance
3. **Single Control Point:** `/app/globals.css` (light + dark mode)
4. **Automatic Light/Dark:** Browser CSS applies correct mode
5. **Enforce via Linter:** `npm run lint:colors` validates daily
6. **Quality Gates:** All 6 checks must pass before merge

**Result:** Color changes take 5 minutes, affect entire site, maintain perfect accessibility.

---

**Questions?** See `docs/DESIGN-SYSTEM-AAA.md` for detailed color theory and usage guidelines.
