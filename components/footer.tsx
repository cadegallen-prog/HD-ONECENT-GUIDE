import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-stone-900 dark:bg-[--bg-page] border-t border-stone-800 dark:border-stone-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold text-stone-50 hover:text-white transition-colors"
            >
              Penny Central
            </Link>
            <p className="mt-3 text-sm text-stone-400">
              The complete guide to finding $0.01 items at Home Depot.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/store-finder"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Store Finder
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/homedepotonecent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-stone-200 mb-4">Support the Site</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://paypal.me/cadegallen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  ☕ Leave a Tip
                </a>
              </li>
              <li>
                <a
                  href="/go/befrugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  💰 BeFrugal Cashback
                </a>
              </li>
              <li>
                <Link
                  href="/cashback"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  How Cashback Works
                </Link>
              </li>
              <li>
                <Link
                  href="/about#support"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  About Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-stone-200 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <span className="text-sm text-stone-400">Not affiliated with Home Depot</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-stone-800 dark:border-stone-900">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">© 2025 Penny Central. Educational use only.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/groups/homedepotonecent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-200 transition-colors"
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
