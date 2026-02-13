import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, ExternalLink, Users, Map, List, PlusCircle } from "lucide-react"
import {
  COMMUNITY_MEMBER_COUNT_DISPLAY,
  MEMBER_COUNT_BADGE_TEXT,
  FACEBOOK_GROUP_URL,
} from "@/lib/constants"
import { TrackableNextLink } from "@/components/trackable-next-link"
import { TodaysFinds } from "@/components/todays-finds"
import { getRecentFinds } from "@/lib/fetch-penny-data"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"
// Ensure the homepage "Today's Finds" module reflects recent Supabase enrichment fixes without redeploys.
export const revalidate = 600 // 10 minutes

export const metadata: Metadata = {
  title: `Home Depot Penny Items: Live $0.01 Finds From ${MEMBER_COUNT_BADGE_TEXT} | Penny Central`,
  description:
    "Live community-reported $0.01 items with recency and state distribution. Open today's penny list and report what you see in-store.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com",
    title: `Live $0.01 Finds From ${MEMBER_COUNT_BADGE_TEXT}`,
    description:
      "Live community reports, updated as sightings come in. See what's hitting stores now.",
    images: [
      {
        url: "https://www.pennycentral.com/api/og?page=homepage",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Live $0.01 Finds From ${MEMBER_COUNT_BADGE_TEXT}`,
    description:
      "Live community reports, updated as sightings come in. See what's hitting stores now.",
    images: ["https://www.pennycentral.com/api/og?page=homepage"],
  },
  alternates: {
    canonical: "/",
  },
}

export default async function Home() {
  const recentFinds = await getRecentFinds(48)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Penny Central",
            url: "https://www.pennycentral.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.pennycentral.com/penny-list?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Penny Central",
            url: "https://www.pennycentral.com",
            logo: "https://www.pennycentral.com/icon.svg",
            sameAs: [FACEBOOK_GROUP_URL],
          }),
        }}
      />
      <RouteAdSlots pathname="/" />
      {/* ============================================
          HERO SECTION
          
          Typography: Uses unified type scale
          - H1: text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight
          - Lead: text-lg sm:text-xl leading-relaxed
          - Body: text-base leading-relaxed
          
          Spacing: Unified section padding system
          - py-12 sm:py-16 lg:py-20 for main sections
          - Badge → H1: mt-4
          - H1 → Lead: mt-3
          - Lead → CTAs: mt-6
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto text-center">
          {/* H1 - Unified type scale */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Live Home Depot Penny Finds
          </h1>

          {/* Lead text */}
          <p className="mt-3 text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            Guide + community finds. {COMMUNITY_MEMBER_COUNT_DISPLAY} members strong.
          </p>

          {/* CTAs - Primary first-action + demoted secondary path */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/penny-list"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold shadow-md hover:bg-[var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
              aria-label="Browse the community penny list"
            >
              <List className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Browse Penny List
            </Link>
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Already found one?{" "}
            <TrackableNextLink
              href="/report-find"
              className="inline-flex items-center gap-1 text-[var(--link-default)] underline underline-offset-2 hover:text-[var(--link-hover)]"
              aria-label="Report a new penny find"
              eventName="report_find_click"
              eventParams={{ ui_source: "home-hero-secondary" }}
            >
              <PlusCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              Report a Find
            </TrackableNextLink>
          </p>
        </div>
      </section>

      <TodaysFinds items={recentFinds} />

      {/* ============================================
          HOW IT WORKS SECTION
          Scannable steps with unified typography
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              How Penny Hunting Works
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Home Depot markdown behavior is not random. It follows operational patterns you can
              track, verify, and execute against.
            </p>
          </div>

          {/* Steps grid */}
          <div className="mb-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Penny pricing is a final-stage inventory state, not a public sale campaign. Items move
              through clearance endings until the system flags them for removal. That is why speed,
              verification discipline, and location context matter more than luck. Use this
              four-step model to avoid wasted trips and to focus on decisions that produce
              repeatable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] dark:bg-[var(--bg-tertiary)] mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">1</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Learn the Cycle
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Items commonly move through markdown endings before reaching $0.01. When you
                understand stage progression and timing windows, you stop treating each store trip
                as a gamble. The goal is to identify late-stage candidates, then validate in-store
                with UPC-based checks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] dark:bg-[var(--bg-tertiary)] mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">2</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Scout First
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Use digital signals to build a focused shortlist before you leave home. App and web
                inventory can narrow targets, but they are directional. Treat them as a planning
                layer, then confirm with on-site scan behavior so you do not burn time on false
                positives.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] dark:bg-[var(--bg-tertiary)] mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">3</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Hunt Smart
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Prioritize likely zones based on current reset behavior, home-bay placement, and
                neglected inventory signals. Efficiency beats volume. A disciplined route through
                the store gives you more verified scans and fewer random checks in the same amount
                of time.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] dark:bg-[var(--bg-tertiary)] mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">4</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Checkout
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Verification and checkout behavior can vary by store and by item state. Stay calm,
                follow store policy, and focus on clean verification steps rather than
                confrontation. Process discipline protects your time and improves repeat success
                rates over the long run.
              </p>
            </div>
          </div>

          {/* CTA link (mobile-only; desktop already has the hero CTA in view) */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-[var(--link-default)] font-medium hover:underline hover:text-[var(--link-hover)]"
            >
              Read the full guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding-sm px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-snug">
            Why this site is structured this way
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
            PennyCentral is built as a utility plus education system. The utility layer helps you
            act quickly with live reports, filters, and store-aware targeting. The education layer
            helps you make better decisions by explaining verification rules, clearance behavior,
            and risk signals that reduce wasted trips. Both are necessary. Utility alone becomes
            noisy; education alone becomes slow.
          </p>
          <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
            That is why the homepage points you to three core routes: the Penny List for live
            targeting, the Guide for structured process, and Report a Find for data quality. The
            better the report quality, the stronger the list becomes for everyone. The stronger the
            guide adherence, the fewer false assumptions people make at checkout.
          </p>
        </div>
      </section>

      {/* ============================================
          TOOLS SECTION

          Layout: Unified container + grid system
          Typography: H2 + supporting text
          Cards: card-interactive class for hover states
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              Tools
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Tools to help you plan trips and find penny items
            </p>
          </div>

          {/* Tool cards grid - 2 tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Read the Guide Card */}
            <Link
              href="/guide"
              className="card-interactive group flex flex-col bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-default)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-page)] border border-[var(--border-default)] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Read the Guide
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                Step-by-step tips for the full penny hunting cycle.
              </p>
            </Link>

            {/* Store Finder Card */}
            <Link
              href="/store-finder"
              className="card-interactive group flex flex-col bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-default)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-page)] border border-[var(--border-default)] flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Store Finder Map
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                Locate nearby Home Depot stores and plan your trips.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          COMMUNITY SECTION
          Social proof + community CTA
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-page)] mx-auto mb-4 flex items-center justify-center border border-[var(--border-default)]">
            <Users className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
            Join {COMMUNITY_MEMBER_COUNT_DISPLAY} Active Hunters
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Join {COMMUNITY_MEMBER_COUNT_DISPLAY} active hunters sharing real-time finds,
            verification tips, and store-specific clearance patterns. Get notified when penny waves
            hit your area.
          </p>
          <a
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold shadow-md hover:bg-[var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-card)]"
          >
            Join the Facebook Group
            <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ============================================
          SUPPORT SECTION
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              Support PennyCentral
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
              This site is free to use. Ads are being enabled now to help keep it sustainable.
              Optional support is always appreciated, but never required.
            </p>
          </div>

          {/* Support CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <Link
              href="/support"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[48px] rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold shadow-md hover:bg-[var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
            >
              Support PennyCentral
            </Link>
            <Link
              href="/support"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)] dark:border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] dark:hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
            >
              Support & Transparency
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
