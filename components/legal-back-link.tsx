import Link from "next/link"

export function LegalBackLink() {
  return (
    <p className="mb-6 text-sm text-[var(--text-secondary)]">
      <Link href="/penny-list" className="text-[var(--cta-primary)] underline">
        ← Back to Penny List
      </Link>
    </p>
  )
}
