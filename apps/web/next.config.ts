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
  partialPrefetching: true,
  reactCompiler: true,
};

export default withVarlock(nextConfig);
