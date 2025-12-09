import Link from "next/link"
import type { Metadata } from "next"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About | Penny Central",
  description:
    "Learn about Penny Central, the companion site for the Home Depot One Cent Items community.",
}

export default function AboutPage() {
  return (
    <div className="container-narrow py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
          About Penny Central
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
          A free, community-driven guide for finding $0.01 clearance items at Home Depot.
        </p>
      </header>

      {/* What This Is */}
      <section className="mb-16">
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
          Penny Central is a community-driven guide for finding clearance items marked to $0.01 at
          Home Depot stores. This resource was created by and for members of the{" "}
          <Link
            href={FACEBOOK_GROUP_URL}
            className="text-[var(--cta-primary)] hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home Depot One Cent Items Facebook group
          </Link>
          , which has grown to over {COMMUNITY_MEMBER_COUNT_DISPLAY} members.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed">
          This guide covers the clearance lifecycle, digital scouting tools, in-store strategies,
          checkout procedures, and community best practices. Everything you need to understand how
          penny items work and how to find them effectively.
        </p>
      </section>

      {/* How This Site is Supported */}
      <section id="support" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug mb-4">
          How This Site is Supported
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          Penny Central is completely free. No ads, no paywalls, no premium tiers. Running this site
          comes with real costs: hosting, domain, development time, and ongoing maintenance.
          Here&apos;s how you can help:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* BeFrugal Card */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-8 border-l-4 border-brand-copper border-t border-r border-b border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-brand-gunmetal dark:text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
              Activate BeFrugal Cashback
            </h3>
            <p className="text-stone-700 dark:text-stone-300 mb-6 leading-relaxed">
              This is the easiest win. Turn on cashback before normal purchases, earn money back,
              and when you clear $10 BeFrugal sends a referral bonus that keeps Penny Central
              running.
            </p>
            <ul className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mb-6">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Works at Home Depot, Lowe&apos;s, Sam&apos;s Club, Amazon, and more
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Free to sign up, no card required
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Supports Penny Central once you earn $10+ in cashback
              </li>
            </ul>
            <a
              href="/go/befrugal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
            >
              Activate BeFrugal Cashback
            </a>
          </div>

          {/* PayPal Card */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-8 border-l-4 border-brand-copper border-t border-r border-b border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-brand-gunmetal dark:text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3">
              Buy Me a Coffee
            </h3>
            <p className="text-stone-700 dark:text-stone-300 mb-6 leading-relaxed">
              Hosting, APIs, map tiles, and in-store testing runs add up. If the guides helped you
              score a haul, buying me a coffee via PayPal keeps everything fast and free.
            </p>
            <ul className="text-sm text-stone-700 dark:text-stone-300 space-y-2 mb-6">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Covers hosting, domains, and analytics
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Funds new tools and field-testing trips
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-color-success mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Keeps the guides ad-free and open to everyone
              </li>
            </ul>
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
            >
              Buy Me a Coffee
            </a>
          </div>
        </div>
      </section>

      {/* How This Site Stays Free */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          How This Site Stays Free
        </h2>
        <div className="text-stone-700 dark:text-stone-300 space-y-4 leading-relaxed mb-6">
          <p>
            I cover the cost of the site, tools, and updates myself. There are no paywalls or hidden
            &quot;gotchas.&quot;
          </p>

          <p>
            To keep everything free long term, there are two totally optional ways to support the
            project:
          </p>

          <ul className="list-disc pl-5 space-y-1">
            <li>
              BeFrugal cashback — you earn money back on normal orders and I receive a one-time
              referral bonus after you reach $10
            </li>
            <li>
              Buying me a coffee via PayPal when the guides save you serious time or gas money
            </li>
          </ul>

          <p>
            None of this is required. All the penny item info and guides work with or without it. If
            you want the full breakdown of how cashback works, how long it takes, and what the
            catches are, you can read the full explanation here:
          </p>
        </div>

        <Link
          href="/cashback"
          className="inline-flex items-center text-cta-primary dark:text-blue-400 font-medium hover:underline mb-6"
        >
          Read the full cashback guide →
        </Link>

        <SupportAndCashbackCard className="mt-4" />
      </section>
    </div>
  )
}
