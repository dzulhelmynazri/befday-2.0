// oxlint-disable typescript/no-non-null-assertion
import { createFiles } from "@befday-2.0/storage";

export const files = createFiles({
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_BUCKET: process.env.R2_BUCKET!,
});

export const uploadSocialSlide = async (
  key: string,
  pngBuffer: Uint8Array
): Promise<string> => {
  await files.upload(key, pngBuffer, {
    contentType: "image/png",
  });

  return `${process.env.R2_PUBLIC_URL!}/${key}`;
};
