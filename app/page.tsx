import type { Metadata } from "next"
import Link from "next/link"
import {
  MapPin,
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  Heart,
  DollarSign,
  Users,
} from "lucide-react"
import {
  COMMUNITY_MEMBER_COUNT_DISPLAY,
  FACEBOOK_GROUP_URL,
  BEFRUGAL_REFERRAL_PATH,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "Penny Central - Your Guide to $0.01 Home Depot Items",
  description: `The complete guide to finding Home Depot penny items. Tools, guides, and tips used by ${COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters.`,
}

export default function Home() {
  return (
    <>
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
      <section className="section-padding px-4 sm:px-6 bg-white dark:bg-[var(--bg-page)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true"></span>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Join {COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters
            </span>
          </div>

          {/* H1 - Unified type scale */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Find $0.01 Items at Home Depot
          </h1>

          {/* Lead text */}
          <p className="mt-3 text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            Your guide to finding penny items at Home Depot.
          </p>

          {/* Supporting text */}
          <p className="mt-4 text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Free tools and guides to help you find $0.01 clearance items. Learn the markdown system
            and start hunting today.
          </p>

          {/* CTAs - Unified button system */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/store-finder"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold shadow-md hover:bg-[var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
            >
              <MapPin className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Find Stores Near You
            </Link>
            <Link
              href="/guide"
              className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)] dark:border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] dark:hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--bg-page)]"
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              Read the Guide
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
      <section className="section-padding px-4 sm:px-6 bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)]">
        <div className="container-wide">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              Penny Hunting Tools
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              Everything you need to plan and execute successful hunts
            </p>
          </div>

          {/* Tool cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Store Finder Card */}
            <Link
              href="/store-finder"
              className="card-interactive group flex flex-col bg-white dark:bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-default)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Store Finder
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                Find Home Depot locations near you with hours, phone numbers, and directions.
              </p>
              <span className="mt-4 inline-flex items-center text-[var(--cta-primary)] text-sm font-medium group-hover:underline">
                Find stores →
              </span>
            </Link>

            {/* Penny Guide Card */}
            <Link
              href="/guide"
              className="card-interactive group flex flex-col bg-white dark:bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-default)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Complete Guide
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                Learn how penny items work, the markdown lifecycle, and proven hunting strategies.
              </p>
              <span className="mt-4 inline-flex items-center text-[var(--cta-primary)] text-sm font-medium group-hover:underline">
                Start learning →
              </span>
            </Link>

            {/* Trip Tracker Card */}
            <Link
              href="/trip-tracker"
              className="card-interactive group flex flex-col bg-white dark:bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-default)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Trip Tracker
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed flex-grow">
                Plan your penny hunting trips and track your finds over time.
              </p>
              <span className="mt-4 inline-flex items-center text-[var(--cta-primary)] text-sm font-medium group-hover:underline">
                Plan a trip →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS SECTION
          Scannable steps with unified typography
          ============================================ */}
      <section className="section-padding px-4 sm:px-6 bg-white dark:bg-[var(--bg-page)]">
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
                Items markdown from .00 → .06 → .03 → .01
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] dark:bg-[var(--bg-tertiary)] mx-auto mb-3 flex items-center justify-center border border-[var(--border-default)]">
                <span className="text-base font-bold text-[var(--cta-primary)]">2</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Scout Digitally
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                Use the HD app to check inventory before visiting
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
                Check endcaps, back corners, and overhead storage
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
                Self-checkout works best for penny items
              </p>
            </div>
          </div>

          {/* CTA link */}
          <div className="mt-8 text-center">
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 text-[var(--cta-primary)] font-medium hover:underline"
            >
              Learn more in the full guide →
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
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[var(--bg-elevated)] mx-auto mb-4 flex items-center justify-center border border-[var(--border-default)]">
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
      <section className="section-padding px-4 sm:px-6 bg-white dark:bg-[var(--bg-page)]">
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
            <div className="card-interactive bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-default)]">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[var(--bg-elevated)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
                <Heart className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Leave a Tip
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Help cover hosting and development costs with a one-time contribution.
              </p>
              <a
                href="https://paypal.me/cadegallen"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[var(--cta-primary)] font-medium hover:underline"
              >
                Send a tip via PayPal
                <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </a>
            </div>

            {/* Cashback Card */}
            <div className="card-interactive bg-[var(--bg-elevated)] dark:bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-default)]">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-[var(--bg-elevated)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
                <DollarSign className="w-6 h-6 text-[var(--cta-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug">
                Use BeFrugal
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Sign up through our link to earn cashback. We get a small referral at no cost to
                you.
              </p>
              <Link
                href={BEFRUGAL_REFERRAL_PATH}
                className="mt-4 inline-flex items-center gap-2 text-[var(--cta-primary)] font-medium hover:underline"
              >
                Get cashback with BeFrugal
                <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
