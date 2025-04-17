import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for Netlify deployment
    ignoreDuringBuilds: true
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true
  },
  // Enable output file tracing for better caching
  output: 'standalone',
  // Cache build outputs for faster rebuilds
  distDir: '.next',
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
