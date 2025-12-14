"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, Popup } from "react-leaflet"
import type { Marker as LeafletMarker, DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { getStoreUrl, normalizeDayHours, mergeConsecutiveDays, getStoreTitle } from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"
import { Navigation, Info } from "lucide-react"
import "./store-map.css"
import { trackEvent } from "@/lib/analytics"
import { useTheme } from "@/components/theme-provider"

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

const TILE_CONFIG = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: TILE_ATTRIBUTION,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: TILE_ATTRIBUTION,
  },
}

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
  const panTrackedRef = React.useRef(false)
  const zoomTrackedRef = React.useRef(false)

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
      if (!panTrackedRef.current) {
        panTrackedRef.current = true
        trackEvent("map_interact", { action: "pan" })
      }
    }
    const onZoomStart = () => {
      userHasInteractedRef.current = true
      if (!zoomTrackedRef.current) {
        zoomTrackedRef.current = true
        trackEvent("map_interact", { action: "zoom" })
      }
    }

    map.on("dragstart", onDragStart)
    map.on("zoomstart", onZoomStart)

    return () => {
      map.off("dragstart", onDragStart)
      map.off("zoomstart", onZoomStart)
    }
  }, [map])

  // Ensure scroll-wheel gestures over the popup zoom the map instead of scrolling the page
  React.useEffect(() => {
    const container = map.getContainer()

    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      if (!target.closest(".store-popup")) return

      event.preventDefault()
      event.stopImmediatePropagation()

      if (event.deltaY < 0) {
        map.zoomIn()
      } else if (event.deltaY > 0) {
        map.zoomOut()
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
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
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [popupWidth, setPopupWidth] = React.useState({ minWidth: 260, maxWidth: 260 })
  const markersRef = React.useRef<Record<string, LeafletMarker | null>>({})

  // Keep original store order - do NOT reorder based on selection
  // This prevents confusion with the list order and the rank numbers
  const orderedStores = stores

  // Load Leaflet and create icons only on the client after mount to avoid SSR/dynamic import issues
  const buildMarkerIcon = React.useCallback(
    ({
      className,
      size,
      anchor,
      popupAnchor,
      variant,
    }: {
      className: string
      size: [number, number]
      anchor: [number, number]
      popupAnchor: [number, number]
      variant: "default" | "selected"
    }): DivIcon | null => {
      if (typeof window === "undefined") return null
      // `require` is used intentionally here because leaflet expects to be loaded on the client.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet")

      const html =
        variant === "selected"
          ? `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48" width="${size[0]}" height="${size[1]}" style="display: block; width: 100%; height: 100%;">
          <ellipse cx="16" cy="46" rx="8" ry="2" fill="var(--map-marker-selected)" fill-opacity="0.18"/>
          <path fill="var(--map-marker-selected)" stroke="var(--map-marker-outline)" stroke-width="2" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 32 16 32s16-20 16-32c0-8.8-7.2-16-16-16z"/>
          <circle fill="var(--map-marker-core)" cx="16" cy="16" r="7"/>
          <circle fill="var(--map-marker-selected)" cx="16" cy="16" r="4"/>
        </svg>
      `
          : `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${size[0]}" height="${size[1]}" style="display: block; width: 100%; height: 100%;">
          <path fill="var(--map-marker-default)" stroke="var(--map-marker-outline)" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
          <circle fill="var(--map-marker-core)" cx="12" cy="12" r="5"/>
        </svg>
      `

      return new L.DivIcon({
        className,
        html,
        iconSize: size,
        iconAnchor: anchor,
        popupAnchor,
      })
    },
    []
  )

  const { defaultIcon, selectedIcon } = React.useMemo(
    () => ({
      defaultIcon: buildMarkerIcon({
        className: "map-marker-default",
        size: [24, 36],
        anchor: [12, 36],
        popupAnchor: [0, -36],
        variant: "default",
      }),
      selectedIcon: buildMarkerIcon({
        className: "map-marker-selected",
        size: [32, 48],
        anchor: [16, 48],
        popupAnchor: [0, -48],
        variant: "selected",
      }),
    }),
    [buildMarkerIcon]
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const resolveDark = () => {
      if (typeof window === "undefined") return false
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      return theme === "dark" || (theme === "system" && media.matches)
    }
    setIsDarkMode(resolveDark())

    if (typeof window === "undefined") return undefined
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setIsDarkMode(resolveDark())
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [theme])

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined

    const calculatePopupWidth = () => {
      const viewportWidth = window.innerWidth
      const safePadding = 48
      const availableWidth = Math.max(viewportWidth - safePadding, 220)

      const minWidth = Math.min(260, availableWidth)
      const maxWidth = Math.min(320, availableWidth)

      setPopupWidth({ minWidth, maxWidth })
    }

    calculatePopupWidth()
    window.addEventListener("resize", calculatePopupWidth)

    return () => window.removeEventListener("resize", calculatePopupWidth)
  }, [])

  const tileConfig = React.useMemo(
    () => (isDarkMode ? TILE_CONFIG.dark : TILE_CONFIG.light),
    [isDarkMode]
  )

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
      className={`w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-border bg-[var(--bg-card)] map-shell ${isDarkMode ? "map-shell--dark" : "map-shell--light"}`}
      role="application"
      aria-label="Interactive store map"
    >
      <MapContainer
        key={`store-finder-map-${tileConfig.url}`}
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
        scrollWheelZoom={true}
      >
        <MapController selectedStore={selectedStore} />
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          subdomains={["a", "b", "c"]}
        />

        {/* User location indicator */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={10}
            pathOptions={{
              color: "var(--cta-primary)",
              fillColor: "var(--cta-primary)",
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
                click: () => {
                  trackEvent("map_interact", { action: "marker", markerState: store.state })
                  onSelect?.(store)
                },
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
                maxWidth={popupWidth.maxWidth}
                minWidth={popupWidth.minWidth}
                closeButton={false}
              >
                <div className="store-popup-card">
                  <div className="store-popup-header">
                    <div className="store-popup-heading">
                      <p className="store-popup-label">Store</p>
                      <h3 className="store-popup-title">{getStoreTitle(store)}</h3>
                      <p className="store-popup-subtext">
                        {store.city}, {store.state} {store.zip}
                      </p>
                    </div>
                    <div className="store-popup-rank" aria-label={`Rank ${rank}`}>
                      #{rank}
                    </div>
                  </div>

                  <div className="store-popup-meta">
                    <div>{store.address}</div>
                    <div>
                      {store.city}, {store.state} {store.zip}
                    </div>
                    {store.phone && (
                      <a
                        href={`tel:${store.phone.replace(/[^0-9]/g, "")}`}
                        className="store-popup-phone"
                      >
                        {store.phone}
                      </a>
                    )}
                  </div>

                  <div className="store-popup-section">
                    <div className="store-popup-section-label">Hours</div>
                    <div className="store-popup-hours">
                      {mergedHours.isExpanded
                        ? (() => {
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
                              <div key={label} className="store-popup-hour-row">
                                <span className="store-popup-hour-day">{label}</span>
                                <span className="store-popup-hour-value">{dayValues[index]}</span>
                              </div>
                            ))
                          })()
                        : mergedHours.ranges.map((range) => (
                            <div key={range.days} className="store-popup-hour-row">
                              <span className="store-popup-hour-day">{range.days}</span>
                              <span className="store-popup-hour-value">{range.hours}</span>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="store-popup-actions">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-popup-button store-popup-button-primary"
                      onClick={() =>
                        trackEvent("directions_click", { storeId: store.id, state: store.state })
                      }
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </a>
                    <a
                      href={getStoreUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-popup-button store-popup-button-secondary"
                      onClick={() =>
                        trackEvent("map_interact", { action: "marker", markerState: store.state })
                      }
                    >
                      <Info className="w-4 h-4" />
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
