"use client"

import * as React from "react"
import { StoreLocation } from "./store-map"
import { MapPin, Phone } from "lucide-react"

interface StoreComparisonTableProps {
  stores: StoreLocation[]
}

export function StoreComparisonTable({ stores }: StoreComparisonTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left p-4 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Store
              </div>
            </th>
            <th className="text-left p-4 font-semibold text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr
              key={store.id}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <td className="p-4">
                <div>
                  <div className="font-medium text-sm">{store.name}</div>
                  <div className="text-xs text-muted-foreground">{store.address}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-muted-foreground">
                  {store.phone || "Phone not listed"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {stores.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No stores found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  )
}
