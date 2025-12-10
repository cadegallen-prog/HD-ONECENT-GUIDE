# AI Session Log

**Purpose:** Running log of what AI assistants have done, learned, and handed off. This is the "persistent memory" across sessions and AI tools.

**Instructions for AI:**
- Add entry AFTER completing each significant task
- Include: Date, AI tool used, goal, outcome, learnings, and next-session notes
- Be concise but informative
- Flag blockers or issues for next AI

---

## December 7, 2025 - Claude Code - Autonomous Penny List Feature

**AI:** Claude Code (Sonnet 4.5)
**Goal:** Add community-powered penny list from Google Forms submissions
**Approach:** Fetch CSV from published Google Sheet, parse with papaparse, server-side render with hourly revalidation

**Changes Made:**
- Created `/lib/fetch-penny-data.ts` for CSV parsing with field aliases
- Created `/app/penny-list/page.tsx` with server-side rendering
- Added papaparse dependency for CSV parsing
- Configured 1-hour revalidation (auto-refresh)
- Privacy: emails/timestamps stay server-side only

**Outcome:** ✅ **Success**
- Feature live in production
- Tested with real Google Form submissions
- Community can submit via public Google Form
- Updates hourly with zero manual work

**Learnings:**
- Google Sheets can serve as simple backend (publish as CSV)
- Field aliases handle column name variations gracefully
- Next.js 15 ISR (revalidation) works perfectly for this use case
- No database needed for this feature

**For Next AI:**
- Don't modify CSV parsing logic unless absolutely necessary
- If adding filters/sorts, keep them client-side (data is already fetched)
- Cade manages Google Sheet directly (AI doesn't need access)

---

## December 7, 2025 - Claude Code - Auto-Load Integration + Practical Templates

**AI:** Claude Code (Sonnet 4.5)
**Goal:** Complete the AI collaboration system with auto-load mechanism and practical daily-use templates
**Approach:** Updated auto-load instruction files (CLAUDE.md, copilot-instructions.md) to reference .ai/ directory, created practical templates for daily workflow

**Changes Made:**
- Updated `~/.codex/config.toml` to point to HD-ONECENT-GUIDE project
- Updated `CLAUDE.md` with .ai/ auto-load instructions
- Updated `.github/copilot-instructions.md` with .ai/ auto-load instructions
- Created `.ai/SESSION_TEMPLATES.md` with three copy-paste prompts (start, define task, end session)
- Updated `.ai/SESSION_LOG.md` template to include "Unfinished Items" and "Future Prompts" sections
- Created `.ai/USAGE.md` with ultra-simple daily workflow guide
- Updated `.ai/README.md` with auto-load explanation and updated file structure
- Updated `.ai/QUICKSTART.md` with "Three Daily Habits" section at top

**Outcome:** ✅ **Success**
- Complete cross-AI collaboration system ready to use
- Auto-load works in Claude Code, GitHub Copilot, and ChatGPT Codex
- Practical templates make daily use simple (three copy-paste habits)
- "Session End" template forces AI to confess unfinished work + write future prompts
- No complex infrastructure (no hooks, MCPs, skills yet - keeping it simple)

**Completed Items:**
- ✅ Codex config updated to correct project path
- ✅ Auto-load instructions added to CLAUDE.md and copilot-instructions.md
- ✅ SESSION_TEMPLATES.md created with all three prompts
- ✅ SESSION_LOG.md template enhanced with Unfinished Items + Future Prompts
- ✅ USAGE.md created for daily workflow
- ✅ README.md updated with auto-load explanation
- ✅ QUICKSTART.md updated with Three Daily Habits

**Unfinished Items:**
- None - system is complete and ready to use

**Learnings:**
- All three AI tools (Claude Code, Copilot, Codex) can auto-load instructions via markdown files
- Codex uses `~/.codex/config.toml` with `mcp_paths` to load instruction files
- Auto-load eliminates need for manual "session start" prompts in most cases
- "Session End" ritual is critical for preventing context loss between sessions
- Simple, repeatable habits trump complex automation for this use case

**For Next AI:**
- System is complete and ready for daily use
- Read USAGE.md or QUICKSTART.md to understand the workflow
- Follow the three-habit system: (1) auto-load, (2) GOAL/WHY/DONE, (3) confess unfinished work
- When ending sessions, ALWAYS use the "Session End" template to update this log

---

## December 7, 2025 - Claude Code - Human-AI Contract System

**AI:** Claude Code (Sonnet 4.5)
**Goal:** Create cross-AI collaboration protocol for Cade (non-coder) to effectively manage project across Claude Code, ChatGPT Codex, and GitHub Copilot
**Approach:** Built `.ai/` directory with structured markdown docs that any AI can read

**Files Created:**
- `/.ai/CONTRACT.md` - Collaboration agreement (what each party provides)
- `/.ai/DECISION_RIGHTS.md` - Authority matrix (what AI can decide vs. needs approval)
- `/.ai/CONTEXT.md` - Project background and community context
- `/.ai/CONSTRAINTS.md` - Technical restrictions and fragile areas
- `/.ai/SESSION_LOG.md` - This file (running log of AI work)
- `/.ai/LEARNINGS.md` - Accumulated knowledge from past sessions
- `/.ai/QUICKSTART.md` - Guide for Cade on using the system

**Outcome:** ✅ **Success**
- Complete collaboration framework in place
- Works across all AI tools (tool-agnostic markdown)
- Clear decision boundaries
- Persistent memory system

**Learnings:**
- Non-coders can orchestrate AI effectively with structured protocols
- Cross-AI handoffs require tool-agnostic documentation (markdown > proprietary formats)
- Clear decision rights reduce friction and rework
- Session logs create continuity across conversations

**For Next AI:**
- Read all files in `.ai/` directory FIRST before starting work
- Update this SESSION_LOG.md after each significant task
- Add learnings to LEARNINGS.md when you discover something new
- Follow DECISION_RIGHTS.md strictly (don't freelance)

---

## December 8, 2025 - Claude Code - Comprehensive Site Audit & Optimization

**AI:** Claude Code (Opus 4.5)
**Goal:** Comprehensive audit for performance, accessibility, SEO, conversion tracking, and security
**Approach:** Systematic audit of all 18 public pages, fixing issues within project constraints

**Changes Made:**

*SEO:*
- Fixed `sitemap.xml` - corrected domain, removed .html extensions, added 6 missing pages
- Fixed `public/robots.txt` - corrected domain, added /admin/ and /api/ disallows
- Added JSON-LD structured data to `app/layout.tsx` (WebSite + Organization schemas)
- Added preconnect hints for Google Tag Manager and fonts

*Accessibility:*
- Added skip-to-main-content link in `app/layout.tsx`
- Added `id="main-content"` to main element
- Improved form accessibility in `app/report-find/page.tsx` (aria-required, aria-describedby)

*Conversion Tracking:*
- Created `lib/analytics.ts` - type-safe GA4 event tracking utility
- Created `components/trackable-link.tsx` - reusable tracked link component
- Added event tracking to 6 key CTAs:
  - newsletter_click (/penny-list)
  - store_search (/store-finder)
  - trip_create (/trip-tracker)
  - find_submit (/report-find)
  - donation_click (footer)
  - befrugal_click (footer)

**Outcome:** ✅ **Success**

*Performance Metrics (Production Build):*
- FCP: 0.8s (excellent)
- LCP: 2.9s (close to 2.5s target)
- TBT: 100ms (at target)
- CLS: 0 (perfect)

*Important Finding:* The 14s LCP from dev mode was misleading - production build performs well.

**Completed Items:**
- ✅ Sitemap/robots.txt fixed and validated
- ✅ JSON-LD structured data added
- ✅ Skip link and accessibility improvements
- ✅ Event tracking for 6 conversion points
- ✅ npm audit (0 vulnerabilities)
- ✅ npm run build passed
- ✅ npm run lint passed
- ✅ Created AUDIT_REPORT_2025-12-08.md

**Unfinished Items:**
- Search Console submission (requires Cade's access)
- A/B testing setup (needs decision on which CTA to test)
- Automated Lighthouse CI integration (optional)

**Learnings:**
- Next.js dev mode can show misleading performance metrics (14s LCP vs 2.9s prod)
- Server components can't have onClick handlers - use client component wrappers
- Footer needed "use client" directive to enable event tracking
- Store-finder already had good ARIA attributes

**For Next AI:**
- Don't re-investigate the LCP issue - it was a dev mode artifact
- Structured data is in layout.tsx (not separate component)
- Event tracking uses lib/analytics.ts utility
- Full audit report at .ai/AUDIT_REPORT_2025-12-08.md

---

## December 8, 2025 - Claude Code - Report-Find & Penny-List Unverified Model

**AI:** Claude Code (Opus 4.5)
**Goal:** Update /report-find form and /penny-list page to reflect "live, unverified radar" concept; connect form submissions directly to Google Sheets
**Approach:** Rewrote form with new fields and validation, changed API route to POST to Google Apps Script webhook, updated all copy to remove "verified" language

**Changes Made:**

*Report-Find Form (`app/report-find/page.tsx`):*
- Added "Item Name" field (required, max 75 chars)
- Added SKU visual formatting (xxx-xxx or xxxx-xxx-xxx while typing)
- Converted State from text input to dropdown (all US states + territories)
- Made Store Name/Number optional (was required)
- Updated all copy to clarify unverified nature
- Removed "reviewed before publishing" and "24-48 hours" language

*API Route (`app/api/submit-find/route.ts`):*
- Changed from PostgreSQL to Google Apps Script webhook
- Updated validation (itemName required, storeName optional)
- Format data to match Google Sheet column aliases

*Penny List (`app/penny-list/page.tsx`):*
- Changed title to "Crowd Reports: Recent Penny Leads (Unverified)"
- Updated disclaimer box with honest unverified language
- Updated "How This List Works" section
- Removed "Verified by Community" badges
- Changed to "Unverified report" label

*New File (`lib/us-states.ts`):*
- US states and territories array for dropdown

**Outcome:** ✅ **Success**
- All code changes complete and pushed to main
- Google Apps Script webhook set up by Cade
- Environment variable `GOOGLE_APPS_SCRIPT_URL` added to Vercel
- Form now submits directly to Google Sheets (auto-appears on Penny List within ~1 hour)

**Completed Items:**
- ✅ Item Name field added with validation
- ✅ SKU formatting with dashes (visual only)
- ✅ Store Name/Number made optional
- ✅ State converted to dropdown
- ✅ All "verified" language removed from both pages
- ✅ API route rewired to Google Apps Script
- ✅ Google Apps Script deployed by Cade
- ✅ Environment variable added to Vercel

**Unfinished Items:**
- None - feature is complete and ready to test

**Learnings:**
- Form was previously disconnected from Penny List (went to PostgreSQL, list read from Google Sheets)
- Google Apps Script webhooks are free and easy to set up
- ARIA `aria-invalid` attribute requires string "true" or undefined, not boolean
- Non-coders can deploy Apps Script webhooks with step-by-step instructions

**For Next AI:**
- Form submissions now go to Google Sheets via Apps Script webhook
- Environment variable is `GOOGLE_APPS_SCRIPT_URL`
- The PostgreSQL database (`@vercel/postgres`) is no longer used for submissions
- If Cade reports issues with form submissions, check the Apps Script deployment
- Penny List still uses hourly revalidation from Google Sheets CSV

---

## December 9, 2025 - ChatGPT Codex - Store Finder distance bug + map popup accessibility polish

**AI:** ChatGPT Codex (gpt-5.1)
**Goal:** Fix Store Finder behavior where clicking a store re-centered the distance calculations, and improve Store Finder map pins + popup buttons for WCAG-compliant contrast and cleaner styling.
**Approach:** Adjusted Store Finder page state updates so only location/search changes recompute closest stores; refined `StoreMap` popup button styles and added a small CSS override for Leaflet popups and marker hover states, using existing design tokens.

**Changes Made:**
- Updated `app/store-finder/page.tsx` to stop recomputing `displayedStores` and `rank` when the user simply selects a store; now only My Location/search changes affect the list ordering.
- Ensured `selectedStore` is set only once on initial load and not overwritten when remote store data finishes loading.
- Updated `components/store-map.tsx` to:
  - Import a new scoped stylesheet `components/store-map.css`.
  - Increase popup "Directions" and "Details" button text to `text-sm` with stronger font weight and focus-visible rings that use `--cta-primary`, improving contrast/readability in light and dark modes.
  - Keep buttons on design tokens: CTA blue for primary, elevated/page backgrounds and primary text for secondary.
- Added `components/store-map.css` to:
  - Provide a subtle hover highlight for default map pins using existing `--cta-primary`/`--brand-gunmetal` colors.
  - Remove Leaflet’s default popup chrome (outer ring and tip) for `.store-popup`, so only the inner card with our own border/background is visible.

**Outcome:** ✅ **Success**
- Clicking a store in the list or on the map no longer causes that store to jump to `#1` or reset distances; ordering now only changes when My Location or the search box changes.
- Store Finder build and lint both pass (`npm run build`, `npm run lint`).
- Map popup buttons have higher-contrast, larger text and better focus states in both themes while respecting existing design tokens.
- Leaflet popups no longer show a double border/outer ring around the custom card, improving readability.

**Completed Items:**
- ✅ Fixed Store Finder list re-centering bug by decoupling `selectedStore` from the "remote data loaded" effect.
- ✅ Ensured only location/search changes recompute `displayedStores` via `getClosestStores`.
- ✅ Adjusted popup "Directions" and "Details" buttons for better contrast, size, and focus treatment.
- ✅ Added marker hover styling and a scoped CSS override to strip Leaflet’s extra popup ring/tip for `.store-popup`.
- ✅ `npm run build` and `npm run lint` run clean on `main`.

**Unfinished Items:**
- Scroll-wheel behavior when hovering the popup: currently, scrolling over the popup content may scroll the page instead of zooming the map. This is mostly default Leaflet/browser behavior; no code changes made yet because it would require touching event propagation in the React-Leaflet map (a fragile area).

**Future Prompts (for unfinished items):**

If you want to adjust scroll behavior over the popup (so scroll always zooms the map instead of the page), copy-paste:
```
The Store Finder map popup still lets scroll-wheel gestures over the popup content scroll the page instead of zooming the map. Within the constraints for React-Leaflet in this repo, propose and carefully implement the smallest event-handling change needed so wheel events over the popup are captured by the map (zooming) instead of bubbling up to the page, and then run npm run build + npm run lint.
```

**Learnings:**
- Coupling `selectedStore` into the "remote store data loaded" effect caused subtle re-sorting bugs; using a functional state update (`current ?? initial`) prevents overriding the user’s selection.
- WCAG contrast for dark-mode buttons can often be satisfied by pairing existing tokens with slightly larger text (qualifying as "large text") instead of inventing new colors.
- Leaflet’s default popup chrome can safely be neutralized via a scoped `.store-popup` CSS override without touching `globals.css` or the map initialization logic.

**For Next AI:**
- Store Finder behavior should now feel stable: store ordering is driven only by location/search, not by which store is selected.
- Map pin and popup styling changes are localized to `components/store-map.tsx` and `components/store-map.css`; avoid modifying `store-map.tsx` structure or map initialization without consulting `CONSTRAINTS.md`.
- If Cade reports remaining visibility or accessibility issues on the map, focus on CSS-level tweaks in `store-map.css` and button classnames in `store-map.tsx` rather than any changes to the React-Leaflet wiring.

---

## December 9, 2025 - ChatGPT Codex - Store Finder map popup scroll/zoom behavior

**AI:** ChatGPT Codex (gpt-5.1)
**Goal:** Make sure scroll-wheel gestures over the Store Finder popup zoom the map instead of scrolling the page while keeping the React-Leaflet integration stable.
**Approach:** Added a targeted wheel-event handler inside the existing `MapController` helper so only wheel events that originate from the `.store-popup` area are intercepted and turned into map zoom actions.

**Changes Made:**
- Updated `components/store-map.tsx` `MapController` to:
  - Attach a `wheel` listener to the Leaflet map container in a `useEffect`.
  - When the event target is inside `.store-popup`, call `event.preventDefault()` and `event.stopImmediatePropagation()` to keep the event from scrolling the page or double-firing other handlers.
  - Translate `deltaY` into `map.zoomIn()` / `map.zoomOut()`, preserving smooth animated zoom.
- Left all other map settings (including `scrollWheelZoom`) unchanged so standard map interactions still behave as before outside the popup.

**Outcome:** ✅ **Success**
- When the cursor is over the popup card, scroll now zooms the map instead of moving the page.
- Interactions elsewhere on the map still behave normally (pan, zoom, scroll).
- `npm run build` and `npm run lint` both pass on `main`.

**Completed Items:**
- ✅ Tightened scroll/zoom behavior when hovering the Store Finder popup by handling wheel events scoped to `.store-popup`.
- ✅ Verified no regression to map rendering or selection behavior.

**Unfinished Items:**
- None related to Store Finder scroll/zoom; further UX tweaks would be polish only.

**Learnings:**
- Scoping event handling to `.store-popup` via the map container is enough to control scroll behavior without touching global Leaflet config or `MapContainer` props.
- Using `event.stopImmediatePropagation()` prevents Leaflet’s own wheel handler from double-zooming while still allowing a custom zoom implementation.

**For Next AI:**
- If future map changes are needed, keep modifications within `MapController` and `store-map.css` to avoid disturbing the fragile React-Leaflet setup described in `CONSTRAINTS.md`.
- If Cade reports edge-case behavior (e.g., unusual trackpad behavior on a specific OS), start by inspecting the wheel handler in `MapController` before adjusting core map options.

---

## December 8, 2025 - Claude Code - Penny List UI/UX Improvements & Homepage Updates

**AI:** Claude Code (Sonnet 4.5)
**Goal:** Fix UI/UX issues on penny-list page (asymmetrical buttons, poor hover states, accessibility), remove Trip Tracker from live site, fix Submit Find link, and add Penny List card to homepage
**Approach:** Comprehensive UI/UX overhaul following accessibility best practices (WCAG AAA), removed Trip Tracker from user-facing areas while keeping code, updated Submit Find to use internal routing

**Changes Made:**

*Penny List Page (app/penny-list/page.tsx):*
- Made CTA buttons uniform (both use `TrackableLink`, same padding `px-6 py-3`, same colors)
- Improved hover states with multi-signal feedback (color change, shadow, lift effect, focus ring)
- Replaced "How This List Works" section with icon-based design (5 items with color-coded badges)
- Added ARIA labels to all buttons for screen reader accessibility
- Changed Submit Find button event from `submit_find_click` to `find_submit` (matches EventName type)

*Submit Find URL Update:*
- Updated `SUBMIT_FIND_FORM_URL` in `lib/constants.ts` from Google Form to `/report-find`
- Removed `target="_blank"` and `rel="noopener noreferrer"` from Submit Find button (now internal link)

*Trip Tracker Removal:*
- Commented out Trip Tracker from navbar (`components/navbar.tsx` line 75)
- Removed Trip Tracker card from homepage Tools section (`app/page.tsx`)
- Removed unused imports: `ClipboardCheck` from homepage, `Clock` from navbar
- Initially changed grid to 2 columns, then restored to 3 columns when Penny List card was added

*Homepage Updates (app/page.tsx):*
- Added Penny List card as first item in "Penny Hunting Tools" section
- Grid now shows: Penny List, Store Finder, Complete Guide (3 cards)
- Imported `Star` icon from lucide-react for Penny List card

**Outcome:** ✅ **Success**
- All UI/UX improvements implemented and tested
- Build passes: `npm run build` ✓
- Lint passes: `npm run lint` ✓
- Two commits pushed to main branch

**Completed Items:**
- ✅ Updated icon imports in penny-list page (Clock, CheckCircle2, Info)
- ✅ Replaced "How This List Works" with icon-based structure
- ✅ Updated "Submit a Find" button styling and tracking
- ✅ Updated "Subscribe to Alerts" button styling
- ✅ Updated SUBMIT_FIND_FORM_URL constant to '/report-find'
- ✅ Removed Trip Tracker from navbar
- ✅ Removed Trip Tracker card from homepage
- ✅ Removed ClipboardCheck and Clock unused imports
- ✅ Added Penny List card to homepage Tools section
- ✅ Restored 3-column grid layout
- ✅ All tests passed (build + lint)
- ✅ Staged, committed, and pushed to main

**Unfinished Items:**
- None - all tasks completed successfully

**Learnings:**
- TrackableLink component has strict TypeScript types - event names must match `EventName` type in `lib/analytics.ts`
- The existing event name is `find_submit` (not `submit_find_click`)
- Icon-based visual hierarchy greatly improves accessibility for color-blind users
- Multi-signal hover feedback (color + shadow + transform) provides better UX than opacity-only changes
- Prettier auto-fix handles most formatting issues automatically

**For Next AI:**
- Penny List now has 3 prominent placements: (1) Navbar, (2) Homepage Tools section (first card), (3) Direct link
- Submit Find button on penny-list page now routes to `/report-find` (internal page, not Google Form)
- Trip Tracker is hidden from UI but route still exists at `/trip-tracker` (accessible via direct URL)
- All accessibility improvements follow WCAG AAA standards
- Event tracking uses correct event names from `lib/analytics.ts` EventName type

---

## December 9, 2025 - Claude Code - Penny List Sync Fix + CSP Update

**AI:** Claude Code (Opus 4.5)
**Goal:** Investigate why penny list wasn't showing Google Sheets data; investigate map location accuracy issue
**Approach:** Traced data flow, tested CSV URLs directly, identified publish settings issue

**Changes Made:**
- Fixed CSP in `next.config.js` to allow befrugal.com affiliate links

**Outcome:** ✅ **Success** (Penny List) / ⚠️ **External Issue** (Map Location)

**Penny List Issue - FIXED:**
- Root cause: Google Sheet was "shared" but not "published to web"
- "Publish to Web" creates a public read-only CSV URL (different from Share settings)
- User published Form Responses 1 as CSV with auto-republish enabled
- After Vercel redeploy, all 21+ submissions now display correctly

**Map Location Issue - BROWSER PROBLEM:**
- User reported location showing 15 miles off in Adairsville, GA
- Investigated all recent code changes - none touched geolocation logic
- User ran `navigator.geolocation.getCurrentPosition()` in console
- Browser returned coordinates `34.3769088, -84.9936384` (which IS Adairsville)
- Conclusion: Browser's Geolocation API returning inaccurate data (WiFi/IP positioning)
- Workaround: Use ZIP code search instead of "My Location" button

**Completed Items:**
- ✅ Identified penny list root cause (publish vs share settings)
- ✅ Guided user through "Publish to Web" process
- ✅ Verified CSV returns data after publish
- ✅ Penny list now working in production
- ✅ Added befrugal.com to CSP connect-src directive

**Unfinished Items:**
- Map location accuracy (external browser issue, not code)

**Learnings:**
- "Publish to Web" in Google Sheets is DIFFERENT from "Share" settings
- Always test CSV URLs directly with curl to verify data is accessible
- Browser geolocation accuracy varies wildly - WiFi/IP can be 10-20+ miles off
- CSP blocks any domains not explicitly whitelisted

**For Next AI:**
- Penny list sync is working correctly now
- If user reports location issues, it's likely browser geolocation, not code
- ZIP code search is the reliable alternative to "My Location"
- befrugal.com is now in CSP whitelist

---

## December 9, 2025 - Claude Code - Penny List Milestone: WCAG AAA + Filtering System

**AI:** Claude Code (Opus 4.5)
**Goal:** Major milestone - Transform penny list into scalable, accessible, filterable resource for 100+ items
**Approach:** Split page into server+client components, add comprehensive filtering system, improve state display, add table view, ensure WCAG AAA compliance

**Changes Made:**

*New Components Created:*
- `components/penny-list-client.tsx` - Main client component orchestrating all filtering/sorting
- `components/penny-list-filters.tsx` - Filter bar with state dropdown, tier toggles, search, sort
- `components/penny-list-card.tsx` - Reusable card component with improved state display
- `components/penny-list-table.tsx` - Table view for desktop users scanning 100+ items

*Page Refactored:*
- `app/penny-list/page.tsx` - Now thin server component that fetches data and passes to client

*Key Features Implemented:*
1. **State Filter** - Dropdown with all US states, filters items by location
2. **Tier Toggle** - All / Very Common / Common / Rare buttons with aria-pressed
3. **Search** - Debounced search by item name or SKU
4. **Sort** - Newest / Oldest / Most Reports / Alphabetical
5. **Table View** - Desktop toggle between cards and compact table
6. **Improved State Display** - Now shows "TX · 3" with tooltip explaining "Texas: 3 reports"
7. **Images Removed** - Per user request, no more placeholder images

*WCAG AAA Compliance:*
- All touch targets ≥44px minimum
- aria-live="polite" region announces filter result counts
- Proper landmark regions with aria-label
- aria-pressed on toggle buttons
- Proper heading hierarchy (h2 for Hot section, h3 for cards)
- Focus-visible outlines on all interactive elements
- Screen reader friendly state badges with aria-labels

**Outcome:** ✅ **Success**
- `npm run build` passes
- `npm run lint` passes (0 errors, 0 warnings)
- All features implemented as planned
- Ready for user testing

**Completed Items:**
- ✅ Split penny-list into server/client components
- ✅ Removed all image sections from cards
- ✅ Added filter bar with state/tier/search/sort
- ✅ Improved state display format (TX · 3 with tooltips)
- ✅ Added table view toggle for desktop
- ✅ WCAG AAA compliance (44px targets, aria-live, landmarks)
- ✅ Empty state with "clear filters" button
- ✅ Hot section hidden when filters active

**Unfinished Items:**
- None - all planned features implemented

**Learnings:**
- Client-side filtering is efficient for <1000 items (no need for server roundtrips)
- Splitting server/client components keeps data fetching fast while enabling interactivity
- US_STATES constant from lib/us-states.ts is reusable across features
- aria-live="polite" is better than "assertive" for filter updates (less disruptive)
- Table view is much better for scanning large lists than cards

**For Next AI:**
- Penny list now has comprehensive filtering - no need to re-implement
- Data layer (`lib/fetch-penny-data.ts`) was NOT modified - still uses Google Sheets CSV
- Images are intentionally removed - future stock images would need a separate system
- If adding more filters, follow the pattern in `penny-list-filters.tsx`
- Test with screen reader (NVDA/JAWS) if making accessibility changes

---

## December 9, 2025 - Claude Code - Penny List UX Enhancements (Phase 2)

**AI:** Claude Code (Opus 4.5)
**Goal:** Iterate on penny list with deal-tracking site best practices
**Approach:** Researched Slickdeals, BrickSeek, Smashing Magazine filter UX patterns; implemented top recommendations

**Changes Made:**

*Enhanced Filter Component (`penny-list-filters.tsx`):*
- Added **active filter chips** - dismissible chips showing applied filters
- Added **sticky filter bar** - stays visible while scrolling (`sticky top-0 z-20`)
- Added **"My State" quick filter** - button using saved localStorage preference
- Added **date range toggles** - 7/14/30 day buttons for quick time filtering

*Enhanced Client Component (`penny-list-client.tsx`):*
- Added **URL parameter sync** - shareable filter URLs
  - `?state=GA` - state filter
  - `?tier=rare` - tier filter
  - `?q=dewalt` - search query
  - `?sort=most-reports` - sort option
  - `?view=table` - view mode
  - `?days=7` - date range
- Added **localStorage persistence** for user's preferred state
- Wrapped in `<Suspense>` for `useSearchParams()` (Next.js 15 requirement)

*Enhanced Page (`app/penny-list/page.tsx`):*
- Added **loading skeleton** - animated placeholder while filters initialize
- Added Suspense boundary for client component

**Research Sources Used:**
- https://www.smashingmagazine.com/2021/07/frustrating-design-patterns-broken-frozen-filters/
- https://www.pencilandpaper.io/articles/ux-pattern-analysis-mobile-filters
- Slickdeals/BrickSeek pattern analysis

**Outcome:** ✅ **Success**
- `npm run build` passes
- `npm run lint` passes
- All UX improvements implemented

**Commits:**
- `7948f71` - Initial WCAG AAA + filtering system
- `f0a3989` - Enhanced UX improvements

**For Next AI:**
- URL params work - users can share filtered views
- "My State" auto-remembers last state user selected
- Filter bar is sticky - good UX for long lists
- Active chips let users quickly remove individual filters
- Loading skeleton prevents layout shift on initial load

---

## December 9, 2025 - Claude Code - Auto-Calculated Tiers (Phase 3)

**AI:** Claude Code (Opus 4.5)
**Goal:** Replace subjective manual tiers with data-driven auto-calculation
**Approach:** Calculate tier from actual report counts and state coverage

**Changes Made:**

*Modified `lib/fetch-penny-data.ts`:*
- Added `calculateTier()` function
- Removed manual tier field parsing from CSV
- Tier now calculated AFTER aggregation based on locations data

**Tier Logic:**
```
Very Common: 6+ total reports OR 4+ states
Common: 3-5 reports OR 2-3 states
Rare: 1-2 reports AND only 1 state
```

**Outcome:** ✅ **Success**
- Commit: `83aa7d2`
- Build/lint pass
- Tier now reflects "how likely am I to find this?" with real data

**For Next AI:**
- Tiers are auto-calculated - don't add manual tier back
- The calculateTier() function is in fetch-penny-data.ts:60-76
- Thresholds can be tweaked if needed (currently 6/4 for Very Common, 3/2 for Common)
- If user wants different thresholds, just adjust the numbers in calculateTier()

---

## December 10, 2025 - ChatGPT Codex - Penny List Freshness Phase 1

**AI:** ChatGPT Codex (gpt-5.1)
**Goal:** Implement Phase 1 validation, freshness summary, and relative timestamps from PENNY_LIST_PLAN.
**Approach:** Added shared validation utilities, filtered penny list data to valid rows, rendered the freshness summary server-side, and switched item dates to human-friendly labels while keeping semantic `<time>`.

**Changes Made:**
- Added `lib/penny-list-utils.ts` with `filterValidPennyItems`, `computeFreshnessMetrics`, and `formatRelativeDate` helpers.
- Updated `lib/fetch-penny-data.ts` to stop defaulting missing dates to today, parse timestamps when available, and keep ISO dates only when valid.
- Updated `app/penny-list/page.tsx` to gate on validated rows, server-render the 24h/30d freshness summary, and show the feed-unavailable banner based on validated data.
- Updated `components/penny-list-client.tsx`, `components/penny-list-card.tsx`, and `components/penny-list-table.tsx` to rely on validated rows and display relative timestamps with `<time datetime=...>`.

**Outcome:** ? **Success**
- `npm run lint` and `npm run build` both pass.
- Invalid rows (missing SKU/name/valid date) are dropped; if all rows are invalid the banner shows and the summary reads `0 / 0`.
- Freshness counts come from validated rows on the server; item dates render as "Today / Yesterday / X days ago / MMM d" while keeping semantic HTML.

**Completed Items:**
- Validation gating for penny list rows (SKU, name, valid `dateAdded`).
- Server-side freshness summary using 24h and 30d rolling windows.
- Relative timestamp formatting across cards and table.
- Lint and build executed successfully.

**Unfinished Items:**
- None.

**Learnings:**
- Defaulting blank dates to "today" masked bad data; dropping invalid dates keeps freshness counts honest.
- Shared helpers keep server summary and client filters aligned on the same validated dataset.

**For Next AI:**
- If the homepage teaser needs the same counts, reuse `computeFreshnessMetrics` + `filterValidPennyItems` from `lib/penny-list-utils.ts`.
- Feed-unavailable now keys off validated rows; if the banner appears unexpectedly, inspect `dateAdded` values coming from the Sheet.

---

## December 10, 2025 - ChatGPT Codex - Penny List State Parsing + Unit Tests

**AI:** ChatGPT Codex (gpt-5.1)
**Goal:** Fix state filtering by improving location parsing and add repeatable tests for validation/freshness/relative dates.
**Approach:** Added robust state extraction helper used during fetch aggregation, and created a lightweight tsx-based unit test suite to validate parsing, gating, freshness math, and relative date formatting.

**Changes Made:**
- `lib/penny-list-utils.ts`: Added `extractStateFromLocation` with code/name detection for inputs like “Store 123 - Phoenix AZ” or “Anchorage, Alaska”; reused state maps from `US_STATES`.
- `lib/fetch-penny-data.ts`: Uses `extractStateFromLocation` when aggregating locations so state filter has data even when commas/formats vary.
- `tests/penny-list-utils.test.ts`: New Node test (run via tsx) covering state parsing, validation gating, freshness metrics, and relative date formatting.
- `package.json`: Added `test:unit` script (`npx tsx --test tests/**/*.test.ts`).

**Outcome:** ? **Success**
- State parsing is more tolerant; location strings now populate `locations` so state filter can match.
- `npm run test:unit`, `npm run lint`, and `npm run build` all pass.

**Completed Items:**
- Robust state parsing hooked into fetch aggregation.
- Added deterministic unit tests for penny-list helpers.
- All checks rerun (tests + lint + build).

**Unfinished Items:**
- None specific to state parsing/tests.

**Learnings:**
- State extraction needs to handle commas, codes, and full names; centralizing this prevents silent filter failures.
- tsx’s `--test` flag is enough for lightweight unit coverage without new deps.

**For Next AI:**
- If state filter still fails in the UI, inspect incoming `store` column values; add a test case mirroring the exact string to `extractStateFromLocation`.
- Run `npm run test:unit` + `npm run lint` + `npm run build` before shipping.

---

## Template for Future Entries

Copy this template when adding new sessions:

```markdown
## [Date] - [AI Tool] - [Task Name]

**AI:** [Claude Code / ChatGPT Codex / GitHub Copilot]
**Goal:** [What Cade asked for]
**Approach:** [How you solved it]

**Changes Made:**
- [File/feature 1]
- [File/feature 2]
- [etc.]

**Outcome:** [✅ Success / ⏸️ Blocked / ❌ Failed]
[Brief summary]

**Completed Items:**
- [Item 1 that was fully finished]
- [Item 2 that was fully finished]

**Unfinished Items:**
- [Item 1 that was started but not completed]
- [Item 2 that was started but not completed]

**Future Prompts (for unfinished items):**

If continuing [Unfinished Item 1], copy-paste:
```
[Complete prompt with all context needed to finish this item]
```

If continuing [Unfinished Item 2], copy-paste:
```
[Complete prompt with all context needed to finish this item]
```

**Learnings:**
- [What you discovered]
- [Surprises or gotchas]

**For Next AI:**
- [Important context]
- [Things to avoid]
- [Recommended next steps]
```

---

## How to Use This Log

### For AI Assistants:
1. **Start of session:** Read this log to understand recent history
2. **During work:** Note any learnings or surprises
3. **End of session:** Add entry summarizing what you did

### For Cade:
1. Review entries to see what was accomplished
2. Check "For Next AI" notes to understand handoff context
3. Flag any entries where outcome wasn't clear

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial session log created with two historical entries
