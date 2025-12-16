"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, BookOpen, User, Moon, Sun, Book, Menu, X, Users, BadgeCheck } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

// Penny logo - Simple coin with "1¢"
function PennyLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--cta-primary)" className="opacity-90" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="var(--cta-text)"
      >
        1¢
      </text>
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && document.documentElement.classList.contains("dark")

  const navItems = [
    { href: "/verified-pennies", label: "Curated", icon: BadgeCheck },
    { href: "/penny-list", label: "Penny List", icon: Users },
    { href: "/report-find", label: "Report", icon: BookOpen },
    { href: "/store-finder", label: "Stores", icon: Map },
    { href: "/guide", label: "Guide", icon: Book },
    { href: "/about", label: "About", icon: User },
  ]

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--bg-page)] border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <PennyLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                PennyCentral
              </span>
            </Link>

            {/* Desktop Navigation - Unified hover/active states
                Interaction design:
                - Only the nav link itself reacts on hover, not parent
                - Active page: solid CTA background for clear distinction  
                - Hover: subtle bg change + text darkening, 150ms transition
                - Consistent across all items including About */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = mounted ? pathname === item.href : false
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)]"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
              {!mounted && <Moon size={20} />}
            </button>

            {/* Mobile Menu Button - 44px touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] transition-colors active:bg-[var(--bg-elevated)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay 
          MOBILE OPTIMIZATIONS:
          - 48px min-height touch targets for all nav items
          - Increased spacing between items (space-y-1 + larger padding)
          - Active states work on touch (active:)
          - Slide-in animation using motion tokens from globals.css
      */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg-page)] md:hidden mobile-menu-animate">
          <div className="flex flex-col h-full pt-20 px-4">
            {/* Mobile Navigation Items - 48px touch targets */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = mounted ? pathname === item.href : false
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-lg text-base font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)]"
                      }
                    `}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Theme Toggle - 48px touch target */}
            <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
              <button
                onClick={() => {
                  setTheme(isDark ? "light" : "dark")
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-lg w-full text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)] transition-colors"
              >
                {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
                {!mounted && <Moon size={20} />}
                Toggle theme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
