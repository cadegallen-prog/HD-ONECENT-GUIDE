# My Lists Feature - Current-State Audit (Codebase)

**Audited:** 2026-01-20  
**Scope:** Existing "My Lists" / saved penny items feature (no new infra; code-reading only).

## Repo Context Snapshot (for orientation)

- **App:** Next.js 16 (App Router) + TypeScript + Tailwind via CSS tokens.
- **Auth:** Supabase email OTP + magic-link callback (`/login`, `/auth/callback`).
- **Lists feature is optional infra** (separate from Penny List / enrichment pipeline).

---

## 1) Save Button (Add to List) - Components + Behavior

### Primary component

- **Component:** `components/add-to-list-button.tsx`
- **Icon library:** `lucide-react`
- **Current icon:** **bookmark** (confusing vs "browser bookmark")
  - Unsaved: `Bookmark`
  - Saved: `BookmarkCheck`
  - Code: `const Icon = saved ? BookmarkCheck : Bookmark`

### Phase 1 (approved, not implemented): icon + fill logic

- **New icon:** `Heart` (still `lucide-react`)
- **Fill logic (Lucide doesn't have a separate HeartFilled):**
  - Unsaved: `fill="none"`
  - Saved: `fill="currentColor"` and `stroke="currentColor"` (visually "filled")

### Where it's used (current surfaces)

- **Penny List card (main):** `components/penny-list-card.tsx` -> `BookmarkAction` wrapper uses:
  - `<AddToListButton ... variant="icon" className="min-h-[44px] min-w-[44px]" />`
- **Penny List action row (desktop-ish row of buttons):** `components/penny-list-action-row.tsx`
  - `<AddToListButton ... variant="icon" className="min-h-[44px] min-w-[44px]" />`
  - Also renders a text label: `<span className="hidden sm:inline">Save</span>`
- **Penny List "Hot Right Now" compact cards:** `components/penny-list-card.tsx` (compact variant)
  - `<AddToListButton ... className="min-h-[36px] min-w-[36px]" />` (**below 44x44**; violates our own touch-target rule)

### Phase 1 (approved, not implemented): tap targets

- The compact card usage above will be refactored to meet the 44x44 minimum on mobile.

### Saved/unsaved states

- **State is per-SKU "in any list":**
  - On mount: `isItemInAnyList(sku)` -> sets `saved` boolean.
  - This is **not list-specific**; it's "saved anywhere".
- **Toggle behavior:**
  - If `saved` -> removes via `removeItemFromListBySku(sku)` (**removes only the first match**, not all lists).
  - If not saved:
    - Tries `addSkuToListSmart(sku)`:
      - If 0 lists: creates default list `"My Hit List"`, adds SKU.
      - If 1 list: adds directly.
      - If 2+ lists: returns `null` -> opens list picker dropdown.

### Phase 3 (planned, not implemented): deterministic list targeting

- Current bug sources in `lib/supabase/lists.ts`:
  - `isItemInAnyList(sku)` uses `.limit(1)` and does not scope by list id (not suitable for "My List" accuracy).
  - `removeItemFromListBySku(sku)` uses `.limit(1).single()` and can "ghost delete" the wrong list entry when the SKU exists in multiple lists.
- Phase 3 plan:
  - Introduce list-scoped helpers:
    - `isSkuInList(listId, sku)` (Heart state correctness)
    - `removeSkuFromList(listId, sku)` (deterministic delete)
  - Define an "active list id" for Heart toggles (localStorage), with fallback to the default list.

### Labels / tooltip / a11y (current text)

From `components/add-to-list-button.tsx`:

- **Icon button:**
  - `aria-label`: saved -> `"Remove from list"`; unsaved -> `Save ${itemName} to list`
  - `title`: saved -> `"Remove from list"`; unsaved -> `"Save to list"`
- **Button variant text:** shows `"Save"` / `"Remove"` (but this variant currently isn't used on Penny List).
- **Dropdown header:** `"Save to list"`
- **Toasts:** `"Item added to your list"` / `"Item removed from your list"`

### Phase 1 (approved, not implemented): label consistency ("habit framing")

- All Phase 1 surfaces will use **"My List"** (singular):
  - "Save to My List"
  - "Remove from My List"
  - "Added to My List"
  - "Removed from My List"
  - `/penny-list` mobile bar button label: "My List" (today it is "My Lists")
  - `/penny-list` supporting links/copy that point to `/lists` (including the disclaimer link near the bottom of `components/penny-list-client.tsx`): "My List"
  - Global nav + command palette entry labels: "My List"

### Auth behavior (critical to onboarding)

From `components/add-to-list-button.tsx`:

- Logged out save attempt:
  - `trackEvent("add_to_list_clicked", { sku, authenticated: false })`
  - Redirects to `router.push(/login?redirect=<currentPath>)`
  - **No automatic "resume + save" after login**; user must tap save again.

### Phase 2 (planned, not implemented): save intent persistence

- Goal: a logged-out user who taps Save completes the save after OTP login (no dead-end / blank list).
- Planned redirect + intent schema:
  - `/login?redirect=<encoded /lists?pc_intent=save_to_my_list&pc_sku=<SKU>&pc_intent_id=<ID>&pc_src=<SOURCE>>`
- Planned resume behavior:
  - `/lists` will auto-save the SKU post-login, then remove `pc_*` params (idempotent on refresh).

---

## 2) Data Flow - Storage + Supabase Schema (Existing Infra)

### Where list logic lives (client-side Supabase)

- **Data module:** `lib/supabase/lists.ts`
  - Uses `createSupabaseBrowserClient()` (client-side) and relies on **RLS** to enforce user access.
  - Phase 3 focus area: make list item operations deterministic when SKUs exist in multiple lists.

### Tables (existing, must reuse)

From `supabase/migrations/001_create_lists_tables.sql`:

- `public.lists`
  - `id uuid`, `owner_id uuid (auth.users)`, `title text`, `created_at`, `updated_at` (+ trigger keeps `updated_at` fresh)
- `public.list_items`
  - `id uuid`, `list_id uuid`, `sku text` (6-digit or 10-digit), plus **penny-hunt fields we can lean on**:
    - `priority` = `maybe | must | ignore`
    - `found_status` = `unknown | found | not_found`
    - `notes` (nullable, <= 500 chars)
    - `added_at`

From `supabase/migrations/002_create_list_shares.sql`:

- `public.list_shares`
  - `list_id`, `share_token`, `created_at`
- RPC functions (existing):
  - `create_share_token(p_list_id uuid)` (owner-only)
  - `get_shared_list(p_token text)` (**anon can execute**; public read-only)
  - `fork_shared_list(p_token text)` (authenticated; creates a copy)

### "Guest/local saves" today

- **No guest saves.** There is **no localStorage** storage for saved SKUs today.
- Only list-related localStorage key found:
  - `pennycentral_in_store_mode` (list detail UI preference)

---

## 3) My Lists Pages / Routes (Existing)

### `/lists` - lists index

- **Route:** `app/lists/page.tsx`
- **Title/UI copy:** "My Lists" + "Save penny items for your next shopping trip"
- **Features:**
  - Create list, rename list, delete list
  - Shows item counts via `getUserLists()` which selects `item_count:list_items(count)`
- **Auth gating:** client-side redirect to `/login?redirect=/lists` when not authed.
- **Empty state copy:** "No lists yet... Create your first list to start saving penny items"

### Phase 2 (planned, not implemented): remove redirect wall + guest preview

- The redirect wall is implemented in `app/lists/page.tsx:29-34` (useEffect that forces guests to `/login`).
- Phase 2 plan: replace it with a logged-out preview state:
  - Locked hero + benefit bullets
  - 3-6 real sample items fetched from `/api/penny-list?perPage=6`
  - CTA to sign in that preserves any `pc_*` intent params in the `/lists` URL
  - Habit framing: the preview copy uses **"My List"** (singular) even though the route remains `/lists`

### `/lists/[id]` - list detail (the "hunt companion" page)

- **Route:** `app/lists/[id]/page.tsx`
- **Features (already strong for in-store use):**
  - Search (by SKU or name), filter modes:
    - All
    - Must-hit only
    - Hide found
    - Hide ignored
  - Stats row: total items, must-hit count, found count
  - Share link (copies `/s/<token>` to clipboard) via `createShareToken()`
  - "In-Store Mode" toggle (persists to localStorage)
  - Ignored items grouped at bottom
  - CTA: "Add more items from Penny List"
- **Data enrichment:** fetches `/api/penny-list?perPage=1000` and builds `sku -> PennyItem` map to show names/images.
  - **Risk:** this is both inefficient and incomplete:
    - `app/api/penny-list/route.ts` only allows `perPage` values 25/50/100, so `perPage=1000` is ignored (falls back to default).
    - It also doesn't target the user's saved SKUs, so many saved items may not get enriched.
  - Phase 3 plan: add `/api/penny-list?skus=...` support and query only the SKUs needed.

### `/s/[token]` - public shared view

- **Route:** `app/s/[token]/page.tsx`
- **Features:**
  - Public read-only list view via `getSharedList(token)` (Supabase RPC)
  - "Save a Copy" CTA:
    - Logged out -> redirects to `/login?redirect=/s/<token>`
    - Logged in -> `forkSharedList(token)` then pushes to `/lists/<newListId>`

---

## 4) Navigation / Discoverability (Why It's Currently "Invisible")

### Global navigation

- **Navbar exists on every page:** `app/layout.tsx` renders `components/navbar.tsx`.
- **But Navbar does NOT include "My Lists":**
  - `components/navbar.tsx` nav items: Penny List, Report a Find, Guide, Store Finder, About
- **Command palette does NOT include "My Lists":**
  - `components/command-palette.tsx` includes Penny List/Store Finder/Trip Tracker, but not `/lists`.

### Only current "My Lists" entry point (Penny List mobile bar)

From `components/penny-list-client.tsx`:

- There is a **fixed bottom action bar** on mobile with a "My Lists" button:
  - `href="/lists"`
  - **Icon used:** `Bookmark` (again reinforces the "bookmark" confusion)

### Phase 1 (approved, not implemented): navigation naming + icon

- The Penny List mobile bar will switch to:
  - Label: **"My List"** (singular)
  - Icon: `Heart` (so bookmark is reserved for browser bookmarking)

### Confusing competing "bookmark" concepts

Also on `/penny-list`:

- `components/penny-list-page-bookmark-banner.tsx` promotes **browser bookmarking** using a `Bookmark` icon and copy:
  - "Bookmark this page - new finds roll in all day"
- `components/penny-list-client.tsx` includes a "Save it for later" card that says:
  - "Tap the bookmark icon on a card to save the find to your personal lists..."

Net: we're using the same "bookmark" language + icon for **two different mental models**:

1. browser bookmarking a page, and
2. saving an item into a personal hunt list.

---

## 5) Authentication (OTP) - Current Trigger Points

- **Auth provider:** `components/auth-provider.tsx`
  - `signInWithOtp(email)` -> Supabase `auth.signInWithOtp` (email code)
  - `verifyOtp(email, token)` -> Supabase `auth.verifyOtp`
  - `signOut()`
- **Login page:** `app/login/page.tsx`
  - Flow: email -> 6-digit code -> redirect to `redirect` param (default `/lists`)
- **Magic-link callback:** `app/auth/callback/route.ts`
  - Exchanges code for session and redirects to `next` (default `/lists`)

---

## 6) Mobile / In-Store UX Snapshot

### What's already good

- `/penny-list` has a **mobile fixed bottom bar** with quick actions (Filters/Sort/My Lists/Report).
- `/lists/[id]` has **In-Store Mode** with large, simplified per-item interactions:
  - Big SKU copy button
  - Big Found/Not Found toggle
  - Big priority toggle

### What's currently weak (field use / one-handed)

- Save icon tap target is inconsistent:
  - Main card uses 44x44, compact card is 36x36.
  - Edit/delete buttons on `/lists` look like ~`p-2` icons (likely <44x44).
- No "My Lists" in global nav/menu -> users who don't start on `/penny-list` may never discover it.

---

## Mobile Excellence Standard (Phase 1 approved, site-wide going forward)

- **Minimum touch target:** 44x44px for all interactive controls on mobile.
- **Practical implementation pattern:**
  - Icon-only buttons: `min-h-[44px] min-w-[44px]`
  - Text buttons/links: `min-h-[44px]` (width as needed)
- We may keep denser targets on desktop with responsive overrides (e.g., `sm:min-h-[36px]`) as long as mobile stays 44+.

---

## 7) Strengths vs Pain Points (Product Gaps)

### Strengths (we should amplify)

- Existing DB schema already supports "real hunting":
  - must-hit vs maybe vs ignore
  - found/not found status
  - notes
- Sharing exists (`/s/[token]`) with "Save a Copy" flow.
- Analytics events already exist for list usage (`lib/analytics.ts`).
- In-Store Mode exists and is directionally aligned with the "hunt companion" vision.

### Pain points (root causes)

- **Discoverability:** `/lists` is absent from global nav and command palette; only appears on `/penny-list` mobile bar.
- **Icon confusion:** bookmark icon is overloaded across:
  - browser bookmarking banner + instructions, and
  - saving items to lists.
- **Logged-out friction:** save attempt redirects to login, but does not "resume" the intended save action.
- **Surface area is limited:** there is no save entry point on `/sku/[sku]` (SKU detail pages).
- **Multi-list correctness:** "saved" state is "in any list", and "remove" by SKU can't target a specific list (and likely removes only one instance).
- **Performance risk:** list pages fetch `/api/penny-list?perPage=1000` to enrich saved items.

### Phase 3 (planned, not implemented): safety + performance upgrades

- Deterministic deletes by scoping to `list_id + sku` (or using `itemId` when available).
- Heart state correctness by scoping membership to the active list (not "any list").
- `/api/penny-list` will add a `skus=` query option (no new route) to avoid inefficient/incomplete enrichment fetches.

---

## 8) Existing Infrastructure We Can Reuse (Explicit Inventory)

### Tables / RLS / RPC (Supabase)

- `lists`, `list_items`, `list_shares`
- RPC: `create_share_token`, `get_shared_list`, `fork_shared_list`

### Routes (Next.js)

- `app/lists/page.tsx` (`/lists`)
- `app/lists/[id]/page.tsx` (`/lists/:id`)
- `app/s/[token]/page.tsx` (`/s/:token`)
- `app/login/page.tsx` (`/login`)
- `app/auth/callback/route.ts` (`/auth/callback`)

### Components

- Save button: `components/add-to-list-button.tsx`
- Penny list surfaces:
  - `components/penny-list-card.tsx`
  - `components/penny-list-action-row.tsx`
  - `components/penny-list-client.tsx`
- List item UI:
  - `components/list-item-card.tsx` (priority/found toggles + in-store layout)
- Navigation surfaces we can extend:
  - `components/navbar.tsx`
  - `components/command-palette.tsx`

### Analytics (already wired)

- Personal list events: `add_to_list_clicked`, `add_to_list_completed`, `list_item_removed`, `priority_changed`, `found_status_changed`
- Sharing events: `share_link_copied`, `shared_list_viewed`, `save_copy_clicked`, `save_copy_completed`
- In-store mode events: `in_store_mode_enabled`, `in_store_mode_disabled`
