# AdSense & Monetization Status

**Last Updated:** 2026-02-02

---

## Current Status: SEO Fix Deployed, Awaiting Re-Review

### What Happened (Feb 2, 2026)

Google AdSense rejected the site for **"Low Value Content"** despite:

- 17k users, 70k pageviews in 30 days
- 70-second average session duration
- 40% bounce rate
- 100% USA traffic
- Complete privacy policy, contact page, about page

### Root Cause: Thin Content Signal

**The Problem:**
The sitemap was submitting 900+ URLs to Google:

- 12 pillar pages (homepage, guide, penny-list, etc.)
- 50 state filter pages (`/pennies/[state]`)
- 800+ individual SKU pages (`/sku/[sku]`)

Google Search Console showed:

- **107 pages indexed**
- **787 pages "Discovered - currently not indexed"** (N/A for last crawl)

This 7:1 ratio of "ignored pages" to "indexed pages" signals to Google (and AdSense) that the site is dominated by thin, programmatic content that isn't worth crawling.

**Why This Triggered Rejection:**

- AdSense uses the same quality signals as Google Search
- A site pushing 900 URLs where Google won't even crawl 787 of them = "low value"
- The SKU pages have minimal text (just SKU, image, location counts)
- The state pages are just filtered views with identical templates

---

## The Fix: Pillar-Only Indexing Strategy

**Deployed:** Feb 2, 2026 (commit `6c13d5a`)

### Changes Made

**1. Pruned `app/sitemap.ts`**

- Removed Supabase query that generated 800+ SKU URLs
- Removed 50 state page URLs
- Now returns only 12 static pillar pages:
  - `/` (homepage)
  - `/penny-list`
  - `/guide`
  - `/store-finder`
  - `/clearance-lifecycle`
  - `/report-find`
  - `/trip-tracker`
  - `/cashback`
  - `/about`
  - `/contact`
  - `/support`
  - `/privacy-policy`

**2. Added `noindex` to SKU pages (`app/sku/[sku]/page.tsx`)**

```typescript
robots: {
  index: false,
  follow: true,
}
```

**3. Added `noindex` to state pages (`app/pennies/[state]/page.tsx`)**

```typescript
robots: {
  index: false,
  follow: true,
}
```

### Why This Works

| Before                     | After                           |
| -------------------------- | ------------------------------- |
| 900+ URLs in sitemap       | 12 URLs in sitemap              |
| 7:1 bad:good ratio         | 0:12 bad:good ratio             |
| Google ignoring 787 URLs   | Google sees only quality pages  |
| "Low value content" signal | "Curated editorial site" signal |

**User experience is unchanged.** All SKU and state pages still work - they're just not pushed to Google for indexing. Since traffic is 100% social/direct (not organic), there's zero traffic impact.

---

## Verification (Feb 2, 2026)

### Production Sitemap

```
curl https://www.pennycentral.com/sitemap.xml | grep -c "<url>"
# Result: 12
```

### Noindex Meta Tag on SKU Page

```html
<meta name="robots" content="noindex, follow" />
```

Verified on: `https://www.pennycentral.com/sku/1009258128`

### Noindex Meta Tag on State Page

```html
<meta name="robots" content="noindex, follow" />
```

Verified on: `https://www.pennycentral.com/pennies/california`

### Google Search Console

- Sitemap resubmitted: Feb 2, 2026
- Status: Success
- Discovered pages: 12

---

## Next Steps

### 1. Wait for Google to Process (48-72 hours)

Google needs time to:

- Re-crawl the sitemap (done - shows 12 pages)
- Re-crawl SKU/state pages and see noindex tags
- Update its internal quality signals

### 2. Monitor GSC (Daily for 2 weeks)

Watch the "Pages" section:

- "Discovered - currently not indexed" should eventually stop growing
- "Excluded by noindex" may appear (this is good - it means Google saw the tags)
- The ratio matters more than absolute numbers

### 3. Reapply to AdSense (After ~72 hours)

- Go to AdSense dashboard
- Resubmit site for review
- Reviewer will now see a clean 12-page site

### 4. Monumetric Status

- Monumetric does NOT require AdSense approval
- They already invited you to MCM program
- They're waiting on their advertiser review (not related to this)
- Do NOT proactively tell them about the AdSense rejection unless they ask

---

## Lessons Learned

1. **Sitemap size matters for AdSense.** Don't push hundreds of thin pages to Google just because they exist.

2. **"Discovered - currently not indexed" is a red flag.** If Google won't even crawl your pages, that's a strong signal of low value.

3. **Noindex is not a penalty.** It's a tool to tell Google "this page is for users, not for search." Use it strategically.

4. **Traffic source matters.** If your traffic is social/direct, de-indexing thin pages has zero downside.

5. **Fix before reapplying.** Don't just reapply and hope - identify and fix the root cause first.

---

## File Reference

| File                           | Change                                         |
| ------------------------------ | ---------------------------------------------- |
| `app/sitemap.ts`               | Pruned to 12 static pillar pages               |
| `app/sku/[sku]/page.tsx`       | Added `robots: { index: false, follow: true }` |
| `app/pennies/[state]/page.tsx` | Added `robots: { index: false, follow: true }` |

---

## Timeline

| Date        | Event                                    |
| ----------- | ---------------------------------------- |
| 2025-12-04  | Site launched                            |
| 2026-01-19  | Applied for AdSense                      |
| 2026-01-24  | PIN verification completed               |
| 2026-02-02  | AdSense rejection ("Low Value Content")  |
| 2026-02-02  | SEO fix deployed (pillar-only sitemap)   |
| 2026-02-02  | GSC sitemap resubmitted (shows 12 pages) |
| 2026-02-05+ | Reapply to AdSense (target)              |
