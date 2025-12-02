# CHANGELOG

Brief log of completed work. Most recent at top.

---

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
