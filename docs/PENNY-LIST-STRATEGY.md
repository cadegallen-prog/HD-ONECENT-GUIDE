# Penny List Strategy: The "Community-Powered" Engine

## The Core Problem

You are one person. You cannot manually track every penny item nationwide.
**Goal:** Create a self-sustaining system where the _community_ does the work, and you just provide the _platform_.

---

## 1. The Mechanism: "Trust but Verify"

We will move from you _finding_ data to you _curating_ data.

### Step 1: Collection (The "Submit" Button)

**Tool:** Google Forms (Free, Reliable, Mobile-friendly) or Tally.so (Prettier).
**Why:**

- Zero coding to maintain.
- Handles photo uploads automatically.
- Spam protection built-in.
- Easy to embed on the site.

**The Form Fields:**

1.  **SKU** (Required - The unique ID)
2.  **Product Name** (Required - "Husky 50ft Cord")
3.  **Photo Proof** (Required - Receipt or Shelf Tag)
    - _Crucial:_ No photo = No list. This stops trolls.
4.  **Store Location** (State/City - Optional but helpful)
5.  **Notes** (Where was it? "Hidden in garden center")

### Step 2: Verification (The "Gatekeeper")

**Tool:** Google Sheets (Connected to the Form).
**Workflow:**

1.  New submissions appear as rows in the Sheet.
2.  You (or a trusted mod) spend 15 mins/day scanning the sheet.
3.  Look at the photo. Is it real?
4.  Check a box in the "Approved" column.
5.  **Done.**

### Step 3: Display (The Website)

**Tool:** Next.js + Google Sheets API.
**Workflow:**

1.  The website automatically pulls _only_ rows where "Approved" = TRUE.
2.  It displays them in a searchable, sortable table.
3.  Users can search by SKU or Category.

---

## 2. Data Integrity & Rules

To keep the list valuable and prevent "garbage in, garbage out":

- **The "2-Week Rule":** The website only shows items verified in the last 14-30 days. Penny items sell out fast. Old data frustrates users.
- **Photo Mandatory:** This is your #1 defense against fake data.
- **SKU is King:** Names change, SKUs don't. The system relies on SKUs.

---

## 3. The List Format

**On the Website (Free Tier):**

- **Searchable Table:**
  - Columns: Date Found | Product Name | SKU | State | Status (Verified)
- **"Copy SKU" Button:** One click to copy for the HD App.

**Downloadable (Lead Magnet / Future Pro):**

- **PDF / CSV Export:** "Download this week's full list".
- This captures emails or becomes a paid perk later.

---

## 4. Monetization Path

1.  **Traffic (Now):** The list brings people back daily. More traffic = more ad revenue (future).
2.  **Affiliate (Hard):** Penny items aren't online, so you can't link to them for commission. _However_, you can suggest "If you can't find the penny version, here's the best alternative" (Amazon/HD affiliate links).
3.  **"Pro" Access (Future):**
    - Free users: See items 24 hours after verification.
    - Pro users ($5/mo): See items _instantly_ as they are verified.
    - _Note:_ Only do this once you have massive volume.

---

## 5. Implementation Plan (Step-by-Step)

**Phase 1: The "No-Code" MVP (This Weekend)**

1.  Create the Google Form.
2.  Link it in the Navbar ("Submit a Find").
3.  Manually update the existing JSON file for now based on submissions.
4.  _Goal:_ Test if people actually submit data.

**Phase 2: Automation (Next Week)**

1.  Connect Google Sheet to the Website.
2.  Build the "Live List" page that reads from the Sheet.
3.  Stop manually editing JSON files.

**Auth/Accounts (Not Now):** Follow `docs/AUTH-PIVOT-GUIDANCE.md` before considering auth. Do not add accounts until the listed milestones (volume, moderation pain, feature need, resourcing) are met.

**Phase 3: Expansion (Next Month)**

1.  Add "Download PDF" feature.
2.  Recruit 1-2 "Trusted Mods" from your FB group to help check the "Approved" box in the sheet.

---

## Summary for the Founder

- **Your Effort:** Drops from hours/day to 15 mins/day (just checking boxes).
- **Cost:** $0 (Google Forms/Sheets are free).
- **Risk:** Low. If someone spams, you just don't check the "Approved" box.
