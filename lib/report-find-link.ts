/**
 * Builds a deep-link URL to /report-find with prefilled SKU and item name.
 *
 * @param opts.sku - Regular SKU (6 or 10 digits, NOT internet SKU)
 * @param opts.name - Item name (truncated to 75 chars to match form validation)
 * @param opts.src - Source identifier for analytics (e.g., "card", "table")
 * @returns URL path with query string, or "/report-find" if no params
 *
 * @example
 * buildReportFindUrl({ sku: "1234567890", name: "Drill", src: "card" })
 * // => "/report-find?sku=1234567890&name=Drill&src=card"
 */
export function buildReportFindUrl(opts: {
  sku?: string | null
  name?: string | null
  src?: string
}): string {
  const params = new URLSearchParams()

  // Truncate and sanitize inputs to match form validation
  const sku = (opts.sku ?? "").trim().slice(0, 32)
  const name = (opts.name ?? "").trim().slice(0, 75) // Match form maxLength
  const src = (opts.src ?? "").trim().slice(0, 64)

  if (sku) params.set("sku", sku)
  if (name) params.set("name", name)
  if (src) params.set("src", src)

  const qs = params.toString()
  return qs ? `/report-find?${qs}` : "/report-find"
}
