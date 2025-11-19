import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, Eye, DollarSign, AlertTriangle, CheckCircle, XCircle, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "In-Store Strategy - HD Penny Guide",
  description: "Learn proven strategies for finding penny items in Home Depot stores, including where to look, what to check, and how to do it discreetly.",
}

export default function InStoreStrategyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            The Art of In-Store Penny Hunting: Strategies That Work
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            You've done your digital homework. Now it's time to walk the aisles with purpose.
            This guide covers the proven strategies that separate successful penny hunters from
            frustrated shoppers wandering aimlessly.
          </p>
        </div>

        {/* Section 1: Where to Look */}
        <section className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Where to Look</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Not all store locations are created equal. Understanding traffic patterns and clearance
            positioning gives you a massive advantage.
          </p>

          <div className="space-y-6">
            {/* Primary Hotspots */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Primary Hotspots</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Endcaps
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The end of every aisle. These high-visibility spots often hold seasonal clearance
                    that's been marked down multiple times. Check both ends of the aisle.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Seasonal Aisles
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The dedicated seasonal section (usually near the entrance). After holidays, this
                    area gets ruthlessly cleared. Visit 2-3 weeks post-holiday for best results.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Back Corners
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The forgotten zones. Rear corners of departments (especially Garden, Hardware,
                    Electrical) accumulate orphaned clearance that employees forget to process.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Returns Cart/Area
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Usually near Customer Service. Returned items that are discontinued get sent to
                    clearance limbo. Check regularly; turnover is fast.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Garden Center (Outdoor)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The clearance goldmine. Seasonal plants, pots, outdoor decor, and tools get
                    heavily discounted. Check weekly during season transitions.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Clearance Racks/Tables
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Mobile displays strategically placed in high-traffic areas. Contents change
                    frequently. These are pre-sorted clearance—always worth a scan.
                  </p>
                </div>
              </div>
            </div>

            {/* Hidden Gems */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Hidden Gems</h3>
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    The "Wrong" Spot
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Items placed in completely random locations by customers or lazy employees. That
                    Halloween decoration in the Paint aisle in January? Probably a penny.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Bottom Shelves
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Everyone shops at eye level. Crouch down and check the bottom shelves, especially
                    in hardware and electrical. Discontinued items hide here.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Behind Other Products
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pennies get pushed to the back. If a shelf looks abnormally deep, reach behind
                    current stock. You'll be surprised what's been hiding for months.
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Near Receiving/Stockroom Doors
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Employees stage clearance here before processing. Some stores allow you to scan
                    these items (ask politely). High-value finds possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What to Look For */}
        <section className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">What to Look For</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Train your eye to spot the visual cues of clearance merchandise. These categories have
            the highest penny conversion rates.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-primary/20 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-primary/20 px-4 py-3 text-left font-bold">Category</th>
                  <th className="border border-primary/20 px-4 py-3 text-left font-bold">What to Scan</th>
                  <th className="border border-primary/20 px-4 py-3 text-left font-bold">Why It Works</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted/30">
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Seasonal Decor</td>
                  <td className="border border-primary/20 px-4 py-3">Halloween, Christmas, Easter items 2-3 weeks post-holiday</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Fast turnover; stores need space for next season</td>
                </tr>
                <tr>
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Outdoor/Garden</td>
                  <td className="border border-primary/20 px-4 py-3">Pots, planters, solar lights, garden tools, hoses</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Seasonal demand; heavy clearance in fall/winter</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Paint Supplies</td>
                  <td className="border border-primary/20 px-4 py-3">Brushes, rollers, trays, painter's tape, drop cloths</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Packaging changes frequently; old stock clears fast</td>
                </tr>
                <tr>
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Hardware</td>
                  <td className="border border-primary/20 px-4 py-3">Cabinet pulls, hooks, small tools, fastener sets</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Style trends change; discontinued finishes = pennies</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Lighting</td>
                  <td className="border border-primary/20 px-4 py-3">Light bulbs (especially CFLs), fixtures, LED strips</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Technology shifts (LED adoption) strand old inventory</td>
                </tr>
                <tr>
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Electrical</td>
                  <td className="border border-primary/20 px-4 py-3">Extension cords, switches, outlet covers, wire connectors</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Code updates and safety standards phase out products</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Damaged Packaging</td>
                  <td className="border border-primary/20 px-4 py-3">Anything with torn boxes, missing pieces, or cosmetic damage</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Can't sell at full price; gets marked down aggressively</td>
                </tr>
                <tr>
                  <td className="border border-primary/20 px-4 py-3 font-semibold">Discontinued Colors</td>
                  <td className="border border-primary/20 px-4 py-3">Paint, stains, caulk, grout in odd or outdated colors</td>
                  <td className="border border-primary/20 px-4 py-3 text-sm text-muted-foreground">Color palettes refresh annually; old shades clear out</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">Visual Cue Pro Tip</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Look for <strong>orange clearance stickers</strong> or items that seem "out of place"
                  for the current season. If you see Christmas lights in July, scan them. If you spot a
                  single lonely item with no price tag and dusty packaging, scan it. Trust your instincts—
                  if it looks forgotten, it probably is.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How to Check the Price (Discreetly) */}
        <section className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">How to Check the Price (Discreetly)</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            This is where amateurs get caught and banned. Scanning items isn't illegal, but there's
            a right way and a wrong way to do it without drawing attention.
          </p>

          <div className="space-y-6">
            {/* Primary Method: SCO */}
            <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Primary Method: Self-Checkout (SCO)
              </h3>
              <p className="text-muted-foreground mb-4">
                <strong>Why this works:</strong> You're literally at a register with a scanner.
                Nobody questions why you're scanning items.
              </p>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">Step 1: Position Yourself</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose an SCO machine away from the attendant. Corner machines are ideal. Pretend
                    you're shopping for something specific and happen to be "checking prices."
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">Step 2: The Casual Scan</h4>
                  <p className="text-sm text-muted-foreground">
                    Place 1-2 legitimate items in your cart (nuts/bolts, a single PVC fitting—anything
                    cheap and normal). Start an SCO transaction. Scan your penny candidates as if
                    you're adding them to your purchase. If it's $0.01, act natural and "change your mind"
                    (hit "Remove Item"). If it's not a penny, remove it.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">Step 3: Limit Your Greed</h4>
                  <p className="text-sm text-muted-foreground">
                    Scan <strong>no more than 5-7 items per session</strong>. If you find pennies,
                    complete your transaction with the legitimate item, leave, and return 20-30 minutes
                    later to actually purchase the pennies. Never scan 50 items in one go—that's how you
                    get flagged.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">Step 4: The Polite Abort</h4>
                  <p className="text-sm text-muted-foreground">
                    If an attendant approaches, smile and say "Just checking if this is the right size,
                    thanks!" Cancel the transaction politely and move on. Never argue or act defensive.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-green-50 dark:bg-green-950/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Success Rate:</strong> 90%+ when done correctly. This method is repeatable,
                    low-risk, and scales well across multiple stores.
                  </span>
                </p>
              </div>
            </div>

            {/* Backup Method: Price Checker Kiosks */}
            <div className="bg-muted/30 border border-primary/20 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Backup Method: Price Checker Kiosks
              </h3>
              <p className="text-muted-foreground mb-4">
                <strong>Why this works:</strong> These are designed for price checking. However, they're
                often in high-traffic areas and log scans.
              </p>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    When to Use
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    If SCO is crowded or being monitored. If you have 1-3 items max to check. If you're
                    willing to accept slightly higher risk.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    The Risk
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Some stores track kiosk scans. If you scan 20 items and only buy pennies, loss
                    prevention will notice. <strong>Use sparingly.</strong> Rotate between kiosks.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">The Technique</h4>
                  <p className="text-sm text-muted-foreground">
                    Scan quickly, take a mental note (or discreet phone note), and walk away. Don't linger.
                    Don't react if you find a penny. Poker face. Return later to purchase.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Caution:</strong> Only use kiosks if SCO isn't available. Limit to 3 scans
                    per visit. Space out visits to the same kiosk by at least a week.
                  </span>
                </p>
              </div>
            </div>

            {/* What NOT to Do */}
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-900 dark:text-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
                What NOT to Do (Instant Red Flags)
              </h3>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Never</strong> ask an employee "Is this a penny?" They will check, realize it is, and process it as damaged/unsellable.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Never</strong> use the Home Depot mobile app scanner in-store (it logs everything to your account).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Never</strong> scan items at a staffed register and then "decide not to buy" 47 times in a row.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Never</strong> carry a handheld barcode scanner you brought from home (yes, people have tried this).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Never</strong> brag to other customers about penny hunting. Loose lips sink ships.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Overhead Items */}
        <section className="bg-card border-2 border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold">Overhead Items: High-Risk, Mixed Results</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Some of the best penny finds are on top shelves or in overhead racks, but getting them
            requires employee help. This is the advanced game.
          </p>

          <div className="space-y-6">
            {/* Yellow Ladders */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🪜</span>
                Yellow Ladders (The Gamble)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Some stores have customer-accessible yellow ladders scattered around aisles. Using
                these is technically allowed but draws massive attention.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">The Upside</h4>
                  <p className="text-sm text-muted-foreground">
                    You can reach overhead items without asking for help. If you're quick and confident,
                    you can score high-value items (power tools, large planters, etc.) that have been
                    forgotten for months.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-red-700 dark:text-red-400">The Downside</h4>
                  <p className="text-sm text-muted-foreground">
                    Extremely conspicuous. Loss prevention watches ladder users like hawks. If you grab
                    an item, climb down, scan it, and put it back, they'll know exactly what you're doing.
                  </p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded p-3 border border-yellow-500/50">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    <strong>Verdict:</strong> Only use yellow ladders if you've already confirmed an item
                    is a penny (via app research or previous visit). Grab it, buy it, leave. Don't use
                    ladders for exploratory scanning.
                  </p>
                </div>
              </div>
            </div>

            {/* Big Orange Ladders */}
            <div className="bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🧰</span>
                Big Orange Ladders (Employee-Operated)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                The large rolling ladders operated by staff. You must ask an employee to get items down
                for you.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">When This Works</h4>
                  <p className="text-sm text-muted-foreground">
                    If you've done your homework and <em>know</em> a specific item is a penny, you can
                    politely ask an employee to retrieve it. Most won't question you if you're specific:
                    "Can you grab that green planter on the top shelf?" They get it down, you scan it at
                    SCO, and if it's a penny, you buy it.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-red-700 dark:text-red-400">When This Fails</h4>
                  <p className="text-sm text-muted-foreground">
                    If you ask for multiple items in one trip ("Can you get that down? And that? And that?"),
                    employees get suspicious. If the item scans for $0.01 at the register and the employee
                    sees it, they may pull it from sale.
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded p-3 border border-orange-500/50">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    <strong>Strategy:</strong> Only request 1-2 items per visit. Use different employees
                    each time. If it's a big-ticket item (like a $200 grill marked to $0.01), be prepared
                    for them to call a manager. Have a backup excuse ready ("I'll think about it, thanks!").
                  </p>
                </div>
              </div>
            </div>

            {/* Asking for Help */}
            <div className="bg-muted/30 border-2 border-primary/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Asking for Help: The Art of the Polite Request
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sometimes you need employee assistance, even for ground-level items (locked cases,
                heavy items, etc.). Here's how to not blow your cover.
              </p>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">The Script</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Keep it simple and specific. Avoid sounding like a penny hunter.
                  </p>
                  <div className="bg-primary/5 rounded p-3 font-mono text-sm">
                    <p className="mb-1"><strong className="text-green-600">Good:</strong> "Excuse me, can you help me grab that toolset on the top shelf?"</p>
                    <p><strong className="text-red-600">Bad:</strong> "Are there any clearance items up there? Can you check all of them for me?"</p>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">The Poker Face</h4>
                  <p className="text-sm text-muted-foreground">
                    When they hand you the item, inspect it casually (as if checking condition), thank
                    them, and walk away. <strong>Never scan it in front of them.</strong> Walk to a
                    different aisle, scan at SCO, and return later to purchase if it's a penny.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-4 border border-primary/10">
                  <h4 className="font-bold mb-2">The Graceful Exit</h4>
                  <p className="text-sm text-muted-foreground">
                    If you scan the item and it's NOT a penny, just leave it on a shelf somewhere (not
                    randomly—put it back respectfully or on a returns cart). Don't make a scene. Don't
                    complain about the price. Just move on.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Pro Tip:</strong> Build rapport with regular employees by being polite and
                  respectful on <em>every visit</em>, not just when you need help. If they recognize you
                  as "that nice customer," they're far less likely to question you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Location Is Everything</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on endcaps, seasonal aisles, and forgotten corners. Check bottom shelves and
                  behind current stock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Master the SCO Method</h4>
                <p className="text-sm text-muted-foreground">
                  Self-checkout is your best friend. Scan discreetly, limit yourself to 5-7 items per
                  session, and always have a cover purchase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Know What to Hunt</h4>
                <p className="text-sm text-muted-foreground">
                  Seasonal decor, garden items, and discontinued products have the highest penny rates.
                  Look for damaged packaging and odd colors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Overhead = Advanced Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Only pursue overhead items if you've pre-confirmed they're pennies. Use yellow ladders
                  sparingly and employee help strategically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Stay Under the Radar</h4>
                <p className="text-sm text-muted-foreground">
                  Never ask "Is this a penny?" Never scan 50 items in one session. Never use the mobile
                  app in-store. Poker face always.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Respect the Process</h4>
                <p className="text-sm text-muted-foreground">
                  Be courteous to employees. Don't make messes. Don't argue. The moment you become "that
                  person," you're done.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex items-center justify-between pt-8 border-t-2 border-primary/20">
          <Link
            href="/digital-pre-hunt"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <div className="text-left">
              <div className="text-xs uppercase tracking-wide">Previous</div>
              <div className="font-semibold">Digital Pre-Hunt</div>
            </div>
          </Link>

          <Link
            href="/checkout-strategy"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide">Next</div>
              <div className="font-semibold">Checkout Strategy</div>
            </div>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>

      </div>
    </main>
  )
}
