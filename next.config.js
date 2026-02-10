const { withSentryConfig } = require("@sentry/nextjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled due to Leaflet map initialization issues
  poweredByHeader: false,
  compress: true,
  // Allow Playwright/CI to build to an isolated output directory so e2e runs don't clobber a local dev server.
  // Defaults to `.next` (no behavior change in production).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.thdstatic.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // Webpack configuration to handle cmdk properly
  webpack: (config, { isServer }) => {
    // Ensure cmdk is transpiled correctly
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
  transpilePackages: ["cmdk"],
  // SEO Strategy: Use www domain as canonical and redirect shortcut pages to guide sections.
  // This prevents "Redirect error" in Google Search Console by providing clear 301 signals.
  async redirects() {
    return [
      {
        source: "/verified-pennies",
        destination: "/penny-list",
        permanent: true,
      },
      // SEO consolidation: thin landing pages → pillar pages (Jan 2026)
      {
        source: "/home-depot-penny-items",
        destination: "/penny-list",
        permanent: true,
      },
      {
        source: "/how-to-find-penny-items",
        destination: "/guide",
        permanent: true,
      },
      {
        source: "/home-depot-penny-list",
        destination: "/penny-list",
        permanent: true,
      },
      // Pages Overhaul: consolidate legacy /cashback into /support (Jan 2026)
      {
        source: "/cashback",
        destination: "/support",
        permanent: true,
      },
      // Obsolete resources page → guide hub (keep crawl signals consolidated)
      {
        source: "/resources",
        destination: "/guide",
        permanent: true,
      },
      {
        source: "/resources/",
        destination: "/guide",
        permanent: true,
      },
    ]
  },
  // Security and caching headers
  async headers() {
    return [
      {
        // Security headers for all routes
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Ad Networks: Google AdSense (approved), Mediavine Journey/Grow.me (approved), ID5 identity service
              // Future: Monumetric (under review) - add domains when approved
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://faves.grow.me https://*.grow.me https://cdn.id5-sync.com https://*.id5-sync.com https://ep2.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.google-analytics.com https://*.googletagmanager.com https:",
              "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.doubleclick.net https://*.adtrafficquality.google https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://nominatim.openstreetmap.org https://*.sentry.io https://*.ingest.us.sentry.io https://*.supabase.co https://faves.grow.me https://*.grow.me https://*.growplow.events https://client-rapi-mediavine.recombee.com https://*.id5-sync.com https://id5-sync.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://app.grow.me https://*.grow.me https://*.adtrafficquality.google https://www.google.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // Immutable caching for static assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Caching for fonts
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Caching for images
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Sentry build-time configuration options
  org: "pennycentral",
  project: "javascript-nextjs",

  // Only print Sentry logs for errors
  silent: true,

  // Upload source maps in production builds only
  widenClientFileUpload: true,

  // Webpack-specific configuration
  webpack: {
    // Automatically annotate React components for better error messages
    reactComponentAnnotation: {
      enabled: true,
    },
    // Automatically tree-shake Sentry logger statements
    treeshake: {
      removeDebugLogging: true,
    },
  },

  // Disable Sentry SDK bundling in development
  disableServerWebpackPlugin: process.env.NODE_ENV === "development",
  disableClientWebpackPlugin: process.env.NODE_ENV === "development",

  // Hide source maps from generated client bundles
  hideSourceMaps: true,
})
