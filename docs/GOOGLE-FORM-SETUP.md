# Google Form Configuration — Penny Central

**Live Form URL:** [https://forms.gle/WdP63y6yobs3s1pJ8](https://forms.gle/WdP63y6yobs3s1pJ8)

This document records exactly how the "Submit a Find" Google Form is configured. If you ever need to recreate it, follow these exact steps.

---

## Form Settings

**Title:** Penny Central — Submit Your Penny Find  
**Description:** Report your Home Depot 1¢ finds so they can be reviewed and added to PennyCentral. Please follow the instructions so your SKU and quantity are accurate.

---

## Questions Configuration

### 1. Item Name

- **Type:** Short answer
- **Required:** ✅ Yes
- **Description:** Enter the exact name of the product.

### 2. Home Depot SKU (6 or 10 digits)

- **Type:** Short answer
- **Required:** ✅ Yes
- **Description:** This is the Home Depot SKU, not the barcode. It will be 6 digits or 10 digits. Examples: 123456 or 1001234567. Do not enter the long UPC/barcode number printed on the box.
- **Validation:** Regular expression → Matches → `^\d{6}$|^\d{10}$`
- **Error text:** SKU must be 6 or 10 digits. Do not enter the barcode.

### 3. Exact Quantity Found

- **Type:** Short answer
- **Required:** ✅ Yes
- **Description:** Enter the exact number of items you found.
- **Validation:** Number → Greater than or equal to → 1
- **Error text:** Enter a whole number (no decimals).

### 4. Store Location (City, State or Store #)

- **Type:** Short answer
- **Required:** ✅ Yes
- **Description:** Example: “Store #0123” or “Kennesaw, GA”.

### 5. Date Found

- **Type:** Date
- **Required:** ✅ Yes

### 6. Upload Photo(s) of Item / Shelf Tag / Receipt

- **Type:** File upload
- **Required:** ❌ No (Optional but recommended)
- **Description:** Add 1–3 photos. Helps confirm accuracy.
- **Settings:** Allow specific file types (Images), Max 5 files, Max 10 MB.

### 7. Notes (Optional)

- **Type:** Paragraph
- **Required:** ❌ No
- **Description:** Where was it found? Overhead? Hidden? Clearance rack?

---

## Confirmation Message

**Settings → Presentation → Confirmation message:**

> Thank you! Your submission has been received and will be reviewed for PennyCentral. 🧡

---

## How to Use the Data

1. Open the Google Form.
2. Click **Responses** tab.
3. Click the **Green Sheets Icon** to view in a spreadsheet.
4. Copy verified rows into `data/penny-list.json` in this project.
