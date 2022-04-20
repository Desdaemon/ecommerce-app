const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, _options) {
    Object.assign(config.resolve.alias, {
      '@': __dirname,
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(config);
