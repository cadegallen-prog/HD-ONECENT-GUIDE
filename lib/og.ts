// Dynamic OG images via API route
const OG_HEADLINES: Record<string, string> = {
  homepage: "Penny Central",
  "penny-list": "Home Depot Penny List",
  "report-find": "Report a Penny Find",
  "store-finder": "Store Finder",
  guide: "Complete Guide",
}

export function ogImageUrl(page: keyof typeof OG_HEADLINES | string): string {
  const headline = OG_HEADLINES[page] || OG_HEADLINES.homepage
  return `/api/og?headline=${encodeURIComponent(headline)}`
}
