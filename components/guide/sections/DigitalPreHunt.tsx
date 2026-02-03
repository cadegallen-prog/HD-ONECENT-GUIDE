import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, Search, XCircle } from "lucide-react"

export function DigitalPreHunt() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION III: PRE-HUNT INTELLIGENCE */}
      {/* ============================================ */}
      <section id="digital-tools" className="scroll-mt-28">
        <h2 className="section-heading">
          <Search className="h-6 w-6 text-[var(--text-muted)]" />
          <span className="text-[var(--text-primary)]">III.</span> Pre-Hunt Intelligence: Using
          Digital Tools
        </h2>

        <p>
          Before heading into a store, use Home Depot's app or website to scout items that might
          have reached penny status. It won't show you the $0.01 price directly - but it can give
          you signals that an item has been marked internally.
        </p>

        <div className="step-grid">
          <div className="step-card">
            <div className="step-badge">1</div>
            <div className="step-title">Set Your Store</div>
            <p className="step-desc">
              In the app or online, set your specific store location. Inventory and pricing data is
              store-specific - wrong location = wrong info.
            </p>
          </div>
          <div className="step-card">
            <div className="step-badge">2</div>
            <div className="step-title">Search by SKU</div>
            <p className="step-desc">
              Find the SKU number on product packaging or clearance tag. Use that number in the Home
              Depot app or site search.
            </p>
          </div>
          <div className="step-card">
            <div className="step-badge">3</div>
            <div className="step-title">Interpret Results</div>
            <p className="step-desc">Use the chart below to decode what the listing might mean.</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Interpreting Online Status</h3>
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
            <TableRow className="bg-[var(--bg-elevated)]">
              <TableCell className="font-medium">
                Out of Stock / Unavailable / Ship to Store Only + Full Price
              </TableCell>
              <TableCell>
                <strong>Strong penny candidate</strong> - system may have pennied it, but it hasn't
                been removed from shelves yet
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Clearance price still showing online</TableCell>
              <TableCell>Not yet a penny item</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)] rounded-lg p-5 my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Important:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                If the system shows a full price but no stock, it might have already hit $0.01
                internally and just hasn't been pulled.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Limitations to Keep in Mind</h3>
        <ul>
          <li>Online data isn't real-time - there can be a delay of 1-2 days</li>
          <li>
            The penny price ($0.01) <strong>never shows online</strong>
          </li>
          <li>You still need in-store confirmation to be sure - this is just a filtering step</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">When to Go In-Store</h3>
        <p>Only go check in person if:</p>
        <ul>
          <li>You've found an item that shows no local stock but is still listed online</li>
          <li>You're tracking the item based on its clearance cycle and tag date</li>
          <li>
            You've seen reports in penny shopping communities about that item pennied out recently
          </li>
        </ul>
      </section>

      {/* ============================================ */}
      {/* SECTION III-A: HOW TO VERIFY PENNY STATUS IN-STORE */}
      {/* ============================================ */}
      <section id="verify-penny-status" className="scroll-mt-28 space-y-6">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">III-A.</span> How to Verify Penny Status
          In-Store
        </h2>
        <p className="text-[var(--text-secondary)]">
          The only way to confirm if an item is truly at $0.01 is by getting an employee to scan the
          barcode or look up the SKU. Here's the safest way to do it without losing the item.
        </p>

        {/* The Right Way */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--cta-primary)] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            The Right Way (Low Risk)
          </h3>
          <div className="step-grid">
            <div className="step-card">
              <div className="step-badge">1</div>
              <div className="step-title">Don't Bring the Item</div>
              <p className="step-desc">
                Take a photo of the barcode/SKU label — but leave the item on the shelf. This is
                critical.
              </p>
            </div>
            <div className="step-card">
              <div className="step-badge">2</div>
              <div className="step-title">Find a Zebra</div>
              <p className="step-desc">
                Look for an employee with a "Zebra" device (looks like a phone, sometimes orange).
                This is the scanning tool they use for inventory.
              </p>
            </div>
            <div className="step-card">
              <div className="step-badge">3</div>
              <div className="step-title">Ask for a "Stock Check"</div>
              <p className="step-desc">
                Say: <em>"Can you check if this item is in stock?"</em> or{" "}
                <em>"Can you look up this SKU?"</em> — show them the photo of the barcode or give
                them the SKU number.
              </p>
            </div>
            <div className="step-card">
              <div className="step-badge">4</div>
              <div className="step-title">Read the Outcome</div>
              <p className="step-desc">
                If it scans as <strong>$0.01</strong>: They'll likely say it can't be sold or
                they'll go pull it from the shelf. Play it off: "Oh, guess it's not here then."
                <br />
                If it's <strong>NOT a penny</strong>: You can walk away — no item lost, no
                suspicion.
              </p>
            </div>
          </div>
        </div>

        {/* The Wrong Way */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            The Wrong Way (High Risk)
          </h3>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-5">
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Bringing the item to them directly</strong> — if they scan it and it's a
                  penny, they'll take it immediately.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Asking them to pull overhead items first</strong> — Zebra devices can scan
                  from the floor. If they scan before pulling, you lose it.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Asking for a "price check"</strong> — this signals you're trying to buy
                  it, making them more likely to confiscate it if it's a penny.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Self-Checkout Strategy */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Self-Checkout: The Fastest Path
          </h3>
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-5 space-y-3">
            <p className="text-[var(--text-secondary)]">
              If you're confident an item is a penny (based on the Community Penny List or your own
              research), skip verification and go straight to self-checkout:
            </p>
            <ol className="space-y-2 text-sm text-[var(--text-secondary)] ml-4">
              <li>
                <strong>1. Scan the UPC barcode</strong> (the manufacturer barcode on the product,
                NOT the yellow clearance sticker)
              </li>
              <li>
                <strong>2. Pay immediately</strong> — don't hesitate, don't review the screen slowly
              </li>
              <li>
                <strong>3. Leave quickly and quietly</strong> — the faster you're out, the less
                attention you draw
              </li>
            </ol>
            <div className="callout callout-sky callout-compact mt-4 mb-0">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">💡</span>
                <div>
                  <div className="font-bold text-[var(--cta-primary)] mb-2">Pro Tips:</div>
                  <ul className="text-[var(--text-secondary)] space-y-1 text-sm">
                    <li>
                      • Use <strong>Home Depot Pro Pass</strong> if you have one (scan pass → items
                      → pay in 2 taps)
                    </li>
                    <li>
                      • Time your checkout when <strong>other customers</strong> are checking out
                      (less staff attention)
                    </li>
                    <li>
                      • Avoid scanning the yellow clearance label — it can freeze the terminal and
                      call a manager
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* When to Walk Away */}
        <div className="callout callout-sky callout-compact mt-8">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] mb-2">When to Walk Away:</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If an employee makes a fuss or refuses to sell, leave it. No penny item is worth an
                argument or being banned from the store. There will always be more penny finds — the
                goal is to stay in the game long-term.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
