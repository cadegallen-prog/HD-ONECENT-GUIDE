"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Map, Clock, Search, Users } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCommandPalette } from "@/components/command-palette-provider"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setOpen } = useCommandPalette()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav aria-label="Main navigation" className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">¢</span>
            </div>
            <span className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
              Penny Central
            </span>
          </Link>

          {/* Right side - Desktop nav, Search, Theme toggle & Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6 mr-2 text-sm text-muted-foreground">
              <Link href="/store-finder" className="hover:text-primary transition-colors">
                Store Finder
              </Link>
              <Link href="/trip-tracker" className="hover:text-primary transition-colors">
                Trip Tracker
              </Link>
              <Link href="/resources" className="hover:text-primary transition-colors">
                Resources
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
            </div>

            {/* Join Community CTA - desktop only */}
            <Button
              href="https://www.facebook.com/groups/homedepotpenny"
              size="sm"
              className="hidden md:inline-flex gap-1.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Users className="h-3.5 w-3.5" />
              Join Community
            </Button>

            {/* Search / Command Palette trigger - desktop only */}
            <button
              onClick={() => setOpen(true)}
              className="hidden md:flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-md"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Search</span>
            </button>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-background border-b border-border z-40 p-4">
          <nav className="space-y-2">
            <Link
              href="/store-finder"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Map className="h-4 w-4" /> Store Finder
            </Link>
            <Link
              href="/trip-tracker"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Clock className="h-4 w-4" /> Trip Tracker
            </Link>
            <Link
              href="/resources"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            {/* Join Community CTA - mobile */}
            <div className="pt-2 mt-2 border-t border-border">
              <Button
                href="https://www.facebook.com/groups/homedepotpenny"
                size="sm"
                className="w-full gap-2"
                onClick={() => setMobileMenuOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Users className="h-4 w-4" />
                Join Community
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
