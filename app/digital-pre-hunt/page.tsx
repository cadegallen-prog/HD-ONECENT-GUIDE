export default function DigitalPreHuntPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pre-Hunt Intelligence
          </h1>
          <p className="text-lg text-muted-foreground mb-8">Using Home Depot's Digital Tools</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl mb-8 leading-relaxed">
              Before heading into a store, use Home Depot's app or website to scout items that might have reached penny status. It won't show you the $0.01 price directly — but it can give you signals that an item has been marked internally.
            </p>

            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Step 1: Set Your Store Location</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>In the app or online, set your specific store location</li>
                <li>Inventory and pricing data is store-specific — wrong location = wrong info</li>
              </ul>
            </div>

            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Step 2: Search by SKU</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Find the SKU number on the product packaging or clearance tag</li>
                <li>Use that number in the Home Depot app or site search</li>
              </ul>
            </div>

            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Step 3: Interpret What You See</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-4">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Online Status</th>
                      <th className="border border-border p-3 text-left">What It Could Mean</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">In Stock + Clearance Price visible</td>
                      <td className="border border-border p-3">Still in clearance cycle, not pennied yet</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">In Stock + Full Price</td>
                      <td className="border border-border p-3">Still active inventory</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-bold">Out of Stock / Unavailable / Ship to Store Only + Full Price</td>
                      <td className="border border-border p-3 font-bold text-green-600 dark:text-green-400">Strong penny candidate — system may have pennied it</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border p-3">Clearance price still showing online</td>
                      <td className="border border-border p-3">Not yet a penny item</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
              <h3 className="text-xl font-bold mb-4">Important:</h3>
              <p>If the system shows a full price but no stock, it might have already hit $0.01 internally and just hasn't been pulled.</p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4">Limitations to Keep in Mind</h2>
            <ul className="list-disc list-inside space-y-2 mb-8">
              <li>Online data isn't real-time — there can be a delay of 1–2 days</li>
              <li>The penny price ($0.01) never shows online</li>
              <li>You still need in-store confirmation to be sure — this is just a filtering step</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4">When to Go In-Store</h2>
            <p className="mb-4">Only go check in person if:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>You've found an item that shows no local stock but is still listed online</li>
              <li>You're tracking the item based on its clearance cycle and tag date</li>
              <li>You've seen reports in penny shopping communities about that item pennied out recently</li>
            </ul>

            <div className="flex justify-between mt-12 pt-8 border-t border-border">
              <a href="/clearance-lifecycle" className="text-primary hover:underline">← Clearance Lifecycle</a>
              <a href="/in-store-strategy" className="text-primary hover:underline">In-Store Strategies →</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
