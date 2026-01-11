import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Report a Home Depot Penny Find (Live Verification) | Penny Central",
  description:
    "Submit a penny find in seconds to help verify live sightings for 47K+ shoppers. Your report updates the intel.",
  keywords: [
    "report penny item",
    "submit penny find",
    "home depot penny sighting",
    "community penny list",
    "penny item submission",
    "report clearance find",
  ],
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/report-find",
    title: "Report a Penny Find",
    description: "Help 47K+ shoppers verify live $0.01 sightings. Fast report, real impact.",
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
    title: "Report a Penny Find",
    description: "Help 47K+ shoppers verify live $0.01 sightings. Fast report, real impact.",
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
