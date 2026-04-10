import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/Website-Portfolio" : "",
  assetPrefix: isProd ? "/Website-Portfolio" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/Website-Portfolio" : "",
  },
};

export default nextConfig;
