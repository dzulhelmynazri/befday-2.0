import { z } from "zod";

export const blogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export type BlogStatus = z.infer<typeof blogStatusSchema>;

export const upsertBlogPostSchema = z.object({
  content: z
    .string()
    .min(1)
    .describe("Markdown / Comark content for the article"),
  coverImageUrl: z
    .url()
    .optional()
    .describe("Cover image URL for SEO & preview cards"),
  description: z
    .string()
    .min(1)
    .max(300)
    .describe("SEO meta description (<160-300 chars) summarizing the guide"),
  publishedAt: z.coerce
    .date()
    .describe(
      "Publication timestamp (required for SEO chronology and scheduling)"
    ),
  slug: z
    .string()
    .min(1)
    .describe("URL slug (e.g. 'best-birthday-freebies-malaysia-2026')"),
  status: blogStatusSchema.default("DRAFT").describe("Article status"),
  tags: z
    .array(z.string())
    .default([])
    .describe(
      "Categories and SEO keywords (e.g. ['food', 'beverage', 'malaysia'])"
    ),
  title: z
    .string()
    .min(1)
    .max(120)
    .describe(
      "SEO title for the article (e.g. 'Ultimate Guide: 25+ Birthday Freebies & Perks')"
    ),
});

export type UpsertBlogPostInput = z.infer<typeof upsertBlogPostSchema>;

export const blogListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(10),
  search: z.string().optional(),
  status: blogStatusSchema.default("PUBLISHED"),
  tag: z.string().optional(),
});

export type BlogListQueryInput = z.infer<typeof blogListQuerySchema>;

export const blogBySlugQuerySchema = z.object({
  slug: z.string().min(1),
});

export type BlogBySlugQueryInput = z.infer<typeof blogBySlugQuerySchema>;

export const updateBlogStatusSchema = z.object({
  id: z.string().min(1),
  status: blogStatusSchema,
});

export type UpdateBlogStatusInput = z.infer<typeof updateBlogStatusSchema>;
