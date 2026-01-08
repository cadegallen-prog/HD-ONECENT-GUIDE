import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Home Depot Penny List: Live $0.01 Finds (Community-Reported) | Penny Central",
  description:
    "Browse the live community-reported Home Depot penny list. Filter by state, date window, and search by SKU. Updated hourly.",
  alternates: {
    canonical: "https://www.pennycentral.com/home-depot-penny-list",
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/home-depot-penny-list",
    title: "Home Depot Penny List: Live $0.01 Finds",
    description:
      "Live community-reported $0.01 penny finds at Home Depot. Filter by state and date window.",
    images: [ogImageUrl("penny-list")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Depot Penny List: Live $0.01 Finds",
    description:
      "Live community-reported $0.01 penny finds at Home Depot. Filter by state and date window.",
    images: [ogImageUrl("penny-list")],
  },
}

export default function HomeDepotPennyListLandingPage() {
  return (
    <PageShell width="wide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Home Depot Penny List",
            url: "https://www.pennycentral.com/home-depot-penny-list",
            mainEntity: {
              "@type": "Dataset",
              name: "Home Depot Penny List",
              url: "https://www.pennycentral.com/penny-list",
              isAccessibleForFree: true,
              creator: {
                "@type": "Organization",
                name: "Penny Central",
                url: "https://www.pennycentral.com",
              },
            },
          }),
        }}
      />

      <PageHeader
        title="Home Depot Penny List"
        subtitle="Live, community-reported $0.01 finds. Filter by state, date, and SKU."
        primaryAction={{ label: "Open the live penny list", href: "/penny-list" }}
        secondaryActions={[{ label: "Learn how to find penny items", href: "/guide" }]}
        align="left"
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            What this list is (and what it isn&apos;t)
          </h2>
          <ul className="mt-3 space-y-2 text-[var(--text-secondary)] leading-relaxed">
            <li>
              <strong>It is</strong>: a community-sourced feed of recent penny sightings (updated
              hourly).
            </li>
            <li>
              <strong>It isn&apos;t</strong>: guaranteed inventory for your store (availability can
              change fast).
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold text-[var(--text-primary)]">
            How to use the penny list effectively
          </h2>
          <ol className="mt-3 list-decimal pl-5 text-[var(--text-secondary)] leading-relaxed space-y-2">
            <li>Filter to your state and a recent date window (7–30 days is usually best).</li>
            <li>Tap a card to open the internal SKU page for details and report history.</li>
            <li>
              Read the{" "}
              <Link
                href="/guide"
                className="underline underline-offset-4 text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium"
              >
                complete guide
              </Link>{" "}
              for in-store tactics that improve your odds.
            </li>
          </ol>

          <div className="mt-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Want more finds? Close the loop
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Reporting keeps the list fresh and helps everyone hunt smarter.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/penny-list"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg"
              >
                Browse the live list
              </Link>
              <Link
                href="/report-find"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)]"
              >
                Report a find
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
