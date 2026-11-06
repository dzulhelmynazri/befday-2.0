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

export const scheduleSocialPostSchema = z.object({
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
});

export type ScheduleSocialPostInput = z.infer<typeof scheduleSocialPostSchema>;
