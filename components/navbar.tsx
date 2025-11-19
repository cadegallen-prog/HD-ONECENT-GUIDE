"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const navigation = [
  { name: "What Are Pennies", href: "#what-are-pennies" },
  { name: "Clearance Lifecycle", href: "#clearance-lifecycle" },
  { name: "Digital Tools", href: "#digital-tools" },
  { name: "In-Store Strategies", href: "#in-store-strategies" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">¢</span>
          </div>
          <span className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
            HD Penny Guide
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-heading text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right side - Theme toggle only */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-base font-heading text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
