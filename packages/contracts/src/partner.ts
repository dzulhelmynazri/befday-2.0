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
