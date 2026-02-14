/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
    remotePatterns: [],
  },
}

module.exports = nextConfig
