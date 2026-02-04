# Penny Central Scraper Documentation

## Identifier Strategy (CANONICAL)

### Database/Supabase Identifier

**Primary Key: Store SKU (6-10 digits)**

- **Why**: ALL items have a store SKU, but NOT all items have an internet SKU
- **Format**: 6-10 digit number (e.g., `1000026461`)
- **Table Column**: `sku` in `penny_item_enrichment`
- **Coverage**: 100% of items

### Secondary Identifier

**Internet SKU (6-12 digits)**

- **Purpose**: Better URL generation and direct product page access
- **Format**: 6-12 digit number (e.g., `204693753`)
- **Table Column**: `internet_sku` in `penny_item_enrichment`
- **Coverage**: ~70-80% of items

### URL Generation Strategy

**For Scraping:**

1. **Prefer**: `/p/{internet_sku}` when available
   - Goes directly to product page
   - More reliable (no redirect needed)
   - Example: `https://www.homedepot.com/p/204693753`

2. **Fallback**: `/s/{store_sku}` when internet SKU unavailable
   - Search by store SKU
   - Tampermonkey auto-redirects to product page
   - Example: `https://www.homedepot.com/s/1000026461`

**For Database Storage:**

- Always use **Store SKU as the primary key**
- Store Internet SKU as optional supplementary field
- Enables lookup by either identifier

---

## Scraper Components

### 1. HTML Controller (`pennycentral_scraper_controller_4to10s_resilient_retry.html`)

**Purpose**: Orchestrates parallel scraping sessions

**Key Features:**

- Opens URLs in parallel tabs (configurable: 3-10 concurrent)
- Deduplicates URLs before scraping (removes ~65% duplicates)
- Pre-scrape database check (skips items that already have a retail price)
- Batch processing with cooldown periods (anti-bot protection)
- Exports to JSON (scraped items) + JSON (failures). If supported, uses a user-selected folder; otherwise saves via Downloads.

**Database Key Logic:**

```javascript
const productKey = data.storeSku || data.internetNumber || data.productUrl || url
```

Priority: Store SKU (canonical) > Internet SKU > Product URL > Input URL

### 2. Tampermonkey Userscript (`Tampermonkey.txt`)

**Purpose**: Extracts product data from Home Depot pages

**Installation:**

1. Install Tampermonkey browser extension
2. Create new userscript
3. Copy contents of `Tampermonkey.txt`
4. Save and enable

**Data Extracted:**

- Store SKU (storeSku) - **Primary identifier**
- Internet SKU (internetNumber) - Secondary identifier
- Product name, brand, UPC
- Retail price (from JSON-LD or page selectors)
- Image URL, categories, product URL
- Timestamp

**Auto-Redirect:** Detects `/s/` search pages and redirects to `/p/` product pages

### 3. Auto-Enrich Script (`auto-enrich.ts`)

**Purpose**: Alternative Playwright-based scraper

**Usage:**

```bash
npx tsx scripts/auto-enrich.ts
```

**Features:**

- Headless browser scraping
- SKU validation and mismatch detection
- Status cache (prevents re-scraping)
- CSV output format
- Configurable delays and retries

---

## Workflow

### Initial Setup

1. Install Tampermonkey userscript in browser
2. Open HTML controller in browser
3. Click "📁 Set Export Folder" (optional, for easier exports)
4. Clear old database if starting fresh

### Scraping Session

1. Click "▶ START SESSION"
2. Watch logs for progress:
   - `📋 Deduplicated X URLs → Y unique products`
   - `⏭️ Already scraped (has price): [product]` (skipped)
   - `🔁 Updated [product] (retail $X.XX)` (existing entry upgraded with price)
   - `📦 Saved [product] (retail $X.XX)` (success)
   - `⚠️ No price for: [product]` (warning)
3. Scraper automatically handles:
   - URL deduplication
   - Pre-scrape checks
   - Parallel tab management
   - Cooldown periods
   - Failure tracking

### Export Data

1. Click "💾 Export JSON" for full dataset
2. Click "Export Failures JSON" for failed items
3. Files saved to chosen folder or Downloads

### Upload to Supabase

```bash
# Preview (merge/fill-blanks-only; skips $0.00 rows)
npx tsx scripts/bulk-enrich.ts --input <path-to-penny_scrape.json> --source scraper --dry-run

# Execute
npx tsx scripts/bulk-enrich.ts --input <path-to-penny_scrape.json> --source scraper
```

---

## Data Deduplication

### Three Layers of Deduplication:

1. **URL Deduplication** (before scraping)
   - Extracts SKU from each URL
   - Keeps first occurrence
   - Example: 420 URLs → 111 unique products

2. **Pre-Scrape Check** (before opening tab)
   - Checks if SKU already in database
   - Skips opening tab if found
   - Checks both Store SKU and Internet SKU

3. **Save-Time Check** (when saving data)
   - Checks if product key exists
   - Logs "Skipped duplicate" if found
   - Uses Store SKU as primary key

### Lookup Logic:

```javascript
// Check if already scraped (handles both SKU types)
if (db.hasOwnProperty(storeSku)) return true // Primary check
for (const product of Object.values(db)) {
  if (product.internetNumber === internetSku) return true // Secondary check
}
```

---

## Validation Rules

### Required Fields (Rejection):

- Product name
- Store SKU OR Internet SKU (at least one)

### Optional Fields (Warning):

- Retail price (warns if null/0, but still saves)

### Failure Categories:

- `blocked` - Access denied / bot detection
- `not_available` - Region-locked / unavailable
- `incomplete_data` - Missing name or SKU
- `timeout` - Page didn't respond in 45 seconds
- `no_product` - No product data found

---

## Configuration

### Scraping Parameters:

- **Parallel Tabs**: 3-10 (default: 3)
- **Batch Size**: 50-500 (default: 250)
- **Cooldown**: 10-60 minutes (default: 20)
- **Timeout**: 45 seconds per page
- **Jitter**: 3-8 seconds between tabs

### Best Practices:

- Use 3 parallel tabs for respectful scraping
- Set 20-minute cooldown to avoid detection
- Start with small batches (50-100) to test
- Monitor failure rate (>10% = adjust settings)

---

## Troubleshooting

### Issue: Triple-Scraping (Same Product 3x)

**Cause**: Old bug where URL was used as database key
**Fix**: Updated to use Store SKU as primary key (✅ Fixed)

### Issue: Null Prices Saved

**Status**: Working as intended - items without prices are still saved for metadata
**Logs**: `⚠️ No price for: [product name]`

### Issue: URLs Not Deduplicated

**Check**: Look for log message `📋 Deduplicated X URLs → Y unique products`
**Fix**: Ensure `deduplicateUrls()` is called in `startScraping()`

### Issue: Pre-Scrape Check Not Working

**Cause**: Database might not have Store SKU as key
**Fix**: Re-scrape with updated HTML controller

---

## File Locations

```
scripts/GHETTO_SCRAPER/
├── pennycentral_scraper_controller_4to10s_resilient_retry.html  # Main controller
├── Tampermonkey.txt                                             # Userscript
├── penny_scrape_*.json                                          # Scraped data exports
├── penny_scrape_failures_*.json                                 # Failure logs (JSON)
├── penny_scrape_failures_*.csv                                  # Failure logs (CSV)
└── README.md                                                    # This file

.local/
├── check-supabase-skus.ts         # Query Supabase for SKUs needing prices
├── (replaced) upload-scraped-to-supabase.ts  # Use scripts/bulk-enrich.ts instead
├── filter-urls.js                 # Filter URLs against Supabase data
├── supabase-skus-with-price.json  # SKUs that have prices (skip these)
└── supabase-skus-needing-price.json  # SKUs needing prices (scrape these)
```

---

## Supabase Integration

### Generate URLs to Scrape:

```bash
npx tsx .local/check-supabase-skus.ts
```

**Output files**:

- `urls-to-scrape.json` - Deduplicated URLs ready to paste into scraper
- `products-with-price.json` - Products with prices (reference)
- `products-needing-price.json` - Products needing prices (reference)

**Workflow**:

1. Run the script
2. Open `.local/urls-to-scrape.json`
3. Copy the URLs
4. Paste into scraper HTML (line ~631)
5. Run scraper

**Key features**:

- ONE URL per product (no duplicates)
- Prefers `/p/{internet_sku}` when available
- Falls back to `/s/{store_sku}` when needed

### Upload Scraped Data:

```bash
# Preview (merge/fill-blanks-only; skips $0.00 rows)
npx tsx scripts/bulk-enrich.ts --input <path-to-penny_scrape.json> --source bookmarklet --dry-run

# Execute
npx tsx scripts/bulk-enrich.ts --input <path-to-penny_scrape.json> --source bookmarklet
```

Automatically:

- Deduplicates/merges by Store SKU
- Default is fill-blanks-only (use `--force` to overwrite existing enrichment values)
- Skips explicit `$0.00` retail price rows
- Upserts to `penny_item_enrichment` table
- Uses `--source` tag (recommend: `bookmarklet`)

---

## Data Schema

### Scraped JSON Format:

```json
{
  "1000026461": {
    "internetNumber": "204693753",
    "storeSku": "1000026461",
    "name": "Product Name",
    "brand": "Brand Name",
    "upc": "0123456789012",
    "categories": "Category > Subcategory",
    "imageUrl": "https://images.thdstatic.com/...",
    "retailPrice": 8.97,
    "productUrl": "https://www.homedepot.com/p/...",
    "scrapedAt": "2026-01-03T03:18:23.068Z"
  }
}
```

**Key**: Store SKU (canonical identifier)
**Value**: Product data object

### Supabase Schema (`penny_item_enrichment`):

```typescript
{
  sku: string // Store SKU (PRIMARY KEY)
  internet_sku: string // Internet SKU (optional)
  item_name: string
  brand: string
  model_number: string
  upc: string
  image_url: string
  home_depot_url: string
  retail_price: number
  source: "bookmarklet" | "serpapi" | "manual"
  updated_at: timestamp
}
```

---

## Change Log

### 2026-01-03: Major Fixes

- ✅ Fixed triple-scraping bug (URL → Store SKU key)
- ✅ Added URL deduplication (420 → 111 unique)
- ✅ Added pre-scrape database check
- ✅ Enhanced data validation
- ✅ Canonized Store SKU as primary identifier
- ✅ Added dual-lookup (Store SKU + Internet SKU)

### Previous Issues (Fixed):

- ❌ Database keyed by URL instead of SKU
- ❌ No deduplication before scraping
- ❌ No pre-scrape checks
- ❌ Internet SKU prioritized over Store SKU
