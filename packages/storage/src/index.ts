import { Files } from "files-sdk";
import { r2 } from "files-sdk/r2";

export interface StorageConfig {
  R2_BUCKET: string;
  R2_ACCOUNT_ID: string;
}

export const createFiles = (env: StorageConfig) =>
  new Files({
    adapter: r2({
      accountId: env.R2_ACCOUNT_ID,
      bucket: env.R2_BUCKET,
    }),
  });

export type { Files } from "files-sdk";
