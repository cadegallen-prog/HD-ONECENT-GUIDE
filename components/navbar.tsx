"use client"

import Link from "next/link"
import { Download, Menu, Moon, SunMedium, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

const navigation = [
  { name: "What Are Pennies", href: "#what-are-pennies" },
  { name: "Clearance Lifecycle", href: "#clearance-lifecycle" },
  { name: "Digital Tools", href: "#digital-tools" },
  { name: "In-Store Strategies", href: "#in-store-strategies" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pdfLink = "/Home-Depot-Penny-Guide.pdf"
  const { theme, setTheme, systemTheme } = useTheme()
  const current = theme === "system" ? systemTheme : theme

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

        {/* Right side - PDF Download & Theme toggle */}
        <div className="flex items-center gap-3">
          {/* PDF Download - Desktop only */}
          <a
            href="/Home-Depot-Penny-Guide.pdf"
            download="Home-Depot-Penny-Guide.pdf"
            target="_blank"
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-heading font-medium text-sm shadow-sm hover:shadow-md"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </a>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {current === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <button
          className="lg:hidden p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* PDF Download in mobile menu */}
            <a
              href="/Home-Depot-Penny-Guide.pdf"
              download="Home-Depot-Penny-Guide.pdf"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-heading font-medium text-sm shadow-sm mb-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Download className="h-4 w-4" />
              <span>Download PDF Guide</span>
            </a>

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
