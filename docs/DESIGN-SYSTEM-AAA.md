# PENNY CENTRAL — WCAG AAA DESIGN SYSTEM

**Last synced:** Feb 6, 2026 (matches `app/globals.css`)

## Design Philosophy

**Core Principle:** Every element earns its place. If it's not serving the user, it doesn't belong.

**Accessibility Target:** WCAG AAA (7:1 contrast for normal text, 4.5:1 for large text, 3:1 for UI components)

**Visual Feel:** Professional, trustworthy, alive — not sterile, not cluttered, not abandoned.

---

## Color Theory Foundation

### Our Base: Warm Stone + Cool Navy

- Warm neutrals (stone/cream) = approachable, trustworthy, easy on eyes for long reading
- Cool navy accent = high contrast, draws attention, professional "action" color
- Complementary relationship: warm vs cool creates maximum visual pop

---

## Light Mode Palette

### Backgrounds (60% of visual space)

Analogous warm neutrals — slight variations that create depth without noise.

| Token           | Hex       | Usage                     | Notes                           |
| --------------- | --------- | ------------------------- | ------------------------------- |
| `--bg-page`     | `#FFFFFF` | Main page background      | Pure white for maximum contrast |
| `--bg-subtle`   | `#F8F8F7` | Badges, hint surfaces     | Barely perceptible lift         |
| `--bg-elevated` | `#FAFAF9` | Cards, raised surfaces    | Warm white (cream undertone)    |
| `--bg-recessed` | `#F0F0EF` | Input fields, muted areas | Warm off-white                  |
| `--bg-hover`    | `#F0EFED` | Hover/active states       | Visible but subtle              |
| `--bg-card`     | alias     | = `--bg-elevated`         | Card surfaces                   |
| `--bg-modal`    | alias     | = `--bg-elevated`         | Dialogs, overlays               |

### Text Colors (Warm grays — clear 3-step hierarchy)

All tested against **worst-case background** `#F0F0EF` (`--bg-recessed`) for AAA compliance.

| Token                | Hex       | On white | On #F0F0EF | WCAG | Usage                          |
| -------------------- | --------- | -------- | ---------- | ---- | ------------------------------ |
| `--text-primary`     | `#1C1917` | 15.4:1   | 13.5:1     | AAA  | Headlines, labels, emphasis    |
| `--text-secondary`   | `#44403C` | 10.26:1  | 8.97:1     | AAA  | Body copy, descriptions        |
| `--text-muted`       | `#504A45` | 8.71:1   | 7.61:1     | AAA  | Captions, metadata, timestamps |
| `--text-placeholder` | `#544F49` | 8.10:1   | 7.11:1     | AAA  | Input placeholders             |

**Hierarchy intent:** Headlines in near-black stand out clearly from body copy. Metadata visibly steps down from body. The spread is wide enough to guide the eye without squinting.

### CTA / Accent — Desaturated Ink Navy

Professional, restrained, universal "action" color. Avoids bright blue glare.

| Token            | Hex       | Text Color | Contrast | WCAG | Usage                       |
| ---------------- | --------- | ---------- | -------- | ---- | --------------------------- |
| `--cta-primary`  | `#2B4C7E` | White      | ~7.5:1   | AAA  | Primary buttons, active nav |
| `--cta-hover`    | `#1F3A5F` | White      | ~9.5:1   | AAA  | Button hover state          |
| `--cta-active`   | `#162848` | White      | ~12:1    | AAA  | Button pressed state        |
| `--cta-text`     | `#FFFFFF` | —          | —        | —    | Text on CTA buttons         |
| `--link-default` | alias     | —          | —        | AAA  | = `--cta-primary`           |
| `--link-hover`   | alias     | —          | —        | AAA  | = `--cta-hover`             |

### Status Colors

| Token              | Hex       | Contrast | WCAG | Usage                              |
| ------------------ | --------- | -------- | ---- | ---------------------------------- |
| `--status-success` | `#0D5C2A` | ~9.3:1   | AAA  | Success messages (green = success) |
| `--status-warning` | `#714204` | ~8.6:1   | AAA  | Warnings, cautions                 |
| `--status-error`   | `#8C1515` | ~8.0:1   | AAA  | Errors, destructive actions        |
| `--status-info`    | alias     | —        | AAA  | = `--live-indicator`               |

### Live Indicator (Dark Amber)

| Token              | Hex                      | Contrast on #F0F0EF | Usage                    |
| ------------------ | ------------------------ | ------------------- | ------------------------ |
| `--live-indicator` | `#53401E`                | 8.69:1 (AAA)        | Pulsing dot, info badges |
| `--live-glow`      | `rgba(83, 64, 30, 0.35)` | —                   | Glow effect on pulse     |

### Borders

| Token              | Hex       | Contrast on white | Usage                      |
| ------------------ | --------- | ----------------- | -------------------------- |
| `--border-default` | `#757575` | 4.61:1 (3:1+)     | Card borders, dividers     |
| `--border-strong`  | `#757575` | 4.61:1 (3:1+)     | Input borders, emphasis    |
| `--border-focus`   | alias     | —                 | = `--cta-primary`          |
| `--border-dark`    | `#D6D3D1` | —                 | Legacy; light border alias |

### Price Semantics

| Token            | Hex       | Usage                                 |
| ---------------- | --------- | ------------------------------------- |
| `--price-strike` | `#8B2A2A` | Retail strike-through (not error red) |

---

## Dark Mode Palette — "Technical Grid"

**Design Philosophy:** Industrial utility aesthetic optimized for in-store scanning in bright retail environments. Professional, clean, and instantly scannable on mobile.

### Backgrounds (Tonal Elevation System)

Depth is achieved through color (lightening), not shadows.

| Token           | Hex       | Level | Usage                             |
| --------------- | --------- | ----- | --------------------------------- |
| `--bg-page`     | `#121212` | 0     | Matte black base (OLED optimized) |
| `--bg-subtle`   | `#181818` | 0.5   | Badges, hint surfaces             |
| `--bg-recessed` | `#1A1A1A` | 1     | Form fields, muted surfaces       |
| `--bg-card`     | `#1E1E1E` | 1-2   | Cards and repeating elements      |
| `--bg-hover`    | `#242424` | 3     | Hover and active states           |
| `--bg-elevated` | `#2A2A2A` | 2     | Premium card surfaces             |
| `--bg-focus`    | `#2A2A2A` | 4     | Focused elements                  |
| `--bg-modal`    | `#303030` | 5     | Dialogs, overlays                 |
| `--bg-tertiary` | `#3A3A3A` | 6     | Maximum elevation                 |

### Text Colors

| Token                | Hex       | On #121212 | On #1E1E1E | WCAG | Usage                   |
| -------------------- | --------- | ---------- | ---------- | ---- | ----------------------- |
| `--text-primary`     | `#E0E0E0` | 12.2:1     | 9.2:1      | AAA  | Headlines, body text    |
| `--text-secondary`   | `#BDBDBD` | 8.84:1     | 8.87:1     | AAA  | Body copy, descriptions |
| `--text-muted`       | `#ADADAD` | 7.41:1     | 7.43:1     | AAA  | Captions, metadata      |
| `--text-placeholder` | `#ADADAD` | 7.41:1     | 7.43:1     | AAA  | Input placeholders      |

### CTA / Accent — Muted Light-Blue

Avoids "glow spotlight" effect. AAA with dark text.

| Token           | Hex       | Contrast on #121212 | WCAG | Usage                     |
| --------------- | --------- | ------------------- | ---- | ------------------------- |
| `--cta-primary` | `#90B8EA` | ~8.1:1              | AAA  | Primary buttons and links |
| `--cta-hover`   | `#9CC4F8` | ~9.2:1              | AAA  | Hover states              |
| `--cta-active`  | `#84B1E6` | ~7.5:1              | AAA  | Active/pressed states     |
| `--cta-text`    | `#0F172A` | —                   | AAA  | Dark text on blue buttons |

### Status Colors — Dark Mode

| Token              | Hex       | Contrast on #121212 | WCAG | Usage              |
| ------------------ | --------- | ------------------- | ---- | ------------------ |
| `--status-success` | `#43C083` | ~7.8:1              | AAA  | Success, savings   |
| `--status-warning` | `#FBBF24` | ~11.2:1             | AAA  | Warnings           |
| `--status-error`   | `#FFC2C2` | ~9.4:1              | AAA  | Errors/destructive |

### Live Indicator (Dark mode)

| Token              | Hex                         | Usage                              |
| ------------------ | --------------------------- | ---------------------------------- |
| `--live-indicator` | `#F2D184`                   | Pulsing dot (brighter for dark bg) |
| `--live-glow`      | `rgba(242, 209, 132, 0.25)` | Glow effect                        |

### Borders — Steel Blue-Grey

| Token              | Hex       | On #121212 | On #1E1E1E | WCAG | Usage                         |
| ------------------ | --------- | ---------- | ---------- | ---- | ----------------------------- |
| `--border-default` | `#546E7A` | 3.47:1     | 3.09:1     | 3:1+ | Standard component boundaries |
| `--border-strong`  | `#607D8B` | 4.29:1     | 3.81:1     | 3:1+ | Dividers, emphasis            |
| `--border-dark`    | `#78909C` | 5.59:1     | 4.98:1     | 3:1+ | High-emphasis separators      |
| `--border-focus`   | alias     | —          | —          | AAA  | = `--cta-primary`             |

### Price Semantics (Dark)

| Token            | Hex       | Usage                 |
| ---------------- | --------- | --------------------- |
| `--price-strike` | `#F2B8B5` | Retail strike-through |

---

## Typography System

### Font Stack

```css
font-family:
  var(--font-inter),
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* mono */
```

### Type Scale

| Level                     | Mobile | Desktop | Weight | Line Height | Usage                    |
| ------------------------- | ------ | ------- | ------ | ----------- | ------------------------ |
| H1 (`.text-h1`)           | 30px   | 48px    | 700    | 1.2         | Page titles only         |
| H2 (`.text-h2`)           | 24px   | 30px    | 600    | 1.3         | Section headings         |
| H3 (`.text-h3`)           | 20px   | 24px    | 600    | 1.4         | Subsections, card titles |
| H4 (`.text-h4`)           | 18px   | 20px    | 500    | 1.5         | Minor headings           |
| Lead (`.text-lead`)       | 18px   | 20px    | 400    | 1.75        | Opening paragraphs       |
| Body (`.text-body`)       | 16px   | 16px    | 400    | 1.75        | Body text (guide: 1.75)  |
| Small (`.text-small`)     | 14px   | 14px    | 400    | 1.6         | Secondary text, metadata |
| Caption (`.text-caption`) | 12px   | 12px    | 500    | 1.5         | Labels, timestamps       |

### Guide Article Typography (`.guide-article`)

Long-form reading mode applied to guide chapters via `<Prose variant="guide">`:

- Line height: 1.75 (vs 1.7 standard body)
- Max width: 68ch for optimal line length
- H2s get border-bottom separator for clear section breaks
- Paragraph spacing: mb-5 (20px) for breathing room
- Tables: elevated header, hover rows, compact cells

### Accessibility Requirements

| Rule                 | Requirement           | Notes                                           |
| -------------------- | --------------------- | ----------------------------------------------- |
| Minimum body size    | 16px                  | Penny List card metadata may be 12-13px         |
| Minimum touch target | 44×44px               | WCAG 2.1 AAA requirement                        |
| Line length          | 45-75 characters      | Guide uses 68ch max                             |
| Line height (body)   | 1.7 (guide: 1.75)     | Increased for dark mode readability             |
| Paragraph spacing    | 1.5× font size        | Guide: 20px (mb-5)                              |
| Heading hierarchy    | Sequential (H1→H2→H3) | Screen reader navigation                        |
| Links                | Always underlined     | Color alone is not sufficient for accessibility |
| Font weight minimum  | 400 (Regular)         | Never use 300 or lighter                        |

---

## Color Usage Rules

### The 60-30-10 Rule

| Percentage | What                               | Colors                        |
| ---------- | ---------------------------------- | ----------------------------- |
| 60%        | Backgrounds, large surfaces        | `--bg-page`, `--bg-elevated`  |
| 30%        | Text, borders, supporting elements | `--text-*`, `--border-*`      |
| 10%        | Accent, CTA, live indicator        | `--cta-*`, `--live-indicator` |

### Accent Limit

**Maximum 3 accent-colored elements visible at once:**

1. Primary CTA button
2. Active navigation item
3. One of: live indicator OR inline link

### What Goes Where

| Element             | Color Token                          | Notes                                |
| ------------------- | ------------------------------------ | ------------------------------------ |
| Page background     | `--bg-page`                          | Always                               |
| Cards               | `--bg-card` / `--bg-elevated`        | Slight lift from page                |
| Primary button      | `--cta-primary`                      | ONE per viewport                     |
| Secondary button    | `--border-strong` + `--text-primary` | Outlined style                       |
| Headlines           | `--text-primary`                     | Near-black (light), off-white (dark) |
| Body text           | `--text-secondary`                   | Clearly lighter than headlines       |
| Metadata/timestamps | `--text-muted`                       | Clearly lighter than body            |
| Links in body       | `--link-default`                     | Always underlined                    |
| Success message     | `--status-success`                   | Sparingly                            |
| Error message       | `--status-error`                     | When needed                          |
| Live counter        | `--live-indicator`                   | ONE location only                    |

---

## Forbidden Elements

| Element                      | Why Forbidden                    |
| ---------------------------- | -------------------------------- |
| Raw Tailwind palette classes | Use CSS variable tokens only     |
| Gradients on text            | Reduces contrast, fails WCAG     |
| Shadows larger than 8px blur | Creates visual noise             |
| Animations > 150ms           | Feels sluggish                   |
| Text smaller than 12px       | Fails accessibility              |
| Multiple accent colors       | Dilutes visual hierarchy         |
| Auto-playing media           | Accessibility violation          |
| Carousel/sliders             | Poor UX, accessibility nightmare |
| Infinite scroll              | Disorienting, keyboard trap      |

---

## Guide-Specific Components (globals.css)

### `.guide-article`

Applied via `<Prose variant="guide">`. Provides:

- Body text at `--text-secondary` with 1.75 line-height
- Max 68ch line width
- H2 with bottom border separator and extra top margin
- Styled tables (elevated thead, hover rows)
- List styling with disc/decimal markers

### `.guide-callout`

Left-border accent box for important context within guide content:

```css
.guide-callout           /* Default: CTA-colored left border */
.guide-callout-warning   /* Warning: amber left border */
.guide-callout-success   /* Success: green left border */
```

### `.callout` family

General-purpose callout boxes with colored borders:

```css
.callout          /* Neutral border */
.callout-sky      /* Info border */
.callout-amber    /* Warning border */
.callout-emerald  /* Success border */
.callout-rose     /* Error border */
.callout-compact  /* Reduced padding */
```

---

## Contrast Evidence Summary

### Light Mode (worst-case background: #F0F0EF)

| Token              | Hex       | Ratio on #F0F0EF | Passes AAA? |
| ------------------ | --------- | ---------------- | ----------- |
| `--text-primary`   | `#1C1917` | 13.5:1           | YES         |
| `--text-secondary` | `#44403C` | 8.97:1           | YES         |
| `--text-muted`     | `#504A45` | 7.61:1           | YES         |
| `--border-default` | `#757575` | 4.04:1           | 3:1+ (UI)   |
| `--cta-primary`    | `#2B4C7E` | ~7.6:1           | YES         |
| `--live-indicator` | `#53401E` | 8.69:1           | YES         |

### Dark Mode (worst-case surface: #1E1E1E card)

| Token              | Hex       | Ratio on #1E1E1E | Passes AAA? |
| ------------------ | --------- | ---------------- | ----------- |
| `--text-primary`   | `#E0E0E0` | 9.2:1            | YES         |
| `--text-secondary` | `#BDBDBD` | 8.87:1           | YES         |
| `--text-muted`     | `#ADADAD` | 7.43:1           | YES         |
| `--border-default` | `#546E7A` | 3.09:1           | 3:1+ (UI)   |
| `--cta-primary`    | `#90B8EA` | ~8.1:1           | YES         |

---

## Quick Reference Card

| Need                  | Use                               |
| --------------------- | --------------------------------- |
| Page background       | `--bg-page`                       |
| Subtle surface lift   | `--bg-subtle`                     |
| Card/raised surface   | `--bg-card` / `--bg-elevated`     |
| Headlines             | `--text-primary`                  |
| Body text             | `--text-secondary`                |
| Metadata/captions     | `--text-muted`                    |
| Primary action button | `--cta-primary` (ONE per screen)  |
| Link in text          | `--link-default` + underline      |
| Success feedback      | `--status-success`                |
| Error feedback        | `--status-error`                  |
| Live/active indicator | `--live-indicator` (ONE location) |
| Card border           | `--border-default`                |
| Input border          | `--border-strong`                 |
| Focus ring            | `--border-focus` (2px solid)      |
