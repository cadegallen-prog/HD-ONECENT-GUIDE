export default function WhatArePenniesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            What Are Penny Items?
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              At Home Depot, a "penny item" refers to merchandise that rings up at $0.01 due to internal inventory clearance systems — not public promotions.
            </p>

            <div className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
              <p className="text-lg font-semibold mb-4">These aren't sales. They're items that:</p>
              <ul className="space-y-2 text-base list-disc list-inside">
                <li>Have been chosen for removal</li>
                <li>Are no longer intended for sale</li>
                <li>Still happen to be on shelves because of oversight or delays</li>
              </ul>
            </div>

            <h2 className="text-3xl font-heading font-bold mt-12 mb-4">The Zero Margin Adjustment (ZMA)</h2>
            <p className="text-lg leading-relaxed mb-6">
              This process is driven by <strong>Zero Margin Adjustment (ZMA)</strong> — a financial mechanism that reduces an item's value in the system to nearly zero. While these items are meant to be removed, some stay on the floor and can still be bought.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
              <p className="text-base font-semibold text-amber-900 dark:text-amber-200">
                <strong>Important:</strong> This guide is based on consistent community reports and retail logic, not official Home Depot policy. Practices may vary by store.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Next in the guide:</p>
              <a
                href="/clearance-lifecycle"
                className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
              >
                Understanding the Clearance Lifecycle
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
