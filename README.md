# 💰 Home Depot Penny Items Guide

**A professional educational platform for clearance hunters**

Built with Next.js 15, TypeScript, and Tailwind CSS

---

## What Is This?

This website teaches people how to find "penny items" at Home Depot - clearance merchandise that's been marked down to $0.01 in the store's system. It's an educational resource covering:

- How the clearance system works
- Digital scouting strategies
- In-store hunting tactics
- Checkout approaches
- Responsible hunting practices

**No hype, no BS** - just practical information based on community knowledge.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Theme:** Dark/Light mode with next-themes
- **Deployment:** Vercel (planned)

---

## Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm (comes with Node.js)

### Running Locally

```bash
# Clone the repository
git clone https://github.com/cadegallen-prog/HD-ONECENT-GUIDE.git
cd HD-ONECENT-GUIDE

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
hd-penny-nextjs/
├── app/                 # Next.js pages and layouts
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   ├── globals.css     # Global styles
│   └── sections/       # Page sections
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── navbar.tsx      # Navigation
│   └── footer.tsx      # Footer
├── lib/                # Utilities
├── public/             # Static files
└── docs/               # Documentation
```

---

## Key Features

### Current
- ✅ Modern Next.js foundation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Accessible components (shadcn/ui)
- ✅ Type-safe with TypeScript
- ✅ Professional styling with Tailwind

### Planned
- ⏳ Search functionality
- ⏳ Interactive quizzes
- ⏳ ROI calculators
- ⏳ Progress tracking
- ⏳ Bookmark system

---

## Content Pages

The guide covers these topics:

1. **What Are Pennies?** - Introduction to penny items
2. **Clearance Lifecycle** - How markdown cycles work
3. **Digital Pre-Hunt** - Using apps to scout
4. **In-Store Strategy** - Finding items in person
5. **Checkout Strategy** - Purchase tactics
6. **Internal Systems** - How HD's systems work
7. **Facts vs Myths** - Debunking misconceptions
8. **Responsible Hunting** - Ethics and best practices
9. **FAQ** - Common questions
10. **Resources** - Tools and templates

---

## Development

### Commands

```bash
npm run dev      # Start dev server (localhost:3001)
npm run build    # Build for production
npm run lint     # Check for errors
npm run start    # Start production server
```

### Customization

**Change brand color:**
Edit `app/globals.css`:
```css
:root {
  --primary-hue: 10;  /* Home Depot orange */
}
```

**Add a new page:**
1. Create `app/[page-name]/page.tsx`
2. Export a React component
3. Visit `localhost:3001/[page-name]`

**Add a component:**
1. Create in `components/[name].tsx`
2. Import: `import { Name } from '@/components/name'`

---

## Documentation

- **AI-QUICKSTART.md** - For AI assistants (gets them up to speed in 90 seconds)
- **CONTEXT.json** - Structured project metadata
- **PLAYBOOK.md** - Personal guide for non-technical users
- **docs/COOKBOOK.md** - Task-based recipes with examples

---

## History

This project started as a static HTML site with 39 pages and 5000+ lines of broken JavaScript. It was functional but unmaintainable.

In November 2025, we rebuilt it from scratch using Next.js and the Gronk Pro Starter template, keeping the good content while fixing all the technical issues.

**Old site:** Backed up in `main-old-static` branch and `_backup-content/` directory

---

## Philosophy

This guide is built on these principles:

1. **Honesty** - No exaggeration, no get-rich-quick promises
2. **Education** - Teach how the system works, not just tactics
3. **Respect** - Emphasize courtesy toward store employees
4. **Community** - Share knowledge, protect the practice
5. **Quality** - Professional presentation, accurate information

---

## Contributing

This is currently a personal project, but if you have suggestions or corrections, feel free to open an issue on GitHub.

---

## Deployment

**Planned deployment:**
- Platform: Vercel
- Method: Static export (`npm run build`)
- Domain: TBD

**Current status:** Development only (not yet deployed)

---

## License

Content: Educational use
Code: MIT License (template components)

---

## Related Projects

- **Gronk Pro Starter 2025** (private) - The Next.js template this is built on
- **Original Static Site** (archived) - Backed up in `main-old-static` branch

---

## For AI Assistants

If you're an AI helping with this project:
1. **Read AI-QUICKSTART.md first** (gets you up to speed in 90 seconds)
2. Check CONTEXT.json for structured project data
3. Refer to docs/COOKBOOK.md for common tasks
4. Remember: The user is non-technical, explain clearly

---

## Contact

This is an independent educational resource, not affiliated with Home Depot.

**Repository:** https://github.com/cadegallen-prog/HD-ONECENT-GUIDE

---

**Built with care by a community of clearance hunters.**
