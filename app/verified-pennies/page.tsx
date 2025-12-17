import type { Metadata } from "next"
import {
  getVerifiedPennies,
  getVerifiedBrands,
  getVerifiedPennyCount,
} from "@/lib/verified-pennies"
import { VerifiedPenniesClient } from "./verified-pennies-client"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Curated Penny Items - Confirmed Home Depot Penny Deals | Penny Central",
  description:
    "Browse 400+ curated Home Depot penny items with product images. Confirmed penny deals you can search by name, SKU, or brand. Your reference for penny shopping.",
  keywords: [
    "home depot penny items",
    "curated penny deals",
    "home depot clearance",
    "penny shopping",
    "home depot one cent",
  ],
  openGraph: {
    title: "Curated $0.01 Items",
    description:
      "Browse curated Home Depot penny items with product images. Confirmed deals you can search by name, SKU, or brand.",
    images: [ogImageUrl("Curated $0.01 Items")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Curated $0.01 Items")],
  },
}

export default function VerifiedPenniesPage() {
  const items = getVerifiedPennies()
  const brands = getVerifiedBrands()
  const totalCount = getVerifiedPennyCount()

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section
        aria-labelledby="page-heading"
        className="section-padding-sm px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-muted)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="pill pill-muted mx-auto w-fit mb-4">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-[var(--status-success)]"
              aria-hidden="true"
            ></span>
            Curated Penny Database
          </div>
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4"
          >
            Curated Penny Items
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
            {totalCount.toLocaleString()} confirmed penny items with product images. These items
            have been confirmed as penny deals at Home Depot.
          </p>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            Curated = confirmed at least once via admin review and/or community proof (receipt,
            photos, or multiple independent reports); availability and price can vary by store and
            timing.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)]">
                {totalCount.toLocaleString()}
              </span>
              <span className="text-[var(--text-secondary)]">curated items</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)]">{brands.length}</span>
              <span className="text-[var(--text-secondary)]">brands</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--status-success)]">$0.01</span>
              <span className="text-[var(--text-secondary)]">each</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <VerifiedPenniesClient items={items} brands={brands} />
    </div>
  )
}
