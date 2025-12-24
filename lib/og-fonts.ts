const OG_FONT_SOURCES: Record<string, { weight: number; url: string }> = {
  regular: {
    weight: 400,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  },
  medium: {
    weight: 500,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf",
  },
  bold: {
    weight: 700,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
  },
}

const fontCache = new Map<string, ArrayBuffer>()

/**
 * @param {string} key
 */
async function fetchFontBuffer(key: string) {
  const cached = fontCache.get(key)
  if (cached) return cached

  const font = OG_FONT_SOURCES[key]
  if (!font) {
    throw new Error(`Unknown OG font key: ${key}`)
  }

  const response = await fetch(font.url)
  if (!response.ok) {
    throw new Error(
      `Failed to load OG font (weight ${font.weight}): ${response.status} ${response.statusText}`
    )
  }

  const buffer = await response.arrayBuffer()
  fontCache.set(key, buffer)
  return buffer
}

export async function getOgFonts(): Promise<Record<string, { weight: number; data: ArrayBuffer }>> {
  const entries = await Promise.all(
    Object.entries(OG_FONT_SOURCES).map(async ([key, font]) => {
      const data = await fetchFontBuffer(key)
      return [key, { weight: font.weight, data }]
    })
  )
  return Object.fromEntries(entries)
}
