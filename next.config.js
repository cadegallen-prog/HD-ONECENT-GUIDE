/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled due to Leaflet map initialization issues
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib'],
  },
}

module.exports = nextConfig
