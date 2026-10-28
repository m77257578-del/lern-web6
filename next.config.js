/**
 * Next.js Configuration
 * Project: ليرن ويب | Lern Web
 * Purpose: Direct seamless Vercel Deployment Configuration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Keep code uncompressed and legible as requested
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
