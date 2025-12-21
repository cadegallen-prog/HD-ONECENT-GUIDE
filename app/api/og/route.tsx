import { ImageResponse } from "next/og"

export const runtime = "edge"

const OG_WIDTH = 1200
const OG_HEIGHT = 630

// Styles for the OG image to satisfy "no inline styles" linting
const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 80px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
  },
  brand: {
    fontSize: 42,
    fontWeight: 700,
    color: "#FFFFFF",
    letterSpacing: "-0.02em",
    marginBottom: 36,
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
    textAlign: "center",
    maxWidth: 900,
  },
  accent: {
    width: 200,
    height: 6,
    backgroundColor: "#B87333",
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(184, 115, 51, 0.3)",
  },
} as const

function normalizeHeadline(raw: string | null) {
  const fallback = "Home Depot $0.01 Finds"
  const headline = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!headline) return fallback
  return headline.length > 80 ? `${headline.slice(0, 79)}…` : headline
}

function headlineFontSize(headline: string) {
  if (headline.length <= 20) return 84
  if (headline.length <= 28) return 72
  if (headline.length <= 38) return 64
  return 56
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const headline = normalizeHeadline(searchParams.get("headline") ?? searchParams.get("title"))
    const accent = searchParams.get("accent") !== "0"

    // Attempt to fetch Inter font - use Google Fonts for better edge reliability
    let fontData: ArrayBuffer | null = null
    try {
      const fontUrl =
        "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
      const fontResponse = await fetch(fontUrl)
      if (fontResponse.ok) {
        fontData = await fontResponse.arrayBuffer()
      }
    } catch (fontError) {
      // Fallback to system fonts if font fetch fails
      console.error("Font fetch failed, using system fonts:", fontError)
    }

    const fontConfig = fontData
      ? [
          {
            name: "Inter",
            data: fontData,
            weight: 600 as const,
            style: "normal" as const,
          },
        ]
      : undefined

    return new ImageResponse(
      <div {...({ style: styles.container } as Record<string, unknown>)}>
        {/* Brand header - smaller and positioned at top */}
        <div {...({ style: styles.brand } as Record<string, unknown>)}>PennyCentral</div>

        {/* Centered content - headline is in vertical safe zone */}
        <div {...({ style: styles.content } as Record<string, unknown>)}>
          {accent ? <div {...({ style: styles.accent } as Record<string, unknown>)} /> : null}
          <div
            {...({
              style: {
                fontFamily:
                  "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
                fontSize: headlineFontSize(headline),
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
                maxWidth: "100%",
              },
            } as Record<string, unknown>)}
          >
            {headline}
          </div>
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
        fonts: fontConfig,
      }
    )
  } catch (error) {
    console.error("OG image generation failed:", error)
    // Return a basic error response
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
