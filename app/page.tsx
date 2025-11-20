import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import clearanceCadenceData from "@/data/clearance-cadence-data.json"
import faqEntries from "@/data/faq-entries.json"
import recentFinds from "@/data/recent-finds.json"

type CadenceRow = {
  stage: string
  priceEnding: string
  discount: string
  duration: string
  notes: string
}

type PriceEndingReference = {
  ending: string
  meaning: string
  chance: "Low" | "Medium" | "High" | "Penny"
}

const sections = [
  { id: "what-are-pennies", label: "What Are Pennies" },
  { id: "clearance-lifecycle", label: "Clearance Lifecycle" },
  { id: "pre-hunt-digital-tools", label: "Pre-Hunt / Digital Tools" },
  { id: "in-store-strategy", label: "In-Store Strategies" },
  { id: "checkout", label: "Checkout" },
  { id: "internal-systems", label: "Internal Systems" },
  { id: "facts-vs-myths", label: "Facts vs Myths" },
  { id: "responsible-hunting", label: "Responsible Hunting" },
  { id: "faq", label: "FAQ" },
]

const priceEndingReference: PriceEndingReference[] = [
  { ending: ".00", meaning: "First markdown; item just entered clearance", chance: "Low" },
  { ending: ".06", meaning: "Cadence A middle markdown", chance: "Medium" },
  { ending: ".03", meaning: "Cadence A final markdown; usually last stop before penny", chance: "High" },
  { ending: ".04", meaning: "Cadence B middle markdown", chance: "Medium" },
  { ending: ".02", meaning: "Cadence B final markdown; high odds of penny next", chance: "High" },
  { ending: ".97 / .98", meaning: "Regular sale or promo pricing", chance: "Low" },
  { ending: "Other (e.g., .56)", meaning: "Store-specific promo; not tied to penny lifecycle", chance: "Low" },
  { ending: "penny", meaning: "System write-off ($0.01) if not pulled", chance: "Penny" },
]

const appSignals = [
  {
    status: "In stock + clearance price visible",
    meaning: "Still in clearance cycle, not pennied",
    action: "Track tag date; check back after expected cadence window",
    emphasis: "Medium",
  },
  {
    status: "In stock + full price",
    meaning: "Active inventory or reset; not a penny signal",
    action: "Skip unless you have recent reports",
    emphasis: "Low",
  },
  {
    status: "Out of stock / unavailable + full price",
    meaning: "Common penny signal; system may have pennied it",
    action: "Check in-store locations quietly; scan at SCO",
    emphasis: "High",
  },
  {
    status: "Clearance price disappeared overnight",
    meaning: "Possible removal or penny flip; timing driven by cadence",
    action: "Validate in-store; do not assume it is gone",
    emphasis: "Medium",
  },
]

const inStoreHotspots = [
  {
    title: "Endcaps and side stacks",
    detail: "Clearance endcaps near lumber, lighting, or seasonal aisles often keep older SKUs. Look for dust, mixed/older labels, and mismatched price tags.",
    asset: "photo-clearance-endcap.jpg",
  },
  {
    title: "Bottom shelves and returns",
    detail: "Low shelves near returns, clearance bays, or after seasonal resets collect forgotten items. Check behind stacked boxes.",
    asset: "photo-dusty-shelf-example.jpg",
  },
  {
    title: "Overhead storage",
    detail: "Top racks above the aisle can hide pulls. Yellow ladders are customer-safe; orange rolling ladders are for employees only.",
    asset: "photo-yellow-ladder.jpg / photo-orange-ladder.jpg",
  },
  {
    title: "Backup checks",
    detail: "If the shelf is empty but signals look good, ask (politely) for a quick scan on a FIRST phone or at the desk.",
    asset: "photo-first-phone.jpg",
  },
]

const mythsTable = [
  { claim: "Penny items are secret sales for savvy shoppers", verdict: "False", note: "They are system write-offs meant to be pulled." },
  { claim: "All clearance goes to $0.01 eventually", verdict: "False", note: "Many sell out or are pulled before penny status." },
  { claim: "Scanning the yellow clearance tag is fine at SCO", verdict: "False", note: "Tags can freeze or flag the terminal. Scan the UPC barcode only." },
  { claim: "Managers must complete penny sales if scanned", verdict: "Varies", note: "Policies differ by store; managers can decline the sale." },
  { claim: "Penny items appear online at $0.01", verdict: "False", note: "The penny price never displays online." },
  { claim: "Asking staff to price-check a suspected penny is safe", verdict: "Varies", note: "It often prompts them to pull the item immediately." },
]

const checkoutSteps = [
  "Use self-checkout when possible. Have payment ready and scan only the manufacturer UPC.",
  "Scan the penny item first, then any filler/cover items if you use them.",
  "Pay promptly. Avoid price-override conversations unless asked directly.",
  "Print or save the receipt for proof. Photograph it if staff request the item back after payment.",
]

const checkoutIfStopped = {
  do: [
    "Stay calm and brief. 'I scanned it at the posted price.'",
    "Show the receipt if already paid.",
    "Decide quickly whether to comply or walk away without debate.",
  ],
  dont: [
    "Argue about policy or threaten complaints.",
    "Scan the yellow clearance tag—it can freeze the lane.",
    "Film employees without consent; it escalates fast.",
  ],
}

const responsibleGuidelines = [
  { title: "Respect staff and shoppers", detail: "If denied, move on. The goal is to stay welcome in your store." },
  { title: "Stay quiet in aisles", detail: "Keep phones and conversations discreet; avoid crowds around SCO." },
  { title: "Share responsibly", detail: "Post SKUs, tag dates, and stores only after verifying. Avoid hype or quantity flexing." },
  { title: "Use ladders correctly", detail: "Yellow ladders are fine; orange rolling ladders are for employees only." },
  { title: "Walk away gracefully", detail: "If attention climbs, abort. Penny hunting is opportunistic, not guaranteed." },
  { title: "Leave aisles tidy", detail: "Put items back neatly; messy shelves get swept faster." },
]

const recentFindsData = recentFinds as {
  sku: string
  item: string
  store: string
  date: string
  category: string
}[]

const faqData = faqEntries as {
  question: string
  answer: string
}[]

function badgeClass(chance: PriceEndingReference["chance"] | "True" | "False" | "Varies") {
  if (chance === "High") return "badge badge-high"
  if (chance === "Medium") return "badge badge-medium"
  if (chance === "Low") return "badge badge-low"
  if (chance === "Penny") return "badge badge-penny"
  if (chance === "True") return "badge badge-true"
  if (chance === "False") return "badge badge-false"
  return "badge badge-varies"
}

export default function Home() {
  const cadence = clearanceCadenceData as { cadenceA: CadenceRow[]; cadenceB: CadenceRow[] }

  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        <section id="top" className="container mx-auto px-4 pt-14 pb-12">
          <div className="hero-grid">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">A calm reference for the Home Depot One Cent Items community</p>
              <h1>Home Depot Penny Items: Complete Guide</h1>
              <p className="text-lg text-muted-foreground">
                Understand how penny pricing happens, read clearance cadences, scout digitally, and move respectfully in-store. Built for a 32,000-member Facebook group that values quiet wins over hype.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" href="/Home-Depot-Penny-Guide.pdf">
                  Download PDF
                </Button>
                <a href="#toc" className="text-sm text-muted-foreground hover:text-foreground no-underline">
                  Browse Sections ↓
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="pill">Single-column, info-first (Wirecutter/Wikipedia tone)</span>
                <span className="pill">Inter headings · Georgia body · JetBrains Mono for codes</span>
                <span className="pill">Cool slate/teal palette with warm warning accents</span>
              </div>
            </div>
            <div className="reference-card space-y-3">
              <h3 className="text-lg font-semibold">Field kit (bring/check)</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>UPC photos of candidates, not just clearance tags</li>
                <li>Store list (switch “My Store” in the app quickly)</li>
                <li>Keeper item for SCO normalization</li>
                <li>Small ladder awareness: yellow OK; orange = staff only</li>
                <li>Receipt snapshot habit for proof after checkout</li>
              </ul>
            </div>
            <div className="image-placeholder min-h-[220px]">
              hero-clearance-tag-mockup.png<br />
              Muted hero image: annotated clearance tag with .03/.02 examples.
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-20">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
            <aside id="toc" className="hidden lg:block sticky top-28 self-start border border-border rounded-xl bg-[hsl(var(--panel))] p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Guide sections</p>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground no-underline"
                  >
                    {section.label}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="space-y-16">
              <section id="what-are-pennies" className="space-y-4 section-panel">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Overview</p>
                  <h2>What Are Penny Items?</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  Penny items are products the system wrote down to $0.01 (Zero Margin Adjustment). They are flagged for removal—not sale—and slip through when staff have not pulled them yet. There is no “secret sale”; it is a gap in process.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="reference-card">
                    <h3>What they are</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>System write-offs at $0.01 when items are discontinued or aged</li>
                      <li>Still on the shelf due to oversight, backlog, or misplacement</li>
                      <li>Triggered after clearance cadences finish</li>
                    </ul>
                  </div>
                  <div className="reference-card">
                    <h3>What they are not</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Not a promotion or secret sale</li>
                      <li>Not guaranteed at every store</li>
                      <li>Not risk-free—staff can refuse the sale</li>
                    </ul>
                  </div>
                </div>
                <div className="reference-card">
                  <h3 className="text-lg font-semibold">Why they exist</h3>
                  <p className="text-muted-foreground">
                    Items hit $0.01 when they are discontinued, aged, or damaged. ZMA writes the value down, and the system expects removal. Oversight, backlogs, misplaced inventory, seasonal chaos, or overhead storage let them linger on shelves.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    National “known” pennies sometimes appear across many stores; store-specific pennies come from local returns, misplacements, or stock resets. Timing and enforcement vary by manager and shift.
                  </p>
                </div>
                <div className="callout-box warning">
                  <p className="font-semibold">Reminder:</p>
                  <p>Penny items exist because of process gaps. Treat them as opportunistic finds, not entitlements.</p>
                </div>
                <div className="image-placeholder">
                  receipt-penny-item-example.jpg<br />
                  Drop a receipt photo here showing a $0.01 line item for clarity.
                </div>
              </section>

              <section id="clearance-lifecycle" className="space-y-6 section-panel alt">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Timing reference</p>
                  <h2>Clearance Lifecycle & Cadences</h2>
                </div>
                <p className="text-muted-foreground">
                  Two common markdown cadences have been observed. Timing varies, but these frameworks help you predict when to check again. Track the tag date and price ending, and expect exceptions by store, category, and manager.
                </p>

                <div className="grid gap-6">
                  <div className="reference-card space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">Cadence A (~13 weeks): .00 → .06 → .03 → penny</h3>
                      <span className="badge badge-medium">Observed often</span>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Price ending</th>
                          <th>Discount</th>
                          <th>Duration</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cadence.cadenceA.map((row) => (
                          <tr key={`${row.stage}-${row.priceEnding}`}>
                            <td>{row.stage}</td>
                            <td className="font-mono font-semibold">{row.priceEnding}</td>
                            <td>{row.discount}</td>
                            <td>{row.duration}</td>
                            <td>{row.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="reference-card space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">Cadence B (~7 weeks): .00 → .04 → .02 → penny</h3>
                      <span className="badge badge-medium">Faster cycle</span>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Price ending</th>
                          <th>Discount</th>
                          <th>Duration</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cadence.cadenceB.map((row) => (
                          <tr key={`${row.stage}-${row.priceEnding}`}>
                            <td>{row.stage}</td>
                            <td className="font-mono font-semibold">{row.priceEnding}</td>
                            <td>{row.discount}</td>
                            <td>{row.duration}</td>
                            <td>{row.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="reference-card space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">Price Ending Decoder</h3>
                    <span className="badge badge-penny">Use endings + tag dates</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ending</th>
                        <th>Meaning</th>
                        <th>Chance of penny</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceEndingReference.map((row) => (
                        <tr key={row.ending}>
                          <td className="font-mono font-semibold">{row.ending}</td>
                          <td>{row.meaning}</td>
                          <td>
                            <span className={badgeClass(row.chance)}>
                              {row.chance === "Penny" ? "Penny" : row.chance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="callout-box info">
                  <p className="font-semibold">How to use this in practice</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Check the clearance tag date; cadence windows often move every 1–3 weeks.</li>
                    <li>When a price ending disappears online and stock shows zero, it may have flipped to penny—verify quietly in-store.</li>
                    <li>Do not expect guarantees: some items sell out or are pulled before penny status.</li>
                  </ul>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="image-placeholder">
                    cadence-comparison-chart.svg<br />
                    Timeline diagram comparing Cadence A vs B.
                  </div>
                  <div className="image-placeholder">
                    price-ending-reference-card.svg<br />
                    Visual cheat sheet for endings with color-coded badges.
                  </div>
                </div>
              </section>

              <section id="pre-hunt-digital-tools" className="space-y-6 section-panel">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Before you drive</p>
                  <h2>Pre-Hunt / Digital Tools</h2>
                </div>
                <p className="text-muted-foreground">
                  Use the Home Depot app/site to narrow targets. It will not reveal $0.01 pricing, but signals help prioritize store trips. Switch “My Store” to nearby locations when scouting multiple stores—the same SKU can penny in one store and stay full price in another.
                </p>
                <ol className="step-guide">
                  <li>
                    <strong>Set your store.</strong> Inventory is store-specific. Wrong store = wrong signal.
                  </li>
                  <li>
                    <strong>Search by SKU.</strong> Use the SKU from the clearance tag or packaging. UPC searches are less consistent.
                  </li>
                  <li>
                    <strong>Interpret the result.</strong> Use the table below to decide if it is worth checking in person.
                  </li>
                </ol>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="image-placeholder min-h-[180px]">
                    app-screenshot-store-selector.png<br />
                    Step 1: Store selector view.
                  </div>
                  <div className="image-placeholder min-h-[180px]">
                    app-screenshot-sku-search.png<br />
                    Step 2: SKU search entry.
                  </div>
                  <div className="image-placeholder min-h-[180px]">
                    app-comparison-side-by-side.png<br />
                    Step 3: Compare status outcomes.
                  </div>
                </div>

                <div className="reference-card space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">App status → action</h3>
                    <span className="badge badge-low">Signals only</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>What you see</th>
                        <th>What it could mean</th>
                        <th>Action</th>
                        <th>Signal strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appSignals.map((row) => (
                        <tr key={row.status}>
                          <td className="font-semibold">{row.status}</td>
                          <td>{row.meaning}</td>
                          <td>{row.action}</td>
                          <td>
                            <span className={badgeClass(row.emphasis as PriceEndingReference["chance"])}>{row.emphasis}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="in-store-strategy" className="space-y-6 section-panel alt">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">In the aisles</p>
                  <h2>In-Store Strategies</h2>
                </div>
                <p className="text-muted-foreground">
                  Move quietly, scan with purpose, and look where pulled items hide. Use the signals from the clearance cadence and app to focus your time.
                </p>

                <div className="reference-card space-y-2">
                  <h3 className="text-lg font-semibold">Common categories</h3>
                  <p className="text-muted-foreground">
                    Frequent pennies: hardware (screws/nails/hooks/brackets), lighting (bulbs, switches, fixtures), electrical parts, paint accessories, seasonal leftovers, brand changeovers, and discontinued lines.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {inStoreHotspots.map((spot) => (
                    <div key={spot.title} className="reference-card space-y-2">
                      <h3 className="text-lg font-semibold">{spot.title}</h3>
                      <p className="text-muted-foreground">{spot.detail}</p>
                      <span className="badge badge-low">{spot.asset}</span>
                    </div>
                  ))}
                </div>

                <div className="reference-card space-y-3">
                  <h3 className="text-lg font-semibold">SCO method (quiet confirmation)</h3>
                  <ol className="step-guide">
                    <li>Use self-checkout at quieter hours. Keep cart contents minimal.</li>
                    <li>Scan the UPC barcode, not the clearance tag. Tags can trigger assistance.</li>
                    <li>If it rings at $0.01, pay immediately. If not, cancel politely.</li>
                    <li>Have a filler item ready to mask noise if desired.</li>
                  </ol>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="image-placeholder min-h-[160px]">
                    photo-clearance-endcap.jpg / photo-dusty-shelf-example.jpg<br />
                    Inline photos of dusty clearance bays.
                  </div>
                  <div className="image-placeholder min-h-[160px]">
                    photo-first-phone.jpg / photo-yellow-ladder.jpg / photo-orange-ladder.jpg<br />
                    Reference for handheld scans and ladder do/do not.
                  </div>
                </div>

                <div className="reference-card space-y-2">
                  <h3 className="text-lg font-semibold">General fieldcraft</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Hunt off-peak (early/late) to reduce attention.</li>
                    <li>Act like a normal shopper; avoid hovering over clearance bays too long.</li>
                    <li>Misplaced single items are gold—check bottom shelves, dusty corners, and random aisles.</li>
                    <li>When asking for help, request a “stock check” instead of a price check; watch the FIRST phone screen discreetly.</li>
                  </ul>
                </div>

                <div className="callout-box info">
                  <p className="font-semibold">Overhead ladder rules</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Yellow ladders: customer OK; be quick and safe.</li>
                    <li>Orange rolling ladders: employee-only. Ask instead of climbing.</li>
                  </ul>
                </div>
              </section>

              <section id="checkout" className="space-y-6 section-panel">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">At the register</p>
                  <h2>Checkout Flow</h2>
                </div>
                <p className="text-muted-foreground">Keep it simple. You are confirming a price, not negotiating a discount.</p>

                <div className="reference-card space-y-3">
                  <h3 className="text-lg font-semibold">Steps</h3>
                  <ol className="step-guide">
                    {checkoutSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="reference-card space-y-2">
                    <h3 className="text-lg font-semibold">If you are stopped</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Do</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {checkoutIfStopped.do.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Do not</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {checkoutIfStopped.dont.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="reference-card space-y-2">
                    <h3 className="text-lg font-semibold">Keeper item & locked cases</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Scan a normal “keeper” item first to normalize the transaction.</li>
                      <li>For locked cases: add a keeper, ask to unlock, head to SCO, scan keeper first, then the candidate item.</li>
                      <li>Avoid scanning the yellow clearance tag; use the UPC only to prevent freezes/flags.</li>
                    </ul>
                  </div>
                </div>

                <div className="image-placeholder">
                  diagram-barcode-vs-tag.svg<br />
                  Show barcode vs clearance tag; highlight UPC scan path.
                </div>
              </section>

              <section id="internal-systems" className="space-y-6 section-panel alt">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Behind the scenes</p>
                  <h2>Internal Systems</h2>
                </div>
                <div className="reference-card space-y-2">
                  <h3 className="text-lg font-semibold">ZMA (Zero Margin Adjustment)</h3>
                  <p className="text-muted-foreground">
                    Financial write-off that drops an item to $0.01 when it no longer carries retail value. The system expects staff to remove the item from the floor.
                  </p>
                </div>
                <div className="reference-card space-y-2">
                  <h3 className="text-lg font-semibold">FIRST phones & Clearance App</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Orange handhelds show pricing, location, and clearance status.</li>
                    <li>Staff can see penny SKUs and are instructed to pull them.</li>
                    <li>Asking for scans can alert staff—use sparingly.</li>
                  </ul>
                </div>
                <div className="callout-box warning">
                  <p className="font-semibold">Employee policy callout</p>
                  <p>Employees are not allowed to purchase penny items. Many stores enforce waiting periods after markdowns and can terminate staff for breaking the rule.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="image-placeholder min-h-[160px]">
                    diagram-zma-process-flow.svg<br />
                    Visual of ZMA → pull list → penny status.
                  </div>
                  <div className="image-placeholder min-h-[160px]">
                    screenshot-clearance-app-ui.png<br />
                    Placeholder for the clearance app / FIRST phone view.
                  </div>
                </div>
              </section>

              <section id="facts-vs-myths" className="space-y-6 section-panel">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Reality check</p>
                  <h2>Facts vs Myths</h2>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Claim</th>
                      <th>Verdict</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mythsTable.map((item) => (
                      <tr key={item.claim}>
                        <td>{item.claim}</td>
                        <td>
                          <span className={badgeClass(item.verdict as unknown as PriceEndingReference["chance"] | "True" | "False" | "Varies")}>
                            {item.verdict}
                          </span>
                        </td>
                        <td>{item.note}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Home Depot must honor the first scanned price</td>
                      <td><span className={badgeClass("Varies")}>Varies</span></td>
                      <td>Managers can cancel or allow; enforcement is store/shift-dependent.</td>
                    </tr>
                    <tr>
                      <td>Penny items appear online at $0.01</td>
                      <td><span className={badgeClass("False")}>False</span></td>
                      <td>The penny price never shows online; only in-store scans reveal it.</td>
                    </tr>
                    <tr>
                      <td>All clearance items eventually become pennies</td>
                      <td><span className={badgeClass("False")}>False</span></td>
                      <td>Many sell through, are liquidated, or get pulled before penny status.</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="responsible-hunting" className="space-y-6 section-panel alt">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Group norms</p>
                  <h2>Responsible Hunting</h2>
                </div>
                <p className="text-muted-foreground">Keep the experience sustainable for the community and your local store.</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {responsibleGuidelines.map((item) => (
                    <div key={item.title} className="reference-card">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 section-panel">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Optional data</p>
                  <h2>Recent Finds (data-driven widget)</h2>
                </div>
                <p className="text-muted-foreground">
                  Replace with real group submissions (SKU, store, date, category). Keep it factual—no testimonials.
                </p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Item</th>
                      <th>Store</th>
                      <th>Date</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFindsData.map((row) => (
                      <tr key={row.sku}>
                        <td className="font-mono font-semibold">{row.sku}</td>
                        <td>{row.item}</td>
                        <td>{row.store}</td>
                        <td>{row.date}</td>
                        <td>{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section id="faq" className="space-y-4 section-panel alt">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Common questions</p>
                  <h2>FAQ</h2>
                </div>
                <div className="space-y-3">
                  {faqData.map((item) => (
                    <div key={item.question} className="reference-card">
                      <h3 className="text-lg font-semibold">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
