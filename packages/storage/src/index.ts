import { Files } from "files-sdk";
import { r2 } from "files-sdk/r2";

export interface StorageConfig {
  R2_ACCOUNT_ID: string;
  R2_BUCKET: string;
}

export const createFiles = (env: StorageConfig): Files =>
  new Files({
    adapter: r2({
      accountId: env.R2_ACCOUNT_ID,
      bucket: env.R2_BUCKET,
    }),
  });

export type { Files } from "files-sdk";
