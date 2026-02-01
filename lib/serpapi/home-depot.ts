export const SERPAPI_BASE_URL = "https://serpapi.com/search.json"
export const DEFAULT_SERPAPI_DELIVERY_ZIP = "30303"

export function getSerpApiDeliveryZip(env: NodeJS.ProcessEnv = process.env): string {
  const candidate = String(env.SERPAPI_DELIVERY_ZIP || DEFAULT_SERPAPI_DELIVERY_ZIP).trim()
  return candidate || DEFAULT_SERPAPI_DELIVERY_ZIP
}

export class SerpApiCreditsExhaustedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SerpApiCreditsExhaustedError"
  }
}

function looksLikeCreditsError(message: string): boolean {
  const msg = message.toLowerCase()
  return (
    msg.includes("exceeded") ||
    msg.includes("quota") ||
    msg.includes("credit") ||
    msg.includes("limit") ||
    msg.includes("payment") ||
    msg.includes("plan")
  )
}

export type SerpApiHomeDepotProductSearchItem = {
  title?: string
  brand?: string
  model_number?: string
  product_id?: string
  link?: string
  thumbnails?: string[][]
  price?: number | string | null
}

export type SerpApiHomeDepotSearchResponse = {
  error?: string
  products?: SerpApiHomeDepotProductSearchItem[]
}

export async function searchHomeDepotWithSerpApi(args: {
  apiKey: string
  query: string
  deliveryZip?: string
}): Promise<SerpApiHomeDepotProductSearchItem[] | undefined> {
  const deliveryZip = (args.deliveryZip || getSerpApiDeliveryZip()).trim()
  const params = new URLSearchParams({
    engine: "home_depot",
    q: args.query,
    delivery_zip: deliveryZip,
    api_key: args.apiKey,
  })

  const response = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`)
  const data = (await response.json()) as SerpApiHomeDepotSearchResponse

  if (data.error) {
    if (looksLikeCreditsError(data.error)) throw new SerpApiCreditsExhaustedError(data.error)
    return undefined
  }

  return data.products
}

export type SerpApiHomeDepotProductResponse = {
  error?: string
  product_results?: unknown
}

export async function fetchHomeDepotProductWithSerpApi(args: {
  apiKey: string
  productId: string
  deliveryZip?: string
}): Promise<unknown | null> {
  const productId = String(args.productId).trim()
  if (!productId) return null

  const deliveryZip = (args.deliveryZip || getSerpApiDeliveryZip()).trim()
  const params = new URLSearchParams({
    engine: "home_depot_product",
    product_id: productId,
    delivery_zip: deliveryZip,
    api_key: args.apiKey,
  })

  const response = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`)
  const data = (await response.json()) as SerpApiHomeDepotProductResponse

  if (data.error) {
    if (looksLikeCreditsError(data.error)) throw new SerpApiCreditsExhaustedError(data.error)
    return null
  }

  return data.product_results ?? null
}

export function normalizeUpcCandidate(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const digits = String(value).replace(/\D/g, "")
  if (digits.length === 12 || digits.length === 13 || digits.length === 14) return digits
  return null
}

function extractUpcFromStructuredData(data: unknown): string | null {
  if (!data) return null

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = extractUpcFromStructuredData(item)
      if (found) return found
    }
    return null
  }

  if (typeof data !== "object") return null

  const record = data as Record<string, unknown>
  const direct = normalizeUpcCandidate(
    record.upc ??
      record.UPC ??
      record.gtin12 ??
      record.gtin13 ??
      record.gtin14 ??
      record.gtin ??
      record.GTIN ??
      record.barcode
  )
  if (direct) return direct

  for (const [key, value] of Object.entries(record)) {
    // Prefer descending into likely fields first (often "specifications" or "attributes")
    if (typeof key === "string" && /(upc|gtin|barcode)/i.test(key)) {
      const candidate = extractUpcFromStructuredData(value)
      if (candidate) return candidate
    }
  }

  for (const value of Object.values(record)) {
    const found = extractUpcFromStructuredData(value)
    if (found) return found
  }

  return null
}

export function extractUpcFromHomeDepotProductResult(productResults: unknown): string | null {
  if (!productResults) return null
  return extractUpcFromStructuredData(productResults)
}

export async function fetchUpcFromHomeDepotProductWithSerpApi(args: {
  apiKey: string
  productId: string
  deliveryZip?: string
}): Promise<string | null> {
  const productResults = await fetchHomeDepotProductWithSerpApi(args)
  return extractUpcFromHomeDepotProductResult(productResults)
}
