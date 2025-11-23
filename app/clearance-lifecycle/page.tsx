import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ClearanceLifecycleChart } from "@/components/clearance-lifecycle-chart"

export default function ClearanceLifecyclePage() {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <main className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Clearance Lifecycle
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Understanding Home Depot's clearance markdown patterns and timing to predict when items will reach penny status.
            </p>

            {/* Visual Charts */}
            <ClearanceLifecycleChart />

            {/* Detailed Explanation */}
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-heading font-semibold">How Clearance Works</h2>
              <p className="text-foreground">
                Home Depot uses a structured clearance system with specific price endings that signal
                markdown depth. Understanding these patterns helps predict when items will reach penny status.
              </p>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="font-heading font-semibold text-amber-900 dark:text-amber-100">Important</p>
                <p className="text-sm mt-1 text-amber-800 dark:text-amber-200">
                  Clearance timing varies by store, region, and department. These patterns are general
                  guidelines based on community observations, not official Home Depot policy.
                </p>
              </div>

              <h3 className="text-xl font-heading font-semibold mt-8">Price Ending Guide</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold">Price Ending</th>
                      <th className="text-left p-4 font-semibold">Meaning</th>
                      <th className="text-left p-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="font-mono bg-muted px-2 py-1 rounded">.01</code></td>
                      <td className="p-4">Penny item - clearance complete</td>
                      <td className="p-4">Buy immediately</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="font-mono bg-muted px-2 py-1 rounded">.03/.02</code></td>
                      <td className="p-4">Final markdown before penny</td>
                      <td className="p-4">Monitor daily</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="font-mono bg-muted px-2 py-1 rounded">.06/.04</code></td>
                      <td className="p-4">Mid-clearance markdown</td>
                      <td className="p-4">Check weekly</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="font-mono bg-muted px-2 py-1 rounded">.00</code></td>
                      <td className="p-4">Initial clearance (rounded)</td>
                      <td className="p-4">Add to watch list</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-heading font-semibold mt-8">Markdown Cadences</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg p-6">
                  <h4 className="font-heading font-semibold mb-3">Cadence A</h4>
                  <p className="text-sm mb-3">
                    <code className="font-mono">$X.00 → $X.06 → $X.03 → $0.01</code>
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">Timeframe: 2-4 weeks per stage</p>
                  <p className="text-sm text-muted-foreground">Common in: Hardware, Tools, Electrical</p>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <h4 className="font-heading font-semibold mb-3">Cadence B</h4>
                  <p className="text-sm mb-3">
                    <code className="font-mono">$X.00 → $X.04 → $X.02 → $0.01</code>
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">Timeframe: 1-3 weeks per stage</p>
                  <p className="text-sm text-muted-foreground">Common in: Seasonal, Garden, Holiday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
