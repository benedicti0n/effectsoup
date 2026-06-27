import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@effectsoup/core", "@effectsoup/presets", "@effectsoup/worker"]
};

export default nextConfig;
