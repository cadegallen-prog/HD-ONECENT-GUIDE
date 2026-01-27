# Weekly Penny List Update — Quick Reference

**Time:** 15-20 minutes  
**Frequency:** 1x per week (Sundays 8pm recommended)

---

## The 3-Step Process

### Step 1: Review Submissions (10 min)

1. Open your Supabase project and view the `Penny List` table (Table Editor).
2. Scan for items with:
   - ✅ Multiple reports (high signal)
   - ✅ Photo attachment (proof)
   - ✅ Clear location info (store # or city/state)
   - ✅ Recent date (within 7 days)

Skip items that are:

- ❌ One-off reports with no confirmation
- ❌ Older than 2 weeks
- ❌ Vague or missing details

### Step 2: Copy Best Items (3 min)

From the spreadsheet, gather your top **3-5 items**:

- Item name
- SKU (6 or 10 digits)
- Quantity found
- Locations reported (city/state or store #)
- Any special notes (where to look, condition, etc.)

### Step 3: Moderate & Enrich (2 min)

Use the Supabase Table Editor:

- Remove spam/bad rows from the `Penny List` table.
- Add enrichment rows to `penny_item_enrichment` (sku, image_url, internet_sku, item_name, brand) for top items — the site will overlay enrichment automatically.

**Status options (for display logic):**

- `"Nationwide"` — Reported in 3+ states or multiple regions
- `"Regional"` — Reported in 1-2 states
- `"Rare"` — Single report or very few

**Commit & Push:**

```bash
git add data/penny-list.json
git commit -m "Weekly penny list update"
git push origin main
```

Site updates automatically in 2-3 minutes via Vercel. ✅

---

## Pro Tips

- **Copy date format:** Use today's date in `YYYY-MM-DD` format
- **Prefer longer quantity descriptions:** "12+ (Full Shelf)" is better than "12+"
- **Call out location patterns:** If item reported in multiple regions, say so
- **Don't overthink it:** "Nationwide" just means there's enough signal to post
- **If stuck, look at examples:** Check the existing items in the JSON for format reference

---

## When to Skip an Item

- Single report with no photos
- SKU doesn't match validation (not 6 or 10 digits)
- Location is vague ("Found it somewhere in Texas")
- Date is older than 14 days
- Notes are unclear or spam-like

---

## Red Flags (Potential Spam)

- "FREE MONEY EASY" vibes
- Impossible quantities ("Found 1000 of them!!!")
- No actual details, just emojis
- Multiple submissions from same person in one week (likely testing)

Filter these out. Community quality > quantity.

---

## Troubleshooting

| Issue                           | Solution                                                        |
| ------------------------------- | --------------------------------------------------------------- |
| Can't find responses            | Check you're in the right Supabase project / table (Penny List) |
| JSON file won't save            | Make sure you're editing the right file: `data/penny-list.json` |
| Changes don't appear on site    | Give Vercel 3-5 min to deploy, then refresh                     |
| Too many submissions (50+/week) | Start a second curation pass or discuss Phase 2 automation      |

---

## Copy-Paste Template

**Use this to make updates faster:**

```json
{
  "id": "NEXT_ID",
  "name": "FROM_FORM",
  "sku": "FROM_FORM",
  "price": 0.01,
  "dateAdded": "TODAY_YYYY-MM-DD",
  "status": "CHOOSE_ONE",
  "quantityFound": "FROM_FORM",
  "imageUrl": "/images/placeholder-product.jpg",
  "notes": "FROM_FORM_NOTES"
}
```

---

## Reminder

**You control the quality.** If a submission doesn't meet your standards, leave it off the list. Community > Quantity.

Keep it real. Keep it helpful. You've got this. 💪
