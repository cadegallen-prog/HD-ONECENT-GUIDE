"use client"

import { ChevronDown } from "lucide-react"

export function Hero() {
  const scrollToSections = () => {
    const sections = document.getElementById('sections')
    sections?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <div className="grid md:grid-cols-[1fr_300px] gap-8 md:gap-12 items-start">
          {/* Left: Title and intro */}
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6 leading-tight text-foreground">
              Home Depot Penny Items: Complete Guide
            </h1>

            <p className="text-lg md:text-xl mb-8 leading-relaxed text-foreground">
              A comprehensive reference for finding clearance items marked to $0.01 at Home Depot.
              Learn the lifecycle, timing patterns, digital scouting techniques, and in-store strategies
              used by the 32,000-member "Home Depot One Cent Items" community.
            </p>

            {/* Primary action */}
            <button
              onClick={scrollToSections}
              className="text-primary hover:text-primary/80 font-heading font-medium flex items-center gap-1 transition-colors"
            >
              Browse Sections
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Stylized penny price display */}
          <div className="hidden md:block">
            <div className="bg-surface border border-border rounded-lg p-6 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-primary mb-2">$0.01</div>
                <div className="text-sm font-heading text-muted-foreground">The magic price</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="border-b border-border"></div>
    </section>
  )
}
