import { appRouter } from "@befday-2.0/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { withEvlog } from "@/lib/evlog";
import { identifyEvlogUser } from "@/lib/evlog-auth";

import { createContext } from "../../../../context";

const handler = async (req: NextRequest) => {
  await identifyEvlogUser(req);
  return fetchRequestHandler({
    createContext: () => createContext(req),
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });
};
export const GET = withEvlog(handler);
export const POST = withEvlog(handler);
