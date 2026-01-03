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
[Penny List reads from Supabase (real-time)]
          ->
[Enrichment table (penny_item_enrichment) overlays images/URLs by SKU]
```

**Key privacy rule:** the website submission form does **not** collect email, proof photos, receipts, or uploads.

---

## Weekly Workflow (15–30 min)

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

| Table | Purpose |
|-------|---------|
| `Penny List` | Community submissions (raw data) |
| `penny_item_enrichment` | Admin enrichment overlay (images, internet SKU) |

---

## Scaling Guardrails

If submissions exceed ~20/week:
- Do two shorter reviews per week, or
- Start relying more on "duplicate SKU" signals and less manual review

If submissions exceed ~50/week:
- Plan a more structured moderation layer (but only if it's worth the effort)

---

## Summary

| Aspect          | Approach                                        |
| --------------- | ----------------------------------------------- |
| Collection      | PennyCentral "Report a Find" page               |
| Storage         | Supabase (Penny List + enrichment tables)       |
| Publishing      | Real-time via Supabase reads                    |
| Enrichment      | Admin fills enrichment table (optional)         |
| Time cost       | ~15–30 min/week                                 |
