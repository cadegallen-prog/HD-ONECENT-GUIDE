"use client"

import { useEffect, useState } from "react"
import { Map, Clock, Tag } from "lucide-react"
import Link from "next/link"

const sections = [
  { id: "what-are-pennies", title: "What Are Pennies" },
  { id: "clearance-lifecycle", title: "Clearance Lifecycle" },
  { id: "cadence-comparison", title: "Cadence Comparison" },
  { id: "digital-tools", title: "Digital Tools" },
  { id: "in-store-strategies", title: "In-Store Strategies" },
  { id: "checkout", title: "Checkout Procedures" },
  { id: "internal-systems", title: "Internal Systems" },
  { id: "facts-vs-myths", title: "Facts vs Myths" },
  { id: "responsible-hunting", title: "Responsible Hunting" },
  { id: "faq", title: "FAQ" },
]

const tools = [
  { href: "/store-finder", label: "Store Finder", icon: Map },
  { href: "/trip-tracker", label: "Trip Tracker", icon: Clock },
  { href: "/recent-finds", label: "Recent Finds", icon: Tag },
]

interface TableOfContentsProps {
  variant?: "desktop" | "mobile"
}

export function TableOfContents({ variant = "desktop" }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const isMobile = variant === "mobile"

  return (
    <nav aria-label="Guide navigation menu" className={isMobile ? "" : "sticky top-20"}>
      <div className={isMobile ? "space-y-4" : "space-y-6"}>
        {/* Guide Sections */}
        <div>
          <div className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Guide Sections
          </div>
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent ${
                  activeSection === section.id
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Community Tools */}
        <div>
          <div className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Tools
          </div>
          <div className={isMobile ? "flex flex-wrap gap-2" : "space-y-1"}>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={
                  isMobile
                    ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-surface border border-border rounded-md hover:bg-accent transition-colors"
                    : "flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                }
              >
                <tool.icon className="h-4 w-4" />
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
