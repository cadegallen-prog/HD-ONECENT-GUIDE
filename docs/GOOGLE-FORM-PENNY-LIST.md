# Google Form + Sheet Setup for Penny List

Use this to stand up intake and moderation without writing code. Copy/paste these steps; the output Sheet will drive the site (Approved rows only).

## Form Fields (all required unless noted)

1. SKU (Short answer)
2. Item Name (Short answer)
3. Photo Proof (File upload; images only; max 1 file; limit 10MB)
4. State (Dropdown; 50 states + DC + PR)
5. City (Short answer; optional)
6. Notes (Paragraph; optional, e.g., "hidden on top shelf in garden")
7. Quantity Seen (Dropdown: 1, 2-3, 4-6, 7+, "Full shelf")
8. Date Found (Date; default to today)

**State dropdown list (copy/paste):**
AL, AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY, DC, PR

## Form Settings

- Restrict to 1 response per user: OFF (keeps it easy for community).
- Collect email: OFF (privacy; reduces friction).
- Require sign-in: OFF (frictionless).
- File upload destination: to the linked Drive folder; keep defaults.

## Sheet Setup (auto-created when you link the Form)

Add these columns to the right of the Form responses:

- Approved (Checkbox) — the gate; only TRUE rows are shown on site.
- Tier (Dropdown: Very Common, Common, Rare) — your commonness signal.
- Date Approved (Date with time) — use `=IF(AND(Approved, ISBLANK([@Date Approved])) , NOW(), [@Date Approved])` or fill manually when you approve.
- Moderator Notes (Optional text) — for internal notes.

Optional helper columns (computed):

- State Count per SKU: `=COUNTIFS(SKU column, [@SKU], State column, [@State])`
- Unique Locations per SKU (if using city): `=COUNTA(UNIQUE(FILTER(City column, SKU column=[@SKU])))`

## Workflow (daily, ~15 minutes)

1. Open the Sheet responses tab.
2. Check the Photo Proof thumbnail; skim SKU/Item/State.
3. If real, tick Approved and set Tier.
4. (Optional) Adjust Date Approved if you want to backdate to discovery.
5. Done — only Approved rows are exported to the site.

## Export to the Site (interim, manual)

- File → Download → CSV (filter Approved=TRUE first) and drop into `data/penny-list.json` format, or use the helper script when provided. Keep only the last 14–30 days.

**Automated options (recommended):**

1. Google Apps Script (no local tools):
   - Open the linked Sheet → Extensions → Apps Script → create a new script and paste `scripts/google-apps-script-export.gs` from this repo. Adjust `SHEET_NAME` if your form uses a different sheet name. Run `exportApprovedToJSON()` and authorize the script. It will create/overwrite `penny-list.json` in your Google Drive root. Download it and replace `data/penny-list.json`.

2. Local conversion script (standard dev tool):
   - Export CSV from Sheets as above and run the included Python script:

```pwsh
python scripts/csv-to-penny-json.py responses.csv > data/penny-list.json
```

This aggregates by SKU, merges state counts into `locations`, picks a `tier` (max of all rows for that SKU), and emits JSON matching the site structure.

**Quick manual CSV-to-JSON (no deps, in a pinch):**

- In Google Sheets: Filter Approved=TRUE and Date Approved within last 30 days → File → Download → CSV.
- Upload the CSV to https://www.convertcsv.com/csv-to-json.htm → Download JSON → replace `data/penny-list.json` (structure: id, name, sku, price, dateAdded, tier, status, quantityFound, imageUrl, notes, locations[state]=count if available). Keep backups.

## When to Consider Auth/Accounts

See `docs/AUTH-PIVOT-GUIDANCE.md` — do **not** add accounts until those milestones are met.

## Notes on Trust & Spam

- Photo required is the primary spam filter.
- If spam increases, add a simple math CAPTCHA to the Form or rate-limit by turning on "Limit to 1 response" temporarily.

## Image Handling

- Max 10MB per upload keeps Drive tidy and pages fast.
- On the site we will show the first photo; additional photos stay in Drive for moderation.
