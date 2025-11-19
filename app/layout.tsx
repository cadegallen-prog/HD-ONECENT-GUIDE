import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Inter Variable for body text and headings
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// For headings, use bold Inter until you add custom font
const interHeading = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

// To use Satoshi or custom font:
// 1. Download font and place in public/fonts/
// 2. Uncomment and configure below:
// const satoshi = localFont({
//   src: [{ path: "../public/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }],
//   variable: "--font-heading",
//   display: "swap",
//   fallback: ["system-ui", "sans-serif"],
// });

export const metadata: Metadata = {
  title: "HD Penny Guide - Master Home Depot Penny Shopping",
  description: "Learn how to find Home Depot penny items (clearance marked to $0.01). Complete guide covering clearance cycles, digital scouting, in-store strategies, and responsible hunting practices. Join 32,000+ penny hunters.",
  keywords: ["home depot penny items", "hd clearance penny", "penny shopping", "home depot clearance", "clearance lifecycle", "penny hunting", "retail clearance"],
  authors: [{ name: "HD Penny Guide" }],
  metadataBase: new URL("https://hd-penny-guide.vercel.app"), // Update with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hd-penny-guide.vercel.app",
    title: "HD Penny Guide - Master Home Depot Penny Shopping",
    description: "Complete guide to finding Home Depot penny items. Learn clearance cycles, digital strategies, and in-store tactics from 32,000+ penny hunters.",
    siteName: "HD Penny Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "HD Penny Guide - Master Home Depot Penny Shopping",
    description: "Complete guide to finding Home Depot penny items. Learn clearance cycles, digital strategies, and in-store tactics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interHeading.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
