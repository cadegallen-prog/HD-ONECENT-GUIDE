/**
 * Image Cache - Simplified
 *
 * Returns placeholder for items without images.
 * Real images come from user-submitted photos in the Penny List.
 */

/**
 * Placeholder image URL for when product image is unavailable
 */
export const PLACEHOLDER_IMAGE_URL = "/images/hd-product-placeholder.svg"

function isThdStaticImage(url: string): boolean {
  return /^https?:\/\/images\.thdstatic\.com\//i.test(url)
}

/**
 * Convert a Home Depot `images.thdstatic.com` image to a smaller CDN variant when possible.
 *
 * Example:
 * `...-64_1000.jpg` -> `...-64_300.jpg`
 */
export function toThdImageVariant(url: string, target: 300 | 400 | 600 | 1000): string {
  if (!url) return url
  const trimmed = url.trim()
  if (!isThdStaticImage(trimmed)) return trimmed

  const match = trimmed.match(/-64_(\d+)\.(jpe?g|png)$/i)
  if (!match) return trimmed

  const ext = match[2]
  return trimmed.replace(/-64_\d+\.(jpe?g|png)$/i, `-64_${target}.${ext}`)
}

/**
 * Get product image - returns placeholder
 * Real images come from user-submitted photos in the Penny List.
 */
export function getProductImage(): string {
  return PLACEHOLDER_IMAGE_URL
}

/**
 * Batch get images - returns placeholders
 * Real images come from user-submitted photos in the Penny List.
 */
export function getProductImageBatch(skus: string[]): Map<string, string> {
  const results = new Map<string, string>()
  skus.forEach((sku) => {
    results.set(sku, PLACEHOLDER_IMAGE_URL)
  })
  return results
}
