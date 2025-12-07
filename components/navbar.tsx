"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Clock, BookOpen, User, Moon, Sun, Book, Menu, X, Star } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

// Professional Penny Logo component
function PennyLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Outer coin ring */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-brand-copper"
      />
      {/* Inner coin detail */}
      <circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-brand-bronze"
      />
      {/* Center "1" for one cent */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        className="text-zinc-800 dark:text-[var(--text-secondary)] font-bold"
        style={{ fontSize: "14px", fontFamily: "system-ui" }}
        fill="currentColor"
      >
        1
      </text>
      {/* Small cent symbol */}
      <text
        x="23"
        y="12"
        textAnchor="middle"
        className="text-zinc-700 dark:text-zinc-400"
        style={{ fontSize: "10px", fontFamily: "system-ui" }}
        fill="currentColor"
      >
        ¢
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
    { href: "/", label: "Home", icon: Home },
    { href: "/penny-list", label: "Penny List", icon: Star },
    { href: "/report-find", label: "Report Find", icon: BookOpen },
    { href: "/guide", label: "Guide", icon: Book },
    { href: "/store-finder", label: "Store Finder", icon: Map },
    { href: "/trip-tracker", label: "Trip Tracker", icon: Clock },
    { href: "/about", label: "About", icon: User },
  ]

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-zinc-900/90 border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <PennyLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                Penny Central
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
                const isActive = pathname === item.href
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
                const isActive = pathname === item.href
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
