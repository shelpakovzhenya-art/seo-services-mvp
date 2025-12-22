/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['seo-update.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seo-update.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
  // Redirect www to non-www (better for SEO)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.seo-update.ru',
          },
        ],
        destination: 'https://seo-update.ru/:path*',
        permanent: true,
      },
    ]
  },
  // Trailing slash configuration
  trailingSlash: false,
}

module.exports = nextConfig


