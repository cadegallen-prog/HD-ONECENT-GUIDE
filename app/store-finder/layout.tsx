import type { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Store Finder | Penny Central",
  description:
    "Find Home Depot stores near you. Search by ZIP code, city, or use your location to find the closest stores for penny hunting.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/store-finder",
    title: "Store Finder | Penny Central",
    description:
      "Find Home Depot stores near you. Search by ZIP code, city, or use your location to find the closest stores for penny hunting.",
    images: [ogImageUrl("store-finder")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("store-finder")],
  },
}

export default function StoreFinderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
