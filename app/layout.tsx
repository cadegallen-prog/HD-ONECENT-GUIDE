import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CommandPaletteProvider } from "@/components/command-palette-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Penny Central: The Home Depot $0.01 Hunting Guide",
  description:
    "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 37,000+ penny hunters.",
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
      "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 37,000+ penny hunters.",
    siteName: "Penny Central",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penny Central: The Home Depot $0.01 Hunting Guide",
    description:
      "The complete guide to finding Home Depot penny items. Learn clearance cycles, in-store hunting strategies, checkout tips, and join 37,000+ penny hunters.",
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
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DJ4RJRX05E');
          `}
        </Script>
      </head>
      <body className="bg-background text-foreground">
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
            <main className="min-h-screen">
              {children}
              <Footer />
            </main>

            <Toaster />
          </CommandPaletteProvider>
        </ThemeProvider>
        {/* Vercel Analytics - only loads in production on Vercel */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
