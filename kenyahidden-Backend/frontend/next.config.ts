import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // explicitly set root to the frontend folder
  },
  /* other config options here */
};

export default nextConfig;
