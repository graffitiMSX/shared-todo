import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor
  // output: 'export', // Uncomment when building for mobile

  images: {
    unoptimized: true, // Required for static export
  },

  // Disable server-side features when building for mobile
  // typescript: {
  //   ignoreBuildErrors: false,
  // },
};

export default nextConfig;
