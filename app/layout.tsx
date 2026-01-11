import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CommandPaletteProvider } from "@/components/command-palette-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyticsSessionTracker } from "@/components/analytics-session"
import { SpeedInsightsClient } from "@/components/speed-insights-client"
import { ogImageUrl } from "@/lib/og"

const DEFAULT_OG_IMAGE = `https://www.pennycentral.com${ogImageUrl("homepage")}`

/* =====================================================
   ANALYTICS INFRASTRUCTURE — DO NOT REMOVE OR MODIFY
   ===================================================== */
const GA_MEASUREMENT_ID = "G-DJ4RJRX05E"
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false"

const IS_VERCEL = process.env.VERCEL === "1" || Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)
const ENABLE_VERCEL_SCRIPTS =
  process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT !== "1" && IS_VERCEL
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
    "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds updated hourly.",
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
  metadataBase: new URL("https://www.pennycentral.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pennycentral.com",
    title: "Penny Central | Home Depot Penny List",
    description:
      "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds updated hourly.",
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
      "The searchable Home Depot penny list. Filter by state, date, and SKU. Community-reported $0.01 finds updated hourly.",
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
        {/* Performance hints for critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://*.sentry.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://*.supabase.co" crossOrigin="anonymous" />
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
                target: "https://www.pennycentral.com/penny-list?search={search_term_string}",
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
            GOOGLE ANALYTICS 4 (GA4)
            Measurement ID: G-DJ4RJRX05E
            DO NOT REMOVE OR MODIFY
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
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
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
          <AuthProvider>
            <AnalyticsSessionTracker />
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
        {ENABLE_VERCEL_ANALYTICS && <SpeedInsightsClient />}
      </body>
    </html>
  )
}
