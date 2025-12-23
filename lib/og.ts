// Static OG images for main pages, dynamic for others (e.g., SKU pages)
const STATIC_OG_PAGES = ["homepage", "penny-list", "report-find", "store-finder", "guide"] as const

const OG_HEADLINES: Record<string, string> = {
  homepage: "Find Home Depot Penny Items",
  "penny-list": "Home Depot Penny List",
  "report-find": "Report a Home Depot Penny Find",
  "store-finder": "Find Nearby Home Depot Stores",
  guide: "How to Find Home Depot Penny Items",
}

const OG_IMAGE_VERSION = "9"

export function ogImageUrl(page: keyof typeof OG_HEADLINES | string): string {
  // Use static images for main pages
  if (STATIC_OG_PAGES.includes(page as (typeof STATIC_OG_PAGES)[number])) {
    return `/og/${page}.png`
  }

  // Fall back to dynamic generation for other pages (e.g., SKU detail pages)
  const headline = OG_HEADLINES[page] || OG_HEADLINES.homepage
  return `/api/og?headline=${encodeURIComponent(headline)}&v=${OG_IMAGE_VERSION}`
}
