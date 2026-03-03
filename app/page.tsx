import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, List, Search } from "lucide-react"
import { MEMBER_COUNT_BADGE_TEXT, FACEBOOK_GROUP_URL } from "@/lib/constants"
import { HomePathSplit } from "@/components/home/HomePathSplit"
import { HomeProofHero } from "@/components/home/HomeProofHero"
import { HomeProofStrip } from "@/components/home/HomeProofStrip"
import { getRecentFinds } from "@/lib/fetch-penny-data"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"

// Ensure the homepage proof modules reflect recent Supabase enrichment fixes without redeploys.
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
      <HomeProofHero items={recentFinds} />
      <HomePathSplit />
      <HomeProofStrip items={recentFinds} />

      <section className="px-4 pb-16 sm:px-6 lg:pb-20 bg-[var(--bg-page)]">
        <div className="container-wide">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                How Penny Central helps
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text-primary)]">
                Proof first. Guide when you need context. Penny List when you already know the
                drill.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                Use the homepage to answer the first question quickly: is there enough current proof
                here to justify opening the list or learning the process? Once that is clear, the
                rest of the site becomes easier to navigate.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Need the trust details?{" "}
                <Link
                  href="/transparency"
                  className="text-[var(--link-default)] underline underline-offset-4"
                >
                  Read transparency
                </Link>
                . Want the community loop that keeps the list useful?{" "}
                <a
                  href={FACEBOOK_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--link-default)] underline underline-offset-4"
                >
                  See the Facebook group
                </a>
                .
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: List,
                  title: "Check live proof",
                  body: "Use current list activity and SKU pages to decide whether the trip is worth your time.",
                },
                {
                  icon: BookOpen,
                  title: "Learn the cycle",
                  body: "Use the guide when you need the markdown pattern, in-store reality, and the why behind penny items.",
                },
                {
                  icon: Search,
                  title: "Tighten the trip",
                  body: "Once you already have target SKUs, layer in store planning instead of wandering the aisles blindly.",
                },
              ].map((step) => (
                <article
                  key={step.title}
                  className="rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-page)] p-5 shadow-[var(--shadow-card)]"
                >
                  <step.icon className="h-6 w-6 text-[var(--cta-primary)]" aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-page)] p-5 text-sm leading-relaxed text-[var(--text-secondary)] shadow-[var(--shadow-card)] sm:p-6">
            Found something in-store after you check the list?{" "}
            <Link
              href="/report-find"
              className="font-semibold text-[var(--link-default)] underline underline-offset-4"
            >
              Report a find
            </Link>{" "}
            so the next shopper gets stronger proof, faster.
            <span className="mt-3 block">
              Use Store Finder only after you already know what SKUs you want to chase.
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
