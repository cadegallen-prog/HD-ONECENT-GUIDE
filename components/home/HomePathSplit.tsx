import Link from "next/link"
import { ArrowRight, BookOpen, List } from "lucide-react"

const paths = [
  {
    eyebrow: "New to penny hunting?",
    title: "Start with the guide before you drive to a store.",
    body: "Learn how the markdown cycle works, what the tags mean, and why process matters more than luck.",
    href: "/guide",
    cta: "Learn how it works",
    icon: BookOpen,
  },
  {
    eyebrow: "Already hunting?",
    title: "Go straight to the current Penny List and SKU pages.",
    body: "Use live reports, state coverage, and item detail pages to decide whether a trip is worth it right now.",
    href: "/penny-list",
    cta: "Check the Penny List",
    icon: List,
  },
] as const

export function HomePathSplit() {
  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:pb-20 bg-[var(--bg-page)]">
      <div className="container-wide">
        <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-page)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Choose your route
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              Choose the route that matches what you need next.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
              Learn first if you need the rules, or jump straight into live proof if you already
              know how to hunt.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {paths.map((path) => (
              <article
                key={path.href}
                className="rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6"
              >
                <path.icon className="h-6 w-6 text-[var(--cta-primary)]" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {path.eyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-snug text-[var(--text-primary)]">
                  {path.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {path.body}
                </p>
                <Link
                  href={path.href}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--link-default)] underline underline-offset-4"
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
            Found something in-store?{" "}
            <Link
              href="/report-find"
              className="text-[var(--link-default)] underline underline-offset-4"
            >
              Report a find
            </Link>{" "}
            so the next shopper sees it faster. Need a location only after you already have SKUs?{" "}
            <Link
              href="/store-finder"
              className="text-[var(--link-default)] underline underline-offset-4"
            >
              Use Store Finder
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
