import { ImageResponse } from "next/og"
import { getOgFonts } from "@/lib/og-fonts"
import { OG_BACKGROUND_BASE64 } from "@/lib/og-background-base64"
import { OG_MAIN_PAGES, OG_VARIANTS, type OgMainPageId } from "@/lib/og"

export const runtime = "edge"
// Enable caching for SKU pages (main pages now use static images)
export const revalidate = 86400 // 24 hours

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const fontFamily = "Inter"

// Background image as base64 data URL (pennies + texture, no text)
const BACKGROUND_DATA_URL = `data:image/jpeg;base64,${OG_BACKGROUND_BASE64}`

// Layout constants - text constrained to left 60% to avoid pennies
const PAGE_PADDING_X = 72
const PAGE_PADDING_TOP = 70

const CONTENT_MAX_WIDTH = 680 // Left 56% of 1200px for text, pennies on right
const TEXT_COLUMN_MAX_WIDTH = CONTENT_MAX_WIDTH

// Copper/orange color for $0.01 highlight
const COPPER_COLOR = "#b87333"

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: `${PAGE_PADDING_TOP}px ${PAGE_PADDING_X}px`,
    fontFamily,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  content: {
    position: "relative",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  brandText: {
    fontSize: 40,
    fontWeight: 700,
    fontStyle: "italic",
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  headline: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    fontWeight: 700,
    color: "#000000",
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
    textAlign: "left",
  },
  headlineLine: {
    display: "block",
  },
  underline: {
    marginTop: 8,
    height: 2,
    width: "100%",
    maxWidth: 600,
    background: "#e0e0e0",
  },
  subhead: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: 400,
    color: "#555555",
    letterSpacing: "-0.01em",
    lineHeight: 1.35,
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
} as const

function normalizeText(raw: string | null, fallback: string, maxLen: number) {
  const normalized = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!normalized) return fallback
  return normalized.length > maxLen ? `${normalized.slice(0, maxLen - 1)}.` : normalized
}

function splitHeadline(headline: string): string[] {
  const normalized = headline.trim().replace(/\s+/g, " ")
  if (normalized.length <= 34) return [normalized]

  const words = normalized.split(" ").filter(Boolean)
  if (words.length < 4) return [normalized]

  const totalLen = words.reduce((sum, w) => sum + w.length, 0) + (words.length - 1)
  const target = Math.round(totalLen / 2)

  let bestIndex = -1
  let bestScore = Number.POSITIVE_INFINITY

  for (let i = 1; i < words.length - 2; i += 1) {
    const left = words.slice(0, i + 1).join(" ")
    const right = words.slice(i + 1).join(" ")

    // Never orphan the last word on its own line.
    if (right.trim().split(" ").length < 2) continue

    const score = Math.abs(left.length - target) + Math.abs(left.length - right.length) * 0.25
    if (score < bestScore) {
      bestScore = score
      bestIndex = i
    }
  }

  if (bestIndex === -1) return [normalized]

  const line1 = words.slice(0, bestIndex + 1).join(" ")
  const line2 = words.slice(bestIndex + 1).join(" ")
  return [line1, line2]
}

function estimateTextWidthPx(text: string, fontSize: number) {
  // Satori doesn't expose measurement; this heuristic is tuned for Inter at display sizes.
  return text.length * fontSize * 0.56
}

function chooseLargestFittingFontSize(
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
) {
  for (let size = maxSize; size >= minSize; size -= 2) {
    if (estimateTextWidthPx(text, size) <= maxWidth) return size
  }
  return minSize
}

function layoutHeadline(headline: string) {
  const maxWidth = TEXT_COLUMN_MAX_WIDTH
  const normalized = headline.trim().replace(/\s+/g, " ")

  // Prefer single line: shrink font slightly before breaking.
  const singleSize = chooseLargestFittingFontSize(normalized, maxWidth, 54, 44)
  if (singleSize > 44) return { lines: [normalized], fontSize: singleSize }

  const lines = splitHeadline(normalized)
  if (lines.length === 1) return { lines, fontSize: singleSize }

  const longest = Math.max(...lines.map((l) => l.length))
  const twoLineTarget = Math.max(
    62,
    Math.min(76, Math.round((maxWidth / (longest * 0.56)) * 2) / 2)
  )
  const twoLineSize = chooseLargestFittingFontSize(
    lines.reduce((a, b) => (a.length > b.length ? a : b)),
    maxWidth,
    twoLineTarget,
    56
  )
  return { lines, fontSize: twoLineSize }
}

function parseVariant(searchParams: URLSearchParams): { headline: string; subhead: string } {
  const pageParam = (searchParams.get("page") ?? "").trim()
  const isMainPage = OG_MAIN_PAGES.includes(pageParam as OgMainPageId)
  if (isMainPage) return OG_VARIANTS[pageParam as OgMainPageId]

  const fallbackHeadline = OG_VARIANTS.homepage.headline
  const fallbackSubhead = OG_VARIANTS.homepage.subhead

  return {
    headline: normalizeText(
      searchParams.get("headline") ?? searchParams.get("title"),
      fallbackHeadline,
      90
    ),
    subhead: normalizeText(searchParams.get("subhead"), fallbackSubhead, 130),
  }
}

// Parse subhead and highlight $0.01 in copper color
function renderSubheadParts(subhead: string): Array<{ text: string; highlight: boolean }> {
  const parts: Array<{ text: string; highlight: boolean }> = []
  const regex = /(\$0\.01)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(subhead)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: subhead.slice(lastIndex, match.index), highlight: false })
    }
    parts.push({ text: match[1], highlight: true })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < subhead.length) {
    parts.push({ text: subhead.slice(lastIndex), highlight: false })
  }

  return parts.length > 0 ? parts : [{ text: subhead, highlight: false }]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showBrand = searchParams.get("brand") !== "0"

    const { headline, subhead } = parseVariant(searchParams)
    const headlineLayout = layoutHeadline(headline)
    const subheadParts = renderSubheadParts(subhead)

    const ogFonts = await getOgFonts()

    return new ImageResponse(
      <div {...({ style: styles.container } as Record<string, unknown>)}>
        {/* Background image with pennies on right */}
        <img
          src={BACKGROUND_DATA_URL}
          alt=""
          {...({ style: styles.backgroundImage } as Record<string, unknown>)}
        />

        {/* Content overlay - left side only */}
        <div {...({ style: styles.content } as Record<string, unknown>)}>
          {/* Brand name - italic */}
          {showBrand ? (
            <div {...({ style: styles.brandText } as Record<string, unknown>)}>PennyCentral</div>
          ) : null}

          {/* Headline */}
          <div
            {...({
              style: {
                ...styles.headline,
                fontSize: headlineLayout.fontSize,
              },
            } as Record<string, unknown>)}
          >
            {headlineLayout.lines.map((line) => (
              <div key={line} {...({ style: styles.headlineLine } as Record<string, unknown>)}>
                {line}
              </div>
            ))}
          </div>

          {/* Underline */}
          <div {...({ style: styles.underline } as Record<string, unknown>)} />

          {/* Subhead with $0.01 highlighted in copper */}
          <div {...({ style: styles.subhead } as Record<string, unknown>)}>
            {subheadParts.map((part, i) => (
              <span
                key={i}
                {...({
                  style: part.highlight ? { color: COPPER_COLOR, fontWeight: 500 } : {},
                } as Record<string, unknown>)}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: ogFonts.regular.data,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: ogFonts.medium.data,
            style: "normal",
            weight: 500,
          },
          {
            name: "Inter",
            data: ogFonts.bold.data,
            style: "normal",
            weight: 700,
          },
        ],
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    )
  } catch (error) {
    console.error("OG image generation failed:", error)
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
