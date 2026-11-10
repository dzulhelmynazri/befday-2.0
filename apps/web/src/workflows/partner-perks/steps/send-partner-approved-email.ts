import { renderPartnerPerkApprovedEmail } from "@befday-2.0/email";

import { findPerkWithBrand } from "@/workflows/partner-perks/find-perk";
import { sendEmailWithRetry } from "@/workflows/shared/send-email";

const PERKS_BASE_URL = "https://www.befday.com";

export const sendPartnerApprovedEmail = async (
  perkId: string
): Promise<void> => {
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
