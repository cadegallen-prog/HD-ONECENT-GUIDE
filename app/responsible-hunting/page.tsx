import { Metadata } from "next"
import Link from "next/link"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Responsible Penny Hunting - Ethics and Best Practices | Penny Central",
  description:
    "Learn ethical penny hunting practices. Community guidelines, store etiquette, and responsible shopping to keep penny hunting sustainable for everyone.",
  keywords: [
    "responsible penny hunting",
    "penny hunting ethics",
    "store etiquette",
    "community guidelines",
    "ethical shopping",
    "penny hunting rules",
  ],
  openGraph: {
    title: "Responsible Penny Hunting - Ethics & Best Practices",
    description: "Learn ethical practices to keep penny hunting sustainable and respectful.",
    images: [ogImageUrl("Responsible Hunting")],
  },
  alternates: {
    canonical: "https://www.pennycentral.com/responsible-hunting",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Responsible Hunting")],
  },
}

export default function ResponsibleHuntingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg-page)]">
      <section className="section-padding px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Community Guidelines
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2">
            Responsible Penny Hunting
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
            Penny hunting only stays fun if we keep it respectful for store employees and other
            shoppers. Use these best practices every trip.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Do</h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li>Be kind to employees — they didn’t set the price.</li>
                <li>Leave shelves organized (don’t trash an aisle to hunt faster).</li>
                <li>Take what you’ll use and leave some for others when possible.</li>
                <li>Report your finds so the community stays accurate and fresh.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Don’t</h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li>Argue if an item won’t ring up — move on and try another store.</li>
                <li>Harass cashiers or managers for overrides.</li>
                <li>Clear entire displays just to resell.</li>
                <li>Share employee-only info or encourage policy violations.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/guide#responsible-hunting"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg"
            >
              Read the full guide section
            </Link>
            <Link
              href="/penny-list"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)]"
            >
              Browse the penny list
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
