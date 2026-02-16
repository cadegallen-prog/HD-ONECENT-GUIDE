import ReportFindFormClient from "@/components/report-find/ReportFindFormClient"

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
        {/* Server-rendered header — visible without JS */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Report a Penny Find
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Found a Home Depot item scanning at one cent? Report it here to help other shoppers
            verify the deal. It takes about 30 seconds.
          </p>
        </div>

        {/* Server-rendered explainer — meaningful content without JS */}
        <section className="mb-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 text-sm text-[var(--text-secondary)] space-y-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            How Reporting Works
          </h2>
          <p>
            When you submit a find, it is added to the{" "}
            <a
              href="/penny-list"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline"
            >
              Penny List
            </a>{" "}
            automatically — usually within about five minutes. Other community members can then
            check their local stores for the same item.
          </p>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">What You Will Need</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Item name</strong> — a short description of what you found.
            </li>
            <li>
              <strong>SKU number</strong> — the 6- or 10-digit SKU from the shelf tag or the Home
              Depot app (not the UPC from the receipt).
            </li>
            <li>
              <strong>State</strong> — the U.S. state where you found the item.
            </li>
            <li>
              <strong>Date found</strong> — when you spotted it (within the last 30 days).
            </li>
          </ul>
          <p>City and quantity are optional but help the community spot regional patterns.</p>
        </section>
      </div>

      {/* Client-rendered interactive form */}
      <ReportFindFormClient />
    </div>
  )
}
