import { z } from "zod";

export const perkBadgeSchema = z.enum(["FREE", "VOUCHER"]);

export type PerkBadge = z.infer<typeof perkBadgeSchema>;

export const perkStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "EXPIRED",
  "ARCHIVED",
]);

export type PerkStatus = z.infer<typeof perkStatusSchema>;

export const upsertBrandPerkSchema = z.object({
  appStoreUrl: z.url().optional().describe("Apple App Store download URL"),
  badge: perkBadgeSchema
    .default("FREE")
    .describe("Reward badge: FREE or VOUCHER"),
  description: z.string().optional().describe("Short brand description"),
  googleMapUrl: z
    .url()
    .optional()
    .describe("Google Maps location or store locator URL"),
  headline: z
    .string()
    .describe(
      "Engaging card headline, e.g. 'Discover exclusive birthday perks at A&W.'"
    ),
  howToRedeem: z
    .array(z.string())
    .min(1)
    .describe("Step-by-step redemption steps, e.g. ['Via the mobile app']"),
  logoUrl: z.string().url().optional().describe("Brand logo image URL"),
  name: z.string().describe("Brand or merchant name (e.g., A&W)"),
  perksList: z
    .array(z.string())
    .min(1)
    .describe("List of exact perks, e.g. ['Free Root Beer']"),
  playStoreUrl: z.url().optional().describe("Google Play Store download URL"),
  sourceUrls: z
    .array(z.string().url())
    .optional()
    .default([])
    .describe("Sources where this perk information was verified"),
  status: perkStatusSchema.default("DRAFT").describe("Publication status"),
  termsConditions: z
    .string()
    .optional()
    .describe("Summarized terms & conditions or minimum spend details"),
  validity: z
    .string()
    .default("Not specified")
    .describe("Redemption validity window, e.g. 'Birthday month'"),
  websiteUrl: z.string().url().optional().describe("Official website URL"),
});

export type UpsertBrandPerkInput = z.infer<typeof upsertBrandPerkSchema>;

export const perkListQuerySchema = z.object({
  badge: perkBadgeSchema.optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: perkStatusSchema.optional().default("PUBLISHED"),
});

export type PerkListQueryInput = z.infer<typeof perkListQuerySchema>;

export const featuredPerksQuerySchema = z.object({
  limit: z.number().min(1).max(50).default(6),
});

export type FeaturedPerksQueryInput = z.infer<typeof featuredPerksQuerySchema>;

export const perkBySlugQuerySchema = z.object({
  slug: z.string(),
});

export type PerkBySlugQueryInput = z.infer<typeof perkBySlugQuerySchema>;

export const updatePerkStatusSchema = z.object({
  perkId: z.string(),
  status: perkStatusSchema,
});

export type UpdatePerkStatusInput = z.infer<typeof updatePerkStatusSchema>;
