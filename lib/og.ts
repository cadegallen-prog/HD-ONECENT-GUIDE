// Static OG images - no dynamic generation, maximum reliability
const OG_IMAGES: Record<string, string> = {
  homepage: "/og/og-homepage.png",
  "penny-list": "/og/og-penny-list.png",
  "report-find": "/og/og-report-find.png",
  "store-finder": "/og/og-store-finder.png",
  guide: "/og/og-guide.png",
}

export function ogImageUrl(page: keyof typeof OG_IMAGES | string): string {
  return OG_IMAGES[page] || OG_IMAGES.homepage
}
