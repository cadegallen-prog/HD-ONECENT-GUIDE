import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Clearance Lifecycle - Understanding Home Depot Markdown Patterns | Penny Central",
  description:
    "Learn Home Depot's clearance markdown cadences, price ending codes, and timing patterns to predict when items will reach penny status.",
  openGraph: {
    title: "Clearance Lifecycle - Home Depot Patterns",
    description: "Learn Home Depot's clearance markdown cadences and price ending codes.",
    images: [ogImageUrl("Clearance Lifecycle")],
  },
}

export default function ClearanceLifecycleRedirect() {
  redirect("/guide/clearance-lifecycle")
}
