import { NextResponse } from 'next/server'

// Cache for 24 hours (86400 seconds)
export const revalidate = 86400

export async function GET() {
  // Use server-side env var (no NEXT_PUBLIC_ prefix) for security
  const url = process.env.HOME_DEPOT_STORES_URL || process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL

  if (!url) {
    return NextResponse.json(
      { error: 'Store URL not configured', stores: [] },
      { status: 200 } // Return 200 so client can fallback to sample data
    )
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 } // Cache for 24 hours
    })

    if (!res.ok) {
      console.error(`Failed to fetch stores: ${res.status}`)
      return NextResponse.json(
        { error: `Failed to fetch stores: ${res.status}`, stores: [] },
        { status: 200 }
      )
    }

    const data = await res.json()

    return NextResponse.json({ stores: data })
  } catch (error) {
    console.error('Error fetching store data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store data', stores: [] },
      { status: 200 }
    )
  }
}
