import { filterValidPennyItems } from "@/lib/penny-list-utils"
import { getPennyList } from "@/lib/fetch-penny-data"

export default async function HaulsPage() {
  const items = filterValidPennyItems(await getPennyList())

  // Group by state
  const byState = items.reduce(
    (acc, item) => {
      const locations = item.locations || {}
      Object.keys(locations).forEach((s) => {
        acc[s] = acc[s] || []
        acc[s].push(item)
      })
      return acc
    },
    {} as Record<string, typeof items>
  )

  const states = Object.keys(byState).sort((a, b) => byState[b].length - byState[a].length)

  return (
    <div className="section-padding px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Penny Hauls — Community Finds by State</h1>
        {states.length === 0 ? (
          <p>No hauls yet — be the first to report a find!</p>
        ) : (
          states.map((state) => (
            <section key={state} className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                {state} — {byState[state].length} finds
              </h2>
              <ul className="grid gap-2">
                {byState[state].slice(0, 10).map((item) => (
                  <li key={item.sku} className="p-3 bg-[var(--bg-card)] rounded">
                    <a href={`/sku/${item.sku}`} className="font-medium">
                      {item.name}
                    </a>
                    <div className="text-sm text-[var(--text-secondary)]">
                      SKU {item.sku} • {item.notes}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
