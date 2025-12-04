import { ExternalLink, Heart, Download, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"
import {
  BEFRUGAL_REFERRAL_PATH,
  COMMUNITY_MEMBER_COUNT_DISPLAY,
  FACEBOOK_GROUP_URL,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Resources | Penny Central",
  description: "Essential tools and resources for penny hunting at Home Depot.",
}

export default function ResourcesPage() {
  const tools = [
    {
      name: "BeFrugal Cashback",
      description:
        "Free cashback on Home Depot and everyday purchases that supports Penny Central at no extra cost.",
      url: BEFRUGAL_REFERRAL_PATH,
    },
    {
      name: "Home Depot Store Finder",
      description: "Official store locator with hours and contact info",
      url: "https://www.homedepot.com/l/",
    },
    {
      name: "Home Depot App",
      description: "Official app for checking prices and availability",
      url: "https://www.homedepot.com/c/mobile-app",
    },
    {
      name: "Home Depot One Cent Items Group",
      description: `Facebook community with ${COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters`,
      url: FACEBOOK_GROUP_URL,
    },
  ]

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Resources</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Essential tools for penny hunting success
        </p>
      </header>

      {/* PDF Download */}
      <Card className="mb-8 bg-[var(--bg-card)] border-[var(--border-default)]">
        <CardContent className="py-5 flex items-center gap-4">
          <Download size={20} className="text-[var(--text-muted)] flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">PDF Guide</h2>
            <p className="text-sm text-[var(--text-muted)]">Printable reference for in-store use</p>
          </div>
          <Button variant="primary" asChild className="min-h-[44px]">
            <a href="/Home-Depot-Penny-Guide.pdf" download>
              Download
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* External Tools */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wrench size={18} className="text-[var(--text-muted)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">External Tools</h2>
        </div>

        <div className="space-y-3">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 min-h-[56px] bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-elevated)] transition-colors group"
            >
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                  {tool.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{tool.description}</p>
              </div>
              <ExternalLink
                size={18}
                className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] flex-shrink-0 ml-4 transition-colors"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </section>

      {/* Support Card */}
      <section className="mt-10">
        <Link
          href="/about#support"
          className="flex items-center justify-between p-5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg hover:border-[var(--border-dark)] transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-copper)]/10 flex items-center justify-center flex-shrink-0">
              <Heart size={20} className="text-[var(--brand-copper)]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                Support Penny Central
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Get cashback on HD purchases with BeFrugal or chip in for hosting costs
              </p>
            </div>
          </div>
          <ExternalLink
            size={18}
            className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] flex-shrink-0 ml-4 transition-colors"
            aria-hidden="true"
          />
        </Link>
      </section>
    </div>
  )
}
