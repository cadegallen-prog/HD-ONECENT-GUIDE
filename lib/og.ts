const OG_IMAGE_VERSION = "5"

export function ogImageUrl(headline: string) {
  return `/api/og?headline=${encodeURIComponent(headline)}&v=${OG_IMAGE_VERSION}`
}
