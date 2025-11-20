"use client"

import Link from "next/link"
import { Download, Menu, Moon, SunMedium, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const navigation = [
  { name: "What Are Pennies", href: "#what-are-pennies" },
  { name: "Clearance", href: "#clearance-lifecycle" },
  { name: "Digital Tools", href: "#pre-hunt-digital-tools" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pdfLink = "/Home-Depot-Penny-Guide.pdf"
  const { theme, setTheme, systemTheme } = useTheme()
  const current = theme === "system" ? systemTheme : theme

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="h-10 w-10 rounded-lg border border-border bg-[hsl(var(--surface))] flex items-center justify-center text-xs font-semibold text-foreground">
            HD
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold text-foreground">Home Depot Penny Guide</span>
            <span className="text-xs text-muted-foreground">Home Depot One Cent Items · 32,000 members</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground no-underline"
            >
              {item.name}
            </a>
          ))}
          <Button variant="primary" size="sm" href={pdfLink} aria-label="Download PDF reference">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </span>
          </Button>
          <button
            className="p-2 rounded-md border border-border hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(current === "dark" ? "light" : "dark")}
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
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-muted-foreground hover:text-foreground no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button variant="primary" size="sm" className="w-full" href={pdfLink} aria-label="Download PDF reference">
              <span className="flex items-center gap-2 justify-center">
                <Download className="h-4 w-4" />
                Download PDF
              </span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                setTheme(current === "dark" ? "light" : "dark")
                setMobileMenuOpen(false)
              }}
            >
              <span className="flex items-center gap-2 justify-center">
                {current === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {current === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
