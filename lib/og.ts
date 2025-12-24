export const OG_MAIN_PAGES = [
  "homepage",
  "penny-list",
  "report-find",
  "store-finder",
  "guide",
] as const

export type OgMainPageId = (typeof OG_MAIN_PAGES)[number]

export const OG_VARIANTS: Record<OgMainPageId, { headline: string; subhead: string }> = {
  homepage: {
    headline: "Find Home Depot Penny Items",
    subhead: "The community-reported $0.01 list, updated hourly.",
  },
  "penny-list": {
    headline: "Home Depot Penny List",
    subhead: "Filter by state, date, and SKU. Updated hourly.",
  },
  "report-find": {
    headline: "Report a Penny Find",
    subhead: "Submit your $0.01 item to update the list. Takes under a minute.",
  },
  "store-finder": {
    headline: "Home Depot Store Finder",
    subhead: "Find stores by state and zip. Check nearby locations fast.",
  },
  guide: {
    headline: "Home Depot Penny Guide",
    subhead: "Learn the markdown cadence and how $0.01 items happen.",
  },
}

const OG_IMAGE_VERSION = "11"

export function ogImageUrl(page: OgMainPageId | string): string {
  if (OG_MAIN_PAGES.includes(page as OgMainPageId)) return `/og/${page}.jpg`

  const headline = (page || "").trim() || OG_VARIANTS.homepage.headline
  return `/api/og?headline=${encodeURIComponent(headline)}&v=${OG_IMAGE_VERSION}`
}
