"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, CircleMarker, useMap } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"

export interface StoreLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  lat: number
  lng: number
  zip?: string
  number?: string
  distance?: number
  phone?: string
  hours?: {
    weekday?: string
    weekend?: string
  }
}

interface StoreMapProps {
  stores: StoreLocation[]
  center?: [number, number]
  zoom?: number
  selectedStore?: StoreLocation | null
  onSelect?: (store: StoreLocation) => void
  userLocation?: { lat: number; lng: number } | null
}

// Component to handle map view changes
function MapController({ center, selectedStore }: { center: [number, number]; selectedStore?: StoreLocation | null }) {
  const map = useMap()
  const lastSelectedIdRef = React.useRef<string | null>(null)

  // Only fly to selected store when it changes (not on every center change)
  React.useEffect(() => {
    if (selectedStore && selectedStore.id !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedStore.id
      map.flyTo([selectedStore.lat, selectedStore.lng], Math.max(map.getZoom(), 12), {
        duration: 0.5
      })
    }
  }, [selectedStore, map])

  return null
}

export function StoreMap({
  stores,
  center = [39.8283, -98.5795],
  zoom = 10,
  selectedStore,
  onSelect,
  userLocation
}: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false)

  // Load Leaflet and create icons only on the client after mount to avoid SSR/dynamic import issues
  const { defaultIcon, selectedIcon } = React.useMemo(() => {
    if (typeof window === "undefined") return { defaultIcon: null, selectedIcon: null }
    const L = require("leaflet")

    const baseIcon = new L.Icon({
      iconUrl: "data:image/svg+xml," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
          <path fill="#EA5B0C" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
          <circle fill="#ffffff" cx="12" cy="12" r="5"/>
        </svg>
      `),
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
    })

    const highlightedIcon = new L.Icon({
      iconUrl: "data:image/svg+xml," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48">
          <ellipse cx="16" cy="46" rx="8" ry="2" fill="rgba(0,0,0,0.3)"/>
          <path fill="#EA5B0C" stroke="#ffffff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32c0-8.8-7.2-16-16-16z"/>
          <circle fill="#ffffff" cx="16" cy="16" r="7"/>
          <circle fill="#EA5B0C" cx="16" cy="16" r="4"/>
        </svg>
      `),
      iconSize: [32, 48],
      iconAnchor: [16, 48],
      popupAnchor: [0, -48],
    })

    return { defaultIcon: baseIcon, selectedIcon: highlightedIcon }
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        scrollWheelZoom={true}
      >
        <MapController center={center} selectedStore={selectedStore} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location indicator */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={10}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.6,
              weight: 3
            }}
          />
        )}

        {/* Store markers - render non-selected first, selected last so it appears on top */}
        {stores
          .filter(store => store.id !== selectedStore?.id)
          .map((store) => (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={defaultIcon || undefined}
              eventHandlers={{
                click: () => onSelect?.(store)
              }}
            />
          ))}

        {/* Selected store marker - rendered last to appear on top */}
        {selectedStore && (
          <Marker
            key={`selected-${selectedStore.id}`}
            position={[selectedStore.lat, selectedStore.lng]}
            icon={selectedIcon || undefined}
            eventHandlers={{
              click: () => onSelect?.(selectedStore)
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
