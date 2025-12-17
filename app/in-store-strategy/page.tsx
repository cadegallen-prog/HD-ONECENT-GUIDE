import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "In-Store Hunting Strategy - Find Penny Items at Home Depot | Penny Central",
  description:
    "Master in-store penny hunting tactics. Learn where to look, how to scan effectively, and proven strategies to find $0.01 clearance items.",
  keywords: [
    "in-store penny hunting",
    "home depot clearance strategy",
    "where to find pennies",
    "penny hunting tactics",
    "clearance aisle tips",
    "scanning strategy",
  ],
  openGraph: {
    title: "In-Store Hunting Strategy - Find Penny Items",
    description: "Learn proven strategies for finding penny items in Home Depot stores.",
    images: ["/og-image.png"],
  },
}

export default function InStoreRedirect() {
  redirect("/#in-store-hunting")
}
