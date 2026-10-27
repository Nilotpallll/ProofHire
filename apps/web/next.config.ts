import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@proofhire/types", "@proofhire/ui"],
};

export default nextConfig;
