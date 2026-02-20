import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CommandPaletteProvider } from "@/components/command-palette-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { ogImageUrl } from "@/lib/og"
import { CANONICAL_BASE } from "@/lib/canonical"

const DEFAULT_OG_IMAGE = `https://www.pennycentral.com${ogImageUrl("homepage")}`

/* =====================================================
   ANALYTICS INFRASTRUCTURE - DO NOT REMOVE OR MODIFY
   ===================================================== */
const GA_MEASUREMENT_ID = "G-DJ4RJRX05E"
const ANALYTICS_FLAG = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
const ANALYTICS_ENABLED = ANALYTICS_FLAG !== "false"

const IS_VERCEL = process.env.VERCEL === "1" || Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)
const IS_VERCEL_PROD = process.env.VERCEL_ENV === "production"
const ENABLE_VERCEL_SCRIPTS =
  process.env.NODE_ENV === "production" &&
  process.env.PLAYWRIGHT !== "1" &&
  IS_VERCEL &&
  IS_VERCEL_PROD
const ENABLE_VERCEL_ANALYTICS = ANALYTICS_ENABLED && ENABLE_VERCEL_SCRIPTS

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "Penny Central | Home Depot Penny List",
  description:
    "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds, usually updated within about 5 minutes.",
  keywords: [
    "home depot penny items",
    "penny items",
    "penny guide",
    "home depot penny list",
    "home depot clearance",
    "one cent items",
    "clearance cadence",
    "price ending decoder",
    "self checkout penny items",
    "penny shopping",
  ],
  authors: [{ name: "Home Depot One Cent Items Community" }],
  metadataBase: new URL(CANONICAL_BASE),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: CANONICAL_BASE,
    title: "Penny Central | Home Depot Penny List",
    description:
      "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds, usually updated within about 5 minutes.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Penny Central",
      },
    ],
    siteName: "Penny Central",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny Central | Home Depot Penny List",
    description:
      "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds, usually updated within about 5 minutes.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Penny Central",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {!process.env.PLAYWRIGHT && (
          <script
            type="text/javascript"
            src="https://monu.delivery/site/1/d/65ab12-7f57-43c6-a5b7-76b6b4c6548c.js"
            data-cfasync="false"
          />
        )}

        {/* Performance hints for critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://monu.delivery" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://faves.grow.me" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />

        {/* Analytics guard (visible in View Page Source) */}
        <meta
          name="pennycentral:analytics"
          content={`enabled=${ANALYTICS_ENABLED}; flag=${ANALYTICS_FLAG ?? "unset"}`}
        />

        {/* Facebook App ID - Required for Meta sharing debugger validation
            TODO: Set FACEBOOK_APP_ID environment variable in Vercel dashboard
            This enables proper Open Graph validation and sharing preview optimization. */}
        {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && (
          <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        )}

        {/* JSON-LD Structured Data */}
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
              sameAs: ["https://www.facebook.com/groups/homedepotonecent"],
            }),
          }}
        />

        {/* ===================================================
            MEDIAVINE JOURNEY (GROW)
            DO NOT REMOVE OR MODIFY
            =================================================== */}
        <script
          data-grow-initializer=""
          dangerouslySetInnerHTML={{
            __html: `
              !(function(){window.growMe||((window.growMe=function(e){(window.growMe._=window.growMe._||[]).push(e)}),(window.growMe._=window.growMe._||[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZToyOWE5MzYwOS02MjA3LTQ4NzMtOGNjOC01ZDI5MjliMWZlYzY=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();
            `,
          }}
        />

        {/* ===================================================
            GOOGLE ANALYTICS 4 (GA4)
            Measurement ID: G-DJ4RJRX05E
            Tidied up: Consent Mode v2 + SPA tracking fix
            =================================================== */}
        {ANALYTICS_ENABLED && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = window.gtag || gtag;

                  // Consent Mode v2 Default (Granted for now, but explicit for GA4 modeling)
                  gtag('consent', 'default', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted',
                    'region': ['US', 'CA']
                  });

                  gtag('js', new Date());

                  // Measurement ID: ${GA_MEASUREMENT_ID}
                  // Use GA auto page_view as the single source of truth.
                  gtag('config', '${GA_MEASUREMENT_ID}');

                  (function() {
                    function getWeekKey(date) {
                      var copy = new Date(date.getTime());
                      var day = copy.getUTCDay();
                      var diff = copy.getUTCDate() - day;
                      copy.setUTCDate(diff);
                      copy.setUTCHours(0, 0, 0, 0);
                      return copy.toISOString();
                    }

                    function trackReturnVisit() {
                      try {
                        var SESSIONS_KEY = "pc_sessions";
                        var RETURN_VISIT_KEY = "pc_return_visit_week";
                        var now = new Date();
                        var weekKey = getWeekKey(now);
                        var stored = localStorage.getItem(SESSIONS_KEY);
                        var sessions = stored ? JSON.parse(stored) : [];

                        var cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
                        var recentSessions = (Array.isArray(sessions) ? sessions : [])
                          .map(function(ts) { return new Date(ts); })
                          .filter(function(d) { return !Number.isNaN(d.getTime()) && d.getTime() >= cutoff; })
                          .map(function(d) { return d.toISOString(); });

                        recentSessions.push(now.toISOString());
                        localStorage.setItem(SESSIONS_KEY, JSON.stringify(recentSessions));

                        var emittedWeek = localStorage.getItem(RETURN_VISIT_KEY);
                        var qualifies = recentSessions.length >= 2;

                        if (qualifies && emittedWeek !== weekKey) {
                          gtag("event", "return_visit", { 
                            weeklySessions: recentSessions.length,
                            event_category: "engagement"
                          });
                          localStorage.setItem(RETURN_VISIT_KEY, weekKey);
                        }
                      } catch (e) { /* no-op */ }
                    }

                    // Initial tracking
                    trackReturnVisit();
                  })();
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="bg-background text-foreground">
        {/* Skip link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--cta-primary)] focus:text-[var(--cta-text)] focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Handles client-side tracking for GA4 */}
          <AnalyticsTracker />
          <AuthProvider>
            <CommandPaletteProvider>
              {/* Navbar with full mobile functionality */}
              <Navbar />

              {/* Main content */}
              <main id="main-content" className="min-h-screen">
                {children}
                <Footer />
              </main>

              <Toaster />
            </CommandPaletteProvider>
          </AuthProvider>
        </ThemeProvider>
        {/* Vercel scripts should only run on Vercel (and never during Playwright/CI). */}
        {ENABLE_VERCEL_ANALYTICS && <Analytics />}
        {ENABLE_VERCEL_ANALYTICS && <SpeedInsights />}
      </body>
    </html>
  )
}
