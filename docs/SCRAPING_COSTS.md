# Home Depot Scraping: Costs & Options

## Why Scraping HD is Hard

Home Depot uses aggressive bot detection:
- Akamai Bot Manager
- Browser fingerprinting
- Webdriver detection
- IP reputation scoring

## Cost Options (Pick ONE)

### Option 1: Free (Manual)
- Run `npm run enrich:stealth` locally in headed mode
- You watch it run, intervene if needed
- Works for 10-20 items before detection
- **Cost: $0**

### Option 2: Cheap Proxies (~$5-10/mo) ✅ RECOMMENDED
- Residential proxy service rotates your IP
- Combined with stealth mode, avoids most detection
- Runs autonomously via GitHub Actions
- **Recommended: [Webshare](https://www.webshare.io/) - $5.49/mo for 10 residential IPs**

### Option 3: Paid APIs ($49-75/mo)
- ScraperAPI, SerpAPI, BigBox API
- They handle everything (proxies + rendering + anti-detection)
- Most reliable, but expensive
- **NOT RECOMMENDED** unless you're scraping 1000+ items/month

## Current Setup: Option 2

### How It Works

```
GitHub Actions (free)
    ↓ runs every 6 hours
Stealth Scraper + Webshare Proxy ($5.49/mo)
    ↓ scrapes ~20 SKUs per run
penny_item_enrichment table (Supabase)
    ↓ merges with user submissions
Polished Penny Cards (no placeholders!)
```

### Required Setup

1. **Sign up for Webshare** (~2 minutes)
   - Go to https://www.webshare.io/
   - Create account
   - Buy "Residential" plan ($5.49/mo)
   - Copy your proxy URL

2. **Add GitHub Secrets** (Settings → Secrets → Actions)
   ```
   NEXT_PUBLIC_SUPABASE_URL     = your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY    = your-service-key
   WEBSHARE_PROXY               = http://user:pass@proxy.webshare.io:port
   ```

3. **Enable GitHub Actions**
   - The workflow at `.github/workflows/auto-enrich.yml` runs automatically
   - Or trigger manually: Actions → Auto Enrich → Run workflow

### Monthly Cost Breakdown

| Service | Cost | What It Does |
|---------|------|--------------|
| Webshare Residential | $5.49/mo | IP rotation to avoid blocks |
| GitHub Actions | $0 | 2000 free minutes/month |
| Vercel Hobby | $0 | Hosts the website |
| **Total** | **$5.49/mo** | |

## NOT Needed

- ❌ ScraperAPI ($49/mo) - we have our own proxies
- ❌ SerpAPI ($75/mo) - we have our own proxies
- ❌ Browserless ($40/mo) - overkill for our volume
- ❌ Vercel Cron auto-enrich - can't run Playwright on Vercel

## Commands

```bash
# Local scraping (headed, watch it run)
npm run enrich:stealth

# Local scraping (headless, run in background)
npm run enrich:stealth -- --headless

# Get SKUs that need enrichment
npx tsx scripts/get-unenriched-skus.ts --limit 50

# Bulk upload from CSV/JSON (after bookmarklet)
npm run enrich:bulk
```

## Reliability Expectations

With Webshare + stealth:
- ~80% success rate per SKU
- ~50-100 items/day capacity
- Automatic retry on failure
- May need occasional manual intervention

## Fallback: Bookmarklet Workflow

If automated scraping fails completely:
1. Browse HD manually in your browser
2. Run bookmarklet to extract data
3. Export to CSV
4. Upload via `npm run enrich:bulk`

This is 100% reliable but requires your time.
