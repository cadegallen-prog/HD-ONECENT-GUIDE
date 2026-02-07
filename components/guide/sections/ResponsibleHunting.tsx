export function ResponsibleHunting() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION VIII: RESPONSIBLE HUNTING */}
      {/* ============================================ */}
      <section id="responsible-hunting" className="scroll-mt-28">
        <p>
          Penny hunting thrives on community, strategy, and discretion. Acting irresponsibly not
          only gets you shut down - it can cause stores to crack down harder on{" "}
          <strong>everyone</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-6">Core Guidelines</h2>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">1. Be Respectful to Store Employees</h3>
            <p className="text-sm text-muted-foreground">
              Even if you're frustrated, caught off-guard, or denied a penny sale: stay calm, stay
              polite, avoid confrontations. Staff are following orders - not making personal
              decisions against you.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">2. Don't Be Loud About Finds</h3>
            <p className="text-sm text-muted-foreground">
              Getting loud, excited, or bragging at checkout draws attention. Don't show receipts to
              other customers, tell staff about your score, or film inside the store.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">3. Use Community Intel Wisely</h3>
            <p className="text-sm text-muted-foreground">
              Share helpful info like UPCs, tag dates, or clearance cycles. Post accurate finds -
              not rumors. Don't flood groups with repeat questions.
            </p>
          </div>
          <div className="p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">4. Know When to Walk Away</h3>
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
        <h2 className="section-heading">Conclusion: Tips for Success</h2>
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
    </article>
  )
}
