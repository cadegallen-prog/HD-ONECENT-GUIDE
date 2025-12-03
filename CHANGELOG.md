# CHANGELOG

Brief log of completed work. Most recent at top.

---

## 2024-12-04 — Design System Overhaul: Slate Steel

- **Color Palette Change:** Replaced "Crisp Arctic Indigo" with new "Slate Steel" palette
  - Accent colors changed from indigo-500/600 to slate-600/700
  - More neutral, professional appearance per user feedback
  - NO orange, copper, brown, or purple colors used
- **Files Updated:**
  - `globals.css`: Complete CSS variable rewrite with new slate accent colors
  - `navbar.tsx`: Added inline SVG penny logo (professional 1¢ coin design)
  - `store-finder/page.tsx`: Removed redundant text, full-width map layout, removed tips section
  - `store-map.tsx`: Updated marker colors from indigo to slate-600
  - `page.tsx` (home): Updated hero, value props, how-it-works, community, tools sections
  - `about/page.tsx`: Updated cards and links to slate colors
  - `resources/page.tsx`: Updated support card styling
  - `trip-tracker/page.tsx`: Updated icon styling
  - `cashback/page.tsx`: Updated link colors
  - `components/SupportAndCashbackCard.tsx`: Updated button styling
  - `components/ui/button.tsx`: Updated primary button variant
  - `AGENTS.md`: Updated design system section with Slate Steel palette
  - `SKILLS.md`: Updated design system reference
- **Logo:** Created professional penny/coin logo with "1¢" mark in slate colors
- **Result:** Clean, neutral, professional design that "exudes confidence and authority"

---

## 2024-12-03 — Store Finder Map Popup Dark Mode Fix

- Fixed map popup styling in dark mode (was showing white background with dark text)
- Added comprehensive dark mode CSS overrides to `globals.css`:
  - `.leaflet-popup-content-wrapper`: slate-800 background
  - `.leaflet-popup-tip`: matching dark border color
  - `.leaflet-popup-close-button`: light text with hover state
- Updated `store-map.tsx` popup content with `dark:` Tailwind variants for all text, links, and borders
- Increased `autoPanPadding` from [60,60] to [80,80] to reduce edge clipping
- Fixed SKILLS.md Cashback description: clarified BeFrugal is for site monetization (affiliate income), not resale guidance
- **Result:** Uniform popup appearance in both light and dark modes, consistent with Crisp Arctic Indigo design system

## 2024-12-02 — Project Brain: SKILLS.md

- Created `SKILLS.md` at repo root — compact reference for AI agents covering:
  - Technical skills table (Next.js, TypeScript, Tailwind, Leaflet, etc.)
  - Domain skills table (penny items, store finder, trip tracker, value guidance)
  - MCP servers & tooling with usage guidance and anti-patterns
  - Agent playbook for efficient session starts
- Updated `AGENTS.md`:
  - Replaced verbose Section 9 with pointer to SKILLS.md
  - Added SKILLS.md to documentation structure table
- Updated `CLAUDE.md`: Restructured as clean pointer doc (~15 lines)
- Updated `.github/copilot-instructions.md`: Restructured as clean pointer doc (~25 lines)
- **Result:** Eliminated duplication, reduced context bloat, centralized skills reference

## 2024-12-01 — Phase 3: Remove Empty Artifacts

- Deleted empty `mcp-proxy/` folder at repo root
- Deleted `nul` Windows artifact file at repo root
- Verified build succeeds after deletions
- Updated `TO_DELETE.md` to mark Phase 3 complete

## 2024-12-01 — Documentation and Repo Cleanup Phase 1

- Added "Skills and Tools" section to `AGENTS.md` (section 9)
- Added "Handling Unclear Requests" section to `AGENTS.md` (section 10)
- Added "Product Context" section to `PROJECT_ROADMAP.md` (non-goals, success metrics)
- Created `archive/legacy-static-experiments/` folder (empty, ready for file moves)
- Created `TO_DELETE.md` with 20+ archive candidates and JSON usage report
- Verified orphaned JSON files: CONTEXT.json, internal-links.json, navigation-structure.json, search-index.json, structured-data.json (none imported by Next.js code)

## 2024-12-01 — Documentation and Agent Alignment

- Added Copilot credit-awareness guidance to `AGENTS.md`
- Expanded project mission to include resale and value guidance
- Added `CHANGELOG.md` to documentation structure
- Updated `PROJECT_ROADMAP.md` with completed features and refined backlog

## 2024-12-01 — BeFrugal Cashback Integration

- Created `/cashback` page with full BeFrugal education guide
- Created `SupportAndCashbackCard` reusable component
- Integrated support card into About page and Guide page
- Added "How This Site Stays Free" section to About page

## 2024-12-01 — Map Popup UX Improvements

- Fixed popup clipping near map edges (autoPan, autoPanPadding)
- Improved text contrast and font weight for store name and distance
- Added clear hover states to action links (phone, directions, store page)
- Improved vertical spacing and readability
- Added Leaflet popup CSS overrides in globals.css

## 2024-12-01 — Developer Tooling Setup

- Configured VS Code settings for auto-format on save
- Added Prettier and ESLint-Prettier integration
- Created `.vscode/extensions.json` with recommended extensions
- Added `.prettierrc` config file

## Earlier Work

- Initial site launch with Penny Guide, Store Finder, Trip Tracker, Resources, About pages
- Store data integration with 2000+ Home Depot locations
- Dark mode support
- Mobile-responsive design
