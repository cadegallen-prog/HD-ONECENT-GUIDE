import {
  fetchUpcFromHomeDepotProductWithSerpApi,
  getSerpApiDeliveryZip,
  searchHomeDepotWithSerpApi,
  SerpApiHomeDepotProductSearchItem,
} from "../serpapi/home-depot"

export type SerpApiHomeDepotEnrichment = {
  sku: string
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: number | null
  searchTerm: string
  productId: string | null
}

function hasNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

// Clean item name for search (remove model numbers, filler words, measurements, etc.)
function cleanItemName(name: string): string {
  return name
    .replace(/\b[A-Z0-9]{5,}\b/gi, "")
    .replace(/\b(the|a|an|with|for|and|or)\b/gi, "")
    .replace(/\b\d+(\.\d+)?\s*(in|ft|mm|cm|oz|lb|gal|qt|pk|ct)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 60)
    .trim()
}

function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  const hostname = parsed.hostname.toLowerCase()
  const isHomeDepotHost =
    hostname === "homedepot.com" ||
    hostname.endsWith(".homedepot.com") ||
    hostname === "thdstatic.com" ||
    hostname.endsWith(".thdstatic.com")
  if (isHomeDepotHost) {
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
  }
  return url
}

function pickSerpApiThumbnail(product: SerpApiHomeDepotProductSearchItem): string | null {
  if (!product.thumbnails || !product.thumbnails[0]) return null
  const thumbArray = product.thumbnails[0]
  const candidate = thumbArray[4] || thumbArray[thumbArray.length - 1] || thumbArray[0]
  return candidate || null
}

function parseRetailPrice(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const candidate =
    typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""))
  if (!Number.isFinite(candidate)) return null
  if (candidate <= 0) return null
  return candidate
}

function normalizeHomeDepotUrl(url: string | null | undefined): string | null {
  const trimmed = String(url ?? "").trim()
  if (!trimmed) return null
  if (trimmed.includes("apionline.homedepot.com")) {
    return trimmed.replace("apionline.homedepot.com", "www.homedepot.com")
  }
  return trimmed
}

function toInternetSku(productId: string | null | undefined): number | null {
  const parsed = Number.parseInt(String(productId ?? "").trim(), 10)
  if (!Number.isFinite(parsed)) return null
  return parsed
}

function isLikelyMatch(resultTitle: string | null | undefined, originalTitle: string): boolean {
  if (!hasNonEmptyText(resultTitle)) return false
  const resultLower = resultTitle.toLowerCase()
  const originalLower = originalTitle.toLowerCase()

  // if exact substring match, accept
  if (resultLower.includes(originalLower.substring(0, Math.min(originalLower.length, 20)))) {
    return true
  }

  // keyword overlap check (avoid stop words)
  const stopWords = new Set([
    "with",
    "for",
    "and",
    "the",
    "a",
    "an",
    "of",
    "to",
    "in",
    "on",
    "by",
    "at",
    "from",
  ])

  const getKeywords = (s: string): string[] => {
    const words = s
      .split(/[\s,.\-\/]+/)
      .map((w) => w.replace(/[^a-z]/gi, "").toLowerCase())
      .filter((w) => w.length >= 4 && !stopWords.has(w))
    return [...new Set(words)].slice(0, 6)
  }

  const originalKeywords = getKeywords(originalLower)
  if (originalKeywords.length < 2) return false

  let matches = 0
  for (const kw of originalKeywords) {
    if (resultLower.includes(kw)) matches++
  }

  const matchRatio = matches / originalKeywords.length
  return matchRatio >= 0.5
}

function extractFromSearchItem(
  originalSku: string,
  product: SerpApiHomeDepotProductSearchItem,
  searchTerm: string
): SerpApiHomeDepotEnrichment {
  const imageUrl = optimizeImageUrl(pickSerpApiThumbnail(product))
  const productId = hasNonEmptyText(product.product_id) ? product.product_id : null

  return {
    sku: originalSku,
    item_name: hasNonEmptyText(product.title) ? product.title : null,
    brand: hasNonEmptyText(product.brand) ? product.brand : null,
    model_number: hasNonEmptyText(product.model_number) ? product.model_number : null,
    image_url: imageUrl,
    home_depot_url: normalizeHomeDepotUrl(product.link),
    internet_sku: toInternetSku(productId),
    retail_price: parseRetailPrice(product.price),
    upc: null,
    searchTerm,
    productId,
  }
}

export async function enrichHomeDepotSkuWithSerpApi(args: {
  apiKey: string
  sku: string
  itemNameForMatch: string | null
  needUpc: boolean
  deliveryZip?: string
}): Promise<{ result: SerpApiHomeDepotEnrichment | null; creditsUsed: number }> {
  const deliveryZip = (args.deliveryZip || getSerpApiDeliveryZip()).trim()
  let creditsUsed = 0

  // Strategy 1: search by SKU (1 credit)
  creditsUsed++
  let products = await searchHomeDepotWithSerpApi({
    apiKey: args.apiKey,
    query: args.sku,
    deliveryZip,
  })

  if (products && products.length > 0) {
    let candidate: SerpApiHomeDepotProductSearchItem | null = products[0] || null

    if (args.itemNameForMatch) {
      const matchName = args.itemNameForMatch // capture for callback closure
      const topMatches = candidate ? isLikelyMatch(candidate.title, matchName) : false
      if (!topMatches) {
        const alt = products.slice(1, 4).find((p) => isLikelyMatch(p.title, matchName))
        if (alt) candidate = alt
        else candidate = null
      }
    }

    if (candidate) {
      const base = extractFromSearchItem(args.sku, candidate, args.sku)

      if (args.needUpc && base.productId) {
        creditsUsed++
        const upc = await fetchUpcFromHomeDepotProductWithSerpApi({
          apiKey: args.apiKey,
          productId: base.productId,
          deliveryZip,
        })
        base.upc = upc
      }

      return { result: base, creditsUsed }
    }
  }

  // Strategy 2: fallback by cleaned item name (optional, 1 credit)
  if (args.itemNameForMatch) {
    const cleaned = cleanItemName(args.itemNameForMatch)
    if (cleaned.length >= 10) {
      creditsUsed++
      products = await searchHomeDepotWithSerpApi({
        apiKey: args.apiKey,
        query: cleaned,
        deliveryZip,
      })

      if (products && products.length > 0) {
        const top = products[0]
        if (isLikelyMatch(top.title, args.itemNameForMatch)) {
          const base = extractFromSearchItem(args.sku, top, cleaned)

          if (args.needUpc && base.productId) {
            creditsUsed++
            const upc = await fetchUpcFromHomeDepotProductWithSerpApi({
              apiKey: args.apiKey,
              productId: base.productId,
              deliveryZip,
            })
            base.upc = upc
          }

          return { result: base, creditsUsed }
        }
      }
    }
  }

  return { result: null, creditsUsed }
}
