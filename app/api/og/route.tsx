import { ImageResponse } from "next/og"

export const runtime = "edge"
// Enable caching for SKU pages (main pages now use static images)
export const revalidate = 86400 // 24 hours

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const fontFamily =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, 'Noto Sans', sans-serif"

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #ffffff 0%, #f5f5f4 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "96px 90px",
    fontFamily,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  brand: {
    fontSize: 44,
    fontWeight: 800,
    color: "#1c1917",
    letterSpacing: "-0.03em",
  },
  brandPill: {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(43, 76, 126, 0.25)",
    background: "rgba(43, 76, 126, 0.08)",
    color: "#2b4c7e",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  headline: {
    fontWeight: 850,
    color: "#1c1917",
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
    maxWidth: 980,
  },
  subhead: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: 600,
    color: "#44403c",
    letterSpacing: "-0.02em",
    maxWidth: 980,
    lineHeight: 1.25,
  },
  footer: {
    position: "absolute",
    left: 90,
    right: 90,
    bottom: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#57534e",
    fontSize: 20,
    fontWeight: 650,
    letterSpacing: "-0.01em",
  },
  footerUrl: {
    color: "#2b4c7e",
  },
} as const

function normalizeHeadline(raw: string | null) {
  const fallback = "Home Depot Penny List"
  const headline = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!headline) return fallback
  return headline.length > 92 ? `${headline.slice(0, 91)}…` : headline
}

function normalizeSubhead(raw: string | null) {
  const fallback = "Community-reported $0.01 finds, updated hourly"
  const subhead = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!subhead) return fallback
  return subhead.length > 110 ? `${subhead.slice(0, 109)}…` : subhead
}

function headlineFontSize(headline: string) {
  if (headline.length <= 22) return 92
  if (headline.length <= 34) return 82
  if (headline.length <= 48) return 72
  if (headline.length <= 66) return 62
  return 56
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const headline = normalizeHeadline(searchParams.get("headline") ?? searchParams.get("title"))
    const subhead = normalizeSubhead(searchParams.get("subhead"))
    const showBrand = searchParams.get("brand") !== "0"
    const showPill = searchParams.get("pill") !== "0"

    return new ImageResponse(
      <div {...({ style: styles.container } as Record<string, unknown>)}>
        {showBrand ? (
          <div {...({ style: styles.brandRow } as Record<string, unknown>)}>
            <div {...({ style: styles.brand } as Record<string, unknown>)}>Penny Central</div>
            {showPill ? (
              <div {...({ style: styles.brandPill } as Record<string, unknown>)}>$0.01 Finds</div>
            ) : null}
          </div>
        ) : null}

        <div
          {...({
            style: {
              ...styles.headline,
              fontSize: headlineFontSize(headline),
            },
          } as Record<string, unknown>)}
        >
          {headline}
        </div>

        <div {...({ style: styles.subhead } as Record<string, unknown>)}>{subhead}</div>

        <div {...({ style: styles.footer } as Record<string, unknown>)}>
          <div>Shareable preview image</div>
          <div {...({ style: styles.footerUrl } as Record<string, unknown>)}>
            www.pennycentral.com
          </div>
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    )
  } catch (error) {
    console.error("OG image generation failed:", error)
    // Return a basic error response
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
