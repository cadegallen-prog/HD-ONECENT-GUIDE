import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "How to Find Penny Items at Home Depot (Step-by-Step) | Penny Central",
  description:
    "Step-by-step guide to finding Home Depot penny items: pre-hunt, in-store tactics, and checkout tips. Then browse the live community penny list.",
  alternates: {
    canonical: "https://www.pennycentral.com/how-to-find-penny-items",
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/how-to-find-penny-items",
    title: "How to Find Penny Items at Home Depot (Step-by-Step)",
    description:
      "A step-by-step approach to finding $0.01 penny items at Home Depot — plus a live community list.",
    images: [ogImageUrl("guide")],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Find Penny Items at Home Depot (Step-by-Step)",
    description:
      "A step-by-step approach to finding $0.01 penny items at Home Depot — plus a live community list.",
    images: [ogImageUrl("guide")],
  },
}

export default function HowToFindPennyItemsLandingPage() {
  return (
    <PageShell width="wide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Find Penny Items at Home Depot",
            description: "A step-by-step guide to finding $0.01 items at Home Depot.",
            url: "https://www.pennycentral.com/how-to-find-penny-items",
            step: [
              {
                "@type": "HowToStep",
                name: "Start with the guide",
                text: "Learn how penny items happen and which departments and cycles to watch.",
                url: "https://www.pennycentral.com/guide",
              },
              {
                "@type": "HowToStep",
                name: "Use the penny list",
                text: "Browse recent community-reported SKUs and prioritize fresh sightings.",
                url: "https://www.pennycentral.com/penny-list",
              },
              {
                "@type": "HowToStep",
                name: "Verify in-store",
                text: "Scan the original UPC at self-checkout to confirm the $0.01 price.",
              },
            ],
            totalTime: "PT30M",
          }),
        }}
      />

      <PageHeader
        title="How to Find Penny Items at Home Depot"
        subtitle="A step-by-step approach you can use today, plus a live community penny list."
        primaryAction={{ label: "Read the complete guide", href: "/guide" }}
        secondaryActions={[{ label: "Browse the live penny list", href: "/penny-list" }]}
        align="left"
      />

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Step-by-step</h2>
          <ol className="mt-3 list-decimal pl-5 text-[var(--text-secondary)] leading-relaxed space-y-2">
            <li>
              Learn the basics in the{" "}
              <Link
                href="/guide"
                className="underline underline-offset-4 text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium"
              >
                Complete Guide
              </Link>{" "}
              (clearance lifecycle, what to scan, where to look).
            </li>
            <li>
              Use the{" "}
              <Link
                href="/penny-list"
                className="underline underline-offset-4 text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium"
              >
                Penny List
              </Link>{" "}
              to focus on SKUs that have been seen recently.
            </li>
            <li>In-store, scan the original UPC at self-checkout to confirm the penny price.</li>
            <li>Report your find so the list stays fresh for everyone.</li>
          </ol>

          <div className="mt-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Quick links</h3>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
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
                Browse the list
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
