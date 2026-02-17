/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // produce events/index.html so nginx (and Docker default config) serves /events correctly
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
    remotePatterns: [],
  },
  // Unique per build so asset URLs change and browsers fetch fresh after deploy
  env: {
    NEXT_PUBLIC_BUILD_ID: process.env.BUILD_ID || String(Date.now()),
  },
}

module.exports = nextConfig
