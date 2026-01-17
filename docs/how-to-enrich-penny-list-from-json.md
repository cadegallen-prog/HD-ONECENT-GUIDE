# How to Enrich Penny List SKUs from JSON (No Coding Required)

This guide shows you how to add or update Penny List product details using a simple JSON file, without needing to write code.

## What You Need

- Your enrichment data in JSON format (like the example you provided)
- Access to the Supabase dashboard for your project

## Step-by-Step Instructions

### 1. Prepare Your JSON Data

- Make sure your data looks like this:

```json
{
  "1003431348": {
    "sku": "1003431348",
    "internetNumber": "305609813",
    "pageUrl": "https://www.homedepot.com/p/...",
    "name": "Product Name",
    "brand": "Brand Name",
    "price": "$259",
    "model": "MODEL123",
    "upc": "1234567890123",
    "imageUrl": "https://...jpg"
  },
  ...
}
```

### 2. Convert JSON to Table Format (Optional)

- You can use a free online tool like [json-csv.com](https://json-csv.com/) to convert your JSON to a spreadsheet for easier viewing/editing.

### 3. Open Supabase Dashboard

- Go to [Supabase](https://app.supabase.com/), log in, and select your project.

### 4. Use the Table Editor

- In the left sidebar, click **Table Editor**.
- Find and select the `penny_item_enrichment` table.
- Click **Insert Row** to add a new product, or click a row to edit an existing one.
- Copy/paste the values from your JSON for each field:
  - `sku` (required)
  - `item_name` (from `name`)
  - `brand`
  - `model_number` (from `model`)
  - `upc`
  - `image_url` (from `imageUrl`)
  - `home_depot_url` (from `pageUrl`)
  - `internet_sku` (from `internetNumber`)
  - `retail_price` (from `price`, remove the `$` sign)

### 5. Save Your Changes

- Click **Save** after each row you add or edit.
- Repeat for all SKUs you want to enrich.

### 6. Refresh the Penny List

- Wait a few minutes for the website cache to update.
- Refresh the Penny List page to see your changes live.

---

## Tips

- You can add or update as many SKUs as you want at once.
- If you have a lot of SKUs, you can use the **Import Data** feature in Supabase (CSV format) for bulk updates.
- If you want a script to automate this, just ask!

## Need Help?

If you get stuck, just ask your agent or Copilot for help. You never have to do this alone!
