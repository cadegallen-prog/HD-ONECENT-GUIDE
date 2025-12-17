import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Report a Penny Find - Submit Home Depot $0.01 Items | Penny Central",
  description:
    "Report your Home Depot penny finds to help the community. Submit SKU, location, and details to add items to the Penny List. Takes 30 seconds.",
  keywords: [
    "report penny item",
    "submit penny find",
    "home depot penny sighting",
    "community penny list",
    "penny item submission",
    "report clearance find",
  ],
  openGraph: {
    title: "Report a Penny Find - Help the Community",
    description:
      "Submit your Home Depot penny finds to the community Penny List. Quick and easy reporting.",
    images: [ogImageUrl("Report a Find")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Report a Find")],
  },
}

export default function ReportFindLayout({ children }: { children: React.ReactNode }) {
  return children
}
