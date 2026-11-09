import { z } from "zod";

export const socialChannelSchema = z.enum([
  "instagram",
  "tiktok",
  "facebook_page",
  "linkedin",
  "threads",
  "pinterest",
  "google_business",
]);

export type SocialChannel = z.infer<typeof socialChannelSchema>;

export const socialThemeSchema = z.enum(["paper", "terracotta", "charcoal"]);

export type SocialTheme = z.infer<typeof socialThemeSchema>;

export const scheduleSocialPostSchema = z.object({
  autoAddMusic: z
    .boolean()
    .default(true)
    .describe(
      "Whether TikTok Photo Mode should automatically attach trending background music (auto_add_music: true)"
    ),
  brandSlugs: z
    .array(z.string())
    .default([])
    .describe(
      "Brand slugs featured in this social post (e.g. ['zus-coffee', 'familymart']) to record lastPostedAt in the database"
    ),
  channels: z
    .array(socialChannelSchema)
    .optional()
    .describe(
      "Target social media channels (e.g. ['instagram', 'tiktok', 'facebook_page', 'linkedin', 'threads', 'pinterest', 'google_business'])"
    ),
  mediaUrls: z
    .array(z.url())
    .default([])
    .describe("Image or media URLs to attach to the post"),
  scheduledAt: z
    .string()
    .optional()
    .describe(
      "ISO 8601 date string for scheduled publication (e.g. '2026-11-10T10:00:00Z')"
    ),
  text: z.string().min(1).describe("The content/copy of the social media post"),
  theme: socialThemeSchema
    .optional()
    .describe(
      "3-column grid color theme used for the post media ('paper', 'terracotta', or 'charcoal') to track grid rotation"
    ),
});

export type ScheduleSocialPostInput = z.infer<typeof scheduleSocialPostSchema>;
