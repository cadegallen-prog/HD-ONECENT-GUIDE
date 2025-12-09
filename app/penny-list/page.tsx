import type { Metadata } from "next"
import { getPennyList } from "@/lib/fetch-penny-data"
import { PennyListClient } from "@/components/penny-list-client"

export const metadata: Metadata = {
  title: "Crowd Reports: Penny Leads - Penny Central",
  description:
    "Unverified crowd-sourced reports of penny items at Home Depot stores. Filter by state, tier, and more. YMMV - always verify in store.",
}

export default async function PennyListPage() {
  const pennyItems = await getPennyList()

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section
        aria-labelledby="page-heading"
        className="section-padding px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-sm font-medium mb-4">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-amber-500"
              aria-hidden="true"
            ></span>
            Crowd reports (last 30 days)
          </div>
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4"
          >
            Crowd Reports: Recent Penny Leads (Unverified)
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Recent penny finds reported by PennyCentral users. These are unverified leads —{" "}
            <strong>YMMV (Your Mileage May Vary)</strong>.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding px-4 sm:px-6">
        <div className="container-wide">
          <PennyListClient initialItems={pennyItems} />
        </div>
      </section>
    </div>
  )
}
