/**
 * Image Cache & Optimization Strategy
 *
 * Database: All image URLs stored as -64_600.jpg (canonical, high-quality source)
 *
 * Display-time downconversion:
 * - SKU pages (full-size): 600px (crisp, good for SEO)
 * - Related items cards: 400px (medium display, ~40-60 KB)
 * - Penny List thumbnails (72x72): 400px (reliable; some products lack -64_300 variants)
 *
 * This approach:
 * ✅ Single source of truth (600px in DB)
 * ✅ Optimizes bandwidth per use case
 * ✅ Maintains quality where users see it
 * ✅ Reduces waste on tiny displays
 */

/**
 * Placeholder image URL for when product image is unavailable
 */
export const PLACEHOLDER_IMAGE_URL = "/images/hd-product-placeholder.svg"

function isThdStaticImage(url: string): boolean {
  return /^https?:\/\/images\.thdstatic\.com\//i.test(url)
}

/**
 * Convert a Home Depot `images.thdstatic.com` image to a specific CDN variant.
 *
 * Database stores canonical -64_600.jpg; this converts to the size needed for rendering.
 *
 * Example:
 * `...-64_600.jpg` with target 300 -> `...-64_300.jpg`
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
 * Penny List thumbnails render very small, but some Home Depot products do not have a `-64_300`
 * variant, which can cause broken images on list cards while SKU detail pages render correctly.
 *
 * We prefer `-64_400` for reliability and let the UI downscale it visually.
 */
export function toPennyListThumbnailUrl(url: string): string {
  return toThdImageVariant(url, 400)
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
