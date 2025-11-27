"use client"

import { useEffect, useState } from "react"
import { Map, Clock } from "lucide-react"
import Link from "next/link"

const sections = [
  { id: "introduction", title: "I. Introduction: What Are Penny Items?" },
  { id: "clearance-lifecycle", title: "II. Understanding the Clearance Lifecycle" },
  { id: "digital-tools", title: "III. Pre-Hunt Intelligence: Digital Tools" },
  { id: "in-store-hunting", title: "IV. In-Store Penny Hunting Strategies" },
  { id: "checkout", title: "V. The Checkout Challenge" },
  { id: "internal-operations", title: "VI. The Inside Scoop: Internal Operations" },
  { id: "fact-vs-fiction", title: "VII. Research Deep Dive: Fact vs Fiction" },
  { id: "responsible-hunting", title: "VIII. Responsible Penny Hunting" },
  { id: "conclusion", title: "IX. Conclusion: Tips for Success" },
]

const tools = [
  { href: "/store-finder", label: "Store Finder", icon: Map },
  { href: "/trip-tracker", label: "Trip Tracker", icon: Clock },
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
