"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, CircleMarker, useMap, Popup } from "react-leaflet"
import type { Marker as LeafletMarker, DivIcon } from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  getStoreUrl,
  normalizeDayHours,
  mergeConsecutiveDays,
  formatStoreNumber,
} from "@/lib/stores"
import type { StoreLocation } from "@/lib/stores"
import { Navigation, Info } from "lucide-react"
import "./store-map.css"
import { trackEvent } from "@/lib/analytics"
import { useTheme } from "@/components/theme-provider"

const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Use standard OpenStreetMap tiles for consistent, recognizable map style
const TILE_CONFIG = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: TILE_ATTRIBUTION,
}

interface StoreMapProps {
  stores: StoreLocation[]
  center?: [number, number]
  zoom?: number
  selectedStore?: StoreLocation | null
  onSelect?: (store: StoreLocation) => void
  userLocation?: { lat: number; lng: number } | null
  followMode?: "follow" | "explore"
  onExploreMode?: () => void
  recenterRequestToken?: number
}

// Component to handle map view changes and ensure proper initialization
function MapController({
  center,
  selectedStore,
  followMode,
  onExploreMode,
  recenterRequestToken,
}: {
  center: [number, number]
  selectedStore?: StoreLocation | null
  followMode: "follow" | "explore"
  onExploreMode?: () => void
  recenterRequestToken: number
}) {
  const map = useMap()
  const lastSelectedIdRef = React.useRef<string | null>(null)
  const lastRecenterTokenRef = React.useRef<number>(0)
  const hasInvalidatedRef = React.useRef(false)
  const programmaticMoveRef = React.useRef(false)
  const pendingUserInteractionRef = React.useRef(false)
  const pendingUserInteractionTimeoutRef = React.useRef<number | null>(null)
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
    const container = map.getContainer()

    const markPendingUserInteraction = () => {
      pendingUserInteractionRef.current = true
      if (pendingUserInteractionTimeoutRef.current !== null) {
        window.clearTimeout(pendingUserInteractionTimeoutRef.current)
      }
      pendingUserInteractionTimeoutRef.current = window.setTimeout(() => {
        pendingUserInteractionRef.current = false
        pendingUserInteractionTimeoutRef.current = null
      }, 1200)
    }

    const resetProgrammaticMove = () => {
      programmaticMoveRef.current = false
      pendingUserInteractionRef.current = false
      if (pendingUserInteractionTimeoutRef.current !== null) {
        window.clearTimeout(pendingUserInteractionTimeoutRef.current)
        pendingUserInteractionTimeoutRef.current = null
      }
    }

    const onDragStart = () => {
      if (programmaticMoveRef.current || !pendingUserInteractionRef.current) return
      onExploreMode?.()
      if (!panTrackedRef.current) {
        panTrackedRef.current = true
        trackEvent("map_interact", { action: "pan" })
      }
    }
    const onZoomStart = () => {
      if (programmaticMoveRef.current || !pendingUserInteractionRef.current) return
      onExploreMode?.()
      if (!zoomTrackedRef.current) {
        zoomTrackedRef.current = true
        trackEvent("map_interact", { action: "zoom" })
      }
    }

    container.addEventListener("pointerdown", markPendingUserInteraction, { passive: true })
    container.addEventListener("touchstart", markPendingUserInteraction, { passive: true })
    container.addEventListener("wheel", markPendingUserInteraction, { passive: true })
    map.on("dragstart", onDragStart)
    map.on("zoomstart", onZoomStart)
    map.on("moveend", resetProgrammaticMove)
    map.on("zoomend", resetProgrammaticMove)

    return () => {
      container.removeEventListener("pointerdown", markPendingUserInteraction)
      container.removeEventListener("touchstart", markPendingUserInteraction)
      container.removeEventListener("wheel", markPendingUserInteraction)
      map.off("dragstart", onDragStart)
      map.off("zoomstart", onZoomStart)
      map.off("moveend", resetProgrammaticMove)
      map.off("zoomend", resetProgrammaticMove)
      if (pendingUserInteractionTimeoutRef.current !== null) {
        window.clearTimeout(pendingUserInteractionTimeoutRef.current)
        pendingUserInteractionTimeoutRef.current = null
      }
    }
  }, [map, onExploreMode])

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

  // Pan once to newly selected stores only while in follow mode
  React.useEffect(() => {
    if (followMode !== "follow") return
    if (selectedStore && selectedStore.id !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedStore.id

      // Pan to the store (keep current zoom) without nudging position to avoid unwanted recentering
      programmaticMoveRef.current = true
      map.panTo([selectedStore.lat, selectedStore.lng], {
        animate: true,
        duration: 0.5,
      })
    }
  }, [followMode, map, selectedStore])

  // Explicit recenter requests (button tap / search / locate) should always be honored
  React.useEffect(() => {
    if (recenterRequestToken <= 0 || recenterRequestToken === lastRecenterTokenRef.current) return

    lastRecenterTokenRef.current = recenterRequestToken
    programmaticMoveRef.current = true
    map.setView(center, map.getZoom(), { animate: true })
  }, [center, map, recenterRequestToken])

  return null
}

export const StoreMap = React.memo(function StoreMap({
  stores,
  center = [39.8283, -98.5795],
  zoom = 10,
  selectedStore,
  onSelect,
  userLocation,
  followMode = "follow",
  onExploreMode,
  recenterRequestToken = 0,
}: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false)
  const { theme } = useTheme()
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [isMobileViewport, setIsMobileViewport] = React.useState(false)
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
      label,
    }: {
      className: string
      size: [number, number]
      anchor: [number, number]
      popupAnchor: [number, number]
      variant: "default" | "selected"
      label?: string
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
          ${
            label
              ? `<text x="16" y="16" text-anchor="middle" dominant-baseline="middle" font-size="15" font-weight="900" fill="var(--bg-page)" stroke="var(--map-marker-outline)" stroke-width="4" paint-order="stroke">${label}</text>`
              : ""
          }
        </svg>
      `
          : `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="${size[0]}" height="${size[1]}" style="display: block; width: 100%; height: 100%;">
          <path fill="var(--map-marker-default)" stroke="var(--map-marker-outline)" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
          <circle fill="var(--map-marker-core)" cx="12" cy="12" r="5"/>
          ${
            label
              ? `<text x="12" y="12" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="900" fill="var(--bg-page)" stroke="var(--map-marker-outline)" stroke-width="4" paint-order="stroke">${label}</text>`
              : ""
          }
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
        size: [30, 44],
        anchor: [15, 44],
        popupAnchor: [0, -44],
        variant: "default",
      }),
      selectedIcon: buildMarkerIcon({
        className: "map-marker-selected",
        size: [40, 58],
        anchor: [20, 58],
        popupAnchor: [0, -58],
        variant: "selected",
      }),
    }),
    [buildMarkerIcon]
  )

  const markerIconCacheRef = React.useRef<Record<string, DivIcon | null>>({})

  const getMarkerIcon = React.useCallback(
    (variant: "default" | "selected", rank?: number) => {
      // Rank is 1-based within the displayed result set (usually 1–20)
      const label =
        typeof rank === "number" && Number.isFinite(rank) && rank > 0 && rank <= 99
          ? String(rank)
          : undefined

      if (!label) {
        return variant === "selected" ? selectedIcon : defaultIcon
      }

      const key = `${variant}-${label}`
      const cached = markerIconCacheRef.current[key]
      if (cached) return cached

      const icon =
        variant === "selected"
          ? buildMarkerIcon({
              className: "map-marker-selected",
              size: [40, 58],
              anchor: [20, 58],
              popupAnchor: [0, -58],
              variant: "selected",
              label,
            })
          : buildMarkerIcon({
              className: "map-marker-default",
              size: [30, 44],
              anchor: [15, 44],
              popupAnchor: [0, -44],
              variant: "default",
              label,
            })

      markerIconCacheRef.current[key] = icon
      return icon
    },
    [buildMarkerIcon, defaultIcon, selectedIcon]
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
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches
      const mobileViewport = viewportWidth < 1024 || coarsePointer
      const safePadding = mobileViewport ? 32 : 48
      const availableWidth = Math.max(viewportWidth - safePadding, 220)

      const minWidth = mobileViewport
        ? Math.min(220, availableWidth)
        : Math.min(250, availableWidth)
      const maxWidth = mobileViewport
        ? Math.min(240, availableWidth)
        : Math.min(290, availableWidth)

      setIsMobileViewport(mobileViewport)
      setPopupWidth({ minWidth, maxWidth })
    }

    calculatePopupWidth()
    window.addEventListener("resize", calculatePopupWidth)

    return () => window.removeEventListener("resize", calculatePopupWidth)
  }, [])

  // Using standard OSM tiles for all themes
  const tileConfig = TILE_CONFIG

  React.useEffect(() => {
    if (selectedStore) {
      const marker = markersRef.current[selectedStore.id]
      if (isMobileViewport) {
        marker?.closePopup()
      } else {
        marker?.openPopup()
      }
    }
  }, [isMobileViewport, selectedStore])

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
        <MapController
          center={center}
          selectedStore={selectedStore}
          followMode={followMode}
          onExploreMode={onExploreMode}
          recenterRequestToken={recenterRequestToken}
        />
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
              icon={
                (getMarkerIcon(isSelected ? "selected" : "default", rank) as DivIcon | null) ||
                undefined
              }
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
              {!isMobileViewport ? (
                <Popup
                  className="store-popup"
                  autoPan={true}
                  autoPanPadding={[32, 72]}
                  keepInView={true}
                  maxWidth={popupWidth.maxWidth}
                  minWidth={popupWidth.minWidth}
                  closeButton={false}
                >
                  <div className="store-popup-card">
                    <div className="store-popup-header">
                      <div className="store-popup-heading">
                        <h3 className="store-popup-title">
                          {store.name}
                          {store.number ? (
                            <span className="store-popup-store-number">
                              #{formatStoreNumber(store.number)}
                            </span>
                          ) : null}
                        </h3>
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
                        rel="nofollow sponsored noopener noreferrer"
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
              ) : null}
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
})
