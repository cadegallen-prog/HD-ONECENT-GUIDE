"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Clock, BookOpen, User, Moon, Sun, Book, Menu, X } from "lucide-react"
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
        className="text-slate-400 dark:text-slate-500"
      />
      {/* Inner coin detail */}
      <circle
        cx="16"
        cy="16"
        r="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-slate-300 dark:text-slate-600"
      />
      {/* Center "1" for one cent */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        className="text-slate-700 dark:text-slate-300 font-bold"
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
        className="text-slate-500 dark:text-slate-400"
        style={{ fontSize: "8px", fontFamily: "system-ui" }}
        fill="currentColor"
      >
        ¢
      </text>
    </svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && document.documentElement.classList.contains("dark")

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/guide", label: "Guide", icon: Book },
    { href: "/store-finder", label: "Store Finder", icon: Map },
    { href: "/trip-tracker", label: "Trip Tracker", icon: Clock },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/about", label: "About", icon: User },
  ]

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <PennyLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Penny Central
              </span>
            </Link>

            {/* Desktop Navigation */}
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
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
              {!mounted && <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-slate-900 md:hidden">
          <div className="flex flex-col h-full pt-20 px-6">
            {/* Mobile Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                      ${
                        isActive
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Theme Toggle */}
            <div className="mt-8">
              <button
                onClick={() => {
                  setTheme(isDark ? "light" : "dark")
                  setMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mounted && (isDark ? <Sun size={18} /> : <Moon size={18} />)}
                {!mounted && <Moon size={18} />}
                Toggle theme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
