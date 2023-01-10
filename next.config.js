/**
 * @type {import('next').NextConfig}
 */
/* eslint-env node */
module.exports = {
  reactStrictMode: true,
  extends: ['plugin:@next/next/recommended'],
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
