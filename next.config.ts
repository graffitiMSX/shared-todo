import type { NextConfig } from "next";

const isMobileBuild = process.env.MOBILE_BUILD === 'true';

const nextConfig: NextConfig = {
  // Enable static export for Capacitor mobile builds
  ...(isMobileBuild && { output: 'export' }),

  images: {
    unoptimized: true, // Required for static export
  },

  // Trailing slash ensures proper routing in static export
  ...(isMobileBuild && { trailingSlash: true }),
};

export default nextConfig;
