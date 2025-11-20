"use client"

import dynamic from "next/dynamic"
import { Breadcrumb } from "@/components/breadcrumb"
import { StoreLocation } from "@/components/store-map"
import { StoreComparisonTable } from "@/components/store-comparison-table"

// Dynamically import StoreMap to avoid SSR issues with Leaflet
const StoreMap = dynamic(
  () => import("@/components/store-map").then((mod) => ({ default: mod.StoreMap })),
  { ssr: false }
)

// Sample store data - in production this would come from Firebase or an API
const sampleStores: StoreLocation[] = [
  {
    id: "1234",
    name: "Store #1234",
    address: "123 Main St, Atlanta, GA 30301",
    lat: 33.7490,
    lng: -84.3880,
    lastMarkdown: "2 days ago",
    avgItems: 12,
    successRate: 78,
  },
  {
    id: "5678",
    name: "Store #5678",
    address: "456 Oak Ave, Dallas, TX 75201",
    lat: 32.7767,
    lng: -96.7970,
    lastMarkdown: "5 days ago",
    avgItems: 8,
    successRate: 65,
  },
  {
    id: "9012",
    name: "Store #9012",
    address: "789 Pine Rd, Phoenix, AZ 85001",
    lat: 33.4484,
    lng: -112.0740,
    lastMarkdown: "1 day ago",
    avgItems: 15,
    successRate: 82,
  },
]

export default function StoreFinderPage() {
  return (
    <>
      <Breadcrumb />
      <main className="min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Home Depot Store Finder
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find Home Depot stores near you with penny hunting stats and location data.
            </p>

            {/* Interactive Map */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">Store Locations</h2>
              <StoreMap stores={sampleStores} center={[33.7490, -96.7970]} zoom={5} />
            </div>

            {/* Store Comparison Table */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4">Store Comparison</h2>
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <StoreComparisonTable stores={sampleStores} />
              </div>
            </div>

            {/* Info box */}
            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Store data is crowdsourced from the community. Success rates and
                average items are calculated from user submissions over the past 30 days.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
