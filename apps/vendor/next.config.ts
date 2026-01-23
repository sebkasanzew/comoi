import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@comoi/ui", "@comoi/shared"],
};

export default nextConfig;
