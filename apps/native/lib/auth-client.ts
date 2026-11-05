import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

import { ENV as env } from "../src/env";

const scheme = Array.isArray(Constants.expoConfig?.scheme)
  ? (Constants.expoConfig.scheme[0] ?? "befday-2.0")
  : (Constants.expoConfig?.scheme ?? "befday-2.0");

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme,
      storage: SecureStore,
      storagePrefix: scheme,
    }),
  ],
});
