import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="p-6">
        <div className="text-center">
          <p className="text-xs text-text-muted mb-2">
            Penny Central is free and community-supported.{" "}
            <Link href="/about#support" className="text-accent hover:text-accent-hover transition-colors">
              Learn how you can help
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <a
              href="https://www.befrugal.com/rs/NJIKJUB/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              💰 Save money with BeFrugal
            </a>
            <span className="text-text-muted">·</span>
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
