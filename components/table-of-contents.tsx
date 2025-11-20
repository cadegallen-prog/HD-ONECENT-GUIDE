"use client"

import { useEffect, useState } from "react"

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

export function TableOfContents() {
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

  return (
    <nav className="sticky top-20 hidden lg:block">
      <div className="border-l-2 border-border pl-4 space-y-2">
        <div className="text-sm font-heading font-semibold text-foreground mb-4">
          Contents
        </div>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`block text-sm py-1 transition-colors ${
              activeSection === section.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  )
}
