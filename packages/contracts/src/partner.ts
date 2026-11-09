import { z } from "zod";

import { perkBadgeSchema } from "./perk";

export const submitPartnerPerkSchema = z.object({
  appStoreUrl: z.url().or(z.literal("")).optional(),
  badge: perkBadgeSchema,
  brandName: z
    .string()
    .min(2, "brand name must be at least 2 characters.")
    .max(80, "brand name cannot exceed 80 characters."),
  contactEmail: z.email("enter a valid email address."),
  contactName: z
    .string()
    .min(2, "contact name must be at least 2 characters.")
    .max(80, "contact name cannot exceed 80 characters."),
  contactPhone: z
    .string()
    .min(7, "phone number must be at least 7 characters.")
    .max(30, "phone number cannot exceed 30 characters."),
  googleMapUrl: z.url().or(z.literal("")).optional(),
  headline: z
    .string()
    .min(5, "headline must be at least 5 characters.")
    .max(120, "headline cannot exceed 120 characters."),
  howToRedeem: z
    .string()
    .min(5, "redemption steps must be at least 5 characters.")
    .max(500, "redemption steps cannot exceed 500 characters."),
  perksList: z
    .string()
    .min(3, "please list at least one perk item.")
    .max(300, "perks list cannot exceed 300 characters."),
  playStoreUrl: z.url().or(z.literal("")).optional(),
  validity: z
    .string()
    .min(2, "validity is required (e.g. birthday month).")
    .max(60, "validity cannot exceed 60 characters."),
  websiteUrl: z.url().or(z.literal("")).optional(),
});

export type SubmitPartnerPerkInput = z.infer<typeof submitPartnerPerkSchema>;

export const outreachAngleSchema = z.enum([
  "CLAIM_LISTING",
  "INVITE_NEW_BRAND",
  "FEATURED_SPONSORSHIP",
]);

export type OutreachAngle = z.infer<typeof outreachAngleSchema>;

export const sendPartnerOutreachSchema = z
  .object({
    angle: outreachAngleSchema.describe(
      "CLAIM_LISTING for brands already listed on befday, INVITE_NEW_BRAND for unlisted brands, FEATURED_SPONSORSHIP for paid placement pitches"
    ),
    brandName: z.string().min(2).max(80).describe("Official brand name"),
    brandSlug: z
      .string()
      .min(2)
      .max(80)
      .describe(
        "Brand slug. Must match the existing Brand.slug for CLAIM_LISTING and FEATURED_SPONSORSHIP"
      ),
    contactEmail: z
      .email()
      .optional()
      .describe("Business contact email found during research"),
    contactName: z
      .string()
      .min(2)
      .max(80)
      .optional()
      .describe("Named contact person, if found"),
    contactPhone: z
      .string()
      .regex(/^\d{9,15}$/u, "digits only with country code, e.g. 60123456789")
      .optional()
      .describe("WhatsApp Business number as digits with country code"),
    emailBody: z
      .string()
      .min(20)
      .max(800)
      .optional()
      .describe(
        "Plain-text email body under 80 words. Separate paragraphs with a blank line. No greeting fluff, no links, no sign-off"
      ),
    emailSubject: z
      .string()
      .min(3)
      .max(60)
      .optional()
      .describe("2 to 4 word lowercase subject line"),
    emailVerified: z
      .boolean()
      .default(false)
      .describe(
        "True only when the email was verified as deliverable. Unverified emails are never sent"
      ),
    sourceUrls: z
      .array(z.url())
      .min(1)
      .describe("Public URLs where the contact details were found"),
    websiteUrl: z.url().describe("Official brand website"),
    whatsappDraft: z
      .string()
      .min(20)
      .max(600)
      .optional()
      .describe("Ready-to-send WhatsApp message in English or Bahasa Malaysia"),
  })
  .refine(
    (data) => {
      const hasEmail = Boolean(
        data.emailVerified &&
        data.contactEmail &&
        data.emailSubject &&
        data.emailBody
      );

      const hasWhatsApp = Boolean(data.contactPhone && data.whatsappDraft);

      return hasEmail || hasWhatsApp;
    },
    {
      message:
        "Provide at least one complete channel: either a verified email with subject and body, or a contact phone with a WhatsApp draft.",
    }
  );

export type SendPartnerOutreachInput = z.infer<
  typeof sendPartnerOutreachSchema
>;
