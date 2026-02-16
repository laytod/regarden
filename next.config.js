/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // produce events/index.html so nginx (and Docker default config) serves /events correctly
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
    remotePatterns: [],
  },
}

module.exports = nextConfig
