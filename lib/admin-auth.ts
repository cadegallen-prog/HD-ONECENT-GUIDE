import { NextRequest, NextResponse } from "next/server"

/**
 * Validates Bearer token auth for admin-only API routes.
 * Returns a NextResponse when blocked, otherwise null.
 */
export function authorizeAdminRequest(request: NextRequest): NextResponse | null {
  const expectedToken = process.env.ADMIN_SECRET

  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.slice("Bearer ".length).trim()
  if (!token || !expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return null
}
