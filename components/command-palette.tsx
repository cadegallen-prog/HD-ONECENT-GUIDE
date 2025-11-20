"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, FileText, Map, Clock, Info, HelpCircle, Lightbulb, ShoppingCart, AlertCircle } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Define all pages/sections for quick navigation
const pages = [
  { icon: FileText, label: "What Are Pennies", path: "/what-are-pennies", group: "Learn" },
  { icon: Clock, label: "Clearance Lifecycle", path: "/clearance-lifecycle", group: "Learn" },
  { icon: AlertCircle, label: "Facts vs Myths", path: "/facts-vs-myths", group: "Learn" },
  { icon: FileText, label: "Internal Systems", path: "/internal-systems", group: "Learn" },
  { icon: Search, label: "Digital Pre-Hunt", path: "/digital-pre-hunt", group: "Strategy" },
  { icon: Map, label: "In-Store Strategy", path: "/in-store-strategy", group: "Strategy" },
  { icon: ShoppingCart, label: "Checkout Strategy", path: "/checkout-strategy", group: "Strategy" },
  { icon: Clock, label: "Trip Tracker", path: "/trip-tracker", group: "Tools" },
  { icon: Map, label: "Store Finder", path: "/store-finder", group: "Tools" },
  { icon: FileText, label: "Recent Finds", path: "/recent-finds", group: "Tools" },
  { icon: Lightbulb, label: "Resources", path: "/resources", group: "More" },
  { icon: AlertCircle, label: "Responsible Hunting", path: "/responsible-hunting", group: "More" },
  { icon: HelpCircle, label: "FAQ", path: "/faq", group: "More" },
  { icon: Info, label: "About", path: "/about", group: "More" },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")

  // Group pages by category
  const groupedPages = React.useMemo(() => {
    const groups: Record<string, typeof pages> = {}
    pages.forEach(page => {
      if (!groups[page.group]) groups[page.group] = []
      groups[page.group].push(page)
    })
    return groups
  }, [])

  const handleSelect = (path: string) => {
    onOpenChange(false)
    setSearch("")
    router.push(path)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Command palette */}
      <Command
        className={`fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl z-50 overflow-hidden transition-all ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center border-b border-border px-4">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages... (⌘K)"
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {Object.entries(groupedPages).map(([group, items]) => (
            <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
              {items.map((page) => (
                <Command.Item
                  key={page.path}
                  value={`${page.label} ${page.path}`}
                  onSelect={() => handleSelect(page.path)}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <page.icon className="mr-3 h-4 w-4" />
                  <span>{page.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Press ESC to close</span>
            <span>Navigate with ↑↓</span>
          </div>
        </div>
      </Command>
    </>
  )
}
