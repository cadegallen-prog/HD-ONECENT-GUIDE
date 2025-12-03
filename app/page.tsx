import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Penny Central - Find $0.01 Items at Home Depot",
  description:
    "Join 36,000+ penny hunters. Learn the clearance system and score items for a single cent.",
}

export default function Home() {
  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-white dark:bg-stone-900">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium mb-8 border border-stone-200 dark:border-stone-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-copper opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-copper"></span>
          </span>
          Join 36,000+ penny hunters
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 max-w-4xl leading-tight">
          Find <span className="text-brand-gunmetal dark:text-stone-400">$0.01</span> Items at Home
          Depot
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl">
          The complete guide to penny hunting. Learn the clearance system, find stores, and score
          items for a single cent.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/guide"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold text-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:ring-offset-2"
          >
            Read the Complete Guide
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="/store-finder"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white dark:bg-stone-800 border-2 border-brand-gunmetal dark:border-stone-600 hover:bg-brand-gunmetal hover:text-white dark:hover:bg-stone-700 text-brand-gunmetal dark:text-stone-300 font-semibold text-lg transition-all hover:-translate-y-0.5"
          >
            Find Nearby Stores
          </Link>
        </div>
      </section>

      {/* ============================================ */}
      {/* VALUE PROPS SECTION */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-stone-100 dark:bg-stone-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-gunmetal dark:text-stone-50 mb-4">
            Everything you need to start
          </h2>
          <p className="text-center text-stone-600 dark:text-stone-400 mb-16 max-w-2xl mx-auto">
            Penny hunting isn't luck — it's strategy. Learn the system and start saving.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Learn */}
            <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-brand-gunmetal dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Learn the System
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Understand how Home Depot's clearance cycle works and when items hit $0.01.
              </p>
            </div>

            {/* Card 2 - Find */}
            <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-brand-gunmetal dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Find Stores
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Locate Home Depot stores near you with hours, contact info, and distance.
              </p>
            </div>

            {/* Card 3 - Save */}
            <div className="bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-brand-gunmetal dark:text-stone-400"
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
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Save Big
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Score hardware, tools, lighting, and more — all for just one cent each.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-white dark:bg-stone-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-gunmetal dark:text-stone-50 mb-16">
            How penny hunting works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-brand-copper mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-brand-gunmetal dark:text-stone-300">1</span>
              </div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Learn the lifecycle
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Items follow a predictable markdown pattern: .00 → .06 → .03 → .01
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-brand-copper mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-brand-gunmetal dark:text-stone-300">2</span>
              </div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Scout digitally
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Use the Home Depot app to check inventory and spot signals
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-brand-copper mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-brand-gunmetal dark:text-stone-300">3</span>
              </div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Hunt strategically
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Check clearance endcaps, back corners, and overhead storage
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-2 border-brand-copper mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-brand-gunmetal dark:text-stone-300">4</span>
              </div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Checkout confidently
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Use self-checkout, stay calm, and handle any questions
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold text-lg transition-all hover:-translate-y-0.5"
            >
              Start Learning
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SUPPORT THE SITE SECTION */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-stone-100 dark:bg-stone-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gunmetal dark:text-stone-50 mb-4">
              Support Penny Central
            </h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              This site is free to use. If you've found value here, consider supporting the project.
              Every bit helps, and using our affiliate links costs you nothing extra. Thank you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tip Card */}
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
                Buy me a coffee or contribute any amount to help cover hosting, domain, and
                development costs.
              </p>
              <a
                href="https://paypal.me/cadegallen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
              >
                Leave a Tip
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

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
                Sign up through our link and earn cashback on your purchases. We receive a small
                commission at no extra cost to you.
              </p>
              <a
                href="https://www.befrugal.com/rs/NJIKJUB/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold transition-all"
              >
                Get Cashback with BeFrugal
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* COMMUNITY SECTION */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-stone-900 dark:bg-stone-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-50 mb-6">
            Join 36,000+ Penny Hunters
          </h2>
          <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
            Share finds, ask questions, and stay updated on the latest tips and patterns in the Home
            Depot One Cent Items Facebook group.
          </p>

          <a
            href="https://www.facebook.com/groups/homedepotonecent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-cta-primary hover:bg-cta-hover text-white font-semibold text-lg transition-all hover:-translate-y-0.5"
          >
            Join the Facebook Group
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* ============================================ */}
      {/* TOOLS SECTION */}
      {/* ============================================ */}
      <section className="py-20 px-6 bg-white dark:bg-stone-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-gunmetal dark:text-stone-50 mb-4">
            Tools to help you hunt
          </h2>
          <p className="text-center text-stone-600 dark:text-stone-400 mb-16">
            Plan smarter, hunt better.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Store Finder Card */}
            <Link
              href="/store-finder"
              className="group bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700 hover:border-brand-gunmetal dark:hover:border-stone-500 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-brand-gunmetal dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Store Finder
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Find Home Depot locations near you with map, hours, phone numbers, and distance.
              </p>
              <span className="inline-flex items-center text-cta-primary dark:text-blue-400 text-sm font-medium group-hover:gap-2 gap-1.5 transition-all">
                Find nearby stores →
              </span>
            </Link>

            {/* Trip Tracker Card */}
            <Link
              href="/trip-tracker"
              className="group bg-white dark:bg-stone-800 rounded-lg p-6 border border-stone-200 dark:border-stone-700 hover:border-brand-gunmetal dark:hover:border-stone-500 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-brand-gunmetal dark:text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Trip Tracker
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Plan your penny hunting trips and track your success over time.
              </p>
              <span className="inline-flex items-center text-cta-primary dark:text-blue-400 text-sm font-medium group-hover:gap-2 gap-1.5 transition-all">
                Plan a trip →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
