"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

export function Footer() {
  const brandLinkClass =
    "text-lg font-bold text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors no-underline hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] focus-visible:outline-offset-2"
  const navLinkClass =
    "text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] focus-visible:outline-offset-2"
  const iconLinkClass =
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 no-underline hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-[var(--cta-primary)] focus-visible:outline-offset-2"

  return (
    <footer className="bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)] border-t border-[var(--border-default)] mt-auto">
      <div className="container-wide py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className={brandLinkClass}>
              PennyCentral
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              The complete guide to finding $0.01 items at Home Depot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/penny-list" className={navLinkClass}>
                  Community Penny List
                </Link>
              </li>
              <li>
                <Link href="/report-find" className={navLinkClass}>
                  Report a Find
                </Link>
              </li>
              <li>
                <Link href="/store-finder" className={navLinkClass}>
                  Store Finder
                </Link>
              </li>
              <li>
                <Link href="/guide" className={navLinkClass}>
                  Guide
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/homedepotonecent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLinkClass}
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://paypal.me/cadegallen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLinkClass}
                  onClick={() => trackEvent("coffee_click", { surface: "footer" })}
                >
                  Buy Me a Coffee
                </a>
              </li>
              <li>
                <a
                  href="/go/befrugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLinkClass}
                  onClick={() =>
                    trackEvent("affiliate_click", { surface: "footer", linkId: "befrugal" })
                  }
                >
                  BeFrugal Cashback
                </a>
              </li>
              <li>
                <Link href="/cashback" className={navLinkClass}>
                  Cashback Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">About</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className={navLinkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={navLinkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed block">
                  Not affiliated with Home Depot
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[var(--border-default)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--text-muted)] order-2 sm:order-1">
              © 2025 Penny Central. Educational use only.
            </p>
            <div className="flex items-center gap-4 order-1 sm:order-2">
              <a
                href="https://www.facebook.com/groups/homedepotonecent"
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label="Facebook Group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
