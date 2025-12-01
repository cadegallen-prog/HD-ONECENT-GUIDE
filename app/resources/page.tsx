import { ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources | Penny Central",
  description: "Essential tools and resources for penny hunting at Home Depot.",
}

export default function ResourcesPage() {
  const tools = [
    {
      name: "BrickSeek",
      description: "Check inventory and prices at local Home Depot stores",
      url: "https://brickseek.com/home-depot-inventory-checker",
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
      description: "Facebook community with 32,000+ penny hunters",
      url: "https://www.facebook.com/groups/homedepotonecent",
    },
  ]

  return (
    <div className="p-6 max-w-[1200px]">
      <header className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-primary">
          Resources
        </h1>
      </header>

      {/* PDF Download */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <Button variant="primary" asChild>
            <a href="/Home-Depot-Penny-Guide.pdf" download>
              Download PDF Guide
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* External Tools */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-text-primary mb-3">
          External Tools
        </h2>

        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-elevated transition-colors group"
          >
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                {tool.name}
              </h3>
              <p className="text-xs text-text-secondary">
                {tool.description}
              </p>
            </div>
            <ExternalLink size={14} className="text-text-muted group-hover:text-accent flex-shrink-0 ml-4" />
          </a>
        ))}

        {/* Support Card */}
        <Link
          href="/about#support"
          className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors group mt-6"
        >
          <div className="flex items-start gap-3">
            <Heart size={18} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Support Penny Central
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Get cashback on HD purchases with BeFrugal or chip in for hosting costs
              </p>
            </div>
          </div>
          <ExternalLink size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 ml-4" />
        </Link>
      </div>
    </div>
  )
}
