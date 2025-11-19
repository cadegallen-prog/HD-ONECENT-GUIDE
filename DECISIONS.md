# Architecture Decision Log

This file tracks major technical decisions, the reasoning behind them, and their implications for future work.

**Format:** Each decision includes:
- **Date:** When decided
- **Decision:** What we chose
- **Why:** The reasoning (optimization criteria)
- **Alternatives:** What we didn't choose and why
- **Risks:** What could go wrong
- **Mitigation:** How we're managing the risks
- **Future Impact:** How this affects what we can build later

---

## 2025-11-19: Rebuild with Next.js 15 (App Router)

**Decision:** Replace static HTML site with Next.js 15 using App Router

**Why:**
- Old site had 39 HTML files with 5000+ lines of broken JavaScript
- Needed component reusability and maintainability
- Next.js has excellent documentation and large community
- App Router is the modern standard (better than Pages Router)
- Built-in performance optimization (images, fonts, code splitting)

**Alternatives Considered:**
1. **Fix existing static site** - Rejected: Technical debt too deep, would take longer than rebuild
2. **Astro** - Rejected: Smaller community, less documentation for troubleshooting
3. **WordPress** - Rejected: Overkill for content site, harder to customize
4. **Hugo/Jekyll** - Rejected: Limited interactivity for planned features (quizzes, calculators)

**Risks:**
- Learning curve for Next.js concepts (file-based routing, server vs client components)
- Requires Node.js and build process (can't just open HTML files)
- More complex deployment than static hosting

**Mitigation:**
- Using Gronk Pro Starter template as foundation (proven patterns)
- Comprehensive documentation (AI-QUICKSTART.md, PLAYBOOK.md)
- Stick to simple patterns, avoid advanced Next.js features
- Clear file structure documented in guides

**Future Impact:**
- ✅ Enables: Dynamic features, API routes, database integration later
- ✅ Supports: Search, user accounts, progress tracking (Phase 3 features)
- ⚠️ Limits: Requires maintaining Node.js environment, can't go back to pure static easily

---

## 2025-11-19: TypeScript Over JavaScript

**Decision:** Use TypeScript for all code

**Why:**
- Catches errors before runtime (critical when owner can't debug)
- Better IDE autocomplete (helps AI write correct code)
- Self-documenting code (types serve as inline documentation)
- Industry standard for modern React projects

**Alternatives Considered:**
1. **JavaScript** - Rejected: Easier to write bugs, harder to refactor safely

**Risks:**
- Slightly more verbose code
- Type errors can be confusing for non-technical owner

**Mitigation:**
- AI handles type definitions
- Strict typing prevents runtime errors (net benefit)
- Clear error messages when types conflict

**Future Impact:**
- ✅ Makes refactoring safer as project grows
- ✅ Easier to add complex features with confidence
- ✅ Better code editor support for AI assistants

---

## 2025-11-19: Tailwind CSS for Styling

**Decision:** Use Tailwind CSS with shadcn/ui components

**Why:**
- Utility-first approach = faster development
- Design system built-in (consistent spacing, colors)
- Dark mode support out of the box
- Owner can modify by changing class names (no CSS knowledge needed)
- shadcn/ui provides accessible, copy-paste components (no vendor lock-in)

**Alternatives Considered:**
1. **Plain CSS** - Rejected: Harder to maintain consistency, more files to manage
2. **Styled Components** - Rejected: More complex, requires understanding CSS-in-JS
3. **Bootstrap** - Rejected: Opinionated design, harder to customize, heavier bundle

**Risks:**
- Class names can get verbose
- Easy to create inconsistent spacing if not disciplined
- Purging unused CSS requires build process

**Mitigation:**
- Create component library with pre-built patterns
- Reuse components instead of writing Tailwind classes everywhere
- Document color/spacing system in globals.css

**Future Impact:**
- ✅ Easy to adjust styles without understanding CSS
- ✅ Can change entire color scheme by modifying CSS variables
- ✅ Components can be extracted and reused across projects

---

## 2025-11-19: One-Color Branding System (OKLCH)

**Decision:** Use OKLCH color space with single hue variable for brand colors

**Why:**
- Change one number (`--primary-hue`) and entire site updates
- OKLCH is perceptually uniform (better than RGB/HSL)
- Maintains accessibility (contrast) automatically
- Perfect for non-technical customization

**Alternatives Considered:**
1. **Traditional color palette** - Rejected: Requires changing colors in many places
2. **CSS preprocessor variables** - Rejected: Less powerful than OKLCH

**Risks:**
- OKLCH not supported in older browsers
- Limited to single-hue color schemes (can't have multi-color brands easily)

**Mitigation:**
- Target modern browsers only (95%+ coverage)
- Document hue values in PLAYBOOK.md for easy reference
- Fallbacks for critical elements if needed

**Future Impact:**
- ✅ Makes rebranding trivial (1 number change)
- ✅ Can create multiple theme variants easily
- ⚠️ Multi-brand sites would need different approach

---

## 2025-11-19: Framer Motion for Animations

**Decision:** Use Framer Motion for micro-interactions and page transitions

**Why:**
- Declarative animation syntax (easier to understand)
- Built-in accessibility (respects prefers-reduced-motion)
- Tree-shakeable (only loads what's used)
- Popular library with good docs

**Alternatives Considered:**
1. **CSS animations** - Rejected: Limited control, harder to orchestrate complex sequences
2. **GSAP** - Rejected: Overkill for simple animations, steeper learning curve
3. **React Spring** - Rejected: More complex API for our use cases

**Risks:**
- Adds bundle size (~30kb)
- Animations can impact performance if overused

**Mitigation:**
- Use sparingly (hero section, card hovers, page transitions)
- Lazy load animation components
- Respect prefers-reduced-motion setting

**Future Impact:**
- ✅ Easy to add delightful interactions
- ✅ Can build advanced UI patterns (drag/drop, gestures) later
- ⚠️ Must be careful not to overdo it (performance)

---

## 2025-11-19: Development Port 3001 (Not 3000)

**Decision:** Run dev server on port 3001 instead of Next.js default 3000

**Why:**
- Port 3000 conflicts with other local services
- Consistent port documented in all guides

**Alternatives Considered:**
1. **Use default 3000** - Rejected: Causes conflicts in user's environment

**Risks:**
- Must remember to specify port in all commands
- Links in documentation must use correct port

**Mitigation:**
- Documented in package.json scripts
- PLAYBOOK.md always shows correct commands
- No impact on production deployment

**Future Impact:**
- Neutral - just a development convenience

---

## 2025-11-19: Git Branch Strategy

**Decision:**
- `main` branch = current Next.js version
- `main-old-static` branch = backup of original static site
- Feature branches named `claude/[feature-name]-[session-id]`

**Why:**
- Keep working version in main
- Preserve history by backing up old site
- Claude Desktop branch naming convention for tracking

**Alternatives Considered:**
1. **Delete old site entirely** - Rejected: Might need to reference old content/structure
2. **Keep old site in subdirectory** - Rejected: Clutters main codebase

**Risks:**
- Could accidentally merge wrong branch
- Old backup takes storage space

**Mitigation:**
- Clear documentation about which branch is which
- .gitignore prevents committing large files
- Can delete old branch after final verification

**Future Impact:**
- ✅ Can always reference old site structure
- ✅ Clear separation between old and new
- ✅ Safe to experiment on feature branches

---

## Template for Future Decisions

```markdown
## [DATE]: [DECISION NAME]

**Decision:** [What we chose]

**Why:**
- [Reason 1]
- [Reason 2]

**Alternatives Considered:**
1. **[Option A]** - Rejected: [Why]
2. **[Option B]** - Rejected: [Why]

**Risks:**
- [Risk 1]
- [Risk 2]

**Mitigation:**
- [How we're managing risk 1]
- [How we're managing risk 2]

**Future Impact:**
- ✅ Enables: [Future capabilities]
- ⚠️ Limits: [Future constraints]
```

---

**Last Updated:** 2025-11-19
**Maintained By:** AI assistants + project owner
**Update This:** When making major technical decisions
