import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Live Store Finder for Home Depot Penny Shopping | Penny Central",
  description:
    "Find nearby Home Depot stores for penny hunting and plan your next trip. Then check the live list and report what you find.",
  alternates: {
    canonical: "/store-finder",
  },
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/store-finder",
    title: "Find Stores to Penny Hunt Near You",
    description: "Locate nearby stores, then check the live penny list and report sightings.",
    images: [
      {
        url: "/api/og?page=store-finder",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Stores to Penny Hunt Near You",
    description: "Locate nearby stores, then check the live penny list and report sightings.",
    images: ["/api/og?page=store-finder"],
  },
}

export default function StoreFinderLayout({ children }: { children: ReactNode }) {
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
                name: "Store Finder",
                item: "https://www.pennycentral.com/store-finder",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  )
}
