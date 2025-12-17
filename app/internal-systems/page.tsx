import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home Depot Internal Systems - Understanding Store Operations | Penny Central",
  description:
    "Understand Home Depot's internal systems, SKU structure, inventory management, and clearance processes from a penny hunter's perspective.",
  keywords: [
    "home depot systems",
    "sku structure",
    "inventory management",
    "clearance process",
    "home depot operations",
    "internal processes",
  ],
  openGraph: {
    title: "Home Depot Internal Systems Explained",
    description: "Learn how Home Depot's internal systems work and how they affect penny hunting.",
    images: ["/og-image.png"],
  },
}

export default function InternalSystemsRedirect() {
  redirect("/#internal-systems")
}
