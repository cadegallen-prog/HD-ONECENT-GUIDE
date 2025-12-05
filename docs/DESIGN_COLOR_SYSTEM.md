# Color System — Penny Central

This document defines the unified color token system for PennyCentral.com. All components should use these tokens for consistent, accessible colors across light and dark modes.

---

## Design Philosophy

**60-30-10 Rule:**

- 60% Neutral (backgrounds, large surfaces)
- 30% Supporting (borders, secondary elements, text)
- 10% CTA Accent (buttons, links, focus rings)

**Warm Neutrals + Cool CTA:**

- Warm stone/cream backgrounds create approachability
- Cool blue accent creates clear CTAs and maximum contrast

---

## Color Tokens

### Brand Colors

| Token              | Light Mode | Dark Mode | Usage             |
| ------------------ | ---------- | --------- | ----------------- |
| `--brand-copper`   | #B87333    | #B87333   | Accent highlights |
| `--brand-bronze`   | #CD7F32    | #CD7F32   | Secondary accent  |
| `--brand-gunmetal` | #374151    | #9CA3AF   | Headers, icons    |

### CTA Colors (10% Rule - Buttons & Links Only)

| Token           | Light Mode | Dark Mode | Contrast      | WCAG   |
| --------------- | ---------- | --------- | ------------- | ------ |
| `--cta-primary` | #1D4ED8    | #3B82F6   | 8.6:1 / 4.7:1 | AAA/AA |
| `--cta-hover`   | #1E40AF    | #60A5FA   | —             | —      |
| `--cta-active`  | #1E3A8A    | #93C5FD   | —             | —      |

### Background Colors (60% Rule)

| Token           | Light Mode | Dark Mode | Usage                    |
| --------------- | ---------- | --------- | ------------------------ |
| `--bg-page`     | #FFFFFF    | #171412   | Main page background     |
| `--bg-card`     | #FFFFFF    | #231F1C   | Card surfaces            |
| `--bg-elevated` | #F8F8F7    | #2E2926   | Elevated elements        |
| `--bg-tertiary` | #F1F0EF    | #3A3532   | Nested elevated elements |

### Text Colors (WCAG AAA Compliant)

| Token              | Light Mode | Dark Mode | Contrast      | Usage          |
| ------------------ | ---------- | --------- | ------------- | -------------- |
| `--text-primary`   | #1C1917    | #FAFAF9   | 15.4:1/16.2:1 | Main text      |
| `--text-secondary` | #44403C    | #D6D3D1   | 9.7:1/11.8:1  | Secondary text |
| `--text-muted`     | #57534E    | #A8A29E   | 7.1:1/7.1:1   | Muted/captions |

### Border Colors

| Token              | Light Mode | Dark Mode | Usage              |
| ------------------ | ---------- | --------- | ------------------ |
| `--border-default` | #E7E5E4    | #3D3835   | Standard borders   |
| `--border-strong`  | #D6D3D1    | #57534E   | Emphasized borders |

### Status Colors

| Token             | Value   | Usage                   |
| ----------------- | ------- | ----------------------- |
| `--color-success` | #16A34A | Success states, savings |
| `--color-warning` | #D97706 | Warning states          |
| `--color-error`   | #DC2626 | Error states            |
| `--color-info`    | #2563EB | Informational states    |

---

## CSS Variable Usage

```css
/* In your CSS or Tailwind classes */
.my-element {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-default);
}

/* CTA button */
.cta-button {
  background-color: var(--cta-primary);
  color: white;
}

.cta-button:hover {
  background-color: var(--cta-hover);
}
```

---

## Tailwind Utility Classes

These tokens are mapped to Tailwind classes in `tailwind.config.ts`:

```jsx
// Using CSS variables via arbitrary values
<div className="bg-[var(--bg-card)] text-[var(--text-primary)]">

// Using mapped Tailwind tokens
<div className="bg-page text-text-primary">
<button className="bg-cta-primary hover:bg-cta-hover">
```

---

## Dark Mode Behavior

All CSS variables automatically adjust in dark mode via the `.dark` class:

```css
:root {
  --bg-page: #ffffff;
  --text-primary: #1c1917;
}

.dark {
  --bg-page: #171412;
  --text-primary: #fafaf9;
}
```

No additional dark mode classes needed on individual elements.

---

## Do's and Don'ts

### ✅ Do

- Use CSS variable tokens for all colors
- Test contrast ratios in both light and dark modes
- Use `--cta-primary` only for interactive elements
- Apply `--text-muted` for captions and metadata

### ❌ Don't

- Hardcode hex values inline
- Use colors outside the token system
- Apply CTA colors to non-interactive elements
- Use orange, amber, pink, or purple as accents
- Use pure white (#FFFFFF) for dark mode text

---

## Forbidden Colors

Never use these colors in the design:

- Orange (#F97316, #EA580C) — conflicts with Home Depot branding
- Amber (#F59E0B, #D97706) — too warm, competes with copper
- Pink (#EC4899) — off-brand
- Purple (#8B5CF6) — off-brand
- Teal (#14B8A6) — off-brand
- Cyan (#06B6D4) — off-brand

---

## Shadow Tokens

| Token                   | Light Mode                      | Dark Mode                       |
| ----------------------- | ------------------------------- | ------------------------------- |
| `--shadow-card`         | 0 1px 3px rgba(0,0,0,0.08)      | 0 1px 3px rgba(0,0,0,0.4)       |
| `--shadow-card-hover`   | 0 4px 12px rgba(0,0,0,0.1)      | 0 8px 24px rgba(0,0,0,0.5)      |
| `--shadow-button`       | 0 1px 2px rgba(0,0,0,0.05)      | 0 1px 2px rgba(0,0,0,0.2)       |
| `--shadow-button-hover` | 0 4px 12px rgba(29,78,216,0.25) | 0 4px 12px rgba(59,130,246,0.3) |

---

## Motion Tokens

| Token               | Value                         | Usage             |
| ------------------- | ----------------------------- | ----------------- |
| `--duration-fast`   | 150ms                         | Buttons, hovers   |
| `--duration-normal` | 200ms                         | Cards, menus      |
| `--duration-slow`   | 300ms                         | Page transitions  |
| `--ease-default`    | cubic-bezier(0.16, 1, 0.3, 1) | Standard easing   |
| `--ease-hover`      | ease-out                      | Hover states      |
| `--ease-tap`        | ease-in                       | Active/tap states |

---

## Implementation Checklist

- [ ] All components use CSS variable tokens
- [ ] No hardcoded hex values in component files
- [ ] Dark mode tested on all pages
- [ ] Contrast ratios verified for text colors
- [ ] CTA color used only for interactive elements
- [ ] Shadows applied from shadow token system
- [ ] Transitions use motion tokens
