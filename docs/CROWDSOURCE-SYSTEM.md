# Penny Crowdsource System - Maintenance Strategy

**Status:** Phase 1 (Live with lightweight review)
**Maintenance Load:** ~15–30 min/week (sustainable)

---

## What This Is

PennyCentral's "compounding loop" is:

1. Community reports finds via the website
2. Those finds show up on the Penny List automatically
3. Cade optionally enriches the best items later (images, internet SKU)

---

## The Current Data Flow

```
[Community submits via PennyCentral "Report a Find" page]
          ->
[/api/submit-find inserts into Supabase "Penny List" table]
          ->
[Penny List reads from Supabase (near-real-time)]
          ->
[Enrichment table (penny_item_enrichment) overlays images/URLs by SKU]
          ->
[Optional: users can Save items into personal lists (lists/list_items) and share them (list_shares)]
```

**Key privacy rule:** the website submission form does **not** collect email, proof photos, receipts, or uploads.

### Recency semantics (prevents “missing/disappearing” items)

- `timestamp` = when the report was submitted to PennyCentral (server-generated).
  - Used for **recency windows** (1m/3m/6m…) and “Last seen” signals.
- `purchase_date` = user-provided “date found”.
  - Display/supporting metadata only; not authoritative for freshness.

### Caching semantics (fast + predictable, without “stale for days”)

- Supabase reads happen server-side via Supabase-js.
- Next.js production can cache GET `fetch()` calls by default; Supabase selects are GETs.
  - The server-side Supabase client forces reads to `cache: "no-store"` so production cannot get stuck serving an old snapshot.
- Public list API responses are cached at the CDN for a short window (target ~5 minutes) to keep load predictable.
- The submitter flow can bypass caching once via `?fresh=1` (no-store) for immediate gratification without global polling.

---

## Weekly Workflow (15-30 min)

### Step 1: Open Supabase Dashboard (2 min)

Go to your Supabase project dashboard and view the "Penny List" table.

### Step 2: Scan for High-Signal Items (10–20 min)

Look for:

- Duplicate SKUs (multiple reports = stronger signal)
- Recent dates
- Multiple states/regions

Skip:

- Obvious spam/junk
- Very old reports

### Step 3: Enrich the Best SKUs (optional, 3–10 min)

Add entries to the `penny_item_enrichment` table:

- `sku` - the Home Depot SKU
- `image_url` - stock thumbnail URL
- `internet_sku` - for reliable Home Depot product links
- `item_name`, `brand`, `model_number` - optional metadata
- `retail_price` - optional numeric price captured from HD so cards can show “was $X.XX” savings

The site updates automatically once those are added.

---

## Data Tables

### Two-table mental model (what’s “sacred” vs “cache”)

- **Sacred / source of truth for the live feed:** `Penny List` (raw community submissions; the site aggregates and displays this).
- **Stockpile/cache for instant hydration:** `penny_item_enrichment` (pre-scraped/admin metadata keyed by SKU; can include SKUs that are _not_ currently on the Penny List; it overlays/fills fields without touching community rows).

The other 3 tables exist for the optional **Save/My Lists** feature (they are not part of scraping/enrichment).

| Table                   | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `Penny List`            | Community submissions (raw data)                                        |
| `penny_item_enrichment` | Admin enrichment overlay (images, internet SKU)                         |
| `lists`                 | User-created personal lists (“Save” feature)                            |
| `list_items`            | SKUs saved into a user’s lists                                          |
| `list_shares`           | Public share tokens for lists (`/s/[token]`)                            |
| `penny_list_public`     | Read-only view for safe public reads under RLS (not a separate dataset) |

---

## Scaling Guardrails

If submissions exceed ~20/week:

- Do two shorter reviews per week, or
- Start relying more on "duplicate SKU" signals and less manual review

If submissions exceed ~50/week:

- Plan a more structured moderation layer (but only if it's worth the effort)

---

## Summary

| Aspect     | Approach                                  |
| ---------- | ----------------------------------------- |
| Collection | PennyCentral "Report a Find" page         |
| Storage    | Supabase (Penny List + enrichment tables) |
| Publishing | Real-time via Supabase reads              |
| Enrichment | Admin fills enrichment table (optional)   |
| Time cost  | ~15–30 min/week                           |
