// oxlint-disable typescript/no-non-null-assertion
import { createAuth } from "@befday-2.0/auth";
import type { AuthFn } from "eve/channels/auth";

import { db } from "./db";

export const betterAuth = (): AuthFn => {
  const auth = createAuth(
    {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    },
    db,
    {}
  );

  return async function handleAuth(request) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return null;
    }

    const attributes = {
      email: session.user.email,
      name: session.user.name,
    };

    if (session.user.image) {
      Object.assign(attributes, { picture: session.user.image });
    }

    return {
      attributes,
      authenticator: "better-auth",
      principalId: session.user.id,
      principalType: "user",
    };
  };
};
