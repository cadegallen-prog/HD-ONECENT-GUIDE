import Link from "next/link"
import type { Metadata } from "next"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"

export const metadata: Metadata = {
  title: "About | Penny Central",
  description:
    "Learn about Penny Central, the companion site for the Home Depot One Cent Items community.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          About Penny Central
        </h1>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          A free, community-driven guide for finding $0.01 clearance items at Home Depot.
        </p>
      </header>

      {/* What This Is */}
      <section className="mb-16">
        <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
          Penny Central is a community-driven guide for finding clearance items marked to $0.01 at
          Home Depot stores. This resource was created by and for members of the{" "}
          <Link
            href="https://www.facebook.com/groups/homedepotonecent"
            className="text-cta-primary dark:text-blue-400 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home Depot One Cent Items Facebook group
          </Link>
          , which has grown to over 36,000 members.
        </p>

        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
          This guide covers the clearance lifecycle, digital scouting tools, in-store strategies,
          checkout procedures, and community best practices. Everything you need to understand how
          penny items work and how to find them effectively.
        </p>
      </section>

      {/* How This Site is Supported */}
      <section id="support" className="mb-16">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-50 mb-4">
          How This Site is Supported
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
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
              Use BeFrugal for Cashback
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
              Already shopping at Home Depot for your penny hunting trips? BeFrugal gives you
              cashback on every purchase. Sign up free through our link and start earning cashback
              automatically.
            </p>
            <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-2 mb-6">
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
                Earn cashback on Home Depot purchases
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
                Free to sign up and use
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
                Supports this site at no cost to you
              </li>
            </ul>
            <a
              href="https://www.befrugal.com/rs/NJIKJUB/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
            >
              Get Cashback with BeFrugal
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
              Leave a Tip
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
              Penny Central is a passion project that costs real money to run: hosting, domain,
              ongoing development and maintenance. If this site has helped you score deals, consider
              buying me a coffee.
            </p>
            <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-2 mb-6">
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
                Keeps the site running
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
                Funds new features
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
                No ads, no paywalls, ever
              </li>
            </ul>
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
            >
              Leave a Tip
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
              A cashback site and app called BeFrugal that pays you when you shop online and sends
              me a one time referral bonus if you actually use it and earn at least $10 in cashback
            </li>
            <li>
              A PayPal tip jar for people who feel like the guides and tools saved them serious time
              or money
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
