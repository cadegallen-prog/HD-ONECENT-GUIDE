"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
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
  city: string
  state: string
  lat: number
  lng: number
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
              <div className="p-2 space-y-1">
                <h3 className="font-semibold text-sm">{store.name}</h3>
                <p className="text-xs text-muted-foreground">{store.address}</p>
                <p className="text-xs text-muted-foreground">{store.city}, {store.state}</p>
                {store.phone && (
                  <p className="text-xs">
                    <span className="font-medium">Phone:</span> {store.phone}
                  </p>
                )}
                {store.hours && (store.hours.weekday || store.hours.weekend) && (
                  <p className="text-xs">
                    <span className="font-medium">Hours:</span>{" "}
                    {[store.hours.weekday, store.hours.weekend].filter(Boolean).join(" | ")}
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
