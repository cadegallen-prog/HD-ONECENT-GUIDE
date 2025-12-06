# Penny Crowdsource System — Maintenance Strategy

**Status:** Phase 1 (Live with manual curation)  
**Maintenance Load:** 30 min/week (sustainable)

---

## The Problem

You want a crowdsourced penny list, but **you cannot manually curate submissions daily**. The goal: **maximum community value with minimum your time**.

---

## The Solution: Three-Tier System

### TIER 1: Passive Collection (Requires No Your Action)
✅ **Google Form** collects all submissions automatically.  
✅ **Submissions appear in a public Google Sheet** (sharable, live-updated).  
✅ **Community can see what's been reported** (transparency, no secrets).

**Your time cost:** Zero (happens automatically).

### TIER 2: Lightweight Curation (15 min/week)
You review the Google Sheet **1x per week** and:
1. Look for **high-confidence items** (multiple reports of same SKU, consistent dates/stores).
2. Copy the top 3-5 items into `data/penny-list.json`.
3. Website updates automatically (no code changes needed).

**Your time cost:** 15 minutes on, say, Sunday night.

### TIER 3: Community Voting (Future Enhancement)
Long-term: Let the community upvote/downvote items directly on the site.  
This surfaces **the best finds without you doing anything**.

**Your time cost:** None (fully automated, once built).

---

## How It Works Today (Phase 1)

### The Google Form
- Collects: Item Name, SKU, Quantity, Store Location, Date, Photos, Notes
- **Response Validation** prevents garbage data
- **File uploads** build trust (people submit evidence)

### The Data Flow

```
[Community submits via Google Form]
         ↓
[Form responses auto-populate Google Sheet]
         ↓
[You review 1x/week (15 min)]
         ↓
[Copy best items → data/penny-list.json]
         ↓
[Website auto-updates, no code changes needed]
```

---

## Your Weekly Workflow (15 min)

### Step 1: Open the Form Responses (2 min)
1. Go to your Google Form: [https://forms.gle/WdP63y6yobs3s1pJ8](https://forms.gle/WdP63y6yobs3s1pJ8)
2. Click **Responses** tab
3. Click **Green Sheets Icon** → "Open in Sheets"

You'll see a spreadsheet with all submissions, sorted by date.

### Step 2: Identify High-Signal Findings (10 min)

**Look for:**
- **Duplicate SKUs** (same item reported multiple times = strong signal)
- **Multiple Regions** (nationwide = higher value)
- **Recent Dates** (within last 7 days = fresher)
- **Photos Attached** (proof = more trustworthy)

**Skip:**
- Single reports with no confirmation
- Super old findings (>2 weeks)
- Items with unclear/inconsistent details

### Step 3: Update the Website (3 min)

1. Pick your **top 3-5 items** from the sheet
2. Open `data/penny-list.json` in VS Code
3. Update the array with new items:
   - Name
   - SKU
   - Quantity Found (copy from form)
   - Status (Nationwide / Regional / Rare)
   - Notes (copy from form notes)
   - dateAdded (today's date, YYYY-MM-DD)

4. **Save the file**
5. **Commit to Git**: `git add data/penny-list.json && git commit -m "Weekly penny list update"`
6. **Push**: `git push`

**That's it.** Website updates automatically via Vercel.

---

## Template for data/penny-list.json

```json
[
  {
    "id": "1",
    "name": "Item Name Here",
    "sku": "1001234567",
    "price": 0.01,
    "dateAdded": "2025-12-08",
    "status": "Nationwide",
    "quantityFound": "12+ (Full Shelf)",
    "imageUrl": "/images/placeholder-product.jpg",
    "notes": "Found in [location], [region]. Store #[####]. Check [aisle/section]."
  }
]
```

---

## Quality Control (Passive)

The system has built-in **anti-spam mechanisms**:

1. **SKU Validation** (Regex): Form rejects invalid SKU formats
2. **File Uploads**: Requiring photos increases effort (weeds out trolls)
3. **Location Data**: Store # or City/State prevents vague submissions
4. **Your Eyes**: You see everything, decide what's worth posting

---

## Transparency (Community Building)

**Consider making the Google Sheet public:**

```
Share → Anyone with the link can view
```

**Benefits:**
- Community sees their submissions are being considered
- Reduces duplicate reports (they see it's already there)
- Builds trust ("I know my data is being used")
- No pressure on you to respond quickly

**You can link to it on the penny-list page:**
> "See all community submissions (reviewed weekly): [link to sheet]"

---

## Future: Automation (Phase 2+)

Once you have enough submissions flowing, you could:

1. **Auto-populate** high-confidence items (multiple reports of same SKU)
2. **Community voting** (users upvote items directly on site)
3. **Automated alerts** (notify community when item hits penny in their region)

**But start with Phase 1.** Get data flowing, learn what the community reports, then automate.

---

## What NOT to Do

❌ **Don't build a full backend.** (Too complex for solo dev)  
❌ **Don't curate every single submission.** (Unsustainable)  
❌ **Don't require user accounts.** (Creates friction)  
❌ **Don't manually enter all data.** (Copy/paste is fine for now)

---

## Scaling Guardrails

**If submissions exceed 20/week:**
- Consider a second weekly pass (still only 30 min total)
- Or: Move to community voting (automate your curation)

**If submissions exceed 50/week:**
- You probably need a backend (database, voting system)
- But that's a great problem to have!

---

## Monthly Check-In

Every month, ask:
- Are submissions trending toward quality items or noise?
- Is the community happy with update frequency?
- Do you have time to maintain this?

Adjust your curation threshold accordingly.

---

## Summary

| Aspect | Approach |
|--------|----------|
| **Collection** | Google Form (automatic) |
| **Storage** | Google Sheet (free, visible) |
| **Curation** | You (1x/week, 15 min) |
| **Publishing** | JSON file (no code changes) |
| **Deployment** | Git push → Vercel (auto) |
| **Time Cost** | 30 min/week |
| **Scalability** | Sustainable to ~50 submissions/week |

---

## Next Steps

1. **Get feedback:** Does this feel realistic for you?
2. **Set a schedule:** Pick a day/time each week (e.g., Sunday 8pm)
3. **Monitor:** After 2 weeks, see how many submissions you're getting
4. **Adjust:** If the load is too high or too low, we pivot

Ready?
