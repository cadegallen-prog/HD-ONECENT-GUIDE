"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Info,
  Lightbulb,
  Search,
  ShoppingCart,
  Store,
  Users,
  XCircle,
} from "lucide-react";

export function GuideContent() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      {/* ============================================ */}
      {/* SECTION I: INTRODUCTION */}
      {/* ============================================ */}
      <section id="introduction" className="scroll-mt-24">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">I.</span> Introduction: What Are Penny Items?
        </h2>

        <p className="lead text-lg text-foreground">
          At Home Depot, a "penny item" refers to merchandise that rings up at <strong>$0.01</strong> due to internal inventory clearance systems — not public promotions.
        </p>

        <p>These aren't sales. They're items that:</p>
        <ul>
          <li>Have been chosen for removal from inventory</li>
          <li>Are no longer intended for sale</li>
          <li>Still happen to be on shelves because of oversight or delays</li>
        </ul>

        <p>
          This process is driven by <strong>Zero Margin Adjustment (ZMA)</strong> — a financial mechanism that reduces an item's value in the system to nearly zero. While these items are meant to be removed, some stay on the floor and can still be bought.
        </p>

        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-slate-900 dark:text-slate-100">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <strong>Important:</strong> This guide is based on consistent community reports and retail logic, not official Home Depot policy. Practices may vary by store.
          </AlertDescription>
        </Alert>
      </section>

      {/* ============================================ */}
      {/* SECTION II: CLEARANCE LIFECYCLE */}
      {/* ============================================ */}
      <section id="clearance-lifecycle" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">II.</span> Understanding the Clearance Lifecycle
        </h2>

        <p>
          At Home Depot, clearance items follow a markdown sequence that may eventually lead to the $0.01 "penny" status. While unofficial, two distinct markdown patterns — or <strong>Clearance Cadences</strong> — have been consistently seen by shoppers.
        </p>

        {/* Cadence A */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Clearance Cadence A (Approx. 13 Weeks)</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Price Ending</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Initial Markdown</TableCell>
                <TableCell><Badge variant="outline">.00</Badge></TableCell>
                <TableCell>~10–25% off</TableCell>
                <TableCell>4 weeks (est.)</TableCell>
                <TableCell>Enters clearance</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Second Markdown</TableCell>
                <TableCell><Badge variant="outline">.06</Badge></TableCell>
                <TableCell>~50% off</TableCell>
                <TableCell>~6 weeks</TableCell>
                <TableCell>Signals progression</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Final Markdown</TableCell>
                <TableCell><Badge variant="secondary">.03</Badge></TableCell>
                <TableCell>~75% off</TableCell>
                <TableCell>~3 weeks</TableCell>
                <TableCell>Last stage before removal</TableCell>
              </TableRow>
              <TableRow className="bg-green-50 dark:bg-green-950/30">
                <TableCell>System Update</TableCell>
                <TableCell><Badge className="bg-green-600">$0.01</Badge></TableCell>
                <TableCell>Internal</TableCell>
                <TableCell>—</TableCell>
                <TableCell>If not pulled, system marks as penny item</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Cadence B */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Clearance Cadence B (Approx. 7 Weeks)</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Price Ending</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Initial Markdown</TableCell>
                <TableCell><Badge variant="outline">.00</Badge></TableCell>
                <TableCell>~10–25% off</TableCell>
                <TableCell>1–2 weeks</TableCell>
                <TableCell>Starts clearance</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Second Markdown</TableCell>
                <TableCell><Badge variant="outline">.04</Badge></TableCell>
                <TableCell>~50% off</TableCell>
                <TableCell>~4 weeks</TableCell>
                <TableCell>Often missed by shoppers</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Final Markdown</TableCell>
                <TableCell><Badge variant="secondary">.02</Badge></TableCell>
                <TableCell>~75% off</TableCell>
                <TableCell>~2 weeks</TableCell>
                <TableCell>High likelihood of penny pricing next</TableCell>
              </TableRow>
              <TableRow className="bg-green-50 dark:bg-green-950/30">
                <TableCell>System Update</TableCell>
                <TableCell><Badge className="bg-green-600">$0.01</Badge></TableCell>
                <TableCell>Internal</TableCell>
                <TableCell>—</TableCell>
                <TableCell>System triggers penny status</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Price Ending Cheat Sheet */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Quick Reference: Price Ending Cheat Sheet</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price Ending</TableHead>
                <TableHead>What It Means</TableHead>
                <TableHead>Chance of Penny</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Badge variant="outline">.00</Badge></TableCell>
                <TableCell>First markdown, entering clearance</TableCell>
                <TableCell><span className="text-yellow-600 font-medium">Low</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">.06</Badge></TableCell>
                <TableCell>Second markdown (Cadence A)</TableCell>
                <TableCell><span className="text-orange-500 font-medium">Medium</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="secondary">.03</Badge></TableCell>
                <TableCell>Final markdown (Cadence A)</TableCell>
                <TableCell><span className="text-green-600 font-medium">High</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">.04</Badge></TableCell>
                <TableCell>Second markdown (Cadence B)</TableCell>
                <TableCell><span className="text-orange-500 font-medium">Medium</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="secondary">.02</Badge></TableCell>
                <TableCell>Final markdown (Cadence B)</TableCell>
                <TableCell><span className="text-green-600 font-medium">High</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">.97 / .98</Badge></TableCell>
                <TableCell>Regular sale price</TableCell>
                <TableCell><span className="text-red-500 font-medium">Extremely low</span></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Badge variant="outline">Others (e.g., .56)</Badge></TableCell>
                <TableCell>Inconsistent meaning</TableCell>
                <TableCell><span className="text-red-500 font-medium">Low — speculative only</span></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Alert className="mt-6">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Key Takeaways:</strong> Price endings matter — they signal where an item is in its markdown lifecycle. Watch the clearance tag date to estimate when the next drop may happen. Don't rely on fixed timing — while these cadences are common, store exceptions exist.
          </AlertDescription>
        </Alert>
      </section>

      {/* ============================================ */}
      {/* SECTION III: PRE-HUNT INTELLIGENCE */}
      {/* ============================================ */}
      <section id="digital-tools" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <Search className="h-6 w-6 text-orange-500" />
          <span className="text-orange-500">III.</span> Pre-Hunt Intelligence: Using Digital Tools
        </h2>

        <p>
          Before heading into a store, use Home Depot's app or website to scout items that might have reached penny status. It won't show you the $0.01 price directly — but it can give you signals that an item has been marked internally.
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-2">Step 1: Set Your Store</h4>
            <p className="text-sm text-foreground">
              In the app or online, set your specific store location. Inventory and pricing data is store-specific — wrong location = wrong info.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-2">Step 2: Search by SKU</h4>
            <p className="text-sm text-foreground">
              Find the SKU number on product packaging or clearance tag. Use that number in the Home Depot app or site search.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-2">Step 3: Interpret Results</h4>
            <p className="text-sm text-foreground">
              Use the chart below to decode what the listing might mean.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Interpreting Online Status</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Online Status</TableHead>
                <TableHead>What It Could Mean</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>In Stock + Clearance Price visible</TableCell>
                <TableCell>Still in clearance cycle, not pennied yet</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>In Stock + Full Price</TableCell>
                <TableCell>Still active inventory</TableCell>
              </TableRow>
              <TableRow className="bg-green-50 dark:bg-green-950/30">
                <TableCell className="font-medium">Out of Stock / Unavailable / Ship to Store Only + Full Price</TableCell>
                <TableCell><strong>Strong penny candidate</strong> — system may have pennied it, but it hasn't been removed from shelves yet</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Clearance price still showing online</TableCell>
                <TableCell>Not yet a penny item</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Alert className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 text-slate-900 dark:text-slate-100">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong>Important:</strong> If the system shows a full price but no stock, it might have already hit $0.01 internally and just hasn't been pulled.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold mt-8 mb-4">Limitations to Keep in Mind</h3>
        <ul>
          <li>Online data isn't real-time — there can be a delay of 1–2 days</li>
          <li>The penny price ($0.01) <strong>never shows online</strong></li>
          <li>You still need in-store confirmation to be sure — this is just a filtering step</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">When to Go In-Store</h3>
        <p>Only go check in person if:</p>
        <ul>
          <li>You've found an item that shows no local stock but is still listed online</li>
          <li>You're tracking the item based on its clearance cycle and tag date</li>
          <li>You've seen reports in penny shopping communities about that item pennied out recently</li>
        </ul>
      </section>

      {/* ============================================ */}
      {/* SECTION IV: IN-STORE HUNTING */}
      {/* ============================================ */}
      <section id="in-store-hunting" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <Store className="h-6 w-6 text-orange-500" />
          <span className="text-orange-500">IV.</span> In-Store Penny Hunting Strategies
        </h2>

        <p>
          Once you're in the store, your goal is to find penny-priced items that haven't yet been pulled from the shelves. These are usually clearance items that slipped through the cracks.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Where to Look</h3>
        
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Primary Hotspots</h4>
            <ul className="space-y-1 text-sm">
              <li>• Clearance endcaps</li>
              <li>• Aisles with yellow tags</li>
              <li>• Seasonal sections (especially post-season)</li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-3">Hidden Gems</h4>
            <ul className="space-y-1 text-sm">
              <li>• Bottom or top shelves in standard aisles</li>
              <li>• Back corners or dusty areas</li>
              <li>• Outdoor garden section (during seasonal changeovers)</li>
              <li>• Misplaced items left by customers</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">What to Look For</h3>
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

        <Alert className="my-6">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Watch for "known penny items" discussed in online communities — these often go chain-wide. "Store-specific" pennies usually result from returns, overstock, or untracked markdowns.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold mt-8 mb-4">How to Check the Price (Discreetly)</h3>
        
        <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 my-6 text-slate-900 dark:text-slate-100">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3">Best Method: Self-Checkout (SCO)</h4>
          <ol className="space-y-2">
            <li>1. Go to a SCO terminal with the item in hand</li>
            <li>2. Scan the manufacturer's UPC barcode — <strong>not the yellow clearance sticker</strong></li>
            <li>3. If it scans at $0.01, pay at once and print your receipt</li>
            <li>4. Stay low-key — don't draw attention to the screen</li>
          </ol>
        </div>

        <Alert variant="destructive" className="my-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Scanning the clearance tag can freeze the terminal and flag an employee.
          </AlertDescription>
        </Alert>

        <h4 className="font-semibold mt-6 mb-3">Backup Method: Ask for a Stock Check</h4>
        <p>If you must ask an employee:</p>
        <ul>
          <li>Look for one using a FIRST phone (orange handheld scanner)</li>
          <li>Say: "Can you do a stock check on this?" — <strong>not</strong> a price check</li>
          <li>Give them the SKU or show the UPC barcode</li>
          <li>Watch the screen discreetly: if it shows $0.01, "0" quantity, or an error — it's probably pennied</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">Overhead Items: High-Risk, Mixed Results</h3>
        <p>Items stored overhead present a unique challenge — and some real risks:</p>
        
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-2">Yellow Ladders (Customer Use)</h4>
            <p className="text-sm">Small yellow ladders (often in paint section) are for customer use. You can use these — just know they're visible and will draw attention.</p>
          </div>
          <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/30 border-red-200 text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold mb-2">Orange Ladders (Employee Only)</h4>
            <p className="text-sm">These are strictly for employees. Using them as a customer is against store policy and can escalate quickly.</p>
          </div>
        </div>

        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-slate-900 dark:text-slate-100">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <strong>Pro Tip:</strong> If you ask an employee to retrieve an overhead item, there's a 50/50 chance they'll scan it first. If it scans at $0.01, they'll likely say "This can't be sold" and that item will be removed from the floor entirely.
          </AlertDescription>
        </Alert>
      </section>

      {/* ============================================ */}
      {/* SECTION V: CHECKOUT CHALLENGE */}
      {/* ============================================ */}
      <section id="checkout" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <ShoppingCart className="h-6 w-6 text-orange-500" />
          <span className="text-orange-500">V.</span> The Checkout Challenge
        </h2>

        <p>
          You found a penny item. Now comes the tricky part: getting it through checkout without issues.
        </p>

        <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 my-6 text-slate-900 dark:text-slate-100">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">Preferred Method: Self-Checkout (SCO)</h3>
          <ol className="space-y-2">
            <li><strong>1.</strong> Have your payment ready before scanning</li>
            <li><strong>2.</strong> Go to a self-checkout kiosk where the attendant is distracted or busy</li>
            <li><strong>3.</strong> Scan only the UPC barcode on the item itself — <strong>not the yellow clearance tag</strong></li>
            <li><strong>4.</strong> Confirm it scans at $0.01</li>
            <li><strong>5.</strong> Pay immediately</li>
            <li><strong>6.</strong> Print your receipt — this is your proof of purchase</li>
            <li><strong>7.</strong> Exit calmly. Act like it's just another item in your cart</li>
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
          <li><strong>1.</strong> Add a "keeper" item to your cart</li>
          <li><strong>2.</strong> Ask a staff member to unlock the item</li>
          <li><strong>3.</strong> Politely direct them toward self-checkout</li>
          <li><strong>4.</strong> At SCO: Scan the keeper item first, then scan the suspected penny item. Staff may leave once the item is scanned.</li>
          <li><strong>5.</strong> Pay and print your receipt as usual</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-4">If You're Stopped by an Employee</h3>
        
        <div className="grid md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Do This
            </h4>
            <ul className="space-y-1 text-sm">
              <li>• Stay calm and polite</li>
              <li>• Finish payment if possible and print your receipt</li>
              <li>• Say: "That's just what it scanned for." or "I found it on the shelf and thought I'd buy it."</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/30 border-red-200 text-slate-900 dark:text-slate-100">
            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Don't Do This
            </h4>
            <ul className="space-y-1 text-sm">
              <li>• Admit you were looking for penny items</li>
              <li>• Get angry or argue</li>
              <li>• Cause a scene — it's not worth risking future visits</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">If They Demand the Item Back After Purchase</h4>
        <p>You can try:</p>
        <ul>
          <li>"I've completed the purchase and have my receipt. I'm not returning it."</li>
          <li>If pressed: "Can I speak with a manager for clarification on store policy?"</li>
        </ul>
        <p className="text-foreground text-sm mt-2">
          Some stores might honor it, others may confiscate it. Reactions vary.
        </p>
      </section>

      {/* ============================================ */}
      {/* SECTION VI: INSIDE SCOOP */}
      {/* ============================================ */}
      <section id="internal-operations" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">VI.</span> The Inside Scoop: Internal Operations
        </h2>

        <p>
          Understanding Home Depot's internal operations helps you grasp why penny items exist, why staff act the way they do, and how the system works behind the scenes.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Penny Items = Not Meant for Sale</h3>
        <p>
          Home Depot doesn't price things at $0.01 for customers — it's an internal accounting mechanism triggered by <strong>Zero Margin Adjustment (ZMA)</strong>.
        </p>
        <p>Why does it happen:</p>
        <ul>
          <li>Item is discontinued, damaged, expired, or no longer worth selling</li>
          <li>Store uses ZMA to reduce its system value to $0.01 (effectively zero)</li>
          <li>System flags it for removal from shelves — but sometimes it gets missed</li>
        </ul>

        <Alert className="my-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 text-slate-900 dark:text-slate-100">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            If an item is still on the floor at $0.01, it's likely due to oversight or staff backlog.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold mt-8 mb-4">Employee Policy: Strict Rules</h3>
        <ul>
          <li><strong>Employees are forbidden from buying penny items</strong> — doing so results in termination</li>
          <li>Many stores enforce a "24-hour rule": staff can't buy newly marked-down clearance until it's been on the floor for 24+ hours</li>
          <li>This prevents staff from hiding items for themselves</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">FIRST Phones & the Clearance App</h3>
        <p>
          Home Depot equips staff with handheld devices called FIRST phones. The <strong>Clearance App</strong> lets associates:
        </p>
        <ul>
          <li>See a list of clearance items, including penny-priced ones</li>
          <li>Filter by department, location, price, on-hand stock, and "no home" items</li>
          <li>Flag items for removal</li>
        </ul>
        <p className="text-foreground text-sm mt-2">
          This tool helps staff actively search for and remove penny items from the sales floor.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Why Management Cares So Much</h3>
        <p>Managers are pressured to remove penny items because they:</p>
        <ul>
          <li>Hurt shrink metrics (loss due to theft, damage, system errors)</li>
          <li>Signal poor inventory control</li>
          <li>Represent a financial loss (even at a penny, the system records a transaction)</li>
          <li>Disrupt inventory accuracy for automation and reorders</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">SOP Reality: Policy vs. Practice</h3>
        <p>Enforcement varies:</p>
        <ul>
          <li>Some managers will quietly honor the sale to avoid escalation</li>
          <li>Others will confiscate the item or cancel the transaction</li>
          <li>Some employees may even give it away as a "damaged out" freebie — rare, but it happens</li>
        </ul>
        <p className="font-medium mt-4">
          Same store, different shifts = different outcomes.
        </p>
      </section>

      {/* ============================================ */}
      {/* SECTION VII: FACT VS FICTION */}
      {/* ============================================ */}
      <section id="fact-vs-fiction" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">VII.</span> Research Deep Dive: Fact vs Fiction
        </h2>

        <p>
          Despite how widespread penny hunting has become, Home Depot has never publicly confirmed the full clearance-to-penny process. Most of what we know comes from community observations, shared screenshots and receipts, and logical deductions from how retail clearance cycles work.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">What's Real vs. What's Rumor</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Items go to $0.01</TableCell>
                <TableCell><Badge className="bg-green-600">True</Badge></TableCell>
                <TableCell>Via internal ZMA process</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Price endings predict markdowns</TableCell>
                <TableCell><Badge className="bg-green-600">True</Badge></TableCell>
                <TableCell>.06/.03 and .04/.02 are common sequences</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Penny items are "secret sales"</TableCell>
                <TableCell><Badge variant="destructive">False</Badge></TableCell>
                <TableCell>They're not intended for sale at all</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Home Depot honors the first scanned price</TableCell>
                <TableCell><Badge variant="secondary">Sometimes</Badge></TableCell>
                <TableCell>Depends on the manager</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Employees buy penny items</TableCell>
                <TableCell><Badge variant="destructive">False</Badge></TableCell>
                <TableCell>Against policy and grounds for termination</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Using ladders to get pennies is okay</TableCell>
                <TableCell><Badge variant="secondary">Depends</Badge></TableCell>
                <TableCell>Yellow ladder: yes. Orange ladder: employee-only (high risk)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stores will always sell penny items</TableCell>
                <TableCell><Badge variant="destructive">False</Badge></TableCell>
                <TableCell>Many will cancel the sale or remove the item</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Penny items show online</TableCell>
                <TableCell><Badge variant="destructive">False</Badge></TableCell>
                <TableCell>The $0.01 price never appears in the app or website</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">How Dependable Is Community Intel?</h3>
        <p>Very — but with a few caveats:</p>
        <ul>
          <li><strong>National penny items</strong> (brand-wide markdowns) are dependable across many stores</li>
          <li><strong>Store-specific pennies</strong> (returns, damaged goods, unpulled clearance) are hit-or-miss</li>
          <li>Community screenshots and shared receipts are gold — but dates matter</li>
        </ul>
        <p className="text-foreground text-sm mt-2">
          Always check timestamps on community posts. A penny item from 4 weeks ago may already be pulled or long gone.
        </p>
      </section>

      {/* ============================================ */}
      {/* SECTION VIII: RESPONSIBLE HUNTING */}
      {/* ============================================ */}
      <section id="responsible-hunting" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">VIII.</span> Responsible Penny Hunting
        </h2>

        <p>
          Penny hunting thrives on community, strategy, and discretion. Acting irresponsibly not only gets you shut down — it can cause stores to crack down harder on <strong>everyone</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">1. Be Respectful to Store Employees</h4>
            <p className="text-sm text-foreground">
              Even if you're frustrated, caught off-guard, or denied a penny sale: stay calm, stay polite, avoid confrontations. Staff are following orders — not making personal decisions against you.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">2. Don't Be Loud About Finds</h4>
            <p className="text-sm text-foreground">
              Getting loud, excited, or bragging at checkout draws attention. Don't show receipts to other customers, tell staff about your score, or film inside the store.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">3. Use Community Resources Wisely</h4>
            <p className="text-sm text-foreground">
              Share helpful info like UPCs, tag dates, or clearance cycles. Post accurate finds — not rumors. Don't flood groups with repeat questions.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">4. Know When to Walk Away</h4>
            <p className="text-sm text-foreground">
              If an employee or manager denies the sale, just move on. It's not worth getting banned from the store. Better to lose one item than burn access to future deals.
            </p>
          </div>
        </div>

        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-slate-900 dark:text-slate-100">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <strong>Reality Check:</strong> This is not a get-rich-quick game. Penny hunting requires time, patience, and a lot of empty trips. You might check 3 stores and find nothing. Don't expect huge savings every time — it's about the long game.
          </AlertDescription>
        </Alert>
      </section>

      {/* ============================================ */}
      {/* SECTION IX: CONCLUSION */}
      {/* ============================================ */}
      <section id="conclusion" className="scroll-mt-24 mt-16">
        <h2 className="flex items-center gap-2 text-2xl font-bold border-b pb-2">
          <span className="text-orange-500">IX.</span> Conclusion: Tips for Success
        </h2>

        <p>
          Whether you're just starting out or you've been hunting for a while, here's what matters most: <strong>know the system, stay patient, play it smart, and stay respectful.</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          {/* Beginners */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-4">For Beginners: Start Here</h3>
            
            <h4 className="font-medium mt-4 mb-2">Understand the Basics</h4>
            <ul className="text-sm space-y-1">
              <li>• Penny items are the last stage in Home Depot's clearance cycle</li>
              <li>• They're not meant for sale — they exist due to oversight</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">Use the App and Website</h4>
            <ul className="text-sm space-y-1">
              <li>• Set your store location before searching</li>
              <li>• Look for items showing "Out of Stock" but still listed at full price</li>
              <li>• Search by SKU or UPC when possible</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">In-Store Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Go straight to clearance endcaps and seasonal sections</li>
              <li>• Check price endings like .03/.02</li>
              <li>• Use self-checkout, scan the UPC, print your receipt</li>
              <li>• Don't scan the clearance tag</li>
            </ul>
          </div>

          {/* Experienced */}
          <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-lg border border-orange-200 text-slate-900 dark:text-slate-100">
            <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-4">For Experienced Hunters: Refine Your Game</h3>
            
            <h4 className="font-medium mt-4 mb-2">Know the Clearance Cadences</h4>
            <div className="text-sm space-y-1 font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
              <div>Cadence A: .00 → .06 → .03 → penny</div>
              <div>Cadence B: .00 → .04 → .02 → penny</div>
            </div>
            <p className="text-sm mt-2">Items usually follow these patterns over 7–13 weeks</p>

            <h4 className="font-medium mt-4 mb-2">Look Beyond the Obvious</h4>
            <ul className="text-sm space-y-1">
              <li>• Dig through misplaced inventory and dusty shelves</li>
              <li>• Don't ignore garden centers, paint, or seasonal aisles</li>
              <li>• Spot patterns when product lines get pulled storewide</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">Track Community Trends</h4>
            <ul className="text-sm space-y-1">
              <li>• Watch social media groups for confirmed penny items</li>
              <li>• Validate with dates and store locations</li>
              <li>• Avoid spreading unconfirmed rumors</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg text-center my-8 text-slate-900 dark:text-slate-100">
          <h3 className="text-xl font-semibold mb-3">Final Mindset</h3>
          <p className="text-foreground mb-4">
            Many hunters enjoy this for more than the savings: the thrill of the hunt, the satisfaction of outsmarting a system, and the camaraderie of a tight-knit, info-sharing community.
          </p>
          <p className="font-medium">
            But remember: one person's unruly behavior can ruin it for everyone. Stay sharp, stay respectful, and help keep the game alive.
          </p>
          <p className="text-lg font-semibold text-orange-600 dark:text-orange-400 mt-4">
            Penny hunting is part luck, part hustle, and all strategy. Treat it like a skill — not a shortcut.
          </p>
        </div>
      </section>
    </article>
  );
}
