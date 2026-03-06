# Web Scraper Costs & Fallbacks

## Canonical Enrichment Order

1. `Main List` self-absorption
2. `Item Cache` apply (`enrichment_staging`)
3. `Web Scraper` (SerpAPI) fallback only when gaps remain
4. `Manual Add` via `/manual` JSON

The Web Scraper is intentionally the last automated resort to protect monthly credits.

## Why Scraping HD is Hard

Home Depot uses aggressive bot detection:

- Akamai Bot Manager
- TLS/JA3 fingerprinting (this is why stealth plugins fail!)
- Webdriver detection
- IP reputation scoring

## Cost Options (Pick ONE)

### Option 1: Web Scraper (SerpAPI) Free/Cheap Tier ✅ RECOMMENDED

- Uses SerpApi's Home Depot Search API
- They handle everything (TLS fingerprinting, CAPTCHAs, proxies)
- **Free tier: 250 searches/month** (covers typical usage)
- **$25/mo tier: 1,000 searches/month** (if you need more)
- Runs autonomously via GitHub Actions
- **95%+ success rate**

### Option 2: Manual Add (Free)

- Run bookmarklet while browsing HD manually
- Paste JSON to `/manual` in chat (agent runs `npm run manual:enrich`)
- 100% reliable but requires your time
- **Cost: $0**

### Option 3: Stealth Scraper (Unreliable)

- Playwright + stealth + proxies
- **Often fails** due to TLS fingerprinting
- May work for small batches locally
- **Not recommended for production**

## Current Setup: Option 1 (Web Scraper)

### How It Works

```
GitHub Actions (free, runs every 2 hours)
    ↓
Web Scraper: SerpApi Home Depot Search API ($0-25/mo)
    ↓ fetches product data for a small batch of recent Penny List items
"Penny List" table (Supabase)
    ↓ fills missing enrichment fields (name/brand/model/image/link/internet_sku/retail_price)
Polished Penny Cards (fewer placeholders)
```

Budget note: each SKU typically spends **1 search** (SKU query), may spend a **2nd search** (fallback by item name), and can spend **+1** for UPC fetch when needed. The script now enforces a hard budget policy every run:

- **Monthly cap:** `250` credits
- **Monthly reserve:** `10` credits (kept unused intentionally)
- **Usable monthly budget:** `240` credits
- **Daily cap (normal):** dynamic, clamped to `4`-`12` credits/day
- **Per-run cap (normal):** `6` credits/run
- **Cadence:** every `2` hours for freshness
- **Stale escalation:** unresolved rows older than `120` minutes are prioritized

Controlled backfill near billing reset (to avoid leaving large unused credit balance):

- activates only when **all** conditions are true:
  - at least `45` credits remain,
  - time until next billing reset is within `SERPAPI_BACKFILL_WINDOW_MINUTES_BEFORE_RESET` (default `360` minutes),
  - time until next billing reset is still greater than pre-reset guard,
  - not inside post-reset guard window.
- when active:
  - daily cap can rise to `28` credits,
  - per-run cap can rise to `14` credits.

Reset rollover safety (prevents accidental spend across billing-cycle reset boundaries):

- **Pre-reset guard:** no runs in the final `60` minutes before billing reset.
- **Post-reset guard:** no runs in the first `60` minutes after billing reset.

Reset timing is anchored to the account billing-cycle renewal timestamp (`SERPAPI_BILLING_RESET_ANCHOR_ISO`, default `2026-03-18T00:00:00.000Z`) and recurs monthly from that anchor.

This is intentionally conservative: it improves freshness while reducing the chance of reckless credit burn.

This pipeline writes enrichment fields (name/brand/model/image/link/internet_sku/retail_price) into `"Penny List"` **fill-blanks-only by default** (no overwrites unless you use `--force`).

**Important:** SerpApi Home Depot results are **location-sensitive**. The script sets `delivery_zip` for more consistent pricing/availability. You can override via:

```
SERPAPI_DELIVERY_ZIP=30303
```

UPC/barcode: SerpApi does not reliably return UPC. When the runner has a usable product ID, it may spend **1 additional SerpApi product lookup** to try to recover UPC data. That lookup is optional and still can fail for some products.

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
   - Optional budget tuning for the scheduled workflow lives in GitHub **Actions Variables** (same names as the env knobs below)

### Monthly Cost Breakdown

| Service           | Cost      | What It Does                     |
| ----------------- | --------- | -------------------------------- |
| SerpApi Free Tier | $0        | 250 searches/month               |
| SerpApi Starter   | $25/mo    | 1,000 searches/month (if needed) |
| GitHub Actions    | $0        | 2000 free minutes/month          |
| Vercel Hobby      | $0        | Hosts the website                |
| **Typical Total** | **$0/mo** | Free tier usually sufficient     |

### Budget-Control Environment Knobs

You can tune policy behavior without code edits:

- `SERPAPI_MONTHLY_CAP` (default `250`)
- `SERPAPI_MONTHLY_RESERVE` (default `10`)
- `SERPAPI_MIN_DAILY_CREDITS` / `SERPAPI_MAX_DAILY_CREDITS` (defaults `4` / `12`)
- `SERPAPI_MAX_CREDITS_PER_RUN` (default `6`)
- `SERPAPI_BILLING_RESET_ANCHOR_ISO` (default `2026-03-18T00:00:00.000Z`)
- `SERPAPI_BACKFILL_WINDOW_MINUTES_BEFORE_RESET` (default `360`)
- `SERPAPI_LATE_MONTH_HIGH_REMAINING_CREDITS` (default `45`)
- `SERPAPI_LATE_MONTH_BACKFILL_DAILY_CAP` (default `28`)
- `SERPAPI_LATE_MONTH_BACKFILL_MAX_RUN_CREDITS` (default `14`)
- `SERPAPI_PRE_RESET_GUARD_MINUTES` / `SERPAPI_POST_RESET_GUARD_MINUTES` (defaults `60` / `60`)
- `SERPAPI_STALE_ESCALATION_MINUTES` (default `120`)

For GitHub Actions scheduled runs, set those as repository **Actions Variables**. For local/manual runs, put them in `.env.local`.

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

# Backfill Main List from Item Cache without Web Scraper credits
npm run backfill:item-cache

# Manual Add JSON -> Item Cache + Main List upsert
npm run manual:enrich

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

**Bookmarklet source of truth:** `tools/bookmarklets/bookmarklet.txt` (inline; works even when Home Depot blocks external script injection)

**Export bookmarklet:** `tools/bookmarklets/export-saved-json.txt`

If `price` is ever exported as an empty string even though you see a price on screen, it’s usually a PDP variant / hydration timing / JSON-LD shape difference. The current bookmarklet includes:

- JSON-LD parsing that supports `@graph` layouts
- Meta-tag + DOM fallbacks for price
- A short retry loop to wait for the price to hydrate

If Home Depot blocks loading external scripts, an inline bookmarklet is required. That’s why the bookmarklet is not a “script loader”. 3. Export to JSON 4. Upload via `npm run enrich:bulk`

This is 100% reliable but requires your time.
