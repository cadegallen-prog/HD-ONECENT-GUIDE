"use client"

import { ChevronDown, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

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
              Penny Central: The Home Depot $0.01 Hunting Guide
            </h1>

            <p className="text-lg md:text-xl mb-8 leading-relaxed text-foreground">
              A comprehensive reference for finding clearance items marked to $0.01 at Home Depot.
              Learn the lifecycle, timing patterns, digital scouting techniques, and in-store strategies
              shared by the "Home Depot One Cent Items" Facebook community.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6">
              <Button
                variant="outline"
                href="/Home_Depot_Penny_Items_Guide.pdf"
                download="Home_Depot_Penny_Items_Guide.pdf"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Guide
              </Button>
              <a
                href="https://www.facebook.com/groups/homedepotonecent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-heading text-sm flex items-center gap-1 transition-colors"
              >
                Join the Facebook Group
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://m.me/cm/AbYH-T88smeOjfsT/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-heading text-sm flex items-center gap-1 transition-colors"
              >
                Join the Messenger Chat
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
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
