import type { Metadata } from "next"
import { GuideContent } from "@/components/GuideContent"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Complete Guide | Penny Central",
  description:
    "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
  openGraph: {
    title: "Complete Guide",
    description:
      "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
    images: [ogImageUrl("Complete Guide")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Complete Guide")],
  },
}

export default function GuidePage() {
  return (
    <PageShell width="wide">
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
    </PageShell>
  )
}
