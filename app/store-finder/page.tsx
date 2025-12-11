"use client"

import { useEffect, useState, useRef, useCallback, forwardRef } from "react"
import dynamic from "next/dynamic"
import {
  MapPin,
  Search,
  Navigation,
  List,
  Map as MapIcon,
  Phone,
  Clock,
  Heart,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  sanitizeText,
  cleanStoreName,
  getStoreTitle,
  getStoreUrl,
  hasValidCoordinates,
  formatStoreHours,
  normalizeDayHours,
  mergeConsecutiveDays,
} from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"
import { trackEvent } from "@/lib/analytics"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[500px] bg-muted/30 rounded-xl animate-pulse"></div>
    ),
  }
)

// Temporary proof-of-concept mode: intentionally load every store to validate data completeness
const PROOF_OF_CONCEPT_MODE = false
const MAX_STORES = PROOF_OF_CONCEPT_MODE ? 5000 : 20

const STATE_ABBREV_MAP: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
}

const bannedNameTokens = [
  "ace hardware",
  "innovation center",
  "support center",
  "crown bolt",
  "backyard",
  "renovation depot",
  "distribution center",
  "corporate",
]

// Validate store - checks it's not a banned type
// Lowes filter uses word boundary to match only the brand name, not substrings like "lower" or "flower"
const isValidStore = (name?: string) => {
  if (!name) return false
  const lower = cleanStoreName(name).toLowerCase()

  // Check general banned tokens (substring matching)
  if (bannedNameTokens.some((token) => lower.includes(token))) {
    return false
  }

  // Check for Lowe's brand with word boundaries (not "lower", "flower", etc.)
  const lowesRegex = /\b(lowes?|lowe's)\b/i
  return !lowesRegex.test(lower)
}

const normalizeStore = (s: StoreLocation): StoreLocation => {
  const lat = typeof s.lat === "number" ? s.lat : Number(s.lat)
  const lng = typeof s.lng === "number" ? s.lng : Number(s.lng)
  return {
    ...s,
    name: cleanStoreName(s.name),
    address: sanitizeText(s.address),
    city: sanitizeText(s.city),
    state: sanitizeText(s.state),
    zip: sanitizeText(s.zip),
    phone: sanitizeText(s.phone),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    hours: {
      weekday: sanitizeText(s.hours?.weekday) || "",
      weekend: sanitizeText(s.hours?.weekend) || "",
    },
    services: (s.services || []).map(sanitizeText).filter(Boolean),
  }
}

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate distances and return sorted list limited to MAX_STORES
const getClosestStores = (stores: StoreLocation[], lat: number, lng: number): StoreLocation[] => {
  const limit = PROOF_OF_CONCEPT_MODE ? stores.length : MAX_STORES
  const storesWithDistance = stores
    .map((store) => ({
      ...store,
      distance: calculateDistance(lat, lng, store.lat, store.lng),
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, limit)

  return storesWithDistance.map((store, index) => ({ ...store, rank: index + 1 }))
}

// Load and validate stores (initially empty; remote load fills in)
const allStores: StoreLocation[] = []

// Default center (Geographic center of contiguous US - Lebanon, KS area)
const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795]

const getAverageCoordinates = (stores: StoreLocation[]) => {
  const totals = stores.reduce(
    (acc, store) => {
      acc.lat += store.lat
      acc.lng += store.lng
      return acc
    },
    { lat: 0, lng: 0 }
  )

  return {
    lat: totals.lat / stores.length,
    lng: totals.lng / stores.length,
  }
}

// Pre-compute initial stores for immediate display
const initialDisplayedStores: StoreLocation[] = []

export default function StoreFinderPage() {
  const [displayedStores, setDisplayedStores] = useState<StoreLocation[]>(initialDisplayedStores)
  const [loadingStores, setLoadingStores] = useState(false)
  const [locatingUser, setLocatingUser] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geolocationResolved, setGeolocationResolved] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(
    initialDisplayedStores[0] || null
  )
  const [favorites, setFavorites] = useState<string[]>([])
  const [allLoadedStores, setAllLoadedStores] = useState<StoreLocation[]>(allStores)
  const allStoresRef = useRef<StoreLocation[]>(allStores)
  const storesToRender =
    PROOF_OF_CONCEPT_MODE && displayedStores.length === 0 ? allLoadedStores : displayedStores

  const listContainerRef = useRef<HTMLDivElement>(null)
  const storeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Re-calculate displayed stores when remote data loads
  useEffect(() => {
    // Only recalculate if we actually have new data (length changed significantly)
    if (allLoadedStores.length > allStores.length) {
      // Remote data loaded, recalculate closest stores using current map center
      const newStores = getClosestStores(allLoadedStores, mapCenter[0], mapCenter[1])
      setDisplayedStores(newStores)
      if (newStores.length > 0) {
        // Only set an initial selection; don't override the user's choice
        setSelectedStore((current) => current ?? newStores[0])
      }
    }
  }, [allLoadedStores.length])

  // Load remote store data via cached API route
  // Initial load is limited to 300 stores for faster LCP; full dataset loads on demand
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingStores(true)
      try {
        const res = await fetch("/api/stores", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to fetch /api/stores: ${res.status} ${res.statusText}`)
        const json = (await res.json()) as StoreLocation[]
        const normalized = json
          .map(normalizeStore)
          .filter((s) => isValidStore(s.name) && hasValidCoordinates(s))

        if (!cancelled && normalized.length) {
          setAllLoadedStores(normalized)
          allStoresRef.current = normalized
        }
      } catch {
        // swallow
      } finally {
        if (!cancelled) setLoadingStores(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const ensureStoresLoaded = useCallback(async () => {
    if (allStoresRef.current.length > 0) return allStoresRef.current
    try {
      setLoadingStores(true)
      const res = await fetch("/api/stores", { cache: "no-store" })
      if (!res.ok) throw new Error("fetch failed")
      const json = (await res.json()) as StoreLocation[]
      const normalized = json
        .map(normalizeStore)
        .filter((s) => isValidStore(s.name) && hasValidCoordinates(s))
      if (normalized.length) {
        setAllLoadedStores(normalized)
        allStoresRef.current = normalized
        return normalized
      }
    } catch {
      // ignore
    } finally {
      setLoadingStores(false)
    }
    return allStoresRef.current
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hd-penny-favorites")
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading favorites:", e)
      }
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("hd-penny-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Auto-scroll to selected store in the list while maintaining order
  useEffect(() => {
    if (selectedStore && listContainerRef.current) {
      const storeElement = storeRefs.current.get(selectedStore.id)
      if (storeElement) {
        storeElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }, [selectedStore])

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setLocatingUser(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setUserLocation({ lat, lng })
          setGeolocationResolved(true)
          setMapCenter([lat, lng])

          // Fetch stores with server-side distance calculation for accuracy
          try {
            const res = await fetch(`/api/stores?lat=${lat}&lng=${lng}&limit=${MAX_STORES}`)
            if (res.ok) {
              const serverStores = (await res.json()) as StoreLocation[]
              const normalized = serverStores
                .map(normalizeStore)
                .filter((s) => isValidStore(s.name) && hasValidCoordinates(s))
              setDisplayedStores(normalized)
              if (normalized.length > 0) {
                setSelectedStore(normalized[0])
              }
            } else {
              // Fallback to client-side calculation
              const closestStores = getClosestStores(allLoadedStores, lat, lng)
              setDisplayedStores(closestStores)
              if (closestStores.length > 0) {
                setSelectedStore(closestStores[0])
              }
            }
          } catch {
            // Fallback to client-side calculation
            const closestStores = getClosestStores(allLoadedStores, lat, lng)
            setDisplayedStores(closestStores)
            if (closestStores.length > 0) {
              setSelectedStore(closestStores[0])
            }
          }
          setLocatingUser(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocatingUser(false)
          setGeolocationResolved(false)
          alert("Could not get your location. Please try searching by ZIP code instead.")
        }
      )
    }
  }, [allLoadedStores])

  // Auto-request user location on page load (runs once)
  useEffect(() => {
    const hasRequestedBefore = sessionStorage.getItem("hd-location-requested")
    if (!hasRequestedBefore && !geolocationResolved) {
      sessionStorage.setItem("hd-location-requested", "true")
      getUserLocation()
    }
  }, [geolocationResolved, getUserLocation])

  // Search by ZIP code, city, or address
  const handleSearch = useCallback(async () => {
    const storesSource = await ensureStoresLoaded()
    const trimmedQuery = searchQuery.trim()
    let queryType: "zip" | "city" | "state" | "other" | "none" = "none"

    // Track search events (only when there's a query)
    if (trimmedQuery) {
      queryType = /^\d{3,5}$/.test(trimmedQuery)
        ? "zip"
        : STATE_ABBREV_MAP[trimmedQuery.toLowerCase()]
          ? "state"
          : "city"
    }

    if (!trimmedQuery) {
      const initialStores = getClosestStores(storesSource, DEFAULT_CENTER[0], DEFAULT_CENTER[1])
      setDisplayedStores(initialStores)
      setMapCenter(DEFAULT_CENTER)
      if (initialStores.length > 0) {
        setSelectedStore(initialStores[0])
      }
      trackEvent("store_finder_search", {
        queryType,
        hasResults: initialStores.length > 0,
      })
      return
    }

    const latLngMatch = trimmedQuery.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/)
    if (latLngMatch) {
      const lat = parseFloat(latLngMatch[1])
      const lng = parseFloat(latLngMatch[3])
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        const closestStores = getClosestStores(storesSource, lat, lng)
        setDisplayedStores(closestStores)
        setMapCenter([lat, lng])
        setSelectedStore(closestStores[0] || null)
        trackEvent("store_finder_search", {
          queryType: "other",
          hasResults: closestStores.length > 0,
        })
      }
      return
    }

    // Check if query is a store number (3-5 digits)
    if (/^\d{3,5}$/.test(trimmedQuery)) {
      const storeNumber = trimmedQuery.padStart(4, "0")
      const matchedStore = storesSource.find(
        (s) => s.number === storeNumber || s.id === trimmedQuery || s.id === storeNumber
      )

      if (matchedStore) {
        const closestStores = getClosestStores(storesSource, matchedStore.lat, matchedStore.lng)
        setDisplayedStores(closestStores)
        setMapCenter([matchedStore.lat, matchedStore.lng])
        setSelectedStore(closestStores[0] || matchedStore)
        trackEvent("store_finder_search", {
          queryType: "zip",
          hasResults: closestStores.length > 0,
        })
        return
      }
    }

    // Check if query is a 5-digit ZIP code
    const zipMatch = trimmedQuery.match(/^\d{5}$/)
    if (zipMatch) {
      // First, try to find exact ZIP match in our data
      const storesWithZip = storesSource.filter((store) => store.zip === trimmedQuery)

      if (storesWithZip.length > 0) {
        // Found exact match - use that store's location as center
        const centerStore = storesWithZip[0]
        const closestStores = getClosestStores(storesSource, centerStore.lat, centerStore.lng)
        setDisplayedStores(closestStores)
        setMapCenter([centerStore.lat, centerStore.lng])
        setSelectedStore(closestStores[0] || centerStore)
        trackEvent("store_finder_search", {
          queryType: "zip",
          hasResults: closestStores.length > 0,
        })
        return
      }

      // No exact match - try geocoding for nearby area
      const geocodeZip = async () => {
        try {
          // Try Zippopotam first (more reliable, free, no rate limit)
          const zipResponse = await fetch(`https://api.zippopotam.us/us/${trimmedQuery}`)

          if (zipResponse.ok) {
            const zipData = await zipResponse.json()
            if (zipData && zipData.places && zipData.places.length > 0) {
              const lat = parseFloat(zipData.places[0].latitude)
              const lng = parseFloat(zipData.places[0].longitude)
              const closestStores = getClosestStores(storesSource, lat, lng)
              setDisplayedStores(closestStores)
              setMapCenter([lat, lng])
              setSelectedStore(closestStores[0] || null)
              trackEvent("store_finder_search", {
                queryType: "zip",
                hasResults: closestStores.length > 0,
              })
              return
            }
          }

          // Fallback to Nominatim if Zippopotam fails
          const nomResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${trimmedQuery}&country=US&format=json&limit=1`,
            {
              headers: {
                "User-Agent": "PennyCentral.com Store Finder",
              },
            }
          )
          const nomData = await nomResponse.json()
          if (nomData && nomData.length > 0) {
            const lat = parseFloat(nomData[0].lat)
            const lng = parseFloat(nomData[0].lon)
            const closestStores = getClosestStores(storesSource, lat, lng)
            setDisplayedStores(closestStores)
            setMapCenter([lat, lng])
            setSelectedStore(closestStores[0] || null)
            trackEvent("store_finder_search", {
              queryType: "zip",
              hasResults: closestStores.length > 0,
            })
          } else {
            // ZIP not found via any geocoding - show no results
            setDisplayedStores([])
            setSelectedStore(null)
            trackEvent("store_finder_search", { queryType: "zip", hasResults: false })
          }
        } catch (error) {
          console.error("Geocoding error:", error)
          // Silently fail - user can try city search instead
          setDisplayedStores([])
          setSelectedStore(null)
          trackEvent("store_finder_search", { queryType: "zip", hasResults: false })
        }
      }
      geocodeZip()
      return
    }

    const tokens = sanitizeText(trimmedQuery)
      .toLowerCase()
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean)

    if (tokens.length === 0) {
      setDisplayedStores([])
      setSelectedStore(null)
      return
    }

    // Expand tokens to include state abbreviations
    const expandedTokens = [...tokens]
    tokens.forEach((token) => {
      if (STATE_ABBREV_MAP[token]) {
        expandedTokens.push(STATE_ABBREV_MAP[token].toLowerCase())
      }
    })

    const scoredStores = storesSource.map((store) => {
      const fields = [
        store.name,
        store.address,
        store.city,
        store.state,
        store.zip || "",
        store.number || "",
      ].map((value) => value.toLowerCase())

      const score = expandedTokens.reduce(
        (count, token) => count + (fields.some((field) => field.includes(token)) ? 1 : 0),
        0
      )

      return { store, score }
    })

    let referenceStores = scoredStores
      .filter(({ score }) => score >= tokens.length && tokens.length > 0)
      .map(({ store }) => store)

    if (referenceStores.length === 0) {
      const bestScore = Math.max(0, ...scoredStores.map(({ score }) => score))
      if (bestScore > 0) {
        referenceStores = scoredStores
          .filter(({ score }) => score === bestScore)
          .map(({ store }) => store)
      }
    }

    if (referenceStores.length > 0) {
      const centerPoint =
        referenceStores.length === 1
          ? { lat: referenceStores[0].lat, lng: referenceStores[0].lng }
          : getAverageCoordinates(referenceStores)

      const closestStores = getClosestStores(storesSource, centerPoint.lat, centerPoint.lng)
      setDisplayedStores(closestStores)
      setMapCenter([centerPoint.lat, centerPoint.lng])
      setSelectedStore(closestStores[0] || null)
      trackEvent("store_finder_search", {
        queryType: tokens.some((token) => STATE_ABBREV_MAP[token]) ? "state" : "city",
        hasResults: closestStores.length > 0,
      })
    } else {
      setDisplayedStores([])
      setSelectedStore(null)
      trackEvent("store_finder_search", {
        queryType: tokens.some((token) => STATE_ABBREV_MAP[token]) ? "state" : "city",
        hasResults: false,
      })
    }
  }, [allLoadedStores, ensureStoresLoaded, searchQuery])

  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Select a store
  const selectStore = useCallback((store: StoreLocation) => {
    setSelectedStore(store)
    setMapCenter([store.lat, store.lng])
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback((storeId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setFavorites((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    )
  }, [])

  // Store ref callback for auto-scroll
  const setStoreRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      storeRefs.current.set(id, element)
    } else {
      storeRefs.current.delete(id)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {PROOF_OF_CONCEPT_MODE && (
        <div className="bg-red-700 text-white text-center px-4 py-3 text-sm font-semibold">
          PROOF OF CONCEPT - ALL ~{(allLoadedStores.length || 2007).toLocaleString()} STORES LOADED
          (mobile will be slow!)
        </div>
      )}
      {/* Hero Header - Compact on mobile 
          MOBILE: Reduced padding, smaller text */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Store Finder
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Find Home Depot locations near you
          </p>
        </div>
      </div>

      {/* Search Controls 
          MOBILE: Stack vertically, full-width inputs, larger touch targets */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3">
            {/* Search Input - Full width on mobile */}
            <div className="flex gap-2" role="search">
              <div className="relative flex-1">
                <label htmlFor="store-search" className="sr-only">
                  Search for stores
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="store-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ZIP code, city, or address..."
                  aria-label="Search for stores by ZIP code, city, or address"
                  className="w-full pl-10 pr-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow min-h-[48px] sm:min-h-[44px]"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                className="px-4 sm:px-6 min-h-[48px] sm:min-h-[44px]"
              >
                Search
              </Button>
            </div>

            {/* Location + View Toggle - Row on mobile */}
            <div className="flex gap-2 justify-between sm:justify-start">
              <Button
                onClick={getUserLocation}
                variant="secondary"
                size="sm"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 min-h-[44px]"
                disabled={locatingUser}
                aria-label={locatingUser ? "Locating your position" : "Use my current location"}
              >
                <Navigation
                  className={`h-4 w-4 ${locatingUser ? "animate-pulse" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {locatingUser ? "Locating..." : "My Location"}
                </span>
              </Button>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("map")}
                  aria-label="Map view"
                  title="Map view"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-[var(--text-primary)] text-[var(--bg-page)]"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  title="List view"
                  className={`px-3 py-2 min-h-[44px] text-sm font-medium transition-colors border-l border-border ${
                    viewMode === "list"
                      ? "bg-[var(--text-primary)] text-[var(--bg-page)]"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status line - Visible on mobile */}
          <p
            className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 px-1"
            aria-live="polite"
            role="status"
          >
            {loadingStores ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Loading all {allLoadedStores.length.toLocaleString()}+ stores...
              </span>
            ) : (
              <>
                Showing {storesToRender.length} of {allLoadedStores.length.toLocaleString()} stores
                - Hours may vary
              </>
            )}
          </p>
        </div>
      </div>

      {/* Main Content Area - Flex column on mobile
          MOBILE OPTIMIZATIONS:
          - Map is constrained height on mobile (not full viewport)
          - Store list scrolls independently below map
          - Minimum heights prevent layout collapse */}
      <div className="flex-1 flex flex-col bg-muted/5">
        {/* Map View */}
        {viewMode === "map" && (
          <div className="flex-1 p-0 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row h-[calc(100vh-220px)] min-h-[500px] max-h-[800px] max-w-7xl mx-auto bg-card sm:border sm:border-border sm:rounded-xl overflow-hidden shadow-sm">
              {/* Store List Panel - Scrollable on mobile */}
              <div
                ref={listContainerRef}
                className="flex-1 lg:flex-none lg:w-80 xl:w-96 min-h-[200px] lg:min-h-0 lg:h-full overflow-y-auto border-t lg:border-t-0 lg:border-r border-border bg-card order-2 lg:order-1"
              >
                {loadingStores && storesToRender.length === 0 ? (
                  <div className="p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : storesToRender.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No stores found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {storesToRender.map((store, index) => (
                      <StoreListItem
                        key={store.id}
                        store={store}
                        index={store.rank ?? index + 1}
                        isSelected={selectedStore?.id === store.id}
                        isFavorite={favorites.includes(store.id)}
                        onSelect={() => selectStore(store)}
                        onToggleFavorite={(e) => toggleFavorite(store.id, e)}
                        ref={(el) => setStoreRef(store.id, el)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Map Panel - Constrained on mobile, flex on desktop */}
              <div className="h-[280px] sm:h-[320px] lg:flex-1 lg:h-full order-1 lg:order-2 relative z-0">
                <StoreMap
                  stores={storesToRender}
                  center={mapCenter}
                  selectedStore={selectedStore}
                  onSelect={selectStore}
                  userLocation={userLocation}
                />
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {loadingStores && storesToRender.length === 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-muted/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : storesToRender.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-xl">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2 text-foreground">No stores found</h2>
                <p className="text-sm text-muted-foreground">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {storesToRender.map((store, index) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    index={store.rank ?? index + 1}
                    isFavorite={favorites.includes(store.id)}
                    onToggleFavorite={() => toggleFavorite(store.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Compact store list item for the side panel

interface StoreListItemProps {
  store: StoreLocation
  index: number
  isSelected: boolean
  isFavorite: boolean
  onSelect: () => void
  onToggleFavorite: (e: React.MouseEvent) => void
}

const StoreListItem = forwardRef<HTMLDivElement, StoreListItemProps>(
  ({ store, index, isSelected, isFavorite, onSelect, onToggleFavorite }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onSelect}
        className={`p-4 cursor-pointer transition-all duration-150 ${
          isSelected
            ? "bg-[var(--bg-elevated)] border-l-2 border-l-[var(--cta-primary)]"
            : "hover:bg-[var(--bg-elevated)]"
        }`}
      >
        <div className="flex items-start gap-2.5">
          {/* Index number */}
          <div
            className={`flex-shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
              isSelected
                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
            }`}
          >
            {index}
          </div>

          {/* Store info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2
                  className={`font-semibold text-sm leading-tight truncate ${
                    isSelected ? "text-[var(--text-primary)]" : "text-foreground"
                  }`}
                >
                  {getStoreTitle(store)}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {store.city}, {store.state}
                </p>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-1 hover:bg-[var(--bg-elevated)] rounded transition-colors flex-shrink-0"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-1 truncate">{store.address}</p>

            <div className="flex items-center gap-2 mt-2">
              {store.distance !== undefined && (
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {store.distance.toFixed(1)} mi
                </span>
              )}
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {store.phone}
                </a>
              )}
            </div>

            {(store.hours?.weekday || store.hours?.weekend || store.hours?.monday) && (
              <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  {(() => {
                    const dayHours = normalizeDayHours(store.hours)
                    const mergedHours = mergeConsecutiveDays(dayHours)

                    if (mergedHours.isExpanded) {
                      // Show all 7 days for irregular hours
                      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                      const dayValues = [
                        dayHours.monday,
                        dayHours.tuesday,
                        dayHours.wednesday,
                        dayHours.thursday,
                        dayHours.friday,
                        dayHours.saturday,
                        dayHours.sunday,
                      ]
                      return dayLabels.map((label, index) => (
                        <div key={label} className="flex justify-between gap-2">
                          <span className="font-semibold w-6">{label}</span>
                          <span>{dayValues[index]}</span>
                        </div>
                      ))
                    } else {
                      // Show merged ranges for standard hours
                      return mergedHours.ranges.map((range) => (
                        <div key={range.days} className="flex justify-between gap-2">
                          <span className="font-semibold">{range.days}</span>
                          <span>{range.hours}</span>
                        </div>
                      ))
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Quick action buttons when selected */}
            {isSelected && (
              <div className="flex gap-2 mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs font-medium bg-[var(--cta-primary)] text-[var(--cta-text)] py-2 px-3 rounded text-center hover:bg-[var(--cta-hover)] transition-colors flex items-center justify-center gap-1 min-h-[44px]"
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </a>
                <a
                  href={getStoreUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs font-medium border border-border py-2 px-3 rounded text-center hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center gap-1 min-h-[44px]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Store
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
StoreListItem.displayName = "StoreListItem"

// Full store card for list view
function StoreCard({
  store,
  index,
  isFavorite,
  onToggleFavorite,
}: {
  store: StoreLocation
  index: number
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-[var(--border-strong)] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded bg-[var(--bg-elevated)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
            {index}
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">{getStoreTitle(store)}</h2>
            <p className="text-xs text-muted-foreground">
              {store.city}, {store.state}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className="p-1.5 hover:bg-[var(--bg-elevated)] rounded transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="space-y-1 mb-3">
        <p className="text-xs text-muted-foreground">{store.address}</p>
        <p className="text-xs text-muted-foreground">
          {store.city}, {store.state} {store.zip}
        </p>
      </div>

      {store.distance !== undefined && (
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {store.distance.toFixed(1)} miles
          </span>
        </div>
      )}

      <div className="space-y-1 mb-3 text-xs text-muted-foreground">
        {store.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            <a href={`tel:${store.phone}`} className="hover:text-foreground">
              {store.phone}
            </a>
          </div>
        )}
        {(store.hours?.weekday || store.hours?.weekend) && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatStoreHours(store.hours).compact}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-xs font-medium bg-[var(--cta-primary)] text-[var(--cta-text)] py-2 px-3 rounded text-center hover:bg-[var(--cta-hover)] transition-colors flex items-center justify-center gap-1.5"
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions
        </a>
        <a
          href={getStoreUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-xs font-medium border border-border py-2 px-3 rounded text-center hover:bg-[var(--bg-elevated)] transition-colors flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Store Page
        </a>
      </div>
    </div>
  )
}
