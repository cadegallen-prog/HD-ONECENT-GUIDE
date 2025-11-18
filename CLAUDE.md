# CLAUDE.md - AI Assistant Guide for HD-ONECENT-GUIDE

**Last Updated:** 2025-11-18
**Repository:** HD-ONECENT-GUIDE
**Purpose:** Educational website about Home Depot penny items (clearance hunting)

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Philosophy](#development-philosophy)
4. [File Organization](#file-organization)
5. [Code Conventions](#code-conventions)
6. [Development Workflows](#development-workflows)
7. [Content Management](#content-management)
8. [Git Practices](#git-practices)
9. [Common Tasks](#common-tasks)
10. [Important Constraints](#important-constraints)

---

## Repository Overview

### Purpose
This is a **static educational website** that provides comprehensive guidance on finding "penny items" at Home Depot - merchandise that rings up at $0.01 due to internal clearance systems. The site emphasizes:
- Community-driven knowledge sharing
- Realistic expectations (no "get-rich-quick" promises)
- Respect for store employees
- Responsible hunting practices

### Technical Stack
- **Pure static site** - No build process, frameworks, or dependencies
- **HTML5** with semantic markup
- **CSS3** with custom properties (CSS variables)
- **Vanilla JavaScript** for minimal interactivity
- **No external dependencies** - Fully self-contained

### Deployment
- Can be served from any static web server
- GitHub Pages compatible
- No compilation or build step required
- Files can be opened directly in a browser for testing

---

## Codebase Structure

```
/home/user/HD-ONECENT-GUIDE/
├── index.html                                    # Home page (entry point)
├── what-are-pennies.html                         # Introduction to penny items
├── clearance-lifecycle.html                      # Markdown cadence patterns
├── digital-prehunt.html                         # App/website scouting guide
├── in-store-strategy.html                       # Finding items in store
├── checkout-strategy.html                       # Purchase tactics
├── internal-systems.html                        # Home Depot systems explained
├── facts-vs-myths.html                          # Debunking misconceptions
├── responsible-hunting.html                     # Ethics and best practices
├── faq.html                                     # FAQ with accordion UI
├── about.html                                   # About the guide
│
├── styles.css                                   # Single stylesheet (6.7 KB)
├── scripts.js                                   # Client-side JavaScript (2 KB)
│
├── Home Depot Penny Items Guide.pdf             # 7-page PDF (259 KB)
├── README.md                                    # Placeholder readme
├── mod_reply_library.md                         # Facebook moderation templates
├── penny_tracker_template_instructions.md       # Resale tracker guide
│
└── content/                                     # Markdown source files
    ├── home.md
    ├── what-are-pennies.md
    ├── clearance-lifecycle.md
    ├── digital-prehunt.md
    ├── in-store-strategy.md
    ├── checkout-strategy.md
    ├── internal-systems.md
    ├── facts-vs-myths.md
    ├── responsible-hunting.md
    ├── faq.md
    └── about.md
```

### File Count
- **11 HTML pages** (primary content)
- **11 corresponding markdown files** in `/content/` directory
- **1 CSS file** (all styles)
- **1 JavaScript file** (all interactivity)
- **1 PDF guide** (downloadable resource)
- **2 special markdown files** (community resources)

---

## Development Philosophy

### Core Principles

1. **Simplicity First**
   - No frameworks, no build tools, no complexity
   - Pure HTML/CSS/JS that anyone can understand and edit
   - Works offline and in any browser

2. **Content-Focused**
   - Educational content is the priority
   - UI serves the content, not the other way around
   - Text-based and searchable (Ctrl+F friendly)

3. **Maintainability**
   - Single CSS file for easy style updates
   - Consistent structure across all pages
   - Clear naming conventions

4. **Accessibility & Performance**
   - Semantic HTML structure
   - Fast loading (no external dependencies)
   - Mobile-responsive design
   - Keyboard navigation support

5. **Privacy & Independence**
   - No analytics or tracking
   - No external CDN dependencies
   - No cookies or data collection
   - Fully self-contained

---

## File Organization

### HTML Pages Structure

All 11 HTML pages follow this consistent structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] - Home Depot Penny Items Guide</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav>
        <!-- 11 navigation links (identical across all pages) -->
    </nav>

    <main>
        <h1>[Page Heading]</h1>
        <!-- Page content -->
        <hr>
        <p><strong>Next:</strong> <a href="[next-page].html">[Next Topic]</a></p>
    </main>

    <footer>
        <!-- Disclaimer text (identical across all pages) -->
    </footer>

    <script src="scripts.js"></script>
</body>
</html>
```

### Navigation Structure (Fixed Order)

The navigation appears in this exact order on every page:
1. Home (`index.html`)
2. What Are Pennies? (`what-are-pennies.html`)
3. Clearance Lifecycle (`clearance-lifecycle.html`)
4. Digital Pre-Hunt (`digital-prehunt.html`)
5. In-Store Strategy (`in-store-strategy.html`)
6. Checkout Strategy (`checkout-strategy.html`)
7. Internal Systems (`internal-systems.html`)
8. Facts vs. Myths (`facts-vs-myths.html`)
9. Responsible Hunting (`responsible-hunting.html`)
10. FAQ (`faq.html`)
11. About (`about.html`)

**When adding new pages:** Update navigation in ALL 11 HTML files to maintain consistency.

### Content Directory

The `/content/` directory contains markdown versions of each HTML page:
- These appear to be **source files** used to generate HTML
- Content is identical between `.md` and `.html` versions
- Markdown uses relative links (e.g., `/what-are-pennies`)

**When updating content:** Update both the markdown source AND the HTML page to keep them in sync.

---

## Code Conventions

### HTML Conventions

1. **Semantic Markup**
   - Use `<nav>`, `<main>`, `<footer>` elements
   - Proper heading hierarchy: `<h1>` → `<h2>` → `<h3>`
   - Only one `<h1>` per page

2. **Formatting**
   - 2-space indentation
   - Self-closing tags for void elements: `<hr>`, `<br>`
   - Consistent attribute order: `class`, `id`, `href`, `src`

3. **Links**
   - Internal links use relative paths: `href="checkout-strategy.html"`
   - External links include full URL with `https://`
   - No trailing slashes on internal links

4. **Tables**
   - Use `<thead>` and `<tbody>` for structure
   - Include `<th>` elements for headers
   - Keep tables responsive-friendly (avoid excessive columns)

### CSS Conventions

**File:** `styles.css` (6,757 bytes)

1. **CSS Variables (Theming)**
   ```css
   :root {
     --bg-color: #f8f9fa;
     --text-color: #212529;
     --accent-color: #f96302;        /* Home Depot orange - DO NOT CHANGE */
     --accent-hover: #d55502;
     --nav-bg: #ffffff;
     --footer-bg: #343a40;
     --border-color: #dee2e6;
     --table-header-bg: #f96302;
     --table-row-alt: #f8f9fa;
     --table-hover: #e9ecef;
   }
   ```

2. **Color Palette**
   - **Primary Brand:** `#f96302` (Home Depot orange) - Use for accents, buttons, table headers
   - **Background:** `#f8f9fa` (light gray)
   - **Text:** `#212529` (dark gray, almost black)
   - **Footer:** `#343a40` (dark gray)

3. **Component Naming**
   - BEM-like patterns: `.faq-item`, `.faq-question`, `.faq-answer`
   - Descriptive names: `.pdf-section`, `.disclaimer-box`
   - No cryptic abbreviations

4. **Responsive Breakpoints**
   - Tablet: `@media (max-width: 768px)`
   - Mobile: `@media (max-width: 480px)`

5. **Typography Scale**
   - `h1`: 2.5rem (40px)
   - `h2`: 1.75rem (28px)
   - `h3`: 1.35rem (21.6px)
   - Body: 1rem (16px)
   - Small: 0.875rem (14px)

### JavaScript Conventions

**File:** `scripts.js` (2,023 bytes)

1. **Features Implemented**
   - FAQ accordion (expand/collapse)
   - Smooth scrolling for anchor links
   - Active navigation highlighting

2. **Code Style**
   - camelCase for variables and functions
   - Use `const` for immutable values, `let` for mutable
   - Event delegation where appropriate
   - Comments for complex logic

3. **DOM Selection**
   - Prefer `querySelectorAll()` and `querySelector()`
   - Store frequently accessed elements in variables

4. **Event Handling**
   ```javascript
   element.addEventListener('click', (e) => {
     e.preventDefault();
     // Handle event
   });
   ```

### File Naming Conventions

1. **HTML/Markdown Files**
   - Lowercase with hyphens (kebab-case)
   - Examples: `what-are-pennies.html`, `checkout-strategy.html`
   - Markdown files match HTML names exactly: `what-are-pennies.md`

2. **Special Documentation**
   - Snake_case for supplementary guides
   - Examples: `mod_reply_library.md`, `penny_tracker_template_instructions.md`

3. **Assets**
   - Descriptive names with proper extensions
   - Example: `Home Depot Penny Items Guide.pdf`

---

## Development Workflows

### Adding a New Page

1. **Create content in markdown** (optional but recommended)
   ```bash
   # Create markdown source
   echo "# New Page Title" > content/new-page.md
   ```

2. **Create HTML file**
   - Copy structure from an existing page (e.g., `what-are-pennies.html`)
   - Update `<title>` tag
   - Replace `<h1>` and content
   - Update "Next:" link at bottom

3. **Add navigation link**
   - **CRITICAL:** Update navigation in ALL 11 existing HTML pages
   - Insert new link in appropriate position in `<nav>` element
   - Keep navigation order logical (consider user journey)

4. **Test thoroughly**
   - Open page in browser
   - Verify navigation works
   - Check mobile responsiveness
   - Test all internal links

### Updating Existing Content

1. **Locate the page** (e.g., `clearance-lifecycle.html`)

2. **Edit HTML directly**
   - Update content within `<main>` element
   - Preserve HTML structure and formatting
   - Keep heading hierarchy intact

3. **Update corresponding markdown** (if maintaining source files)
   - Edit `content/[page-name].md`
   - Keep content in sync with HTML

4. **Verify changes**
   - Check spelling and grammar
   - Test any modified links
   - Ensure formatting is consistent

### Styling Changes

1. **Always edit `styles.css`** (never inline styles)

2. **Test across pages**
   - Changes to global styles affect all pages
   - Test navigation, tables, lists, etc.

3. **Check responsive behavior**
   - Test at 320px (mobile)
   - Test at 768px (tablet)
   - Test at 1200px+ (desktop)

4. **Maintain CSS variable values**
   - Use existing variables where possible
   - Don't hardcode colors that exist as variables

### JavaScript Updates

1. **Edit `scripts.js`**
   - Keep features minimal and focused
   - Ensure graceful degradation (site works without JS)

2. **Test interactivity**
   - FAQ accordion functionality
   - Smooth scrolling
   - Active navigation highlighting

3. **Browser compatibility**
   - Use ES6+ features (modern browsers only)
   - No polyfills needed for this project

---

## Content Management

### Content Philosophy

1. **Honest and Realistic**
   - No exaggeration or hype
   - Clear disclaimers about risks
   - Emphasize difficulty and variability

2. **Respectful Tone**
   - Respectful toward store employees
   - Community-focused language
   - Ethical considerations highlighted

3. **Educational Structure**
   - Progress from basics to advanced
   - Practical examples and tables
   - Clear headings and subheadings

### Content Patterns

1. **Tables for Data**
   - Clearance cadence schedules
   - Price ending meanings
   - Status interpretation guides

2. **Lists for Steps**
   - Use ordered lists for sequential steps
   - Use unordered lists for tips or options

3. **Blockquotes for Emphasis**
   - Important warnings
   - Key takeaways
   - Community guidelines

4. **Horizontal Rules for Sections**
   - Use `<hr>` to separate major sections
   - Always before "Next:" navigation link

### Special Content Types

1. **PDF Download Section** (on `index.html` and `about.html`)
   ```html
   <div class="pdf-section">
     <h2>📥 Download PDF Guide</h2>
     <p><a href="Home Depot Penny Items Guide.pdf" download class="pdf-link">
       Download Complete Guide (PDF)
     </a></p>
   </div>
   ```

2. **FAQ Accordion** (on `faq.html`)
   ```html
   <div class="faq-item">
     <div class="faq-question">Question text</div>
     <div class="faq-answer">
       <p>Answer text</p>
     </div>
   </div>
   ```

3. **Disclaimer Boxes**
   - Use for important warnings
   - Styled with border and padding
   - Orange accent color

---

## Git Practices

### Branch Naming

**Current branch:** `claude/claude-md-mi4svguywtaf22da-01N3VvcHaZ6gPkhRErjkXSFf`

**Conventions:**
- Feature branches start with `claude/`
- Descriptive names with hyphens
- Include session ID suffix for Claude branches

### Commit Messages

**Style:**
- Imperative mood: "Add feature" not "Added feature"
- Concise but descriptive
- Reference issue/PR numbers when applicable

**Examples from history:**
```
Add moderator reply library
Link PDF guide from home page and resources
Add penny tracker template instructions
```

### Pull Request Workflow

Based on recent history:
1. Create feature branch
2. Make changes and commit
3. Push branch to remote
4. Create pull request
5. Merge to main after review
6. Delete feature branch

**Recent PRs:**
- PR #6: Add moderator replies
- PR #5: Add PDF download section
- PR #4: Add penny tracker guide

### Pushing Changes

**Use this command:**
```bash
git push -u origin claude/claude-md-mi4svguywtaf22da-01N3VvcHaZ6gPkhRErjkXSFf
```

**Important:**
- Always push to the designated Claude branch
- Retry up to 4 times with exponential backoff on network failures (2s, 4s, 8s, 16s)
- Never force push without explicit permission

---

## Common Tasks

### Task 1: Add FAQ Question

**Location:** `faq.html` (line ~70 onwards)

1. Find the appropriate section (8 sections organized thematically)
2. Add new FAQ item:
   ```html
   <div class="faq-item">
     <div class="faq-question">Your question text?</div>
     <div class="faq-answer">
       <p>Your detailed answer here.</p>
     </div>
   </div>
   ```
3. Test accordion functionality
4. Update total count in CLAUDE.md (currently 33 questions)

### Task 2: Update Clearance Cadence Table

**Location:** `clearance-lifecycle.html`

1. Locate table in HTML
2. Preserve table structure (`<thead>`, `<tbody>`, `<th>`, `<td>`)
3. Keep orange header styling (automatically applied via CSS)
4. Ensure alignment with accompanying text
5. Update both Cadence A and Cadence B if needed

### Task 3: Add New Resource Document

**Example:** Adding a new markdown guide like `mod_reply_library.md`

1. Create markdown file in root directory
2. Use snake_case naming for consistency
3. Link from relevant HTML pages (usually `index.html` or `about.html`)
4. Consider whether it needs an HTML equivalent or stays as markdown

### Task 4: Update Navigation

**When:** Adding/removing pages or changing page order

1. Update `<nav>` element in ALL 11 HTML files
2. Keep link order consistent across all pages
3. Ensure active state highlighting works
4. Test navigation from every page

### Task 5: Style Modifications

**Common changes:**

1. **Color adjustments**
   - Update CSS variables in `:root` block
   - Never change `--accent-color` (Home Depot brand orange)

2. **Responsive tweaks**
   - Edit media queries: `@media (max-width: 768px)` or `@media (max-width: 480px)`
   - Test on actual devices or browser dev tools

3. **Typography changes**
   - Adjust font sizes in CSS (avoid inline styles)
   - Maintain heading hierarchy

---

## Important Constraints

### What NOT to Change

1. **Home Depot Orange Color** (`#f96302`)
   - This is brand-specific and should remain consistent
   - Used in navigation accents, table headers, buttons

2. **Core Site Structure**
   - Don't remove semantic HTML elements (`<nav>`, `<main>`, `<footer>`)
   - Don't break the 11-page navigation structure without updating all pages

3. **Self-Contained Nature**
   - Don't add external dependencies (CDNs, frameworks, libraries)
   - Keep the site fully functional offline

4. **Content Philosophy**
   - Don't add hype or exaggeration
   - Maintain realistic, honest tone
   - Keep emphasis on respect and responsibility

### Performance Considerations

1. **File Sizes**
   - Keep HTML pages under 15 KB each
   - CSS file should stay under 10 KB
   - JavaScript should stay under 5 KB
   - Optimize images if added (none currently)

2. **Loading Speed**
   - No external requests = fast loading
   - Minimize DOM complexity
   - Avoid heavy JavaScript processing

### Accessibility Requirements

1. **Must Maintain:**
   - Semantic HTML structure
   - Sufficient color contrast (WCAG AA minimum)
   - Keyboard navigation support
   - No reliance on hover for critical info

2. **Screen Reader Friendly:**
   - Use proper ARIA labels if adding interactive elements
   - Ensure logical tab order
   - Provide text alternatives for visual content

### Browser Support

**Target:** Modern browsers (last 2 versions)
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

**Not supporting:** IE11 or older browsers

---

## Special Features to Preserve

### 1. FAQ Accordion Functionality

**File:** `scripts.js` (lines 2-27)

The FAQ accordion allows users to expand/collapse answers. When modifying:
- Keep `.faq-item`, `.faq-question`, `.faq-answer` class structure
- Maintain `.active` class toggle logic
- Test expand/collapse on multiple items

### 2. Active Navigation Highlighting

**File:** `scripts.js` (lines 56-67)

Current page is highlighted in navigation. When adding pages:
- Ensure page filenames match navigation `href` values
- Test that correct link gets `.active` class
- Handle edge cases (index.html vs. empty path)

### 3. Smooth Scrolling

**File:** `scripts.js` (lines 29-54)

Anchor links scroll smoothly. When adding internal page anchors:
- Use `id` attributes on target elements
- Link with `href="#anchor-id"`
- JavaScript handles smooth scroll automatically

### 4. Responsive Navigation

**File:** `styles.css` (media queries)

Navigation changes on mobile:
- Horizontal on desktop
- Vertical stack on mobile (<768px)
- Touch-friendly tap targets
- Test on actual mobile devices

---

## Testing Checklist

Before committing changes:

- [ ] All HTML pages render correctly in browser
- [ ] Navigation links work from all pages
- [ ] Active page highlighting works correctly
- [ ] FAQ accordion expands/collapses properly
- [ ] Smooth scrolling works for anchor links
- [ ] Tables display correctly with proper styling
- [ ] PDF download link works (file exists and downloads)
- [ ] Mobile view tested (320px, 768px)
- [ ] Tablet view tested (768px-1024px)
- [ ] Desktop view tested (1200px+)
- [ ] No console errors in browser dev tools
- [ ] All internal links resolve correctly
- [ ] External links (if any) open in new tab
- [ ] Text is readable with good contrast
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Footer appears on all pages
- [ ] Disclaimer text is present and consistent

---

## Quick Reference

### File Locations

| Component | File Path | Size |
|-----------|-----------|------|
| Homepage | `/home/user/HD-ONECENT-GUIDE/index.html` | 5.3 KB |
| Stylesheet | `/home/user/HD-ONECENT-GUIDE/styles.css` | 6.8 KB |
| JavaScript | `/home/user/HD-ONECENT-GUIDE/scripts.js` | 2.0 KB |
| PDF Guide | `/home/user/HD-ONECENT-GUIDE/Home Depot Penny Items Guide.pdf` | 259 KB |
| FAQ Page | `/home/user/HD-ONECENT-GUIDE/faq.html` | 14 KB (largest page) |
| Content Source | `/home/user/HD-ONECENT-GUIDE/content/*.md` | 11 files |

### Key Colors

| Purpose | Hex Code | CSS Variable |
|---------|----------|--------------|
| Home Depot Orange | `#f96302` | `--accent-color` |
| Orange Hover | `#d55502` | `--accent-hover` |
| Background | `#f8f9fa` | `--bg-color` |
| Text | `#212529` | `--text-color` |
| Footer | `#343a40` | `--footer-bg` |

### Page Sizes

| Page | Size | Notes |
|------|------|-------|
| `faq.html` | 14 KB | Largest (33 questions) |
| `about.html` | 8.5 KB | |
| `facts-vs-myths.html` | 8.2 KB | |
| `clearance-lifecycle.html` | 8.2 KB | Complex tables |
| `in-store-strategy.html` | 7.6 KB | |
| `checkout-strategy.html` | 7.2 KB | |
| `responsible-hunting.html` | 7.1 KB | |
| `digital-prehunt.html` | 6.2 KB | |
| `internal-systems.html` | 6.2 KB | |
| `what-are-pennies.html` | 5.4 KB | |
| `index.html` | 5.3 KB | Smallest content page |

### Recent Development History

```
b2cd043 - Merge PR #6: Add moderator replies
efed435 - Merge PR #5: Add PDF download section
4a6873c - Add moderator reply library
7e6af5f - Link PDF guide from home page
ee95802 - Merge PR #4: Add penny tracker guide
```

---

## Getting Help

### For AI Assistants

When uncertain about:
1. **Content changes** - Review existing pages for tone and style consistency
2. **Structure changes** - Test thoroughly, update all affected pages
3. **Major refactoring** - Discuss with user before implementing
4. **Breaking changes** - Always get explicit approval

### For Developers

This guide assumes AI assistants will be making changes. Human developers should:
1. Follow the same conventions documented here
2. Update CLAUDE.md when adding new patterns or conventions
3. Keep documentation in sync with code
4. Test across all pages before committing

---

## Maintenance Notes

### Last Updated
- **Date:** 2025-11-18
- **Updated by:** Claude (Sonnet 4.5)
- **Changes:** Initial creation of CLAUDE.md

### Future Updates Needed
- Update this file when adding new pages
- Update when changing site structure
- Update when adding new features or components
- Update when conventions change

### Version History
- **v1.0** (2025-11-18) - Initial comprehensive documentation

---

## Summary for AI Assistants

**This is a simple, static educational website. When working on it:**

1. ✅ **DO:**
   - Keep it simple (pure HTML/CSS/JS)
   - Update all 11 HTML pages when changing navigation
   - Maintain consistent structure across pages
   - Test mobile responsiveness
   - Follow existing naming conventions
   - Keep content realistic and respectful
   - Update both markdown and HTML when changing content

2. ❌ **DON'T:**
   - Add frameworks or build tools
   - Change the Home Depot orange color (#f96302)
   - Add external dependencies
   - Use inline styles
   - Break semantic HTML structure
   - Add hype or exaggeration to content
   - Forget to test across all pages

3. 🎯 **PRIORITIES:**
   - Content quality and accuracy
   - Consistency across all pages
   - Mobile-friendly design
   - Fast loading and simplicity
   - Accessibility and usability

**When in doubt:** Look at existing pages for patterns and conventions. This site values consistency and simplicity above all else.

---

*End of CLAUDE.md*
