# CLAUDE.MD - AI Assistant Guide for HD Penny Guide

## 🎯 First Priority: Read AGENT_RULES.md

**IMPORTANT**: `/AGENT_RULES.md` is the authoritative operating guide. Read it at the start of every session and follow it for all actions. Keep it open/pinned during work.

This file (CLAUDE.md) provides technical context. AGENT_RULES.md provides operational principles.

---

## Project Overview

**Name**: HD Penny Guide (Home Depot One Cent Items Guide)
**Purpose**: Educational platform teaching 32,000+ community members how to find clearance items marked to $0.01 at Home Depot stores
**Status**: Active Next.js 15 rebuild (replaced broken static site archived in `main-old-static` branch)
**Target Audience**: 30-50 year old savvy shoppers, clearance hunters
**Design Philosophy**: Calm, reference-style content (Wirecutter/Wikipedia/MDN-inspired), no hype or gamification in main UI, single-column layout with generous whitespace

---

## Technology Stack

### Core Framework
- **Next.js 15.0.3** with App Router (NOT Pages Router)
- **React 18.3.1** (Server and Client components)
- **TypeScript 5.6.3** (Strict mode enabled)
- **Node.js** >=18.17.0 required

### Styling & Design System
- **Tailwind CSS 3.4.14** with custom HSL color system
- **shadcn/ui** - Accessible components (code is owned, not a dependency)
- **Framer Motion 11.11.11** - Animations
- **next-themes 0.4.6** - Dark/light mode
- **lucide-react 0.454.0** - Icons

### Typography
- **Headings**: Inter (system font)
- **Body**: Georgia serif (system font)
- **Code**: JetBrains Mono (system font)
- **Primary Color**: Home Depot Orange `#EA5B0C` (DO NOT CHANGE - it's brand-specific)

### Form & Validation
- **react-hook-form 7.53.2** - Form state
- **zod 3.23.8** - Schema validation
- **@hookform/resolvers 3.9.1** - Validation integration

### Interactive Features
- **cmdk 1.1.1** - Command palette (Cmd+K navigation)
- **recharts 3.4.1** - Charts
- **leaflet 1.9.4** + **react-leaflet 4.2.1** - Maps
- **sonner 2.0.7** - Toast notifications

### Testing
- **Playwright 1.56.1** - E2E testing (Chromium, Firefox, WebKit)
- Test server: `http://localhost:3001`

---

## Project Structure

```
/app/                           # Next.js App Router pages
  layout.tsx                    # Root layout (theme, metadata, providers)
  page.tsx                      # Homepage with hero + TOC
  globals.css                   # CSS variables, Tailwind layers
  what-are-pennies/page.tsx     # Core concept explanation
  clearance-lifecycle/page.tsx  # Markdown progression patterns
  digital-pre-hunt/page.tsx     # App-based scouting
  in-store-strategy/page.tsx    # Physical store tactics
  checkout-strategy/page.tsx    # Purchase process
  internal-systems/page.tsx     # HD internal operations
  facts-vs-myths/page.tsx       # Common misconceptions
  responsible-hunting/page.tsx  # Community ethics
  faq/page.tsx                  # FAQ
  about/page.tsx                # About page
  resources/page.tsx            # Additional resources
  recent-finds/page.tsx         # Community finds feed
  store-finder/page.tsx         # Interactive store locator
  trip-tracker/page.tsx         # Store visit tracker
  /sections/                    # Page section components
    Hero.tsx
    ContentSections.tsx

/components/                    # Reusable React components
  navbar.tsx                    # Fixed header with mobile menu
  footer.tsx                    # Site footer
  breadcrumb.tsx                # Breadcrumb navigation
  command-palette.tsx           # Cmd+K quick nav (14 pages indexed)
  command-palette-provider.tsx  # Context provider
  quick-actions-button.tsx      # Floating action button
  table-of-contents.tsx         # Sticky TOC sidebar
  theme-toggle.tsx              # Dark/light mode switcher
  theme-provider.tsx            # Theme context
  store-map.tsx                 # Leaflet map component
  store-comparison-table.tsx    # Store data table
  recent-finds-feed.tsx         # Recent finds display
  clearance-lifecycle-chart.tsx # Visual cadence chart
  /ui/                          # shadcn/ui components
    button.tsx
    card.tsx
    input.tsx
    textarea.tsx
    skeleton.tsx
    toaster.tsx
    ... (owned component code)

/lib/                           # Utility functions
  utils.ts                      # cn() helper (clsx + tailwind-merge)
  validations.ts                # Zod schemas
  firebase.ts                   # Firebase config (if needed)

/data/                          # Content data (JSON)
  clearance-cadence-data.json   # Cadence A/B progressions
  clearance-cadences.json       # Simplified cadence data
  faq-entries.json              # FAQ Q&A
  recent-finds.json             # Community finds (placeholder)

/public/                        # Static assets
  Home-Depot-Penny-Guide.pdf    # Downloadable guide (259 KB)
  /fonts/                       # Font files (empty, using system fonts)

/tests/                         # Playwright E2E tests
  basic.spec.ts                 # Basic homepage test

/docs/                          # Documentation
  AGENTS.md                     # AI collaborator guide
  DECISIONS.md                  # Architecture decision log
  COOKBOOK.md                   # Common task recipes

/*.md files                     # Feature documentation
  AGENT_RULES.md                # 🔴 AUTHORITATIVE - Read first!
  README.md                     # Human-readable overview
  LEARNING_PLATFORM_README.md   # Learning system docs
  INTERACTIVE-FEATURES-README.md
  DOCS-PLATFORM-README.md
  SEO-ANALYTICS-PACKAGE-README.md
  PLACEHOLDERS.md               # Assets to fill
  content-checklist.md          # Quality checklist
  template-usage.md             # Page creation guide
  style-guide.md                # Writing/design style
  seo-guide.md                  # SEO implementation
  favicon-guide.md              # Favicon generation
  performance-checklist.md      # Performance optimization
  integration-guide.md          # Feature integration

/*.json files                   # Configuration & data
  navigation-structure.json     # Site nav (16 KB)
  internal-links.json           # Internal linking map (24 KB)
  CONTEXT.json                  # Project metadata

Config files:
  next.config.js                # Next.js config
  tsconfig.json                 # TypeScript config
  tailwind.config.ts            # Tailwind config
  playwright.config.ts          # Test config
  .eslintrc.json                # Linting rules
  postcss.config.js             # PostCSS config
  components.json               # shadcn/ui config
```

---

## Development Workflows

### Starting Development
```bash
npm run dev        # Start dev server on http://localhost:3000
```

### Building & Deploying
```bash
npm run build      # Production build
npm run start      # Start production server
npm run export     # Static export (build + export)
npm run lint       # ESLint check
```

### Testing
```bash
npm run test:e2e   # Run Playwright tests
```

### Git Workflow
- **Main branch**: Production-ready code
- **Feature branches**: Named `feature/description` or `fix/description`
- **Commit messages**: Clear, descriptive, present tense
- Always run `npm run lint` before committing

---

## Key Conventions & Patterns

### File Naming
- **Pages**: `page.tsx` in App Router directories
- **Components**: PascalCase (e.g., `CommandPalette.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Data files**: kebab-case (e.g., `clearance-cadence-data.json`)

### TypeScript Patterns
- **Always use TypeScript** - Type safety for non-expert maintainers
- **Strict mode enabled** - No implicit any
- **Proper typing** - Define interfaces/types for props and data
- **Path alias**: Use `@/` for imports from project root

### Component Patterns
- **Server Components by default** - Only add `"use client"` when needed
- **Client directives needed for**:
  - useState, useEffect, other React hooks
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Context providers/consumers
  - Third-party libraries requiring client (Framer Motion, Leaflet, etc.)
- **Component structure**:
  ```typescript
  "use client" // Only if needed

  import { ComponentProps } from "react"
  import { cn } from "@/lib/utils"

  interface MyComponentProps {
    title: string
    className?: string
  }

  export function MyComponent({ title, className }: MyComponentProps) {
    return (
      <div className={cn("base-classes", className)}>
        {title}
      </div>
    )
  }
  ```

### Styling Patterns
- **Tailwind utilities first** - Use utility classes for styling
- **Custom classes sparingly** - Only when utilities aren't enough
- **Use cn() helper** - For conditional and merged classes
- **CSS variables** - Defined in `app/globals.css`, use HSL format
- **Dark mode** - Use `dark:` prefix for dark mode variants
- **Responsive** - Mobile-first, use `sm:`, `md:`, `lg:`, `xl:` breakpoints

### Data Fetching
- **Server Components** - Fetch data directly in components
- **Client Components** - Use useState/useEffect or SWR/React Query
- **Static data** - Import JSON from `/data/` directory
- **No external APIs yet** - All data is local/static for now

### Navigation
- **Use next/link** - For internal navigation
- **Prefetching enabled** - Next.js prefetches visible links
- **Command Palette** - 14 pages indexed for Cmd+K navigation
- **Breadcrumbs** - Auto-generated from route structure

---

## Common Tasks & How to Accomplish Them

### Adding a New Page
1. Create directory in `/app/` (e.g., `/app/new-page/`)
2. Add `page.tsx` with proper metadata:
   ```typescript
   import type { Metadata } from "next"

   export const metadata: Metadata = {
     title: "Page Title | HD Penny Guide",
     description: "Page description",
   }

   export default function NewPage() {
     return (
       <div className="container mx-auto px-4 py-8">
         <h1>Page Content</h1>
       </div>
     )
   }
   ```
3. Update navigation in `components/navbar.tsx`
4. Add to command palette in `components/command-palette.tsx`
5. Update `navigation-structure.json` for sitemap

### Adding a New Component
1. Create in `/components/[name].tsx` (or `/components/ui/` for UI primitives)
2. Use TypeScript with proper interfaces
3. Export as named export: `export function ComponentName() {}`
4. Import using path alias: `import { ComponentName } from "@/components/name"`

### Updating Styles
1. **CSS variables**: Edit `app/globals.css` (HSL format)
2. **Tailwind config**: Edit `tailwind.config.ts` for theme extensions
3. **Component styles**: Use Tailwind utilities in className
4. **Global styles**: Add to globals.css only if absolutely necessary

### Adding Data
1. Create JSON file in `/data/` directory
2. Define TypeScript interface for data structure
3. Import and use in components:
   ```typescript
   import data from "@/data/my-data.json"
   ```

### Working with Forms
1. Use `react-hook-form` for form state
2. Define Zod schema in `lib/validations.ts`
3. Use `@hookform/resolvers` to connect validation
4. Use shadcn/ui form components from `/components/ui/`

### Adding Interactive Features
1. Mark component with `"use client"`
2. Use appropriate state management (useState, useReducer, context)
3. Add proper TypeScript types
4. Consider accessibility (ARIA labels, keyboard navigation)
5. Test on mobile devices

---

## Testing Guidelines

### Current Test Coverage
- Basic homepage title test in `tests/basic.spec.ts`
- Test server runs on `http://localhost:3001`

### Writing New Tests
1. Create `*.spec.ts` files in `/tests/` directory
2. Use Playwright API for E2E testing
3. Test critical user flows (navigation, forms, interactions)
4. Test responsive behavior (mobile, tablet, desktop)
5. Run `npm run test:e2e` before committing

### What to Test
- Page loads and rendering
- Navigation flows
- Form submissions
- Interactive components (command palette, maps, etc.)
- Mobile responsiveness
- Dark/light mode switching
- Accessibility (keyboard navigation, screen readers)

---

## Known Issues & Limitations

### Current Issues
- Some legacy pages have unescaped quotes (lint warnings)
- Image/SVG placeholders need replacement (see `PLACEHOLDERS.md`)
- Dev server runs on port 3001 (conflict on 3000)

### Not Yet Integrated
- **Learning Platform** (1300 lines) - Complete but standalone
- **Quiz System** (30+ questions) - Complete but standalone
- **Advanced Search** - Standalone (current app uses cmdk)
- **Analytics** - Reference files exist, not implemented
- **Cookie Consent** - Reference files exist, not implemented

### Future Work
1. Integrate learning platform into Next.js app
2. Integrate quiz system
3. Replace placeholder assets with real images/SVGs
4. Implement SEO meta tags and structured data
5. Add analytics tracking (privacy-friendly)
6. Deploy to Vercel
7. Configure custom domain

---

## What to Avoid

### Code Practices
- ❌ Don't use Pages Router patterns (this is App Router)
- ❌ Don't add `"use client"` unnecessarily
- ❌ Don't use any/unknown types (use proper typing)
- ❌ Don't bypass TypeScript strict mode
- ❌ Don't create files without reading existing patterns first
- ❌ Don't commit without running `npm run lint`
- ❌ Don't use CSS-in-JS (use Tailwind utilities)
- ❌ Don't add new dependencies without checking existing ones

### Content & Design
- ❌ Don't change Home Depot orange (#EA5B0C)
- ❌ Don't add testimonials, urgency, or sales language
- ❌ Don't add gamification to main UI (it's calm reference style)
- ❌ Don't use hype or marketing copy
- ❌ Don't add multi-column layouts (single column design)
- ❌ Don't reduce whitespace (generous spacing is intentional)
- ❌ Don't add unnecessary animations or transitions

### Documentation
- ❌ Don't create new documentation files (limit to canonical 4: AGENTS.md, DECISIONS.md, COOKBOOK.md, README.md)
- ❌ Don't duplicate information across files
- ❌ Don't write technical documentation for users (keep it reference-style)

### Security
- ❌ Don't introduce command injection vulnerabilities
- ❌ Don't add XSS vulnerabilities (sanitize user input)
- ❌ Don't commit secrets or API keys
- ❌ Don't skip security best practices

---

## AI Agent Operating Principles

From `AGENT_RULES.md` (authoritative):

### Who Cade Is
- Non-technical user who speaks in plain goals
- Does not read, write, or debug code
- You translate business goals to technical work

### Your Role
- Engineer, architect, debugger, tester, planner
- Infer missing details from repo
- Choose safe defaults when unsure
- Don't stall on technical questions

### Priorities (in order)
1. **Project builds and runs without errors**
2. **Main pages render correctly on desktop and mobile**
3. **UX feels clean, consistent, and intentional**
4. **Deploy works and stays stable**
5. **Refactors, cleanup, nice-to-haves come after 1-4**

### How to Work
1. Read `AGENT_RULES.md` at start of each session
2. Pin it open in editor
3. Make changes directly
4. Explain in 2-5 plain English lines
5. Ask only business questions, never technical ones
6. If blocked, propose 2 options, pick one, proceed

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Static export

# Quality
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright tests

# Git
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to remote
```

---

## Additional Resources

### Documentation Files
- `/AGENT_RULES.md` - 🔴 **Read first!**
- `/docs/AGENTS.md` - AI collaborator guide
- `/docs/DECISIONS.md` - Architecture decisions
- `/docs/COOKBOOK.md` - Common patterns
- `/style-guide.md` - Writing and design style
- `/content-checklist.md` - Quality checklist

### Reference Files
- `/navigation-structure.json` - Site structure
- `/internal-links.json` - Internal linking map
- `/CONTEXT.json` - Project metadata
- `/PLACEHOLDERS.md` - Assets to replace

### Configuration Files
- `/next.config.js` - Next.js settings
- `/tailwind.config.ts` - Design system
- `/tsconfig.json` - TypeScript settings
- `/playwright.config.ts` - Test settings

---

## Summary

This is a modern, well-structured Next.js 15 project with:
- ✅ TypeScript strict mode for safety
- ✅ Tailwind CSS for fast styling
- ✅ shadcn/ui for accessible components
- ✅ App Router for modern patterns
- ✅ Comprehensive documentation
- ✅ Clear conventions and patterns
- ✅ Testing setup (needs expansion)
- ⚠️ Some features need integration (learning, quizzes)
- ⚠️ Asset placeholders need filling

**Start every session by reading `/AGENT_RULES.md` and following its principles. When in doubt, choose safe defaults and proceed. This project is designed for maintainability by non-experts, so prioritize clarity, consistency, and simplicity over cleverness.**

---

**Last Updated**: 2025-11-20 (Auto-generated from codebase analysis)
