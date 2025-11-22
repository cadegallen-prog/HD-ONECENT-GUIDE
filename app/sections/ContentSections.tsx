"use client"

import { Download } from "lucide-react"

export function ContentSections() {
  return (
    <div className="space-y-16 py-12">
      {/* What Are Pennies */}
      <section id="what-are-pennies" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          What Are Penny Items?
        </h2>
        <div className="space-y-4 text-foreground">
          <p>
            "Penny items" are retail products that have completed Home Depot's clearance cycle
            and are marked down to $0.01 in the point-of-sale system. These items are no longer
            stocked, discontinued, or seasonal overstock that must be removed from inventory.
          </p>
          <p>
            The penny price serves as an internal signal to associates that the item should be
            removed from shelves and either returned to vendors, donated, or disposed of. However,
            if a penny item is still on the sales floor and scans at $0.01, Home Depot's policy
            is to sell it at that price.
          </p>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            How Items Reach Penny Status
          </h3>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Item is discontinued or seasonal cycle ends</li>
            <li>Corporate sets initial clearance markdown (usually .97 or .00 ending)</li>
            <li>Item follows one of two cadence patterns (A or B) through multiple markdowns</li>
            <li>Final markdown to $0.01 occurs when item must be cleared</li>
            <li>Item remains in system at $0.01 until physically removed from store</li>
          </ol>
        </div>
      </section>

      {/* Clearance Lifecycle */}
      <section id="clearance-lifecycle" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Clearance Lifecycle
        </h2>
        <div className="space-y-4 text-foreground">
          <p>
            Home Depot uses a structured clearance system with specific price endings that signal
            markdown depth. Understanding these patterns helps predict when items will reach penny.
          </p>

          <div className="callout-box warning">
            <p className="font-heading font-semibold">Important</p>
            <p className="text-sm mt-1">
              Clearance timing varies by store, region, and department. These patterns are general
              guidelines based on community observations, not official Home Depot policy.
            </p>
          </div>
        </div>
      </section>

      {/* Cadence Comparison */}
      <section id="cadence-comparison" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Markdown Cadence Comparison
        </h2>
        <div className="space-y-6">
          <p className="text-foreground">
            Items typically follow one of two markdown cadence patterns:
          </p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Cadence Type</th>
                <th>Price Progression</th>
                <th>Typical Timeframe</th>
                <th>Common Departments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge badge-high">Cadence A</span>
                </td>
                <td>
                  <code className="font-mono text-sm">$X.00 → $X.06 → $X.03 → $0.01</code>
                </td>
                <td>2-4 weeks per stage</td>
                <td>Hardware, Tools, Electrical</td>
              </tr>
              <tr>
                <td>
                  <span className="badge badge-medium">Cadence B</span>
                </td>
                <td>
                  <code className="font-mono text-sm">$X.00 → $X.04 → $X.02 → $0.01</code>
                </td>
                <td>1-3 weeks per stage</td>
                <td>Seasonal, Garden, Holiday</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            Price Ending Decoder
          </h3>

          <table className="data-table">
            <thead>
              <tr>
                <th>Price Ending</th>
                <th>Meaning</th>
                <th>Priority</th>
                <th>Next Step</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="font-mono">.01</code></td>
                <td>Penny item - clearance complete</td>
                <td><span className="badge badge-penny">Penny</span></td>
                <td>Buy immediately</td>
              </tr>
              <tr>
                <td><code className="font-mono">.03/.02</code></td>
                <td>Final markdown before penny</td>
                <td><span className="badge badge-high">High</span></td>
                <td>Monitor daily</td>
              </tr>
              <tr>
                <td><code className="font-mono">.06/.04</code></td>
                <td>Mid-clearance markdown</td>
                <td><span className="badge badge-medium">Medium</span></td>
                <td>Check weekly</td>
              </tr>
              <tr>
                <td><code className="font-mono">.00</code></td>
                <td>Initial clearance (rounded)</td>
                <td><span className="badge badge-low">Low</span></td>
                <td>Add to watch list</td>
              </tr>
              <tr>
                <td><code className="font-mono">.97/.98</code></td>
                <td>Promotional/regular markdown</td>
                <td><span className="badge badge-low">Low</span></td>
                <td>Not clearance cycle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Digital Tools */}
      <section id="digital-tools" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Digital Pre-Hunt Tools
        </h2>
        <div className="space-y-6 text-foreground">
          <p>
            Pre-scouting inventory online saves time and gas. The Home Depot app and website allow
            you to check item availability and pricing before visiting stores.
          </p>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            Using the Home Depot App
          </h3>

          <div className="step-guide">
            <div className="step-guide-item">
              <div className="step-number">1</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Set Your Store</h4>
                <p className="text-foreground">
                  Open the app and select your target store location. Pricing and availability are
                  store-specific.
                </p>
              </div>
            </div>

            <div className="step-guide-item">
              <div className="step-number">2</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Search by SKU or Name</h4>
                <p className="text-foreground">
                  Enter the SKU (internet number) or product name. SKUs from community finds are
                  most reliable.
                </p>
              </div>
            </div>

            <div className="step-guide-item">
              <div className="step-number">3</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Interpret Results</h4>
                <table className="data-table mt-4">
                  <thead>
                    <tr>
                      <th>App Status</th>
                      <th>What It Means</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>"Limited Stock"</td>
                      <td>1-3 units likely remain</td>
                      <td>Visit soon, call first</td>
                    </tr>
                    <tr>
                      <td>"Out of Stock"</td>
                      <td>System shows 0, may be misfiled</td>
                      <td>Check in-store anyway (hidden stock)</td>
                    </tr>
                    <tr>
                      <td>"In Stock"</td>
                      <td>4+ units available</td>
                      <td>Good candidate for visit</td>
                    </tr>
                    <tr>
                      <td>No price shown</td>
                      <td>Item discontinued/removed</td>
                      <td>Likely already cleared out</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="callout-box warning">
            <p className="font-heading font-semibold">App Limitations</p>
            <p className="text-sm mt-1">
              The app does not show penny prices. Items marked to $0.01 typically display as "See
              price in cart" or show the previous clearance price. You must scan in-store to
              confirm penny status.
            </p>
          </div>
        </div>
      </section>

      {/* In-Store Strategies */}
      <section id="in-store-strategies" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          In-Store Hunting Strategies
        </h2>
        <div className="space-y-6 text-foreground">
          <p>
            Successful penny hunting requires knowing where clearance items hide and how to
            efficiently scan potential finds.
          </p>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            High-Probability Locations
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Clearance Endcaps</h4>
              <p className="text-sm">
                Orange "clearance" signed endcaps at aisle ends. Check items with .03/.06 tags.
              </p>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Returns/Damaged Cart</h4>
              <p className="text-sm mb-2">
                Near customer service. Penny items often mixed with returns awaiting restocking.
              </p>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Back Corners & Dust</h4>
              <p className="text-sm">
                Forgotten items on back shelves, especially garden and seasonal aisles.
              </p>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Overhead Storage</h4>
              <p className="text-sm mb-2">
                Items on overhead racks (yellow/orange ladders). Ask associate for help - never
                climb yourself.
              </p>
              <div className="callout-box warning">
                <p className="text-xs font-heading font-semibold">Safety First</p>
                <p className="text-xs mt-1">
                  Do not attempt to retrieve overhead items yourself. This violates store policy
                  and creates liability. Ask an associate.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            Scanning Methods
          </h3>

          <p>Use the Home Depot app scanner or self-checkout (SCO) scanner:</p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>App scanner: Quick for checking many items, but less reliable for exact pricing</li>
            <li>
              SCO scanner: Most accurate for confirming penny status. Scan item as if purchasing.
            </li>
            <li>Price checker kiosks: Available in some stores, accuracy varies</li>
          </ul>
        </div>
      </section>

      {/* Checkout */}
      <section id="checkout" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Checkout Procedures
        </h2>
        <div className="space-y-6 text-foreground">
          <p>
            Professional checkout practices ensure smooth transactions and maintain positive
            relationships with store staff.
          </p>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            Step-by-Step Checkout Process
          </h3>

          <div className="step-guide">
            <div className="step-guide-item">
              <div className="step-number">1</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Choose Your Lane</h4>
                <p>
                  Self-checkout is fastest and least disruptive. For large quantities (10+ items),
                  use staffed register during off-peak hours.
                </p>
              </div>
            </div>

            <div className="step-guide-item">
              <div className="step-number">2</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Scan Items Normally</h4>
                <p>
                  Scan each penny item. They will ring up at $0.01. No special codes or tricks
                  required.
                </p>
              </div>
            </div>

            <div className="step-guide-item">
              <div className="step-number">3</div>
              <div>
                <h4 className="font-heading font-semibold mb-2">Complete Transaction</h4>
                <p>Pay the total (often under $1 for multiple items). Save receipt for records.</p>
              </div>
            </div>
          </div>

          <div className="callout-box warning">
            <h4 className="font-heading font-semibold mb-2">If Stopped by Staff</h4>
            <div className="mt-4">
              <p className="font-heading font-medium text-sm mb-2">Do:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Remain calm and polite</li>
                <li>Explain items scanned at $0.01</li>
                <li>Offer to show receipt or rescan</li>
                <li>Accept if manager voids transaction</li>
              </ul>

              <p className="font-heading font-medium text-sm mb-2 mt-4">Don't:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Argue or demand items</li>
                <li>Cite "policy" you read online</li>
                <li>Film staff without permission</li>
                <li>Return to same store same day if asked to leave</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            Understanding Barcode vs Tag Price
          </h3>

          <p>
            Home Depot systems prioritize barcode scan over physical tags. A clearance tag showing
            $5.03 may scan at $0.01 if further markdowns occurred.
          </p>
        </div>
      </section>

      {/* Internal Systems */}
      <section id="internal-systems" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Internal Systems Reference
        </h2>
        <div className="space-y-6 text-foreground">
          <p>
            Understanding Home Depot's internal tools provides context for how penny items are
            identified and processed by staff.
          </p>

          <div className="callout-box warning">
            <p className="font-heading font-semibold">Customer Access Limited</p>
            <p className="text-sm mt-1">
              These systems are for Home Depot associates only. This information is provided for
              educational understanding, not instruction to access employee tools.
            </p>
          </div>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            ZMA (Zero Margin Alert) Process
          </h3>

          <p>
            ZMA is the internal workflow for clearing penny items from the store:
          </p>

          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>System flags items marked to $0.01</li>
            <li>Report generates for store management</li>
            <li>Associates pull items from sales floor</li>
            <li>Items are staged for vendor return, donation, or disposal</li>
            <li>Items removed from inventory system</li>
          </ol>

          <p className="mt-4">
            <strong>For hunters:</strong> Items found before ZMA completion are legitimate purchases.
            Once ZMA is executed and items are physically pulled, that product is no longer available.
          </p>

          <h3 className="text-xl font-heading font-semibold mt-8 mb-4">
            FIRST Phone / Clearance App
          </h3>

          <p>
            Associates use FIRST phones (handheld devices) or the Clearance App to:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Check real-time inventory counts</li>
            <li>View item price history and markdown schedule</li>
            <li>Locate items via aisle/bay numbers</li>
            <li>Process ZMA pulls</li>
          </ul>
        </div>
      </section>

      {/* Facts vs Myths */}
      <section id="facts-vs-myths" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Facts vs Myths
        </h2>
        <div className="space-y-6">
          <p className="text-foreground">
            Penny hunting has accumulated many claims over the years. Here's what's verified:
          </p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Claim</th>
                <th>Verdict</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"Penny items are illegal to sell"</td>
                <td><span className="badge badge-false">False</span></td>
                <td>
                  Items that scan at register price are legal sales. No law prohibits this.
                </td>
              </tr>
              <tr>
                <td>"Stores must honor scanned price"</td>
                <td><span className="badge badge-varies">Varies</span></td>
                <td>
                  No federal law requires it. Some states have scanner accuracy laws. Store policy
                  generally honors scan price, but managers can refuse sale.
                </td>
              </tr>
              <tr>
                <td>"SKUs from Facebook always work"</td>
                <td><span className="badge badge-false">False</span></td>
                <td>
                  Penny status is store-specific. An SKU penny in Texas may be full price in Ohio.
                </td>
              </tr>
              <tr>
                <td>"Clearance follows predictable schedule"</td>
                <td><span className="badge badge-true">True</span></td>
                <td>
                  Patterns exist (.06→.03→.01 cadence), but timing varies by store, region, and
                  corporate decisions.
                </td>
              </tr>
              <tr>
                <td>"You can return penny items for credit"</td>
                <td><span className="badge badge-false">False</span></td>
                <td>
                  Returns credit the purchase price ($0.01), not current/original retail.
                </td>
              </tr>
              <tr>
                <td>"Associates get first pick"</td>
                <td><span className="badge badge-varies">Varies</span></td>
                <td>
                  Employees can purchase penny items on breaks, but policy prohibits holding items
                  for personal purchase during work hours.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Responsible Hunting */}
      <section id="responsible-hunting" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Responsible Hunting Practices
        </h2>
        <div className="space-y-6 text-foreground">
          <p>
            Maintaining access to penny shopping requires respect for stores, staff, and fellow
            hunters. Follow these guidelines:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Respect Store Staff</h4>
              <ul className="text-sm space-y-2">
                <li>• Don't interrogate associates about clearance schedules</li>
                <li>• Accept "no" if manager refuses penny sale</li>
                <li>• Avoid peak shopping hours for large hauls</li>
                <li>• Clean up if you move items while searching</li>
              </ul>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Hunt Quietly</h4>
              <ul className="text-sm space-y-2">
                <li>• Don't announce finds loudly in-store</li>
                <li>• Avoid bringing groups/meetups to hunt together</li>
                <li>• Don't share store-specific penny SKUs publicly (use group DMs)</li>
                <li>• Be discreet when scanning large quantities</li>
              </ul>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Share Responsibly</h4>
              <ul className="text-sm space-y-2">
                <li>• Share finds AFTER you've purchased, not before</li>
                <li>• Consider leaving some for others if quantity allows</li>
                <li>• Don't publicly post store addresses with active penny SKUs</li>
                <li>• Help new hunters learn strategies, not just SKU lists</li>
              </ul>
            </div>

            <div className="reference-card">
              <h4 className="font-heading font-semibold mb-3">Know When to Walk Away</h4>
              <ul className="text-sm space-y-2">
                <li>• If asked to leave, leave calmly</li>
                <li>• Don't return to a store that's banned you</li>
                <li>• If a store consistently refuses penny sales, find other locations</li>
                <li>• Penny hunting is a privilege, not a right</li>
              </ul>
            </div>
          </div>

          <div className="callout-box success mt-8">
            <p className="font-heading font-semibold">Community Guidelines</p>
            <p className="text-sm mt-2">
              The "Home Depot One Cent Items" Facebook group has 32,000+ members who have
              maintained access through respectful practices. Help preserve this by treating
              stores and staff well.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <h2 className="text-3xl font-heading font-semibold mb-6 text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              Is penny shopping legal?
            </h3>
            <p className="text-foreground">
              Yes. Purchasing items at their scanned register price is legal. Penny items are not
              "stolen" - they're legitimate clearance items that scan at $0.01. However, stores
              have the right to refuse any sale, and managers can void transactions at their
              discretion.
            </p>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              How often should I check for penny items?
            </h3>
            <p className="text-foreground">
              For best results, visit stores 1-2 times per week. Clearance markdowns often happen
              overnight on Tuesdays and Thursdays, but this varies by store. Seasonal transitions
              (end of summer, post-holiday) are high-activity periods.
            </p>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              Can I return penny items?
            </h3>
            <p className="text-foreground">
              Technically yes, but you'll only receive a $0.01 refund per item. Returns are
              credited at purchase price, not original retail. Attempting to return penny items
              for profit is considered fraud.
            </p>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              What if an item scans at $0.01 but the cashier says I can't buy it?
            </h3>
            <p className="text-foreground">
              Accept the decision and move on. Managers have discretion to refuse sales,
              especially if they suspect the item was missed during ZMA clearance. Arguing or
              citing "policy" often backfires and can result in store bans.
            </p>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              Are penny items damaged or defective?
            </h3>
            <p className="text-foreground">
              Not necessarily. Items go to penny status due to discontinuation, season end, or
              overstock - not quality issues. However, clearance items are sold as-is. Inspect
              before purchasing. Some penny items are customer returns or have damaged packaging
              but functional products.
            </p>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">
              Can I use penny shopping to start a resale business?
            </h3>
            <p className="text-foreground">
              While legal, this practice is frowned upon by the community and often leads to
              store restrictions. Many stores limit quantities specifically to prevent resellers
              from clearing shelves. If you resell, do so responsibly: don't hoard, don't clear
              entire inventories, and consider the impact on other hunters and genuine customers.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom PDF Download */}
      <div className="border-t border-border pt-8 mt-8">
        <div className="flex items-center justify-center">
          <a
            href="/Home-Depot-Penny-Guide.pdf"
            download="Home-Depot-Penny-Guide.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download this guide as PDF</span>
          </a>
        </div>
      </div>
    </div>
  )
}
