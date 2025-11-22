"use client"

import { ChevronDown, ExternalLink } from "lucide-react"

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

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToSections}
                className="text-primary hover:text-primary/80 font-heading font-medium flex items-center gap-1 transition-colors"
              >
                Browse Sections
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href="https://www.facebook.com/groups/homedepotonecent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground font-heading text-sm flex items-center gap-1 transition-colors"
              >
                Join the Facebook Group
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Muted reference image */}
          <div className="hidden md:block">
            <div className="bg-surface border border-border rounded-lg p-6 aspect-square flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-6xl font-mono font-bold mb-2">$0.01</div>
                <div className="text-sm font-heading">PLACEHOLDER_HERO_IMAGE</div>
                <div className="text-xs mt-2">hero-clearance-tag-mockup.png</div>
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
