# Typography System — Penny Central

This document defines the unified typography system for PennyCentral.com. All components should use these tokens for consistent, accessible, and modern typography.

---

## Type Scale

| Level   | Mobile           | Desktop          | Weight        | Line Height     | Usage                        |
| ------- | ---------------- | ---------------- | ------------- | --------------- | ---------------------------- |
| H1      | text-3xl (30px)  | text-5xl (48px)  | font-bold     | leading-tight   | Page hero headlines          |
| H2      | text-2xl (24px)  | text-3xl (30px)  | font-semibold | leading-snug    | Section headings             |
| H3      | text-xl (20px)   | text-2xl (24px)  | font-semibold | leading-snug    | Card titles, subsections     |
| H4      | text-lg (18px)   | text-xl (20px)   | font-medium   | leading-normal  | List headers, minor headings |
| Lead    | text-lg (18px)   | text-xl (20px)   | font-normal   | leading-relaxed | Hero subheadlines            |
| Body    | text-base (16px) | text-base (16px) | font-normal   | leading-relaxed | Paragraphs, descriptions     |
| Small   | text-sm (14px)   | text-sm (14px)   | font-normal   | leading-normal  | Secondary text, metadata     |
| Caption | text-xs (12px)   | text-xs (12px)   | font-medium   | leading-tight   | Labels, badges, timestamps   |

---

## CSS Utility Classes

These classes are defined in `globals.css` and can be applied directly:

```css
/* Headlines */
.text-h1 {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight;
}
.text-h2 {
  @apply text-2xl sm:text-3xl font-semibold leading-snug;
}
.text-h3 {
  @apply text-xl sm:text-2xl font-semibold leading-snug;
}
.text-h4 {
  @apply text-lg sm:text-xl font-medium leading-normal;
}

/* Body text */
.text-lead {
  @apply text-lg sm:text-xl font-normal leading-relaxed;
}
.text-body {
  @apply text-base font-normal leading-relaxed;
}
.text-small {
  @apply text-sm font-normal leading-normal;
}
.text-caption {
  @apply text-xs font-medium leading-tight;
}

/* Color variants */
.text-color-primary {
  color: var(--text-primary);
}
.text-color-secondary {
  color: var(--text-secondary);
}
.text-color-muted {
  color: var(--text-muted);
}
```

---

## Font Weights

| Element             | Weight Value   | Class         |
| ------------------- | -------------- | ------------- |
| H1, H2              | 700 (Bold)     | font-bold     |
| H3                  | 600 (Semibold) | font-semibold |
| H4, Buttons, Labels | 500 (Medium)   | font-medium   |
| Body, Lead          | 400 (Normal)   | font-normal   |

---

## Line Heights

| Context           | Tailwind Class  | Value |
| ----------------- | --------------- | ----- |
| Headlines (H1-H3) | leading-tight   | 1.25  |
| Subheadlines (H4) | leading-snug    | 1.375 |
| Body text, Lead   | leading-relaxed | 1.625 |
| Small/Caption     | leading-normal  | 1.5   |
| Buttons           | leading-none    | 1.0   |

---

## Spacing Rules

| Relationship              | Spacing | Tailwind     |
| ------------------------- | ------- | ------------ |
| Badge → H1                | 16px    | mt-4         |
| H1 → Lead/Subheadline     | 8-12px  | mt-2 to mt-3 |
| Subheadline → Body        | 16px    | mt-4         |
| Body → CTA                | 24px    | mt-6         |
| Section heading → Cards   | 32px    | mt-8         |
| Card title → Card content | 8px     | mt-2         |
| Section → Section         | 64-80px | py-16        |

---

## Dark Mode Typography

All text colors automatically adjust in dark mode via CSS variables:

| Role           | Light Mode | Dark Mode | Contrast |
| -------------- | ---------- | --------- | -------- |
| Primary text   | #1C1917    | #FAFAF9   | ✓ AAA    |
| Secondary text | #44403C    | #D6D3D1   | ✓ AAA    |
| Muted text     | #57534E    | #A8A29E   | ✓ AAA    |
| CTA links      | #1D4ED8    | #3B82F6   | ✓ AA     |

**Rules:**

1. Never use pure white (#FFFFFF) for dark mode text — use off-white (#FAFAF9)
2. Links must remain visibly blue in both modes
3. Captions/metadata use muted color but stay above WCAG minimum (4.5:1)

---

## Link Typography

All inline links must follow these rules:

```css
/* Inline links - always underlined + CTA color */
a:not(.btn):not(.nav-item) {
  color: var(--cta-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
  font-weight: 500;
}

a:not(.btn):not(.nav-item):hover {
  text-decoration-thickness: 2px;
}

a:focus-visible {
  outline: 2px solid var(--cta-primary);
  outline-offset: 2px;
}
```

---

## Hero Typography Guidelines

1. **Badge** → H1: Use `mt-4` for crisp separation
2. **H1**: Max 2 lines on mobile; scale from `text-3xl` to `text-5xl`
3. **Lead**: Max ~70 characters per line; use `max-w-2xl` for constraint
4. **CTAs**: Follow text with `mt-6` spacing before buttons

---

## Forbidden Patterns

❌ Arbitrary font sizes: `text-[17px]`, `text-[26px]`  
❌ Inline font-size styles  
❌ Inconsistent weights (e.g., `font-semibold` on body text)  
❌ Gray text below WCAG contrast minimum  
❌ Text smaller than 12px  
❌ Pure white text in dark mode

---

## Implementation Checklist

- [ ] All H1s use `.text-h1` or equivalent classes
- [ ] All H2s use `.text-h2` or equivalent classes
- [ ] All body text uses `text-base leading-relaxed`
- [ ] All links are underlined with CTA color
- [ ] Dark mode text uses CSS variable colors
- [ ] No arbitrary pixel values in typography
- [ ] Line heights follow the system above
