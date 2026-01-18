# Home Depot Scraping: Costs & Options

## Why Scraping HD is Hard

Home Depot uses aggressive bot detection:

- Akamai Bot Manager
- TLS/JA3 fingerprinting (this is why stealth plugins fail!)
- Webdriver detection
- IP reputation scoring

## Cost Options (Pick ONE)

### Option 1: SerpApi Free/Cheap Tier ✅ RECOMMENDED

- Uses SerpApi's Home Depot Search API
- They handle everything (TLS fingerprinting, CAPTCHAs, proxies)
- **Free tier: 250 searches/month** (covers typical usage)
- **$25/mo tier: 1,000 searches/month** (if you need more)
- Runs autonomously via GitHub Actions
- **95%+ success rate**

### Option 2: Manual Bookmarklet (Free)

- Run bookmarklet while browsing HD manually
- Export to JSON, import via `npm run enrich:bulk`
- 100% reliable but requires your time
- **Cost: $0**

### Option 3: Stealth Scraper (Unreliable)

- Playwright + stealth + proxies
- **Often fails** due to TLS fingerprinting
- May work for small batches locally
- **Not recommended for production**

## Current Setup: Option 1 (SerpApi)

### How It Works

```
GitHub Actions (free, runs every 6 hours)
    ↓
SerpApi Home Depot Search API ($0-25/mo)
    ↓ fetches product data for ~1 SKU per run by default (manual runs can raise the limit)
penny_item_enrichment table (Supabase)
    ↓ merges with user submissions
Polished Penny Cards (no placeholders!)
```

Budget note: the script always spends **1 SerpApi search** per SKU (search by SKU), and may spend a **2nd search** (fallback by item name) when SKU search fails. The default schedule+limit is set to stay under the **250 searches/month** free tier even in the worst case.

This pipeline writes enrichment fields (name/brand/model/image/link/internet_sku/retail_price) into `penny_item_enrichment` **fill-blanks-only by default** (no overwrites unless you use `--force`).

UPC/barcode: SerpApi does not reliably return UPC. The script attempts a **best-effort UPC extract from the Home Depot product page (no SerpApi credits)** when it has a working `home_depot_url`, but it can still fail due to bot/region blocks.

### Required Setup

1. **Sign up for SerpApi** (~2 minutes)
   - Go to https://serpapi.com
   - Create free account (no credit card needed)
   - Copy your API key from dashboard

2. **Add GitHub Secret** (Settings → Secrets → Actions)

   ```
   SERPAPI_KEY = your-serpapi-api-key
   ```

   (Supabase secrets should already be configured)

3. **Enable GitHub Actions**
   - The workflow at `.github/workflows/serpapi-enrich.yml` runs automatically
   - Or trigger manually: Actions → SerpApi Enrich → Run workflow

### Monthly Cost Breakdown

| Service           | Cost      | What It Does                     |
| ----------------- | --------- | -------------------------------- |
| SerpApi Free Tier | $0        | 250 searches/month               |
| SerpApi Starter   | $25/mo    | 1,000 searches/month (if needed) |
| GitHub Actions    | $0        | 2000 free minutes/month          |
| Vercel Hobby      | $0        | Hosts the website                |
| **Typical Total** | **$0/mo** | Free tier usually sufficient     |

## NOT Needed

- ❌ Webshare/Proxies - SerpApi handles this
- ❌ ScraperAPI ($49/mo) - SerpApi is cheaper and better
- ❌ Browserless ($40/mo) - overkill for our volume
- ❌ Stealth scraper - fails due to TLS fingerprinting

## Commands

> Note (npm v11+): to pass flags to an npm script, use `npm run <script> -- -- --flag ...` (extra `--`).

```bash
# SerpApi enrichment (recommended)
npm run enrich:serpapi

# SerpApi with custom limit
npm run enrich:serpapi -- -- --limit 20

# Overwrite existing enrichment fields (use carefully)
npm run enrich:serpapi -- -- --sku 1009258128 --force

# Test with single SKU
npm run enrich:serpapi -- -- --test

# Retry "not_found" SKUs whose retry window passed
npm run enrich:serpapi -- -- --retry

# Get SKUs that need enrichment
npx tsx scripts/get-unenriched-skus.ts --limit 50

# Bulk upload from CSV/JSON (after bookmarklet)
npm run enrich:bulk
```

## Reliability Expectations

With SerpApi:

- **95%+ success rate** for products that exist on HD
- Some items return "no results" (discontinued products)
- Fully automated via GitHub Actions
- No manual intervention needed

## Fallback: Bookmarklet Workflow

If SerpApi credits run out or for spot-checks:

1. Browse HD manually in your browser
2. Run bookmarklet to extract data
3. Export to JSON
4. Upload via `npm run enrich:bulk`

This is 100% reliable but requires your time.
