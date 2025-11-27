import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(
  process.cwd(),
  "data",
  "stores",
  "store_directory.master.json"
);
const CACHE_SECONDS = 3600;
const STALE_SECONDS = 86400;

type StoreDirectoryItem = {
  store_number: string;
  store_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: {
    weekday?: string;
    weekend?: string;
    [key: string]: string | undefined;
  } | null;
};

type Store = {
  id: string;
  number?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  phone?: string;
  lat: number;
  lng: number;
  hours?: {
    weekday?: string;
    weekend?: string;
    [key: string]: string | undefined;
  };
};

let storeCache: Store[] | null = null;

function normalizeStore(item: StoreDirectoryItem): Store {
  const number = (item.store_number || "").trim();
  const idBase = number || `${item.store_name}-${item.city}-${item.state}`;
  return {
    id: `store-${idBase}`,
    number: number || undefined,
    name: item.store_name || "The Home Depot",
    address: item.address,
    city: item.city,
    state: item.state,
    zip: item.zip || undefined,
    phone: item.phone || undefined,
    lat: Number(item.latitude),
    lng: Number(item.longitude),
    hours: item.hours ?? undefined,
  };
}

function loadStores(): Store[] {
  if (storeCache) return storeCache;
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`Missing store data at ${DATA_PATH}`);
  }
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Store directory JSON is not an array");
  }
  storeCache = parsed.map((item) => normalizeStore(item as StoreDirectoryItem));
  return storeCache;
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const stateParam = url.searchParams.get("state")?.toLowerCase().trim();
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit")) || 20, 100));
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");

  try {
    const stores = loadStores();

    let results: Store[] = stores;

    // If lat/lng provided, compute nearest
    if (lat && lng) {
      const userLat = Number(lat);
      const userLng = Number(lng);
      if (!Number.isNaN(userLat) && !Number.isNaN(userLng)) {
        results = [...stores]
          .map((s) => ({
            ...s,
            distance: haversineMiles(userLat, userLng, s.lat, s.lng),
          }))
          .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
          .slice(0, limit) as Store[];
      }
    } else if (stateParam) {
      results = stores
        .filter((s) => (s.state || "").toLowerCase() === stateParam)
        .slice(0, limit);
    } else {
      results = stores.slice(0, limit);
    }

    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    });
  } catch (error) {
    console.error("Failed to load stores", error);
    return NextResponse.json(
      { error: "Failed to load stores" },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    );
  }
}
