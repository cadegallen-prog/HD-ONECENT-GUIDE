# AGENTS.md — Penny Central

Read this file at the start of every session. This is the single source of truth.

---

## What This Project Is

Penny Central is a **utility/reference guide** for finding Home Depot clearance items marked to $0.01. It serves a 36,000+ member Facebook community.

**Site type:** Practical field guide with utility tools (Store Finder, Trip Tracker)
**Not:** A blog, forum, marketplace, SaaS, or gamified learning platform

**Live site:** https://pennycentral.com

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Fonts:** Inter (headings + body)
- **Hosting:** Vercel

---

## Design System — Crisp Arctic Indigo

Use ONLY these colors. No exceptions.

### Light Mode

| Role | Hex | Tailwind |
|------|-----|----------|
| Page background | `#FAFAFA` | `bg-[#FAFAFA]` |
| Card surface | `#FFFFFF` | `bg-white` |
| Primary text | `#0F172A` | `text-slate-900` |
| Secondary text | `#334155` | `text-slate-700` |
| Muted text | `#64748B` | `text-slate-500` |
| Borders | `#E2E8F0` | `border-slate-200` |
| Accent | `#6366F1` | `bg-indigo-500` |
| Accent hover | `#4F46E5` | `bg-indigo-600` |
| Accent subtle | `#E0E7FF` | `bg-indigo-100` |

### Dark Mode

| Role | Hex | Tailwind |
|------|-----|----------|
| Page background | `#0F172A` | `bg-slate-900` |
| Card surface | `#1E293B` | `bg-slate-800` |
| Primary text | `#FAFAFA` | `text-slate-50` |
| Secondary text | `#94A3B8` | `text-slate-400` |
| Muted text | `#64748B` | `text-slate-500` |
| Borders | `#334155` | `border-slate-700` |
| Accent | `#818CF8` | `bg-indigo-400` |
| Accent hover | `#6366F1` | `bg-indigo-500` |
| Accent subtle | `rgba(79,70,229,0.2)` | `bg-indigo-500/20` |

### Accent Usage Rules

The accent color may ONLY appear on:
1. ONE primary button per page
2. Active navigation state
3. Links on hover
4. Focus rings

Maximum 3 accent elements visible per screen.

---

## Typography

- **Font:** Inter (weights 400, 500, 600)
- **Max heading size:** 22px
- **Body text:** 14-15px
- **No italics, no underlines (except links), no ALL CAPS (except badges)**

---

## Design Philosophy

**Three questions before adding anything:**
1. Does it look clean and professional?
2. Is it functional and readable?
3. Is it necessary?

**The vibe:**
- Light mode: Airy, clean, "Apple store at noon"
- Dark mode: Deep space with electric indigo sparks
- Switching modes feels like turning a light on/off in the same room

**Reference aesthetic:** Linear, Vercel Dashboard, Stripe Dashboard

---

## Forbidden Elements

Never add:
- Illustrations or decorative graphics
- Gradients (except subtle button gradients)
- Shadows (except subtle card elevation)
- Animations longer than 150ms
- Text larger than 22px
- Emoji in UI
- Colored card backgrounds
- Multiple accent colors
- Orange, amber, teal, cyan, pink, or purple
- Gamification (XP, levels, achievements, badges)
- Price tag icons or shopping illustrations

---

## Component Standards

### Buttons

**Primary (one per page max):**
```tsx
className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
```

**Secondary:**
```tsx
className="bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-lg font-medium"
```

### Cards

```tsx
className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
```

No shadows. No hover effects. No colored backgrounds.

### Navigation Active State

```tsx
className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
```

---

## File Structure

```
app/                    # Next.js App Router pages
  page.tsx              # Homepage (main guide)
  store-finder/
  trip-tracker/
  resources/
  about/
components/             # Shared UI components
  Navbar.tsx
  Footer.tsx
  etc.
public/                 # Static assets
tailwind.config.ts      # Tailwind configuration
```

---

## Working Rules

1. **Make changes directly.** Explain in 2-5 plain English lines.
2. **Infer missing details** from the codebase. Don't ask for file paths or imports.
3. **Choose safe defaults** when unsure. Don't stall.
4. **Preserve existing content** when making style changes.
5. **Test dark mode** after any color/style changes.
6. **Mobile-first.** Everything must work at 375px width.

---

## Current Priorities

1. Site builds and runs without errors
2. All pages render correctly on desktop and mobile
3. Dark/light mode toggle works and persists
4. UX feels clean, consistent, and intentional
5. Deploy works and stays stable

---

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run linter
```

---

## Don't Touch

- `package.json` (unless adding necessary dependencies)
- `.env*` files
- `next.config.*` (unless fixing routes)

---

## Support Integration

Footer on all pages includes:
- BeFrugal affiliate link (replace XXXXX with actual referral code)
- PayPal/CashApp donation link (replace XXXXX with actual handle)

These are tasteful, non-obtrusive, and provide value.

---

## End of File

This is the only agent instruction file. Delete any others you find (CLAUDE.md, AGENT_RULES.md, etc.)