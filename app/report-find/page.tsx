import Link from "next/link"

import ReportFindFormClient from "@/components/report-find/ReportFindFormClient"

const requiredDetails = [
  {
    label: "SKU number",
    detail: "Use the 6- or 10-digit SKU from the shelf tag or Home Depot app, not the UPC.",
  },
  {
    label: "Item name",
    detail: "Use the product name shown on the shelf tag or in the app.",
  },
  {
    label: "State",
    detail: "Choose the U.S. state where you found the item.",
  },
  {
    label: "Date found",
    detail: "Report when you saw it, within the last 30 days.",
  },
]

/**
 * Report a Find - Server Component
 *
 * This page renders meaningful static content (H1, explanation, process info)
 * in the server HTML so crawlers and no-JS visitors see real content.
 * The interactive form is loaded via a client component that hydrates on top.
 */
export default function ReportFindPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--cta-primary)]">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--text-secondary)]">Report a Find</span>
        </nav>

        <header className="mb-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Fast, trust-first reporting
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Report a Home Depot Penny Item
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Submit a confirmed penny find in about 30 seconds. You only need the SKU, item name,
            state, and date found.
          </p>
        </header>

        <section className="mb-8 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 text-sm text-[var(--text-secondary)] space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Fast
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Most reports reach the Penny List in about five minutes.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Trust
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Only submit items you personally verified in-store.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Low friction
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                City and quantity are optional, so you can report quickly.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              What to have ready
            </h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              {requiredDetails.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong> - {item.detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--border-default)] pt-4">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Need context before you submit?
            </h2>
            <p className="mt-2">
              If you are still verifying the item, use the live list or the guide first. If the scan
              is confirmed already, stay here and submit it now.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href="/penny-list"
                className="font-semibold text-[var(--cta-primary)] underline"
              >
                Check the live Penny List
              </Link>
              <Link href="/guide" className="font-semibold text-[var(--cta-primary)] underline">
                Read the full guide
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Client-rendered interactive form */}
      <ReportFindFormClient />
    </div>
  )
}
