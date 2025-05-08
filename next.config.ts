import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    turbo: {}, // 👈 Provide an empty object to satisfy the type
  },
  images: {
    domains: ["images.unsplash.com", "st2.depositphotos.com"], // Add Depositphotos domain here
  },
  // crossOrigin: "anonymous",
};

export default nextConfig;
