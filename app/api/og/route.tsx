import { ImageResponse } from "next/og"

export const runtime = "edge"

const OG_WIDTH = 1200
const OG_HEIGHT = 630

function normalizeHeadline(raw: string | null) {
  const fallback = "Find $0.01 Items."
  const headline = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!headline) return fallback
  return headline.length > 80 ? `${headline.slice(0, 79)}…` : headline
}

function headlineFontSize(headline: string) {
  if (headline.length <= 22) return 92
  if (headline.length <= 34) return 80
  if (headline.length <= 46) return 68
  return 60
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const headline = normalizeHeadline(searchParams.get("headline") ?? searchParams.get("title"))
  const accent = searchParams.get("accent") !== "0"

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#18181B",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "72px 84px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 84,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
          PennyCentral
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 18,
          maxWidth: 980,
        }}
      >
        {accent ? (
          <div style={{ width: 140, height: 4, backgroundColor: "#B87333", opacity: 0.9 }} />
        ) : null}
        <div
          style={{
            fontSize: headlineFontSize(headline),
            fontWeight: 500,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
          }}
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
    }
  )
}
