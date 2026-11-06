import type { Context as ApiContext } from "@befday-2.0/api/context";
import type { NextRequest } from "next/server";

import { getDb, auth } from "./services";

export const createContext = async (req: NextRequest): Promise<ApiContext> => {
  const db = await getDb();

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    auth,
    db,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
