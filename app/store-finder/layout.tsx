import type { Metadata } from "next"
import type { ReactNode } from "react"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Home Depot Store Finder: Find Stores by State or Zip | Penny Central",
  description:
    "Find Home Depot stores by state, city, or ZIP. Get store hours, phone numbers, and directions fast.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/store-finder",
    title: "Home Depot Store Finder",
    description:
      "Find Home Depot stores by state, city, or ZIP. Get store hours, phone numbers, and directions fast.",
    images: [ogImageUrl("store-finder")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Depot Store Finder",
    description:
      "Find Home Depot stores by state, city, or ZIP. Get store hours, phone numbers, and directions fast.",
    images: [ogImageUrl("store-finder")],
  },
}

export default function StoreFinderLayout({ children }: { children: ReactNode }) {
  return children
}
