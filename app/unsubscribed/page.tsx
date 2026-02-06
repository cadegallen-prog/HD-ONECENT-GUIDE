import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Unsubscribed | Penny Central",
  description: "You have been unsubscribed from Penny Central email updates.",
  alternates: {
    canonical: "/unsubscribed",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams?: Promise<{ already?: string }>
}) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const isAlready = resolvedSearchParams.already === "true"

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-8 shadow-[var(--shadow-card)]">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-[var(--status-success)]/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-[var(--status-success)]" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {isAlready ? "Already Unsubscribed" : "Successfully Unsubscribed"}
          </h1>

          <p className="text-[var(--text-secondary)] mb-6">
            {isAlready
              ? "You were already unsubscribed from our email list. You won't receive any further penny list updates."
              : "You've been removed from our email list. You won't receive any further penny list updates."}
          </p>

          <p className="text-sm text-[var(--text-muted)] mb-6">
            Changed your mind? You can always resubscribe from the{" "}
            <Link
              href="/penny-list"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline underline-offset-4"
            >
              Penny List
            </Link>{" "}
            page.
          </p>

          <div className="space-y-3">
            <Link
              href="/penny-list"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium transition-colors duration-150 hover:bg-[var(--cta-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[44px]"
            >
              View Penny List
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] font-medium transition-colors duration-150 hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] min-h-[44px]"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-6">
          We're sorry to see you go! If you have any feedback about our emails, please let us know
          via the{" "}
          <Link
            href="https://www.facebook.com/groups/homedepotonecent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline underline-offset-4"
          >
            Facebook group
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
