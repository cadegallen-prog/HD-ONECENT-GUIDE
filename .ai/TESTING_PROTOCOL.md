# Testing Protocol

**Purpose:** How to verify your work before claiming "done."

---

## Quick Verification (Every Task)

**Run all 4 tests** and paste output:

```bash
npm run lint      # 0 errors
npm run build     # successful
npm run test:unit # all passing
npm run test:e2e  # all passing
```

**If you touched styles/colors:** also paste `npm run lint:colors` output and confirm no raw Tailwind palette colors were introduced.

**Success criteria:**

- ✅ Build: All routes compile successfully
- ✅ Lint: 0 ESLint warnings
- ✅ test:unit: 100% pass rate
- ✅ test:e2e: Playwright passes
- ✅ TypeScript: No type errors

---

## UI Changes (Additional Verification)

### Playwright Screenshots Required

**When required:**
- All UI changes (buttons, forms, layouts, colors)
- All JavaScript changes (Store Finder, interactive features)
- All "bug fixed" claims (visual bugs need proof)

**Required steps:**

1. Navigate: `http://localhost:3001/[page]`
2. Screenshot BEFORE
3. Make changes
4. Screenshot AFTER
5. Check console errors (F12 → Console tab)
6. Test light + dark mode
7. Show user: "Does this match?"

### Manual Checks

**Typography & Touch:**
- Text ≥16px body, ≥12px minimum
- Touch targets ≥44px
- Line height ≥1.6

**Contrast:**
- Text meets WCAG AAA (7:1 for normal text, 4.5:1 for large)
- UI elements ≥3:1 (buttons, borders, focus rings)

**Responsive:**
- Test mobile viewport (375×667 - iPhone SE)
- Test desktop viewport (1920×1080)
- Horizontal scroll on tables works
- Mobile menu works

---

## Claiming Done Template

```markdown
## Verification

**Tests:**
- lint: ✅ 0 errors
- build: ✅ success
- test:unit: ✅ 1/1 passing
- test:e2e: ✅ 28/28 passing

**Playwright:**
- Before: [screenshot]
- After: [screenshot]
- Console: no errors
- Modes: light + dark tested

**GitHub Actions:**
- ✅ https://github.com/.../runs/12345

**Problem fixed:**
- Before: [describe/screenshot]
- After: [describe/screenshot]
```

**Use this template. No shortcuts.**

---

## Full QA (Pre-Merge)

Use this checklist before any `dev` → `main` merge or significant change:

### 1. Build & Lint Validation

```powershell
npm run build
npm run lint
npm run test:unit

# Start server for accessibility checks
# Preferred: reuse dev server on port 3001
# Set BASE_URL=http://localhost:3001 if needed

# Accessibility + visual smoke (requires server running)
npm run check-contrast
npm run check-axe
npm run test:e2e  # Playwright (artifacts in reports/playwright/)
```

**Success criteria:**

- ✅ Build: All routes compile successfully
- ✅ Lint: 0 ESLint warnings
- ✅ Tests: 100% pass rate
- ✅ TypeScript: No type errors
- ✅ Contrast: `npm run check-contrast` passes
- ✅ Axe: `npm run check-axe` passes
- ✅ Playwright: `npm run test:e2e` passes

### 2. Local Manual Testing

**Desktop (1920×1080 - Chrome):**

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

**Expected:**
- No console errors
- All pages load in <3 seconds
- Navigation smooth
- Theme toggle works instantly
- Forms validate correctly

**Mobile (375×667 - iPhone SE via Chrome DevTools):**

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" preset
4. Test same flow as desktop
5. Check touch targets ≥44×44px
6. Verify text ≥16px (minimum)
7. Test horizontal scroll on tables
8. Verify mobile menu works

**Expected:**
- All touch targets tappable
- Text readable without zoom
- No horizontal page scroll (only tables)
- Mobile menu opens/closes smoothly

### 3. Documentation Updated

**Required updates:**

- `SESSION_LOG.md` (always update)
- `STATE.md` (if meaningful change)
- `BACKLOG.md` (if priorities moved)

**Optional updates:**

- `CHANGELOG.md` (for significant work)
- `docs/` files (if features changed)

---

## Port 3001 Check

**CRITICAL:** Before starting any task, check if dev server is running.

```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# IF RUNNING → USE IT (don't kill)
# IF NOT → npm run dev
```

**Never kill port 3001 unless:**
- User explicitly asks you to restart it
- Process is hung/broken (not responding)
- You've asked user permission first

**Default assumption:** If port 3001 is occupied = user is running server intentionally. Use it.

---

## Next Step

After verifying your work, update documentation and report back to the user with proof.
