import {
  renderPartnerPerkApprovedEmail,
  renderPartnerSubmissionReceivedEmail,
} from "@befday-2.0/email";
import { RetryableError, getStepMetadata } from "workflow";

import { getRetryAfterMs, sendEmailWithRetry } from "@/lib/workflows";

const PERKS_BASE_URL = "https://www.befday.com";

const findPerkWithBrand = async (perkId: string) => {
  const { getDb } = await import("@/services");

  return getDb().birthdayPerk.findUnique({
    include: { brand: true },
    where: { id: perkId },
  });
};

const sendSubmissionTelegram = async (perkId: string): Promise<void> => {
  "use step";

  const [{ env }, { log }, perk] = await Promise.all([
    import("@/env.server"),
    import("@/lib/evlog"),
    findPerkWithBrand(perkId),
  ]);

  if (!perk) {
    return;
  }

  const { attempt } = getStepMetadata();

  const optionalLines = [
    perk.brand.websiteUrl ? `Website. ${perk.brand.websiteUrl}` : "",
    perk.brand.googleMapUrl ? `Location. ${perk.brand.googleMapUrl}` : "",
    perk.brand.appStoreUrl ? `App Store. ${perk.brand.appStoreUrl}` : "",
    perk.brand.playStoreUrl ? `Play Store. ${perk.brand.playStoreUrl}` : "",
  ].filter(Boolean);

  const lines = [
    "*New merchant perk submission*",
    "",
    `Brand. ${perk.brand.name}`,
    `Perk. ${perk.headline}`,
    `Badge. ${perk.badge}`,
    `Validity. ${perk.validity}`,
    `Redeem. ${perk.howToRedeem.join(", ")}`,
    `Contact. ${perk.contactName ?? ""} (${perk.contactEmail ?? ""} | ${perk.contactPhone ?? ""})`,
    ...optionalLines,
    "",
    `Status. Saved as ${perk.status} (id: \`${perk.id}\`)`,
  ];

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          disable_web_page_preview: true,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Approve & Publish",
                  url: `${env.NEXT_PUBLIC_SITE_URL}/api/perks/approve?id=${perk.id}&secret=${env.CRON_SECRET}`,
                },
              ],
            ],
          },
          text: lines.join("\n"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Telegram sendMessage failed with status ${response.status}`
      );
    }
  } catch (error) {
    log.error({
      error,
      event: "partner.submission_telegram_failed",
      perkId,
    });

    throw new RetryableError("Failed to deliver partner submission alert", {
      retryAfter: getRetryAfterMs(attempt),
    });
  }
};

sendSubmissionTelegram.maxRetries = 5;

const sendSubmissionReceivedEmail = async (perkId: string): Promise<void> => {
  "use step";

  const perk = await findPerkWithBrand(perkId);

  if (!(perk?.contactEmail && perk.contactName)) {
    return;
  }

  const brandName = perk.brand.name.toLowerCase();

  const { html, text } = await renderPartnerSubmissionReceivedEmail({
    brandName,
    contactName: perk.contactName.toLowerCase(),
  });

  await sendEmailWithRetry({
    context: { perkId },
    event: "partner.submission_email_failed",
    html,
    subject: `we received your submission for ${brandName} on befday`,
    text,
    to: perk.contactEmail,
  });
};

sendSubmissionReceivedEmail.maxRetries = 5;

const sendPartnerApprovedEmail = async (perkId: string): Promise<void> => {
  "use step";

  const perk = await findPerkWithBrand(perkId);

  if (!(perk?.contactEmail && perk.contactName)) {
    return;
  }

  const brandName = perk.brand.name.toLowerCase();

  const { html, text } = await renderPartnerPerkApprovedEmail({
    brandName,
    contactName: perk.contactName.toLowerCase(),
    listingUrl: `${PERKS_BASE_URL}/perks/${perk.brand.slug}`,
    perkHeadline: perk.headline.toLowerCase(),
  });

  await sendEmailWithRetry({
    context: { perkId },
    event: "partner.approval_email_failed",
    html,
    subject: `your birthday perk for ${brandName} is now live on befday`,
    text,
    to: perk.contactEmail,
  });
};

sendPartnerApprovedEmail.maxRetries = 5;

/** Started from partnerRouter.submit via context.ts. */
export const partnerSubmittedWorkflow = async (
  perkId: string
): Promise<void> => {
  "use workflow";

  await Promise.all([
    sendSubmissionTelegram(perkId),
    sendSubmissionReceivedEmail(perkId),
  ]);
};

/** Started from /api/perks/approve when publishing a perk with contact details. */
export const partnerApprovedWorkflow = async (
  perkId: string
): Promise<void> => {
  "use workflow";

  await sendPartnerApprovedEmail(perkId);
};
