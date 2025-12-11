"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

export function Footer() {
  return (
    <footer className="bg-[var(--bg-dark)] dark:bg-[var(--bg-page)] border-t border-[var(--border-dark)] dark:border-[var(--border-default)] mt-auto">
      <div className="container-wide py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold text-white hover:text-zinc-200 transition-colors"
            >
              Penny Central
            </Link>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              The complete guide to finding $0.01 items at Home Depot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/store-finder"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Store Finder
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/homedepotonecent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://paypal.me/cadegallen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
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
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                  onClick={() =>
                    trackEvent("affiliate_click", { surface: "footer", linkId: "befrugal" })
                  }
                >
                  BeFrugal Cashback
                </a>
              </li>
              <li>
                <Link
                  href="/cashback"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cashback Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">About</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <span className="text-sm text-zinc-400 leading-relaxed block">
                  Not affiliated with Home Depot
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[var(--border-dark)] dark:border-[var(--border-default)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400 order-2 sm:order-1">
              © 2025 Penny Central. Educational use only.
            </p>
            <div className="flex items-center gap-4 order-1 sm:order-2">
              <a
                href="https://www.facebook.com/groups/homedepotonecent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors p-2"
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
