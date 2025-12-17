import { Breadcrumb } from "@/components/breadcrumb"
import { ClearanceLifecycleChart } from "@/components/clearance-lifecycle-chart"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { Button } from "@/components/ui/button"
import { ogImageUrl } from "@/lib/og"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clearance Lifecycle - Understanding Home Depot Markdown Patterns | Penny Central",
  description:
    "Learn Home Depot's clearance markdown cadences, price ending codes, and timing patterns to predict when items will reach penny status. Master the $0.01 clearance cycle.",
  keywords: [
    "home depot clearance cycle",
    "markdown cadence",
    "price ending decoder",
    "clearance lifecycle",
    "penny item timing",
    "clearance patterns",
    "markdown schedule",
  ],
  openGraph: {
    title: "Clearance Lifecycle - Home Depot Markdown Patterns",
    description:
      "Understand Home Depot's clearance markdown cadences and predict when items will reach penny status.",
    images: [ogImageUrl("Clearance Lifecycle")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Clearance Lifecycle")],
  },
}

export default function ClearanceLifecyclePage() {
  return (
    <PageShell width="wide">
      <div className="flex flex-col gap-4">
        <Breadcrumb />
        <PageHeader
          title="Clearance Lifecycle"
          subtitle="Understanding Home Depot's clearance markdown patterns and timing to predict when items will reach penny status."
          primaryAction={{ label: "Check the Penny List", href: "/penny-list" }}
          secondaryActions={[{ label: "Read the full guide", href: "/guide#clearance-lifecycle" }]}
          align="left"
        />
      </div>

      <Section>
        <div className="space-y-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
          <Prose className="space-y-3">
            <p>
              Home Depot uses a structured clearance system with specific price endings that signal
              markdown depth. Understanding these patterns helps predict when items will reach penny
              status.
            </p>
          </Prose>

          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
            <p className="font-semibold text-[var(--text-primary)]">Important</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Clearance timing varies by store, region, and department. These patterns are general
              guidelines based on community observations, not official Home Depot policy.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4">
            <ClearanceLifecycleChart />
          </div>
        </div>
      </Section>

      <Section title="Price Ending Guide">
        <div className="overflow-x-auto rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-elevated)]">
              <tr className="border-b border-[var(--border-default)]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Price Ending
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Meaning
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-[var(--text-secondary)]">
              <tr className="border-b border-[var(--border-default)]">
                <td className="px-4 py-3">
                  <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                    .01
                  </code>
                </td>
                <td className="px-4 py-3">Penny item - clearance complete</td>
                <td className="px-4 py-3">Buy immediately</td>
              </tr>
              <tr className="border-b border-[var(--border-default)]">
                <td className="px-4 py-3">
                  <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                    .03/.02
                  </code>
                </td>
                <td className="px-4 py-3">Final markdown before penny</td>
                <td className="px-4 py-3">Monitor daily</td>
              </tr>
              <tr className="border-b border-[var(--border-default)]">
                <td className="px-4 py-3">
                  <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                    .06/.04
                  </code>
                </td>
                <td className="px-4 py-3">Mid-clearance markdown</td>
                <td className="px-4 py-3">Check weekly</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                    .00
                  </code>
                </td>
                <td className="px-4 py-3">Initial clearance (rounded)</td>
                <td className="px-4 py-3">Add to watch list</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Markdown Cadences" subtitle="Patterns observed across departments.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Cadence A</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                $X.00 → $X.06 → $X.03 → $0.01
              </code>
            </p>
            <p className="text-sm text-[var(--text-muted)]">Timeframe: 2-4 weeks per stage</p>
            <p className="text-sm text-[var(--text-muted)]">
              Common in: Hardware, Tools, Electrical
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Cadence B</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              <code className="rounded bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[var(--text-primary)]">
                $X.00 → $X.04 → $X.02 → $0.01
              </code>
            </p>
            <p className="text-sm text-[var(--text-muted)]">Timeframe: 1-3 weeks per stage</p>
            <p className="text-sm text-[var(--text-muted)]">Common in: Seasonal, Garden, Holiday</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <a href="/guide#clearance-lifecycle">See this inside the full guide</a>
          </Button>
          <Button asChild variant="primary" size="lg">
            <a href="/report-find">Report a find</a>
          </Button>
        </div>
      </Section>
    </PageShell>
  )
}
