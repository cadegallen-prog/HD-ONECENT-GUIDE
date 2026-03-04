type GuideJumpNavItem = {
  id: string
  step: string
  title: string
  summary: string
}

type GuideJumpNavProps = {
  items: GuideJumpNavItem[]
}

export function GuideJumpNav({ items }: GuideJumpNavProps) {
  return (
    <nav aria-label="Guide jump navigation" className="not-prose" data-testid="guide-jump-nav">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Jump Navigation
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
            Jump to what you need
          </h2>
        </div>
        <p className="max-w-[26ch] text-right text-sm text-[var(--text-secondary)]">
          New here? Read from Step 1. Returning? Use the cards below.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex min-h-[132px] flex-col rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition-colors duration-150 hover:border-[var(--cta-primary)] hover:bg-[var(--bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-primary)] focus-visible:ring-offset-2"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] group-hover:border-[var(--cta-primary)] group-hover:text-[var(--text-primary)]">
                {item.step}
              </span>
              <span className="text-sm text-[var(--text-muted)] transition-colors group-hover:text-[var(--cta-primary)]">
                Jump
              </span>
            </div>
            <h3 className="text-lg font-semibold leading-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--cta-primary)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.summary}
            </p>
          </a>
        ))}
      </div>
    </nav>
  )
}
