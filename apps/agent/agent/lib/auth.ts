// oxlint-disable typescript/no-non-null-assertion
import { createAuth } from "@befday-2.0/auth";
import { createPrismaClient } from "@befday-2.0/db";
import type { AuthFn } from "eve/channels/auth";

export const betterAuth = (): AuthFn => {
  const database = createPrismaClient({
    DATABASE_URL: process.env.DATABASE_URL!,
  });

  const auth = createAuth(
    {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    },
    database
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
