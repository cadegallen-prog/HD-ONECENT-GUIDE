import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Penny Central",
  description: "Learn about Penny Central, the companion site for the Home Depot One Cent Items community.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
          About Penny Central
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          A free, community-driven guide for finding $0.01 clearance items at Home Depot.
        </p>
      </header>

      {/* What This Is */}
      <section className="mb-16">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Penny Central is a community-driven guide for finding clearance items marked to $0.01
          at Home Depot stores. This resource was created by and for members of the{" "}
          <Link
            href="https://www.facebook.com/groups/homedepotonecent"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home Depot One Cent Items Facebook group
          </Link>, which has grown to over 36,000 members.
        </p>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This guide covers the clearance lifecycle, digital scouting tools, in-store strategies,
          checkout procedures, and community best practices. Everything you need to understand
          how penny items work and how to find them effectively.
        </p>
      </section>

      {/* How This Site is Supported */}
      <section id="support" className="mb-16">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          How This Site is Supported
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Penny Central is completely free. No ads, no paywalls, no premium tiers. Running this site
          comes with real costs: hosting, domain, development time, and ongoing maintenance. Here&apos;s
          how you can help:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* BeFrugal Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Save Money (and Support the Site)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Already shopping at Home Depot for your penny hunting trips? BeFrugal gives you cashback
              on every purchase. Sign up free through our link and start earning cashback automatically.
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Earn cashback on Home Depot purchases
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free to sign up and use
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Supports this site at no cost to you
              </li>
            </ul>
            <a
              href="https://www.befrugal.com/rs/NJIKJUB/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-500 dark:text-indigo-400 font-medium hover:gap-3 gap-2 transition-all"
            >
              Get Cashback with BeFrugal
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* PayPal Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Buy Me a Coffee
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Penny Central is a passion project that costs real money to run: hosting, domain,
              ongoing development and maintenance. If this site has helped you score deals,
              consider buying me a coffee.
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Keeps the site running
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Funds new features
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No ads, no paywalls, ever
              </li>
            </ul>
            <a
              href="https://paypal.me/cadegallen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-indigo-500 dark:text-indigo-400 font-medium hover:gap-3 gap-2 transition-all"
            >
              Support on PayPal ☕
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
