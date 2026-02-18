"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
  Search,
  FileText,
  Map,
  Clock,
  Info,
  CircleHelp,
  ShoppingCart,
  AlertCircle,
  Users,
  Heart,
  Mail,
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Define all pages/sections for quick navigation
const pages = [
  // Guide Sections
  { icon: FileText, label: "Complete Guide", path: "/guide", group: "Guide" },
  { icon: FileText, label: "What Are Pennies", path: "/what-are-pennies", group: "Guide" },
  { icon: Clock, label: "Clearance Lifecycle", path: "/clearance-lifecycle", group: "Guide" },
  { icon: Search, label: "Digital Pre-Hunt", path: "/digital-pre-hunt", group: "Guide" },
  { icon: Map, label: "In-Store Strategies", path: "/in-store-strategy", group: "Guide" },
  { icon: ShoppingCart, label: "Inside Scoop", path: "/inside-scoop", group: "Guide" },
  { icon: AlertCircle, label: "Facts vs Myths", path: "/facts-vs-myths", group: "Guide" },
  // Tools (actual pages)
  { icon: Users, label: "Penny List", path: "/penny-list", group: "Tools" },
  { icon: FileText, label: "Report a Find", path: "/report-find", group: "Tools" },
  { icon: Heart, label: "My List", path: "/lists", group: "Tools" },
  { icon: Map, label: "Store Finder", path: "/store-finder", group: "Tools" },
  // More
  { icon: CircleHelp, label: "FAQ", path: "/faq", group: "More" },
  { icon: Info, label: "About", path: "/about", group: "More" },
  { icon: Mail, label: "Contact", path: "/contact", group: "More" },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  // Group pages by category
  const groupedPages = React.useMemo(() => {
    const groups: Record<string, typeof pages> = {}
    pages.forEach((page) => {
      if (!groups[page.group]) groups[page.group] = []
      groups[page.group].push(page)
    })
    return groups
  }, [])

  const handleSelect = (path: string) => {
    onOpenChange(false)
    router.push(path)
  }

  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--bg-hover)]/80 z-40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Command palette */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
        <Command label="Quick navigation">
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Command.Input
              placeholder="Search pages... (⌘K)"
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {Object.entries(groupedPages).map(([group, items]) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {items.map((page) => (
                  <Command.Item
                    key={page.path}
                    value={`${page.label} ${page.path}`}
                    onSelect={() => handleSelect(page.path)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground"
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
      </div>
    </>
  )
}
