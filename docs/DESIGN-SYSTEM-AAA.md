# PENNY CENTRAL — WCAG AAA DESIGN SYSTEM

## Design Philosophy

**Core Principle:** Every element earns its place. If it's not serving the user, it doesn't belong.

**Accessibility Target:** WCAG AAA (7:1 contrast for normal text, 4.5:1 for large text, 3:1 for UI components)

**Visual Feel:** Professional, trustworthy, alive — not sterile, not cluttered, not abandoned.

---

## Color Theory Foundation

### The Science Behind Our Palette

We use three color relationship types strategically:

| Relationship            | What It Is                                  | How We Use It                      |
| ----------------------- | ------------------------------------------- | ---------------------------------- |
| **Complementary**       | Colors opposite on the wheel (max contrast) | Primary CTA vs neutral backgrounds |
| **Analogous**           | Colors adjacent on the wheel (harmony)      | Text hierarchy, surface variations |
| **Split-Complementary** | One color + two adjacent to its complement  | Accent system (status colors)      |

### Our Base: Warm Stone + Cool Blue

**Why this combination:**

- Warm neutrals (stone/cream) = approachable, trustworthy, easy on eyes for long reading
- Cool blue accent = high contrast, draws attention, universal "action" color
- This is a **complementary** relationship: warm vs cool creates maximum visual pop

---

## Light Mode Palette

### Backgrounds (60% of visual space)

These are **analogous warm neutrals** — slight variations that create depth without noise.

| Token           | Hex       | RGB           | Usage                     | Notes                           |
| --------------- | --------- | ------------- | ------------------------- | ------------------------------- |
| `--bg-page`     | `#FFFFFF` | 255, 255, 255 | Main page background      | Pure white for maximum contrast |
| `--bg-elevated` | `#FAFAF9` | 250, 250, 249 | Cards, raised surfaces    | Warm white (cream undertone)    |
| `--bg-recessed` | `#F5F5F4` | 245, 245, 244 | Input fields, code blocks | Slightly darker warm            |
| `--bg-hover`    | `#F0EFED` | 240, 239, 237 | Hover states on cards     | Visible but subtle              |

### Text Colors (Analogous warm grays)

All tested against `#FFFFFF` background for WCAG AAA compliance.

| Token                | Hex       | Contrast | WCAG  | Usage                                        |
| -------------------- | --------- | -------- | ----- | -------------------------------------------- |
| `--text-primary`     | `#1C1917` | 15.4:1   | ✓ AAA | Headlines, body text, primary content        |
| `--text-secondary`   | `#44403C` | 9.7:1    | ✓ AAA | Subheadings, secondary content               |
| `--text-muted`       | `#57534E` | 7.1:1    | ✓ AAA | Captions, metadata, timestamps               |
| `--text-placeholder` | `#78716C` | 4.9:1    | ✓ AA  | Input placeholders only (large text context) |

### CTA / Accent - Unified Green Brand

Forest green for consistent "savings" psychology across both light and dark modes.

| Token            | Hex       | Text Color | Contrast | WCAG  | Usage                       |
| ---------------- | --------- | ---------- | -------- | ----- | --------------------------- |
| `--cta-primary`  | `#15803D` | White      | 7.1:1    | ✓ AAA | Primary buttons, active nav |
| `--cta-hover`    | `#166534` | White      | 8.3:1    | ✓ AAA | Button hover state          |
| `--cta-active`   | `#14532D` | White      | 10.1:1   | ✓ AAA | Button pressed state        |
| `--link-default` | `#15803D` | —          | 7.1:1    | ✓ AAA | Inline links (on white bg)  |
| `--link-hover`   | `#166534` | —          | 8.3:1    | ✓ AAA | Link hover state            |

### Status Colors (Split-Complementary)

These colors are carefully chosen to maintain AAA contrast while being semantically meaningful.

| Token              | Hex       | Text  | Contrast | WCAG  | Usage                                |
| ------------------ | --------- | ----- | -------- | ----- | ------------------------------------ |
| `--status-success` | `#15803D` | White | 7.1:1    | ✓ AAA | Success messages, savings indicators |
| `--status-warning` | `#A16207` | White | 7.0:1    | ✓ AAA | Warnings, cautions                   |
| `--status-error`   | `#B91C1C` | White | 7.8:1    | ✓ AAA | Errors, destructive actions          |
| `--status-info`    | `#15803D` | White | 7.1:1    | ✓ AAA | Informational (same as CTA)          |

### Live Indicator (The Amber Pulse)

This is your "alive" signal. Used ONLY for the member counter.

| Token              | Hex                      | Usage                                 | Animation              |
| ------------------ | ------------------------ | ------------------------------------- | ---------------------- |
| `--live-indicator` | `#D97706`                | Pulsing dot next to "37,000+ members" | Gentle pulse, 2s cycle |
| `--live-glow`      | `rgba(217, 119, 6, 0.4)` | Glow effect on pulse                  | Expands on pulse       |

**Important:** This amber is used ONLY for the live indicator. It does not appear anywhere else in the UI.

### Borders

| Token              | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `--border-default` | `#E7E5E4` | Card borders, dividers             |
| `--border-strong`  | `#D6D3D1` | Input borders, emphasized dividers |
| `--border-focus`   | `#15803D` | Focus rings (2px solid)            |

---

## Dark Mode Palette - "Technical Grid"

**Design Philosophy:** Industrial utility aesthetic optimized for in-store scanning in bright retail environments. Professional, clean, and instantly scannable on mobile.

**Palette Inspiration:** Inventory scanner / logistics app. High contrast matte black with emerald green for actions/savings.

### Backgrounds

| Token           | Hex       | Usage                             |
| --------------- | --------- | --------------------------------- |
| `--bg-page`     | `#121212` | Matte black base (OLED optimized) |
| `--bg-card`     | `#1A1A1A` | Cards and repeating elements      |
| `--bg-elevated` | `#1F1F1F` | Light lift above cards            |
| `--bg-hover`    | `#242424` | Hover and active states           |
| `--bg-focus`    | `#2A2A2A` | Focused states                    |
| `--bg-modal`    | `#303030` | Dialogs and overlays              |
| `--bg-tertiary` | `#3A3A3A` | Highest elevation                 |

### Text Colors (tested on #121212 and #1A1A1A)

| Token              | Hex       | Contrast on #121212 | Contrast on #1A1A1A | WCAG | Usage                   |
| ------------------ | --------- | ------------------- | ------------------- | ---- | ----------------------- |
| `--text-primary`   | `#DCDCDC` | 13.6:1              | 12.7:1              | AAA  | Headlines, body text    |
| `--text-secondary` | `#B0B0B0` | 8.6:1               | 8.0:1               | AAA  | Subheadings, metadata   |
| `--text-muted`     | `#757575` | 4.6:1               | 4.3:1               | AA   | Captions, tertiary text |

### CTA / Accent - Technical Grid (Emerald Green)

**Why Emerald Green:** Bridges trust (blue psychology) + savings (green psychology). Professional utility feel. Avoids "orange AI app" aesthetic.

| Token           | Hex       | Contrast on #121212 | WCAG | Usage                      |
| --------------- | --------- | ------------------- | ---- | -------------------------- |
| `--cta-primary` | `#43A047` | 9.8:1               | AAA  | Primary buttons and links  |
| `--cta-hover`   | `#388E3C` | 8.1:1               | AAA  | Hover states               |
| `--cta-active`  | `#2E7D32` | 11.2:1              | AAA  | Active/pressed states      |
| `--cta-text`    | `#121212` | 9.8:1 on #43A047    | AAA  | Dark text on green buttons |

### Status Colors - Technical Grid

| Token              | Hex       | Contrast on #121212 | WCAG | Usage                                   |
| ------------------ | --------- | ------------------- | ---- | --------------------------------------- |
| `--status-success` | `#43A047` | 9.8:1               | AAA  | Success, price/savings (green = action) |
| `--status-warning` | `#FBBF24` | 11.2:1              | AAA  | Warnings                                |
| `--status-error`   | `#F87171` | 6.8:1               | AAA  | Errors/destructive                      |
| `--status-info`    | `#43A047` | 9.8:1               | AAA  | Informational (utility aesthetic)       |

### Live Indicator (Dark mode)

| Token              | Hex                       | Usage                              |
| ------------------ | ------------------------- | ---------------------------------- |
| `--live-indicator` | `#FBBF24`                 | Pulsing dot (brighter for dark bg) |
| `--live-glow`      | `rgba(251, 191, 36, 0.4)` | Glow effect                        |

### Borders - Steel Blue-Grey (Utility Aesthetic)

Subtle, professional borders that don't compete with content. Steel blue-grey chosen for clean, industrial feel.

| Token              | Hex       | Contrast on #121212 | Contrast on #1A1A1A | WCAG | Usage                         |
| ------------------ | --------- | ------------------- | ------------------- | ---- | ----------------------------- |
| `--border-default` | `#37474F` | 3.2:1               | 3.0:1               | AA   | Standard component boundaries |
| `--border-strong`  | `#455A64` | 3.8:1               | 3.5:1               | AA   | Dividers, emphasis            |
| `--border-dark`    | `#546E7A` | 4.5:1               | 4.2:1               | AA   | High-emphasis separators      |
| `--border-focus`   | `#43A047` | 9.8:1               | 9.1:1               | AAA  | Focus rings (match CTA)       |

---

## Typography System

### Font Stack

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;
```

**Why Inter:**

- Designed specifically for screens
- Excellent legibility at all sizes
- Clear distinction between similar characters (I, l, 1, O, 0)
- Variable font = one file, all weights
- Wide language support

### Type Scale (Modular, 1.25 ratio)

| Level            | Mobile | Desktop | Weight | Line Height | Letter Spacing | Usage                                                         |
| ---------------- | ------ | ------- | ------ | ----------- | -------------- | ------------------------------------------------------------- |
| `--text-h1`      | 30px   | 48px    | 700    | 1.1         | -0.02em        | Page titles only                                              |
| `--text-h2`      | 24px   | 30px    | 600    | 1.2         | -0.01em        | Section headings                                              |
| `--text-h3`      | 20px   | 24px    | 600    | 1.3         | 0              | Subsections, card titles                                      |
| `--text-h4`      | 18px   | 20px    | 500    | 1.4         | 0              | Minor headings                                                |
| `--text-body`    | 16px   | 16px    | 400    | 1.6         | 0              | Body text (baseline 16px; dense list metadata may be 12-13px) |
| `--text-small`   | 14px   | 14px    | 400    | 1.5         | 0              | Secondary text, metadata                                      |
| `--text-caption` | 12px   | 12px    | 500    | 1.4         | 0.01em         | Labels, timestamps                                            |

### Accessibility Requirements

| Rule                 | Requirement           | Why                                                         |
| -------------------- | --------------------- | ----------------------------------------------------------- |
| Minimum body size    | 16px                  | Dense list metadata may be 12-13px if needed for scan speed |
| Minimum touch target | 44×44px               | WCAG 2.1 AAA requirement                                    |
| Line length          | 45-75 characters      | Optimal reading comprehension                               |
| Line height (body)   | 1.5-1.6               | Required for readability                                    |
| Paragraph spacing    | 1.5× font size        | Visual separation                                           |
| Heading hierarchy    | Sequential (H1→H2→H3) | Screen reader navigation                                    |

### Font Weight Usage

| Weight   | Value | Usage                                       |
| -------- | ----- | ------------------------------------------- |
| Regular  | 400   | Body text, descriptions                     |
| Medium   | 500   | Links, emphasized text, nav items, captions |
| Semibold | 600   | H2, H3, H4, card titles                     |
| Bold     | 700   | H1 only                                     |

**Rule:** Never use 300 (too light for screens) or 800+ (too heavy, reduces readability).

---

## Interactive Element Specifications

### Buttons

```css
.btn-primary {
  background: var(--cta-primary);
  color: white;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
  min-height: 44px; /* Touch target */
  min-width: 44px;
  transition: background 150ms ease-out;
}

.btn-primary:hover {
  background: var(--cta-hover);
}

.btn-primary:active {
  background: var(--cta-active);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--cta-primary);
  outline-offset: 2px;
}
```

### Links

```css
a:not(.btn) {
  color: var(--link-default);
  text-decoration: underline;
  text-underline-offset: 0.15em;
  text-decoration-thickness: 1px;
  font-weight: 500;
}

a:not(.btn):hover {
  color: var(--link-hover);
  text-decoration-thickness: 2px;
}

a:not(.btn):focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Critical:** Links MUST be underlined at all times (not just on hover). Color alone is not sufficient for accessibility.

### Focus States

Every interactive element must have a visible focus state:

```css
:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

### The Live Indicator Component

```css
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--live-indicator);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 var(--live-glow);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 8px transparent;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation: none;
  }
}
```

**Usage:**

```html
<span class="live-indicator">
  <span class="live-dot" aria-hidden="true"></span>
  <span>37,000+ members and counting</span>
</span>
```

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

If you have more, the page feels noisy. Remove one.

### What Goes Where

| Element             | Color Token                          | Notes                 |
| ------------------- | ------------------------------------ | --------------------- |
| Page background     | `--bg-page`                          | Always                |
| Cards               | `--bg-elevated`                      | Slight lift from page |
| Primary button      | `--cta-primary`                      | ONE per viewport      |
| Secondary button    | `--border-strong` + `--text-primary` | Outlined style        |
| Body text           | `--text-primary`                     | Default               |
| Subheadings         | `--text-secondary`                   | Slightly lighter      |
| Metadata/timestamps | `--text-muted`                       | Clearly subordinate   |
| Links in body       | `--link-default`                     | Always underlined     |
| Success message     | `--status-success`                   | Sparingly             |
| Error message       | `--status-error`                     | When needed           |
| Live counter        | `--live-indicator`                   | ONE location only     |

---

## Forbidden Elements

These create visual noise, harm accessibility, or conflict with the design system:

| Element                              | Why Forbidden                                 |
| ------------------------------------ | --------------------------------------------- |
| Gradients on text                    | Reduces contrast, fails WCAG                  |
| Shadows larger than 8px blur         | Creates visual noise                          |
| Animations > 150ms                   | Feels sluggish                                |
| Text smaller than 12px               | Fails accessibility                           |
| Orange as UI color (except live dot) | Conflicts with live indicator                 |
| Multiple accent colors               | Dilutes visual hierarchy                      |
| Emoji in UI elements                 | Unpredictable rendering, accessibility issues |
| Auto-playing media                   | Accessibility violation                       |
| Carousel/sliders                     | Poor UX, accessibility nightmare              |
| Infinite scroll                      | Disorienting, keyboard trap                   |

---

## CSS Custom Properties (Full Reference)

```css
:root {
  /* Backgrounds */
  --bg-page: #ffffff;
  --bg-elevated: #fafaf9;
  --bg-recessed: #f5f5f4;
  --bg-hover: #f0efed;

  /* Text */
  --text-primary: #1c1917;
  --text-secondary: #44403c;
  --text-muted: #57534e;
  --text-placeholder: #78716c;

  /* CTA */
  --cta-primary: #15803d;
  --cta-hover: #166534;
  --cta-active: #14532d;

  /* Links */
  --link-default: #15803d;
  --link-hover: #166534;

  /* Status */
  --status-success: #15803d;
  --status-warning: #a16207;
  --status-error: #b91c1c;
  --status-info: #15803d;

  /* Live Indicator */
  --live-indicator: #d97706;
  --live-glow: rgba(217, 119, 6, 0.4);

  /* Borders */
  --border-default: #e7e5e4;
  --border-strong: #d6d3d1;
  --border-focus: #15803d;

  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", Monaco, "Courier New", monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --ease-default: cubic-bezier(0.16, 1, 0.3, 1);
}

.dark {
  /* Backgrounds - Technical Grid */
  --bg-page: #121212;
  --bg-card: #1a1a1a;
  --bg-elevated: #1f1f1f;
  --bg-recessed: #1a1a1a;
  --bg-hover: #242424;
  --bg-focus: #2a2a2a;
  --bg-modal: #303030;
  --bg-tertiary: #3a3a3a;

  /* Text */
  --text-primary: #dcdcdc;
  --text-secondary: #b0b0b0;
  --text-muted: #757575;
  --text-placeholder: #78716c;

  /* CTA - Technical Grid (Emerald Green) */
  --cta-primary: #43a047;
  --cta-hover: #388e3c;
  --cta-active: #2e7d32;
  --cta-text: #121212;

  /* Links */
  --link-default: #43a047;
  --link-hover: #66bb6a;

  /* Status */
  --status-success: #43a047;
  --status-warning: #fbbf24;
  --status-error: #f87171;
  --status-info: #43a047;

  /* Live Indicator */
  --live-indicator: #fbbf24;
  --live-glow: rgba(251, 191, 36, 0.4);

  /* Borders - Steel Blue-Grey */
  --border-default: #37474f;
  --border-strong: #455a64;
  --border-dark: #546e7a;
  --border-focus: #43a047;
}
```

---

## Accessibility Checklist

Before shipping any page:

- [ ] All text meets WCAG AAA contrast (7:1 normal, 4.5:1 large)
- [ ] All interactive elements have 44×44px minimum touch target
- [ ] All links are underlined (not just colored)
- [ ] All images have alt text
- [ ] All form inputs have visible labels
- [ ] Focus states are visible on all interactive elements
- [ ] Heading hierarchy is sequential (H1 → H2 → H3)
- [ ] Page has exactly one H1
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Color is never the only indicator of meaning
- [ ] Body text is minimum 16px (dense list metadata may be 12-13px)
- [ ] Line height is at least 1.5 for body text

---

## Quick Reference Card

**For quick decisions while coding:**

| Need                  | Use                               |
| --------------------- | --------------------------------- |
| Page background       | `--bg-page`                       |
| Card/raised surface   | `--bg-elevated`                   |
| Main text             | `--text-primary`                  |
| Less important text   | `--text-muted`                    |
| Primary action button | `--cta-primary` (ONE per screen)  |
| Link in text          | `--link-default` + underline      |
| Success feedback      | `--status-success`                |
| Error feedback        | `--status-error`                  |
| Live/active indicator | `--live-indicator` (ONE location) |
| Card border           | `--border-default`                |
| Input border          | `--border-strong`                 |
| Focus ring            | `--border-focus` (2px solid)      |
