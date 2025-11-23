import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { QuickActionsButton } from "@/components/quick-actions-button";

// Fonts are defined in globals.css using system fonts
// This avoids network dependency on Google Fonts

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
  metadataBase: new URL("https://pennycentral.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pennycentral.com",
    title: "Home Depot Penny Items: Complete Guide",
    description:
      "Reference-first overview of penny items, clearance lifecycle, digital tools, in-store tactics, checkout, and responsible hunting.",
    siteName: "Penny Central",
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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            {children}
            <QuickActionsButton />
            <Toaster />
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
