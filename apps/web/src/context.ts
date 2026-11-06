import type { Context } from "@befday-2.0/api/context";

import { getDb, auth } from "./services";

export const createContext = async (headers: Headers): Promise<Context> => {
  const session = await auth.api.getSession({ headers });

  return {
    auth,
    db: getDb(),
    session,
  };
};
