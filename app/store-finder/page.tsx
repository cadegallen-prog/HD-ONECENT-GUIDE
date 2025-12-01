"use client"

import { useEffect, useState, useRef, useCallback, forwardRef } from "react"
import dynamic from "next/dynamic"
import { MapPin, Search, Navigation, List, Map as MapIcon, Phone, Clock, Heart, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sanitizeText, cleanStoreName, getStoreTitle, getStoreUrl, hasValidCoordinates, formatStoreHours } from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  { ssr: false, loading: () => <div className="h-full min-h-[500px] bg-muted/30 rounded-xl animate-pulse"></div> }
)

import sampleStoresData from "@/data/home-depot-stores.sample.json"

const MAX_STORES = 20

const bannedNameTokens = [
  "lowe",
  "ace hardware",
  "innovation center",
  "support center",
  "crown bolt",
  "backyard",
  "renovation depot",
  "distribution center",
  "corporate"
]

// Validate store - now just checks it's not a banned type
const isValidStore = (name?: string) => {
  if (!name) return false
  const lower = cleanStoreName(name).toLowerCase()
  return !bannedNameTokens.some((token) => lower.includes(token))
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
      weekend: sanitizeText(s.hours?.weekend) || ""
    },
    services: (s.services || []).map(sanitizeText).filter(Boolean)
  }
}

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate distances and return sorted list limited to MAX_STORES
const getClosestStores = (stores: StoreLocation[], lat: number, lng: number): StoreLocation[] => {
  const storesWithDistance = stores.map(store => ({
    ...store,
    distance: calculateDistance(lat, lng, store.lat, store.lng)
  }))
  storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  return storesWithDistance.slice(0, MAX_STORES)
}

// Load and validate stores
const allStores: StoreLocation[] = (sampleStoresData as StoreLocation[])
  .map(normalizeStore)
  .filter((s) => isValidStore(s.name) && hasValidCoordinates(s))

// Default center (Atlanta, GA)
const DEFAULT_CENTER: [number, number] = [33.7490, -84.3880]

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
    lng: totals.lng / stores.length
  }
}

// Pre-compute initial stores for immediate display
const initialDisplayedStores = getClosestStores(allStores, DEFAULT_CENTER[0], DEFAULT_CENTER[1])

export default function StoreFinderPage() {
  const [displayedStores, setDisplayedStores] = useState<StoreLocation[]>(initialDisplayedStores)
  const [loadingStores, setLoadingStores] = useState(false)
  const [locatingUser, setLocatingUser] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(initialDisplayedStores[0] || null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [allLoadedStores, setAllLoadedStores] = useState<StoreLocation[]>(allStores)

  const listContainerRef = useRef<HTMLDivElement>(null)
  const storeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Re-calculate displayed stores when remote data loads
  useEffect(() => {
    // Only recalculate if we actually have new data (length changed significantly)
    if (allLoadedStores.length > allStores.length) {
      // Remote data loaded, recalculate closest stores using current map center
      const newStores = getClosestStores(allLoadedStores, mapCenter[0], mapCenter[1])
      setDisplayedStores(newStores)
      if (newStores.length > 0 && !selectedStore) {
        setSelectedStore(newStores[0])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoadedStores.length])

  // Load remote store data via cached API route
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingStores(true)
      try {
        console.log('[Store Finder] Fetching stores from API...')
        const res = await fetch("/api/stores?limit=2000", { cache: "force-cache" })

        if (!res.ok) {
          throw new Error(`Failed to fetch /api/stores: ${res.status} ${res.statusText}`)
        }

        const json = (await res.json()) as StoreLocation[]
        console.log(`[Store Finder] Received ${json.length} stores from API`)

        const normalized = json
          .map(normalizeStore)
          .filter((s) => isValidStore(s.name) && hasValidCoordinates(s))

        console.log(`[Store Finder] After filtering: ${normalized.length} valid stores`)

        if (!cancelled) {
          setAllLoadedStores(normalized)
        }
      } catch (err) {
        console.error("Failed to load remote store data; using fallback sample instead.", err)
        // Keep using the sample data (already in allLoadedStores)
      } finally {
        if (!cancelled) {
          setLoadingStores(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hd-penny-favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading favorites:', e)
      }
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('hd-penny-favorites', JSON.stringify(favorites))
  }, [favorites])

  // Auto-scroll to selected store in the list
  useEffect(() => {
    if (selectedStore && listContainerRef.current) {
      const storeElement = storeRefs.current.get(selectedStore.id)
      if (storeElement) {
        storeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedStore])

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      setLocatingUser(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setUserLocation({ lat, lng })
          setMapCenter([lat, lng])

          // Get closest 20 stores to user's location
          const closestStores = getClosestStores(allLoadedStores, lat, lng)
          setDisplayedStores(closestStores)
          if (closestStores.length > 0) {
            setSelectedStore(closestStores[0])
          }
          setLocatingUser(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocatingUser(false)
          alert("Could not get your location. Please try searching by ZIP code instead.")
        }
      )
    }
  }, [allLoadedStores])

  // Search by ZIP code, city, or address
  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      const initialStores = getClosestStores(allLoadedStores, DEFAULT_CENTER[0], DEFAULT_CENTER[1])
      setDisplayedStores(initialStores)
      setMapCenter(DEFAULT_CENTER)
      if (initialStores.length > 0) {
        setSelectedStore(initialStores[0])
      }
      return
    }

    const latLngMatch = trimmedQuery.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/)
    if (latLngMatch) {
      const lat = parseFloat(latLngMatch[1])
      const lng = parseFloat(latLngMatch[3])
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        const closestStores = getClosestStores(allLoadedStores, lat, lng)
        setDisplayedStores(closestStores)
        setMapCenter([lat, lng])
        setSelectedStore(closestStores[0] || null)
      }
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

    const scoredStores = allLoadedStores.map((store) => {
      const fields = [
        store.name,
        store.address,
        store.city,
        store.state,
        store.zip || "",
        store.number || ""
      ].map((value) => value.toLowerCase())

      const score = tokens.reduce(
        (count, token) => count + (fields.some((field) => field.includes(token)) ? 1 : 0),
        0
      )

      return { store, score }
    })

    let referenceStores = scoredStores
      .filter(({ score }) => score === tokens.length && tokens.length > 0)
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

      const closestStores = getClosestStores(allLoadedStores, centerPoint.lat, centerPoint.lng)
      setDisplayedStores(closestStores)
      setMapCenter([centerPoint.lat, centerPoint.lng])
      setSelectedStore(closestStores[0] || null)
    } else {
      setDisplayedStores([])
      setSelectedStore(null)
    }
  }, [searchQuery, allLoadedStores])

  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
    setFavorites(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
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
    <div className="p-6 max-w-[1200px]">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-foreground">
                Store Finder
              </h1>
              <p className="text-muted-foreground">
                Find Home Depot stores near you - showing the {MAX_STORES} closest locations
              </p>
            </div>

            {/* Search and Controls */}
            <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter ZIP code, city, or address..."
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Button onClick={handleSearch}>
                    Search
                  </Button>
                </div>

                {/* Location Button */}
                <Button
                  onClick={getUserLocation}
                  variant="secondary"
                  className="flex items-center gap-2"
                  disabled={locatingUser}
                >
                  <Navigation className={`h-4 w-4 ${locatingUser ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">
                    {locatingUser ? 'Locating...' : 'Use My Location'}
                  </span>
                  <span className="sm:hidden">
                    {locatingUser ? 'Locating...' : 'My Location'}
                  </span>
                </Button>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode("map")}
                    variant={viewMode === "map" ? "primary" : "secondary"}
                    size="sm"
                  >
                    <MapIcon className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Map</span>
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "primary" : "secondary"}
                    size="sm"
                  >
                    <List className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">List</span>
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>
                  Showing {displayedStores.length} stores. Hours may vary - verify with the store before visiting.
                </span>
              </div>
            </div>

            {/* Map View - Split Panel Layout */}
            {viewMode === "map" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="grid lg:grid-cols-[380px_1fr]">
                  {/* Store List Panel */}
                  <div
                    ref={listContainerRef}
                    className="h-[300px] lg:h-[640px] overflow-y-auto border-b lg:border-b-0 lg:border-r border-border"
                  >
                    {loadingStores && displayedStores.length === 0 ? (
                      <div className="p-4 space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : displayedStores.length === 0 ? (
                      <div className="p-8 text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No stores found</p>
                        <p className="text-sm text-muted-foreground mt-1">Try a different search</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {displayedStores.map((store, index) => (
                          <StoreListItem
                            key={store.id}
                            store={store}
                            index={index + 1}
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

                  {/* Map Panel */}
                  <div className="h-[400px] lg:h-[640px]">
                    <StoreMap
                      stores={displayedStores}
                      center={mapCenter}
                      zoom={11}
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
              <div className="space-y-4">
                {loadingStores && displayedStores.length === 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-40 bg-muted/30 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : displayedStores.length === 0 ? (
                  <div className="text-center py-16 bg-card border border-border rounded-xl">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">No stores found</h3>
                    <p className="text-muted-foreground">Try adjusting your search</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {displayedStores.map((store, index) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        index={index + 1}
                        isFavorite={favorites.includes(store.id)}
                        onToggleFavorite={() => toggleFavorite(store.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pro Tips */}
            <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="font-heading font-semibold mb-3 text-foreground">Store Hunting Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Click on any store in the list to see its location on the map
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use &quot;My Location&quot; to find the closest stores to you
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Call ahead to confirm clearance end cap locations - layouts vary by store
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Suburban stores often have lighter competition than city locations
                </li>
              </ul>
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
        className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
          isSelected ? 'bg-primary/10 border-l-4 border-l-primary' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Index number */}
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
          }`}>
            {index}
          </div>

          {/* Store info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {getStoreTitle(store)}
                </h3>
                <p className="text-xs text-muted-foreground">{store.city}, {store.state}</p>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-1.5 hover:bg-accent rounded transition-colors flex-shrink-0"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-1 truncate">{store.address}</p>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-3">
                {store.distance !== undefined && (
                  <span className="text-xs font-medium text-primary">
                    {store.distance.toFixed(1)} mi
                  </span>
                )}
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {store.phone}
                  </a>
                )}
              </div>

              {(store.hours?.weekday || store.hours?.weekend) && (
                <div className="flex items-start gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3 mt-[1px]" />
                  <div className="flex flex-col gap-0.5">
                    {(() => {
                      const formatted = formatStoreHours(store.hours)
                      return (
                        <>
                          <span className="truncate">{formatted.weekday}</span>
                          <span className="truncate">{formatted.saturday}</span>
                          <span className="truncate">{formatted.sunday}</span>
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Quick action buttons when selected */}
            {isSelected && (
              <div className="flex gap-2 mt-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs bg-primary text-white py-1.5 px-3 rounded text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="h-3 w-3" />
                  Directions
                </a>
                <a
                  href={getStoreUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs border border-border py-1.5 px-3 rounded text-center hover:bg-accent transition-colors flex items-center justify-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Store Page
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
function StoreCard({ store, index, isFavorite, onToggleFavorite }: {
  store: StoreLocation
  index: number
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {index}
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">
              {getStoreTitle(store)}
            </h3>
            <p className="text-xs text-muted-foreground">{store.city}, {store.state}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">{store.address}</p>
        <p className="text-sm text-muted-foreground">{store.city}, {store.state} {store.zip}</p>
      </div>

      {store.distance !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{store.distance.toFixed(1)} miles away</span>
        </div>
      )}

      <div className="space-y-1.5 mb-4 text-sm text-muted-foreground">
        {store.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a href={`tel:${store.phone}`} className="hover:text-primary">{store.phone}</a>
          </div>
        )}
        {(store.hours?.weekday || store.hours?.weekend) && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              {(() => {
                const formatted = formatStoreHours(store.hours)
                return (
                  <>
                    <span>{formatted.weekday}</span>
                    <span>{formatted.saturday}</span>
                    <span>{formatted.sunday}</span>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm bg-primary text-white py-2 px-4 rounded-lg text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>
        <a
          href={getStoreUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm border border-border py-2 px-4 rounded-lg text-center hover:bg-accent transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View Store
        </a>
      </div>
    </div>
  )
}
