# Dark Mode Elevation Guide

Date: December 10, 2025  
Palette: base `#121212` with tonal elevations

## Elevation Levels (color-based depth)

| Level | Token           | Color     | Typical Use                        |
| ----- | --------------- | --------- | ---------------------------------- |
| 0     | `--bg-page`     | `#121212` | Page background                    |
| 1     | `--bg-card`     | `#1A1A1A` | Cards and repeating list elements  |
| 2     | `--bg-elevated` | `#1F1F1F` | Slight lift above cards            |
| 3     | `--bg-hover`    | `#242424` | Hover and active states            |
| 4     | `--bg-focus`    | `#2A2A2A` | Focused states                     |
| 5     | `--bg-modal`    | `#303030` | Dialogs and overlays               |
| 6     | `--bg-tertiary` | `#3A3A3A` | Highest elevation / reserved items |

## Borders (3:1 minimum on base and cards)

| Token              | Color     | Contrast on base | Contrast on card | Usage                    |
| ------------------ | --------- | ---------------- | ---------------- | ------------------------ |
| `--border-default` | `#6B6B6B` | 3.5:1            | 3.3:1            | Standard component edges |
| `--border-strong`  | `#747474` | 4.0:1            | 3.7:1            | Dividers, emphasis       |
| `--border-dark`    | `#808080` | 4.7:1            | 4.4:1            | High-emphasis separators |

## Application Notes

- Depth is communicated by lighter surfaces, not heavy shadows.
- Use `elevation-card` (Level 1) for penny list cards and tags.
- Use Level 3/4 surfaces for hover and focus feedback only; keep them transient.
- Keep CTA and status colors unchanged across elevations; they already clear AA/AAA.
- If a component needs both elevation and border, keep the border at `--border-default` or stronger for 3:1 on both the page and card backgrounds.
