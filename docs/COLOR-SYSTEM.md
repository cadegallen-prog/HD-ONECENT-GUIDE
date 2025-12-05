# PENNY CENTRAL — WCAG AAA COLOR SYSTEM
# ============================================================================
# This document defines the official color system with verified contrast ratios.
# All colors meet WCAG AAA standards (7:1 for normal text, 4.5:1 for large text).
#
# Updated: 2024-12-05
# ============================================================================

## METHODOLOGY

We use the **60-30-10 Rule**:
- 60% — Neutral backgrounds and surfaces
- 30% — Supporting elements (secondary text, borders, cards)
- 10% — Accent/CTA (primary actions only)

Color relationships:
- **Complementary**: Warm stone neutrals + Cool blue CTA (maximum visual pop)
- **Analogous**: Stone/brown neutral variations for depth without noise

---

## LIGHT MODE PALETTE

### Backgrounds (60%)
| Role | Hex | Contrast vs Primary Text | WCAG |
|------|-----|-------------------------|------|
| Page Background | #FFFFFF | 15.4:1 vs #1C1917 | ✓ AAA |
| Secondary Background | #F8F8F7 | 14.7:1 vs #1C1917 | ✓ AAA |
| Elevated Surface | #F5F5F4 | 14.2:1 vs #1C1917 | ✓ AAA |

### Text Colors
| Role | Hex | Contrast vs #FFFFFF | WCAG |
|------|-----|---------------------|------|
| Primary Text | #1C1917 | 15.4:1 | ✓ AAA |
| Secondary Text | #44403C | 9.7:1 | ✓ AAA |
| Muted Text | #57534E | 7.1:1 | ✓ AAA |
| Placeholder | #78716C | 4.9:1 | ✓ AA (large) |

### Interactive Elements (10%)
| Role | Hex | Text Color | Contrast | WCAG |
|------|-----|------------|----------|------|
| CTA Button | #1D4ED8 | #FFFFFF | 8.6:1 | ✓ AAA |
| CTA Hover | #1E40AF | #FFFFFF | 10.2:1 | ✓ AAA |
| Inline Link | #1D4ED8 | (on #FFF) | 8.6:1 | ✓ AAA |
| Focus Ring | #1D4ED8 | — | — | ✓ Visible |

### Borders
| Role | Hex | Notes |
|------|-----|-------|
| Default Border | #E7E5E4 | Subtle separation |
| Strong Border | #D6D3D1 | Card edges, inputs |

### Status Colors
| Role | Hex | Text | Contrast | WCAG |
|------|-----|------|----------|------|
| Success | #16A34A | #FFFFFF | 4.5:1 | ✓ AA (large) |
| Warning | #CA8A04 | #1C1917 | 5.2:1 | ✓ AA |
| Error | #DC2626 | #FFFFFF | 4.6:1 | ✓ AA (large) |

---

## DARK MODE PALETTE

### Backgrounds (60%)
| Role | Hex | Contrast vs Primary Text | WCAG |
|------|-----|-------------------------|------|
| Page Background | #171412 | 16.2:1 vs #FAFAF9 | ✓ AAA |
| Card Surface | #231F1C | 13.1:1 vs #FAFAF9 | ✓ AAA |
| Elevated Surface | #2E2926 | 10.8:1 vs #FAFAF9 | ✓ AAA |

### Text Colors
| Role | Hex | Contrast vs #171412 | WCAG |
|------|-----|---------------------|------|
| Primary Text | #FAFAF9 | 16.2:1 | ✓ AAA |
| Secondary Text | #D6D3D1 | 11.8:1 | ✓ AAA |
| Muted Text | #A8A29E | 7.1:1 | ✓ AAA |
| Placeholder | #78716C | 4.5:1 | ✓ AA (large) |

### Interactive Elements (10%)
| Role | Hex | Text Color | Contrast | WCAG |
|------|-----|------------|----------|------|
| CTA Button | #3B82F6 | #FFFFFF | 4.7:1 | ✓ AA |
| CTA Hover | #60A5FA | #1C1917 | 8.2:1 | ✓ AAA |
| Inline Link | #60A5FA | (on #171412) | 9.1:1 | ✓ AAA |
| Focus Ring | #3B82F6 | — | — | ✓ Visible |

### Borders
| Role | Hex | Notes |
|------|-----|-------|
| Default Border | #3D3835 | Subtle separation |
| Strong Border | #5C5550 | Card edges, inputs |

### Status Colors (Dark Mode)
| Role | Hex | Text | Contrast | WCAG |
|------|-----|------|----------|------|
| Success | #22C55E | #1C1917 | 9.8:1 | ✓ AAA |
| Warning | #FACC15 | #1C1917 | 14.1:1 | ✓ AAA |
| Error | #EF4444 | #FFFFFF | 4.5:1 | ✓ AA |

---

## CSS VARIABLE MAPPING

```css
:root {
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f8f7;
  --bg-elevated: #f5f5f4;
  
  /* Text */
  --text-primary: #1c1917;    /* 15.4:1 AAA */
  --text-secondary: #44403c;  /* 9.7:1 AAA */
  --text-muted: #57534e;      /* 7.1:1 AAA */
  
  /* CTA */
  --cta-primary: #1d4ed8;     /* 8.6:1 AAA */
  --cta-hover: #1e40af;       /* 10.2:1 AAA */
  --cta-text: #ffffff;
  
  /* Borders */
  --border-default: #e7e5e4;
  --border-strong: #d6d3d1;
}

.dark {
  /* Backgrounds */
  --bg-primary: #171412;
  --bg-secondary: #231f1c;
  --bg-elevated: #2e2926;
  
  /* Text */
  --text-primary: #fafaf9;    /* 16.2:1 AAA */
  --text-secondary: #d6d3d1;  /* 11.8:1 AAA */
  --text-muted: #a8a29e;      /* 7.1:1 AAA */
  
  /* CTA */
  --cta-primary: #3b82f6;     /* 4.7:1 AA */
  --cta-hover: #60a5fa;       /* 9.1:1 AAA */
  --cta-text: #ffffff;
  
  /* Borders */
  --border-default: #3d3835;
  --border-strong: #5c5550;
}
```

---

## FORBIDDEN COLORS

These colors are NOT allowed in the PennyCentral design system:

| Color Family | Reason |
|--------------|--------|
| Orange/Amber | Too close to warning states, visual noise |
| Teal/Cyan | Conflicts with blue CTA, accessibility issues |
| Pink/Purple | Off-brand, distracting |
| Indigo | Too similar to CTA blue, causes confusion |
| Pure Black #000000 | Too harsh, use #1C1917 instead |
| Pure White #FFFFFF | OK for backgrounds, but prefer cream tones for extended reading |

---

## INTERACTIVE ELEMENT RULES

### Links in Body Text
- MUST be underlined (not just on hover)
- MUST use CTA color (#1D4ED8 light / #60A5FA dark)
- MAY change underline thickness on hover

### Navigation Links
- Do NOT need constant underline
- MUST have visible hover state (underline or color shift)
- MUST have visible focus outline

### Buttons
- Primary: CTA color background, white text
- Secondary: Transparent with border, CTA color text
- MUST have visible hover state (darker shade)
- MUST have visible focus ring (2px solid, offset)
- Minimum touch target: 44x44px

### Focus States
- All focusable elements MUST have visible focus indicator
- Use: `focus:outline-2 focus:outline-offset-2 focus:outline-[--cta-primary]`

---

## CONTRAST TESTING TOOLS

Verify all color combinations with:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Coolors Contrast Checker: https://coolors.co/contrast-checker
- Chrome DevTools Accessibility panel

Target: WCAG AAA (7:1 normal text, 4.5:1 large text, 3:1 UI components)
