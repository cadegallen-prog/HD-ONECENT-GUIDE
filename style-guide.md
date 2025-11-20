# HD-ONECENT-GUIDE Style Guide

**Version:** 2.0
**Last Updated:** 2025-11-18
**Purpose:** Comprehensive design system and component documentation

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Components](#components)
6. [Icons & Emojis](#icons--emojis)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Responsive Design](#responsive-design)
9. [Writing Style](#writing-style)

---

## Design Principles

### Core Values

1. **Clarity First** - Information should be instantly scannable and easy to understand
2. **Progressive Disclosure** - Show basics first, details on demand (accordions, expandable sections)
3. **Consistent Patterns** - Same components behave the same way across all pages
4. **Accessible by Default** - Keyboard navigation, screen readers, sufficient contrast
5. **Performance Matters** - Fast loading, minimal dependencies, works offline

### Visual Hierarchy

- **H1**: Page title (one per page) - Establishes main topic
- **H2**: Major sections - Divides content into digestible chunks
- **H3**: Subsections - Provides additional structure
- **Callouts**: Highlight important info - Tips, warnings, key takeaways
- **Tables**: Structured data - Price endings, schedules, comparisons
- **Lists**: Sequential or grouped items - Steps, tips, features

---

## Color System

### Brand Colors

The site uses **Home Depot Orange** as the primary accent color:

| Purpose | Variable | Value | Usage |
|---------|----------|-------|-------|
| Primary Accent | `--accent-color` | `#f96302` | Buttons, links, headers, badges |
| Accent Hover | `--accent-hover` | `#d55502` | Interactive element hover states |

**IMPORTANT**: Never change the primary orange - it's brand-aligned with Home Depot.

### Light Theme (Default)

| Element | Variable | Value | Usage |
|---------|----------|-------|-------|
| Background | `--bg-color` | `#f8f9fa` | Page background |
| Text | `--text-color` | `#212529` | Body text, headings |
| Navigation | `--nav-bg` | `#ffffff` | Navigation bar background |
| Footer | `--footer-bg` | `#343a40` | Footer background |
| Footer Text | `--footer-text` | `#e9ecef` | Footer text color |
| Borders | `--border-color` | `#dee2e6` | Dividers, table borders |
| Code Background | `--code-bg` | `#e9ecef` | Inline code blocks |
| Link | `--link-color` | `#f96302` | Text links |
| Link Hover | `--link-hover` | `#d55502` | Link hover state |

### Dark Theme

Applied via `data-theme="dark"` attribute on `<html>`:

```css
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e9ecef;
  --nav-bg: #2d2d2d;
  --footer-bg: #0d0d0d;
  --border-color: #444;
  --code-bg: #2d2d2d;
}
```

### Callout Colors

| Type | Background | Border | Icon | Usage |
|------|------------|--------|------|-------|
| Info | `#e7f3ff` | `#0066cc` | 💡 | General information, tips |
| Success | `#d4edda` | `#28a745` | ✅ | Positive reinforcement, checkmarks |
| Warning | `#fff3cd` | `#ffc107` | ⚠️ | Cautions, important notices |
| Danger | `#f8d7da` | `#dc3545` | ❌ | Errors, things to avoid |
| Tip | `#d1ecf1` | `#17a2b8` | 💡 | Helpful suggestions, pro tips |
| Key Takeaways | `#fff4e6` | `#f96302` | 🔑 | Summary boxes, main points |

### Status Badge Colors

| Status | Background | Text | Usage |
|--------|------------|------|-------|
| Success | `#28a745` | `#ffffff` | High probability, verified |
| Warning | `#ffc107` | `#212529` | Medium probability, caution |
| Danger | `#dc3545` | `#ffffff` | Low probability, avoid |
| Info | `#17a2b8` | `#ffffff` | Informational, neutral |
| Neutral | `#6c757d` | `#ffffff` | Default, unknown |

### Difficulty Indicators

| Level | Color | Icon | Usage |
|-------|-------|------|-------|
| Beginner | `#28a745` | 🌱 | Easy to understand |
| Intermediate | `#ffc107` | ⚙️ | Requires some knowledge |
| Advanced | `#dc3545` | 🎯 | Expert-level content |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```

**Rationale**: System fonts load instantly, look native, and provide excellent readability.

### Type Scale

| Element | Size (rem) | Size (px) | Weight | Line Height |
|---------|-----------|-----------|--------|-------------|
| H1 | 2.5 | 40 | 700 | 1.2 |
| H2 | 1.75 | 28 | 600 | 1.3 |
| H3 | 1.35 | 21.6 | 600 | 1.4 |
| Body | 1 | 16 | 400 | 1.6 |
| Small | 0.875 | 14 | 400 | 1.5 |
| Code | 0.9 | 14.4 | 400 | 1.5 |

### Font Size Controls

Users can adjust font size via controls:

- **Small**: 16px base (data-font-size="small")
- **Medium**: 18px base (data-font-size="medium") - DEFAULT
- **Large**: 20px base (data-font-size="large")

### Text Styles

| Class | Usage | Example |
|-------|-------|---------|
| `strong` | Emphasis, important terms | `<strong>Zero Margin Adjustment</strong>` |
| `code` | Inline code, price endings | `<code>.03</code>` |
| `em` | Subtle emphasis | `<em>not guaranteed</em>` |

---

## Layout & Spacing

### Container Widths

| Element | Max Width | Padding |
|---------|-----------|---------|
| Navigation | 1200px | 1rem 2rem |
| Main Content | 900px | 3rem 2rem |
| Tables | 100% | - |

### Vertical Rhythm

- Paragraphs: `margin-bottom: 1.25rem` (20px)
- H1: `margin-bottom: 1.5rem` (24px)
- H2: `margin-top: 2.5rem`, `margin-bottom: 1rem`
- H3: `margin-top: 2rem`, `margin-bottom: 0.75rem`
- Lists: `margin-bottom: 1.25rem`
- Tables: `margin: 2rem 0`
- Callouts: `margin: 1.5rem 0`

### Grid System

No formal grid - uses flexbox for navigation and responsive layouts:

```css
.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
}
```

---

## Components

### 1. Callout Boxes

**Purpose**: Highlight important information, tips, warnings, or key takeaways.

**HTML Structure**:
```html
<div class="callout [type]">
  <div class="callout-title icon-[icon]">[Title]</div>
  <p>[Content]</p>
</div>
```

**Types**: `info`, `success`, `warning`, `danger`, `tip`, `key-takeaways`

**Example**:
```html
<div class="callout warning">
  <div class="callout-title icon-warning">Important Notice</div>
  <p>Penny items aren't meant to be sold.</p>
</div>
```

### 2. Summary Box

**Purpose**: Provide page overview at the top of content pages.

**HTML Structure**:
```html
<div class="summary-box">
  <h2 class="icon-star">Page Summary</h2>
  <p>[Brief description of page content]</p>
  <p><strong>What you'll learn:</strong> [Key points]</p>
</div>
```

### 3. Tables

**Purpose**: Display structured data (price endings, schedules, comparisons).

**HTML Structure**:
```html
<div class="table-enhanced">
  <table>
    <thead>
      <tr>
        <th>[Column 1]</th>
        <th>[Column 2]</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-color-low">
        <td>[Data]</td>
        <td>[Data]</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Row Color Classes**:
- `table-color-low` - Light green (low risk/early stage)
- `table-color-medium` - Yellow (medium risk/mid stage)
- `table-color-high` - Orange (high risk/late stage)
- `table-color-neutral` - Gray (neutral/final stage)

### 4. Status Badges

**Purpose**: Show status, difficulty, or probability indicators.

**HTML Structure**:
```html
<span class="status-badge [type]">[Label]</span>
```

**Types**: `success`, `warning`, `danger`, `info`, `neutral`

**Example**:
```html
<span class="status-badge success">High</span>
<span class="status-badge warning">Medium</span>
<span class="status-badge danger">Low</span>
```

### 5. Meta Badges

**Purpose**: Show page metadata (read time, difficulty level).

**HTML Structure**:
```html
<div class="page-metadata">
  <span class="meta-badge icon-time difficulty-beginner">5 min read</span>
  <span class="meta-badge icon-level difficulty-beginner">Beginner</span>
</div>
```

**Difficulty Classes**:
- `difficulty-beginner` - Green
- `difficulty-intermediate` - Orange
- `difficulty-advanced` - Red

### 6. Quick Reference Cards

**Purpose**: Provide scannable reference information.

**HTML Structure**:
```html
<div class="quick-ref-card">
  <h3 class="icon-target">[Card Title]</h3>
  <div class="ref-item">
    <strong>[Item Title]</strong><br>
    [Description]
  </div>
</div>
```

### 7. Comparison Tables

**Purpose**: Show do's vs don'ts, comparisons.

**HTML Structure**:
```html
<div class="comparison-table">
  <div class="comparison-column dont-column">
    <h3 class="icon-cross">Don't</h3>
    <ul class="list-enhanced cross">
      <li>[Item]</li>
    </ul>
  </div>
  <div class="comparison-column do-column">
    <h3 class="icon-check">Do</h3>
    <ul class="list-enhanced checkmark">
      <li>[Item]</li>
    </ul>
  </div>
</div>
```

### 8. Procedure Steps

**Purpose**: Show numbered steps for processes.

**HTML Structure**:
```html
<ol class="procedure-steps">
  <li>
    <strong>[Step Title]</strong><br>
    [Description]
  </li>
</ol>
```

### 9. Enhanced Lists

**Purpose**: Add visual indicators to lists.

**HTML Structure**:
```html
<ul class="list-enhanced [type]">
  <li>[Item]</li>
</ul>
```

**Types**:
- `checkmark` - Green checkmarks (✓)
- `cross` - Red X marks (✗)
- `arrow` - Orange arrows (→)

### 10. Related Topics Section

**Purpose**: Link to related pages at end of content.

**HTML Structure**:
```html
<div class="related-topics-section">
  <h3 class="icon-link">Related Topics</h3>
  <ul>
    <li><a href="[page].html">[Page Name]</a> — [Description]</li>
  </ul>
</div>
```

### 11. Page Navigation Buttons

**Purpose**: Navigate to previous/next pages in sequence.

**HTML Structure**:
```html
<div class="page-nav-buttons">
  <a href="#" class="nav-prev-btn"></a>
  <a href="#" class="nav-next-btn"></a>
</div>
```

**Note**: JavaScript auto-populates these based on PAGE_ORDER.

### 12. Breadcrumbs

**Purpose**: Show page hierarchy and navigation path.

**HTML Structure**:
```html
<div class="breadcrumbs"></div>
```

**Note**: JavaScript auto-generates breadcrumbs.

### 13. Table of Contents

**Purpose**: Provide in-page navigation for long articles.

**HTML Structure**:
```html
<div class="table-of-contents">
  <h3>On This Page</h3>
</div>
```

**Note**: JavaScript auto-generates TOC from H2/H3 headings.

### 14. Back to Top Button

**Purpose**: Quick scroll to top on long pages.

**HTML Structure**:
```html
<button class="back-to-top" aria-label="Back to top">↑</button>
```

**Note**: Automatically shows/hides on scroll (JavaScript).

### 15. PDF Download Section

**Purpose**: Link to downloadable PDF guide.

**HTML Structure**:
```html
<div class="pdf-download-section">
  <h2>Download the Full PDF Guide</h2>
  <p>[Description]</p>
  <a href="Home Depot Penny Items Guide.pdf" class="pdf-download-btn" download>
    Download PDF Guide
  </a>
</div>
```

---

## Icons & Emojis

### Icon Classes

Applied to headings for visual interest:

| Class | Icon | Usage |
|-------|------|-------|
| `icon-star` | ⭐ | Overview, highlights |
| `icon-info` | ℹ️ | Information sections |
| `icon-warning` | ⚠️ | Warnings, cautions |
| `icon-tip` | 💡 | Tips, suggestions |
| `icon-key` | 🔑 | Key takeaways |
| `icon-target` | 🎯 | Goals, objectives |
| `icon-book` | 📖 | Learning content |
| `icon-link` | 🔗 | Related links |
| `icon-check` | ✅ | Approved, do this |
| `icon-cross` | ❌ | Don't do this |
| `icon-time` | ⏱️ | Time estimates |
| `icon-level` | 📊 | Difficulty level |

**Usage**:
```html
<h2 class="icon-warning">Important Warning</h2>
<h3 class="icon-tip">Pro Tip</h3>
```

---

## Accessibility Guidelines

### WCAG AA Compliance

- **Color Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via Tab/Enter
- **Focus Indicators**: Visible outline on focused elements
- **Alt Text**: Required for all images (currently uses emoji/SVG icons)
- **ARIA Labels**: Used on buttons and interactive elements

### Semantic HTML

- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<footer>` for footer
- Use `<h1>-<h6>` in proper hierarchy
- Use `<table>` with `<thead>`, `<tbody>`, `<th>`, `<td>`
- Use `<code>` for code snippets
- Use `<strong>` for emphasis (not `<b>`)
- Use `<em>` for emphasis (not `<i>`)

### Screen Reader Support

- **Skip Links**: Provide skip to main content
- **ARIA Labels**: On search, theme toggle, font controls
- **Table Headers**: Use `<th>` with `scope` attribute
- **Link Text**: Descriptive (not "click here")

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Desktop | 1200px+ | Full layout |
| Tablet | 768px - 1199px | Stacked navigation |
| Mobile | < 768px | Single column |

### Mobile Optimizations

- **Navigation**: Stacks vertically on mobile
- **Tables**: Horizontal scroll if needed (`.table-enhanced` wrapper)
- **Font Sizes**: Slightly smaller on mobile
- **Touch Targets**: Minimum 44x44px for buttons
- **Padding**: Reduced on mobile to maximize content space

### Responsive Tables

Always wrap tables:
```html
<div class="table-enhanced">
  <table>...</table>
</div>
```

This allows horizontal scrolling on small screens.

---

## Writing Style

### Voice & Tone

- **Honest & Realistic**: No hype, no guarantees, no exaggeration
- **Respectful**: Toward store employees and the community
- **Educational**: Teach, don't preach
- **Conversational**: Friendly but professional
- **Direct**: Get to the point quickly

### Content Patterns

1. **Start with Summary**: Every page should have a summary box
2. **Use Headings**: Break content into scannable sections
3. **Show, Don't Just Tell**: Use examples, tables, procedures
4. **Highlight Key Info**: Use callouts for important points
5. **Link to Related Content**: Help users navigate related topics
6. **End with Next Steps**: Guide users to the next page or action

### Formatting Guidelines

- **Bold**: For emphasis, important terms (use `<strong>`)
- **Italics**: For subtle emphasis (use `<em>`)
- **Code**: For price endings, system terms (use `<code>`)
- **Lists**: For items, steps, tips (use `<ul>` or `<ol>`)
- **Tables**: For structured data (use `<table>`)
- **Callouts**: For warnings, tips, key points (use `<div class="callout">`)

### Common Phrases to Avoid

❌ **Don't Say**:
- "Click here"
- "As mentioned above"
- "Obviously..."
- "Simply..."
- "Just..."
- "Guaranteed"
- "Always works"
- "Secret hack"

✅ **Do Say**:
- "Learn more about [topic]"
- "See [Section Name]"
- "This approach..."
- "You can..."
- "This may..."
- "Community reports suggest..."
- "Based on observations..."
- "Consistent pattern"

---

## Implementation Examples

### Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] - Home Depot Penny Items Guide</title>

  <!-- SEO -->
  <meta name="description" content="[Page description]">
  <meta name="keywords" content="[keywords]">

  <!-- Standard meta tags -->
  <meta name="author" content="HD Penny Items Guide">
  <meta name="theme-color" content="#f96302">
  <link rel="canonical" content="https://yourdomain.com/[page].html">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,...">

  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="[Title]">
  <meta property="og:description" content="[Description]">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "[Headline]"
  }
  </script>

  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav><!-- Navigation --></nav>

  <main>
    <div class="breadcrumbs"></div>

    <h1>[Page Title]</h1>

    <div class="table-of-contents">
      <h3>On This Page</h3>
    </div>

    <div class="page-metadata">
      <span class="meta-badge icon-time difficulty-beginner">5 min read</span>
      <span class="meta-badge icon-level difficulty-beginner">Beginner</span>
    </div>

    <div class="summary-box">
      <h2 class="icon-star">Page Summary</h2>
      <p>[Summary content]</p>
    </div>

    <!-- Main content -->

    <div class="related-topics-section">
      <h3 class="icon-link">Related Topics</h3>
      <ul>
        <li><a href="[page].html">[Title]</a> — [Description]</li>
      </ul>
    </div>

    <div class="page-nav-buttons">
      <a href="#" class="nav-prev-btn"></a>
      <a href="#" class="nav-next-btn"></a>
    </div>
  </main>

  <footer>
    <p>This site is based on community experience...</p>
  </footer>

  <script src="scripts.js"></script>
  <button class="back-to-top" aria-label="Back to top">↑</button>
</body>
</html>
```

---

## Version History

- **v2.0** (2025-11-18) - Comprehensive style guide documenting all components
- **v1.0** (2025-11-15) - Initial template system implementation

---

## Questions or Additions?

When adding new components:

1. Document them in this style guide
2. Use consistent naming conventions
3. Follow existing patterns
4. Test on mobile devices
5. Ensure accessibility
6. Update this file with examples

**Remember**: Consistency is key. Use existing patterns before creating new ones.
