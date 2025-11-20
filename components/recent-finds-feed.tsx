"use client"

import * as React from "react"
import { Tag, MapPin, Clock, User, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export interface PennyFind {
  id: string
  itemName: string
  storeName: string
  storeLocation: string
  foundAt: string
  submittedBy: string
  originalPrice: string
  category: string
  verified?: boolean
}

interface RecentFindsFeedProps {
  finds?: PennyFind[]
  loading?: boolean
}

// Sample data
const sampleFinds: PennyFind[] = [
  {
    id: "1",
    itemName: "DeWalt Drill Bit Set",
    storeName: "Store #1234",
    storeLocation: "Atlanta, GA",
    foundAt: "2 hours ago",
    submittedBy: "PennyHunter123",
    originalPrice: "$24.99",
    category: "Tools",
    verified: true,
  },
  {
    id: "2",
    itemName: "Garden Hose 50ft",
    storeName: "Store #5678",
    storeLocation: "Dallas, TX",
    foundAt: "4 hours ago",
    submittedBy: "SavingsSeeker",
    originalPrice: "$18.97",
    category: "Garden",
    verified: true,
  },
  {
    id: "3",
    itemName: "LED Light Bulbs (4-pack)",
    storeName: "Store #9012",
    storeLocation: "Phoenix, AZ",
    foundAt: "6 hours ago",
    submittedBy: "DealFinder99",
    originalPrice: "$12.48",
    category: "Electrical",
  },
]

export function RecentFindsFeed({ finds = sampleFinds, loading = false }: RecentFindsFeedProps) {
  const [filter, setFilter] = React.useState<string>("all")

  const handleSubmitFind = () => {
    toast.success("Find submission form opening...")
  }

  const filteredFinds = filter === "all"
    ? finds
    : finds.filter(find => find.category.toLowerCase() === filter.toLowerCase())

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Submit Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Finds
          </Button>
          <Button
            variant={filter === "tools" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("tools")}
          >
            Tools
          </Button>
          <Button
            variant={filter === "garden" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("garden")}
          >
            Garden
          </Button>
          <Button
            variant={filter === "electrical" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("electrical")}
          >
            Electrical
          </Button>
        </div>

        <Button onClick={handleSubmitFind}>
          <Tag className="w-4 h-4 mr-2" />
          Submit Your Find
        </Button>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredFinds.map((find) => (
          <div
            key={find.id}
            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-background"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{find.itemName}</h3>
                  {find.verified && (
                    <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {find.storeName} · {find.storeLocation}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{find.foundAt}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-primary">$0.01</div>
                <div className="text-sm text-muted-foreground line-through">
                  {find.originalPrice}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Submitted by {find.submittedBy}</span>
              </div>

              <span className="text-xs bg-muted px-3 py-1 rounded-full">
                {find.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredFinds.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No finds match your filter. Try selecting a different category.</p>
        </div>
      )}

      {/* Live indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span>Live feed - Updates automatically</span>
      </div>
    </div>
  )
}
