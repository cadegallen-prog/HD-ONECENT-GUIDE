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
  title: "Professional Template Starter - Gronk Pro 2025",
  description: "Lightning-fast, accessible, and beautiful professional website template. Built with Next.js 15, Tailwind CSS, and shadcn/ui. Perfect for agencies, SaaS, consultants, and professional services.",
  keywords: ["Next.js", "Tailwind CSS", "Professional Template", "Business Website", "Agency Template"],
  authors: [{ name: "Gronk Pro" }],
  metadataBase: new URL("https://gronk-pro-starter-2025.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gronk-pro-starter-2025.vercel.app",
    title: "Professional Template Starter - Gronk Pro 2025",
    description: "Lightning-fast, accessible, and beautiful professional website template.",
    siteName: "Gronk Pro Starter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Template Starter - Gronk Pro 2025",
    description: "Lightning-fast, accessible, and beautiful professional website template.",
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
