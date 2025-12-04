import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Store Finder | Penny Central",
  description:
    "Find Home Depot stores near you. Search by ZIP code, city, or use your location to find the closest stores for penny hunting.",
  openGraph: {
    title: "Store Finder | Penny Central",
    description:
      "Find Home Depot stores near you. Search by ZIP code, city, or use your location to find the closest stores for penny hunting.",
  },
}

export default function StoreFinderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
