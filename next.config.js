const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.build',
  reactStrictMode: true,
  transpilePackages: ['three'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
