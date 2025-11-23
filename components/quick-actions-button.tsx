"use client"

import * as React from "react"
import { Plus, Map, Clock, X, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function QuickActionsButton() {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  const actions = [
    {
      icon: Download,
      label: "Download PDF",
      description: "Get the complete guide",
      action: () => {
        const link = document.createElement('a')
        link.href = '/Home-Depot-Penny-Guide.pdf'
        link.download = 'Home-Depot-Penny-Guide.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
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
        <div className="fixed bottom-24 right-4 md:right-8 z-50 bg-card/95 backdrop-blur-sm border-2 border-border rounded-xl shadow-2xl p-2 min-w-[260px] animate-in slide-in-from-bottom-4 duration-200">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
              aria-label={action.label}
              className="w-full flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:scale-[1.02] active:scale-95 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            >
              <action.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{action.label}</div>
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
        className="fixed bottom-6 right-4 md:right-8 z-50 h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-200 ring-2 ring-primary/10 hover:ring-primary/30 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <Plus className="h-6 w-6 transition-transform duration-200" />
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
