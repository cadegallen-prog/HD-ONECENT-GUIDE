"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Search, Navigation, List, Map as MapIcon, Phone, Clock, Heart, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  { ssr: false, loading: () => <div className="h-96 bg-muted/30 rounded-xl animate-pulse"></div> }
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
  hoursFetchedAt?: string
  hoursLastChangedAt?: string
  distance?: number
}

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
    .replace(/â€“|â€”|–|—/g, "-")
    .replace(/â€™|’/g, "'")
    .replace(/â€œ|â€\u009d|“|”/g, "\"")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const isValidHomeDepot = (name?: string) => {
  if (!name) return false
  const lower = name.toLowerCase()
  if (!lower.includes("home depot")) return false
  return !bannedNameTokens.some((token) => lower.includes(token))
}

const limitByZip = (stores: StoreLocation[], limit = 20) => {
  const counts: Record<string, number> = {}
  return stores.filter((store) => {
    const zip = store.zip || "unknown"
    counts[zip] = (counts[zip] || 0) + 1
    return counts[zip] <= limit
  })
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

const fallbackStores: StoreLocation[] = limitByZip(
  (sampleStoresData as StoreLocation[])
    .map(normalizeStore)
    .filter((s) => isValidHomeDepot(s.name)),
  20
)

function hasHours(store: StoreLocation) {
  return Boolean(store.hours && (store.hours.weekday || store.hours.weekend))
}

const formatDateTime = (iso?: string) => {
  if (!iso) return "Not recorded"
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })
}

export default function StoreFinderPage() {
  const [stores, setStores] = useState<StoreLocation[]>(fallbackStores)
  const [filteredStores, setFilteredStores] = useState<StoreLocation[]>(fallbackStores)
  const [loadingStores, setLoadingStores] = useState<boolean>(Boolean(process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL))
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([33.7490, -84.3880])
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filters, setFilters] = useState({
    state: "all",
    maxDistance: 50
  })

  const stateOptions = useMemo(
    () => Array.from(new Set(stores.map((s) => s.state).filter(Boolean))).sort(),
    [stores]
  )
  const missingHoursCount = useMemo(
    () => stores.filter((store) => !hasHours(store)).length,
    [stores]
  )
  const missingServicesCount = useMemo(
    () => stores.filter((store) => !store.services || store.services.length === 0).length,
    [stores]
  )

  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0])
      setMapCenter([stores[0].lat, stores[0].lng])
    }
  }, [stores, selectedStore])

  // Load store data from remote URL if provided; otherwise use the bundled sample.
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_HOME_DEPOT_STORES_URL
    if (!url) {
      setLoadingStores(false)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
        const json = (await res.json()) as StoreLocation[]
        const normalized = limitByZip(
          json
            .map(normalizeStore)
            .filter((s) => isValidHomeDepot(s.name)),
          20
        )
        if (!cancelled) {
          setStores(normalized)
          setFilteredStores(normalized)
        }
      } catch (err) {
        console.error("Failed to load remote store data; using fallback sample instead.", err)
      } finally {
        if (!cancelled) setLoadingStores(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
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

  // Get user location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setMapCenter([position.coords.latitude, position.coords.longitude])
          calculateDistances(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to Atlanta
          setUserLocation({ lat: 33.7490, lng: -84.3880 })
          setMapCenter([33.7490, -84.3880])
        }
      )
    }
  }

  // Calculate distances
  const calculateDistances = (lat: number, lng: number) => {
    setStores((prev) => {
      const storesWithDistance = prev.map(store => ({
        ...store,
        distance: calculateDistance(lat, lng, store.lat, store.lng)
      }))
      storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      const limited = limitByZip(storesWithDistance, 20)
      if (limited.length > 0) {
        setSelectedStore(limited[0])
        setMapCenter([limited[0].lat, limited[0].lng])
      }
      setFilteredStores(limited)
      return storesWithDistance
    })
  }

  // Haversine formula for distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const toRad = (degrees: number) => degrees * (Math.PI / 180)

  // Search functionality
  useEffect(() => {
    let filtered = stores.filter((s) => isValidHomeDepot(s.name))

    if (searchQuery) {
      const query = sanitizeText(searchQuery).toLowerCase()
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        store.state.toLowerCase().includes(query) ||
        (store.zip || "").toLowerCase().includes(query) ||
        (store.number || "").toLowerCase().includes(query)
      )
    }

    if (filters.state !== "all") {
      filtered = filtered.filter(store => store.state === filters.state)
    }

    if (filters.maxDistance < 50 && userLocation) {
      filtered = filtered.filter(store => (store.distance ?? Infinity) <= filters.maxDistance)
    }

    filtered = limitByZip(filtered, 20)

    setFilteredStores(filtered)
  }, [searchQuery, filters, stores, userLocation])

  const selectStore = (store: StoreLocation) => {
    setSelectedStore(store)
    setMapCenter([store.lat, store.lng])
  }

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                Store Finder
              </h1>
              <p className="text-lg text-muted-foreground">
                Find nearby Home Depot stores, check hours and services, and save your go-to locations
              </p>
            </div>

            {/* Search and Controls */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by store number, address, city, state, or ZIP..."
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location Button */}
                <Button onClick={getUserLocation} variant="outline" className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Use My Location
                </Button>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode("map")}
                    variant={viewMode === "map" ? undefined : "outline"}
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    Map
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    variant={viewMode === "list" ? undefined : "outline"}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Filters:</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">State:</label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                    className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="all">All</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {userLocation && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Within:</label>
                    <select
                      value={filters.maxDistance}
                      onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                      className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm"
                    >
                      <option value="5">5 miles</option>
                      <option value="10">10 miles</option>
                      <option value="25">25 miles</option>
                      <option value="50">All</option>
                    </select>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Showing {filteredStores.length} of {stores.length} stores
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 text-primary" />
                <span>
                  Data from Google Places. Hours captured for {stores.length - missingHoursCount} stores ({missingHoursCount} missing); services present for {stores.length - missingServicesCount} stores ({missingServicesCount} missing). Store hours may vary from actual hours—check the retailer website for the most up-to-date information.
                </span>
              </div>
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <div className="bg-card border border-border rounded-xl p-4 mb-6">
                <div className="grid lg:grid-cols-[380px_1fr] gap-4">
                  <div className="max-h-[640px] overflow-y-auto pr-1 space-y-3">
                    {filteredStores.length === 0 && (
                      <div className="text-sm text-muted-foreground">No stores match your search.</div>
                    )}
                    {filteredStores.map(store => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        isFavorite={favorites.includes(store.id)}
                        onToggleFavorite={() => toggleFavorite(store.id)}
                        onSelect={() => selectStore(store)}
                        active={selectedStore?.id === store.id}
                      />
                    ))}
                  </div>
                  <StoreMap
                    stores={filteredStores}
                    center={mapCenter}
                    zoom={10}
                    selectedStore={selectedStore}
                    onSelect={(store) => selectStore(store)}
                    userLocation={userLocation}
                  />
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredStores.map(store => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    isFavorite={favorites.includes(store.id)}
                    onToggleFavorite={() => toggleFavorite(store.id)}
                    onSelect={() => selectStore(store)}
                  />
                ))}
              </div>
            )}

            {filteredStores.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">No stores found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pro Tips */}
            <div className="mt-12 callout-box info">
              <h3 className="font-heading font-semibold mb-3 text-foreground">Store Hunting Tips</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>Use the map to spot nearby clusters, then save favorites for quick return trips.</li>
                <li>Call ahead to confirm where clearance end caps are located; layouts vary by store.</li>
                <li>Hours can shift seasonally - double-check before driving a long distance.</li>
                <li>Suburban stores often have lighter competition than dense city locations.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Store Detail Modal */}
        {selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">{selectedStore.name}</h2>
                    <p className="text-muted-foreground">{selectedStore.address}</p>
                    <p className="text-muted-foreground">{selectedStore.city}, {selectedStore.state} {selectedStore.zip}</p>
                    <p className="text-xs text-muted-foreground mt-1">Store #: {selectedStore.number || "Not provided"}</p>
                  </div>
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-heading font-semibold mb-3 text-foreground">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        {selectedStore.phone ? (
                          <a href={`tel:${selectedStore.phone}`} className="text-primary hover:underline">
                            {selectedStore.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Phone not listed</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold mb-3 text-foreground">Hours</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Weekdays: {selectedStore.hours?.weekday || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Weekends: {selectedStore.hours?.weekend || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => toggleFavorite(selectedStore.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${favorites.includes(selectedStore.id) ? 'fill-current text-red-500' : ''}`} />
                    {favorites.includes(selectedStore.id) ? 'Saved' : 'Save Store'}
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`, '_blank')
                    }}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function StoreCard({ store, isFavorite, onToggleFavorite, onSelect, active }: {
  store: StoreLocation
  isFavorite: boolean
  onToggleFavorite: () => void
  onSelect: () => void
  active?: boolean
}) {
  return (
    <div
      className={`bg-card border-2 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group ${active ? "border-primary/60" : "border-border"}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {store.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Store #: {store.number || "Not provided"}</p>
          <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
          <p className="text-sm text-muted-foreground">{store.city}, {store.state} {store.zip}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {store.distance && (
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{store.distance.toFixed(1)} miles away</span>
        </div>
      )}

      <div className="space-y-1 mb-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Weekdays: {store.hours?.weekday || "Not provided"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Weekends: {store.hours?.weekend || "Not provided"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        {store.phone || "Phone not listed"}
      </div>
    </div>
  )
}
