import type { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  ExternalLink,
  Heart,
  DollarSign,
  Users,
  Map,
  List,
  PlusCircle,
} from "lucide-react"
import {
  COMMUNITY_MEMBER_COUNT_DISPLAY,
  FACEBOOK_GROUP_URL,
  BEFRUGAL_REFERRAL_PATH,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Home Depot Penny List & Shopping Guide | Penny Central",
  description: `The complete guide to finding Home Depot penny items. Latest penny list, clearance cycles, and tips used by ${COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters.`,
}

export default function Home() {
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
            Find Home Depot Penny Items
          </h1>

          {/* Lead text */}
          <p className="mt-3 text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            Guide + community finds. 40,000 hunters strong.
          </p>

          {/* CTAs - Unified button system */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/penny-list"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold shadow-md hover:bg-[var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
              aria-label="Browse the community penny list"
            >
              <List className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Browse Penny List
            </Link>
            <Link
              href="/report-find"
              className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)] dark:border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] dark:hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
              aria-label="Report a new penny find"
            >
              <PlusCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Report a Find
            </Link>
          </div>
        </div>
      </section>

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
              Items follow a predictable markdown cycle before hitting $0.01
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] mx-auto mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">1</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Learn the Cycle
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                Items markdown: .00 → .06 → .03 → .01
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] mx-auto mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">2</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Scout First
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                Check inventory in the Home Depot app before driving
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] mx-auto mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">3</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Hunt Smart
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                Endcaps, back corners, overhead storage
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] mx-auto mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">4</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Checkout
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                Self-checkout works best
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
              Resources to help you plan trips and find penny items
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
            Join {COMMUNITY_MEMBER_COUNT_DISPLAY} Penny Hunters
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Connect with the community to share finds, ask questions, and stay updated on the latest
            penny patterns.
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
          Secondary CTAs for tips and cashback
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              Support Penny Central
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
              This site is free. If it&apos;s been helpful, here are ways to support the project.
            </p>
          </div>

          {/* Support cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Tip Card */}
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-default)] block"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-page)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
                <Heart className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Buy Me a Coffee
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                If the guide saved you time or gas money, a one-time PayPal coffee covers hosting,
                APIs, and the odd scouting trip.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[var(--link-default)] font-medium">
                Buy me a coffee
                <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </div>
            </a>

            {/* Cashback Card */}
            <a
              href={BEFRUGAL_REFERRAL_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="card-interactive bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-default)] block"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-page)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
                <DollarSign className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Activate BeFrugal Cashback
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Turn on free cashback before normal Home Depot orders. When you earn $10+ BeFrugal
                sends a referral bonus that keeps the site free.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[var(--link-default)] font-medium">
                Activate BeFrugal cashback
                <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
