import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";
import type { NextConfig } from "next";

const withVarlock = varlockNextConfigPlugin();

const nextConfig: NextConfig = {
  cacheComponents: true,
  devIndicators: false,
  experimental: {
    agentFeedback: true,
    optimizePackageImports: ["lucide-react"],
    turbopackRustReactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "t3.gstatic.com",
        protocol: "https",
      },
    ],
  },
  partialPrefetching: true,
  reactCompiler: true,
};

export default withVarlock(nextConfig);
