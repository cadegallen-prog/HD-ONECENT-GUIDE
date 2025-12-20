# Penny Crowdsource System - Maintenance Strategy

**Status:** Phase 1 (Live with lightweight review)  
**Maintenance Load:** ~15–30 min/week (sustainable)

---

## What This Is

PennyCentral’s “compounding loop” is:

1. Community reports finds
2. Those finds show up on the Penny List automatically
3. Cade optionally improves (“enriches”) the best items later

---

## The Current Data Flow (What Actually Powers the Site)

This is the live, real system:

```
[Community submits via PennyCentral "Report a Find" page]
          ->
[/api/submit-find appends a new row to Google Sheets]
          ->
[Penny List reads from the published Google Sheet (about hourly refresh)]
          ->
[Cade optionally adds IMAGE URL + INTERNET SKU later]
```

**Key privacy rule:** the website submission form does **not** collect email, proof photos, receipts, or uploads.

---

## Weekly Workflow (15–30 min)

### Step 1: Open the Sheet (2 min)

Open your Google Sheet and sort by most recent.

### Step 2: Scan for High-Signal Items (10–20 min)

Look for:
- Duplicate SKUs (multiple reports = stronger signal)
- Recent dates
- Multiple states/regions

Skip:
- Obvious spam/junk
- Very old reports

### Step 3: Enrich the Best SKUs (optional, 3–10 min)

For the items you care about most, fill in:
- `IMAGE URL` (stock thumbnail)
- `INTERNET SKU` (more reliable Home Depot product link)

The site updates automatically once those are filled in.

---

## If You Also Keep a Google Form (Optional)

Google Forms are **not required** for PennyCentral submissions. If you keep one anyway (as a separate intake channel), make sure:
- Email collection is set to “Do not collect”
- There are no file upload questions
- The response sheet is not what you publish publicly (avoid accidental PII exposure)

---

## Scaling Guardrails

If submissions exceed ~20/week:
- Do two shorter reviews per week, or
- Start relying more on “duplicate SKU” signals and less manual review

If submissions exceed ~50/week:
- Plan a more structured moderation layer (but only if it’s worth the effort)

---

## Summary

| Aspect          | Approach                                                |
| --------------- | ------------------------------------------------------- |
| Collection      | PennyCentral “Report a Find” page                        |
| Storage         | Google Sheet (internal source of truth)                 |
| Publishing      | Published Google Sheet CSV (`GOOGLE_SHEET_URL`)          |
| Enrichment      | Cade fills `IMAGE URL` + `INTERNET SKU` later (optional) |
| Time cost       | ~15–30 min/week                                         |

