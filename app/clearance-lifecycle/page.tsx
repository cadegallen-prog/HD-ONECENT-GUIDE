export default function ClearanceLifecyclePage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Understanding the Clearance Lifecycle
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              At Home Depot, clearance items follow a markdown sequence that may eventually lead to the $0.01 "penny" status. While unofficial, two distinct markdown patterns — or <strong>Clearance Cadences</strong> — have been consistently seen by shoppers.
            </p>

            {/* Clearance Cadence A */}
            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Clearance Cadence A (Approx. 13 Weeks)</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Stage</th>
                      <th className="border border-border p-3 text-left">Price Ending</th>
                      <th className="border border-border p-3 text-left">Discount</th>
                      <th className="border border-border p-3 text-left">Duration</th>
                      <th className="border border-border p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Initial Markdown</td>
                      <td className="border border-border p-3 font-mono">.00</td>
                      <td className="border border-border p-3">~10–25% off</td>
                      <td className="border border-border p-3">4 weeks (est.)</td>
                      <td className="border border-border p-3">Enters clearance</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Second Markdown</td>
                      <td className="border border-border p-3 font-mono">.06</td>
                      <td className="border border-border p-3">~50% off</td>
                      <td className="border border-border p-3">~6 weeks</td>
                      <td className="border border-border p-3">Signals progression</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Final Markdown</td>
                      <td className="border border-border p-3 font-mono">.03</td>
                      <td className="border border-border p-3">~75% off</td>
                      <td className="border border-border p-3">~3 weeks</td>
                      <td className="border border-border p-3">Last stage before removal</td>
                    </tr>
                    <tr className="bg-primary/10">
                      <td className="border border-border p-3 font-bold">System Update</td>
                      <td className="border border-border p-3 font-mono">N/A</td>
                      <td className="border border-border p-3 font-bold">$0.01</td>
                      <td className="border border-border p-3">Internal</td>
                      <td className="border border-border p-3 font-bold">If not pulled, system marks as penny item</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clearance Cadence B */}
            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Clearance Cadence B (Approx. 7 Weeks)</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Stage</th>
                      <th className="border border-border p-3 text-left">Price Ending</th>
                      <th className="border border-border p-3 text-left">Discount</th>
                      <th className="border border-border p-3 text-left">Duration</th>
                      <th className="border border-border p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">Initial Markdown</td>
                      <td className="border border-border p-3 font-mono">.00</td>
                      <td className="border border-border p-3">~10–25% off</td>
                      <td className="border border-border p-3">1–2 weeks</td>
                      <td className="border border-border p-3">Starts clearance</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Second Markdown</td>
                      <td className="border border-border p-3 font-mono">.04</td>
                      <td className="border border-border p-3">~50% off</td>
                      <td className="border border-border p-3">~4 weeks</td>
                      <td className="border border-border p-3">Often missed by shoppers</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Final Markdown</td>
                      <td className="border border-border p-3 font-mono">.02</td>
                      <td className="border border-border p-3">~75% off</td>
                      <td className="border border-border p-3">~2 weeks</td>
                      <td className="border border-border p-3">High likelihood of penny pricing next</td>
                    </tr>
                    <tr className="bg-primary/10">
                      <td className="border border-border p-3 font-bold">System Update</td>
                      <td className="border border-border p-3 font-mono">N/A</td>
                      <td className="border border-border p-3 font-bold">$0.01</td>
                      <td className="border border-border p-3">Internal</td>
                      <td className="border border-border p-3 font-bold">System triggers penny status</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
              <ul className="space-y-2">
                <li><strong>Price endings matter</strong> — they signal where an item is in its markdown lifecycle.</li>
                <li><strong>Watch the clearance tag date</strong> — use it to estimate when the next drop may happen.</li>
                <li><strong>Don't rely on fixed timing</strong> — while these cadences are common, store exceptions exist.</li>
              </ul>
            </div>

            {/* Quick Reference */}
            <h2 className="text-3xl font-heading font-bold mt-12 mb-6">Quick Reference: Price Ending Cheat Sheet</h2>
            <div className="overflow-x-auto mb-12">
              <table className="w-full border-collapse bg-card">
                <thead>
                  <tr className="bg-primary/20">
                    <th className="border border-border p-3 text-left">Price Ending</th>
                    <th className="border border-border p-3 text-left">What It Means</th>
                    <th className="border border-border p-3 text-left">Chance of Penny</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-mono font-bold">.00</td>
                    <td className="border border-border p-3">First markdown, entering clearance</td>
                    <td className="border border-border p-3 text-yellow-600 dark:text-yellow-400">Low</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border p-3 font-mono font-bold">.06</td>
                    <td className="border border-border p-3">Second markdown (Cadence A)</td>
                    <td className="border border-border p-3 text-orange-600 dark:text-orange-400">Medium</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono font-bold">.03</td>
                    <td className="border border-border p-3">Final markdown (Cadence A)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-bold">High</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border p-3 font-mono font-bold">.04</td>
                    <td className="border border-border p-3">Second markdown (Cadence B)</td>
                    <td className="border border-border p-3 text-orange-600 dark:text-orange-400">Medium</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono font-bold">.02</td>
                    <td className="border border-border p-3">Final markdown (Cadence B)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-bold">High</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="border border-border p-3 font-mono font-bold">.97 / .98</td>
                    <td className="border border-border p-3">Regular sale price</td>
                    <td className="border border-border p-3 text-red-600 dark:text-red-400">Extremely low</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono font-bold">Others (e.g., .56)</td>
                    <td className="border border-border p-3">Inconsistent meaning</td>
                    <td className="border border-border p-3 text-yellow-600 dark:text-yellow-400">Low — speculative only</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-8 border-t border-border">
              <a href="/what-are-pennies" className="text-primary hover:underline">← What Are Penny Items?</a>
              <a href="/digital-pre-hunt" className="text-primary hover:underline">Digital Pre-Hunt Strategies →</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
