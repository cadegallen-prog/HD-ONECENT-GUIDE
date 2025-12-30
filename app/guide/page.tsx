import type { Metadata } from "next"
import { GuideContent } from "@/components/GuideContent"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Home Depot Penny Shopping Guide: How to Find $0.01 Items | Penny Central",
  description:
    "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/guide",
    title: "Home Depot Penny Shopping Guide",
    description:
      "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
    images: [ogImageUrl("guide")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Depot Penny Shopping Guide",
    description:
      "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
    images: [ogImageUrl("guide")],
  },
}

export default function GuidePage() {
  return (
    <PageShell width="wide">
      {/* HowTo Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Find Penny Items at Home Depot",
            description:
              "A step-by-step guide to identifying and purchasing $0.01 clearance items at Home Depot.",
            step: [
              {
                "@type": "HowToStep",
                name: "Digital Pre-Hunt",
                text: "Use the Community Penny List to identify items that have recently dropped to $0.01. Note the SKUs and product names.",
                url: "https://www.pennycentral.com/penny-list",
              },
              {
                "@type": "HowToStep",
                name: "Locate Items In-Store",
                text: "Visit your local Home Depot and check clearance endcaps, seasonal sections, and 'hidden' spots like top or bottom shelves.",
              },
              {
                "@type": "HowToStep",
                name: "Verify the Price",
                text: "Use the Home Depot app (set to your store) or a self-checkout terminal to scan the manufacturer UPC. If it shows $0.01, it's a penny item.",
              },
              {
                "@type": "HowToStep",
                name: "Checkout Discreetly",
                text: "Purchase the item at self-checkout. Avoid scanning yellow clearance tags as they may flag an employee; always scan the original UPC.",
              },
            ],
            totalTime: "PT30M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: "0.01",
            },
          }),
        }}
      />
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a Home Depot penny item?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A penny item is merchandise that has been marked down to $0.01 in Home Depot's internal system (ZMA) for removal from inventory. While not intended for sale, they can often be found on shelves and purchased.",
                },
              },
              {
                "@type": "Question",
                name: "How do I find penny items at Home Depot?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can find them by checking clearance endcaps, seasonal sections, and using the Community Penny List to identify recently dropped SKUs. Always verify the price using the Home Depot app or a self-checkout terminal.",
                },
              },
              {
                "@type": "Question",
                name: "Do Home Depot employees buy penny items?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. It is against Home Depot policy for employees to purchase penny items. These items are intended to be removed from the floor and destroyed or returned to the vendor.",
                },
              },
              {
                "@type": "Question",
                name: "Can I see penny prices in the Home Depot app?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, the $0.01 price never appears on the public website or app. It will usually show the last clearance price or 'unavailable'. The only way to see the penny price is by scanning the UPC in-store.",
                },
              },
            ],
          }),
        }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.pennycentral.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guide",
                item: "https://www.pennycentral.com/guide",
              },
            ],
          }),
        }}
      />
      <PageHeader
        title="Complete Guide"
        subtitle="Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures."
        primaryAction={{ label: "Check the Penny List", href: "/penny-list" }}
        secondaryActions={[
          { label: "Report a find", href: "/report-find" },
          { label: "Open store finder", href: "/store-finder" },
        ]}
        align="left"
      />

      <Section>
        <GuideContent />
      </Section>

      <Section spacing="md">
        <SupportAndCashbackCard />
      </Section>

      <Section id="faq" spacing="lg" className="border-t border-[var(--border-default)] pt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                What is a Home Depot penny item?
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                A penny item is merchandise that has been marked down to $0.01 in Home Depot&apos;s
                internal system (ZMA) for removal from inventory. While not intended for sale, they
                can often be found on shelves and purchased.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                How do I find penny items at Home Depot?
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You can find them by checking clearance endcaps, seasonal sections, and using the
                Community Penny List to identify recently dropped SKUs. Always verify the price
                using the Home Depot app or a self-checkout terminal.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Do Home Depot employees buy penny items?
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                No. It is against Home Depot policy for employees to purchase penny items. These
                items are intended to be removed from the floor and destroyed or returned to the
                vendor.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Can I see penny prices in the Home Depot app?
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                No, the $0.01 price never appears on the public website or app. It will usually show
                the last clearance price or &quot;unavailable&quot;. The only way to see the penny
                price is by scanning the UPC in-store.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="lg" className="text-center border-t border-[var(--border-default)] pt-16">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Ready to start hunting?
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Put your knowledge to the test. Check the live community penny list for the latest
          sightings near you.
        </p>
        <a
          href="/penny-list"
          className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--cta-primary)] text-[var(--cta-text)] font-bold shadow-lg hover:bg-[var(--cta-hover)] transition-all"
        >
          View the Live Penny List
        </a>
      </Section>
    </PageShell>
  )
}
