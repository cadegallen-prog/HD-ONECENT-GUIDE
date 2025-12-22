// Dynamic OG images via API route
const OG_HEADLINES: Record<string, string> = {
  homepage: "Home Depot Penny List & Guide",
  "penny-list": "Home Depot Penny List",
  "report-find": "Report a Home Depot Penny Find",
  "store-finder": "Find Nearby Home Depot Stores",
  guide: "How to Find Home Depot Penny Items",
}

const OG_IMAGE_VERSION = "7"

export function ogImageUrl(page: keyof typeof OG_HEADLINES | string): string {
  const headline = OG_HEADLINES[page] || OG_HEADLINES.homepage
  return `/api/og?headline=${encodeURIComponent(headline)}&v=${OG_IMAGE_VERSION}`
}
