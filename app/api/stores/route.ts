import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { sanitizeText, normalizeCoordinates, hasValidCoordinates } from "@/lib/stores"

const DATA_PATH = path.join(process.cwd(), "data", "stores", "store_directory.master.json")
const REMOTE_URL =
  process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL || process.env.HOME_DEPOT_STORES_URL || ""
const CACHE_SECONDS = 3600
const STALE_SECONDS = 86400

type StoreDirectoryItem = {
  store_number: string
  store_name: string
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  phone?: string
  hours?: {
    weekday?: string
    weekend?: string
    [key: string]: string | undefined
  } | null
}

type FlexibleStore = StoreDirectoryItem & {
  id?: string
  number?: string
  name?: string
  latitude?: number
  longitude?: number
  lat?: number
  lng?: number
}

type Store = {
  id: string
  number?: string
  name: string
  address: string
  city: string
  state: string
  zip?: string
  phone?: string
  lat: number
  lng: number
  hours?: {
    weekday?: string
    weekend?: string
    [key: string]: string | undefined
  }
}

let storeCache: Store[] | null = null
let storeCacheTimestamp = 0

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

function normalizeStore(item: FlexibleStore): Store {
  const rawNumber = (item.store_number ?? item.number ?? "").toString().trim()
  const latInput = item.lat ?? item.latitude
  const lngInput = item.lng ?? item.longitude

  const idBase =
    rawNumber || item.id || `${item.store_name || item.name}-${item.city}-${item.state}`

  const { lat, lng } = normalizeCoordinates(latInput, lngInput, idBase)

  let parsedHours: Store["hours"] = undefined
  if (item.hours) {
    if (typeof item.hours === "string") {
      try {
        parsedHours = JSON.parse(item.hours)
      } catch {
        parsedHours = undefined
      }
    } else {
      parsedHours = item.hours ?? undefined
    }
  }

  return {
    id: sanitizeText(idBase),
    number: sanitizeText(rawNumber) || undefined,
    name: sanitizeText(item.store_name || item.name || "The Home Depot"),
    address: sanitizeText(item.address),
    city: sanitizeText(item.city),
    state: sanitizeText(item.state),
    zip: sanitizeText(item.zip),
    phone: sanitizeText(item.phone),
    lat,
    lng,
    hours: parsedHours,
  }
}

async function loadStores(): Promise<Store[]> {
  const now = Date.now()
  const isDev = process.env.NODE_ENV === "development"

  if (!isDev && storeCache && now - storeCacheTimestamp < CACHE_TTL_MS) {
    return storeCache
  }

  // Try remote first if configured
  if (REMOTE_URL) {
    try {
      const res = await fetch(REMOTE_URL, { cache: "no-store" })
      if (!res.ok) {
        throw new Error(`Remote fetch failed: ${res.status}`)
      }
      const json = (await res.json()) as FlexibleStore[]
      if (Array.isArray(json)) {
        const normalized = json.map(normalizeStore).filter((s) => hasValidCoordinates(s))
        if (normalized.length > 0) {
          storeCache = normalized
          storeCacheTimestamp = now
          return storeCache
        }
      }
    } catch (err) {
      console.warn("Falling back to local store data due to remote error", err)
    }
  }

  // Fallback: local file packaged with the build
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Missing store data at ${DATA_PATH}`)
  }
  const raw = fs.readFileSync(DATA_PATH, "utf8")
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) {
    throw new Error("Store directory JSON is not an array")
  }
  storeCache = parsed
    .map((item) => normalizeStore(item as StoreDirectoryItem))
    .filter((s) => hasValidCoordinates(s))
  storeCacheTimestamp = now
  return storeCache
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 3958.8 // miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const stateParam = url.searchParams.get("state")?.toLowerCase().trim()
  const lat = url.searchParams.get("lat")
  const lng = url.searchParams.get("lng")

  try {
    const stores = await loadStores()
    const totalStores = stores.length

    // Handle limit parameter - only use if explicitly provided as a positive number
    const limitStr = url.searchParams.get("limit")
    const limitParam = limitStr ? Number(limitStr) : null
    const limit =
      limitParam !== null && Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, totalStores)
        : totalStores

    let results: Store[] = stores

    // If lat/lng provided, compute nearest
    if (lat && lng) {
      const userLat = Number(lat)
      const userLng = Number(lng)
      if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
        results = [...stores]
          .map((s) => ({
            ...s,
            distance: haversineMiles(userLat, userLng, s.lat, s.lng),
          }))
          .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
          .slice(0, limit) as Store[]
      }
    } else if (stateParam) {
      results = stores.filter((s) => (s.state || "").toLowerCase() === stateParam).slice(0, limit)
    } else {
      results = stores.slice(0, limit)
    }

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    })
  } catch (error) {
    console.error("Failed to load stores", error)
    return NextResponse.json(
      { error: "Failed to load stores" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    )
  }
}
