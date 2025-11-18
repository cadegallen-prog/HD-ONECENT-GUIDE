# Penny Haul & Resale Tracker – Complete Build Guide

**For Microsoft Excel & Google Sheets**

This guide will walk you through building a complete tracker for your Home Depot penny hauls, step-by-step. No advanced spreadsheet skills required!

---

## 1. Tracker Design Overview

### What This Tracker Is For

This tracker helps you manage your penny flipping business by:

- **Tracking penny hauls** from Home Depot (or any retailer)
- **Recording costs, resale prices, quantities, revenue, and profit** for each item
- **Quickly seeing** what's in stock vs. sold out
- **Knowing how much money** is tied up in inventory
- **Calculating total profit** across all your flips

### Simple Design Philosophy

The tracker uses:

- **One main table** where each row represents one SKU or one purchase batch
- **Optional summary section** at the top showing:
  - Total Cost (how much you've spent)
  - Total Revenue (how much you've earned)
  - Total Profit (your earnings minus costs)
  - Total Items in Stock (what you still have to sell)

The table uses **formulas** that calculate automatically, so you just enter the basic info and the spreadsheet does the math.

---

## 2. Column Layout (Exact Headers)

Below is the exact structure of your tracker table. You'll type these headers into **Row 1** of your spreadsheet, and your actual data will start in **Row 2**.

| Column Letter | Column Header              | Description                                              |
|---------------|----------------------------|----------------------------------------------------------|
| A             | Date Purchased             | Date you bought the item                                 |
| B             | Store                      | Store name or store number                               |
| C             | SKU / Internet #           | Home Depot SKU or Internet number                        |
| D             | Item Name                  | Short description of the item                            |
| E             | Qty Purchased              | Total units purchased                                    |
| F             | Cost per Unit              | What you paid per unit                                   |
| G             | Total Cost                 | Formula: Qty Purchased × Cost per Unit                   |
| H             | Est. Resale Price per Unit | What you expect to sell each unit for                    |
| I             | Qty Sold                   | How many units have sold so far                          |
| J             | Revenue                    | Formula: Qty Sold × Est. Resale Price per Unit           |
| K             | Profit                     | Formula: Revenue – Total Cost                            |
| L             | Notes                      | Any notes (condition, buyer info, etc.)                  |

### Key Points

- **Headers go in Row 1**
- **Data starts in Row 2**
- Columns G, J, and K will contain **formulas** (explained below)

---

## 3. Excel Instructions – Build the Table

### Step 1: Create a New Workbook

1. Open Microsoft Excel.
2. Click **Blank Workbook** (or File → New → Blank Workbook).
3. You'll see a fresh spreadsheet with cells labeled A1, B1, C1, etc.

### Step 2: Type the Column Headers

1. Click on cell **A1**.
2. Type: `Date Purchased`
3. Press **Tab** to move to B1.
4. Type: `Store`
5. Continue pressing **Tab** and typing the remaining headers:
   - C1: `SKU / Internet #`
   - D1: `Item Name`
   - E1: `Qty Purchased`
   - F1: `Cost per Unit`
   - G1: `Total Cost`
   - H1: `Est. Resale Price per Unit`
   - I1: `Qty Sold`
   - J1: `Revenue`
   - K1: `Profit`
   - L1: `Notes`

### Step 3: Widen the Columns

Some headers are long and won't fit in the default column width.

1. Move your mouse to the **boundary line** between column letters (e.g., between A and B in the header).
2. Your cursor will change to a **double-arrow**.
3. **Double-click** the boundary line.
4. The column will auto-resize to fit the content.
5. Repeat for all columns, or manually drag the boundary to your desired width.

### Step 4: Format the Header Row

Make the headers stand out:

1. **Select Row 1**: Click the row number "1" on the left side.
2. **Make it bold**: Click the **B** (Bold) button on the Home tab.
3. **Center the text**: Click the **center align** button.
4. **Add a background color**:
   - Click the **Fill Color** dropdown (paint bucket icon).
   - Choose a light blue, light orange, or any color you like.
5. **Change text color** (optional):
   - Click the **Font Color** dropdown (A with a colored underline).
   - Choose white or dark color depending on your background.

### Step 5: Apply "Format as Table"

Excel's table feature makes data easier to work with and adds nice styling:

1. Click **any cell** in your header row (like A1).
2. Go to **Home** tab → **Format as Table**.
3. Choose any style you like (e.g., "Table Style Medium 2").
4. A dialog will appear asking for the table range.
   - It should auto-detect `$A$1:$L$1` or similar.
   - **Check the box** "My table has headers".
5. Click **OK**.

Now your table has:
- **Alternating row shading** (easier to read)
- **Filter dropdowns** in each header (little arrows)

### Step 6: Freeze the Top Row

This keeps the headers visible when you scroll down:

1. Click on the **View** tab.
2. Click **Freeze Panes** → **Freeze Top Row**.

Now when you scroll down, Row 1 stays at the top.

### Step 7: Add the Formulas

Now we'll add formulas in Row 2 for the calculated columns: **Total Cost**, **Revenue**, and **Profit**.

#### Formula for Total Cost (Column G)

1. Click on cell **G2**.
2. Type the formula:
   ```
   =E2*F2
   ```
3. Press **Enter**.

**What this does:** Multiplies Qty Purchased (E2) by Cost per Unit (F2).

#### Formula for Revenue (Column J)

1. Click on cell **J2**.
2. Type:
   ```
   =I2*H2
   ```
3. Press **Enter**.

**What this does:** Multiplies Qty Sold (I2) by Est. Resale Price per Unit (H2).

#### Formula for Profit (Column K)

1. Click on cell **K2**.
2. Type:
   ```
   =J2-G2
   ```
3. Press **Enter**.

**What this does:** Subtracts Total Cost (G2) from Revenue (J2) to show profit.

### Step 8: Copy Formulas Down for Future Rows

You want these formulas to apply to every row you add:

1. Click on cell **G2** (the first formula).
2. Look for the small **square** in the bottom-right corner of the cell (the "fill handle").
3. Click and **drag down** to row 500 (or however many rows you want).
4. Release the mouse.

The formula will copy down, adjusting automatically (G3 = E3*F3, G4 = E4*F4, etc.).

**Repeat for J2 and K2:**
- Select J2, drag down to J500.
- Select K2, drag down to K500.

Now every row is ready to calculate automatically when you enter data.

---

## 4. Excel Instructions – Conditional Formatting & Colors

Conditional formatting automatically changes cell appearance based on values. We'll set up two rules:

### A) Make Sold-Out Rows Light Gray

**Goal:** When all units are sold (Qty Sold = Qty Purchased), the entire row turns light gray.

**Steps:**

1. **Select all data rows:**
   - Click on cell **A2**.
   - Press **Ctrl+Shift+End** to select from A2 to the last cell with data.
   - Or manually select **A2:L500** (adjust based on how many rows you want).

2. Go to **Home** tab → **Conditional Formatting** → **New Rule**.

3. Choose **"Use a formula to determine which cells to format"**.

4. In the formula box, type:
   ```
   =$I2=$E2
   ```

   **Important:** The dollar sign before the column letter (like `$I2`) keeps the column fixed, but the row number (2) will adjust for each row.

5. Click the **Format…** button.

6. In the **Fill** tab:
   - Choose a **light gray** color.

7. (Optional) In the **Font** tab:
   - Make the text a darker gray or italic so it's clear it's sold out.

8. Click **OK** → **OK**.

**Result:** Any row where Qty Sold equals Qty Purchased will now be shaded light gray automatically.

### B) Make Negative Profit Show in Red

**Goal:** If you lose money on a flip (Profit < 0), the profit cell turns red.

**Steps:**

1. **Select the Profit column:**
   - Click on **K2**, then drag down to **K500** (or however many rows).

2. Go to **Home** tab → **Conditional Formatting** → **New Rule**.

3. Choose **"Format only cells that contain"**.

4. Set the rule:
   - **Cell Value** → **less than** → `0`

5. Click **Format…**.

6. In the **Font** tab:
   - Choose **red** color.
   - (Optional) Make it **bold**.

7. Click **OK** → **OK**.

**Result:** Any negative profit will display in red, making losses easy to spot.

---

## 5. Excel Instructions – Optional Summary Section at Top

You can add a summary box to see totals at a glance. We'll put it to the right of the main table (e.g., columns N–Q).

### Step 1: Create the Summary Labels

In column N, starting at row 1, type:

- N1: `SUMMARY`
- N2: `Total Cost:`
- N3: `Total Revenue:`
- N4: `Total Profit:`
- N5: `Items in Stock:`

### Step 2: Add the Summary Formulas

Assuming your data goes from row 2 to row 500:

**In cell O2 (Total Cost):**
```
=SUM(G2:G500)
```

**In cell O3 (Total Revenue):**
```
=SUM(J2:J500)
```

**In cell O4 (Total Profit):**
```
=SUM(K2:K500)
```

**In cell O5 (Items in Stock):**
```
=SUMPRODUCT(E2:E500-I2:I500)
```

**What this does:** Adds up all (Qty Purchased – Qty Sold) to show how many items you still have.

### Step 3: Format the Summary Box

1. Select the range **N1:O5**.
2. **Add borders:**
   - Home tab → **Borders** dropdown → **All Borders**.
3. **Add a background color:**
   - Use the **Fill Color** button to choose a light yellow or light blue.
4. **Bold the labels:**
   - Select N2:N5 and click **Bold**.
5. **Format the numbers** (optional):
   - Select O2:O5.
   - Right-click → **Format Cells** → **Currency** or **Number** with 2 decimal places.

**Result:** You now have a live summary that updates as you add data.

---

## 6. Google Sheets Instructions – Build the Same Table

### Step 1: Create a New Google Sheet

1. Go to [https://sheets.google.com](https://sheets.google.com).
2. Click the **+ Blank** button (or **File** → **New** → **Spreadsheet**).
3. You'll see an empty spreadsheet.

### Step 2: Type the Column Headers

1. Click on cell **A1**.
2. Type: `Date Purchased`
3. Press **Tab** to move to B1.
4. Continue typing the headers (same as Excel):
   - B1: `Store`
   - C1: `SKU / Internet #`
   - D1: `Item Name`
   - E1: `Qty Purchased`
   - F1: `Cost per Unit`
   - G1: `Total Cost`
   - H1: `Est. Resale Price per Unit`
   - I1: `Qty Sold`
   - J1: `Revenue`
   - K1: `Profit`
   - L1: `Notes`

### Step 3: Resize Columns

1. Move your mouse to the **boundary between column letters** (e.g., between A and B).
2. **Double-click** to auto-fit, or **drag** to manually resize.
3. Repeat for all columns.

### Step 4: Format the Header Row

1. **Select Row 1**: Click the row number "1".
2. **Make it bold**: Click the **B** (Bold) button in the toolbar.
3. **Center align**: Click the **center align** button.
4. **Add background color**:
   - Click the **Fill color** icon (paint bucket).
   - Choose a color (e.g., light blue: `#1F4E79` for dark blue).
5. **Change text color**:
   - Click the **Text color** icon (A with underline).
   - Choose white if you used a dark background.

### Step 5: Turn On Filters

1. Select any cell in Row 1 (like A1).
2. Go to **Data** → **Create a filter**.

**Result:** Little filter dropdown arrows appear in each header cell.

### Step 6: Freeze the Top Row

1. Go to **View** → **Freeze** → **1 row**.

**Result:** The header row stays visible when you scroll down.

### Step 7: Add the Formulas

Now add formulas in Row 2 for **Total Cost**, **Revenue**, and **Profit**.

#### Formula for Total Cost (Column G)

1. Click on cell **G2**.
2. Type:
   ```
   =E2*F2
   ```
3. Press **Enter**.

#### Formula for Revenue (Column J)

1. Click on cell **J2**.
2. Type:
   ```
   =I2*H2
   ```
3. Press **Enter**.

#### Formula for Profit (Column K)

1. Click on cell **K2**.
2. Type:
   ```
   =J2-G2
   ```
3. Press **Enter**.

### Step 8: Copy Formulas Down

1. Click on **G2**.
2. Hover over the **small blue square** in the bottom-right corner of the cell.
3. **Click and drag down** to row 500 (or as far as you want).
4. Release.

Repeat for **J2** and **K2**.

---

## 7. Google Sheets Instructions – Conditional Formatting & Colors

### A) Sold-Out Rows = Light Gray

**Goal:** When Qty Sold equals Qty Purchased, the entire row turns light gray.

**Steps:**

1. **Select your data range:**
   - Click on **A2**, then drag to **L500** (or click A2 and type `A2:L500` in the Name Box).

2. Go to **Format** → **Conditional formatting**.

3. In the side panel:
   - **Apply to range:** Should show `A2:L500`.
   - Under **Format cells if**, choose **Custom formula is**.

4. In the formula box, type:
   ```
   =$I2=$E2
   ```

5. Under **Formatting style**:
   - Click the **Fill color** icon and choose a **light gray** (e.g., `#F3F3F3`).

6. Click **Done**.

**Result:** Rows where all items are sold out will automatically turn light gray.

### B) Profit < 0 = Red Text

**Goal:** If profit is negative, the cell text turns red.

**Steps:**

1. **Select the Profit column:**
   - Click on **K2**, drag down to **K500**.

2. Go to **Format** → **Conditional formatting**.

3. In the side panel:
   - **Apply to range:** Should show `K2:K500`.
   - **Format cells if:** Choose **Less than**.
   - **Value:** Type `0`.

4. Under **Formatting style**:
   - Click the **Text color** icon and choose **red** (e.g., `#FF0000`).
   - (Optional) Click the **Bold** button.

5. Click **Done**.

**Result:** Any negative profit will display in red text.

### C) Optional: Alternating Row Colors

Google Sheets can automatically shade every other row:

1. Select your data range (e.g., **A1:L500**).
2. Go to **Format** → **Alternating colors**.
3. Choose a style you like (e.g., light gray and white alternating).
4. Check **Header** if you want the header row to have a different color.
5. Click **Done**.

---

## 8. Example Rows – Fully Worked Sample

Below is a small sample showing how the tracker works with real numbers.

| Date Purchased | Store | SKU / Internet # | Item Name        | Qty Purchased | Cost per Unit | Total Cost | Est. Resale Price per Unit | Qty Sold | Revenue | Profit  | Notes                    |
|----------------|-------|------------------|------------------|---------------|---------------|------------|----------------------------|----------|---------|---------|--------------------------|
| 2025-11-15     | 0123  | 123-456          | Ryobi Drill Kit  | 4             | 0.01          | 0.04       | 45.00                      | 2        | 90.00   | 89.96   | Sold 2 on Facebook       |
| 2025-11-16     | 0456  | 789-012          | Milwaukee Light  | 3             | 0.01          | 0.03       | 35.00                      | 3        | 105.00  | 104.97  | All sold – great profit! |
| 2025-11-17     | 0789  | 345-678          | Vanity Fixture   | 1             | 20.00         | 20.00      | 15.00                      | 0        | 0.00    | -20.00  | Paid too much – lesson   |
| 2025-11-18     | 0123  | 456-789          | LED Bulb 4-Pack  | 10            | 0.01          | 0.10       | 8.00                       | 5        | 40.00   | 39.90   | Still have 5 left        |

### What's Happening Here

- **Row 2:** You bought 4 Ryobi drill kits for $0.01 each (total $0.04), sold 2 for $45 each, earning $90 in revenue and $89.96 in profit.
- **Row 3:** You bought 3 Milwaukee lights for $0.01 each (total $0.03), sold all 3 for $35 each, earning $105 in revenue and $104.97 in profit. This row would be **light gray** because Qty Sold (3) = Qty Purchased (3).
- **Row 4:** You paid $20 for a vanity fixture hoping to sell it for $15, but haven't sold it yet. Revenue is $0, so profit is **-$20** (shown in **red**).
- **Row 5:** You bought 10 LED bulb 4-packs for $0.01 each (total $0.10), sold 5 for $8 each, earning $40 in revenue and $39.90 in profit. You still have 5 left.

**Summary Totals (if you added the summary section):**
- **Total Cost:** $0.04 + $0.03 + $20.00 + $0.10 = **$20.17**
- **Total Revenue:** $90.00 + $105.00 + $0.00 + $40.00 = **$235.00**
- **Total Profit:** $89.96 + $104.97 + (-$20.00) + $39.90 = **$214.83**
- **Items in Stock:** (4 - 2) + (3 - 3) + (1 - 0) + (10 - 5) = **2 + 0 + 1 + 5 = 8 items**

---

## 9. Tips for Use & Maintenance

### Adding New Hauls

- **Simply add a new row** below your last entry.
- Fill in the Date Purchased, Store, SKU, Item Name, Qty Purchased, and Cost per Unit.
- The formulas in Total Cost, Revenue, and Profit will calculate automatically.

### Updating When Items Sell

- Find the row for the item you sold.
- Update the **Qty Sold** column.
- The **Revenue** and **Profit** columns will update instantly.
- If Qty Sold = Qty Purchased, the row will turn **light gray** (sold out).

### Watching Your Progress

- Check the **Profit** column to see which items are winners.
- Watch for **red negative profits** – these are items where you lost money or haven't sold yet.
- Use the **Summary Section** to track your overall business performance at a glance.

### Keeping the Template Clean

- **Make a copy** of your blank template before you start entering real data:
  - In Excel: File → Save As → give it a name like "Penny Tracker Template BLANK.xlsx"
  - In Google Sheets: File → Make a copy → name it "Penny Tracker Template BLANK"
- That way you can always go back to a clean version if you need to start fresh or share the template with someone.

### Sorting and Filtering

- Use the **filter dropdowns** in the header row to:
  - Show only sold-out items (Qty Sold = Qty Purchased)
  - Show only items still in stock (Qty Sold < Qty Purchased)
  - Sort by Date Purchased (newest first)
  - Sort by Profit (highest to lowest)

### Backup Your Data

- **Excel:** Save your file regularly and keep a backup on OneDrive, Dropbox, or an external drive.
- **Google Sheets:** Automatically saves to your Google Drive. Consider downloading a copy (File → Download → Microsoft Excel) as a backup.

---

## Final Thoughts

Congratulations! You now have a fully functional penny haul tracker that will:

- **Calculate profit automatically** as you enter data
- **Highlight sold-out items** so you know what's done
- **Flag losses in red** so you can learn and improve
- **Show your total business performance** in one place

Whether you're flipping a few items a month or running a serious resale business, this tracker will keep you organized and help you see what's working.

Happy flipping! 🛒💰

---

**Questions or Issues?**

If you run into trouble:
- Double-check that your formulas are exactly as shown (especially the `=` sign at the start).
- Make sure you've selected the correct ranges for conditional formatting.
- Remember that column letters and row numbers are case-insensitive in formulas.
- For Google Sheets, ensure you have edit permissions (not just view).
- For Excel, make sure you're not in "Protected View" mode.

Good luck building your tracker!
