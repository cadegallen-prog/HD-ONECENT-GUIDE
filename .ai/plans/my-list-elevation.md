# My List Elevation Plan (Living)

**Created:** 2026-01-20  
**Last updated:** 2026-01-21  
**Status:** Approved (Not Implemented)  
**Purpose:** Make "My List" (saved penny items) a central, habit-forming hunt companion - by **modifying existing infrastructure only**.

**Current-state audit:** `.ai/topics/MY_LIST_FEATURE_CURRENT.md`

---

## 0) Hard Constraints (Non-Negotiable)

- **Reuse existing Supabase infra only**:
  - Tables: `lists`, `list_items`, `list_shares`
  - RPC: `create_share_token`, `get_shared_list`, `fork_shared_list`
- **No new major routes** (stick to existing: `/lists`, `/lists/[id]`, `/s/[token]`, `/login`).
- **No new "component trees"**: extend existing components/pages in-place (small focused diffs).
- **No new deps** unless explicitly approved.
- **Design tokens only** (no raw Tailwind palette colors).

---

## 1) Baseline (What We're Building On)

### Existing surfaces we will extend (no new routes)

- `/lists` -> `app/lists/page.tsx` (lists index; currently auth-gated)
- `/lists/[id]` -> `app/lists/[id]/page.tsx` (already strong: search, filters, in-store mode)
- `/s/[token]` -> `app/s/[token]/page.tsx` (public share + "Save a Copy")
- Save button -> `components/add-to-list-button.tsx` (currently bookmark icon)
- Penny List cards -> `components/penny-list-card.tsx` + `components/penny-list-action-row.tsx`
- Global nav -> `components/navbar.tsx` (currently no My List)
- Command palette -> `components/command-palette.tsx` (currently no My List)

### The two biggest current blockers (from audit)

1. **Discoverability:** "My List" is not in global nav; it only appears on `/penny-list` via the mobile bottom bar (currently labeled "My Lists").
2. **Icon + mental model confusion:** "Bookmark" icon is used for "save item" and "bookmark page".

---

## 2) Naming & Information Architecture (Phase 1 Decision: "My List" Habit Framing)

Internally, the product is structurally **multi-list** (tables and routes support multiple lists), but the retention loop we want is a **single "My List"** habit.

**Decision (Phase 1):** Use **"My List" (singular)** on all user-facing surfaces we touch in Phase 1 (save button labels, nav, command palette, `/penny-list` mobile bar, and any supporting copy), while keeping:

- Route structure unchanged (`/lists`, `/lists/[id]`, `/s/[token]`)
- Database schema unchanged (`lists`, `list_items`, `list_shares`)
- Multi-list capability present in the background (list picker still works)

**Not decided in Phase 1:** Whether to rename the default list name ("My Hit List") to match "My List" habit framing. Phase 1 only standardizes the _surfaces_.

---

## A) Save Button & Icon Redesign (Highest-Priority Quick Win)

**Goal:** Make "save" instantly understandable and penny-hunter-specific.

### A1) Replace the bookmark icon

- **Primary approach:** swap `Bookmark`/`BookmarkCheck` -> `Heart` outline -> `Heart` filled.
  - File: `components/add-to-list-button.tsx`
  - Keep behavior identical (smart-add, picker, remove, toasts) - just fix the mental model.
- **Icon fill logic (Lucide):** Lucide does not provide a separate `HeartFilled` icon.
  - Unsaved state: render `Heart` with `fill="none"`
  - Saved state: render `Heart` with `fill="currentColor"` and `stroke="currentColor"` (visually filled)
- **Alternatives to evaluate (still within existing component):**
  - Plus-in-circle (explicit "add")
  - Shopping bag (purchase intent)
  - Checklist add (hunt intent)

### A2) Make labels unambiguous + accessible

- Update aria labels + titles to "Save to My List" / "Remove from My List" (include item name).
- Update dropdown header from "Save to list" -> "Save to My List".
- Update toasts copy to reinforce the habit: "Added to My List".

### A3) Fix mobile tap targets consistently (no more per-caller guessing)

- Ensure `components/add-to-list-button.tsx` enforces **>= 44x44** for the icon button internally (so callers can't accidentally shrink it).
- Fix compact card usage in `components/penny-list-card.tsx` (currently 36x36) and the neighboring secondary action buttons, so the whole row is one-handed friendly.

### A4) Align Penny List education copy (remove "bookmark" language)

- Update "Save it for later" card copy in `components/penny-list-client.tsx`:
  - Replace "Tap the bookmark icon..." with "Tap the heart..."
- Reconcile with the browser bookmark banner (`components/penny-list-page-bookmark-banner.tsx`):
  - Keep the banner, but avoid reusing the same icon/copy patterns as "My List".

**Phase 1 target files:**  
`components/add-to-list-button.tsx`, `components/penny-list-card.tsx`, `components/penny-list-client.tsx`, `components/penny-list-page-bookmark-banner.tsx` (copy only).

---

## B) Visibility & Discoverability (Persistent, Not Accidental)

**Goal:** Users should never have to "remember it exists."

### B1) Add persistent nav entry (global)

- Add "My List" to:
  - `components/navbar.tsx` (desktop row + mobile menu)
  - Choose a clear icon (Heart or List - not Bookmark).

### B2) Add to command palette

- Add `/lists` entry to `components/command-palette.tsx` (Tools group).

### B3) Add low-friction promotion on existing pages (no new routes)

- Home page: add a small card/section in `app/page.tsx` explaining "My List = your in-store checklist".
- Penny List page:
  - Update the existing mobile bottom bar label to "My List" and align icon/copy with the redesigned save action.
  - Consider a lightweight "My List is your hunt companion" banner card (existing component patterns).

### Phase 1 copy consistency checklist (must stay singular)

- `components/penny-list-client.tsx`: change the `/penny-list` mobile bar label (currently "My Lists") to "My List", and update the disclaimer link text (currently "your lists") + surrounding copy (e.g., "personal lists") to singular "My List".

**Phase 1 target files:**  
`components/navbar.tsx`, `components/command-palette.tsx`, `app/page.tsx`, `components/penny-list-client.tsx`.

---

## C) Guest Preview & Curiosity-Driven Onboarding (Strictly Reuse Existing Flow)

**Goal:** curiosity -> first save -> signup, with minimal friction.

### C1) Let logged-out users open `/lists` (preview mode)

Today `/lists` immediately redirects to login. Instead:

- Modify `app/lists/page.tsx`:
  - Remove the redirect-wall effect at `app/lists/page.tsx:29-34` and replace it with a "preview" render state when `user` is null.
  - Preview UI (exact intent for Phase 2):
    - **Locked hero:** "My List is your in-store hunt companion" + 3 bullet benefits (one-handed, checklist, copy SKU).
    - **Sample items (not blurred):** render 3-6 sample penny items fetched client-side from the existing `/api/penny-list?perPage=6`.
      - Rationale: shows real value immediately without any Supabase access or new tables.
      - Presentation: simple compact rows/cards (thumbnail + name + SKU) with a small "Sample from today's Penny List" label.
    - **Primary CTA:** "Sign in to use My List" -> `/login?redirect=<encoded current /lists URL (including any intent params)>`
    - **Secondary CTA:** "Browse Penny List" -> `/penny-list` (keeps the core loop visible even before signup).
    - **Lock reinforcement:** microcopy line: "No password. We'll email you a one-time code."

### C2) "Save intent resume" after login (no new routes)

Current pain: user taps save -> gets redirected -> must re-tap save.

- Modify `components/add-to-list-button.tsx` + `app/login/page.tsx`:
  - When logged out and user taps save, redirect to Login with a redirect target that preserves SKU + intent.
  - Canonical URL schema (Phase 2):
    - Login URL:
      - `/login?redirect=<ENCODED_REDIRECT_PATH>`
    - Redirect path (always lands on `/lists` to reinforce habit + eliminate the "blank list" problem):
      - `/lists?pc_intent=save_to_my_list&pc_sku=<SKU>&pc_intent_id=<ID>&pc_src=<SOURCE>`
    - Parameter definitions:
      - `pc_intent`: namespaced to avoid collisions with existing filter params (especially on `/penny-list`)
      - `pc_sku`: the SKU being saved
      - `pc_intent_id`: random identifier for idempotency (prevents re-firing on refresh)
      - `pc_src`: optional string like `penny-list-card` / `penny-list-action-row` for analytics/debugging
  - "Resume" logic lives in `app/lists/page.tsx` (not in the save button), because `/lists` is the redirect target:
    - If `user` is present and `pc_intent=save_to_my_list`:
      1. Idempotency guard:
         - If `sessionStorage["pennycentral_intent_consumed_v1_<pc_intent_id>"] === "1"`, do nothing.
      2. Attempt save using existing infra:
         - Add to the user's primary list (most recent) or create the default ("My Hit List") if none exists.
         - Treat unique-constraint "already saved" as success (no duplicates).
      3. Mark consumed + clean URL:
         - Set `sessionStorage` consumed flag
         - `router.replace("/lists")` to remove the `pc_*` params so refresh can't re-trigger.
      4. Then load lists normally (existing `getUserLists()` path).
    - If `user` is null, preview UI should keep the intent params in the current URL and build the sign-in CTA using that same URL (so intent survives until login).

### C3) Optional: guest localStorage "stash" (layered, not a new backend)

If we want "frictionless like Home Depot" without new tables:

- While logged out, store `pending_saved_skus[]` in localStorage.
- `/lists` preview can show "You've saved 3 items - sign in to claim them".
- After login, import them into the default list via existing `addSkuToListSmart`.

This is optional and can be deferred if Phase 2 intent-resume already moves the needle.

**Phase 2 target files:**  
`app/lists/page.tsx`, `components/add-to-list-button.tsx`, `app/login/page.tsx`.

---

## D) Mobile & Utilitarian Excellence (Be Better Than Home Depot Lists)

**Goal:** "in-store checklist mode" that feels purpose-built for penny hunting.

### D1) Promote and streamline In-Store Mode (already exists)

`/lists/[id]` already has in-store mode; we can make it more discoverable:

- Move toggle higher / make it a prominent control
- Add a "Start Hunt" CTA that:
  - enables in-store mode
  - optionally sets filter to hide found
  - (all within `app/lists/[id]/page.tsx`)

### D2) Penny-specific value: total savings + credibility signals

Using existing data already available on the client:

- **Savings total**:
  - Use `penny_item_enrichment.retail_price` already exposed via `/api/penny-list`
  - Compute a "Potential savings" total at the top of `/lists/[id]`
- **Crowd hints / availability**:
  - Show last-seen and report counts per saved item (from `PennyItem.locations` and timestamps)
  - Highlight "Active on Penny List right now" vs "Not currently in last 30d"
- Implement by extending `components/list-item-card.tsx` (no new component tree).

### D3) Performance hardening (stay within existing API route)

Current list pages fetch `/api/penny-list?perPage=1000` for enrichment.

- Upgrade existing `app/api/penny-list/route.ts` to optionally accept `skus=...` and return only needed items.
  - No new route; just an optional query path.
- Update list pages to request only saved SKUs.

### D4) Stretch: "offline-ish" without a service worker

No service worker/PWA caching exists today; true offline is Phase 3+.

Phase 3 minimal:

- Cache last list view data into localStorage on `/lists/[id]`
- When offline, show cached data + "stale" indicator

**Phase 2-3 target files:**  
`app/lists/[id]/page.tsx`, `components/list-item-card.tsx`, `app/api/penny-list/route.ts` (optional query), `lib/supabase/lists.ts` (if helper needed).

---

## E) Phasing, Prioritization & Metrics

### Phase 1 (Quick Wins - highest ROI, minimal risk)

- Heart icon + copy rename (remove bookmark mental model)
- Enforce 44x44 tap targets for save
- Add "My List(s)" to global nav + command palette
- Update Penny List education copy to match

**Estimated effort:** small/medium (mostly copy + icon + nav wiring)

### Phase 2 (Core Onboarding + Field UX)

- `/lists` guest preview mode (no redirect wall)
- Save-intent resume after login (auto-complete the first save)
- In-store mode polish (start hunt / easier toggles)
- Optional: `skus=` optimization on `/api/penny-list` for list enrichment

**Estimated effort:** medium

### Phase 3 (Unique Value Adds - retention moat)

- Savings calculator + per-item savings display (when retail price exists)
- Crowd "confidence" hints per saved item (reports/states/recency)
- Offline-ish cached list view (localStorage)
- Optional: guest localStorage stash and "claim your saves" onboarding

**Estimated effort:** medium/high (but still within existing infra)

---

## Metrics to Track (Use Existing Analytics First)

Already available in `lib/analytics.ts`:

- `add_to_list_clicked` (includes `{ authenticated }`)
- `add_to_list_completed`
- `list_item_removed`
- `/lists` usage via `cta_click` locations (we should standardize locations)
- `in_store_mode_enabled` / `in_store_mode_disabled`

Recommended additions (only if needed; would require updating `lib/analytics.ts`):

- `my_list_viewed` (page view intent; could also be inferred via route tracking)
- `save_intent_resumed` (measures the "resume after login" win)

---

## Risks / Edge Cases (Callouts)

- **Multi-list correctness:** current save state is "in any list" and remove-by-SKU can remove only one instance. We should decide whether Phase 2/3 needs true per-list membership UX.
- **Auth gating UX:** today `/lists` and `/lists/[id]` rely on client-side redirects; preview mode will remove the wall but requires careful copy so users understand what's locked.
- **Performance:** `/api/penny-list?perPage=1000` is expensive for list detail; skus-filter path reduces mobile latency.
- **Bookmark banner confusion:** keep "bookmark the page" but visually and verbally separate it from "save to My List".

---

## Implementation Checklist (When You Say "Go")

- Keep diffs focused to the files listed per phase.
- Verify with 4 gates + Playwright screenshots (UI changes).
- Update `.ai/SESSION_LOG.md` and `.ai/STATE.md` after implementation sessions.

---

## Phase 1 Decisions (Approved, Source of Truth)

### Label consistency (habit framing)

- Phase 1 will use **"My List"** (singular) everywhere we touch:
  - Save button strings: "Save to My List", "Remove from My List"
  - Toast copy: "Added to My List", "Removed from My List"
  - Penny List disclaimer link text: "My List"
  - Penny List mobile bar label: "My List"
  - Navbar and command palette label: "My List"

### Mobile Excellence standard (site-wide)

- Minimum touch target: **44x44px** for all interactive controls on mobile.
- Standard patterns:
  - Icon-only buttons: `min-h-[44px] min-w-[44px]`
  - Text buttons/links: `min-h-[44px]`
- Desktop density can be preserved with responsive overrides (example: `sm:min-h-[36px]`) as long as mobile stays 44+.

### Navbar active-state safety (no false positives)

- For the "My List" nav item, the active match will be constrained to:
  - `pathname === "/lists"` OR `pathname.startsWith("/lists/")`
- This will **not** match unrelated future routes like `/listing-details` because that path does not start with `"/lists/"`.

---

## Phase 2 Decisions (Planned, Source of Truth)

### /lists preview mode (remove redirect wall)

- `app/lists/page.tsx` will no longer redirect logged-out users to `/login`.
- Logged-out users will see a **locked preview** with:
  - Marketing copy explaining "My List" value
  - 3-6 real sample items fetched from `/api/penny-list?perPage=6`
  - CTA to sign in (OTP) that preserves any `pc_*` intent params

### Save intent persistence (guest -> login -> saved)

- Logged-out Save click will redirect to:
  - `/login?redirect=<encoded /lists?pc_intent=save_to_my_list&pc_sku=...&pc_intent_id=...>`
- Post-login auto-save will run on `/lists` (not on the originating page), then clean the URL.

### Idempotency standard (intent resume)

- Intent resume must be safe on refresh:
  - Use `pc_intent_id` + `sessionStorage` consumed flag
  - Remove `pc_*` params via `router.replace("/lists")` after the save attempt

---

## Phase 3 Planning: Deterministic Data Logic + Performance Safety

**Goal:** As "My List" usage grows, list operations must be deterministic (no ghost deletes) and performant (no N+1 saved checks on mobile).

### 3.1 Fix "Ghost Delete" (deterministic removals)

Problem: `removeItemFromListBySku(sku)` is ambiguous and uses `limit(1).single()` on `list_items` by SKU.

Phase 3 plan (no schema changes):

- Introduce a deterministic API in `lib/supabase/lists.ts`:
  - `removeSkuFromList(listId: string, sku: string): Promise<void>`
    - Performs delete scoped by both `list_id` and `sku`
    - Treats "0 rows deleted" as success (already removed)
- Deprecate `removeItemFromListBySku(sku)` for any UI that claims "My List" semantics.
- Ensure all "remove" operations come from either:
  - `removeItemFromList(itemId)` (already deterministic, used on `/lists/[id]`), OR
  - `removeSkuFromList(activeListId, sku)` (deterministic for Heart toggles)

### 3.2 Fix "In Any List" state (Heart reflects the active list)

Problem: `isItemInAnyList(sku)` only reports if a SKU exists somewhere and cannot guarantee correctness for the user's active "My List".

Phase 3 plan:

- Define an **active list id** for the "My List" Heart toggle:
  - LocalStorage key: `pennycentral_active_list_id_v1`
  - Validation: on use, confirm the list id exists in `getUserLists()`; otherwise fall back.
- Primary list fallback (no schema changes):
  - If no active list is set or valid, use `getOrCreateDefaultList()` (which creates "My Hit List" when needed).
- Add deterministic membership helpers in `lib/supabase/lists.ts`:
  - `isSkuInList(listId: string, sku: string): Promise<boolean>`
  - (Optional for perf) `getSavedSkusForList(listId: string, skus: string[]): Promise<Set<string>>`
- UI contract:
  - Heart state = membership in the **active list** (not "any list").
  - When a user navigates to `/lists/[id]`, that list becomes the active list (stored in localStorage).
  - When a user chooses a list in the list picker, that selected list becomes active (optional but recommended for consistency).

### 3.3 Default list safety (check-and-create)

Do we need a programmatically identified default list? Yes, to avoid errors and to make "My List" deterministic.

Phase 3 plan (no DB schema changes):

- Keep using existing check-and-create helper `getOrCreateDefaultList()` in `lib/supabase/lists.ts`.
- Ensure all add flows have a stable list id:
  - Resolve active list id (validated), else resolve default list id, else create it.
- Duplicate safety relies on existing unique constraint `(list_id, sku)`:
  - Treat Postgres error `23505` (duplicate) as success for "save" intents.

### 3.4 Performance optimization (avoid heavy fetches and N+1 queries)

Two distinct performance problems to address:

1. **List item enrichment fetch**:
   - Current list detail/shared pages fetch `/api/penny-list?perPage=1000`, but the API only allows 25/50/100, so this is both inefficient and incomplete.
   - Plan: add a `skus=` path to the existing `/api/penny-list` route (no new route):
     - `GET /api/penny-list?skus=<comma-separated>&includeHot=0`
     - Server filters at the database layer by extending `fetchRows(...)` in `lib/fetch-penny-data.ts` to accept `skuList` and apply `.in("home_depot_sku_6_or_10_digits", skuList)`.

2. **Saved status checks on Penny List**:
   - Current approach is effectively N+1 (`isItemInAnyList` per card).
   - Plan: batch fetch membership for the active list for the visible SKUs:
     - One query: `list_items` where `list_id = activeListId` and `sku IN (visibleSkus...)`
     - Cache results in memory for the session and update optimistically on toggle.

---

## Phase 3 Decisions (Planned, Source of Truth)

- Heart state will reflect membership in the **active list** (not "any list").
- Deletions will be deterministic by scoping to `list_id + sku` (or by `itemId` when available).
- Default list will remain "check-and-create" via `getOrCreateDefaultList()`; no schema changes.
- Performance guardrails:
  - `/api/penny-list` gains `skus=` support (DB-level filtering via `fetchRows`).
  - Saved status checks on Penny List will be batched per page (avoid N+1).
