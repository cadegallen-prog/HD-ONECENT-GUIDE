"use client"

import * as React from "react"
import { Plus, Tag, Map, Clock, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function QuickActionsButton() {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  const actions = [
    {
      icon: Tag,
      label: "Submit Find",
      description: "Share your penny find",
      action: () => router.push("/recent-finds"),
    },
    {
      icon: Map,
      label: "Find Stores",
      description: "Locate nearby stores",
      action: () => router.push("/store-finder"),
    },
    {
      icon: Clock,
      label: "Track Trip",
      description: "Plan your hunt",
      action: () => router.push("/trip-tracker"),
    },
  ]

  const handleAction = (actionFn: () => void) => {
    setIsOpen(false)
    actionFn()
  }

  return (
    <>
      {/* Action menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 bg-background border border-border rounded-lg shadow-2xl p-2 min-w-[240px]">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
            >
              <action.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main button */}
      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-8 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
        <span className="sr-only">Quick actions</span>
      </Button>

      {/* Backdrop when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
