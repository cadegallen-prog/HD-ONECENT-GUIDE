# Testing & QA Checklist

**Purpose:** Comprehensive testing procedures for all code changes to ensure stability, performance, accessibility, and UX quality.

**Philosophy:** "Repetition is how we improve and commit to memory and correct mistakes and find mistakes." — User directive

**Status:** Living document — update as new test scenarios discovered

---

## Pre-Deployment Checklist

Use this checklist before any `dev` → `main` merge:

### 1. Build & Lint Validation
```powershell
# Must pass with 0 errors, 0 warnings
npm run build
npm run lint
npm run test:unit  # If unit tests exist
```

**Success criteria:**
- ✅ Build: All routes compile successfully
- ✅ Lint: 0 ESLint warnings
- ✅ Tests: 100% pass rate (if tests exist)
- ✅ TypeScript: No type errors

---

### 2. Local Manual Testing

#### 2.1 Desktop Testing (1920×1080)

**Browser: Chrome**
```
1. Load http://localhost:3001
2. Navigate through all main pages:
   - Home (/)
   - About (/about)
   - Guide (/guide)
   - Penny List (/penny-list)
   - Store Finder (/store-finder)
   - FAQ (/faq)
3. Test interactive elements:
   - Navigation menu
   - Theme toggle (light ↔ dark)
   - Search/filter functionality
   - Map interactions (store finder)
   - Form submissions
4. Check for console errors (F12)
5. Verify images load
6. Test affiliate links open in new tab
```

**Expected:**
- No console errors
- All pages load in <3 seconds
- Navigation smooth
- Theme toggle works instantly
- Forms validate correctly

#### 2.2 Mobile Testing (375×667 - iPhone SE)

**Using Chrome DevTools:**
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" preset
4. Test same flow as desktop
5. Check touch targets ≥44×44px
6. Verify text ≥16px (minimum)
7. Test horizontal scroll on tables
8. Verify mobile menu works
```

**Expected:**
- No horizontal overflow (except intentional table scroll)
- Touch targets adequately sized
- Text readable without zoom
- Mobile menu toggles correctly
- Sticky headers work properly

#### 2.3 Tablet Testing (768×1024 - iPad)

**Using Chrome DevTools:**
```
1. Select "iPad" preset
2. Test landscape and portrait
3. Verify layout adapts correctly
4. Check no awkward in-between breakpoints
```

---

### 3. Responsive Breakpoint Testing

Test at specific widths to catch breakpoint issues:

| Width | Device Class | Key Checks                           |
|-------|--------------|--------------------------------------|
| 320px | Small phone  | Content visible, no overflow         |
| 375px | iPhone SE    | Most common mobile, all features work|
| 414px | Large phone  | Comfortable reading                  |
| 768px | Tablet       | Layout transitions correctly         |
| 1024px| Small laptop | Desktop layout starts                |
| 1280px| Laptop       | Optimal desktop experience           |
| 1920px| Desktop      | No excessive whitespace              |

**How to test:**
```typescript
// Use Chrome DevTools MCP
chr_new_page({ url: "http://localhost:3001" })
chr_resize_page({ width: 320, height: 568 })
// Take notes on layout issues
chr_resize_page({ width: 768, height: 1024 })
// Continue for each breakpoint
```

---

### 4. Network Performance Testing

#### 4.1 Slow 3G Simulation

**Purpose:** Test experience on poor connections (rural areas, old devices)

```typescript
// Using Chrome DevTools MCP
chr_new_page({ url: "http://localhost:3001" })
chr_emulate({ networkConditions: "Slow 3G" })
chr_wait_for({ text: "Home Depot", timeout: 10000 })
chr_list_network_requests()
```

**Check for:**
- Loading states visible
- No layout shift as content loads
- Images use correct sizes (no 4K images on mobile)
- Critical content loads first
- No timeout errors

#### 4.2 Fast 3G Simulation

**Purpose:** Average mobile experience

```typescript
chr_emulate({ networkConditions: "Fast 3G" })
// Repeat navigation flow
```

**Expected:**
- Page interactive in <5 seconds
- No blocking resources
- Progressive enhancement working

---

### 5. Accessibility Testing

#### 5.1 Keyboard Navigation

**Manual test:**
```
1. Tab through entire page (no mouse)
2. Verify focus indicator visible on ALL elements
3. Check tab order logical
4. Test Enter/Space activates buttons
5. Test Escape closes modals/menus
6. Test arrow keys in custom components
```

**Success criteria:**
- All interactive elements reachable via keyboard
- Focus indicator WCAG AAA compliant (3:1 contrast)
- No focus traps
- Logical tab order (left→right, top→bottom)

#### 5.2 Screen Reader Testing

**Windows + NVDA (free):**
```
1. Install NVDA screen reader
2. Navigate site with screen reader on
3. Listen to how content is announced
4. Verify:
   - Images have alt text
   - Links describe destination
   - Buttons describe action
   - Form labels associated correctly
   - Landmarks (nav, main, footer) present
```

**Success criteria:**
- All images have descriptive alt text (or role="presentation" if decorative)
- Links describe destination ("Learn about penny items", not "Click here")
- Form fields have labels
- Error messages announced
- Status changes announced (e.g., "Loading complete")

#### 5.3 Color Contrast

**Manual check:**
```
1. Open page in light mode
2. Verify all text meets WCAG AAA (7:1 normal, 4.5:1 large)
3. Switch to dark mode
4. Repeat contrast checks
5. Check focus indicators (3:1 minimum)
```

**Use browser extension:** "WCAG Color Contrast Checker"

**Expected:**
- All text passes WCAG AAA
- Focus indicators pass WCAG AA (3:1)
- UI components pass WCAG AA (3:1)

---

### 6. Cross-Browser Testing

#### 6.1 Chrome (Primary)
- Latest version
- Most users use this
- Test all features here first

#### 6.2 Firefox
- Latest version
- Test CSS Grid/Flexbox edge cases
- Verify font rendering

#### 6.3 Safari (macOS/iOS)
- Latest version
- Test webkit-specific CSS
- Verify date inputs work
- Check -webkit-line-clamp

#### 6.4 Edge
- Latest version
- Usually same as Chrome
- Quick sanity check

**Testing priority:**
1. Chrome (80% of users)
2. Safari (15% of users)
3. Firefox (3% of users)
4. Edge (2% of users)

---

### 7. Core Web Vitals Testing

**Manual Lighthouse audit:**
```powershell
# Run production build locally
npm run build
npm start  # If start script exists, else deploy to Vercel

# Open Chrome DevTools
# Lighthouse tab → Generate report (Mobile + Desktop)
```

**Target scores:**

| Metric | Target | Critical |
|--------|--------|----------|
| Performance | 90+ | 80+ |
| Accessibility | 100 | 95+ |
| Best Practices | 100 | 95+ |
| SEO | 100 | 95+ |

**Core Web Vitals:**

| Metric | Target | Critical |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | <2.5s | <4.0s |
| FID (First Input Delay) | <100ms | <300ms |
| CLS (Cumulative Layout Shift) | <0.1 | <0.25 |

**If scores drop:**
- Identify regression in Lighthouse report
- Check network tab for slow resources
- Verify images optimized
- Check for render-blocking scripts

---

### 8. Feature-Specific Testing

#### 8.1 Penny List Table/Cards

**Test scenarios:**
```
1. Load /penny-list
2. Verify data loads (check for 50+ items)
3. Test sorting:
   - Click "Location" column → sorts A-Z
   - Click again → sorts Z-A
4. Test filtering:
   - Select state → table filters
   - Clear filter → shows all
5. Test SKU copy button:
   - Click "Copy" → clipboard contains SKU
   - Toast notification appears
6. Test responsive:
   - Desktop: Table view
   - Mobile: Card view (stacked)
7. Test "Hot Right Now" section:
   - Shows most recent 24h reports
   - Updates when data refreshes
```

**Expected behavior:**
- Sorting instant (<100ms perceived)
- Filtering instant
- Copy button works reliably
- Layout switches at 768px breakpoint
- No data loss during sorting/filtering

#### 8.2 Store Finder Map

**Test scenarios:**
```
1. Load /store-finder
2. Verify map renders with markers
3. Test search:
   - Enter "90210" → map centers on Beverly Hills
   - Shows nearby stores
4. Test state filter:
   - Select "California" → shows only CA stores
   - Map bounds adjust
5. Test marker clicks:
   - Click marker → popup opens
   - Popup shows store details
   - "Get Directions" link works
6. Test mobile:
   - Map responsive
   - Touch gestures work (zoom, pan)
   - Search field usable
```

**Expected behavior:**
- Map loads in <3 seconds
- Search geocodes correctly
- Markers cluster at low zoom
- Popups render correctly
- No console errors from Leaflet

#### 8.3 Theme Toggle

**Test scenarios:**
```
1. Load site (default theme)
2. Click theme toggle
3. Verify:
   - All colors switch instantly
   - No flash of unstyled content
   - Preference persisted (localStorage)
4. Refresh page
5. Verify theme persists
6. Test system preference:
   - Set OS to dark mode
   - Clear localStorage
   - Load site → should match OS
```

**Expected behavior:**
- Toggle instant (<50ms)
- No layout shift
- Theme persists across pages
- Respects OS preference if no localStorage

#### 8.4 Affiliate Links (BeFrugal)

**Test scenarios:**
```
1. Navigate to /cashback
2. Click "Activate Cashback" button
3. Verify:
   - Opens in new tab (target="_blank")
   - URL includes affiliate tracking
   - No CORS errors in console
4. Test from different pages:
   - Home page "Support" card
   - Navigation menu
   - Footer link
5. Verify tracking:
   - Check analytics for click event
   - Verify referral parameter present
```

**Expected behavior:**
- Link opens in new tab
- URL: /go/befrugal with proper redirect
- No CORS errors (link is <a>, not fetch)
- Analytics tracks click
- User lands on BeFrugal.com

---

### 9. Data Validation Testing

#### 9.1 Penny List Data Quality

**Run unit tests:**
```powershell
npm run test:unit
```

**Manual spot checks:**
```
1. Load penny list
2. Check first 10 items:
   - Dates are valid (not "Invalid Date")
   - SKUs are numeric (12 digits)
   - Locations have city, state
   - Report counts are positive integers
3. Check edge cases:
   - Items with 0 crowd reports (should show)
   - Items with 100+ reports (should show)
   - Items from 30+ days ago (should show but marked old)
```

**Expected:**
- All dates formatted correctly ("2 days ago", "3 weeks ago")
- No "NaN" or "undefined" displayed
- Freshness badges accurate (24h = "Hot", 7d = "Fresh", 30d = "Active")

#### 9.2 Store Data Quality

**Spot checks:**
```
1. Open /store-finder
2. Search for known store (e.g., "Hollywood")
3. Verify:
   - Store name matches reality
   - Address correct
   - Phone number formatted
   - Hours displayed (if available)
4. Click 5 random markers:
   - All have valid data
   - No duplicate entries
   - Coordinates match address
```

---

### 10. Error Handling Testing

#### 10.1 Network Errors

**Simulate offline:**
```typescript
// Using Chrome DevTools
chr_emulate({ networkConditions: "Offline" })
chr_navigate_page({ url: "http://localhost:3001/penny-list" })
```

**Expected:**
- Graceful error message ("Unable to load data")
- No crash or blank screen
- Retry option available

#### 10.2 Invalid URLs

**Test:**
```
1. Navigate to /nonexistent-page
2. Verify 404 page renders
3. Check 404 has:
   - Clear message ("Page not found")
   - Link back to home
   - Navigation intact
```

#### 10.3 Form Validation

**Test:**
```
1. Find any form (e.g., report submission)
2. Submit empty form
3. Verify:
   - Validation errors shown
   - Errors specific ("SKU is required", not "Invalid input")
   - Focus moves to first error
4. Fill form incorrectly:
   - Enter text in number field
   - Enter invalid date
   - Enter too-long string
5. Verify field-level validation
6. Fix errors and submit
7. Verify success message
```

---

### 11. SEO & Meta Tags Testing

**Manual checks:**
```
1. View page source (Ctrl+U)
2. Verify present:
   - <title> unique per page
   - <meta name="description"> unique per page
   - <meta property="og:*"> for social sharing
   - <link rel="canonical"> correct
   - Structured data (JSON-LD) if applicable
3. Test social sharing:
   - Paste URL in Facebook, Twitter, LinkedIn
   - Verify preview looks correct
```

**Tools:**
- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector

---

### 12. Production Verification (Post-Merge)

After merging `dev` → `main` and deploying to Vercel:

**Deployment checks:**
```
1. Visit https://pennycentral.com
2. Verify changes live
3. Check Vercel dashboard:
   - Deployment succeeded
   - No build errors
   - Correct branch deployed (main)
4. Test primary user flows on production:
   - Home → Penny List → Store Finder
   - Theme toggle
   - Affiliate link
5. Check production console for errors
6. Verify analytics tracking
```

**Rollback procedure if broken:**
```
1. Go to Vercel dashboard
2. Find previous successful deployment
3. Click "..." → "Redeploy"
4. Fix issue in dev branch
5. Test thoroughly before re-deploying
```

---

### 13. Regression Testing

**After any change to:**

| Component Changed | Test These Areas                              |
|-------------------|-----------------------------------------------|
| globals.css       | All pages (colors, typography, layout)        |
| layout.tsx        | Navigation, theme, fonts on all pages         |
| navbar.tsx        | Navigation menu, mobile menu, theme toggle    |
| penny-list-*.tsx  | Penny list table, cards, sorting, filtering   |
| store-map.tsx     | Store finder map, search, markers             |
| constants.ts      | Any component using changed constant          |

**Principle:** If you change a shared file, test all consumers.

---

## Performance Benchmarking

### Baseline Metrics (Record After Each Major Change)

**Desktop (1920×1080, Fast WiFi):**
- Home page load: _____ms
- Penny list load: _____ms
- Store finder load: _____ms
- Lighthouse Performance: ____/100

**Mobile (iPhone SE, Fast 3G):**
- Home page load: _____ms
- Penny list load: _____ms
- Store finder load: _____ms
- Lighthouse Performance: ____/100

**How to measure:**
```
1. Open DevTools → Network tab
2. Enable throttling (if testing mobile)
3. Hard refresh (Ctrl+Shift+R)
4. Note "Load" time in Network tab
5. Record Lighthouse scores
```

**Compare against baseline:**
- Performance regression >10%: Investigate before merging
- Performance improvement: Celebrate and document

---

## Visual Regression Checklist

**Since automated visual regression testing not available, use manual checklist:**

### Before Change (Screenshots)
```
1. Take screenshots of affected pages:
   - Full page (scroll capture)
   - Key components (close-up)
   - Light and dark mode
   - Desktop, tablet, mobile viewports
2. Save to /docs/visual-baseline/ (if creating such a folder)
```

### After Change (Comparison)
```
1. Take same screenshots
2. Compare side-by-side:
   - Layout differences
   - Color changes
   - Typography changes
   - Spacing differences
3. Verify changes intentional
4. Document unintended changes as bugs
```

**Tools:**
- Windows Snipping Tool
- Chrome Full Page Screenshot extension
- Manual side-by-side in image viewer

---

## Automated Testing Future

**When to add automated tests:**
- Critical user flows (penny list, store finder)
- Complex logic (data validation, filtering)
- Frequently broken areas
- Before major refactors

**Test types to consider:**
- Unit tests (lib/*, existing pattern)
- Integration tests (Playwright, existing setup)
- Visual regression (Percy, Chromatic — if budget allows)
- Performance tests (Lighthouse CI)

---

## Common Bug Patterns to Check

**Based on past issues:**

1. **CSS line-clamp without utility class**
   - Triggers ESLint inline-style warning
   - Always create CSS class for line-clamping

2. **Midnight date parsing in rolling windows**
   - 30-day window calculations off by 1 day
   - Account for 00:00:00 vs specific time

3. **CORS errors on affiliate redirects**
   - Never fetch/prefetch affiliate links
   - Use plain <a> tags only

4. **Deployment branch confusion**
   - Changes in `dev` don't deploy automatically
   - Must merge to `main` and push to remote

5. **Prettier multi-line element formatting**
   - Long JSX elements must be multi-line
   - Check Prettier config before committing

6. **Zinc palette color inconsistency**
   - Use zinc-100/800 for backgrounds
   - Use zinc-300/700 for borders
   - Don't mix with slate/gray/stone

7. **Focus indicator visibility**
   - Always visible on keyboard focus
   - 3:1 contrast minimum
   - Don't set outline: none without custom indicator

---

## Testing Anti-Patterns (What NOT to Do)

❌ **Skip build verification**
- Always run `npm run build` before declaring done
- Catches TypeScript errors dev mode misses

❌ **Test only desktop**
- Mobile is 60%+ of traffic
- Test mobile-first

❌ **Assume dark mode works**
- Dark mode color variables can differ
- Test both modes explicitly

❌ **Ignore console errors**
- Every console.error is a bug
- Fix warnings before they become errors

❌ **Test only happy path**
- Edge cases break first
- Test empty states, errors, extreme values

❌ **Change multiple things at once**
- Hard to identify what broke
- Make small, testable changes

❌ **Trust localhost === production**
- Production has different caching, CDN, env vars
- Always verify on live site after deploy

---

## Appendix: Testing Tools Reference

### Built-in Tools
- **npm scripts**: `build`, `lint`, `test:unit`
- **TypeScript compiler**: Type checking
- **ESLint**: Code quality
- **Prettier**: Code formatting

### Browser Tools
- **Chrome DevTools**: Network, Performance, Lighthouse
- **Firefox Developer Tools**: CSS Grid inspector
- **Safari Web Inspector**: Webkit-specific debugging

### MCP Tools (Available via ChatGPT CodeX)
- **chrome-devtools MCP**: Automated browser testing
- **pylance MCP**: Python script validation
- **git MCP**: Version control checks

### External Tools (Optional)
- **NVDA**: Free screen reader (Windows)
- **WAVE**: Browser extension for accessibility
- **Lighthouse CI**: Automated performance tracking
- **Vercel Analytics**: Real user monitoring

---

## Version History

- **v1.0 (Dec 10, 2025):** Initial comprehensive testing checklist
  - Pre-deployment checklist
  - Device/browser/network testing
  - Accessibility testing
  - Feature-specific scenarios
  - Performance benchmarking
  - Visual regression manual process
  - Common bug patterns
  - Testing anti-patterns
