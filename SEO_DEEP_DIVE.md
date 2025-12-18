# SEO Deep Dive & Indexing Fixes

## Overview
This document outlines the critical SEO improvements and indexing fixes implemented to resolve the "3/17 pages indexed" issue and optimize the site for search engines.

## 1. Domain Standardization (Canonicalization)
- **Issue**: Google was seeing both `pennycentral.com` and `www.pennycentral.com` as separate entities, leading to "Page with redirect" errors and split authority.
- **Fix**: Standardized all internal links, metadata, and sitemap URLs to use the `www` prefix.
- **Result**: Clear canonical signal to Google that `https://www.pennycentral.com` is the primary domain.

## 2. Sitemap Cleanup
- **Issue**: The sitemap contained "ghost pages" (redirects) like `/faq` and `/sku`, which Google flagged as "Redirect errors."
- **Fix**: Removed all redirecting paths from `app/sitemap.ts`. The sitemap now only contains the 10 high-value, indexable pages.
- **Result**: Googlebot no longer wastes crawl budget on redirecting URLs.

## 3. Server-Side Redirects
- **Issue**: Users and old links were hitting shortcut paths that didn't exist as standalone pages.
- **Fix**: Implemented 301 Permanent Redirects in `next.config.js` for:
  - `/faq` -> `/guide#faq`
  - `/sku` -> `/sku-lookup`
  - `/how-to` -> `/guide#how-to-find-pennies`
  - `/rules` -> `/responsible-hunting`
- **Result**: Preserves link equity and guides users to the correct content.

## 4. Rich Snippets (JSON-LD)
Implemented structured data to help Google understand the content and display enhanced search results:
- **HowTo Schema**: Added to the Guide page to show step-by-step instructions in search results.
- **FAQPage Schema**: Added to the Guide page (with visible FAQ section) to trigger dropdowns in SERPs.
- **BreadcrumbList Schema**: Added to all major pages (`/guide`, `/penny-list`, `/verified-pennies`) to show the site hierarchy in search results.

## 5. Meta Optimization
- **Titles**: Updated to include high-intent keywords (e.g., "Home Depot Penny List", "SKU Lookup").
- **Descriptions**: Rewritten to be more compelling and include primary keywords.
- **Noindex**: Added `noindex` to defunct or internal-only pages (e.g., `trip-tracker`) to prevent them from appearing in search results.

## 6. Internal Linking
- Added a "Ready to hunt?" CTA at the bottom of the Guide to link to the Penny List.
- Added a "New to penny hunting?" link on the Penny List and Verified Pennies pages to guide users back to the educational content.
- **Result**: Creates a "loop" that keeps users on the site and helps Google discover related content.

## 7. Massive SKU Expansion (Product Directory)
- **Strategy**: Transformed the `/sku/[sku]` route from a simple lookup stub into a full-fledged product detail page for every item in our database.
- **Scale**: Generated **533 individual static pages** (SSG) during build, one for each verified and community penny item.
- **Structured Data**: Implemented `Product` JSON-LD on every SKU page to enable rich snippets (price, availability, images) in Google Search.
- **Internal Linking**: Refactored `VerifiedPennyCard` and `PennyListCard` to link internally to these new SKU pages instead of sending users directly to Home Depot. This keeps users on our domain and passes link equity to our own long-tail pages.
- **Result**: Significantly increases the site's "surface area" for long-tail search queries (e.g., "Home Depot Penny Item 100613231").

## Verification
- [x] `npm run lint` (0 errors)
- [x] `npm run build` (Successful)
- [x] `npm run test:e2e` (40/40 passing)
- [x] Manual verification of JSON-LD via Schema Markup Validator.
