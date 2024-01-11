/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: { unoptimized: true }
}

module.exports = nextConfig
