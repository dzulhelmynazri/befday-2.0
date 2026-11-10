import { renderPartnerSubmissionReceivedEmail } from "@befday-2.0/email";

import { findPerkWithBrand } from "@/workflows/partner-perks/find-perk";
import { sendEmailWithRetry } from "@/workflows/shared/send-email";

export const sendSubmissionReceivedEmail = async (
  perkId: string
): Promise<void> => {
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
