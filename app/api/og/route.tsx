import { ImageResponse } from "next/og"
import { INTER_FONT_BASE64 } from "@/lib/inter-font-data"

export const runtime = "edge"
// Enable caching for SKU pages (main pages now use static images)
export const revalidate = 86400 // 24 hours

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const fontFamily = "Inter"

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "84px 90px",
    fontFamily,
  },
  watermarkWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.13,
  },
  penny: {
    position: "relative",
    width: 360,
    height: 360,
    borderRadius: 9999,
    background: "linear-gradient(135deg, #cd7f32 0%, #b87333 50%, #8b5a2b 100%)",
    display: "flex",
  },
  pennyOuterRing: {
    position: "absolute",
    top: 14,
    right: 14,
    bottom: 14,
    left: 14,
    borderRadius: 9999,
    border: "4px solid #8b5a2b",
  },
  pennyInnerRing: {
    position: "absolute",
    top: 58,
    right: 58,
    bottom: 58,
    left: 58,
    borderRadius: 9999,
    border: "2px solid #ffffff",
    opacity: 0.7,
  },
  pennyOne: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 122,
    textAlign: "center",
    fontSize: 160,
    fontWeight: 900,
    color: "#1c1917",
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },
  pennyCent: {
    position: "absolute",
    top: 86,
    right: 86,
    fontSize: 80,
    fontWeight: 700,
    color: "#44403c",
    lineHeight: 1,
  },
  brandWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 34,
  },
  brand: {
    fontSize: 54,
    fontWeight: 900,
    color: "#000000",
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  underline: {
    marginTop: 10,
    width: 180,
    height: 4,
    borderRadius: 2,
    background: "#e7e5e4",
  },
  headline: {
    fontWeight: 900,
    color: "#000000",
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
    maxWidth: 1040,
    textAlign: "center",
  },
  subhead: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: 600,
    color: "#333333",
    letterSpacing: "-0.02em",
    maxWidth: 1040,
    lineHeight: 1.25,
    textAlign: "center",
  },
  footerUrl: {
    position: "absolute",
    right: 70,
    bottom: 54,
    color: "#2b4c7e",
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
} as const

function normalizeHeadline(raw: string | null) {
  const fallback = "Home Depot Penny List"
  const headline = (raw ?? "").trim().replace(/\s+/g, " ")
  if (!headline) return fallback
  return headline.length > 92 ? `${headline.slice(0, 91)}…` : headline
}

function normalizeSubhead(raw: string | null) {
  const fallback = "Community-Reported $0.01 Finds – Updated Hourly"
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

    const fontBuffer = Buffer.from(INTER_FONT_BASE64, "base64")

    return new ImageResponse(
      <div {...({ style: styles.container } as Record<string, unknown>)}>
        <div {...({ style: styles.watermarkWrap } as Record<string, unknown>)}>
          <div {...({ style: styles.penny } as Record<string, unknown>)}>
            <div {...({ style: styles.pennyOuterRing } as Record<string, unknown>)} />
            <div {...({ style: styles.pennyInnerRing } as Record<string, unknown>)} />
            <div {...({ style: styles.pennyOne } as Record<string, unknown>)}>1</div>
            <div {...({ style: styles.pennyCent } as Record<string, unknown>)}>¢</div>
          </div>
        </div>

        {showBrand ? (
          <div {...({ style: styles.brandWrap } as Record<string, unknown>)}>
            <div {...({ style: styles.brand } as Record<string, unknown>)}>PennyCentral</div>
            <div {...({ style: styles.underline } as Record<string, unknown>)} />
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

        <div {...({ style: styles.footerUrl } as Record<string, unknown>)}>
          www.pennycentral.com
        </div>
      </div>,
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: fontBuffer,
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: fontBuffer,
            style: "normal",
            weight: 600,
          },
          {
            name: "Inter",
            data: fontBuffer,
            style: "normal",
            weight: 900,
          },
        ],
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
