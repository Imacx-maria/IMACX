import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for Netlify deployment
    ignoreDuringBuilds: true
  },
  // Enable output file tracing for better caching
  output: 'standalone',
  // Cache build outputs for faster rebuilds
  distDir: '.next',
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
