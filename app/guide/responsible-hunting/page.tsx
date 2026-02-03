import type { Metadata } from "next"
import { ResponsibleHunting } from "@/components/guide/sections/ResponsibleHunting"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "Responsible Penny Hunting Etiquette | Home Depot Penny Guide",
  description:
    "How to hunt responsibly, respect store staff, and keep the penny shopping community alive for everyone.",
}

export default function ResponsibleHuntingPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Responsible Hunting
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          Keep the game alive by hunting smart, safe, and respectful.
        </p>
      </div>

      <ResponsibleHunting />

      <GuideNav
        prev={{
          label: "Fact vs. Fiction",
          href: "/guide/fact-vs-fiction",
        }}
        next={{
          label: "Back to Guide Home",
          href: "/guide",
        }}
      />
    </div>
  )
}
