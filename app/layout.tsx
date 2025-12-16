import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CommandPaletteProvider } from "@/components/command-palette-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyticsSessionTracker } from "@/components/analytics-session"
import { SpeedInsightsClient } from "@/components/speed-insights-client"

const ENABLE_VERCEL_SCRIPTS =
  process.env.NODE_ENV === "production" &&
  process.env.PLAYWRIGHT !== "1" &&
  (process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_VERCEL_ENV)

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
  title: "Penny Central: The Home Depot $0.01 Hunting Guide",
  description:
    "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 40,000+ penny hunters.",
  keywords: [
    "home depot penny items guide",
    "one cent items",
    "clearance cadence",
    "price ending decoder",
    "self checkout penny items",
  ],
  authors: [{ name: "Home Depot One Cent Items Community" }],
  metadataBase: new URL("https://pennycentral.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pennycentral.com",
    title: "Penny Central: The Home Depot $0.01 Hunting Guide",
    description:
      "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 40,000+ penny hunters.",
    siteName: "Penny Central",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny Central: The Home Depot $0.01 Hunting Guide",
    description:
      "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 40,000+ penny hunters.",
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
        {/* Google Analytics - DO NOT MODIFY */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DJ4RJRX05E"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            const GA_MEASUREMENT_ID = 'G-DJ4RJRX05E';
            const sanitizedPath = (() => {
              try {
                const url = new URL(window.location.href);
                return url.pathname || '/';
              } catch (error) {
                return window.location.pathname || '/';
              }
            })();
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID, {
              page_path: sanitizedPath,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `}
        </Script>

        {/* Preconnect hints for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Penny Central",
              url: "https://pennycentral.com",
              description:
                "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 40,000+ penny hunters.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://pennycentral.com/store-finder?q={search_term_string}",
                },
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
              url: "https://pennycentral.com",
              description:
                "Community resource for Home Depot penny item hunters with 40,000+ members.",
              sameAs: ["https://www.facebook.com/groups/homedepotpennies"],
            }),
          }}
        />
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
        </ThemeProvider>
        {/* Vercel scripts should only run on Vercel (and never during Playwright/CI). */}
        {ENABLE_VERCEL_SCRIPTS && <Analytics />}
        {ENABLE_VERCEL_SCRIPTS && <SpeedInsightsClient />}
      </body>
    </html>
  )
}
