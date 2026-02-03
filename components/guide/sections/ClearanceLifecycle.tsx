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

export function ClearanceLifecycle() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
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
    </article>
  )
}
