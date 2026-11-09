import { createEmail } from "@befday-2.0/email";

export const email = createEmail({
  // oxlint-disable-next-line typescript/no-non-null-assertion
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID!,
  // oxlint-disable-next-line typescript/no-non-null-assertion
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN!,
});
