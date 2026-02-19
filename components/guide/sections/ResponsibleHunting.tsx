import Link from "next/link"

const decisionLanes = [
  {
    title: "Use",
    detail: "Keep it when it solves a real need in your home within the next 30 days.",
  },
  {
    title: "Gift",
    detail: "Pick it up when you already have someone specific in mind who will use it soon.",
  },
  {
    title: "Donate",
    detail: "Take it only if a local school, shelter, or nonprofit can use it quickly.",
  },
  {
    title: "Resell",
    detail: "Only keep resale items with clear demand, easy shipping, and realistic margins.",
  },
  {
    title: "Skip",
    detail: "Skip duplicates, low-demand items, and anything that adds clutter without value.",
  },
]

const headacheSignals = [
  "No clear use case, recipient, or resale plan before checkout.",
  "Bulky storage burden compared to likely value.",
  "Damage, missing parts, or high return risk.",
  "Low-demand category in your local resale market.",
  "You are buying it only because it is a penny, not because it is useful.",
]

export function ResponsibleHunting() {
  return (
    <section
      id="worth-it-filter"
      aria-labelledby="worth-it-filter-heading"
      className="guide-callout space-y-5"
    >
      <div className="space-y-2">
        <h2 id="worth-it-filter-heading" className="text-2xl font-bold text-[var(--text-primary)]">
          Worth-It Filter
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Not every penny item is a good pickup. Use this quick filter before you commit drive time,
          cart space, and storage at home.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {decisionLanes.map((lane) => (
          <article
            key={lane.title}
            className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4"
          >
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{lane.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {lane.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          High-headache, low-value signals
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          {headacheSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Decision quality over accumulation keeps this hobby useful and sustainable.
        </p>
        <Link
          href="/in-store-strategy"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--cta-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--cta-text)] hover:bg-[var(--cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        >
          Apply the in-store strategy
        </Link>
      </div>
    </section>
  )
}
