const OG_IMAGE_VERSION = "7"

export function ogImageUrl(headline: string) {
  return `/api/og?headline=${encodeURIComponent(headline)}&v=${OG_IMAGE_VERSION}`
}
