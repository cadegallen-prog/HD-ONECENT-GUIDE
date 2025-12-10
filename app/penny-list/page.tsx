import type { Metadata } from "next"
import { Suspense } from "react"
import { getPennyList } from "@/lib/fetch-penny-data"
import { PennyListClient } from "@/components/penny-list-client"

export const metadata: Metadata = {
  title: "Crowd Reports: Penny Leads - Penny Central",
  description:
    "Unverified crowd-sourced reports of penny items at Home Depot stores. Filter by state, tier, and more. YMMV - always verify in store.",
}

// Loading skeleton for the filter bar and results
function PennyListSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Filter bar skeleton */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[180px] h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-48 h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-24 h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[180px] h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-32 h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
          <div className="w-36 h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border-default)]">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
      </div>
      {/* Results skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-5 h-64"
          >
            <div className="flex justify-between mb-3">
              <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
            <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
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
          <Suspense fallback={<PennyListSkeleton />}>
            <PennyListClient initialItems={pennyItems} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
