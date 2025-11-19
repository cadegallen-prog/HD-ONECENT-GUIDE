# AI Assistant Quickstart Guide
**Project:** HD Penny Items Guide (Next.js)
**Last Updated:** 2025-11-19
**Read Time:** 90 seconds

> 🎯 **START HERE:** This file gets you productive in under 2 minutes.

---

## ⚡ 30-Second Context

**What is this?**
Educational website teaching people how to find "penny items" (clearance merchandise marked down to $0.01) at Home Depot.

**Tech Stack:**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Deployment:** Not yet deployed (development only)

**Current State:**
- ✅ Next.js foundation is set up and running
- ✅ Old static site backed up in `main-old-static` branch
- ⏳ Content conversion from old site in progress
- ⏳ Building out pages and components

---

## 📁 Project Structure (30 seconds)

```
hd-penny-nextjs/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (navbar, footer, theme)
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles + CSS variables
│   └── sections/          # Page sections (Hero, Features, etc.)
├── components/
│   ├── ui/                # shadcn/ui components (button, card, etc.)
│   ├── navbar.tsx         # Site navigation
│   ├── footer.tsx         # Site footer
│   ├── theme-provider.tsx # Dark mode context
│   └── theme-toggle.tsx   # Dark mode switcher
├── lib/
│   └── utils.ts           # Utility functions (cn helper for Tailwind)
├── public/                # Static assets
├── _backup-content/       # Old site content (HTML, markdown, PDF)
└── docs/                  # Extended documentation
```

---

## 🎯 Where Everything Lives

| Need to... | Look here |
|------------|-----------|
| Add a new page | `app/[page-name]/page.tsx` |
| Edit homepage | `app/page.tsx` |
| Modify navbar/footer | `components/navbar.tsx` or `components/footer.tsx` |
| Add a component | `components/` (or `components/ui/` for shadcn) |
| Change colors/theme | `app/globals.css` (CSS variables at top) |
| Access old content | `_backup-content/` (original static site files) |
| Utilities/helpers | `lib/utils.ts` |

---

## 🚀 Common Commands (Copy-Paste Ready)

```bash
# Start development server
cd /c/Users/cadeg/Projects/hd-penny-nextjs
npm run dev
# → Opens at http://localhost:3001

# Build for production
npm run build

# Check for TypeScript errors
npm run lint

# Install a new package
npm install [package-name]
```

---

## 🧠 Key Decisions & Context

### Why Next.js?
Replaced broken static site (39 HTML pages, 5000+ lines of broken JS) with professional framework. Gronk Pro Starter template used as foundation (kept in separate private repo).

### Why This Structure?
- **App Router:** Next.js 15 default, better than Pages Router
- **TypeScript:** Type safety prevents bugs
- **Tailwind + shadcn/ui:** Fast styling + accessible components
- **Component-based:** Reusable, maintainable code

### Content Source
Old site had good content but terrible implementation. We're porting:
- 11 core guide pages (what-are-pennies, clearance-lifecycle, etc.)
- Useful tools (calculators, quizzes, templates)
- Leaving behind: broken JS, redundant pages, "corny buttons"

---

## 📋 Current Priorities

**Phase 1: Foundation (DONE)**
- ✅ Next.js setup
- ✅ Template customization
- ✅ Old content backup
- ✅ Git repo swap (main branch now has Next.js)

**Phase 2: Content Conversion (IN PROGRESS)**
- [ ] Convert 11 core pages from HTML to Next.js
- [ ] Build reusable components (FAQ accordion, tables, etc.)
- [ ] Set up routing structure
- [ ] Preserve good features (search, dark mode)

**Phase 3: Features (NOT STARTED)**
- [ ] Working search functionality
- [ ] Quiz system
- [ ] Calculator tools
- [ ] Progress tracking

**Phase 4: Polish & Deploy (NOT STARTED)**
- [ ] SEO optimization
- [ ] Performance testing (Playwright)
- [ ] Deploy to Vercel
- [ ] Set up domain

---

## 🎨 Styling Approach

**Brand Color:** Home Depot Orange
```css
/* app/globals.css */
:root {
  --primary-hue: 10;  /* Orange hue for HD brand */
}
```

**Components:** shadcn/ui (accessible, customizable, no vendor lock-in)
**Layout:** Tailwind utility classes
**Theme:** Light/Dark mode via next-themes

---

## ⚠️ Important Gotchas

1. **Port:** Dev server runs on :3001 (not :3000) due to conflict
2. **Old Content:** Don't edit `_backup-content/` - it's reference only
3. **Git Branch:** `main` = Next.js, `main-old-static` = old site backup
4. **Template Source:** Gronk Pro Starter kept in separate private repo
5. **Non-Technical User:** Project owner isn't a coder - keep explanations clear

---

## 🔧 Tech Details

**Dependencies:**
- next: 15.0.3
- react: 18.3.1
- typescript: 5.6.3
- tailwindcss: 3.4.14
- framer-motion: 11.11.11 (animations)
- react-hook-form + zod: Form handling

**Node Version:** >=18.17.0

**Package Manager:** npm (not yarn/pnpm)

---

## 📚 Extended Documentation

For deeper dives:
- **README.md** - Human-friendly overview
- **CONTEXT.json** - Structured project metadata
- **PLAYBOOK.md** - User's personal guide
- **docs/COOKBOOK.md** - Task recipes with examples
- **docs/ARCHITECTURE.md** - Technical deep dive (if exists)

---

## 🎯 Quick Task Guide

### "I need to add a new page"
1. Create `app/[page-name]/page.tsx`
2. Export default React component
3. Test at `localhost:3001/[page-name]`

### "I need to modify the homepage"
Edit `app/page.tsx`

### "I need to change the site's colors"
Edit CSS variables in `app/globals.css` (line ~1-20)

### "I need to add a reusable component"
1. Create in `components/[name].tsx`
2. Import where needed: `import { Name } from '@/components/name'`

### "Old site had [feature], where is it?"
Check `_backup-content/` for reference, then rebuild properly in Next.js

---

## 💬 Communication Style

**User is non-technical** - explain things clearly:
- ✅ "Edit the homepage file" not "Modify app/page.tsx"
- ✅ Show exact commands to run
- ✅ Explain what will happen before doing it
- ✅ Use analogies when helpful

---

## 🔄 After Reading This

You should now understand:
- ✅ What this project is
- ✅ Where everything is located
- ✅ How to run it
- ✅ What's already done vs. what's next
- ✅ Key technical decisions

**Ready to help!** Ask "What should we work on?" or check PLAYBOOK.md for user's current goals.

---

**Last Updated:** 2025-11-19
**Maintained By:** AI assistants + non-technical project owner
**Update This:** When structure changes, new features added, or decisions made
