import { sendPartnerOutreachSchema } from "@befday-2.0/contracts";
import type {
  OutreachAngle,
  SendPartnerOutreachInput,
} from "@befday-2.0/contracts";
import type { OutreachStatus, PartnerOutreach } from "@befday-2.0/db";
import { renderPartnerOutreachEmail } from "@befday-2.0/email";
import { defineTool } from "eve/tools";

import { db } from "@/lib/db";
import { email } from "@/lib/email";

const SITE_URL = "https://www.befday.com";
const SENDER_NAME = "dzulhelmy, befday";
const SENDER_ADDRESS = "dzulhelmy from befday <hello@befday.com>";
const FOLLOW_UP_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_STEP = 3;

const TERMINAL_STATUSES = new Set<OutreachStatus>([
  "REPLIED",
  "CONVERTED",
  "OPTED_OUT",
]);

const ANGLE_CONFIG = {
  CLAIM_LISTING: {
    label: "Claim listing",
    linkUrl: (slug: string) => `${SITE_URL}/perks/${slug}`,
    requiresListing: true,
  },
  FEATURED_SPONSORSHIP: {
    label: "Featured sponsorship",
    linkUrl: (slug: string) => `${SITE_URL}/perks/${slug}`,
    requiresListing: true,
  },
  INVITE_NEW_BRAND: {
    label: "Invite new brand",
    linkUrl: () => `${SITE_URL}/partner`,
    requiresListing: false,
  },
} satisfies Record<
  OutreachAngle,
  {
    label: string;
    linkUrl: (slug: string) => string;
    requiresListing: boolean;
  }
>;

interface EmailDraft {
  body: string;
  subject: string;
  to: string;
}

const toEmailDraft = (input: SendPartnerOutreachInput): EmailDraft | null => {
  const { contactEmail, emailBody, emailSubject, emailVerified } = input;

  if (!(emailVerified && contactEmail && emailSubject && emailBody)) {
    return null;
  }

  return { body: emailBody, subject: emailSubject, to: contactEmail };
};

const getBlockReason = (
  existing: PartnerOutreach | null,
  brandName: string
): string | null => {
  if (!existing) {
    return null;
  }

  if (TERMINAL_STATUSES.has(existing.status)) {
    return `Outreach stopped. ${brandName} is ${existing.status}.`;
  }

  if (existing.step >= MAX_STEP) {
    return `Outreach sequence finished for ${brandName} after ${MAX_STEP} touches.`;
  }

  const cooldownEndsAt =
    existing.lastContactedAt.getTime() + FOLLOW_UP_COOLDOWN_MS;

  if (cooldownEndsAt > Date.now()) {
    return `Cooldown active for ${brandName} until ${new Date(cooldownEndsAt).toISOString()}.`;
  }

  return null;
};

const sendEmail = async (draft: EmailDraft, linkUrl: string) => {
  const { html, text } = await renderPartnerOutreachEmail({
    body: draft.body,
    linkUrl,
    senderName: SENDER_NAME,
  });

  try {
    await email.send({
      from: SENDER_ADDRESS,
      html,
      subject: draft.subject,
      text,
      to: draft.to,
    });

    return true;
  } catch {
    return false;
  }
};

const notifyTelegram = async (
  input: SendPartnerOutreachInput,
  step: number,
  emailSent: boolean
) => {
  const contactPhoneLine = input.contactPhone ? ` +${input.contactPhone}` : "";

  const emailLine = emailSent
    ? `Email sent to ${input.contactEmail}`
    : "Email not sent";

  const text = [
    `Partner outreach. ${input.brandName} (step ${step} of ${MAX_STEP})`,
    `Angle. ${ANGLE_CONFIG[input.angle].label}`,
    `Contact. ${input.contactName ?? "Unknown"}${contactPhoneLine}`,
    emailLine,
    "",
    "WhatsApp draft",
    input.whatsappDraft,
  ].join("\n");

  const whatsappButton = input.contactPhone
    ? [
        {
          text: "Send WhatsApp",
          url: `https://wa.me/${input.contactPhone}?text=${encodeURIComponent(input.whatsappDraft)}`,
        },
      ]
    : [];

  const buttons = [
    ...whatsappButton,
    { text: "Website", url: input.websiteUrl },
  ];

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard: buttons.map((b) => [b]) },
        text,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }
  );

  return response.ok;
};

export default defineTool({
  description:
    "Sends one partner outreach touch for a brand. Emails the contact through Cloudflare Email when the address is verified, records the outreach state, and posts a Telegram card with a 1-tap WhatsApp button. Refuses brands that replied, converted, opted out, were contacted in the last 7 days, or already had 3 touches.",
  async execute(input) {
    const config = ANGLE_CONFIG[input.angle];
    const emailDraft = toEmailDraft(input);

    if (!(emailDraft || input.contactPhone)) {
      return {
        error:
          "No deliverable channel. Provide a verified email with subject and body, or a WhatsApp number.",
        sent: false,
      };
    }

    const existing = await db.partnerOutreach.findUnique({
      where: { brandSlug: input.brandSlug },
    });

    const blockReason = getBlockReason(existing, input.brandName);

    if (blockReason) {
      return { error: blockReason, sent: false };
    }

    if (config.requiresListing) {
      const brand = await db.brand.findUnique({
        select: { id: true },
        where: { slug: input.brandSlug },
      });

      if (!brand) {
        return {
          error: `${input.angle} needs a listed brand, but no brand has slug "${input.brandSlug}". Use INVITE_NEW_BRAND or the correct slug.`,
          sent: false,
        };
      }
    }

    const emailSent = emailDraft
      ? await sendEmail(emailDraft, config.linkUrl(input.brandSlug))
      : false;

    if (!(emailSent || input.contactPhone)) {
      return {
        error: "Email delivery failed and no WhatsApp number was provided.",
        sent: false,
      };
    }

    const status: OutreachStatus = emailSent ? "EMAIL_SENT" : "WHATSAPP_QUEUED";
    const step = (existing?.step ?? 0) + 1;

    const outreachData = {
      angle: input.angle,
      brandName: input.brandName,
      contactEmail: input.contactEmail,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      lastContactedAt: new Date(),
      sourceUrls: input.sourceUrls,
      status,
      step,
      websiteUrl: input.websiteUrl,
    };

    await db.partnerOutreach.upsert({
      create: { ...outreachData, brandSlug: input.brandSlug },
      update: outreachData,
      where: { brandSlug: input.brandSlug },
    });

    const telegramNotified = await notifyTelegram(input, step, emailSent);

    return {
      brandSlug: input.brandSlug,
      emailSent,
      sent: true,
      status,
      step,
      telegramNotified,
    };
  },
  inputSchema: sendPartnerOutreachSchema,
});
