import { appRouter } from "@befday-2.0/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { createContext } from "@/context";
import { withEvlog } from "@/lib/evlog";
import { identifyEvlogUser } from "@/lib/evlog-auth";

const handler = async (req: NextRequest) => {
  await identifyEvlogUser(req);

  return await fetchRequestHandler({
    createContext: () => createContext(req.headers),
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });
};

export const GET = withEvlog(handler);
export const POST = withEvlog(handler);
