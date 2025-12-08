"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, Popup } from "react-leaflet"
import type { Marker as LeafletMarker } from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  getStoreUrl,
  normalizeDayHours,
  mergeConsecutiveDays,
  cleanStoreName,
  formatStoreNumber,
} from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"
import { Navigation, Info } from "lucide-react"

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

  // Only pan to selected store when it changes and user hasn't manually interacted
  React.useEffect(() => {
    if (selectedStore && selectedStore.id !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedStore.id

      if (userHasInteractedRef.current) return

      // Pan to the store (keep current zoom) without nudging position to avoid unwanted recentering
      map.panTo([selectedStore.lat, selectedStore.lng], {
        animate: true,
        duration: 0.5,
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
  userLocation,
}: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false)
  const markersRef = React.useRef<Record<string, LeafletMarker | null>>({})

  // We do NOT want to re-order stores based on selection for rendering order if it confuses the user,
  // but Leaflet renders in order, so last = top.
  // The user complained about "promoted to #1 spot".
  // If they meant the list, that's handled in page.tsx.
  // If they meant the map marker z-index, that's this logic.
  // I'll keep this logic because selected marker SHOULD be on top visually.
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
          <path fill="#1f2937" stroke="#ffffff" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
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
          <path fill="#1d4ed8" stroke="#ffffff" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32c0-8.8-7.2-16-16-16z"/>
          <circle fill="#ffffff" cx="16" cy="16" r="7"/>
          <circle fill="#1d4ed8" cx="16" cy="16" r="4"/>
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
          const rank = store.rank ?? stores.findIndex((s) => s.id === store.id) + 1
          const dayHours = normalizeDayHours(store.hours)
          const mergedHours = mergeConsecutiveDays(dayHours)

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
                maxWidth={260}
                minWidth={220}
                closeButton={false}
              >
                <div className="text-left p-4 bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-lg shadow-md border border-[var(--border-default)]">
                  <div className="mb-3 pr-8 relative">
                    <h3 className="font-bold text-sm leading-tight">
                      {cleanStoreName(store.name)} #{formatStoreNumber(store.number)}
                    </h3>
                    <div className="absolute -top-1 -right-1 bg-[var(--cta-primary)] text-[var(--cta-text)] text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      #{rank}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mb-3 leading-snug">
                    <p>{store.address}</p>
                    <p>
                      {store.city}, {store.state} {store.zip}
                    </p>
                    {store.phone && <p>{store.phone}</p>}
                  </div>
                  <div className="text-xs text-[var(--text-primary)] mb-4 space-y-0.5">
                    <div className="font-semibold text-[var(--text-secondary)] text-[10px] uppercase tracking-wider mb-1">
                      Hours
                    </div>
                    {mergedHours.isExpanded
                      ? // Show all 7 days for irregular hours
                        (() => {
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
                            <div key={label} className="flex justify-between">
                              <span className="w-8">{label}</span>
                              <span className="flex-1 text-right">{dayValues[index]}</span>
                            </div>
                          ))
                        })()
                      : // Show merged ranges for standard hours
                        mergedHours.ranges.map((range) => (
                          <div key={range.days} className="flex justify-between gap-2">
                            <span className="font-medium">{range.days}</span>
                            <span className="text-right">{range.hours}</span>
                          </div>
                        ))}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[var(--cta-primary)] text-[var(--cta-text)] text-xs font-medium py-2 rounded hover:bg-[var(--cta-hover)] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </a>
                    <a
                      href={getStoreUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center border border-[var(--border-default)] text-xs font-medium py-2 rounded hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Info className="w-3 h-3" />
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
