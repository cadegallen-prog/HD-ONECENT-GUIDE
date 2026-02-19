const GENERIC_NAME_TERMS = new Set([
  "item",
  "product",
  "tool",
  "tools",
  "headlamp",
  "drill",
  "saw",
  "light",
  "lights",
  "lamp",
  "fan",
  "battery",
  "charger",
  "kit",
  "set",
  "gloves",
  "hose",
  "bulb",
  "faucet",
  "showerhead",
])

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function normalizeTokenKey(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function isModelLikeToken(token: string): boolean {
  return /[a-z]/i.test(token) && /\d/.test(token)
}

function hasModelLikeToken(value: string): boolean {
  return value.split(/\s+/).some((token) => isModelLikeToken(token))
}

function stripBrandPrefix(name: string, brand?: string | null): string {
  const normalizedName = normalizeWhitespace(name)
  const normalizedBrand = normalizeWhitespace(brand || "")
  if (!normalizedBrand) return normalizedName

  if (normalizedName.toLowerCase().startsWith(normalizedBrand.toLowerCase())) {
    const stripped = normalizedName
      .slice(normalizedBrand.length)
      .replace(/^[\s\-–—:]+/, "")
      .trim()
    return stripped || normalizedName
  }

  return normalizedName
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && normalizeWhitespace(value).length > 0
}

export function isLowQualityItemName(
  name: string | null | undefined,
  brand?: string | null
): boolean {
  if (!hasText(name)) return true

  const stripped = stripBrandPrefix(name, brand)
  const tokens = stripped.split(/\s+/).filter(Boolean)

  if (tokens.length <= 1) {
    return !hasModelLikeToken(stripped)
  }

  if (!hasModelLikeToken(stripped) && tokens.length <= 2) {
    return true
  }

  if (tokens.length <= 2) {
    const allGeneric = tokens.every((token) => GENERIC_NAME_TERMS.has(normalizeTokenKey(token)))
    if (allGeneric) return true
  }

  return false
}

export function shouldPreferEnrichedName(
  currentName: string | null | undefined,
  candidateName: string | null | undefined,
  brand?: string | null
): boolean {
  if (!hasText(candidateName)) return false
  if (!hasText(currentName)) return true

  const current = normalizeWhitespace(currentName)
  const candidate = normalizeWhitespace(candidateName)

  if (current.toLowerCase() === candidate.toLowerCase()) return false

  const currentLowQuality = isLowQualityItemName(current, brand)
  const candidateLowQuality = isLowQualityItemName(candidate, brand)

  if (currentLowQuality && !candidateLowQuality) return true
  if (!currentLowQuality && candidateLowQuality) return false

  if (currentLowQuality && candidateLowQuality) {
    return (
      hasModelLikeToken(candidate) &&
      !hasModelLikeToken(current) &&
      candidate.length > current.length
    )
  }

  return (
    hasModelLikeToken(candidate) &&
    !hasModelLikeToken(current) &&
    candidate.length >= current.length + 4
  )
}
