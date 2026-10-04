import type { NextConfig } from "next";

// Two hosts, one repo.
// GitHub Pages serves from /Website-Portfolio and can only take static files,
// so its workflow sets GH_PAGES=1. Vercel sets nothing, gets the root, and keeps
// its server, which is what lets /api/contact exist.
const ghPages = process.env.GH_PAGES === "1";
const base = ghPages ? "/Website-Portfolio" : "";

const nextConfig: NextConfig = {
  ...(ghPages ? { output: "export" as const } : {}),
  // directories rather than /work.html, which GitHub Pages will not serve
  trailingSlash: true,
  basePath: base,
  assetPrefix: base,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: base,
  },
};

export default nextConfig;
