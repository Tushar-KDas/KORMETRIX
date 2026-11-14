/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@workforce360/design-tokens',
    '@workforce360/shared-types',
    '@workforce360/permission-engine',
    '@workforce360/validation',
    '@workforce360/api-contracts',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/superadmin',
        destination: '/platform-admin',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
