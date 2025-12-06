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

// Component to handle map view changes and ensure proper initialization
function MapController({ selectedStore }: { selectedStore?: StoreLocation | null }) {
  const map = useMap()
  const lastSelectedIdRef = React.useRef<string | null>(null)
  const hasInvalidatedRef = React.useRef(false)
  const userHasInteractedRef = React.useRef(false)

  // Invalidate map size on first mount to ensure tiles load properly
  // Use multiple delays to handle various container rendering timings
  React.useEffect(() => {
    if (!hasInvalidatedRef.current) {
      hasInvalidatedRef.current = true

      // Immediate invalidation for fast renders
      map.invalidateSize()

      // Secondary invalidation after container is fully styled
      const timeout1 = setTimeout(() => {
        map.invalidateSize()
      }, 100)

      // Final invalidation for edge cases with slow layout
      const timeout2 = setTimeout(() => {
        map.invalidateSize()
      }, 300)

      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
      }
    }
  }, [map])

  // Track manual user interactions to disable auto-centering
  React.useEffect(() => {
    const onDragStart = () => {
      userHasInteractedRef.current = true
    }
    const onZoomStart = () => {
      userHasInteractedRef.current = true
    }

    map.on("dragstart", onDragStart)
    map.on("zoomstart", onZoomStart)

    return () => {
      map.off("dragstart", onDragStart)
      map.off("zoomstart", onZoomStart)
    }
  }, [map])

  // Only fly to selected store when it changes and user hasn't manually interacted
  React.useEffect(() => {
    if (selectedStore && selectedStore.id !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedStore.id

      // Re-enable auto-centering on new store selection
      userHasInteractedRef.current = false

      // Ensure correct coordinates are passed and zoom is set to 13
      if (!userHasInteractedRef.current) {
        // Offset the center slightly to make room for the popup (which is above the marker)
        // This is a rough approximation, but helps keep the popup in view
        map.flyTo([selectedStore.lat + 0.005, selectedStore.lng], 13, {
          duration: 0.5,
        })
      }
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
  userLocation,
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

    const baseIcon = new L.DivIcon({
      className: "map-marker-default",
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36" style="display: block; width: 100%; height: 100%;">
          <path fill="#475569" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
          <circle fill="#ffffff" cx="12" cy="12" r="5"/>
        </svg>
      `,
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
    })

    const highlightedIcon = new L.DivIcon({
      className: "map-marker-selected",
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="32" height="48" style="display: block; width: 100%; height: 100%;">
          <ellipse cx="16" cy="46" rx="8" ry="2" fill="rgba(0,0,0,0.3)"/>
          <path fill="#0f172a" stroke="#ffffff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32c0-8.8-7.2-16-16-16z"/>
          <circle fill="#ffffff" cx="16" cy="16" r="7"/>
          <circle fill="#0f172a" cx="16" cy="16" r="4"/>
        </svg>
      `,
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
      <div
        className="w-full h-full min-h-[300px] bg-muted rounded-lg flex items-center justify-center"
        role="status"
        aria-label="Loading map"
      >
        <div className="text-center">
          <div className="animate-pulse w-8 h-8 rounded-full bg-muted-foreground/20 mx-auto mb-2"></div>
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border"
      role="application"
      aria-label="Interactive store map"
    >
      <MapContainer
        key="store-finder-map"
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
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
              weight: 3,
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
                click: () => onSelect?.(store),
              }}
              ref={(marker) => {
                if (marker) {
                  markersRef.current[store.id] = marker
                } else {
                  delete markersRef.current[store.id]
                }
              }}
            >
              <Popup
                className="store-popup"
                autoPan={true}
                autoPanPadding={[50, 50]}
                keepInView={false}
                maxWidth={220}
                minWidth={200}
                closeButton={false}
              >
                <div className="space-y-1.5 text-left p-1">
                  {/* Store name and number */}
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-sm text-foreground leading-tight">
                      {getStoreTitle(store)}
                    </p>
                    {/* Distance badge - only show if meaningful */}
                    {store.distance !== undefined && store.distance > 0.1 && (
                      <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                        {store.distance.toFixed(1)} mi
                      </span>
                    )}
                  </div>

                  {/* Store hours - compact display */}
                  {(store.hours?.weekday || store.hours?.weekend) && (
                    <div className="text-[11px] text-muted-foreground leading-snug">
                      {(() => {
                        const formatted = formatStoreHours(store.hours)
                        return (
                          <div className="space-y-0.5">
                            <p>{formatted.weekday}</p>
                            <p>{formatted.saturday}</p>
                            <p>{formatted.sunday}</p>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {/* Address block */}
                  <div className="pt-1.5 border-t border-border/50">
                    <p className="text-[11px] text-muted-foreground leading-snug">{store.address}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {store.city}, {store.state} {store.zip}
                    </p>
                  </div>

                  {/* Phone link */}
                  {store.phone && (
                    <a
                      href={`tel:${store.phone}`}
                      className="block text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
                    >
                      {store.phone}
                    </a>
                  )}

                  {/* Action links */}
                  <div className="pt-2 flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-primary text-primary-foreground text-[10px] font-medium py-1.5 rounded hover:bg-primary/90 transition-colors"
                    >
                      Directions
                    </a>
                    <a
                      href={getStoreUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-secondary text-secondary-foreground text-[10px] font-medium py-1.5 rounded hover:bg-secondary/80 transition-colors"
                    >
                      Details
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
