import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/ai-automation-portfolio" : "",
  assetPrefix: isProd ? "/ai-automation-portfolio" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/ai-automation-portfolio" : "",
  },
};

export default nextConfig;
