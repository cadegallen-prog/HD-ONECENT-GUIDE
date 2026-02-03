import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function FactVsFiction() {
  return (
    <article className="guide-article space-y-16 md:space-y-20">
      {/* ============================================ */}
      {/* SECTION VII: FACT VS FICTION */}
      {/* ============================================ */}
      <section id="fact-vs-fiction" className="scroll-mt-28">
        <p>
          Despite how widespread penny hunting has become, Home Depot has never publicly confirmed
          the full clearance-to-penny process. Most of what we know comes from community
          observations, shared screenshots and receipts, and logical deductions from how retail
          clearance cycles work.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What's Real vs. What's Rumor</h2>
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

        <h2 className="text-2xl font-semibold mt-8 mb-4">How Dependable Is Community Intel?</h2>
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
    </article>
  )
}
