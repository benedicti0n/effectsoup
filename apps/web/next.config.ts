import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@imageeffects/core", "@imageeffects/presets", "@imageeffects/worker"]
};

export default nextConfig;
