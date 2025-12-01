"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, Popup } from "react-leaflet"
import type { Marker as LeafletMarker } from "leaflet"
import "leaflet/dist/leaflet.css"
import { getStoreTitle, getStoreUrl, formatStoreHours } from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"

interface StoreMapProps {
  stores: StoreLocation[]
  center?: [number, number]
  zoom?: number
  selectedStore?: StoreLocation | null
  onSelect?: (store: StoreLocation) => void
  userLocation?: { lat: number; lng: number } | null
}

// Component to handle map view changes
function MapController({ selectedStore }: { selectedStore?: StoreLocation | null }) {
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

export const StoreMap = React.memo(function StoreMap({
  stores,
  center = [39.8283, -98.5795],
  zoom = 10,
  selectedStore,
  onSelect,
  userLocation
}: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false)
  const markersRef = React.useRef<Record<string, LeafletMarker | null>>({})

  const orderedStores = React.useMemo(() => {
    if (selectedStore) {
      const selectedId = selectedStore.id
      const selectedInList = stores.find((store) => store.id === selectedId)
      if (selectedInList) {
        return [...stores.filter((store) => store.id !== selectedId), selectedInList]
      }
    }
    return stores
  }, [stores, selectedStore])

  // Load Leaflet and create icons only on the client after mount to avoid SSR/dynamic import issues
  const { defaultIcon, selectedIcon } = React.useMemo(() => {
    if (typeof window === "undefined") return { defaultIcon: null, selectedIcon: null }
    // `require` is used intentionally here because leaflet expects to be loaded on the client.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet")

    const baseIcon = new L.Icon({
      iconUrl: "data:image/svg+xml," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
          <path fill="#0EA5E9" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
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
          <path fill="#0EA5E9" stroke="#ffffff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32c0-8.8-7.2-16-16-16z"/>
          <circle fill="#ffffff" cx="16" cy="16" r="7"/>
          <circle fill="#0EA5E9" cx="16" cy="16" r="4"/>
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

  React.useEffect(() => {
    if (selectedStore) {
      const marker = markersRef.current[selectedStore.id]
      marker?.openPopup()
    }
  }, [selectedStore])

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
        key="store-finder-map"
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        scrollWheelZoom={true}
      >
        <MapController selectedStore={selectedStore} />
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

        {orderedStores.map((store) => {
          const isSelected = selectedStore?.id === store.id
          return (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={(isSelected ? selectedIcon : defaultIcon) || undefined}
              eventHandlers={{
                click: () => onSelect?.(store)
              }}
              ref={(marker) => {
                if (marker) {
                  markersRef.current[store.id] = marker
                } else {
                  delete markersRef.current[store.id]
                }
              }}
            >
              <Popup className="min-w-[220px]">
                <div className="space-y-1 text-left">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{getStoreTitle(store)}</p>

                  {store.distance !== undefined && (
                    <p className="text-xs font-medium text-primary mb-1">{store.distance.toFixed(1)} miles away</p>
                  )}

                  {(store.hours?.weekday || store.hours?.weekend) && (
                    <div className="space-y-0">
                      {(() => {
                        const formatted = formatStoreHours(store.hours)
                        return (
                          <>
                            <p className="text-xs text-muted-foreground leading-tight">{formatted.weekday}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{formatted.saturday}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{formatted.sunday}</p>
                          </>
                        )
                      })()}
                    </div>
                  )}

                  <div className="pt-1 mt-1 border-t border-border space-y-0">
                    <p className="text-xs text-muted-foreground leading-tight">{store.address}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{store.city}, {store.state} {store.zip}</p>
                  </div>

                  {store.phone && (
                    <a
                      href={`tel:${store.phone}`}
                      className="text-xs text-primary hover:underline block mt-1"
                    >
                      {store.phone}
                    </a>
                  )}

                  <div className="pt-1 mt-1 border-t border-border flex flex-col gap-1">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Get Directions
                    </a>
                    <a
                      href={getStoreUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View Store Page
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
})
