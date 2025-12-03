import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Penny Central is free and community-supported.{" "}
            <Link
              href="/about#support"
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Learn how you can help
            </Link>
          </p>
          <div className="flex items-center justify-center gap-3 text-xs">
            <a
              href="https://www.befrugal.com/rs/NJIKJUB/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              💰 BeFrugal
            </a>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ☕ Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
