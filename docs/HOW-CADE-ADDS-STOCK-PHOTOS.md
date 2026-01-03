# Cade Enrichment (Images + Internet SKU)

## How to Enrich Penny Items

Add entries to the `penny_item_enrichment` table in Supabase:

| Column | Description |
|--------|-------------|
| `sku` | Home Depot SKU (6 or 10 digits) |
| `image_url` | Stock product image URL |
| `internet_sku` | Internet SKU for reliable HD product links |
| `item_name` | (optional) Correct product name |
| `brand` | (optional) Brand name |
| `model_number` | (optional) Model number |
| `retail_price` | (optional) Retail price used to calculate “Save $X.XX” copy |

## How It Works

1. Add a row to `penny_item_enrichment` with the SKU you want to enrich
2. Fill in `image_url` and/or `internet_sku`
3. The site automatically overlays this data by SKU
4. Enrichment never overwrites community-submitted data, only fills missing fields

## Fallbacks

- Until `image_url` is populated, the Penny List shows the built-in placeholder image
- Product links always stay clickable: `internet_sku` is preferred, regular SKU search link is the fallback

## Bulk Import

To import enrichment data from a JSON file:

```bash
tsx scripts/enrichment-json-to-csv.ts <export.json> [output.csv]
```

Then import the CSV into Supabase via the dashboard.
