"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Search, Navigation, Star, Filter, List, Map as MapIcon, Phone, Clock, ExternalLink, Heart, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  { ssr: false, loading: () => <div className="h-96 bg-muted/30 rounded-xl animate-pulse"></div> }
)

import storesData from "@/data/home-depot-stores.json"

export interface StoreLocation {
  id: string
  name: string
  number: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  lat: number
  lng: number
  hours: {
    weekday: string
    weekend: string
  }
  services?: string[]
  hoursFetchedAt?: string
  hoursLastChangedAt?: string
  is24Hour?: boolean
  departments: string[]
  lastPennyFind?: string
  pennyFrequency: number // 0-100
  avgItemsPerVisit: number
  distance?: number
}

const allStores: StoreLocation[] = storesData as StoreLocation[]

export default function StoreFinderPage() {
  const [stores, setStores] = useState<StoreLocation[]>(allStores)
  const [filteredStores, setFilteredStores] = useState<StoreLocation[]>(allStores)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filters, setFilters] = useState({
    maxDistance: 50,
    minPennyFrequency: 0,
    show24Hour: false
  })

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
    if (favorites.length > 0) {
      localStorage.setItem('hd-penny-favorites', JSON.stringify(favorites))
    }
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
          calculateDistances(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to Atlanta
          setUserLocation({ lat: 33.7490, lng: -84.3880 })
        }
      )
    }
  }

  // Calculate distances
  const calculateDistances = (lat: number, lng: number) => {
    const storesWithDistance = allStores.map(store => ({
      ...store,
      distance: calculateDistance(lat, lng, store.lat, store.lng)
    }))
    storesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    setStores(storesWithDistance)
    setFilteredStores(storesWithDistance)
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
    let filtered = stores

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        store.zip.includes(query) ||
        store.number.includes(query)
      )
    }

    if (filters.minPennyFrequency > 0) {
      filtered = filtered.filter(store => store.pennyFrequency >= filters.minPennyFrequency)
    }

    if (filters.show24Hour) {
      filtered = filtered.filter(store => store.is24Hour)
    }

    if (filters.maxDistance < 50 && userLocation) {
      filtered = filtered.filter(store => (store.distance || 0) <= filters.maxDistance)
    }

    setFilteredStores(filtered)
  }, [searchQuery, filters, stores, userLocation])

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    )
  }

  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [33.7490, -84.3880]

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
                Find nearby Home Depot stores and discover the best penny hunting locations
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
                      placeholder="Search by store number, address, city, or ZIP..."
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
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filters:</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Min Success Rate:</label>
                  <select
                    value={filters.minPennyFrequency}
                    onChange={(e) => setFilters({ ...filters, minPennyFrequency: Number(e.target.value) })}
                    className="px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="0">Any</option>
                    <option value="50">50%+</option>
                    <option value="70">70%+</option>
                    <option value="80">80%+</option>
                  </select>
                </div>

                {userLocation && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Max Distance:</label>
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
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <div className="bg-card border border-border rounded-xl p-2 mb-6">
                <StoreMap stores={filteredStores} center={mapCenter} zoom={10} />
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
                    onSelect={() => setSelectedStore(store)}
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
                <li>• Stores with higher success rates typically have more active clearance cycles</li>
                <li>• Call ahead to ask about clearance department location</li>
                <li>• Different stores mark down on different days - track patterns</li>
                <li>• Suburban stores often have less competition than urban locations</li>
                <li>• Save your favorite stores for quick access</li>
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
                  </div>
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-heading font-semibold mb-3 text-foreground">Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${selectedStore.phone}`} className="text-primary hover:underline">
                          {selectedStore.phone}
                        </a>
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
                        <span>Weekdays: {selectedStore.hours.weekday}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Weekends: {selectedStore.hours.weekend}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hours may adjust seasonally; verify current hours on the Home Depot store locator.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-heading font-semibold mb-3 text-foreground">Penny Hunting Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-accent/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedStore.pennyFrequency}%</div>
                      <div className="text-xs text-muted-foreground mt-1">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-accent/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedStore.avgItemsPerVisit}</div>
                      <div className="text-xs text-muted-foreground mt-1">Avg Items</div>
                    </div>
                    <div className="text-center p-4 bg-accent/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{selectedStore.lastPennyFind}</div>
                      <div className="text-xs text-muted-foreground mt-1">Last Find</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold mb-3 text-foreground">Popular Departments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.departments.map((dept, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        {dept}
                      </span>
                    ))}
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

function StoreCard({ store, isFavorite, onToggleFavorite, onSelect }: {
  store: StoreLocation
  isFavorite: boolean
  onToggleFavorite: () => void
  onSelect: () => void
}) {
  return (
    <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group" onClick={onSelect}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {store.name}
          </h3>
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

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-accent/50 rounded">
          <div className="text-sm font-bold text-foreground">{store.pennyFrequency}%</div>
          <div className="text-xs text-muted-foreground">Success</div>
        </div>
        <div className="text-center p-2 bg-accent/50 rounded">
          <div className="text-sm font-bold text-foreground">{store.avgItemsPerVisit}</div>
          <div className="text-xs text-muted-foreground">Avg Items</div>
        </div>
        <div className="text-center p-2 bg-accent/50 rounded">
          <div className="text-xs font-bold text-foreground">{store.lastPennyFind}</div>
          <div className="text-xs text-muted-foreground">Last Find</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        {store.phone}
      </div>
    </div>
  )
}
