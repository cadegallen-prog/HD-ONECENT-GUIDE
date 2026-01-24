import { Metadata } from "next"
import Link from "next/link"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Checkout Strategy - Self-Checkout Tips for Penny Items | Penny Central",
  description:
    "Learn checkout best practices for penny items. Self-checkout tips, cashier etiquette, and how to handle pricing issues successfully.",
  keywords: [
    "penny item checkout",
    "self checkout pennies",
    "penny checkout tips",
    "home depot self checkout",
    "cashier etiquette",
    "checkout strategy",
  ],
  openGraph: {
    title: "Checkout Strategy - Self-Checkout Tips for Pennies",
    description:
      "Master the checkout process for penny items with self-checkout tips and etiquette.",
    images: [ogImageUrl("Checkout Strategy")],
  },
  alternates: {
    canonical: "https://www.pennycentral.com/checkout-strategy",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Checkout Strategy")],
  },
}

export default function CheckoutStrategyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg-page)]">
      <section className="section-padding px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            In-Store Tips
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2">
            Checkout Strategy for Penny Items
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
            Penny items can ring differently depending on store systems and timing. The goal is a
            smooth checkout — not a confrontation.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Best practices</h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li>Try self-checkout first if it’s available.</li>
                <li>Scan one item at a time and watch the screen.</li>
                <li>If it won’t scan or shows a different price, stay calm and be polite.</li>
                <li>Have a backup plan: you can always leave the item behind.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Common outcomes</h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                <li>It rings up as $0.01 — great.</li>
                <li>It rings higher — it may not have pennied at that store yet.</li>
                <li>It’s “not for sale” — it may be pulled from shelves.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/guide#checkout"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg"
            >
              Read the full guide section
            </Link>
            <Link
              href="/report-find"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)]"
            >
              Report a find
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
