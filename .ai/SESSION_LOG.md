---

## 2026-01-21 - Codex - SKU page: prioritize reports/states above related (mobile-first)

**Goal:** Fix SKU detail page UX regression: “Where it was found” was below Related, and outbound Home Depot CTA visually competed with “Report this find”.
**Status:** ✅ Complete + verified (lint/build/unit/e2e)

### Changes

- `app/sku/[sku]/page.tsx`:
  - Move “Where it was found” section above “Related penny items”.
  - Make “Report this find” the primary CTA; demote “View on Home Depot” to secondary styling.
  - Add inline state chips (with counts) under “Community Reports” so the summary pays off immediately.
  - Restore “New to Penny Hunting?” as a properly boxed card (`block w-full`, `bg-[var(--bg-card)]`).

### Proof

- Verification bundle: `reports/verification/2026-01-21T22-17-23/summary.md`
- SKU screenshots (Playwright): `reports/verification/sku-related-items-chromium-mobile-light.png`, `reports/verification/sku-related-items-chromium-mobile-dark.png`

---

## 2026-01-21 - Codex - Add plain-English UX terminology rule (docs-only)

**Goal:** Reduce miscommunication by translating UX jargon into plain English (mobile-first) during planning.
**Status:** ✅ Docs-only (gates not run)

### Change

- `.ai/USAGE.md`: Added a “Plain-English Rule” requiring immediate translation of UX terms (example: “above the fold” = “visible without scrolling”).

---

## 2026-01-21 - Codex - Fix Vercel build errors after "My List" work

**Goal:** Restore `npm run build` / Vercel deploy after the recent `/lists` changes introduced TypeScript + Next.js prerender errors.
**Status:** ✅ Complete + verified (lint/build/unit/e2e)

### What Broke

- `app/lists/page.tsx` imported `PennyItem` from `@/lib/types` (file doesn’t exist), causing `next build` to fail.
- After correcting the type import, the `/lists` page still failed prerender with: `useSearchParams() should be wrapped in a suspense boundary`.

### Fix

- `app/lists/page.tsx`:
  - Import `PennyItem` from the canonical source (`@/lib/fetch-penny-data`) and align sample-item rendering to use `item.sku`.
  - Wrap the `useSearchParams()` usage behind a `<Suspense>` boundary by moving the hook into an inner component (`ListsPageInner`) and rendering it from the default export with a loader fallback.
  - Run Prettier on the file to clear `prettier/prettier` lint warnings.

### Verification

- `npm run ai:verify -- test`: `reports/verification/2026-01-21T12-24-30/summary.md`

---

## 2026-01-21 - Claude Code - My List Phase 2: Guest Preview & Auth Intent Persistence

**Goal:** Remove the guest redirect wall on `/lists` and ensure "Save" actions survive the login process.
**Status:** ? Complete (ready for testing).

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
- Phase 1 status: ? Complete (visual identity + mobile excellence)
- Phase 3 status: Not started (savings calculator, offline mode, performance)

---

## 2026-01-21 - GitHub Copilot - SKU detail: layout & identifier label fix

**Goal:** Stack the "Report this find" CTA beneath the product image on SKU pages and simplify the "Internet #" identifier to the concise form (`Internet #:`) so it reads like `Internet #: 1234567890`.

**Status:** ? Complete + verified (lint/build/unit/e2e)

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
