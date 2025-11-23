import { NextResponse } from "next/server"

const SOURCE_URL = process.env.HOME_DEPOT_STORES_URL || process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL
const CACHE_SECONDS = 3600
const STALE_SECONDS = 86400

async function fetchStores() {
  if (!SOURCE_URL) {
    throw new Error("HOME_DEPOT_STORES_URL is not configured")
  }

  const res = await fetch(SOURCE_URL, {
    cache: "force-cache",
    next: { revalidate: CACHE_SECONDS }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch stores: ${res.status}`)
  }

  return res.json()
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const state = url.searchParams.get("state")?.toLowerCase().trim()
  const limit = Number(url.searchParams.get("limit")) || undefined

  try {
    const data = await fetchStores()
    const stores = Array.isArray(data) ? data : []

    const filtered = stores.filter((store) => {
      if (!state) return true
      const storeState = typeof store.state === "string" ? store.state.toLowerCase() : ""
      return storeState === state
    })

    const limited = limit ? filtered.slice(0, limit) : filtered

    return new NextResponse(JSON.stringify(limited), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`
      }
    })
  } catch (error) {
    console.error("Failed to load stores", error)
    return NextResponse.json(
      { error: "Failed to load stores" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60"
        }
      }
    )
  }
}
