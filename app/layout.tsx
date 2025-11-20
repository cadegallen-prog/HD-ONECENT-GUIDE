import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const headingFont = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home Depot Penny Items: Complete Guide",
  description:
    "Calm, reference-style guide for the Home Depot One Cent Items community. Learn how penny pricing works, clearance cadences, digital pre-hunt steps, in-store strategy, checkout flow, and responsible hunting.",
  keywords: [
    "home depot penny items guide",
    "one cent items",
    "clearance cadence",
    "price ending decoder",
    "self checkout penny items",
  ],
  authors: [{ name: "Home Depot One Cent Items Community" }],
  metadataBase: new URL("https://hd-penny-guide.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hd-penny-guide.vercel.app",
    title: "Home Depot Penny Items: Complete Guide",
    description:
      "Reference-first overview of penny items, clearance lifecycle, digital tools, in-store tactics, checkout, and responsible hunting.",
    siteName: "Home Depot Penny Items Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Depot Penny Items: Complete Guide",
    description:
      "Reference-first overview for the Home Depot One Cent Items community.",
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
      <body className={`${headingFont.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
