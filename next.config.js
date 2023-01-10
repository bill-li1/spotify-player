/**
 * @type {import('next').NextConfig}
 */
/* eslint-env node */
module.exports = {
  extends: ['plugin:@next/next/recommended'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
