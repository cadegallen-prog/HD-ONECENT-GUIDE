# CHANGELOG

Brief log of completed work. Most recent at top.

---

## 2025-12-10 - MCP Documentation & Testing Infrastructure

**Objective:** Create comprehensive documentation for all MCP servers, auto-loading mechanisms, testing procedures, and stopping rules to maximize future agent productivity.

**New Documentation Created:**

- **`.ai/MCP_SERVERS.md`** (Full MCP reference)
  - Complete documentation of all 6 MCP servers (filesystem, github, git, chrome-devtools, pylance, sequential-thinking)
  - Best practices and anti-patterns for each server
  - Token usage optimization guidelines
  - Troubleshooting procedures
  - Example workflows and use cases

- **`.ai/TESTING_CHECKLIST.md`** (Comprehensive QA procedures)
  - Pre-deployment checklist (build, lint, tests, git branch verification)
  - Device testing (desktop, mobile, tablet)
  - Responsive breakpoint testing at 7 screen sizes
  - Network performance testing (Slow 3G, Fast 3G)
  - Accessibility testing (keyboard nav, screen readers, contrast)
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Core Web Vitals targets and measurement procedures
  - Feature-specific test scenarios for penny list and store finder
  - Data validation procedures
  - Error handling testing
  - SEO/meta tags verification
  - Production deployment verification
  - Visual regression manual checklist
  - Common bug patterns to check
  - Testing anti-patterns to avoid

- **`.ai/STOPPING_RULES.md`** (When to stop working)
  - Clear stopping criteria and quality gates
  - How to interpret "maximum capacity" instructions correctly
  - Warning signs of over-optimization
  - Common scenarios with dos/don'ts
  - Session end checklist
  - The "Is This Done?" test

**Documentation Updates:**

- **`.ai/AI-TOOLS-SETUP.md`** - Added comprehensive MCP section
  - MCP quick reference table
  - Configuration examples
  - Usage examples for each server
  - Best practices summary
  - Verification procedures
  - Troubleshooting guide

- **`.ai/USAGE.md`** - Added MCP tools section
  - Explained 6 MCP servers for ChatGPT Codex
  - Clarified auto-loading mechanism
  - Provided context for non-technical users

- **`.ai/QUICKSTART.md`** - Added "Power Tools: MCP Servers" section
  - User-friendly explanation of MCP capabilities
  - Before/after examples showing efficiency gains
  - When AI uses MCPs automatically
  - Advanced best practices for AI agents

- **`.ai/README.md`** - Updated file structure
  - Added MCP_SERVERS.md, TESTING_CHECKLIST.md, STOPPING_RULES.md to directory listing
  - Updated "For AI Assistants" quick reference with MCP guidance
  - Added file descriptions for new documentation

- **`SKILLS.md`** - Enhanced MCP section
  - Expanded MCP server table with priority levels
  - Added best practices dos/don'ts
  - Added token cost hierarchy
  - Added common MCP anti-patterns with examples

**Status:** ✅ Complete - All MCPs documented, testing procedures established, stopping rules clarified

**Impact:**

- Future agents can immediately leverage MCP tools with best practices
- Comprehensive testing checklist ensures quality across all dimensions
- Clear stopping rules prevent over-optimization and wasted tokens
- All documentation cross-referenced and consistent

---

## 2025-12-10 - Penny List Phase 1: UI Polish & Testing

**Objective:** Implement Phase 1 of PENNY_LIST_PLAN.md - enhance table/card readability, verify validation logic, and add comprehensive test coverage.

**UI/UX Improvements:**

- **Table Enhancements:**
  - Added `.line-clamp-2-table` CSS utility for proper 2-line text wrapping (ESLint compliant)
  - Rebalanced column widths for better space utilization (30%, 14%, 13%, 16%, 11%, 16%)
  - Improved line-heights throughout: 1.4 for headings, 1.5 for supporting text
  - Enhanced contrast for SKUs, badges, and state chips using zinc palette (zinc-100/800 bg, zinc-300/700 borders)
  - Added tabular-nums to numeric columns for clean alignment
  - Added mobile scroll hint banner for horizontal table scrolling

- **Card Layout:**
  - Increased font-weight on dates/times from regular to medium for better scannability
  - Applied consistent zinc palette to all badges and state chips for improved contrast
  - Updated SKU displays with zinc backgrounds/borders
  - Standardized badge padding to 2.5px for better touch targets
  - Improved line-heights: 1.4 for titles, 1.6 for notes

**Testing & Quality:**

- **Enhanced Unit Tests:**
  - Added edge case tests for freshness metrics (invalid dates, 30-day boundaries, future dates)
  - Added comprehensive validation tests (whitespace handling, empty strings, malformed dates)
  - Added relative date formatting edge cases
  - All tests passing ✅

- **Build Quality:**
  - Fixed CSS syntax error in globals.css
  - Fixed prettier formatting issues
  - All lint checks passing (0 warnings)
  - Production build successful (25/25 routes)

**Files Modified:**

- `components/penny-list-table.tsx` - Table layout and contrast improvements
- `components/penny-list-card.tsx` - Card layout and readability enhancements
- `app/globals.css` - Added `.line-clamp-2-table` utility class
- `tests/penny-list-utils.test.ts` - Comprehensive edge case coverage

**Design System Compliance:**

- All changes respect WCAG AAA constraints
- No new accent colors introduced
- Max 3 accent elements per viewport maintained
- Touch targets all 44px minimum

**Status:** ✅ Phase 1 Complete - Production Ready

---

## 2025-12-09 - Support CTA Messaging Refresh

- Replaced every "Leave a Tip" reference with the more personable "Buy Me a Coffee" CTA across the homepage, About page, footer, SupportAndCashbackCard, and global support copy.
- Reworded BeFrugal explanations to highlight the benefit for users and call out the referral bonus so visitors understand why activating cashback matters.
- Updated Resources page support blurb and AGENTS instructions to match the new terminology.

---

## 2024-12-03 - Design System Refinement: 60-30-10 Rule

- **Color System Overhaul:** Implemented 60-30-10 color rule for better visual hierarchy
  - 60% Neutral: Stone grays for backgrounds and text (WCAG AA compliant)
  - 30% Brand: Gunmetal (#374151) for headers, Copper (#B87333) for decorative accents
  - 10% CTA: Blue (#1D4ED8) for primary action buttons ONLY
- **Homepage Redesign:**
  - Hero section with clear social proof badge and blue CTAs
  - "How It Works" section: 4-step grid layout with copper-bordered number circles
  - NEW "Support the Site" section prominently featuring tip jar and BeFrugal affiliate
  - Refined Tools section with hover effects
  - Community section with dark background
- **Footer Redesign:**
  - 4-column layout: Brand, Quick Links, Support, Legal
  - Dark background (#1C1917) matching design system
  - Prominent support/affiliate links
- **Component Updates:**
  - `SupportAndCashbackCard`: Copper left-border accent, blue CTA buttons
  - `Navbar`: Blue active state, copper penny logo accent
  - About page: Cards with copper left-border accent, blue action buttons
- **Files Updated:**
  - `tailwind.config.ts`: Added brand, cta, surface, content color tokens
  - `globals.css`: New CSS custom properties with 60-30-10 palette
  - `app/page.tsx`: Complete homepage redesign
  - `components/footer.tsx`: Full footer redesign
  - `components/navbar.tsx`: Blue active states, copper logo
  - `components/SupportAndCashbackCard.tsx`: Copper accent, blue buttons
  - `app/about/page.tsx`: Updated color scheme and button styling
- **Monetization:** Tip/affiliate links prominently displayed on homepage, footer, and key pages
- **Result:** Clean, professional design with clear visual hierarchy and accessible contrast

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
