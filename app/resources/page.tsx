import { ExternalLink, Heart, Download, Wrench } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Section } from "@/components/page-templates"
import { ResourcesSupportCtas } from "@/components/resources-support-ctas"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    <PageShell width="default">
      <PageHeader
        title="Resources"
        subtitle="Essential tools for penny hunting success."
        primaryAction={{ label: "Check the Penny List", href: "/penny-list" }}
        secondaryActions={[{ label: "Report a find", href: "/report-find" }]}
        align="left"
      />

      <Section>
        <Card className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <CardContent className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                <Download size={24} className="text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-primary)]">PDF Guide</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Study guide to learn penny hunting basics before you shop
                </p>
              </div>
            </div>
            <div className="flex-1 sm:text-right">
              <Button variant="primary" asChild size="lg">
                <a href="/Home-Depot-Penny-Guide.pdf" download>
                  Download
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="External Tools">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Wrench size={20} className="text-[var(--cta-primary)]" aria-hidden="true" />
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Trusted links
          </p>
        </div>

        <div className="space-y-4">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive group flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 transition-colors"
            >
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                  {tool.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <ExternalLink
                size={20}
                className="ml-4 flex-shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--cta-primary)]"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </Section>

      <Section title="Support Penny Central" subtitle="Keep the tools free for everyone.">
        <Link
          href="/about#support"
          className="group flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 transition-colors hover:border-[var(--border-dark)]"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--cta-primary)]/10">
              <Heart size={20} className="text-[var(--cta-primary)]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Support Penny Central
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Activate BeFrugal cashback or buy me a coffee to keep the tools free for everyone.
              </p>
            </div>
          </div>
          <ExternalLink
            size={18}
            className="ml-4 flex-shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]"
            aria-hidden="true"
          />
        </Link>
      </Section>

      <Section spacing="md">
        <ResourcesSupportCtas />
      </Section>
    </PageShell>
  )
}
