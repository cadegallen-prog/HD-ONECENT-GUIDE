import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, Search, ShoppingCart, Store, XCircle } from "lucide-react"
import { EzoicPlaceholder } from "@/components/ezoic-placeholder"
import { AD_SLOTS } from "@/lib/ads"

export function GuideContent() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION I: INTRODUCTION */}
      {/* ============================================ */}
      <section id="introduction" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">I.</span> Introduction: What Are Penny Items?
        </h2>

        <p className="lead text-lg text-[var(--text-secondary)]">
          At Home Depot, a "penny item" refers to merchandise that rings up at{" "}
          <strong>$0.01</strong> due to internal inventory clearance systems - not public
          promotions.
        </p>

        <p>These aren't sales. They're items that:</p>
        <ul>
          <li>Have been chosen for removal from inventory</li>
          <li>Are no longer intended for sale</li>
          <li>Still happen to be on shelves because of oversight or delays</li>
        </ul>

        <p>
          This process is driven by <strong>Zero Margin Adjustment (ZMA)</strong> - a financial
          mechanism that reduces an item's value in the system to nearly zero. While these items are
          meant to be removed, some stay on the floor and can still be bought.
        </p>

        <div className="callout callout-sky callout-compact my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Important:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                This guide is based on consistent community reports and retail logic, not official
                Home Depot policy. Practices may vary by store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION II: CLEARANCE LIFECYCLE */}
      {/* ============================================ */}
      <section id="clearance-lifecycle" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">II.</span> Understanding the Clearance
          Lifecycle
        </h2>

        <p>
          At Home Depot, clearance items follow a markdown sequence that may eventually lead to the
          $0.01 "penny" status. While unofficial, two distinct markdown patterns - or{" "}
          <strong>Clearance Cadences</strong> - have been consistently seen by shoppers.
        </p>

        {/* Cadence A */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Clearance Cadence A (Approx. 13 Weeks)</h3>
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
              <TableCell>
                <span className="price-chip">.00</span>
              </TableCell>
              <TableCell>~10-25% off</TableCell>
              <TableCell>4 weeks (est.)</TableCell>
              <TableCell>Enters clearance</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Second Markdown</TableCell>
              <TableCell>
                <span className="price-chip">.06</span>
              </TableCell>
              <TableCell>~50% off</TableCell>
              <TableCell>~6 weeks</TableCell>
              <TableCell>Signals progression</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Final Markdown</TableCell>
              <TableCell>
                <span className="price-chip">.03</span>
              </TableCell>
              <TableCell>~75% off</TableCell>
              <TableCell>~3 weeks</TableCell>
              <TableCell>Last stage before removal</TableCell>
            </TableRow>
            <TableRow className="bg-[var(--bg-elevated)]">
              <TableCell>System Update</TableCell>
              <TableCell>
                <span className="price-chip font-semibold">$0.01</span>
              </TableCell>
              <TableCell>Internal</TableCell>
              <TableCell>-</TableCell>
              <TableCell>If not pulled, system marks as penny item</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Cadence B */}
        <h3 className="text-xl font-semibold mt-8 mb-4">Clearance Cadence B (Approx. 7 Weeks)</h3>
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
              <TableCell>
                <span className="price-chip">.00</span>
              </TableCell>
              <TableCell>~10-25% off</TableCell>
              <TableCell>1-2 weeks</TableCell>
              <TableCell>Starts clearance</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Second Markdown</TableCell>
              <TableCell>
                <span className="price-chip">.04</span>
              </TableCell>
              <TableCell>~50% off</TableCell>
              <TableCell>~4 weeks</TableCell>
              <TableCell>Often missed by shoppers</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Final Markdown</TableCell>
              <TableCell>
                <span className="price-chip">.02</span>
              </TableCell>
              <TableCell>~75% off</TableCell>
              <TableCell>~2 weeks</TableCell>
              <TableCell>High likelihood of penny pricing next</TableCell>
            </TableRow>
            <TableRow className="bg-[var(--bg-elevated)]">
              <TableCell>System Update</TableCell>
              <TableCell>
                <span className="price-chip font-semibold">$0.01</span>
              </TableCell>
              <TableCell>Internal</TableCell>
              <TableCell>-</TableCell>
              <TableCell>System triggers penny status</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Price Ending Cheat Sheet */}
        <h3 className="text-xl font-semibold mt-8 mb-4">
          Quick Reference: Price Ending Cheat Sheet
        </h3>
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
              <TableCell>
                <span className="price-chip">.00</span>
              </TableCell>
              <TableCell>First markdown, entering clearance</TableCell>
              <TableCell>
                <span className="priority-badge low">Low</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">.06</span>
              </TableCell>
              <TableCell>Second markdown (Cadence A)</TableCell>
              <TableCell>
                <span className="priority-badge medium">Medium</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">.03</span>
              </TableCell>
              <TableCell>Final markdown (Cadence A)</TableCell>
              <TableCell>
                <span className="priority-badge high">High</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">.04</span>
              </TableCell>
              <TableCell>Second markdown (Cadence B)</TableCell>
              <TableCell>
                <span className="priority-badge medium">Medium</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">.02</span>
              </TableCell>
              <TableCell>Final markdown (Cadence B)</TableCell>
              <TableCell>
                <span className="priority-badge high">High</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">.97 / .98</span>
              </TableCell>
              <TableCell>Regular sale price</TableCell>
              <TableCell>
                <span className="priority-badge low">Extremely low</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="price-chip">Others (e.g., .56)</span>
              </TableCell>
              <TableCell>Inconsistent meaning</TableCell>
              <TableCell>
                <span className="priority-badge low">Low - speculative only</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)] rounded-lg p-5 my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">💡</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Key Takeaways:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                Price endings matter - they signal where an item is in its markdown lifecycle. Watch
                the clearance tag date to estimate when the next drop may happen. Don't rely on
                fixed timing - while these cadences are common, store exceptions exist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION II-A: VISUAL TIMELINE + TAG EXAMPLES */}
      {/* ============================================ */}
      <section id="clearance-timeline" className="scroll-mt-28 space-y-6">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">II-A.</span> Clearance Cadence Timeline
        </h2>
        <p className="text-[var(--text-secondary)]">
          Typical markdown progression before items hit $0.01. Timing varies by store/category, but
          the sequence stays consistent.
        </p>

        <div className="space-y-4">
          {[
            {
              title: "Stage 1: .00 (enters clearance)",
              duration: "~1–4 weeks",
              desc: "First markdown; watch the tag date for the next drop.",
            },
            {
              title: "Stage 2: .06 or .04",
              duration: "~2–6 weeks",
              desc: "Mid-clearance; seasonal items often move faster.",
            },
            {
              title: "Stage 3: .03 or .02",
              duration: "~1–3 weeks",
              desc: "Last visible price before penny; check top/bottom shelves and endcaps.",
            },
            {
              title: "System update: $0.01",
              duration: "Internal",
              desc: "If not pulled, the UPC scans at $0.01. Scan the UPC, not the yellow tag.",
            },
          ].map((step, idx) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-[var(--text-primary)]">{step.title}</h3>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {step.duration}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <figure className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2">
              <span>Clearance tag example</span>
              <span className="font-semibold">Mid-stage</span>
            </div>
            <div className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Price: $12.06
                </span>
                <span className="text-xs text-[var(--text-muted)]">Tag date: 11/04</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Older tag dates often mean the next drop is coming soon.
              </p>
            </div>
            <figcaption className="text-xs text-[var(--text-secondary)] mt-2">
              Use the printed tag date to gauge how close it is to the next markdown.
            </figcaption>
          </figure>

          <figure className="p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2">
              <span>“Unavailable” online</span>
              <span className="font-semibold">Penny signal</span>
            </div>
            <div className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-elevated)] p-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                App shows “Unavailable” / “Ship to Store”
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Common right before penny. Still verify in-store with the UPC scan.
              </p>
            </div>
            <figcaption className="text-xs text-[var(--text-secondary)] mt-2">
              Combine online “unavailable” with an old tag date for high-probability checks.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION II-B: VISUAL LABEL RECOGNITION */}
      {/* ============================================ */}
      <section id="visual-labels" className="scroll-mt-28 space-y-6">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">II-B.</span> Visual Label Recognition
        </h2>
        <p className="text-[var(--text-secondary)]">
          Know what to look for. These are real Home Depot clearance labels at different markdown
          stages. The price ending tells you how close an item is to penny status.
        </p>

        {/* Full clearance cycle example */}
        <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
          <div className="text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Complete Clearance Cycle (Same Item)
          </div>
          <img
            src="/guide/clearance-cycle-example.jpg"
            alt="Honeywell thermostat showing full clearance progression: $32.98, $29.00, $25.06, $16.00, $8.33"
            className="w-full rounded-md border border-[var(--border-strong)]"
          />
          <figcaption className="text-sm text-[var(--text-secondary)]">
            Real example: Same SKU progressing from $32.98 → $29.00 → $25.06 → $16.00 → $8.33.
            Notice the price endings (.00, .06, .00, .33) — this item followed Cadence A before
            likely hitting $0.01 next.
          </figcaption>
        </figure>

        {/* Individual label grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <span>.06 ending</span>
              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                Medium Priority
              </Badge>
            </div>
            <img
              src="/guide/label-06.jpg"
              alt="Home Depot clearance label showing $150.03 with WAS $599.00"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Second markdown (Cadence A). Check back in 4-6 weeks — next drop likely .03 or penny.
            </figcaption>
          </figure>

          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <span>.04 ending</span>
              <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                Medium Priority
              </Badge>
            </div>
            <img
              src="/guide/label-04.jpg"
              alt="Home Depot clearance label showing $34.97 LED flush mount with yellow tag"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Second markdown (Cadence B). Next drop usually .02, then penny within 2-4 weeks.
            </figcaption>
          </figure>

          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <span>.03 ending</span>
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30">
                High Priority
              </Badge>
            </div>
            <img
              src="/guide/label-03.jpg"
              alt="Home Depot clearance label ending in .03"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Final markdown before penny (Cadence A). High likelihood of hitting $0.01 within 1-3
              weeks.
            </figcaption>
          </figure>

          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <span>.02 ending</span>
              <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30">
                High Priority
              </Badge>
            </div>
            <img
              src="/guide/label-02.jpg"
              alt="DeWalt jump starter with $85.02 clearance label"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Final markdown before penny (Cadence B). Very high probability of penny status next.
            </figcaption>
          </figure>

          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <span>$0.01 Penny</span>
              <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                Penny Item
              </Badge>
            </div>
            <img
              src="/guide/label-penny.png"
              alt="Clean penny label showing $1.03 - actual penny item"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              The holy grail. Scan the UPC barcode — it'll ring up at $0.01, not what the yellow tag
              shows.
            </figcaption>
          </figure>
        </div>

        <div className="callout callout-sky callout-compact">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">💡</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] mb-2">Key Insight:</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The <strong>price ending</strong> matters more than the actual discount percentage.
                A $150.06 item is more likely to penny than a $5.97 item, even though $5.97 seems
                cheaper — because .06 signals mid-clearance, while .97 is just a regular sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION II-C: OVERHEAD HUNTING */}
      {/* ============================================ */}
      <section id="overhead-hunting" className="scroll-mt-28 space-y-6">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">II-C.</span> Overhead Hunting
        </h2>
        <p className="text-[var(--text-secondary)]">
          Clearance items often get moved to the overhead (top shelves above the aisles) when
          they're being phased out. These are prime penny targets — but there's risk when asking
          employees to pull them down.
        </p>

        {/* Overhead visual examples */}
        <div className="grid md:grid-cols-2 gap-6">
          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Wide View
            </div>
            <img
              src="/guide/overhead-wide.jpg"
              alt="Home Depot overhead shelving with clearance items visible"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Overhead clearance items waiting to be pulled. Look for yellow tags from the floor.
            </figcaption>
          </figure>

          <figure className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 space-y-3">
            <div className="text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Close-Up
            </div>
            <img
              src="/guide/overhead-close.jpg"
              alt="Close-up of overhead clearance items with visible yellow price tags"
              loading="lazy"
              className="w-full rounded-md border border-[var(--border-strong)]"
            />
            <figcaption className="text-sm text-[var(--text-secondary)]">
              Yellow clearance labels are visible from the ground — these items are often forgotten
              and more likely to penny.
            </figcaption>
          </figure>
        </div>

        {/* Overhead tactics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">What to Look For</h3>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <span>
                <strong>Yellow clearance tags</strong> visible from the floor
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <span>
                <strong>"No Home" sections</strong> in the overhead — items without a shelf location
                (prime penny territory)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dusty or old-looking boxes</strong> — means they've been sitting for weeks
              </span>
            </li>
          </ul>
        </div>

        <div className="callout callout-sky callout-compact">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] mb-2">The Overhead Risk:</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                When you ask an employee to pull an overhead item, they can scan it from the floor
                with their Zebra device <em>before</em> pulling it down. If it scans as $0.01,
                they'll likely refuse to give it to you or remove it from inventory. Only ask for
                overhead items if you're willing to take that gamble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          EZOIC ADS (Bridge monetization)
          Slot: CONTENT_AFTER_P1 (130) — after Section II
          =================================================== */}
      <div className="flex justify-center">
        <EzoicPlaceholder slotId={AD_SLOTS.CONTENT_AFTER_P1} className="w-full max-w-[336px]" />
      </div>

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
                NOT the yellow clearance tag)
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

      {/* ============================================ */}
      {/* SECTION IV: IN-STORE HUNTING */}
      {/* ============================================ */}
      <section id="in-store-hunting" className="scroll-mt-28">
        <h2 className="section-heading">
          <Store className="h-6 w-6 text-[var(--text-muted)]" />
          <span className="text-[var(--text-primary)]">IV.</span> In-Store Penny Hunting Strategies
        </h2>

        <p>
          Once you're in the store, your goal is to find penny-priced items that haven't yet been
          pulled from the shelves. These are usually clearance items that slipped through the
          cracks.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Where to Look</h3>

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

        <h3 className="text-xl font-semibold mt-8 mb-4">How to Check the Price (Discreetly)</h3>

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

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Overhead Items: High-Risk, Mixed Results
        </h3>
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
        <h2 className="section-heading">
          <ShoppingCart className="h-6 w-6 text-[var(--text-muted)]" />
          <span className="text-[var(--text-primary)]">V.</span> The Checkout Challenge
        </h2>

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

      {/* ============================================ */}
      {/* SECTION VI: INSIDE SCOOP */}
      {/* ============================================ */}
      <section id="internal-operations" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">VI.</span> The Inside Scoop: Internal
          Operations
        </h2>

        <p>
          Understanding Home Depot's internal operations helps you grasp why penny items exist, why
          staff act the way they do, and how the system works behind the scenes.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Penny Items = Not Meant for Sale</h3>
        <p>
          Home Depot doesn't price things at $0.01 for customers - it's an internal accounting
          mechanism triggered by <strong>Zero Margin Adjustment (ZMA)</strong>.
        </p>
        <p>Why does it happen:</p>
        <ul>
          <li>Item is discontinued, damaged, expired, or no longer worth selling</li>
          <li>Store uses ZMA to reduce its system value to $0.01 (effectively zero)</li>
          <li>System flags it for removal from shelves - but sometimes it gets missed</li>
        </ul>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)] rounded-lg p-5 my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">ℹ️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Key Takeaway:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                If an item is still on the floor at $0.01, it's likely due to oversight or staff
                backlog.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Employee Policy: Strict Rules</h3>
        <ul>
          <li>
            <strong>Employees are forbidden from buying penny items</strong> - doing so results in
            termination
          </li>
          <li>
            Many stores enforce a "24-hour rule": staff can't buy newly marked-down clearance until
            it's been on the floor for 24+ hours
          </li>
          <li>This prevents staff from hiding items for themselves</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">FIRST Phones & the Clearance App</h3>
        <p>
          Home Depot equips staff with handheld devices called FIRST phones. The{" "}
          <strong>Clearance App</strong> lets associates:
        </p>
        <ul>
          <li>See a list of clearance items, including penny-priced ones</li>
          <li>Filter by department, location, price, on-hand stock, and "no home" items</li>
          <li>Flag items for removal</li>
        </ul>
        <p className="text-muted-foreground text-sm mt-2">
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
          <li>
            Some employees may even give it away as a "damaged out" freebie - rare, but it happens
          </li>
        </ul>
        <p className="font-medium mt-4">Same store, different shifts = different outcomes.</p>
      </section>

      {/* ============================================ */}
      {/* SECTION VII: FACT VS FICTION */}
      {/* ============================================ */}
      <section id="fact-vs-fiction" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">VII.</span> Research Deep Dive: Fact vs
          Fiction
        </h2>

        <p>
          Despite how widespread penny hunting has become, Home Depot has never publicly confirmed
          the full clearance-to-penny process. Most of what we know comes from community
          observations, shared screenshots and receipts, and logical deductions from how retail
          clearance cycles work.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">What's Real vs. What's Rumor</h3>
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
              <TableCell>
                <span className="priority-badge high">True</span>
              </TableCell>
              <TableCell>Via internal ZMA process</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price endings predict markdowns</TableCell>
              <TableCell>
                <span className="priority-badge high">True</span>
              </TableCell>
              <TableCell>.06/.03 and .04/.02 are common sequences</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Penny items are "secret sales"</TableCell>
              <TableCell>
                <span className="priority-badge low">False</span>
              </TableCell>
              <TableCell>They're not intended for sale at all</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Home Depot honors the first scanned price</TableCell>
              <TableCell>
                <span className="priority-badge medium">Sometimes</span>
              </TableCell>
              <TableCell>Depends on the manager</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employees buy penny items</TableCell>
              <TableCell>
                <span className="priority-badge low">False</span>
              </TableCell>
              <TableCell>Against policy and grounds for termination</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Using ladders to get pennies is okay</TableCell>
              <TableCell>
                <span className="priority-badge medium">Depends</span>
              </TableCell>
              <TableCell>Yellow ladder: yes. Orange ladder: employee-only (high risk)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Stores will always sell penny items</TableCell>
              <TableCell>
                <span className="priority-badge low">False</span>
              </TableCell>
              <TableCell>Many will cancel the sale or remove the item</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Penny items show online</TableCell>
              <TableCell>
                <span className="priority-badge low">False</span>
              </TableCell>
              <TableCell>The $0.01 price never appears in the app or website</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h3 className="text-xl font-semibold mt-8 mb-4">How Dependable Is Community Intel?</h3>
        <p>Very - but with a few caveats:</p>
        <ul>
          <li>
            <strong>National penny items</strong> (brand-wide markdowns) are dependable across many
            stores
          </li>
          <li>
            <strong>Store-specific pennies</strong> (returns, damaged goods, unpulled clearance) are
            hit-or-miss
          </li>
          <li>Community screenshots and shared receipts are gold - but dates matter</li>
        </ul>
        <p className="text-muted-foreground text-sm mt-2">
          Always check timestamps on community posts. A penny item from 4 weeks ago may already be
          pulled or long gone.
        </p>
      </section>

      {/* ============================================ */}
      {/* SECTION VIII: RESPONSIBLE HUNTING */}
      {/* ============================================ */}
      <section id="responsible-hunting" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">VIII.</span> Responsible Penny Hunting
        </h2>

        <p>
          Penny hunting thrives on community, strategy, and discretion. Acting irresponsibly not
          only gets you shut down - it can cause stores to crack down harder on{" "}
          <strong>everyone</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">1. Be Respectful to Store Employees</h4>
            <p className="text-sm text-muted-foreground">
              Even if you're frustrated, caught off-guard, or denied a penny sale: stay calm, stay
              polite, avoid confrontations. Staff are following orders - not making personal
              decisions against you.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">2. Don't Be Loud About Finds</h4>
            <p className="text-sm text-muted-foreground">
              Getting loud, excited, or bragging at checkout draws attention. Don't show receipts to
              other customers, tell staff about your score, or film inside the store.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">3. Use Community Resources Wisely</h4>
            <p className="text-sm text-muted-foreground">
              Share helpful info like UPCs, tag dates, or clearance cycles. Post accurate finds -
              not rumors. Don't flood groups with repeat questions.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-semibold mb-3">4. Know When to Walk Away</h4>
            <p className="text-sm text-muted-foreground">
              If an employee or manager denies the sale, just move on. It's not worth getting banned
              from the store. Better to lose one item than burn access to future deals.
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)] rounded-lg p-5 my-10">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Reality Check:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                This is not a get-rich-quick game. Penny hunting requires time, patience, and a lot
                of empty trips. You might check 3 stores and find nothing. Don't expect huge savings
                every time - it's about the long game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION IX: CONCLUSION */}
      {/* ============================================ */}
      <section id="conclusion" className="scroll-mt-28">
        <h2 className="section-heading">
          <span className="text-[var(--text-primary)]">IX.</span> Conclusion: Tips for Success
        </h2>

        <p>
          Whether you're just starting out or you've been hunting for a while, here's what matters
          most: <strong>know the system, stay patient, play it smart, and stay respectful.</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          {/* Beginners */}
          <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold text-[var(--cta-primary)] mb-4">
              For Beginners: Start Here
            </h3>

            <h4 className="font-medium mt-4 mb-2">Understand the Basics</h4>
            <ul className="text-sm space-y-3">
              <li>Penny items are the last stage in Home Depot's clearance cycle</li>
              <li>They're not meant for sale - they exist due to oversight</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">Use the App and Website</h4>
            <ul className="text-sm space-y-3">
              <li>Set your store location before searching</li>
              <li>Look for items showing "Out of Stock" but still listed at full price</li>
              <li>Search by SKU or UPC when possible</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">In-Store Tips</h4>
            <ul className="text-sm space-y-3">
              <li>Go straight to clearance endcaps and seasonal sections</li>
              <li>
                Check price endings like <span className="price-chip">.03</span>/
                <span className="price-chip">.02</span>
              </li>
              <li>Use self-checkout, scan the UPC, print your receipt</li>
              <li>Don't scan the clearance tag</li>
            </ul>
          </div>

          {/* Experienced */}
          <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-default)]">
            <h3 className="text-lg font-semibold text-[var(--cta-primary)] mb-4">
              For Experienced Hunters: Refine Your Game
            </h3>

            <h4 className="font-medium mt-4 mb-2">Know the Clearance Cadences</h4>
            <div className="text-sm space-y-3 font-mono bg-[var(--bg-elevated)] border border-[var(--border-default)] p-3 rounded">
              <div className="flex flex-wrap items-center gap-2">
                <span>Cadence A:</span>
                <span className="price-chip">.00</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="price-chip">.06</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="price-chip">.03</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="priority-badge penny">Penny</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span>Cadence B:</span>
                <span className="price-chip">.00</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="price-chip">.04</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="price-chip">.02</span>
                <span className="text-[var(--text-muted)]">{`->`}</span>
                <span className="priority-badge penny">Penny</span>
              </div>
            </div>
            <p className="text-sm mt-2">Items usually follow these patterns over 7-13 weeks</p>

            <h4 className="font-medium mt-4 mb-2">Look Beyond the Obvious</h4>
            <ul className="text-sm space-y-3">
              <li>Dig through misplaced inventory and dusty shelves</li>
              <li>Don't ignore garden centers, paint, or seasonal aisles</li>
              <li>Spot patterns when product lines get pulled storewide</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">Track Community Trends</h4>
            <ul className="text-sm space-y-3">
              <li>Watch social media groups for confirmed penny items</li>
              <li>Validate with dates and store locations</li>
              <li>Avoid spreading unconfirmed rumors</li>
            </ul>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 rounded-lg text-center my-8">
          <h3 className="text-xl font-semibold mb-3">Final Mindset</h3>
          <p className="text-muted-foreground mb-4">
            Many hunters enjoy this for more than the savings: the thrill of the hunt, the
            satisfaction of outsmarting a system, and the camaraderie of a tight-knit, info-sharing
            community.
          </p>
          <p className="font-medium">
            But remember: one person's unruly behavior can ruin it for everyone. Stay sharp, stay
            respectful, and help keep the game alive.
          </p>
          <p className="text-lg font-semibold text-[var(--cta-primary)] mt-4">
            Penny hunting is part luck, part hustle, and all strategy. Treat it like a skill - not a
            shortcut.
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION: START HUNTING CTA */}
      {/* ============================================ */}
      <section className="scroll-mt-28 py-12 bg-gradient-to-br from-[var(--cta-primary)]/5 to-[var(--cta-primary)]/10 rounded-xl border border-[var(--cta-primary)]/20">
        <div className="text-center space-y-6 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Ready to Start Hunting?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            You've learned the tactics. Now use our <strong>live, crowd-sourced penny list</strong>{" "}
            — usually updated within about 5 minutes with fresh finds from hunters nationwide.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
            <a
              href="/penny-list"
              className="group block p-6 rounded-lg border-2 border-[var(--cta-primary)] bg-[var(--bg-card)] hover:bg-[var(--cta-primary)] hover:text-white transition-all duration-200"
            >
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-white">
                Live Penny List (usually updated within about 5 minutes)
              </h3>
              {/* prettier-ignore */}
              <p className="text-sm text-[var(--text-secondary)] group-hover:text-white/90">
                <strong>Crowd-sourced & current.</strong> Usually updated within about 5 minutes.
                <br />
                Fresh finds nationwide. Filter by state, search by SKU.
              </p>
              <div className="mt-4 text-[var(--cta-primary)] group-hover:text-white font-semibold">
                View Penny List →
              </div>
            </a>

            <a
              href="/report-find"
              className="group block p-6 rounded-lg border-2 border-[var(--cta-primary)] bg-[var(--bg-card)] hover:bg-[var(--cta-primary)] hover:text-white transition-all duration-200"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-white">
                Report Your Finds
              </h3>
              <p className="text-sm text-[var(--text-secondary)] group-hover:text-white/90">
                Found a penny item? Help other hunters by reporting it. Include the SKU, purchase
                date, and state — it takes 30 seconds.
              </p>
              <div className="mt-4 text-[var(--cta-primary)] group-hover:text-white font-semibold">
                Report a Find →
              </div>
            </a>
          </div>

          <div className="pt-6 border-t border-[var(--border-default)] mt-8">
            <p className="text-sm text-[var(--text-muted)]">
              <strong>Remember:</strong> Penny hunting is part research, part timing, part luck.
              Stay respectful, stay strategic, and help keep the community strong.
            </p>
          </div>
        </div>
      </section>
    </article>
  )
}
