"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in react-leaflet
if (typeof window !== "undefined") {
  /* eslint-disable */
  const L = require("leaflet")
  /* eslint-enable */
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

export interface StoreLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  lastMarkdown?: string
  avgItems?: number
  successRate?: number
}

interface StoreMapProps {
  stores: StoreLocation[]
  center?: [number, number]
  zoom?: number
}

export function StoreMap({ stores, center = [39.8283, -98.5795], zoom = 4 }: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => (
          <Marker key={store.id} position={[store.lat, store.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{store.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{store.address}</p>
                {store.lastMarkdown && (
                  <p className="text-xs">
                    <span className="font-medium">Last Markdown:</span> {store.lastMarkdown}
                  </p>
                )}
                {store.avgItems && (
                  <p className="text-xs">
                    <span className="font-medium">Avg Items:</span> {store.avgItems}
                  </p>
                )}
                {store.successRate && (
                  <p className="text-xs">
                    <span className="font-medium">Success Rate:</span> {store.successRate}%
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
