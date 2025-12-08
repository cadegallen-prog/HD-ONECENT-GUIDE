import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CommandPaletteProvider } from "@/components/command-palette-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
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
            gtag('js', new Date());
            gtag('config', 'G-DJ4RJRX05E');
          `}
        </Script>

        {/* Preconnect hints for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--cta-primary)] focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
        {/* Vercel Analytics - loads in production */}
        {process.env.NODE_ENV === "production" && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  )
}
