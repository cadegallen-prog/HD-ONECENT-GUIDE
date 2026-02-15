"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Map,
  User,
  Moon,
  Sun,
  Book,
  Menu,
  X,
  List,
  PlusCircle,
  Heart,
  ChevronDown,
  CircleHelp,
  Mail,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { trackEvent } from "@/lib/analytics"

const guideSectionLinks = [
  {
    step: 1,
    href: "/what-are-pennies",
    label: "What Are Penny Items",
    description: "Start here: definitions, lifecycle basics, and realistic expectations.",
  },
  {
    step: 2,
    href: "/clearance-lifecycle",
    label: "Clearance Lifecycle",
    description: "How markdown timing works and which price signals are trustworthy.",
  },
  {
    step: 3,
    href: "/digital-pre-hunt",
    label: "Digital Pre-Hunt",
    description: "Build a stronger shortlist before you leave home.",
  },
  {
    step: 4,
    href: "/in-store-strategy",
    label: "In-Store Strategy",
    description: "In-store execution, verification flow, and checkout decisions.",
  },
  {
    step: 5,
    href: "/inside-scoop",
    label: "Inside Scoop",
    description: "Store-side context and why outcomes vary by location.",
  },
  {
    step: 6,
    href: "/facts-vs-myths",
    label: "Facts vs. Myths",
    description: "Final pass: filter rumors and keep only proven patterns.",
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileGuideExpanded, setMobileGuideExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && document.documentElement.classList.contains("dark")
  const isGuideRoute = mounted
    ? pathname === "/guide" ||
      pathname.startsWith("/guide/") ||
      guideSectionLinks.some((item) => pathname === item.href)
    : false

  const navItems = [
    { href: "/penny-list", label: "Penny List", icon: List },
    { href: "/lists", label: "My List", icon: Heart },
    { href: "/report-find", label: "Report a Find", icon: PlusCircle },
    { href: "/guide", label: "Guide", icon: Book, hasDropdown: true },
    { href: "/faq", label: "FAQ", icon: CircleHelp },
    { href: "/store-finder", label: "Store Finder", icon: Map },
    { href: "/about", label: "About", icon: User },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  function closeMobileMenu() {
    setMobileMenuOpen(false)
    setMobileGuideExpanded(false)
  }

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--bg-page)] border-b border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group">
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-secondary)]">
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
                const isActive = mounted
                  ? item.href === "/lists"
                    ? pathname === "/lists" || pathname.startsWith("/lists/")
                    : item.href === "/guide"
                      ? isGuideRoute
                      : pathname === item.href
                  : false

                if (item.hasDropdown) {
                  return (
                    <div key={item.href} className="relative group">
                      <Link
                        href={item.href}
                        className={`
                          inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                          ${
                            isActive
                              ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)]"
                          }
                        `}
                      >
                        {item.label}
                        <ChevronDown size={14} strokeWidth={2} className="mt-[1px]" />
                      </Link>

                      <div className="pointer-events-none invisible absolute left-0 top-full z-50 w-[22rem] pt-2 opacity-0 translate-y-1 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-2 shadow-[var(--shadow-card)]">
                          <Link
                            href="/guide"
                            className="block rounded-md px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                          >
                            Complete Guide Hub
                          </Link>
                          <p className="px-3 pb-1 pt-0.5 text-xs text-[var(--text-muted)]">
                            Suggested read order: Step 1 through Step 6
                          </p>
                          <div className="my-1 border-t border-[var(--border-default)]" />
                          {guideSectionLinks.map((section) => {
                            const sectionActive = mounted ? pathname === section.href : false
                            return (
                              <Link
                                key={section.href}
                                href={section.href}
                                className={`block rounded-md px-3 py-2 transition-colors ${
                                  sectionActive
                                    ? "bg-[var(--bg-elevated)]"
                                    : "hover:bg-[var(--bg-elevated)]"
                                }`}
                              >
                                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-[var(--text-muted)]">
                                  Step {section.step}
                                </p>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                  {section.label}
                                </p>
                                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                  {section.description}
                                </p>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (item.href === "/report-find") {
                        trackEvent("report_find_click", { ui_source: "nav-desktop" })
                      }
                    }}
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
                const isActive = mounted
                  ? item.href === "/lists"
                    ? pathname === "/lists" || pathname.startsWith("/lists/")
                    : item.href === "/guide"
                      ? isGuideRoute
                      : pathname === item.href
                  : false

                if (item.hasDropdown) {
                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        onClick={() => setMobileGuideExpanded((prev) => !prev)}
                        aria-expanded={mobileGuideExpanded}
                        aria-controls="mobile-guide-sections"
                        className={`
                          flex w-full items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-lg text-base font-medium transition-all duration-150
                          ${
                            isActive
                              ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)]"
                          }
                        `}
                      >
                        <Icon size={20} strokeWidth={1.5} />
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          className={`ml-auto transition-transform ${
                            mobileGuideExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {mobileGuideExpanded && (
                        <div
                          id="mobile-guide-sections"
                          className="ml-10 mt-1 mb-2 space-y-1 border-l border-[var(--border-default)] pl-3"
                        >
                          <Link
                            href="/guide"
                            onClick={closeMobileMenu}
                            className="flex min-h-[44px] items-center rounded-md px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                          >
                            Start Here: Guide Hub
                          </Link>
                          {guideSectionLinks.map((section) => {
                            const sectionActive = mounted ? pathname === section.href : false
                            return (
                              <Link
                                key={section.href}
                                href={section.href}
                                onClick={closeMobileMenu}
                                className={`
                                  flex min-h-[44px] flex-col items-start rounded-md px-3 py-2 text-sm transition-colors
                                  ${
                                    sectionActive
                                      ? "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                                  }
                                `}
                              >
                                <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[var(--text-muted)]">
                                  Step {section.step}
                                </span>
                                <span>{section.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (item.href === "/report-find") {
                        trackEvent("report_find_click", { ui_source: "nav-mobile" })
                      }
                      closeMobileMenu()
                    }}
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
                  closeMobileMenu()
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
