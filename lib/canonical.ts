/**
 * Canonical URL Utilities
 *
 * Provides helpers for generating self-referencing canonical URLs
 * for all pages on PennyCentral.com
 */

export const CANONICAL_BASE = "https://www.pennycentral.com"

/**
 * Generate a canonical URL for the current page
 *
 * @param pathname - The current pathname (e.g., '/penny-list' or '/sku/12345')
 * @param searchParams - Optional search parameters to include in the canonical URL
 * @returns The full canonical URL (e.g., 'https://www.pennycentral.com/penny-list')
 */
export function getCanonicalUrl(pathname: string, searchParams?: Record<string, string>): string {
  // Normalize pathname to start with /
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`

  // Build the canonical URL
  let url = `${CANONICAL_BASE}${normalizedPath}`

  // Add search params if provided
  if (searchParams && Object.keys(searchParams).length > 0) {
    const params = new URLSearchParams(searchParams)
    url += `?${params.toString()}`
  }

  return url
}

/**
 * Generate a canonical link element as a string
 *
 * @param pathname - The current pathname
 * @param searchParams - Optional search parameters
 * @returns An HTML link element string
 */
export function getCanonicalLinkElement(
  pathname: string,
  searchParams?: Record<string, string>
): string {
  const href = getCanonicalUrl(pathname, searchParams)
  return `<link rel="canonical" href="${href}" />`
}
