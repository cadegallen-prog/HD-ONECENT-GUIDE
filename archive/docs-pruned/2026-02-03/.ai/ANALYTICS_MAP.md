# Analytics & Event Map

Purpose: single source of truth for events, payloads, and verification. No PII is allowed.

Implementation Rules

- Use a thin `trackEvent(name, props)` helper that no-ops if analytics is unavailable and logs to console in dev (`[analytics] name`, payload).
- Default props on every event: `page` (route), `device` (`mobile|desktop` via UA/viewport), `theme` (`light|dark`), `ts` (ISO now).
- Never send emails, names, raw addresses, or query strings containing PII.
- Emit events on user actions, not render time, except the primary page view.

Events

- `home_page_view`: fire on homepage load; props `{ page: '/' }`.
- `penny_list_view`: fire on Penny List render; props `{ itemsVisible, hasFilter, hasSearch, freshnessHours }`.
- `penny_list_filter`: when a filter is applied/cleared; props `{ filter: 'state|rarity|category|other', value, action: 'apply|clear' }`.
- `penny_list_search`: on search submit; props `{ termLength, hasResults }` (do not send raw term; log length only).
- `sku_copy`: on SKU copy click; props `{ skuMasked: last4only, source: 'table|card' }`.
- `home_depot_click`: on "View on Home Depot"; props `{ skuMasked: last4only, source: 'penny-list-card|sku-page' }`.
- `directions_click`: on \"Get Directions\"; props `{ storeId, state }` (no addresses).
- `coffee_click`: on coffee/support CTA; props `{ surface: 'penny-list|resources|about|footer' }`.
- `affiliate_click`: on affiliate CTA; props `{ surface, linkId: 'befrugal' }` (no full URL).
- `store_finder_search`: on store finder search submit; props `{ queryType: 'zip|city|state', hasResults }`.
- `map_interact`: on map pan/zoom/marker click; props `{ action: 'pan|zoom|marker', markerState? }`.
- `feedback_vote`: on Yes/No vote; props `{ vote: 'yes|no', surface: 'penny-list' }`.
- `feedback_comment`: on comment submit; props `{ length, voteContext: 'yes|no' }` (no comment text).
- `report_find_click`: on "Report a Find" CTA; props `{ source: 'home-hero|nav-desktop|nav-mobile' }`.
- `return_visit` (derived): emit once per session when user has ≥2 sessions in the rolling 7-day window; props `{ weeklySessions }`.

Derived Session Logic (return_visit)

- Track session start timestamps in `localStorage` (array of ISO strings, prune older than 7 days).
- On load, if count after adding current session ≥2 and `return_visit_emitted_week` is not set for this week, emit `return_visit` and store a flag (`weekStartISO`).

Dev Verification

- In dev, `trackEvent` logs to console with payload; use this to confirm events and props during manual testing.
- Auditor should spot-check `return_visit` by clearing storage, loading twice in a 7-day window, and confirming single emission.

Notes

- Keep payloads small and numeric/boolean/enum; avoid free-text beyond masked SKU or length counts.
- If an event needs new props, update this file first and get approval if it changes scope.

Provider Policy (PennyCentral)

- No provider toggle env var is used; analytics should never silently drop due to a missing/mismatched provider.
- Use `NEXT_PUBLIC_ANALYTICS_ENABLED=false` only when you intentionally want tracking disabled.
