import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";
import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

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

const withVarlockConfig = withVarlock(nextConfig);

export default withWorkflow((phase, ctx) =>
  Promise.resolve(withVarlockConfig(phase, ctx))
);
