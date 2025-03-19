import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["example.com","source.unsplash.com"], // ✅ Add allowed image domains here
  },
};

module.exports = nextConfig;
  /* config options here */
  

export default nextConfig;
