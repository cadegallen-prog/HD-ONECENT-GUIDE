"use client"

import Link from "next/link"

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <Link href="/" className={brandLinkClass}>
              PennyCentral
            </Link>
            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              The complete guide to finding $0.01 items at Home Depot.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/penny-list" className={navLinkClass}>
                  Penny List
                </Link>
              </li>
              <li>
                <Link href="/guide" className={navLinkClass}>
                  Guide
                </Link>
              </li>
              <li>
                <Link href="/store-finder" className={navLinkClass}>
                  Store Finder
                </Link>
              </li>
              <li>
                <Link href="/report-find" className={navLinkClass}>
                  Report a Find
                </Link>
              </li>
              <li>
                <Link href="/faq" className={navLinkClass}>
                  FAQ
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

          {/* Company / Support / Legal */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Company</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className={navLinkClass}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={navLinkClass}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/transparency" className={navLinkClass}>
                    Transparency
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Legal</h3>
              <div className="flex flex-col space-y-2.5">
                <Link href="/privacy-policy" className={navLinkClass}>
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className={navLinkClass}>
                  Terms of Service
                </Link>
                <Link href="/do-not-sell-or-share" className={navLinkClass}>
                  Do Not Sell or Share
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[var(--border-default)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--text-muted)] order-2 sm:order-1">
              © 2026 PennyCentral. Educational use only.
            </p>
            <p className="text-xs text-[var(--text-muted)] order-3 sm:order-2">
              Not affiliated with or endorsed by Home Depot
            </p>
            <div className="flex items-center gap-4 order-1 sm:order-3">
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
