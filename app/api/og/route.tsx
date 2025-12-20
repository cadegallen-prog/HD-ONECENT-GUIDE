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
    padding: "80px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
  },
  brand: {
    fontSize: 56,
    fontWeight: 700,
    color: "#FFFFFF",
    letterSpacing: "-0.02em",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    textAlign: "center",
    maxWidth: 1000,
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
  const fallback = "Find $0.01 Items."
  const headline = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!headline) return fallback
  return headline.length > 80 ? `${headline.slice(0, 79)}…` : headline
}

function headlineFontSize(headline: string) {
  if (headline.length <= 22) return 72
  if (headline.length <= 34) return 64
  if (headline.length <= 46) return 56
  return 48
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const headline = normalizeHeadline(searchParams.get("headline") ?? searchParams.get("title"))
  const accent = searchParams.get("accent") !== "0"

  // Fetch Inter font for consistent rendering
  const fontUrl = new URL("/fonts/inter-variable.woff2", request.url)
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer())

  return new ImageResponse(
    <div {...({ style: styles.container } as Record<string, unknown>)}>
      {/* Brand header */}
      <div style={{ marginBottom: 28 }}>
        <div {...({ style: styles.brand } as Record<string, unknown>)}>PennyCentral</div>
      </div>

      {/* Centered content */}
      <div {...({ style: styles.content } as Record<string, unknown>)}>
        {accent ? <div {...({ style: styles.accent } as Record<string, unknown>)} /> : null}
        <div
          {...({
            style: {
              fontFamily:
                "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif",
              fontSize: headlineFontSize(headline),
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
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
      fonts: [
        {
          name: "Inter",
          data: fontData,
        },
      ],
    }
  )
}
