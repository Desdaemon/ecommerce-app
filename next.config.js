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
    Object.assign(config.module.rules, []).push({
      test: /\.sql$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(config);
