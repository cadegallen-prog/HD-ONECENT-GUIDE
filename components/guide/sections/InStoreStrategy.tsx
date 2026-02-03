import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

export function InStoreStrategy() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION IV: IN-STORE HUNTING */}
      {/* ============================================ */}
      <section id="in-store-hunting" className="scroll-mt-28">
        <p>
          Once you're in the store, your goal is to find penny-priced items that haven't yet been
          pulled from the shelves. These are usually clearance items that slipped through the
          cracks.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Where to Look</h2>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-default)]">
            <h4 className="font-semibold mb-3 text-[var(--cta-primary)]">Primary Hotspots</h4>
            <ul className="space-y-3 text-sm">
              <li>Original aisle/bay location (check the label for Aisle/Bay number)</li>
              <li>Yellow clearance tags scattered throughout regular aisles</li>
              <li>Seasonal sections (especially post-season)</li>
              <li>Overhead storage (see Section II-C)</li>
            </ul>
          </div>
          <div className="bg-[var(--bg-elevated)] p-4 rounded-lg border border-[var(--border-default)]">
            <h4 className="font-semibold mb-3">Hidden Gems</h4>
            <ul className="space-y-3 text-sm">
              <li>Bottom or top shelves in standard aisles</li>
              <li>Back corners or dusty areas</li>
              <li>Outdoor garden section (during seasonal changeovers)</li>
              <li>Misplaced items left by customers</li>
            </ul>
          </div>
        </div>

        <div className="callout callout-sky callout-compact my-6">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">📍</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] mb-2">
                Clearance Endcaps Are Disappearing
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Most stores are phasing out clearance endcaps (EC) and keeping clearance items in
                their original aisle locations instead. Some stores still have them, but don't rely
                on finding a dedicated clearance section anymore — you'll need to hunt aisle by
                aisle.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What to Look For</h2>
        <p>Certain categories tend to hit penny status more often:</p>
        <div className="flex flex-wrap gap-2 my-4">
          <Badge>Hardware</Badge>
          <Badge>Lighting</Badge>
          <Badge>Electrical parts</Badge>
          <Badge>Paint accessories</Badge>
          <Badge>Seasonal leftovers</Badge>
          <Badge>Discontinued items</Badge>
          <Badge>Brand transitions</Badge>
        </div>

        <div className="callout callout-sky callout-compact my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">💡</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)]">Tip:</div>
              <p className="callout-body">
                Watch for "known penny items" discussed in online communities - these often go
                chain-wide. "Store-specific" pennies usually result from returns, overstock, or
                untracked markdowns.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Check the Price (Discreetly)</h2>

        <div className="content-panel space-y-4 my-6">
          <h4 className="font-semibold text-[var(--status-success)]">
            Best Method: Self-Checkout (SCO)
          </h4>
          <ol className="space-y-2">
            <li>1. Go to a SCO terminal with the item in hand</li>
            <li>
              2. Scan the manufacturer's UPC barcode -{" "}
              <strong>not the yellow clearance sticker</strong>
            </li>
            <li>3. If it scans at $0.01, pay at once and print your receipt</li>
            <li>4. Stay low-key - don't draw attention to the screen</li>
          </ol>
          <div className="callout callout-sky callout-compact mt-4 mb-0">
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                  <span>Warning:</span>
                </div>
                <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                  Scanning the clearance tag can freeze the terminal and flag an employee.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-panel space-y-4 mt-6">
          <h4 className="font-semibold">Backup Method: Ask for a Stock Check</h4>
          <p>If you must ask an employee:</p>
          <ul>
            <li>Look for one using a FIRST phone (orange handheld scanner)</li>
            <li>
              Say: "Can you do a stock check on this?" - <strong>not</strong> a price check
            </li>
            <li>Give them the SKU or show the UPC barcode</li>
            <li>
              Watch the screen discreetly: if it shows $0.01, "0" quantity, or an error - it's
              probably pennied
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Overhead Items: High-Risk, Mixed Results
        </h2>
        <div className="content-panel space-y-6">
          <p>Items stored overhead present a unique challenge - and some real risks:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-[var(--bg-elevated)] border-[var(--border-default)]">
              <h4 className="font-semibold mb-2">Yellow Ladders (Customer Use)</h4>
              <p className="text-sm">
                Small yellow ladders (often in paint section) are for customer use. You can use
                these - just know they're visible and will draw attention.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-[var(--bg-elevated)] border-[var(--border-default)]">
              <h4 className="font-semibold mb-2">Orange Ladders (Employee Only)</h4>
              <p className="text-sm">
                These are strictly for employees. Using them as a customer is against store policy
                and can escalate quickly.
              </p>
            </div>
          </div>

          <div className="callout callout-sky callout-compact mt-2 mb-0">
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none">💡</span>
              <div>
                <div className="font-bold text-[var(--cta-primary)]">Pro Tip:</div>
                <p className="callout-body">
                  If you ask an employee to retrieve an overhead item, there's a 50/50 chance
                  they'll scan it first. If it scans at $0.01, they'll likely say "This can't be
                  sold" and that item will be removed from the floor entirely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION V: CHECKOUT CHALLENGE */}
      {/* ============================================ */}
      <section id="checkout" className="scroll-mt-28">
        <h2 className="section-heading">The Checkout Challenge</h2>
        <p>
          You found a penny item. Now comes the tricky part: getting it through checkout without
          issues.
        </p>

        <div className="bg-[var(--bg-elevated)] p-6 rounded-lg border border-[var(--border-default)] my-6">
          <h3 className="text-lg font-semibold text-[var(--status-success)] mb-4">
            Preferred Method: Self-Checkout (SCO)
          </h3>
          <ol className="space-y-2">
            <li>
              <strong>1.</strong> Have your payment ready before scanning
            </li>
            <li>
              <strong>2.</strong> Go to a self-checkout kiosk where the attendant is distracted or
              busy
            </li>
            <li>
              <strong>3.</strong> Scan only the UPC barcode on the item itself -{" "}
              <strong>not the yellow clearance tag</strong>
            </li>
            <li>
              <strong>4.</strong> Confirm it scans at $0.01
            </li>
            <li>
              <strong>5.</strong> Pay immediately
            </li>
            <li>
              <strong>6.</strong> Print your receipt - this is your proof of purchase
            </li>
            <li>
              <strong>7.</strong> Exit calmly. Act like it's just another item in your cart
            </li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Optional Trick: Use a "Keeper Item"</h3>
        <p>Add a small, inexpensive item you plan to buy:</p>
        <ul>
          <li>Makes your transaction look more normal</li>
          <li>Distracts attention from a suspicious $0.01 item</li>
          <li>Useful when checking out with help or retrieving items from locked displays</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Multiple Penny Items?</h3>
        <ul>
          <li>You can buy multiple units of the same penny SKU in one transaction</li>
          <li>Don't scan different SKUs together unless you want extra attention</li>
          <li>When in doubt: one penny SKU per checkout</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Locked Case or Cage Items</h3>
        <ol className="space-y-2">
          <li>
            <strong>1.</strong> Add a "keeper" item to your cart
          </li>
          <li>
            <strong>2.</strong> Ask a staff member to unlock the item
          </li>
          <li>
            <strong>3.</strong> Politely direct them toward self-checkout
          </li>
          <li>
            <strong>4.</strong> At SCO: Scan the keeper item first, then scan the suspected penny
            item. Staff may leave once the item is scanned.
          </li>
          <li>
            <strong>5.</strong> Pay and print your receipt as usual
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-4">If You're Stopped by an Employee</h3>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-lg border bg-[var(--bg-elevated)] border-[var(--border-default)]">
            <h4 className="font-semibold text-[var(--status-success)] mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Do This
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Stay calm and polite</li>
              <li>Finish payment if possible and print your receipt</li>
              <li>
                Say: "That's just what it scanned for." or "I found it on the shelf and thought I'd
                buy it."
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border bg-[var(--bg-elevated)] border-[var(--border-default)]">
            <h4 className="font-semibold text-[var(--status-error)] mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Don't Do This
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Admit you were looking for penny items</li>
              <li>Get angry or argue</li>
              <li>Cause a scene - it's not worth risking future visits</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">If They Demand the Item Back After Purchase</h4>
        <p>You can try:</p>
        <ul>
          <li>"I've completed the purchase and have my receipt. I'm not returning it."</li>
          <li>If pressed: "Can I speak with a manager for clarification on store policy?"</li>
        </ul>
        <p className="text-muted-foreground text-sm mt-2">
          Some stores might honor it, others may confiscate it. Reactions vary.
        </p>
      </section>
    </article>
  )
}
