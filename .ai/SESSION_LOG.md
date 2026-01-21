---

## 2026-01-21 - Claude Code - My List Phase 2: Guest Preview & Auth Intent Persistence

**Goal:** Remove the guest redirect wall on `/lists` and ensure "Save" actions survive the login process.
**Status:** ✅ Complete (ready for testing).

### Changes

**1. Guest Preview UI (`app/lists/page.tsx`):**
- Removed redirect wall (previously redirected to `/login?redirect=/lists`)
- Added locked preview UI for unauthenticated users:
  - Hero section with "My List" branding and lock icon
  - Three benefit bullets explaining in-store value
  - Primary CTA: "Sign in to use My List" (links to `/login?redirect=/lists`)
  - OTP reassurance: "No password. We'll email you a one-time code."
  - Secondary CTA: "Browse Penny List"
  - Sample items section: fetches 6 real items from `/api/penny-list?perPage=25` and displays them
- Guest preview preserves any `pc_*` intent params in the login redirect URL

**2. Intent Persistence (`components/add-to-list-button.tsx`):**
- Updated guest click handler to redirect to:
  - `/login?redirect=/lists?pc_intent=save_to_my_list&pc_sku=${sku}&pc_intent_id=${crypto.randomUUID()}`
- Intent params structure:
  - `pc_intent`: "save_to_my_list"
  - `pc_sku`: the SKU being saved
  - `pc_intent_id`: random UUID for idempotency

**3. Resume Logic (`app/lists/page.tsx`):**
- Added intent resume logic that executes after login:
  - Checks for `pc_intent=save_to_my_list` params
  - Uses sessionStorage idempotency guard: `pennycentral_intent_consumed_v1_${intentId}`
  - Attempts to save item via `addSkuToListSmart(sku)`
  - Shows success toast: "Item saved to My List"
  - Cleans URL via `router.replace("/lists")` to prevent refresh loops
- Prevents re-execution on page refresh using sessionStorage flag

**4. Branding Consistency:**
- All new copy uses "My List" (singular):
  - Guest preview hero: "My List"
  - Primary CTA: "Sign in to use My List"
  - Success toast: "Item saved to My List"
  - Benefit bullets reference "My List" features

### Files Modified

- `components/add-to-list-button.tsx` (1 edit: guest redirect with intent params)
- `app/lists/page.tsx` (4 edits: imports, state, intent resume logic, guest preview UI)

### Technical Details

- **Idempotency:** Uses `sessionStorage` + random UUID to prevent duplicate saves on refresh
- **URL cleaning:** `router.replace("/lists")` removes intent params after save to prevent loops
- **Sample items:** Fetches from existing `/api/penny-list` endpoint (min 25, displays first 6)
- **Preview mode:** Preserves intent params in login redirect so save can complete after auth

### Verification

Next steps:
- Test guest flow: click Save → redirected to Login → auto-saved after auth
- Verify preview UI renders sample items correctly
- Test idempotency: refresh after login shouldn't re-save
- Verify URL cleaning: intent params should be removed after save
- Test mobile UX: ensure preview UI is readable on small screens

### Phase 2 Plan Reference

- `.ai/plans/my-list-elevation.md` - Full elevation plan (Phases 1-3)
- Phase 1 status: ✅ Complete (visual identity + mobile excellence)
- Phase 3 status: Not started (savings calculator, offline mode, performance)

---

## 2026-01-21 - GitHub Copilot - SKU detail: layout & identifier label fix

**Goal:** Stack the "Report this find" CTA beneath the product image on SKU pages and simplify the "Internet #" identifier to the concise form (`Internet #:`) so it reads like `Internet #: 1234567890`.

**Status:** ✅ Complete + verified (lint/build/unit/e2e)

### Changes

- `app/sku/[sku]/page.tsx`:
  - Add `flex-col` to the image container so the "Report this find" CTA stacks under the image (fixes the CTA appearing to the right on some viewports).
  - Simplify the Internet identifier label to `Internet #:` and remove the extra explanatory paragraph so the identifier reads as a single inline label + value.
- Ran Prettier across the repo for consistency (formatting-only changes applied to docs/scripts).

### Files Modified

- `app/sku/[sku]/page.tsx` (layout + label changes)
- Misc: formatting updates (Prettier) across docs & scripts

### Verification

- Commit: `4fe4737`
- `npm run lint`: passed (no warnings)
- `npm run build`: compiled successfully (Next.js production build)
- `npm run test:unit`: 26 tests passed
- `npm run test:e2e`: 100 tests passed
- Proof screenshots: `reports/proof/2026-01-21T12-10-06/sku-1006518932-ui-light.png` and `...-ui-dark.png` (shows CTA stacked under the image)

---

## 2026-01-21 - Claude Code - My List Phase 1: Visual Identity & Mobile Excellence

**Goal:** Refactor the UI to use "My List" (singular) branding, swap icons to Hearts, and resolve mobile accessibility issues.
**Status:** ✅ Complete (ready for UI verification).

### Changes

**1. Visual Identity (Singular "My List" Branding):**

- `components/add-to-list-button.tsx`:
  - Replaced `Bookmark`/`BookmarkCheck` icons with `Heart` icon
  - Implemented fill logic: unsaved = `fill="none"`, saved = `fill="currentColor"`
  - Updated all labels to "My List" (singular):
    - aria-labels: "Save to My List" / "Remove from My List"
    - Dropdown header: "Save to My List"
    - Toasts: "Added to My List" / "Removed from My List"
- `components/penny-list-client.tsx`:
  - Mobile bottom bar: Changed label from "My Lists" to "My List"
  - Mobile bottom bar: Changed icon from `Bookmark` to `Heart`
  - Disclaimer card: Updated icon from `Bookmark` to `Heart`
  - Disclaimer card: Updated copy to reference "heart icon" and "My List"

**2. Mobile Excellence (44px Touch Targets):**

- `components/penny-list-card.tsx`:
  - Updated secondary action row (Home Depot, Barcode, Save buttons):
    - Mobile: `min-h-[44px]` (meets Apple Human Interface Guidelines)
    - Desktop: `sm:min-h-[36px]` (preserves density)
  - Save button icon: `min-w-[44px] sm:min-w-[36px]` (consistent sizing)

**3. Navigation & Active States:**

- `components/navbar.tsx`:
  - Added "My List" to navigation with `Heart` icon
  - Implemented prefix-safe active state logic: `pathname === "/lists" || pathname.startsWith("/lists/")`
  - Applies to both desktop and mobile navigation
- `components/command-palette.tsx`:
  - Added "My List" to Tools group with `Heart` icon
  - Path: `/lists`

### Files Modified

- `components/add-to-list-button.tsx` (14 edits: icon swap, fill logic, all label updates)
- `components/penny-list-client.tsx` (3 edits: mobile bar, disclaimer)
- `components/penny-list-card.tsx` (3 edits: tap target heights)
- `components/navbar.tsx` (3 edits: navigation item, active state logic)
- `components/command-palette.tsx` (2 edits: tools group entry)

### Verification

Next steps:

- Run UI verification for mobile and desktop views
- Test Heart icon fill states (unsaved vs saved)
- Verify 44px tap targets on mobile devices
- Confirm navbar active state on `/lists` and `/lists/[id]` routes
- Ensure all "My List" singular labels are consistent

---

## 2026-01-19 - Claude Code - Ezoic Ads.txt Multi-Network Setup

**Goal:** Add Ezoic seller entries to ads.txt so Ezoic can serve ads alongside existing Monumetric and Google AdSense networks.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- `public/ads.txt`: Added 81 Ezoic seller entries (ezoic.ai, ezoic.co.uk + partner RESELLER entries)
- Added section headers for clarity: Monumetric (lines 1-385), Google AdSense (line 386), Ezoic (lines 387-467)
- Total entries: 386 → 467 lines
- All three ad networks now coexist without conflict

### How It Works

- Ezoic entries include DIRECT entries for ezoic.ai and ezoic.co.uk with publisher ID: `340070a564f232b255d5df36e55dbbfb`
- Ezoic partner RESELLER entries for themediagrid, sonobi, google.com, yahoo.com, smartadserver, rubiconproject, etc.
- All existing Monumetric and Google AdSense entries preserved exactly as-is
- Ezoic dashboard should show "ads.txt properly configured" within 24-48 hours after crawling

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (26/26 passing)
✅ `npm run test:e2e` (100/100 passing)

**Goal:** Refactor the UI to use "My List" (singular) branding, swap icons to Hearts, and resolve mobile accessibility issues.
**Status:** ✅ Complete (ready for UI verification).

### Changes

**1. Visual Identity (Singular "My List" Branding):**

- `components/add-to-list-button.tsx`:
  - Replaced `Bookmark`/`BookmarkCheck` icons with `Heart` icon
  - Implemented fill logic: unsaved = `fill="none"`, saved = `fill="currentColor"`
  - Updated all labels to "My List" (singular):
    - aria-labels: "Save to My List" / "Remove from My List"
    - Dropdown header: "Save to My List"
    - Toasts: "Added to My List" / "Removed from My List"
- `components/penny-list-client.tsx`:
  - Mobile bottom bar: Changed label from "My Lists" to "My List"
  - Mobile bottom bar: Changed icon from `Bookmark` to `Heart`
  - Disclaimer card: Updated icon from `Bookmark` to `Heart`
  - Disclaimer card: Updated copy to reference "heart icon" and "My List"

**2. Mobile Excellence (44px Touch Targets):**

- `components/penny-list-card.tsx`:
  - Updated secondary action row (Home Depot, Barcode, Save buttons):
    - Mobile: `min-h-[44px]` (meets Apple Human Interface Guidelines)
    - Desktop: `sm:min-h-[36px]` (preserves density)
  - Save button icon: `min-w-[44px] sm:min-w-[36px]` (consistent sizing)

**3. Navigation & Active States:**

- `components/navbar.tsx`:
  - Added "My List" to navigation with `Heart` icon
  - Implemented prefix-safe active state logic: `pathname === "/lists" || pathname.startsWith("/lists/")`
  - Applies to both desktop and mobile navigation
- `components/command-palette.tsx`:
  - Added "My List" to Tools group with `Heart` icon
  - Path: `/lists`

### Files Modified

- `components/add-to-list-button.tsx` (14 edits: icon swap, fill logic, all label updates)
- `components/penny-list-client.tsx` (3 edits: mobile bar, disclaimer)
- `components/penny-list-card.tsx` (3 edits: tap target heights)
- `components/navbar.tsx` (3 edits: navigation item, active state logic)
- `components/command-palette.tsx` (2 edits: tools group entry)

### Verification

Next steps:

- Run UI verification for mobile and desktop views
- Test Heart icon fill states (unsaved vs saved)
- Verify 44px tap targets on mobile devices
- Confirm navbar active state on `/lists` and `/lists/[id]` routes
- Ensure all "My List" singular labels are consistent

### Phase 1 Plan Reference

- `.ai/plans/my-list-elevation.md` - Full elevation plan (Phases 1-3)
- `.ai/topics/MY_LIST_FEATURE_CURRENT.md` - Current state audit

### Next Phase

Phase 2 (planned, not implemented):

- Guest preview mode on `/lists` (remove auth wall)
- Save intent persistence (logged-out save → login → auto-complete save)
- In-store mode polish

---

## 2026-01-19 - Claude Code - Ezoic Ads.txt Multi-Network Setup

**Goal:** Add Ezoic seller entries to ads.txt so Ezoic can serve ads alongside existing Monumetric and Google AdSense networks.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- `public/ads.txt`: Added 81 Ezoic seller entries (ezoic.ai, ezoic.co.uk + partner RESELLER entries)
- Added section headers for clarity: Monumetric (lines 1-385), Google AdSense (line 386), Ezoic (lines 387-467)
- Total entries: 386 → 467 lines
- All three ad networks now coexist without conflict

### How It Works

- Ezoic entries include DIRECT entries for ezoic.ai and ezoic.co.uk with publisher ID: `340070a564f232b255d5df36e55dbbfb`
- Ezoic partner RESELLER entries for themediagrid, sonobi, google.com, yahoo.com, smartadserver, rubiconproject, etc.
- All existing Monumetric and Google AdSense entries preserved exactly as-is
- Ezoic dashboard should show "ads.txt properly configured" within 24-48 hours after crawling

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (26/26 passing)
✅ `npm run test:e2e` (100/100 passing)
✅ File verification:

- Monumetric entries: ✅ Present (first 385 lines)
- Google AdSense entries: ✅ Present (pub-3944954862316283, pub-5302589080375312)
- Ezoic entries: ✅ Present (ezoic.ai, ezoic.co.uk + 79 partner entries)

### Architecture Plan

- `.ai/impl/ads-txt-multi-network-management.md` - Full architecture plan with Option A/B/C analysis

### Next Steps

1. **24-48 hours:** Wait for Ezoic to crawl and verify ads.txt
2. **Check Ezoic dashboard:** Should show "ads.txt properly configured" ✅
3. **Monitor ad serving:** Ezoic ads should begin appearing on pennycentral.com
4. **~Feb 11:** If Mediavine approves, remove Ezoic entries and keep Monumetric + Google AdSense

---

## 2026-01-18 - Codex - Real-data test fixture + placeholder SKU removal

**Goal:** Stop using fake/invalid SKU placeholders in tests/examples, and switch local/e2e to a one-time Supabase snapshot of real SKUs (no cron/ongoing backups) so testing is reliable.
**Status:** ✅ Complete + verified (all 4 gates passing) + CI green.

### Changes

- Removed placeholder SKUs (like `1001234567`, `123456`, `1009876543`) from tests/examples/UI copy and replaced with real SKUs.
- `data/penny-list.json`: replaced the old fake fixture with a one-time Supabase snapshot (sanitized: notes blank; state-only location counts).
- `scripts/snapshot-penny-list-fixture.ts` + `npm run fixture:snapshot`: manual generator for the fixture (reads `.env.local`/`.env` if present). No cron.
- Fixture timestamps are rebased to Playwright’s pinned `now` (`2025-12-10T12:00:00Z`) so freshness-based UI like "Hot Right Now" stays deterministic in CI.
- Tests that need a SKU now read from `data/penny-list.json` (instead of hardcoding fake SKUs).

### Verification

- `npm run ai:verify -- test`: `reports/verification/2026-01-18T20-22-52/summary.md`
- GitHub Actions: Quality Checks (Fast) ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21118092181`
- GitHub Actions: Full QA Suite ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21118092175`

---

## 2026-01-17 - Claude Code - Weekly Email Digest (P0-4c)

**Goal:** Send weekly penny list updates to all active subscribers every Sunday 8 AM UTC via Resend.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- `emails/weekly-digest.tsx`: React Email template with product cards, summary stats, responsive design, mobile-optimized for email clients
- `lib/email-sender.ts`: Resend API wrapper with error handling, rate limiting (100ms delay between sends), typed result objects
- `app/api/cron/send-weekly-digest/route.ts`: Cron endpoint that queries active subscribers + penny items (last 7 days), processes/aggregates by SKU, renders email template, sends via Resend with unsubscribe links
- `vercel.json`: Added cron schedule entry (Sunday 8 AM UTC: `0 8 * * 0`)
- `package.json`: Installed `resend`, `@react-email/components`, `react-email` (136 packages added, 0 vulnerabilities)

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (all passing)
✅ `npm run test:e2e` (all passing)

---

## 2026-01-21 - Codex - My List elevation planning (Phases 1-3) source-of-truth updates

**Goal:** Finalize and persist the Phase 1-3 technical roadmap for elevating "My List" using existing infrastructure only (no implementation yet).
**Status:** Complete (docs-only; no code changes).

### Changes

- `.ai/topics/MY_LIST_FEATURE_CURRENT.md`: Updated audit with Phase decisions (Heart icon fill logic, "My List" singular habit framing, Phase 2 intent persistence, Phase 3 deterministic list targeting + perf notes).
- `.ai/plans/my-list-elevation.md`: Updated living plan to lock Phase 1 naming decision ("My List" singular on all touched surfaces) and explicitly call out `/penny-list` copy drift ("your lists" / "personal lists") to be corrected during Phase 1 implementation.

### Verification

- Docs-only change; quality gates not run.

---

## 2026-01-21 - Codex - Canonical planning pipeline (cross-agent consistent)

**Goal:** Make feature planning documentation consistent across all agentic coders (Codex/Claude/Copilot) so multiple plans can exist concurrently without losing status or location.
**Status:** Complete (docs-only; no code changes).

### Changes

- Added canonical plans registry: `.ai/plans/INDEX.md`
- Added plan template: `.ai/plans/_TEMPLATE.md`
- Anchored planning pointers in the canonical read path: `.ai/START_HERE.md` + `.ai/USAGE.md` + `.ai/BACKLOG.md`
- Registered "My List" roadmap as an approved (not implemented) plan: `.ai/plans/my-list-elevation.md`

### Verification

- Docs-only change; quality gates not run.

---

## 2026-01-17 - Claude Code - Ezoic Ads Integration (Bridge Monetization)

**Goal:** Add a temporary ad revenue bridge while Mediavine Grow collects analytics.
**Status:** ✅ Complete + verified (all 4 gates passing).

### Changes

- Integrated Ezoic scripts and CSP allowances for production monetization readiness.
- Confirmed Grow and existing analytics remain intact.

### Verification

✅ `npm run lint` (0 errors, 0 warnings)
✅ `npm run build` (successful)
✅ `npm run test:unit` (all passing)
✅ `npm run test:e2e` (all passing)
