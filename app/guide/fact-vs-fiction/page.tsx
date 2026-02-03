import type { Metadata } from "next"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { FactVsFiction } from "@/components/guide/sections/FactVsFiction"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "Penny Hunting: Fact vs Fiction | Home Depot Penny Guide",
  description:
    "We debunk common myths about penny shopping. Get the truth about 'secret sales' and employee policies.",
}

export default function FactVsFictionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Fact vs. Fiction
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          Separating community myths from verified store policies.
        </p>
      </div>

      <EthicalDisclosure />

      <FactVsFiction />

      <GuideNav
        prev={{
          label: "The Inside Scoop",
          href: "/guide/inside-scoop",
        }}
        next={{
          label: "Responsible Hunting",
          href: "/guide/responsible-hunting",
        }}
      />
    </div>
  )
}
