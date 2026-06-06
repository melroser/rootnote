import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async rewrites() {
    return [
      // Browsers (incl. Arc) request /favicon.ico by default — serve our PNG icon.
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
};

export default nextConfig;
