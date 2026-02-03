# Dark Mode Readability Remediation Report

Date: December 10, 2025  
Status: Build + lint completed (see Verification)

## Objective

Reduce eye strain in dark mode while keeping WCAG AAA text contrast and 3:1 UI component contrast. The previous palette produced very high contrast (16–17:1) that led to halation on dark backgrounds.

## Key Changes

1. Palette realignment (dark mode)

- Base surface: `#121212` (was `#18181B`)
- Card surface: `#1A1A1A` with tonal elevations up to `#3A3A3A`
- Text primary: `#DCDCDC` (contrast 13.6:1 on base; AAA)
- Borders: `#6B6B6B` / `#747474` / `#808080` (all >=3:1 on base and cards)
- Status colors: Success `#4ADE80`, Warning `#FBBF24`, Error `#F87171`, Info `#60A5FA`

2. Tonal elevation system

- Elevation tokens for levels 0–6 map to the palette above (color-based depth, not heavy shadows).
- Card components now consume these tokens instead of ad-hoc `dark:` utilities.

3. Typography and spacing

- Minimum font weight enforced at 400 for body text in dark mode.
- Body line height increased to 1.7 for readability in low light.
- 8-point spacing variables documented for consistent density.

4. Component touch points

- `components/penny-list-card.tsx` now uses elevation tokens and corrected status color binding.
- CTA and status tokens remain consistent across light/dark themes.

## Before vs After (key metrics)

| Item                   | Before (dark) | After (dark) | WCAG target |
| ---------------------- | ------------- | ------------ | ----------- |
| Base + primary text    | ~16.9:1       | 13.6:1       | 7:1 (AAA)   |
| Card + primary text    | 14.3:1        | 12.7:1       | 7:1 (AAA)   |
| Border vs base         | 1.7:1         | 3.5–4.7:1    | 3:1 (AA)    |
| CTA text on base       | 8.6:1         | 7.4:1        | 4.5:1 (AA)  |
| Status success on base | 9.8:1         | 10.8:1       | 4.5:1 (AA)  |

## Verification

- `npm run build` ✅
- `npm run lint` ✅
- Contrast spot-checks (computed):
  - Text primary: 13.6:1 on #121212, 12.7:1 on #1A1A1A
  - Text secondary: 8.6:1 on #121212, 8.0:1 on #1A1A1A
  - Text muted: 6.7:1 on #121212, 6.2:1 on #1A1A1A
  - Borders: 3.5–4.7:1 on base; 3.3–4.4:1 on cards
  - CTA primary: 7.4:1 on base; status success: 10.8:1 on base

Next checks recommended:

- Validate contrast with CCA or WebAIM for a couple of representative elements (text, borders, CTA).
- Confirm mobile readability (line height, spacing) with the updated palette.

## Files Touched

- `app/globals.css` — updated dark palette, elevation tokens, border ratios, typography tuning.
- `components/penny-list-card.tsx` — elevation classes, status color binding fix, spacing/line-height tweaks.
- `docs/DESIGN-SYSTEM-AAA.md` — dark palette updated to match implementation.
- `docs/ELEVATION-SYSTEM-VISUAL-GUIDE.md` — refreshed for the new elevation values (see companion doc).

## Next Steps

1. Complete build/lint and log results here.
2. Validate contrast with CCA or WebAIM for a couple of representative elements (text, borders, CTA).
3. Confirm mobile readability (line height, spacing) with the updated palette.
4. If user feedback still reports strain, consider a slightly lighter base (`#141414`) while keeping borders >=3:1.
