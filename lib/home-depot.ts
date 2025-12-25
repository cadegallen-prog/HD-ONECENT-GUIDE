export function normalizeHomeDepotId(value: string | number | null | undefined): string | null {
  const trimmed = String(value ?? "").trim()
  if (!trimmed) return null

  // Keep digits only; scraped sources sometimes include whitespace or other formatting.
  const digitsOnly = trimmed.replace(/\D/g, "")
  if (!digitsOnly || digitsOnly === "0") return null

  return digitsOnly
}

export function getHomeDepotProductUrl(args: {
  sku?: string | null
  internetNumber?: string | number | null
  productId?: string | number | null
  homeDepotUrl?: string | null
}): string {
  const manualUrl = String(args.homeDepotUrl ?? "").trim()
  if (manualUrl) return manualUrl

  const id = normalizeHomeDepotId(args.internetNumber ?? args.productId)
  if (id) return `https://www.homedepot.com/p/${id}`

  const sku = String(args.sku ?? "").trim()
  if (sku) return `https://www.homedepot.com/s/${encodeURIComponent(sku)}`

  return "https://www.homedepot.com/"
}
