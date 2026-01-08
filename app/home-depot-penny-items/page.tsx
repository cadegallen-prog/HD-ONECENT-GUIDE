import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Home Depot Penny Items ($0.01): What They Are + How to Find Them | Penny Central",
  description:
    "Learn what Home Depot penny items (one cent items) are, why they happen, and how to find them in-store. Start with the guide, then browse the live community penny list.",
  alternates: {
    canonical: "https://www.pennycentral.com/home-depot-penny-items",
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/home-depot-penny-items",
    title: "Home Depot Penny Items ($0.01): What They Are + How to Find Them",
    description:
      "What penny items are, why they happen, and how to find $0.01 items at Home Depot — with a live community list.",
    images: [ogImageUrl("guide")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Depot Penny Items ($0.01): What They Are + How to Find Them",
    description:
      "What penny items are, why they happen, and how to find $0.01 items at Home Depot — with a live community list.",
    images: [ogImageUrl("guide")],
  },
}

export default function HomeDepotPennyItemsLandingPage() {
  return (
    <PageShell width="wide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Home Depot Penny Items ($0.01)",
            url: "https://www.pennycentral.com/home-depot-penny-items",
            isPartOf: {
              "@type": "WebSite",
              name: "Penny Central",
              url: "https://www.pennycentral.com",
            },
          }),
        }}
      />

      <PageHeader
        title="Home Depot Penny Items ($0.01)"
        subtitle="What “penny items” (one cent items) are, why they happen, and the safest way to hunt them."
        primaryAction={{ label: "Read the complete guide", href: "/guide" }}
        secondaryActions={[{ label: "Browse the live penny list", href: "/penny-list" }]}
        align="left"
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">What is a penny item?</h2>
          <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
            A Home Depot penny item is merchandise that has been marked down to{" "}
            <strong>$0.01</strong> in Home Depot&apos;s internal system (often as part of clearance
            removal). These items are typically intended to be pulled from shelves, but they
            sometimes remain on the floor and can be purchased if you find them.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-[var(--text-primary)]">
            How to find penny items at Home Depot
          </h2>
          <ol className="mt-2 list-decimal pl-5 text-[var(--text-secondary)] leading-relaxed space-y-2">
            <li>
              Start with the{" "}
              <Link
                href="/guide"
                className="underline underline-offset-4 text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium"
              >
                Complete Guide
              </Link>{" "}
              to learn the clearance lifecycle and the best in-store tactics.
            </li>
            <li>
              Check the{" "}
              <Link
                href="/penny-list"
                className="underline underline-offset-4 text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium"
              >
                live community penny list
              </Link>{" "}
              for recently reported SKUs.
            </li>
            <li>
              Verify the price in-store by scanning the original UPC at self-checkout (prices and
              availability vary by store).
            </li>
          </ol>

          <div className="mt-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Ready to hunt? Do this next
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Organic search visitors: start with the guide. Returning visitors: jump straight into
              the list.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href="/guide"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg"
              >
                Read the guide
              </Link>
              <Link
                href="/penny-list"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)]"
              >
                Browse the penny list
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
