"use client"

import Link from "next/link"
import { Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav aria-label="Main navigation" className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">¢</span>
          </div>
          <span className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
            HD Penny Guide
          </span>
        </Link>

        {/* Right side - PDF Download & Theme toggle */}
        <div className="flex items-center gap-4">
          {/* Small PDF Download link */}
          <a
            href="/Home-Depot-Penny-Guide.pdf"
            download="Home-Depot-Penny-Guide.pdf"
            target="_blank"
            aria-label="Download PDF guide"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF</span>
          </a>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
