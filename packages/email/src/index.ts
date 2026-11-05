import { createEmailClient } from "@opencoredev/email-sdk";
import { cloudflare } from "@opencoredev/email-sdk/cloudflare";

export type EmailConfig = {
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
};

export function createEmail(env: EmailConfig) {
  return createEmailClient({
    adapters: [
      cloudflare({
        apiToken: env.CLOUDFLARE_API_TOKEN,
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
      }),
    ],
  });
}

export type { EmailClient } from "@opencoredev/email-sdk";
