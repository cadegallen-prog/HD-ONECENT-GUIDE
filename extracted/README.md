# Extracted Scraper Core: Usage Guide

This is the **minimal portable data-harvest unit** extracted from `DO_NOT_COMMIT_Cade_Penny_List/scrape.py`.

## What It Does

- Calls the penny-items API for multiple zip codes
- Parses JSON responses
- Normalizes field names (stock, date, price, image, location)
- Deduplicates by (store_sku, store_name)
- Returns structured JSON: `{ok: bool, data: [...]}`

## What It Does NOT Do

- No UI or dashboard generation
- No email sending
- No file I/O (except when run standalone)
- No stealth or bypass behavior
- No database or external storage

---

## Installation

### Dependencies

```bash
pip install requests pandas
```

If running in this repo:
```bash
pip install -r requirements_product_identifier.txt
```

### File Location

```
extracted/scraper_core.py
```

---

## Usage

### 1. As a Module (Recommended)

```python
from extracted.scraper_core import run_scrape

result = run_scrape(
    raw_cookie="your-cookie-value",
    guild_id="your-guild-id"
)

if result["ok"]:
    print(f"✅ Success! {result['final_count']} items")
    for item in result["data"]:
        print(f"  - {item['item_name']} @ {item['store_name']}")
else:
    print(f"❌ Failed at {result['stage']}: {result['error']}")
```

### 2. Standalone with Environment Variables

```bash
export PENNY_RAW_COOKIE="your-cookie"
export PENNY_GUILD_ID="your-guild-id"
python extracted/scraper_core.py
```

Output: JSON to stdout

```json
{
  "ok": true,
  "data": [
    {
      "store_name": "Store A",
      "store_sku": "123456",
      "upc": "000111222333",
      "item_name": "Product Name",
      "display_stock": 5,
      "penny_date": "2025-01-14T10:30:00",
      "days_old": 0,
      "price": "$0.01",
      "retail_price": "$1.99",
      "image_link": "https://...",
      "location": "Front End",
      "raw_stock_field": "stock",
      "raw_date_field": "dropped_at"
    }
  ],
  "raw_count": 147,
  "final_count": 142
}
```

### 3. Custom Zip Codes

```python
from extracted.scraper_core import run_scrape

result = run_scrape(
    raw_cookie="your-cookie",
    guild_id="your-guild-id",
    zip_codes=["30121", "30161", "30720"]  # Custom list
)
```

If `zip_codes=None`, defaults to the original 12 Georgia zips.

---

## Required Environment Variables

### For Live Scraping

- `PENNY_RAW_COOKIE` - Raw cookie from authenticated session (required)
- `PENNY_GUILD_ID` - Guild identifier (required)

### How to Get These

See the original scraper instructions in `DO_NOT_COMMIT_Cade_Penny_List/scrape.py` (lines 141-150).

---

## Return Value

### On Success

```json
{
  "ok": true,
  "data": [
    { "item": 1 },
    { "item": 2 }
  ],
  "raw_count": 150,
  "final_count": 142
}
```

### On Failure

```json
{
  "ok": false,
  "error": "Empty API response. Check credentials and API availability.",
  "stage": "fetch",
  "raw_count": 0,
  "final_count": 0
}
```

**Possible stages:**
- `"fetch"` - API call returned no data
- `"execution"` - General exception during run

---

## Output Fields Explained

| Field | Type | Example | Source |
|-------|------|---------|--------|
| `store_name` | str | "Store ABC" | API |
| `store_sku` | str | "123456" | API (flexible column name) |
| `upc` | str | "000111222333" | API |
| `item_name` | str | "Penny Cola 12oz" | API |
| `display_stock` | int or str | 5 or "Check App" | API stock columns + normalization |
| `penny_date` | str (ISO) | "2025-01-14T10:30:00" | API date columns + parsing |
| `days_old` | int | 0 | Calculated from penny_date |
| `price` | str | "$0.01" | API price columns + formatting |
| `retail_price` | str | "$1.99" | API retail columns + formatting |
| `image_link` | str | "https://..." | API image columns |
| `location` | str | "Front End" | API location columns |
| `raw_stock_field` | str | "stock" | Name of detected stock column (debug) |
| `raw_date_field` | str | "dropped_at" | Name of detected date column (debug) |

---

## Testing in This Repo

### Dry Run (No Credentials Needed)

The original scraper has a `--dry-run` mode with sample data. This extracted core does not include that.
To test without credentials, use the original scraper:

```bash
cd DO_NOT_COMMIT_Cade_Penny_List
python scrape.py --dry-run
```

### With Real Credentials

```bash
export PENNY_RAW_COOKIE="<your-cookie>"
export PENNY_GUILD_ID="<your-guild-id>"
python extracted/scraper_core.py
```

---

## Integrating Into Another Project

### Copy the File

```bash
cp extracted/scraper_core.py /path/to/other-project/
```

### Install Deps

```bash
pip install requests pandas
```

### Use It

```python
from scraper_core import run_scrape

result = run_scrape(raw_cookie="...", guild_id="...")
if result["ok"]:
    items = result["data"]
    # Now you have a list of normalized dicts
```

---

## Configuration Options

The `PennyScraperCore` class accepts:

```python
scraper = PennyScraperCore(
    raw_cookie="...",              # Required
    guild_id="...",                # Required
    zip_codes=None,                # Optional, defaults to GA list
    api_url="https://pro.scouterdev.io/api/penny-items",  # Changeable
    timeout_sec=15,                # HTTP timeout
    rate_limit_sec=1.2,            # Sleep between requests
)
result = scraper.run()
```

---

## Error Handling

The core **never throws unhandled exceptions**. All errors are caught and returned as:

```json
{
  "ok": false,
  "error": "Human-readable error message",
  "stage": "where_it_failed",
  "raw_count": 0,
  "final_count": 0
}
```

This allows you to handle failures gracefully without try/catch blocks.

---

## Performance

- **Default rate limit:** 1.2 seconds between requests
- **Default timeout:** 15 seconds per request
- **Default zip codes:** 12 (GA only)

Total time for default run: ~20 seconds (12 requests × 1.2s + API latency)

---

## Differences from Original Scraper

| Feature | Original | Extracted |
|---------|----------|-----------|
| API calls | ✅ Yes | ✅ Yes |
| Normalization | ✅ Yes | ✅ Yes |
| CSV export | ✅ Yes | ❌ No |
| JSON export | ✅ Yes | ✅ Yes (return value) |
| Dashboard HTML | ✅ Yes | ❌ No |
| Email sending | ✅ Yes | ❌ No |
| Dry-run mode | ✅ Yes | ❌ No |
| Raw response logging | ✅ Yes | ❌ No |
| CLI entrypoint | ✅ Yes | ✅ Yes |
| Module entrypoint | ✅ Limited | ✅ Yes (main use case) |

---

## Troubleshooting

**Problem:** `ModuleNotFoundError: No module named 'requests'`
**Solution:** `pip install requests`

**Problem:** `Empty API response. Check credentials and API availability.`
**Solution:** Verify `PENNY_RAW_COOKIE` and `PENNY_GUILD_ID` are correct and the API endpoint is reachable.

**Problem:** HTTP 403 or 401
**Solution:** Cookie may be expired. Get a fresh one.

**Problem:** Timeout errors
**Solution:** Increase `timeout_sec` when instantiating the scraper, or check network/firewall.

---

## Source Reference

- **Original scraper:** `DO_NOT_COMMIT_Cade_Penny_List/scrape.py`
- **Flow documentation:** `docs/SCRAPER_FLOW_EXACT.md`
- **Extracted core:** `extracted/scraper_core.py` (this file)

---

## License / Attribution

This is extracted from the penny-items scraper in the product_type_identifier_repo.
Reuse as needed within the project or other contexts.
