export function InsideScoop() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION VI: INSIDE SCOOP */}
      {/* ============================================ */}
      <section id="internal-operations" className="scroll-mt-28">
        <p>
          Understanding Home Depot's internal operations helps you grasp why penny items exist, why
          staff act the way they do, and how the system works behind the scenes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Penny Items = Not Meant for Sale</h2>
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">Employee Policy: Strict Rules</h2>
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">FIRST Phones & the Clearance App</h2>
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Management Cares So Much</h2>
        <p>Managers are pressured to remove penny items because they:</p>
        <ul>
          <li>Hurt shrink metrics (loss due to theft, damage, system errors)</li>
          <li>Signal poor inventory control</li>
          <li>Represent a financial loss (even at a penny, the system records a transaction)</li>
          <li>Disrupt inventory accuracy for automation and reorders</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">SOP Reality: Policy vs. Practice</h2>
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
    </article>
  )
}
