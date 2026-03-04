import type { Metadata } from "next"
import Link from "next/link"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"
import { MonumetricInContentSlot } from "@/components/ads/monumetric-in-content-slot"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { GuideJumpNav } from "@/components/guide/GuideJumpNav"
import { PageShell, Prose, Section } from "@/components/page-templates"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "How to Find Home Depot Penny Items (2026 Guide) | Penny Central",
  description:
    "The canonical beginner guide to Home Depot penny items: what they are, how clearance moves, how to verify safely in store, and what to do after a confirmed find.",
  keywords: [
    "how to find home depot penny items",
    "home depot penny guide",
    "home depot one cent items",
    "how to find penny items at home depot",
    "penny item guide",
  ],
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "How to Find Home Depot Penny Items (2026 Guide)",
    description:
      "The canonical beginner guide to what penny items are, how to verify them safely, and what to do after a confirmed find.",
  },
  twitter: {
    card: "summary_large_image",
  },
}

const jumpNavItems = [
  {
    id: "what-penny-items-are",
    step: "Step 1",
    title: "What penny items are",
    summary: "Start with the mental model so the rest of the guide makes sense.",
  },
  {
    id: "how-the-markdown-cycle-works",
    step: "Step 2",
    title: "How the markdown cycle works",
    summary: "Learn the endings, timing ranges, and signals that actually matter.",
  },
  {
    id: "scout-before-a-store-trip",
    step: "Step 3",
    title: "How to scout before a store trip",
    summary: "Use a shortlist and store-specific evidence so you do not waste the drive.",
  },
  {
    id: "verify-in-store",
    step: "Step 4",
    title: "How to verify in-store",
    summary: "Use the UPC, look in the right places, and keep the process calm.",
  },
  {
    id: "checkout-and-pull-behavior",
    step: "Step 5",
    title: "What checkout and pull behavior means",
    summary: "Understand why penny sales create friction and why store outcomes vary.",
  },
  {
    id: "myths-to-ignore",
    step: "Step 6",
    title: "What myths to ignore",
    summary: "Drop the rumor-based shortcuts that waste time and create bad expectations.",
  },
  {
    id: "after-a-confirmed-find",
    step: "Step 7",
    title: "What to do after a confirmed find",
    summary: "Close the loop with the right evidence, reporting, and next action.",
  },
] as const

const signalRows = [
  [".00", "First markdown. Early clearance, not a penny warning by itself."],
  [".06 / .04", "Mid-clearance. Worth tracking, but still not proof that penny is next."],
  [".03 / .02", "Late clearance. Stronger signal when paired with an older tag date."],
  [".01", "Penny. Internal removal stage, not a guaranteed sale."],
] as const

const scoutingRules = [
  "Choose the exact store before trusting any inventory clue.",
  "Build a shortlist of 5 to 15 SKUs instead of a giant wish list.",
  "Check the normal home bay first, then use overhead as a secondary pass.",
  "Drive only when you have more than one signal, not one old screenshot.",
] as const

const verificationRules = [
  "Use the product UPC instead of the yellow tag or nearby QR code.",
  "Treat the in-store scan as final truth, not the app.",
  "If staff help is required, keep the conversation factual and low-drama.",
  "Have payment ready and keep the receipt if the sale goes through.",
] as const

const mythRows = [
  [
    "If it scans for a penny, the store has to sell it.",
    "Store discretion is real. Some stores honor the scan, some refuse it.",
  ],
  [
    "The app shows exact penny prices in real time.",
    "The app is a filter. The in-store UPC scan is the final source of truth.",
  ],
  [
    "There is one fixed drop day for every store.",
    "Timing varies by store, department, staffing, and reset pressure.",
  ],
  [
    "Only clearance endcaps matter.",
    "Home-bay-first hunting is stronger now because many markdowns stay in place.",
  ],
  [
    "A rumor without a SKU is enough to plan a trip.",
    "If you do not have a SKU, store, and recent date, you do not have field-ready evidence.",
  ],
] as const

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Find Home Depot Penny Items (2026 Guide)",
  description:
    "A practical beginner guide to finding Home Depot penny items, understanding clearance signals, verifying safely in store, and reporting confirmed finds.",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  dateModified: "2026-03-04",
  mainEntityOfPage: "https://www.pennycentral.com/guide",
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
    { "@type": "ListItem", position: 2, name: "Guide" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Home Depot penny items?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Home Depot penny items are clearance products that reach a one-cent terminal price in some stores. Timing and availability vary by location.",
      },
    },
    {
      "@type": "Question",
      name: "Do online prices confirm penny status?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Online and app signals are directional only. In-store UPC scan and checkout behavior are the final source of truth.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do when I find a confirmed penny item?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Keep your receipt, record the SKU, store, and date, then submit a report through Penny Central so the community list stays current and trustworthy.",
      },
    },
  ],
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find Home Depot penny items",
  description:
    "A practical process to identify likely penny items, verify them in store, and report findings responsibly.",
  totalTime: "PT20M",
  step: [
    {
      "@type": "HowToStep",
      name: "Understand the penny-item model",
      text: "Learn why the penny price is an internal removal signal instead of a public sale.",
      url: "https://www.pennycentral.com/guide#what-penny-items-are",
    },
    {
      "@type": "HowToStep",
      name: "Build a shortlist before visiting",
      text: "Review the live Penny List, pick a small number of targets, and use online data as a filter instead of final truth.",
      url: "https://www.pennycentral.com/penny-list",
    },
    {
      "@type": "HowToStep",
      name: "Verify in-store with UPC checks",
      text: "Use the product UPC and the in-store scan as final truth; online signals are not confirmation.",
      url: "https://www.pennycentral.com/guide#verify-in-store",
    },
    {
      "@type": "HowToStep",
      name: "Report confirmed outcomes",
      text: "Submit confirmed finds with SKU, store, and date so the list improves for returning users.",
      url: "https://www.pennycentral.com/report-find",
    },
  ],
}

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <RouteAdSlots pathname="/guide" />
      <PageShell width="default" padding="sm" gap="md">
        <header className="mx-auto max-w-[68ch] space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--cta-primary)]">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[var(--text-secondary)]">Guide</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            How to Find Home Depot Penny Items
          </h1>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            This is the one-page beginner guide. Read it straight through once, then use the jump
            navigation when you need a refresher before a store run.
          </p>
          <EditorialBlock className="mt-1" />
          <EthicalDisclosure />
        </header>

        <section className="mx-auto w-full max-w-[68ch] rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                If you are brand new
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Start at Step 1 and keep going. The sections are ordered to take you from "what is
                this?" to "what should I do after a real find?"
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                If you are returning
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Jump straight to scouting, in-store verification, or confirmed-find reporting. The
                deeper chapter pages are still live when you need extra detail.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[68ch]">
          <GuideJumpNav items={[...jumpNavItems]} />
        </div>

        <Section
          id="what-penny-items-are"
          kicker="Step 1"
          title="What penny items are"
          subtitle="Start with the right mental model so the rest of the process makes sense."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              Penny items are clearance products that reach a final price of $0.01. They are not a
              public promotion. The penny price is the system's final removal signal, which is why
              store behavior can feel inconsistent if you expect it to act like a normal sale.
            </p>
            <p>
              Large retailers use this stage to clean out old, discontinued, or slow-moving
              inventory. Some stores pull those items immediately. Others miss a few, which is why
              careful shoppers sometimes still find them on the floor.
            </p>
            <ul>
              <li>Penny items are internal cleanup, not a secret sale event.</li>
              <li>Store-to-store variation is normal because timing and enforcement vary.</li>
              <li>The best hunters treat pennies as probability plus verification.</li>
              <li>Respectful behavior matters because penny sales can create extra store work.</li>
            </ul>
          </Prose>
          <GuideDeepDive
            description="If you want the short concept explainer version, use the supporting beginner page."
            links={[{ href: "/what-are-pennies", label: "Go deeper with the short explainer" }]}
          />
        </Section>

        <Section
          id="how-the-markdown-cycle-works"
          kicker="Step 2"
          title="How the markdown cycle works"
          subtitle="Learn the signals that help you estimate where an item sits in clearance."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              Clearance does not move on one universal calendar. The most useful pattern is a range
              of stages, not a fixed drop day. Endings like <strong>.00</strong>,{" "}
              <strong>.06</strong> /<strong>.04</strong>, and <strong>.03</strong> /{" "}
              <strong>.02</strong> tell you where an item likely sits in the markdown cycle, but
              they do not guarantee the next step.
            </p>
            <p>
              Tag dates matter because older late-stage tags often mean a stronger chance that the
              next change is close. The phrase <strong>No Home</strong> is another useful clue: it
              means the item no longer has a normal shelf location, which often happens before a
              pull. Use those signals together rather than relying on one rumor or one screenshot.
            </p>
          </Prose>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border-b border-[var(--border-default)] px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Ending
                  </th>
                  <th className="border-b border-[var(--border-default)] px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                    What it usually means
                  </th>
                </tr>
              </thead>
              <tbody>
                {signalRows.map(([ending, meaning]) => (
                  <tr key={ending}>
                    <td className="border-b border-[var(--border-default)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">
                      {ending}
                    </td>
                    <td className="border-b border-[var(--border-default)] px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <GuideDeepDive
            description="Use the reference chapter when you want the detailed cadence tables, tag-date examples, and signal-stacking notes."
            links={[
              {
                href: "/clearance-lifecycle",
                label: "Read the full clearance-lifecycle reference",
              },
            ]}
          />
        </Section>

        <div className="mx-auto w-full max-w-[68ch]">
          <MonumetricInContentSlot />
        </div>

        <Section
          id="scout-before-a-store-trip"
          kicker="Step 3"
          title="How to scout before a store trip"
          subtitle="Use digital clues to narrow the field before you spend the drive."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              The goal of pre-hunt work is not to prove a penny from your couch. It is to reduce
              wasted trips by building a short list of store-specific targets. Online data can be
              delayed, shelf tags can be stale, and inventory counts can be wrong, so you are
              looking for a useful filter, not final truth.
            </p>
            <ol>
              {scoutingRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
            <p>
              Home-bay-first hunting matters more now because many markdown items stay in their
              original aisle instead of being moved to a clearance endcap. That means your best
              route is usually SKU first, then department and bay, then overhead if the item still
              looks plausible.
            </p>
          </Prose>
          <GuideDeepDive
            description="Use the supporting pre-hunt page when you want the longer overhead, label, and go-or-skip-trip checklists."
            links={[
              { href: "/digital-pre-hunt", label: "Read the full pre-hunt reference" },
              { href: "/penny-list", label: "Check the live Penny List before you go" },
            ]}
          />
        </Section>

        <Section
          id="verify-in-store"
          kicker="Step 4"
          title="How to verify in-store"
          subtitle="The final answer comes from the UPC and the store's actual checkout behavior."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              The cleanest rule in penny hunting is this: use the product UPC, not the yellow tag,
              and trust the in-store scan over the app. Tags and online listings can lag. The scan
              is the moment where the system tells you what the item really is right now.
            </p>
            <ul>
              {verificationRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <p>
              When you are on the floor, start with the item's normal home bay, then check nearby
              seasonal transitions, top and bottom shelves, and visible overhead leftovers if they
              can be handled safely.
            </p>
          </Prose>
          <GuideDeepDive
            description="Use the supporting route when you need the longer in-store tactics, checkout flow examples, or what-to-bring list."
            links={[
              { href: "/in-store-strategy", label: "Read the full in-store strategy reference" },
            ]}
          />
        </Section>

        <Section
          id="checkout-and-pull-behavior"
          kicker="Step 5"
          title="What checkout and pull behavior means"
          subtitle="Understand the friction so you do not mistake store process for personal conflict."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              Penny items create friction because the store often expects them to be removed, not
              sold. That is why one store may honor the scan while another refuses it, and why some
              penny transactions trigger extra attention at checkout.
            </p>
            <p>
              You will hear terms like <strong>Zero-Comm</strong>, <strong>buy-back</strong>, or
              <strong>RTV</strong>. You do not need to memorize the internal language, but you do
              need to understand the outcome: some items are flagged for removal, some are locked
              from sale, and some stores are stricter than others even when the item is still on the
              shelf.
            </p>
            <p>
              The practical rule is simple: stay calm, accept the store's final decision, and do not
              turn one refused item into a bigger problem that hurts your next trip.
            </p>
          </Prose>
          <GuideDeepDive
            description="Use the advanced context pages when you want the deeper operational explanation or tactical edge-case answers."
            links={[
              { href: "/inside-scoop", label: "Read the advanced operational context" },
              { href: "/faq", label: "Open the FAQ for tactical edge cases" },
            ]}
          />
        </Section>

        <Section
          id="myths-to-ignore"
          kicker="Step 6"
          title="What myths to ignore"
          subtitle="Drop the shortcuts that create bad expectations and wasted trips."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {mythRows.map(([myth, reality]) => (
              <article
                key={myth}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Myth
                </p>
                <p className="mt-2 text-base font-semibold leading-snug text-[var(--text-primary)]">
                  {myth}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  Reality
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {reality}
                </p>
              </article>
            ))}
          </div>
          <GuideDeepDive
            description="Use the supporting myth page when you want the longer vetting workflow and stronger-vs-weaker report examples."
            links={[{ href: "/facts-vs-myths", label: "Read the full facts-vs-myths reference" }]}
          />
        </Section>

        <Section
          id="after-a-confirmed-find"
          kicker="Step 7"
          title="What to do after a confirmed find"
          subtitle="Close the loop with evidence that helps the next shopper make a better decision."
          className="mx-auto w-full max-w-[68ch] scroll-mt-28"
        >
          <Prose variant="guide">
            <p>
              A confirmed penny find is useful twice: once for you in the store, and once for the
              next person who checks the list. That only works when the report is specific and
              truthful.
            </p>
            <ol>
              <li>Keep the receipt so the purchase record is clear.</li>
              <li>Capture the exact SKU, store, and date while they are fresh.</li>
              <li>Report only what you verified directly so the public list stays trustworthy.</li>
              <li>Use the live Penny List to decide whether the item is worth hunting again.</li>
            </ol>
            <p>
              If you are still sorting through edge cases such as refused sales or locked items, use
              the FAQ. If you already have a clean verified result, go straight to the report form
              while the details are fresh.
            </p>
          </Prose>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Ready to use the live tools?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              The guide teaches the system. The Penny List and Report a Find pages are where that
              knowledge turns into action.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="lg">
                <Link href="/penny-list">Check the Penny List</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/report-find">Report a Find</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/faq">Use the FAQ for edge cases</Link>
              </Button>
            </div>
          </div>
        </Section>
      </PageShell>
    </>
  )
}

function GuideDeepDive({
  description,
  links,
}: {
  description: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)] p-4">
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-semibold text-[var(--cta-primary)] underline underline-offset-4"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
