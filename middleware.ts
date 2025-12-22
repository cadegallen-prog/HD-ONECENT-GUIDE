import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || ""

  // Facebook/Meta scraper sends Range headers that can cause issues with dynamic OG images
  // Strip the Range header for the OG API endpoint when Facebook's bot is scraping
  if (
    request.nextUrl.pathname.startsWith("/api/og") &&
    (userAgent.includes("facebookexternalhit") ||
      userAgent.includes("Facebot") ||
      userAgent.includes("LinkedInBot") ||
      userAgent.includes("Twitterbot") ||
      userAgent.includes("Discordbot"))
  ) {
    // Create new headers without the Range header
    const headers = new Headers(request.headers)
    headers.delete("range")

    // Clone the request with modified headers
    const modifiedRequest = new NextRequest(request.url, {
      method: request.method,
      headers,
    })

    return NextResponse.next({
      request: modifiedRequest,
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/og"],
}
