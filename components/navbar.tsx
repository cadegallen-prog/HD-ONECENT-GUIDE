"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Map,
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
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { trackEvent } from "@/lib/analytics"

const guideHubLink = {
  step: 0,
  href: "/guide",
  label: "Guide Hub",
  description: "Start here for chapter order and the full workflow overview.",
}

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

const orderedGuideLinks = [guideHubLink, ...guideSectionLinks]

export function Navbar() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileGuideExpanded, setMobileGuideExpanded] = useState(false)
  const [desktopGuideOpen, setDesktopGuideOpen] = useState(false)
  const desktopGuideDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setDesktopGuideOpen(false)
  }, [pathname])

  useEffect(() => {
    const closeDesktopGuideOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!desktopGuideDropdownRef.current) return
      if (!(event.target instanceof Node)) return
      if (!desktopGuideDropdownRef.current.contains(event.target)) {
        setDesktopGuideOpen(false)
      }
    }

    const closeDesktopGuideOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopGuideOpen(false)
      }
    }

    document.addEventListener("mousedown", closeDesktopGuideOnOutsideClick)
    document.addEventListener("touchstart", closeDesktopGuideOnOutsideClick)
    document.addEventListener("keydown", closeDesktopGuideOnEscape)
    return () => {
      document.removeEventListener("mousedown", closeDesktopGuideOnOutsideClick)
      document.removeEventListener("touchstart", closeDesktopGuideOnOutsideClick)
      document.removeEventListener("keydown", closeDesktopGuideOnEscape)
    }
  }, [])

  const isDark = mounted && document.documentElement.classList.contains("dark")
  const isGuideRoute = mounted
    ? pathname === "/guide" ||
      pathname.startsWith("/guide/") ||
      guideSectionLinks.some((item) => pathname === item.href)
    : false
  const navItems = [
    { href: "/guide", label: "Guide", icon: Book, hasDropdown: true },
    { href: "/penny-list", label: "Penny List", icon: List },
    { href: "/lists", label: "My List", icon: Heart },
    { href: "/report-find", label: "Report a Find", icon: PlusCircle },
    { href: "/store-finder", label: "Store Finder", icon: Map },
    { href: "/faq", label: "FAQ", icon: CircleHelp },
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
                - Consistent across all primary items */}
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
                    <div key={item.href} className="relative" ref={desktopGuideDropdownRef}>
                      <div className="inline-flex items-center">
                        <Link
                          href={item.href}
                          onClick={() => setDesktopGuideOpen(false)}
                          className={`
                            px-4 py-2 rounded-l-lg text-sm font-medium transition-colors duration-150
                            ${
                              isActive
                                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)]"
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-label="Toggle guide chapters"
                          aria-haspopup="menu"
                          aria-expanded={desktopGuideOpen}
                          aria-controls="desktop-guide-sections"
                          onClick={() => setDesktopGuideOpen((prev) => !prev)}
                          className={`
                            inline-flex items-center px-2 py-2 rounded-r-lg text-sm font-medium transition-colors duration-150
                            ${
                              isActive
                                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)]"
                            }
                          `}
                        >
                          <ChevronDown
                            size={14}
                            strokeWidth={2}
                            className={`mt-[1px] transition-transform ${
                              desktopGuideOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {desktopGuideOpen && (
                        <div
                          id="desktop-guide-sections"
                          className="absolute left-0 top-full z-50 mt-2 w-[22rem] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-2 shadow-[var(--shadow-card)]"
                        >
                          <p className="px-3 pb-1 pt-0.5 text-xs text-[var(--text-muted)]">
                            Read in order: Step 0 through Step 6
                          </p>
                          <div className="my-1 border-t border-[var(--border-default)]" />
                          {orderedGuideLinks.map((section) => {
                            const sectionActive = mounted ? pathname === section.href : false
                            return (
                              <Link
                                key={section.href}
                                href={section.href}
                                onClick={() => setDesktopGuideOpen(false)}
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
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`
                            flex flex-1 items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-lg text-base font-medium transition-all duration-150
                            ${
                              isActive
                                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)]"
                            }
                          `}
                        >
                          <Icon size={20} strokeWidth={1.5} />
                          <span>{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileGuideExpanded((prev) => !prev)}
                          aria-label="Toggle guide chapters"
                          aria-expanded={mobileGuideExpanded}
                          aria-controls="mobile-guide-sections"
                          className={`
                            flex items-center justify-center w-11 min-h-[48px] rounded-lg transition-all duration-150
                            ${
                              isActive || mobileGuideExpanded
                                ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] active:bg-[var(--bg-elevated)]"
                            }
                          `}
                        >
                          <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className={`transition-transform ${
                              mobileGuideExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {mobileGuideExpanded && (
                        <div
                          id="mobile-guide-sections"
                          className="ml-10 mt-1 mb-2 space-y-1 border-l border-[var(--border-default)] pl-3"
                        >
                          {orderedGuideLinks.map((section) => {
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
