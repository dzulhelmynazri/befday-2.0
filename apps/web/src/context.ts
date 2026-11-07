import type { Context } from "@befday-2.0/api/context";

import { env } from "./env.server";
import { auth, email, getDb } from "./services";

export const createContext = async (headers: Headers): Promise<Context> => {
  const session = await auth.api.getSession({ headers });

  return {
    auth,
    db: getDb(),
    email,
    env,
    session,
  };
};
