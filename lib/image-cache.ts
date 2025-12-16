/**
 * Image Cache - Simplified
 *
 * Returns placeholder for items without images.
 * Verified items get their images from verified-pennies.json
 */

/**
 * Placeholder image URL for when product image is unavailable
 */
export const PLACEHOLDER_IMAGE_URL = "/images/hd-product-placeholder.svg"

/**
 * Get product image - returns placeholder
 * Real images come from verified-pennies.json data
 */
export function getProductImage(): string {
  return PLACEHOLDER_IMAGE_URL
}

/**
 * Batch get images - returns placeholders
 * Real images come from verified-pennies.json data
 */
export function getProductImageBatch(skus: string[]): Map<string, string> {
  const results = new Map<string, string>()
  skus.forEach((sku) => {
    results.set(sku, PLACEHOLDER_IMAGE_URL)
  })
  return results
}
