import { Metadata } from "next"

import { COMMUNITY_MEMBER_COUNT_DISPLAY } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Report a Home Depot Penny Item | Submit a Penny Find | Penny Central",
  description: `Submit a penny find in seconds to help verify live sightings for ${COMMUNITY_MEMBER_COUNT_DISPLAY} shoppers. Your report updates the intel.`,
  keywords: [
    "report a home depot penny item",
    "report home depot penny item",
    "report penny item",
    "submit penny find",
    "home depot penny sighting",
    "community penny list",
    "penny item submission",
    "report clearance find",
  ],
  alternates: {
    canonical: "/report-find",
  },
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/report-find",
    title: "Report a Home Depot Penny Item",
    description: `Submit the SKU, item name, state, and date found. Reports usually reach the Penny List in about five minutes for ${COMMUNITY_MEMBER_COUNT_DISPLAY} shoppers.`,
    images: [
      {
        url: "/api/og?page=report-find",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Report a Home Depot Penny Item",
    description: `Submit the SKU, item name, state, and date found. Reports usually reach the Penny List in about five minutes.`,
    images: ["/api/og?page=report-find"],
  },
}

export default function ReportFindLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
                name: "Report a Find",
                item: "https://www.pennycentral.com/report-find",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
