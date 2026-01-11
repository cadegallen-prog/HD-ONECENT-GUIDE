export const OG_MAIN_PAGES = [
  "homepage",
  "penny-list",
  "report-find",
  "store-finder",
  "guide",
] as const

export type OgMainPageId = (typeof OG_MAIN_PAGES)[number]

export const OG_VARIANTS: Record<
  OgMainPageId,
  { headline: string; subline: string; motif: string; badgeSize: "normal" | "quieter" }
> = {
  homepage: {
    headline: "Live $0.01 Finds",
    subline: "Community-reported intel",
    motif: "data-dots",
    badgeSize: "normal",
  },
  "penny-list": {
    headline: "Live Penny List",
    subline: "$0.01 finds by state",
    motif: "list-rows",
    badgeSize: "normal",
  },
  "report-find": {
    headline: "Report a Find",
    subline: "Help verify sightings",
    motif: "plus-marker",
    badgeSize: "normal",
  },
  "store-finder": {
    headline: "Store Finder",
    subline: "Find stores near you",
    motif: "map-pin",
    badgeSize: "quieter",
  },
  guide: {
    headline: "Penny Shopping Guide",
    subline: "How it works",
    motif: "checklist",
    badgeSize: "quieter",
  },
}

export function ogImageUrl(page: OgMainPageId | string): string {
  return `/api/og?page=${page}`
}
