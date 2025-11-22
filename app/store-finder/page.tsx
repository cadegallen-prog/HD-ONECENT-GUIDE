"use client"

import { useEffect, useState, useRef, useCallback, forwardRef } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Search, Navigation, List, Map as MapIcon, Phone, Clock, Heart, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  { ssr: false, loading: () => <div className="h-full min-h-[500px] bg-muted/30 rounded-xl animate-pulse"></div> }
)

import sampleStoresData from "@/data/home-depot-stores.sample.json"

export interface StoreLocation {
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
  }
  services?: string[]
  distance?: number
}

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

const sanitizeText = (value?: string) => {
  if (!value) return ""
  return value
    .replace(/â€"|â€"|–|—/g, "-")
    .replace(/â€™|'/g, "'")
    .replace(/â€œ|â€\u009d|"|"/g, "\"")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Validate store - now just checks it's not a banned type
const isValidStore = (name?: string) => {
  if (!name) return false
  const lower = name.toLowerCase()
  return !bannedNameTokens.some((token) => lower.includes(token))
}

// Format store number for display (4 digits with leading zeros)
const formatStoreNumber = (num?: string): string => {
  if (!num) return "N/A"
  // Ensure it's 4 digits with leading zeros
  return num.padStart(4, '0')
}

// Get store number for URL (no leading zeros)
const getStoreUrlNumber = (num?: string): string => {
  if (!num) return ""
  return parseInt(num, 10).toString()
}

// Build Home Depot store URL
// Format: https://www.homedepot.com/l/{Store_Name}/{State}/{City}/{Zip}/{Store_Number}
const getStoreUrl = (store: StoreLocation): string => {
  const storeName = (store.name || store.city || "Store").replace(/\s+/g, '-')
  const state = store.state || "GA"
  const city = store.city || "Atlanta"
  const zip = store.zip || ""
  const storeNum = getStoreUrlNumber(store.number)
  return `https://www.homedepot.com/l/${storeName}/${state}/${city}/${zip}/${storeNum}`
}

const normalizeStore = (s: StoreLocation): StoreLocation => ({
  ...s,
  name: sanitizeText(s.name) || "Home Depot",
  address: sanitizeText(s.address),
  city: sanitizeText(s.city),
  state: sanitizeText(s.state),
  zip: sanitizeText(s.zip),
  phone: sanitizeText(s.phone),
  hours: {
    weekday: sanitizeText(s.hours?.weekday) || "",
    weekend: sanitizeText(s.hours?.weekend) || ""
  },
  services: (s.services || []).map(sanitizeText).filter(Boolean)
})

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
  .filter((s) => isValidStore(s.name))

// Default center (Atlanta, GA)
const DEFAULT_CENTER: [number, number] = [33.7490, -84.3880]

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
    if (allLoadedStores !== allStores) {
      // Remote data loaded, recalculate closest stores
      const newStores = getClosestStores(allLoadedStores, mapCenter[0], mapCenter[1])
      setDisplayedStores(newStores)
      if (newStores.length > 0 && !selectedStore) {
        setSelectedStore(newStores[0])
      }
    }
  }, [allLoadedStores, mapCenter, selectedStore])

  // Load remote store data if URL is provided
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL
    if (!url) return

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
        const json = (await res.json()) as StoreLocation[]
        const normalized = json
          .map(normalizeStore)
          .filter((s) => isValidStore(s.name))
        if (!cancelled) {
          setAllLoadedStores(normalized)
        }
      } catch (err) {
        console.error("Failed to load remote store data; using fallback sample instead.", err)
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
    if (!searchQuery.trim()) {
      // Reset to default location if search is cleared
      const initialStores = getClosestStores(allLoadedStores, DEFAULT_CENTER[0], DEFAULT_CENTER[1])
      setDisplayedStores(initialStores)
      setMapCenter(DEFAULT_CENTER)
      if (initialStores.length > 0) {
        setSelectedStore(initialStores[0])
      }
      return
    }

    const query = sanitizeText(searchQuery).toLowerCase()

    // First, try to find stores that match the search query directly
    const matchingStores = allLoadedStores.filter(store =>
      store.name.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query) ||
      store.city.toLowerCase().includes(query) ||
      store.state.toLowerCase().includes(query) ||
      (store.zip || "").toLowerCase().includes(query) ||
      (store.number || "").toLowerCase().includes(query)
    )

    if (matchingStores.length > 0) {
      // If we found matches, calculate distances from first match and sort
      const centerStore = matchingStores[0]
      const closestStores = getClosestStores(allLoadedStores, centerStore.lat, centerStore.lng)
        .filter(store => matchingStores.some(m => m.id === store.id) || store.distance! < 50)
        .slice(0, MAX_STORES)

      setDisplayedStores(closestStores)
      setMapCenter([centerStore.lat, centerStore.lng])
      setSelectedStore(closestStores[0] || null)
    } else {
      // If no direct matches, use geocoding simulation with approximate coordinates
      // In a real app, you'd use a geocoding API here
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
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
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
                  variant="outline"
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
                    variant={viewMode === "map" ? "primary" : "outline"}
                    size="sm"
                  >
                    <MapIcon className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Map</span>
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? "primary" : "outline"}
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
                    {loadingStores ? (
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
                {loadingStores ? (
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
        </div>
      </main>
      <Footer />
    </>
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
                  {store.name} #{formatStoreNumber(store.number)}
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

            <div className="flex items-center gap-3 mt-2">
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
              {store.name} #{formatStoreNumber(store.number)}
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
        {store.hours?.weekday && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{store.hours.weekday}</span>
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
