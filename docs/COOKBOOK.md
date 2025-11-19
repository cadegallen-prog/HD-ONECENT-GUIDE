# Development Cookbook
**Task-Based Recipes for HD Penny Guide**

**Last Updated:** 2025-11-19

> 📖 **Copy-paste ready commands** for common development tasks

---

## Table of Contents
- [Adding Pages](#adding-pages)
- [Modifying Components](#modifying-components)
- [Styling](#styling)
- [Content Management](#content-management)
- [Testing](#testing)
- [Deployment](#deployment)
- [Git Operations](#git-operations)
- [Troubleshooting](#troubleshooting)

---

## Adding Pages

### Add a Simple Page

**File:** `app/[page-name]/page.tsx`

```tsx
export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Page Title</h1>
      <p className="text-lg">Your content here.</p>
    </main>
  )
}
```

**Test:** Visit `http://localhost:3001/[page-name]`

### Add a Page with Metadata (for SEO)

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title - HD Penny Guide',
  description: 'Brief description for search engines',
}

export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Page Title</h1>
      <p className="text-lg">Your content here.</p>
    </main>
  )
}
```

### Add a Page with Custom Layout

```tsx
export default function PageName() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Page Title</h1>
        {/* Content */}
      </div>
    </div>
  )
}
```

---

## Modifying Components

### Edit the Navbar

**File:** `components/navbar.tsx`

**Common tasks:**
- Add a link: Add to `navigation` array
- Change logo: Edit `<a href="/" className="nav-brand">`
- Add button: Use `<Button>` from shadcn/ui

### Edit the Footer

**File:** `components/footer.tsx`

**Common tasks:**
- Update copyright year
- Add social links
- Add footer sections

### Create a Reusable Component

**File:** `components/[name].tsx`

```tsx
interface Props {
  title: string
  content: string
}

export function ComponentName({ title, content }: Props) {
  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{content}</p>
    </div>
  )
}
```

**Usage:**
```tsx
import { ComponentName } from '@/components/component-name'

<ComponentName title="Title" content="Content" />
```

---

## Styling

### Change Brand Color

**File:** `app/globals.css`

```css
:root {
  --primary-hue: 10;  /* 0-360, currently HD orange */
}
```

**Color examples:**
- 10 = Orange (Home Depot)
- 220 = Blue
- 160 = Green
- 0 = Red
- 280 = Purple

### Add Custom CSS Class

**File:** `app/globals.css` (at bottom)

```css
.custom-class-name {
  /* Your custom styles */
  background: linear-gradient(to right, #f96302, #d55502);
  padding: 2rem;
  border-radius: 0.5rem;
}
```

### Common Tailwind Patterns

**Layout:**
```tsx
<div className="container mx-auto px-4 py-16">
  {/* Centered container with padding */}
</div>
```

**Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid: 1 col mobile, 2 tablet, 3 desktop */}
</div>
```

**Flex:**
```tsx
<div className="flex items-center justify-between">
  {/* Horizontal layout, centered vertically, spaced apart */}
</div>
```

**Responsive Text:**
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  {/* Small on mobile, larger on bigger screens */}
</h1>
```

---

## Content Management

### Convert Old HTML Content to Next.js

**Old site format (HTML):**
```html
<h2>Section Title</h2>
<p>Content here</p>
```

**New format (TSX):**
```tsx
<section className="mb-12">
  <h2 className="text-2xl font-bold mb-4">Section Title</h2>
  <p className="text-lg">Content here</p>
</section>
```

### Add FAQ Accordion

**Use shadcn/ui Accordion:**

```bash
npx shadcn@latest add accordion
```

**Then:**
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question?</AccordionTrigger>
    <AccordionContent>
      Answer goes here.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Add Table

```tsx
<table className="w-full border-collapse">
  <thead className="bg-orange-500 text-white">
    <tr>
      <th className="p-4 text-left">Column 1</th>
      <th className="p-4 text-left">Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="p-4">Data 1</td>
      <td className="p-4">Data 2</td>
    </tr>
  </tbody>
</table>
```

---

## Testing

### Run Dev Server

```bash
cd /c/Users/cadeg/Projects/hd-penny-nextjs
npm run dev
```

### Build for Production (Test)

```bash
npm run build
npm run start
```

### Check TypeScript Errors

```bash
npm run lint
```

### Test Responsive Design

**Browser DevTools:**
1. Open site (localhost:3001)
2. Press F12
3. Click device icon (top-left of DevTools)
4. Choose device or drag to resize

### Test Dark Mode

**In browser:**
1. Click theme toggle (moon/sun icon)
2. Or set OS to dark mode and refresh

---

## Deployment

### Deploy to Vercel

**First time setup:**
```bash
npm install -g vercel
vercel login
```

**Deploy:**
```bash
vercel
```

**Production deployment:**
```bash
vercel --prod
```

### Build Static Export

```bash
npm run build
# Output in /out directory
```

---

## Git Operations

### Check Status

```bash
cd /c/Users/cadeg/Projects/hd-penny-nextjs
git status
```

### Commit Changes

```bash
git add .
git commit -m "Brief description of changes"
git push origin main
```

### Create New Branch

```bash
git checkout -b feature/new-feature-name
```

### View Recent Commits

```bash
git log --oneline -10
```

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### View What Changed

```bash
git diff
```

---

## Troubleshooting

### Dev Server Won't Start

**Error: Port already in use**
```bash
# Windows
netstat -ano | findstr :3001
# Kill the process ID shown
taskkill /PID [process-id] /F
```

**Error: Module not found**
```bash
npm install
```

**Error: Permission denied**
Run terminal as administrator

### Page Not Found (404)

**Check:**
1. File exists at `app/[page]/page.tsx`?
2. File exports `default function`?
3. Dev server restarted after creating file?

### Styles Not Applying

**Check:**
1. className syntax correct? (camelCase)
2. Tailwind class name spelled right?
3. Hard refresh browser (Ctrl+Shift+R)

### TypeScript Errors

**See errors:**
```bash
npm run lint
```

**Common fixes:**
- Add types: `const x: string = "value"`
- Import types: `import type { TypeName } from '...'`
- Use `any` temporarily: `const x: any = ...` (not ideal)

### Build Fails

**Error: Type error**
Fix TypeScript errors first (`npm run lint`)

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference

### File Structure Patterns

**Page file:**
```
app/
└── page-name/
    └── page.tsx
```

**Component file:**
```
components/
└── component-name.tsx
```

**Utility file:**
```
lib/
└── utils.ts
```

### Import Paths

```tsx
// Components
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'

// Utils
import { cn } from '@/lib/utils'

// Types
import type { Metadata } from 'next'
```

### Common Commands Summary

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check for errors

# Git
git status           # See what changed
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Upload to GitHub

# Packages
npm install [pkg]    # Add new package
npm update           # Update packages
```

---

## Advanced Recipes

### Add Search Functionality

*Coming soon - will add when implemented*

### Add Quiz System

*Coming soon - will add when implemented*

### Add Analytics

*Coming soon - will add when implemented*

---

## Need Help?

1. **Check AI-QUICKSTART.md** - Context for AI assistants
2. **Check PLAYBOOK.md** - Your personal guide
3. **Ask AI** - "I want to [task], how do I do that?"
4. **Check Next.js docs** - https://nextjs.org/docs
5. **Check Tailwind docs** - https://tailwindcss.com/docs

---

**This cookbook grows as the project evolves** - add your own recipes!
